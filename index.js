const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const app = require("./app");

// conecting mongo db
const DB = process.env.MONGODB;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
  })
  .then((res) => {
    console.log("DB connected successfully");
  })
  .catch((err) => console.log(err));

// Firing up the server
const port = process.env.PORT || 4000;

const server = app.listen(port, () => {
  console.log(`Server running at ${port}`);
});
