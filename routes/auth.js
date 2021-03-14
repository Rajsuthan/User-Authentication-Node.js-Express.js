const express = require("express");
const router = express.Router();
const { check } = require("express-validator");
const { reset } = require("nodemon");
const {
  signup,
  signin,
  signout,
  apiAuth,
  sendVerificationCode,
  resetPassword,
} = require("../controllers/auth");

router.post(
  "/signup",
  apiAuth,
  [
    check("firstname", "Firstname should be atleast 3 characters").isLength({
      min: 3,
    }),
    check("lastname", "Lastname should be atleast 3 characters").isLength({
      min: 3,
    }),
    check("email", "Email should be valid").isEmail(),
    check("password", "Password should be atleast 6 characters").isLength({
      min: 6,
    }),
  ],
  signup
);

router.post(
  "/signin",
  apiAuth,
  [
    check("email", "Email should be valid").isEmail(),
    check("password", "Password should be atleast 6 characters").isLength({
      min: 6,
    }),
  ],
  signin
);

router.put("/sendverificationcode", apiAuth, sendVerificationCode);
router.put("/resetpassword", apiAuth, resetPassword);

router.get("/signout", apiAuth, signout);

module.exports = router;

router.post;
