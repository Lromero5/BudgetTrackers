const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

var PORT = process.env.PORT || 3000;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

// mongoose.connect("mongodb://localhost/budget", {
//   useNewUrlParser: true,
//   useFindAndModify: false
// });
mongoose.connect("mongodb://user:password1@ds015713.mlab.com:15713/heroku_pjd5577n", {
  useNewUrlParser: true,
  useFindAndModify: false
});


// routes
app.use(require("./routes/api.js"));

app.get("/", function(req, res) {
  res.json(path.join(__dirname, "public/index.html"));
});

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});