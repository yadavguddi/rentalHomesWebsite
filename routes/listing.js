const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require ("../models/listing.js");
const {isLoggedIn,isOwner,validateListing} = require("../middleware.js");
const listingcontroller = require("../controllers/listing.js");
const multer  = require('multer');
const {storage} =require("../cloudConfig.js")
const upload = multer({ storage })


router
.route("/")
.get(wrapAsync(listingcontroller.index))
// .post( validateListing,isLoggedIn,wrapAsync(listingcontroller.showNewForm));
.post(upload.single("listing[image]"),(req,res) =>{
     res.send(req.file)
})
 
router.get("/new",isLoggedIn,listingcontroller.renderNewForm);

router
.route("/:id")
.get(wrapAsync(listingcontroller.showListing))
.put(
     validateListing, 
     isLoggedIn,
     isOwner,
     wrapAsync(listingcontroller.updateForm))
.delete(isLoggedIn,isOwner,wrapAsync( listingcontroller.deleteForm));
     console.log(Listing.image);

//edit route
router.get("/:id/edit", isLoggedIn,isOwner,wrapAsync(listingcontroller.editForm));


module.exports = router;