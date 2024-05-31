const mongoose = require('mongoose');
require("dotenv").config(); 

main().catch(err => console.log(err));

async function main() {
  // await mongoose.connect('mongodb://127.0.0.1:27017/ariel23_ev');
  await mongoose.connect(process.env.MONGO_CONNECT);
  console.log("mongo connect arial23 atlas");
  // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}