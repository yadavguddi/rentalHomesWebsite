const Listing  = require("../models/listing.js")

module.exports.index =  async(req,res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs",{allListings});
 }

 module.exports.renderNewForm =  (req,res) => {
    console.log(req.user);
   
     res.render("listings/new.ejs");
     }

   module.exports.showListing=  async (req,res) => {
     let {id} = req.params;
     const listing = await Listing.findById(id).populate({path:"reviews",populate:{
        path:"author",
     },})
     .populate("owner");
     if(!listing){
        req.flash("error","Listing you requested does not exist")
        res.redirect("/listings")
     }
     res.render("listings/show.ejs" ,{listing});
     console.log(listing);
 }

 module.exports.showNewForm = async (req,res) => { 
    
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
// if(!req.body.listing){
//     throw new ExpressError(400,"Send valid data")
// }

    let newlisting =new Listing(req.body.listing);
    newlisting.owner = req.user._id;
    await newlisting.save();
    req.flash("success","New Listing created!")
    res.redirect("/listings");
}

module.exports.editForm = async (req,res) => {
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing you requested does not exist")
        res.redirect("/listings")
     }
    req.flash("success","Listing Edited!")
    res.render("listings/edit.ejs" ,{listing});
}

module.exports.updateForm =async (req,res) => {
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated!")
    res.redirect(`/listings/${id}`);
}

module.exports.deleteForm = async (req,res) => {
    let {id} = req.params;
     let deleted = await Listing.findByIdAndDelete(id);
     console.log(deleted);
     req.flash("success","Listing Deleted !")
     res.redirect("/listings")
    }