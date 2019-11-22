const express = require("express");
const session = require("express-session");
var bodyParser = require('body-parser');
var port = 3000;

const app = express();
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

app.use(session({
    username : null,
    userId : null,
    isAdmin : null,
    secret: 'ooga',
    cookie: { }
}));

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));

app.use(express.urlencoded({extended: true}));


var routes = require('./routes/routes');
app.use("/", routes);
var dataRoutes = require('./routes/dataRoutes');
app.use("/data/", dataRoutes);
var dataRoutes = require('./routes/userRoutes');
app.use("/user/", dataRoutes);

app.listen(port, function(){
    console.log("Express Started and listening on port: " + port);
});