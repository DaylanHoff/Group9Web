const express = require('express');
const mongoose = require('mongoose');
var url = 'mongodb+srv://user:pass@cluster0-b22qb.mongodb.net/Games?retryWrites=true&w=majority';

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const GamesSchema = new Schema(
    {
        _id: Number,
        name: String,
        about: String,
        imageUrl: String
    },
);
const JapaneseSchema = new Schema(
    {
        _id: Number,
        romaji: String,
        hiragana: String
    }
)
const UserSchema = new Schema(
    {
        _id: ObjectId,
        name: String,
        email: String,
        username: String,
        password: String,
        roles: Array
    },
    {collection: "users"}
);
const Game = mongoose.model("Game", GamesSchema);
const User = mongoose.model("User", UserSchema);
const Japanese = mongoose.model("hiragana", JapaneseSchema);
const router = express.Router();

router.route("/").get(
    function (req, res) {
        var model = {
            title : "Games Site!",
            username : req.session.username,
            userId : req.session.userId,
            isAdmin : req.session.isAdmin
        }
        res.render("index", model);
    }
);

router.route("/games").get(
    async function (req, res) {
        var GamesFromDB = await Game.find();

        var model = {
            title: "Games List",
            games: GamesFromDB,
            username : req.session.username,
            userId : req.session.userId,
            isAdmin : req.session.isAdmin
        };
        console.log(req.session.isAdmin);
        res.render("gameList", model);
    }
);

router.route("/games/:gameId").get(
    async function (req, res) {
        if(!req.session.username){
            res.redirect("/user/login");
        }else {
            var gameId = req.params.gameId;
            var game = await Game.findOne({_id:gameId});
            var arr = [];
            Japanese.find(function (err, japanese) {
                if (game) {
                    var model = {
                        title: "Playing 9 time!",
                        game: game,
                        username : req.session.username,
                        userId : req.session.userId,
                        isAdmin : req.session.isAdmin,
                        characterOrder : japanese
                    };
                    res.render(game.name, model);
                } else {
                    res.send("You done messed up! Could not find a weapon with id: " + gameId);
                }
            });
        }
    }
);


router.route("/admin").get(
    async function (req, res) {
        if(!req.session.isAdmin){
            res.redirect("/");
        }else {
            var UsersFromDB = await User.find();

            var model = {
                title: "Users List",
                users: UsersFromDB,
                username : req.session.username,
                userId : req.session.userId,
                isAdmin : req.session.isAdmin
            };
            res.render("userList", model);
        }
    }
);

router.route("/toAdmin/:userId").get(
    async function (req, res) {
        if(!req.session.isAdmin){
            res.redirect("/user/login");
        }else {
            var userId = req.params.userId;
            var user = await User.findOne({_id:userId});
            if (user) {
                user.update({"_id": req.params.userId, "roles": "User"},
                {$set: {"users.$.role": "Admin"}});

                var UsersFromDB = await User.find();
                var model = {
                    title: "Users List",
                    users: UsersFromDB,
                    username : req.session.username,
                    userId : req.session.userId,
                    isAdmin : req.session.isAdmin
                };
                res.render("userList", model);

            } else {
                res.send("You done messed up! Could not find a user with id: " + userId);
            }
        }
    }
);
module.exports = router;
