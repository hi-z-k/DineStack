const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const sendResponse = (res, status, data) => {
  res.writeHead(status);
  res.end(JSON.stringify(data));
};

const userController = {
  getMe: async (req, res) => {
    try {
      const user = await User.findById(req.user.id).select("-password");
      if (!user) return sendResponse(res, 404, { error: "User not found" });
      sendResponse(res, 200, user);
    } catch (error) {
      sendResponse(res, 500, { error: "Server error" });
    }
  },

  register: async (req, res, body) => {
    try {
      const { name, email, password, role } = body;

      if (!name || !email || !password) {
        return sendResponse(res, 400, { error: "Please provide all fields" });
      }

      const userExists = await User.findOne({ email });
      if (userExists) {
        return sendResponse(res, 400, { error: "User already exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        name: name.replace(/<[^>]*>?/gm, ""),
        email,
        password: hashedPassword,
        role: role || "customer",
      });

      await newUser.save();
      sendResponse(res, 201, { message: "User registered successfully" });
    } catch (error) {
      sendResponse(res, 500, { error: "Registration failed" });
    }
  },

  login: async (req, res, body) => {
    try {
      const { email, password } = body;
      const user = await User.findOne({ email });

      if (!user || !(await bcrypt.compare(password, user.password))) {
        return sendResponse(res, 401, { error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      const userResponse = user.toObject();
      delete userResponse.password;

      sendResponse(res, 200, { token, user: userResponse });
    } catch (error) {
      sendResponse(res, 500, { error: "Login failed" });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({}).select("-password");
      sendResponse(res, 200, users);
    } catch (error) {
      sendResponse(res, 500, { error: "Failed to fetch users" });
    }
  },

  deleteUser: async (req, res, userId) => {
    try {
      const deleted = await User.findByIdAndDelete(userId);
      if (!deleted) return sendResponse(res, 404, { error: "User not found" });
      sendResponse(res, 200, { message: "User deleted successfully" });
    } catch (error) {
      sendResponse(res, 500, { error: "Delete failed" });
    }
  },

  updateProfile: async (req, res, userId, body) => {
    try {
      const { name, email, password, profilePic } = body;
      const user = await User.findById(userId);

      if (!user) return sendResponse(res, 404, { error: "User not found." });

      if (name) user.name = name;
      if (email) user.email = email;
      if (profilePic) user.profilePic = profilePic;

      if (password && password.trim() !== "") {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
      }

      await user.save();
      const updatedUser = user.toObject();
      delete updatedUser.password;

      sendResponse(res, 200, updatedUser);
    } catch (error) {
      sendResponse(res, 500, { error: "Failed to update profile." });
    }
  },
};

module.exports = userController;