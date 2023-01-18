const Banner = require("../models/banner");

const bannerCtrl = {
  createBanner: async (req, res) => {
    try {
      const { image, imageMobile, isShow, name } = req.body;
      if (!image || !imageMobile || !isShow || !name)
        return res.status(400).json({ msg: "image, name is required" });

      const banner = new Banner({
        image,
        imageMobile,
        name,
        isShow,
        user: req.user._id,
      });
      await banner.save();
      res.json({ msg: "Create banner success", banner });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  getBanner: async (req, res) => {
    try {
      // Extract the pagination parameters from the query string
      const { page, limit } = req.query;
      const defaultPage = 1;
      const defaultLimit = 20;

      // Parse the pagination values
      const parsedPage = parseInt(page, 10) || defaultPage;
      const parsedLimit = parseInt(limit, 10) || defaultLimit;

      // Find all the users in the database
      const banners = await Banner.find()
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit);

      // Return the found users
      res.json({
        msg: "Get banners success",
        banners,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },

  deleteBanner: async (req, res) => {
    try {
      const { id } = req.params;
      await Banner.findByIdAndDelete(id);
      res.status(200).json({ msg: "Delete Successfully" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = bannerCtrl;
