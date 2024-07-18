const express = require("express");
const app = express();
const bodyParser = require("body-parser");
app.use(bodyParser.json());  // Middleware
const localAuthMiddleware = require('./Auth');
const db = require("./db");

logRequest = (req, res, next) => {
  console.log(`[${new Date().toLocaleString()}] Request made to : ${req.originalUrl}`);
  next();
}
app.use(logRequest);    // This middleware is applied to all Routes
// app.use(localAuthMiddleware); // middleware authentication is applied to all Routes

app.get("/",  (req, res) => {
  res.send("welcome to home page");
});

const personRoutes = require('./Routes/personRoutes');
const menuRoutes = require('./Routes/menuRoutes');

app.use('/person', personRoutes);
app.use('/menu', localAuthMiddleware, menuRoutes);

app.listen("3000", () => {
  console.log("server is running at port 3000");
});
