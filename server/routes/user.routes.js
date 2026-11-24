const express = require("express");
const userController = require("../controllers/user.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();
router.use(authenticate);

router.get("/profile", userController.getOwnProfile);
router.put("/profile", userController.updateOwnProfile);
router.delete("/profile", userController.deactivateOwnAccount);

module.exports = router;
