const User = require("../models/user.js");

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const signUp = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    let RegisteredUser = await User.register(newUser, password);
    console.log(RegisteredUser);
    req.login(RegisteredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const renderSignUpForm = (req, res) => {
  res.render("users/signup.ejs");
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const renderLogInForm = (req, res) => {
  res.render("users/login.ejs");
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const logIn = async (req, res) => {
  req.flash("success", "Welcome back to Wanderlust");
  let redirectUrl = res.locals.redirectUrl || "/listings";
  res.redirect(redirectUrl);
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const logOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "You are logged out");
    res.redirect("/listings");
  });
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = { signUp, renderSignUpForm, renderLogInForm, logIn, logOut };
