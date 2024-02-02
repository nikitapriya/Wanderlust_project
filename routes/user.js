const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/user.js");

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router
  .route("/signup")
  .get(userController.renderSignUpForm)
  .post(wrapAsync(userController.signUp));

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router
  .route("/login")
  .get(userController.renderLogInForm)
  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.logIn
  );

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.get("/logout", userController.logOut);

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = router;
