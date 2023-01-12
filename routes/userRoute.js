const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");
const { auth, checkAdmin } = require("../middleware/auth");

router.get("/", checkAdmin, userCtrl.getUsers);

module.exports = router;
