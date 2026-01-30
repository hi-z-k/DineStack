require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => console.error("MongoDB Connection Error:", err));

const server = http.createServer(async (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:5173"); 
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;
  const method = req.method;

  console.log(`Incoming Request: ${method} ${pathname}`);

  if (pathname === "/" && method === "GET") {
    res.writeHead(200);
    return res.end(JSON.stringify({ message: "Welcome to the Restaurant API" }));
  }

  // Surgical execution: If it returns anything other than "not_found", it's done.
  const prodRes = await productRoutes(req, res, pathname, method);
  if (prodRes !== "not_found") return prodRes;

  const userRes = await userRoutes(req, res, pathname, method);
  if (userRes !== "not_found") return userRes;

  const orderRes = await orderRoutes(req, res, pathname, method);
  if (orderRes !== "not_found") return orderRes;

  res.writeHead(404);
  res.end(JSON.stringify({ error: `Route ${pathname} not found` }));
});

const io = new Server(server, {
  cors: { origin: "http://localhost:5173", methods: ["GET", "POST"] },
});

io.on("connection", (socket) => {
  console.log("⚡ User connected:", socket.id);
  socket.on("newOrderPlaced", (order) => socket.broadcast.emit("fetchAdminOrders", order));
  socket.on("joinOrder", (orderId) => { socket.join(orderId); console.log(`User joined room: ${orderId}`); });
  socket.on('orderCancelled', (orderId) => { io.emit('orderDeleted', orderId); });
  socket.on("disconnect", () => { console.log("User disconnected"); });
});

global.io = io;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));