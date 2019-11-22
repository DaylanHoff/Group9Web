const express = require('express');
const mongoose = require('mongoose');
var bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const saltRounds = 10;

var url = 'mongodb+srv://user:pass@cluster0-b22qb.mongodb.net/Games?retryWrites=true&w=majority';

mongoose.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const User = mongoose.model("User");
const Game = mongoose.model("Game");

const router = express.Router();

router.route("/addGames").get(
    function (req, res) {
        if(!req.session.isAdmin){
            res.redirect("/user/login");
        }else{
            var gamesFromJSON = require("../data/games.json").games;
            
            for (var i = 0; i < gamesFromJSON.length; i++) {
                var jsonGames = gamesFromJSON[i];

                var newGame = new Game(
                    {
                        _id: jsonGames.id,
                        name: jsonGames.name,
                        size: jsonGames.size,
                        distance: jsonGames.distance,
                        about: jsonGames.about,
                        price: jsonGames.price,
                        imageUrl: jsonGames.imageUrl
                    }
                );

                newGame.save();
            }

            res.redirect("/");
        }
    }
);

router.route("/newGame").get(
    
    function (req, res) {
        if(!req.session.isAdmin){
            res.redirect("/user/login");
        }else{
            res.render("newGame");
        }
    }
);

router.route("/newGame").post(
    function (req, res) {
        if(!req.session.isAdmin){
            res.redirect("/user/login");
        }else{
            console.log('body')
            console.log(req.body)
            var id = parseInt(req.body.id);
            var size = parseInt(req.body.size);
            var distance = parseInt(req.body.distance);
            var price = parseInt(req.body.price);
            var about = req.body.about;
            var imageUrl = req.body.imageUrl;
            var newGame = new Game(
                {
                    _id: id,
                    name: req.body.name,
                    size: size,
                    distance: distance,
                    about: about,
                    price: price,
                    imageUrl: imageUrl
                }
            );
            newGame.save();
            res.redirect("/games/detail/"+id);
        }
    }
);

router.route("/deleteAllGames").get(
    async function (req, res) {
        if(!req.session.isAdmin){
            res.redirect("/user/login");
        }else{
            console.log("Deleting all Games");
            var games = await Games.find();
            for (var index in games) {
                var games = games[index];
                console.log("Deleting game with id: " + game._id);
                await game.deleteOne({ _id: game._id });
            }

            res.redirect("/games");
        }
    }
);

module.exports = router;