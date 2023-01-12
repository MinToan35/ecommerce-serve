const router = require("express").Router();
const userCtrl = require("../controllers/userCtrl");
const { auth, checkAdmin } = require("../middleware/auth");

router.get("/", checkAdmin, userCtrl.getUsers);
router.put("/", auth, userCtrl.updateUser);
router.delete("/:id", checkAdmin, userCtrl.deleteUser);

module.exports = router;
