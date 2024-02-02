const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const reviewController = require("../controllers/review.js");
const { Login, isReviewAuthor, validateReview } = require("../middleware.js");

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//reviews/post route
router.post(
  "/",
  Login,
  validateReview,
  wrapAsync(reviewController.createReview)
);

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//reviews/delete route
router.delete(
  "/:reviewId",
  Login,
  isReviewAuthor,
  wrapAsync(reviewController.destroyReview)
);

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = router;
