const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

// mongo server
const InitiateMongoServer = require("./config/database");

// middleware
const {
  logErrors,
  errorHandler,
  clientErrorHandler,
} = require("./middleware/errorHandles");
const checkUser = require("./middleware/checkUser");

// routes
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const orderRoutes = require("./routes/orderRoutes");

// mount the specified middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.static("uploads"));
app.use(express.urlencoded({ extended: true }));
app.use(logErrors);
app.use(clientErrorHandler);
app.use(errorHandler);

// connect to db
InitiateMongoServer();

// mount the specified routes
app.use("*", checkUser);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.get("/login", (req, res) => res.send("Hello world"));

// set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
