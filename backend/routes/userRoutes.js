const express = require("express");
const router = express.Router();

const { getUsers, deleteUser } = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

router.get("/", protect, adminOnly, getUsers);

router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;
