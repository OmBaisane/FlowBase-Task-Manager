const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");

const {
  getUsers,
  deleteUser,
  updateUserRole,
} = require("../controllers/userController");

router.get("/", protect, adminOnly, getUsers);
router.delete("/:id", protect, adminOnly, deleteUser);
router.put("/:id/role", protect, adminOnly, updateUserRole);

module.exports = router;