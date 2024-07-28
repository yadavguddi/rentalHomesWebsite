
if(process.env.NODE_ENV != "PRODUCTION"){
    require('dotenv').config();  
}

// console.log(process.env.SECRET);

const express = require("express");
const app = express();
const mongoose = require("mongoose");
let port = 8080;
const Listing = require ("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js")
const Review = require("./models/review.js")
const {listingSchema ,reviewSchema} = require("./schema.js")
const Joi = require('joi');
const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const UserRouter = require("./routes/user.js");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const multer = require("multer")
const dbUrls = "mongodb+srv://guddi98922:ipRiFDTRvXEmqSdg@project.uo8weuf.mongodb.net/?retryWrites=true&w=majority&appName=project";
const localmongo = "mongodb://127.0.0.1:27017/wanderlust";
main()
.then(() => {
    console.log("connected to DB")
})
.catch((err) =>{
console.log(err)
});

async function main() {
    await mongoose.connect(dbUrls);
}


 app.listen(port,() => {
    console.log(`I am listening at port ${port}`)
 });



app.set("view engine","ejs");
app.set("views",path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate)
app.use(express.static(path.join(__dirname,"/public")));


const store = MongoStore.create({
    mongoUrl :dbUrls,
    crypto:{
        secret: "mysupersecretcode",
    },
    touchAfter : 24*3600,
});
store.on("error",()=>{
    console.log("ERROR IN MONGO SESSION STORE");
})
const sessionOptions = {
    store,
    secret:"mysupersecrectcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires: Date.now() + 7 * 24 * 60 * 60 *1000,
        maxAge:7 * 24 * 60 * 60 *1000,
        httpOnly:true,
    }
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/testListing" , wrapAsync(async (req,res) => {
    let sampleListing = new Listing ({
        title:"My new Villa",
        description : "My new Villa",
        image:"https://unsplash.com/photos/white-and-grey-concrete-building-near-swimming-pool-under-clear-sky-during-daytime-2d4lAQAlbDA",
        price:1200,
        location:"Mumbai",
        country:"India"
    });
    await sampleListing.save();
    console.log("sample was saved")
    res.send("sucesfully saved")
}));

app.use((req,res,next) =>{
    res.locals.success
 = req.flash("success");
 res.locals.error
 = req.flash("error");
 res.locals.currUser = req.user;
 next();


})

// app.get("/demouser" ,async(req,res) =>{
//     let fakeuser = new User({
//         email:"student@gmail.com",
//         username:"student123",
//     })
//   let regestereduser = await  User.register(fakeuser,"helloworld");
//   res.send(regestereduser);
// })

app.use("/listings", listingsRouter);

app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",UserRouter);

//error handling middleware
app.all("*",(req,res,next) => {
    next(new ExpressError(404,"Page not found"));
})
app.use((err,req,res,next) => {
    let{statusCode=500,message="something went wrong"} = err;
    res.status(statusCode).render("error.ejs",{err})
    // res.status(statusCode).send(message);
   
})

