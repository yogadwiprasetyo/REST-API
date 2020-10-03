/*
* Configuration database.
*
* Databases is using mongoDB Atlas.
* The connection to db will show a message,
* if success or fail in console.
*/

// import package mongoose.
const mongoose = require("mongoose");

// URI to linking db.
const MONGOURI =
  "urimongo";

// Connected to db.
const InitiateMongoServer = async () => {
  try {
    await mongoose.connect(MONGOURI, {
      useNewUrlParser: true,
    });
    console.log("Connected to DB !!");
  } catch (e) {
    console.log(e.message);
    throw e;
  }
};

module.exports = InitiateMongoServer;
