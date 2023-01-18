const router = require("express").Router();
const bannerCtrl = require("../controllers/bannerCtrl");
const { auth, checkAdmin } = require("../middleware/auth");

router.post("/", checkAdmin, bannerCtrl.createBanner);
router.get("/", auth, bannerCtrl.getBanner);
router.delete("/:id", checkAdmin, bannerCtrl.deleteBanner);
module.exports = router;
