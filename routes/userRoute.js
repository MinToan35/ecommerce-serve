const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");

router.get("/", userCtrl.getUsers);

module.exports = router;
