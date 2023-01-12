const User = require("../models/user");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").split(" ")[1];
    if (!token)
      return res.status(400).json({
        msg: "Please login now.",
      });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded)
      return res.status(400).json({ msg: "Invalid Authentication." });

    const user = await User.findOne({ _id: decoded.id });

    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

const checkAdmin = (req, res, next) => {
  try {
    auth(req, res, () => {
      if (req.user.role !== "admin")
        return res
          .status(401)
          .json({ msg: "Access denied, admin role is required." });
      next();
    });
  } catch (error) {
    return res.status(500).json({ msg: error.message });
  }
};

module.exports = {
  auth,
  checkAdmin,
};
