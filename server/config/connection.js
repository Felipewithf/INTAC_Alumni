const mongoose = require("mongoose");

console.log(process.env.MONGODB_URI);
mongoose.connect(
  "mongodb+srv://felipesarmientoas:4oF6PgPruKTzUPiY@clusterintac.k58iu.mongodb.net/"
);
// || "mongodb://127.0.0.1:27017/INTAC"
module.exports = mongoose.connection;
