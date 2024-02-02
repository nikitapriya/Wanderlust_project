const Listing = require("./models/listing.js");
const Review = require("./models/reviews.js");
const ExpressError = require("./utils/expressError.js");
const { listingSchema, reviewSchema } = require("./schema.js");

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const Login = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    req.flash("error", "You should must login to create listings");
    return res.redirect("/login");
  }
  next();
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const validateListing = (req, res, next) => {
  // console.log(listingSchema.validate(req.body))
  let { error } = listingSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    return next(new ExpressError(404, errMsg));
  } else {
    next();
  }
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
    return next(new ExpressError(404, errMsg));
  } else {
    next();
  }
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const isOwner = async (req, res, next) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  if (!listing.owner._id.equals(res.locals.currUser._id)) {
    req.flash("error", "You don't have permission to edit!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const isReviewAuthor = async (req, res, next) => {
  let { id, reviewId } = req.params;
  let review = await Review.findById(reviewId);
  if (
    res.locals.currUser &&
    !review.author._id.equals(res.locals.currUser._id)
  ) {
    req.flash("error", "You are not the author of this review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = {
  Login,
  saveRedirectUrl,
  isOwner,
  isReviewAuthor,
  validateListing,
  validateReview,
};
