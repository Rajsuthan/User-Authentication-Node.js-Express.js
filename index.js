const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

require("dotenv").config();

// DB Connection
mongoose
  .connect(process.env.MONGODB_URI || process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("DB Connected");
  })
  .catch(() => {
    console.log("Database is not connected");
  });

mongoose.connection.on("connected", () => {
  console.log("Mongoose Connected");
});

// MiddleWare
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

// Basic Testing Purposes
app.get("/", (req, res) => {
  res.json({
    message:
      "Hello World! User Authentication API developed by Rajsuthan, my website URL: https://raj-dev.netlify.app/",
  });
});

// Import Routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const emailSubscriberRoutes = require("./routes/emailsubscriber");

// Use Routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", emailSubscriberRoutes);

// PORT
const port = process.env.PORT || 8000;

// Starting a server
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
