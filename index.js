const express = require("express");
const cors = require("cors");
const dbConnect = require("./utils/dbConnect");
const app = express();
const port = process.env.PORT || 5000;
require("dotenv").config();
const productsRoute = require("./routes/v1/products.route");
const viewCount = require("./controllers/middleware/viewCount");
const { default: rateLimit } = require("express-rate-limit");
const { limiter } = require("./controllers/middleware/limiter");
const { errorHandler } = require("./controllers/middleware/errorHandler");
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.set("view engine", "ejs");

dbConnect();
app.use("/api/v1/product", productsRoute);
// Apply the rate limiting middleware to all requests
// app.use(limiter)

app.use(errorHandler);
app.get("/", (req, res) => {
  res.render("home.ejs", {
    id: 10,
  });
});

app.all("*", (req, res) => {
  res.send("No route found!");
});

app.listen(port, () => {
  console.log(`EasyMart listening on port ${port}`);
});

process.on("unhandledRejection", (error) => {
  console.log(error.name, error.message);
  app.close(() => {
    process.exit(1);
  });
});
