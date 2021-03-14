const express = require("express");
const {
  apiAuth,
  isAdmin,
  isSignedIn,
  isAuthenticated,
} = require("../controllers/auth");
const {
  addEmailSubscriber,
  getAllSubscribers,
} = require("../controllers/emailsubscriber");
const { getUserById } = require("../controllers/user");
const router = express.Router();

router.param("userId", getUserById);

// Add to Email Newsletter
router.post("/emailsubscriber", apiAuth, addEmailSubscriber);
router.get(
  "/emailsubscribers/:userId",
  apiAuth,
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getAllSubscribers
);

module.exports = router;
