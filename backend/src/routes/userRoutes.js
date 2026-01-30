const userController = require("../controllers/userController");
const protect = require("../utils/authMiddleware");
const getRequestBody = require("../utils/bodyParser");

const userRoutes = async (req, res, pathname, method) => {
  if (pathname === "/api/register" && method === "POST") {
    const body = await getRequestBody(req);
    return userController.register(req, res, body);
  } else if (pathname === "/api/login" && method === "POST") {
    const body = await getRequestBody(req);
    return userController.login(req, res, body);
  } else if (pathname === "/api/users/me" && method === "GET") {
    return protect(req, res, () => userController.getMe(req, res));
  } 
  else if (pathname.startsWith('/api/users/') && method === 'PUT') {
    return protect(req, res, async () => {
        const userId = pathname.split('/').pop(); 
        if (req.user.id !== userId && req.user.role !== "admin") {
            res.writeHead(403);
            return res.end(JSON.stringify({ error: "Unauthorized to update this profile" }));
        }
        const body = await getRequestBody(req);
        return userController.updateProfile(req, res, userId, body);
    });
  }
  else if (pathname === "/api/users" && method === "GET") {
    return protect(req, res, () => {
      if (req.user.role !== "admin") {
        res.writeHead(403);
        return res.end(JSON.stringify({ error: "Admin only" }));
      }
      return userController.getAllUsers(req, res); 
    });
  } else if (pathname.startsWith("/api/users/delete/") && method === "DELETE") {
    return protect(req, res, async () => {
      if (req.user.role !== "admin") {
        res.writeHead(403);
        return res.end(JSON.stringify({ error: "Unauthorized" }));
      }
      const userId = pathname.split("/").pop();
      return userController.deleteUser(req, res, userId); 
    });
  }
  return "not_found";
};

module.exports = userRoutes;