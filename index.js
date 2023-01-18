const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

//import routes
const authRouter = require("./routes/authRoute");
const userRouter = require("./routes/userRoute");
const bannerRouter = require("./routes/bannerRoute");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());
//use the imported routes
app.use("/api_1.0/auth", authRouter);
app.use("/api_1.0/user", userRouter);
app.use("/api_1.0/banner", bannerRouter);

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
