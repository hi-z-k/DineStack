const Order = require("../models/Order");
const Product = require("../models/Product");

const sendResponse = (res, status, data) => {
  res.writeHead(status);
  res.end(JSON.stringify(data));
};

const orderController = {
  createOrder: async (req, res, body) => {
    try {
      const { items, deliveryAddress } = body;
      const userId = req.user.id;

      if (!items || items.length === 0) {
        return sendResponse(res, 400, { error: "Cart is empty" });
      }

      const productIds = items.map(item => item.product);
      const products = await Product.find({ _id: { $in: productIds } });

      let totalAmount = 0;
      items.forEach(item => {
        const product = products.find(p => p._id.toString() === item.product);
        if (product) {
          totalAmount += product.price * item.quantity;
        }
      });

      const newOrder = new Order({
        user: userId,
        items,
        totalAmount,
        deliveryAddress,
        status: "pending",
        orderedAt: new Date()
      });

      await newOrder.save();
      sendResponse(res, 201, newOrder);
    } catch (error) {
      sendResponse(res, 500, { error: "Failed to place order" });
    }
  },

  getOrders: async (req, res) => {
    try {
      let orders;
      if (req.user.role === "admin") {
        orders = await Order.find()
          .populate("user", "name email")
          .populate("items.product");
      } else {
        orders = await Order.find({ user: req.user.id })
          .populate("items.product");
      }
      sendResponse(res, 200, orders);
    } catch (error) {
      sendResponse(res, 500, { error: "Could not fetch orders" });
    }
  },

  updateStatus: async (req, res, body) => {
    try {
      const { orderId, status } = body;
      if (!orderId || !status) {
        return sendResponse(res, 400, { error: "Missing orderId or status" });
      }

      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status },
        { new: true }
      )
      .populate("user", "name email")
      .populate("items.product");

      if (!updatedOrder) return sendResponse(res, 404, { error: "Order not found" });


      if (global.io) {
        global.io.emit("statusUpdated", updatedOrder);
        global.io.to(orderId).emit("statusUpdated", updatedOrder);
      }

      sendResponse(res, 200, updatedOrder);
    } catch (error) {
      sendResponse(res, 500, { error: "Update failed" });
    }
  },

  deleteOrder: async (req, res, orderId) => {
    try {
      const order = await Order.findById(orderId);
      if (!order) return sendResponse(res, 404, { error: "Order not found" });

      if (req.user.role !== "admin") {
        if (order.user.toString() !== req.user.id) {
          return sendResponse(res, 403, { error: "Unauthorized" });
        }
        if (order.status !== "pending") {
          return sendResponse(res, 400, { error: "Cannot cancel order once preparation has started" });
        }
      }

      await Order.findByIdAndDelete(orderId);
      sendResponse(res, 200, { message: "Order deleted successfully", orderId });
    } catch (error) {
      sendResponse(res, 500, { error: "Failed to delete order" });
    }
  },

  getStats: async (req, res) => {
    try {
      const summary = await Order.aggregate([
        { $match: { status: { $ne: "cancelled" } } },
        { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" }, totalOrders: { $sum: 1 } } }
      ]);

      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const dailySales = await Order.aggregate([
        { $match: { orderedAt: { $gte: sevenDaysAgo }, status: "delivered" } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$orderedAt" } },
            total: { $sum: "$totalAmount" }
          }
        },
        { $sort: { "_id": 1 } }
      ]);

      const topItemAgg = await Order.aggregate([
        { $match: { status: "delivered" } },
        { $unwind: "$items" },
        { $group: { _id: "$items.product", count: { $sum: "$items.quantity" } } },
        { $sort: { count: -1 } },
        { $limit: 1 }
      ]);

      let topItemName = "No Sales Yet";
      if (topItemAgg.length > 0 && topItemAgg[0]._id) {
        const p = await Product.findById(topItemAgg[0]._id);
        topItemName = p ? p.name : "Unknown Product";
      }

      sendResponse(res, 200, {
        summary: summary[0] || { totalRevenue: 0, totalOrders: 0 },
        dailySales,
        topItem: topItemName,
        activeCouriers: 4,
        peakHour: "07:30 PM"
      });
    } catch (e) {
      sendResponse(res, 500, { error: "Aggregation Failed", details: e.message });
    }
  },
};

module.exports = orderController;