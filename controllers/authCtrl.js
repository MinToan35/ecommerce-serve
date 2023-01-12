const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

let refreshTokens = [];

const authCtrl = {
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

      const newUser = new User({
        email,
        username,
        password: hashedPassword,
      });
      await newUser.save();
      res.json({ msg: "User registered successfully" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
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

      const refreshTokenIndex = refreshTokens.findIndex(
        (token) => jwt.verify(token, process.env.REFRESH_SECRET).id === user.id
      );
      if (refreshTokenIndex !== -1) {
        // Remove the existing refresh token
        refreshTokens.splice(refreshTokenIndex, 1);
      }

      //create and sign refresh token
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.REFRESH_SECRET,
        {
          expiresIn: "3h",
        }
      );

      refreshTokens.push(refreshToken);

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: 1 * 3 * 60 * 60 * 1000,
        path: "/api_1.0/users/refresh_token",
      });
      //return the request token and access token in the response
      console.log(refreshTokens);

      res.json({
        msg: "Register Success!",
        user: {
          ...user._doc,
          password: "",
        },
        accessToken,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  logout: async (req, res) => {
    try {
      refreshTokens = refreshTokens.filter(
        (token) => token !== req.cookies.refreshToken
      );

      res.clearCookie("refreshToken", { path: "/api_1.0/users/refresh_token" });

      return res.json({ msg: "Logged out!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  generateAccessToken: async (req, res) => {
    try {
      const rf_token = req.cookies.refreshToken;

      if (!rf_token) return res.status(400).json({ msg: "Please login now." });
      //check refreshTokens isvalid
      if (!refreshTokens.includes(rf_token)) {
        return res.status(403).json("Refresh token is not valid");
      }
      jwt.verify(rf_token, process.env.REFRESH_SECRET, async (err, result) => {
        if (err) return res.status(400).json({ msg: "Please login now2." });
        const user = await User.findById(result.id).select("-password");
        if (!user) return res.status(400).json({ msg: "This does not exist." });
        const access_token = jwt.sign(
          { id: user._id },
          process.env.JWT_SECRET,
          {
            expiresIn: "1h",
          }
        );

        console.log(refreshTokens);

        res.json({
          access_token,
          user,
        });
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = authCtrl;
