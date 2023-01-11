const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // check if request body contains email, username and password
      if (!email || !password)
        return res
          .status(400)
          .json({ error: "Email, and password are required" });

      // Check the email is exist
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      //Check password
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Invalid email or password" });
      }

      //create and sign request token
      const accessToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      //create and sign refresh token
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_SECRET,
        {
          expiresIn: "33",
        }
      );

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 1 * 3 * 60 * 60 * 1000,
        path: "/api_1.0/users/refresh_token",
      });

      //return the request token and access token in the response
      res.json({
        msg: "Register Success!",
        user: {
          ...user._doc,
          password: "",
        },
        accessToken,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json("Server error");
    }
  },
};

module.exports = userCtrl;
