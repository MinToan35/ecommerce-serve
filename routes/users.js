const router = require("express").Router();
const userCtrl = require("../controllers/users");

router.post("/register", userCtrl.register);
router.post("/login", userCtrl.login);

module.exports = router;
