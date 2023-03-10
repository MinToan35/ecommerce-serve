const User = require("../models/user");

const userCtrl = {
  getUsers: async (req, res) => {
    try {
      // Extract the pagination parameters from the query string
      const { page, limit } = req.query;
      const defaultPage = 1;
      const defaultLimit = 20;
      // Parse the pagination values
      const parsedPage = parseInt(page, 10) || defaultPage;
      const parsedLimit = parseInt(limit, 10) || defaultLimit;

      // Find all the users in the database
      const users = await User.find({ role: "user" })
        .select("-password")
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit);

      // Return the found users
      res.json({
        msg: "Get users success",
        users,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { username, avatar, mobile, address, gender } = req.body;

      await User.findOneAndUpdate(
        { _id: req.user._id },
        {
          username,
          avatar,
          mobile,
          address,
          gender,
        }
      );

      res.json({ msg: "Update Success!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) return "Missed Information";
      await User.findByIdAndDelete(id);
      res.json({ msg: "Delete Success!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = userCtrl;
