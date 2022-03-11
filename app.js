//jshint esversion:6
require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const app = express();
const md5 = require("md5")
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));
mongoose.connect('mongodb://localhost:27017/UserDB');

const userSchema = new mongoose.Schema ({
  email: String,
  password: String
});



const User = mongoose.model("User", userSchema);

app.get("/", function(req, res) {
  res.render("home");
});

app.get("/login", function(req, res) {
  res.render("login");
});

app.get("/register", function(req, res) {
  res.render("register");
});

app.post("/register", function(req, res) {
  const newUser = new User({
    email: req.body.username,
    password: md5(req.body.password)
  });
  newUser.save(function(err) {
    if (err) {
      console.log(err)
    } else {
      res.render("secrets");
    }
  });
})

app.post("/login", function(req, res) {
  const userName = req.body.username
  const passWord = md5(req.body.password)
  User.findOne({
    email: userName
  }, function(err, foundUser) {
    if (err) {
      console.log(err)
    } else {
      if (foundUser) {
        if (foundUser.password === passWord) {
          res.render("secrets");
        }
      }
    }
  });

})


// app.get("/secrets", function(req, res){
//   res.render("secrets");
// });
//
// app.get("/submit", function(req, res){
//   res.render("submit");
// });


const port = process.env.PORT
app.listen(process.env.PORT || 3000, function() {
  console.log(`Example app listening at http://localhost:${3000}`);
});
