const User = require("../models/user");
const bcrypt = require("bcrypt");

const userCtrl = {
  register: async (req, res) => {
    const { email, username, password } = req.body;

    try {
      // check if request body contains email, username and password
      if (!email || !username || !password) {
        return res
          .status(400)
          .json({ error: "Email, username, and password are required" });
      }

      // check if email is unique
      const emailExists = await User.findOne({ email: req.body.email });
      if (emailExists) {
        return res.status(400).json({ error: "Email already exists" });
      }

      // check if password is at least 6 characters long
      if (password.length < 6) {
        return res
          .status(400)
          .json({ error: "Password must be at least 6 characters long" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({ email, username, password: hashedPassword });
      await newUser.save();
      res.json({ msg: "User registered successfully" });
    } catch (error) {
      console.log(error.message);
      res.status(500).json("Server error");
    }
  },
};

module.exports = userCtrl;
