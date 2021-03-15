const express = require("express");
const {
  isSignedIn,
  isAuthenticated,
  isAdmin,
  apiAuth,
  contactEmail,
} = require("../controllers/auth");
const {
  getUserById,
  getUser,
  updateUser,
  getAllUsers,
  deleteUser,
  getDataUserByName,
  getUserByName,
  updateSocial,
} = require("../controllers/user");
const router = express();

router.param("userId", getUserById);
router.param("name", getUserByName);

router.get("/user/:userId", apiAuth, isSignedIn, isAuthenticated, getUser);
router.get("/user/name/:name", apiAuth, getDataUserByName);
router.put("/user/:userId", apiAuth, isSignedIn, isAuthenticated, updateUser);
router.get(
  "/users/:userId",
  apiAuth,
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getAllUsers
);
router.delete(
  "/user/:userId",
  apiAuth,
  isSignedIn,
  isAuthenticated,
  deleteUser
);

// Contact us email
router.post("/sendemail", apiAuth, contactEmail);

module.exports = router;
