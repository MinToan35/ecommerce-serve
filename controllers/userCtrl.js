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
      const users = await User.find()
        .select("-password")
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit);
      // Return the found users
      res.json(users);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = userCtrl;
