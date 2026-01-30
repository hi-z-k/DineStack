const productController = require("../controllers/productController");
const protect = require("../utils/authMiddleware");
const getRequestBody = require("../utils/bodyParser");

const productRoutes = async (req, res, pathname, method) => {
  if (pathname === "/api/products" && method === "GET") {
    return productController.getAllProducts(req, res);
  } else if (pathname === "/api/products" && method === "POST") {
    return protect(req, res, async () => {
        if (req.user.role !== "admin") {
            res.writeHead(403);
            return res.end(JSON.stringify({ error: "Unauthorized" }));
        }
        const body = await getRequestBody(req);
        return productController.createProduct(req, res, body);
    });
  } 
  else if (pathname.startsWith("/api/products/") && method === "DELETE") {
    return protect(req, res, async () => {
      if (req.user.role !== "admin") {
        res.writeHead(403);
        return res.end(JSON.stringify({ error: "Unauthorized" }));
      }
      const productId = pathname.split("/").pop(); 
      return productController.deleteProduct(req, res, productId);
    });
  }
  else if (pathname === "/api/products/update" && method === "PUT") {
    return protect(req, res, async () => {
        if (req.user.role !== "admin") {
            res.writeHead(403);
            return res.end(JSON.stringify({ error: "Unauthorized" }));
        }
        const body = await getRequestBody(req);
        return productController.updateProduct(req, res, body);
    });
  }
  return "not_found";
};

module.exports = productRoutes;