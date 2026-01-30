const Product = require("../models/Product");

// Helper for consistent JSON responses
const sendResponse = (res, status, data) => {
  res.writeHead(status);
  res.end(JSON.stringify(data));
};

const productController = {
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 });
      sendResponse(res, 200, products);
    } catch (error) {
      sendResponse(res, 500, { error: "Server Error" });
    }
  },

  createProduct: async (req, res, body) => {
    try {
      const { name, description, price, category, image } = body;

      // Dynamic Default Image if none provided
      const finalImage =
        image ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=f97316&color=fff&size=512`;

      const newProduct = new Product({
        name,
        description,
        price: parseFloat(price),
        category,
        image: finalImage,
      });

      await newProduct.save();

      // Real-time update for the menu
      if (global.io) global.io.emit("menuUpdated");

      sendResponse(res, 201, newProduct);
    } catch (error) {
      sendResponse(res, 500, { error: "Creation failed" });
    }
  },

  updateProduct: async (req, res, body) => {
    try {
      const { id, name, description, price, category, image, isAvailable } = body;
      const updateData = { name, description, price, category, isAvailable };
      
      if (image) updateData.image = image; 

      const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });

      if (!updatedProduct) {
        return sendResponse(res, 404, { error: "Product not found" });
      }

      if (global.io) global.io.emit("menuUpdated");

      sendResponse(res, 200, updatedProduct);
    } catch (error) {
      sendResponse(res, 500, { error: "Update failed" });
    }
  },

  deleteProduct: async (req, res, productId) => {
    try {
      const deletedProduct = await Product.findByIdAndDelete(productId);
      if (!deletedProduct) {
        return sendResponse(res, 404, { error: "Product not found" });
      }

      // Notify frontend that an item is gone
      if (global.io) global.io.emit("menuUpdated");

      sendResponse(res, 200, { message: "Product deleted" });
    } catch (error) {
      sendResponse(res, 500, { error: "Delete failed" });
    }
  },
};

module.exports = productController;