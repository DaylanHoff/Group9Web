const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

var url = 'mongodb+srv://user:pass@cluster0-b22qb.mongodb.net/Games?retryWrites=true&w=majority';

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const User = mongoose.model("User");

// Setup the router
const router = express.Router();

router.route("/profile/:userId").get(
    async function (req, res) {
        var model = {
            title: "User Profile",
            username : req.session.username,
            userId : req.session.userId,
            isAdmin : req.session.isAdmin
        }

        res.render("profile", model);
    }
);

router.route("/Register").get(
    function (req, res) {
        var model = {
            title: "Register a New Account",
            username : req.session.username,
            userId : req.session.userId,
            isAdmin : req.session.isAdmin
        }

        res.render("register", model);
    }
);

router.route("/Register").post(
    function (req, res) {
        var password = req.body.password;
        bcrypt.hash(password, saltRounds, function(err, hash) {
            var newUser = new User(
                {
                    _id: mongoose.Types.ObjectId(),
                    name: req.body.name,
                    email: req.body.email,
                    username: req.body.username,
                    password: hash,
                    roles: ["User"]
                }
            );
            newUser.save();
        });        

        res.redirect("/user/login");
    }
);

router.route("/Login").get(
    function (req, res) {
        var model = {
            title : "Login Page",
            username : req.session.username,
            userId : req.session.userId,
            isAdmin : req.session.isAdmin
        }

        res.render("login", model);
    }
);

router.route("/Login").post(
    async function (req, res) {
        var user = await User.findOne({username:req.body.username});
        var valid = false;
        var valid = false;
        if(user){
            valid = await bcrypt.compare(req.body.password, user.password);
        }

        if(user && valid){
            console.log(user);
            req.session.username = user.username;
            req.session.userId = user._id;
            req.session.isAdmin = user.roles.includes("Admin");
            res.redirect("/games");
        }else{
            req.session.username = null;
            req.session.userId = null;
            req.session.isAdmin = null;

            var model = {
                title : "Login Page",
                message: "Failed login!"
            }

            res.render("login", model);
        }
    }
);

router.route("/Logout").get(
    function (req, res) {
        // Need to clear our session logout
        req.session.username = null;
        req.session.userid = null;
        req.session.isAdmin = null;

        res.redirect("/");
    }
);

module.exports = router;