//jshint esversion:6

require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const md5 = require("md5");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    user: String,
    password: String
});

const User = new mongoose.model("user", userSchema);

app.get("/", function(req, res) {
    res.render("home");
});

app.get("/login", function(req, res) {
    res.render("login");
});

app.get("/register", function(req, res) {
    res.render("register");
});

app.get("/logout", function(req, res) {
    res.redirect("/");
});

app.post("/register", function(req, res) {
    const newUser = new User({
        user: req.body.username,
        password: md5(req.body.password)
    });

    newUser.save(function(err) {
        if (err) {
            console.log(err);
        } else {
            res.render("secrets");
        }
    });
});

app.post("/login", function(req, res) {
    User.findOne({ user: req.body.username }, function(err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            if (foundUser) {
                if (foundUser.password === md5(req.body.password)) {
                    res.render("secrets");
                } else {
                    console.log("Wrong password");
                }
            } else {
                console.log("User doesn't exist");
            }
        }
    });
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});