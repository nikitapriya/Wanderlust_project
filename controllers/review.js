const Review = require("../models/reviews.js");
const Listing = require("../models/listing.js");

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const createReview = async (req, res) => {
  let { id } = req.params;
  let listing = await Listing.findById(id);
  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;
  listing.reviews.push(newReview);
  await newReview.save();
  await listing.save();
  req.flash("success", "New Review Is Created!");
  res.redirect(`/listings/${listing._id}`);
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const destroyReview = async (req, res) => {
  let { id, reviewId } = req.params;
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash("success", "Review Is Deleted!");
  res.redirect(`/listings/${id}`);
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = {
  createReview,
  destroyReview,
};
