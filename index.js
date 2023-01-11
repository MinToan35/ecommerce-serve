const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//import routes
const userRouter = require("./routes/users");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
//use the imported routes
app.use("/api_1.0/users", userRouter);

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}`, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (error) {
    console.log(error.message);
    process.exit(1);
  }
};

mongoose.set("strictQuery", false);

connectDB();

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
