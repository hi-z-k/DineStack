const orderController = require("../controllers/orderController");
const protect = require("../utils/authMiddleware");
const getRequestBody = require("../utils/bodyParser");

const orderRoutes = async (req, res, pathname, method) => {
  if (pathname === "/api/orders" && method === "POST") {
    return protect(req, res, async () => { // Added return here to match product style
      const body = await getRequestBody(req);
      return orderController.createOrder(req, res, body);
    });
  } else if (pathname === "/api/orders" && method === "GET") {
    return protect(req, res, () => orderController.getOrders(req, res));
  } else if (pathname === "/api/orders/status" && method === "PUT") {
    return protect(req, res, async () => {
      if (req.user.role !== "admin" && req.user.role !== "driver") {
        res.writeHead(403);
        return res.end(JSON.stringify({ error: "Unauthorized" }));
      }
      const body = await getRequestBody(req);
      return orderController.updateStatus(req, res, body);
    });
  } else if (pathname === "/api/admin/stats" && method === "GET") {
    return protect(req, res, () => {
      if (req.user.role !== "admin") {
        res.writeHead(403);
        return res.end(JSON.stringify({ error: "Admin access only" }));
      }
      return orderController.getStats(req, res);
    });
  } else if (pathname.startsWith("/api/orders/") && method === "DELETE") {
    return protect(req, res, async () => {
        const orderId = pathname.split("/").pop();
        return orderController.deleteOrder(req, res, orderId);
    });
  }
  return "not_found";
};

module.exports = orderRoutes;