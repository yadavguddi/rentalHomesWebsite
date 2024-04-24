const express = require("express");
const app = express();
const mongoose = require("mongoose");
let port = 8080;
const Listing = require ("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils");

main()
.then(() => {
    console.log("connected to DB")
})
.catch((err) =>{
console.log(err)
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Wandelust')
}


 app.listen(port,() => {
    console.log(`I am listening at port ${port}`)
 });

app.get("/",(req,res) => {
    res.send("Working")
});

app.set("view engine","ejs");
app.set("views",path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate)
app.use(express.static(path.join(__dirname,"/public")));

app.get("/testListing" , async (req,res) => {
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
});

app.get("/listings" , async(req,res) => {
   const allListings = await Listing.find({});
   res.render("./listings/index.ejs",{allListings});
});

//new Route
app.get("/listings/new", (req,res) => {
    res.render("listings/new.ejs");
    });

    //show route
app.get("/listings/:id", async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs" ,{listing});
});

 app.post("/listings", wrapAsync(async (req,res) => { 
    
    // let {title,description,image,price,country,location} = req.body
    // const newListing = new Listing({
    //     title,
    //     description,
    //     image,
    //     price,
    //     country,
    //     location
    // });

    // // Save the new listing to the database
    // await newListing.save();

    let newlisting =new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
}));

//edit route
app.get("/listings/:id/edit", async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs" ,{listing});
});

//update route
app.put("/listings/:id",async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
})

//DELETE ROUTE
app.delete("/listings/:id", async (req,res) => {
let {id} = req.params;
 let deleted = await Listing.findByIdAndDelete(id);
 console.log(deleted);
 res.redirect("/listings")
});
console.log(Listing.image);

//error handling middleware

app.set((err,req,res,next) => {
   res.send("something went wrong")
})