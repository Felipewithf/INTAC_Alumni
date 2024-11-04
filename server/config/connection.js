require("dotenv").config();
const mongoose = require("mongoose");
mongoose.connect(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/INTAC");
// || "mongodb://127.0.0.1:27017/INTAC"
module.exports = mongoose.connection;
