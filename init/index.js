const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

main().then(() => {
    console.log("connected to DB")
})
.catch((err) =>{
console.log(err)
});

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Wandelust')
}

const initDB = async () => {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) =>({
...obj,
owner:'664f7ecae78059df7d7575cc',
    }))
    await Listing.insertMany(initdata.data);
    console.log("data was initialized")
}
initDB();