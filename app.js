if (process.env.NODE_ENV != "production"){
  require('dotenv').config()
}
const express = require("express");
const app = express();
const path = require("path");
const ExpressError = require("./utils/expressError.js");
const methodoverride = require("method-override");
const engine = require("ejs-mate");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
//const mongoURL = "mongodb://127.0.0.1:27017/wanderlust"
const dbURL = process.env.ATLASDB_url;
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
main()
  .then(() => {
    console.log("connect");
  })
  .catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbURL);
}

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.engine("ejs", engine);
app.use(methodoverride("_method"));

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const store = MongoStore.create({
  mongoUrl: dbURL,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter: 24*3600,
})

store.on("error",()=>{
  console.log("ERROR is mongo session store",err);
})
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
const sessionOption = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.use(session(sessionOption));
app.use(flash());

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
});


//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// app.get("/demouser",async(req,res)=>{
// let fakeUser = new User({
//   email: "student@gmail.com",
//   username: "nikita"
// })
// let RegisteredUser = await User.register(fakeUser,"HELLOWORLD");
// res.send(RegisteredUser)
// })
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.use("/listings", listingsRouter);
app.use("/listings/:id/reviews", reviewsRouter);
app.use("/", userRouter);

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.get("/", (req, res) => {
  res.render("listings/home.ejs");
});

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "something went wrong!" } = err;
  res.status(statusCode).render("listings/error.ejs", { message });
});

//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
app.listen(3000, () => {
  console.log("app is working");
});
