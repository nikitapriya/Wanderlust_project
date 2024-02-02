const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const { Login, isOwner, validateListing } = require("../middleware.js");
const listingController = require("../controllers/listing.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router
  .route("/")
  // index route
  .get(wrapAsync(listingController.index))
  //create route
  .post(
    Login,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.createListing)
  );

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//new route
router.get("/new", Login, listingController.renderNewForm);

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router
  .route("/:id")
  //show route
  .get(wrapAsync(listingController.showListing))
  //update route
  .put(
    Login,
    isOwner,
    upload.single("listing[image]"),
    validateListing,
    wrapAsync(listingController.updateListing)
  )
  //delete ROUT
  .delete(Login, isOwner, wrapAsync(listingController.destroyListing));

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//edit route
router.get(
  "/:id/edit",
  Login,
  isOwner,
  wrapAsync(listingController.renderEditForm)
);

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.get("/search",wrapAsync(listingController.rendersearchlocation))

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = router;
