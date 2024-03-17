let mongoose = require("mongoose");
const Schema = mongoose.Schema;
const listingSchema = new Schema ({
    title :{
    type:String, 
    required:true
    },
    description:String,
    image:{
    type:String,
    default:"https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?cs=srgb&dl=pexels-binyamin-mellish-186077.jpg&fm=jpg",
    set: (v) => v === "" ? "https://images.pexels.com/photos/186077/pexels-photo-186077.jpeg?cs=srgb&dl=pexels-binyamin-mellish-186077.jpg&fm=jpg" : v,
    },
    price:Number,
    location:String,
    country:String,
});
const Listing = mongoose.model("Listing",listingSchema);
module.exports = Listing;