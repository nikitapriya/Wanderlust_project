const mongoose = require("mongoose");
const schema = mongoose.Schema;
const Review = require("./reviews")

let defaultLink =
  "https://images.unsplash.com/photo-1571896349842-33c89424de2d?q=80&w=1780&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const listingSchema = new schema({
  title: String,
  description: String,
  image: {
    url: String,
    filename: String,
  },
  price: Number,
  location: String,
  country: String,
  reviews: [
    {
      type: schema.Types.ObjectId,
      ref: "Review",
    },
  ],
  owner: {
  type: schema.Types.ObjectId,
    ref: "User",
  },
  geometry: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
  },
});

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
listingSchema.post("findOneAndDelete" , async(listing) =>{
  if (listing){
    await Review.deleteMany({_id : {$in: listing.reviews}})
  }
})
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const Listing = mongoose.model("Listing", listingSchema);

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = Listing;
