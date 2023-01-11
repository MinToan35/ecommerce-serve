const router = require("express").Router();
const userCtrl = require("../controllers/users");

router.post("/register", userCtrl.register);

module.exports = router;
