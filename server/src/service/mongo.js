const mongoose = require("mongoose");

const MONGO_URL =
  "mongodb+srv://20110392:krxUVT4x6KzMzrGx@cluster0.nk5jd9n.mongodb.net/nasaproject?retryWrites=true&w=majority";
mongoose.connection.once("open", () => {
  console.log("Connect to MongoDB successfully");
});

mongoose.connection.on("error", (err) => {
  console.log(err);
});

async function mongooseConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongooseDisconnect() {
  await mongoose.disconnect(MONGO_URL);
}

module.exports = {
  mongooseConnect,
  mongooseDisconnect,
};
