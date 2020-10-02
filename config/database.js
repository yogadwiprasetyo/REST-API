const mongoose = require("mongoose");

const MONGOURI =
  "urimongo";

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
