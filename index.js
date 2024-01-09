const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const featureRoutes = require("./routes/featureRoutes");
const notFound = require("./middlewares/notFound");
const customErrorHandler = require("./middlewares/customErrorHandler");

require("dotenv").config();
require("./db/connect");
const port = process.env.PORT || 3001;

//middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// static file path
app.use(express.static("./public"));

// routes
app.use("/api/v1/admins", adminRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/features", featureRoutes);

// health route
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "SJI - Feature request board API is running",
  });
});

// app.get("/", (req, res) => {
//   res.send("Feature request board app is running");
// });

app.listen(port, () => {
  console.log(`Feature request board app listening on port ${port}`);
});

app.use(notFound);
app.use(customErrorHandler);
