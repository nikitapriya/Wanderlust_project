const mongoose=require("mongoose")
const initdata =require("./data.js")
const listing =require("../models/listing.js")

main().then(
    ()=>{
        console.log("connect")
    }
).catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
const initdb=async ()=>{
    await listing.deleteMany({});
    initdata.data = initdata.data.map((obj)=>({...obj,owner: "65b4052e1b19081a784207e6"}))
    await listing.insertMany(initdata.data);
    console.log("data is initialize");
}
initdb();