// import the relevant libraries
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

// make an express object
var app = express();

// create a virtual path prefix that enables using the following resources:
// images, CSS files, and JavaScript files from a directory named public
// you can load the files that are in the public directory from the /static path prefix.
app.use('/public',express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());

// START THE SERVER
// =============================================================================
//var port = process.env.PORT || 8080;        // set our port
var port = 8080;
app.listen(port);
console.log('Magic happens on port ' + port);


//All events are going to be stored in here
var events = [
    {
        name: "Herzelia, basketball game, need 3 more players",
        time: "Thu, 21 Jun 2017 19:00:00 GMT",
        location: "Herzelia, park",
        activity: "basketball",
        img: "https://www.courtsoftheworld.com/upload/courts/248/0/COTW_Tupper-Park_1244670982.jpg",
        id: "0"
    },
    {
        name: "Herzelia, video gaming, need 1 more players",
        time: "Sat, 1 July 2017 20:30:00 GMT",
        location: "Herzelia, ezel street 28",
        activity: "playing dota 2",
        img: "http://cdn.dota2.com/apps/dota2/images/blogfiles/wh_blog.jpg",
        id: "1"
    }
];

// adding events by users of the app
function addEvent(name,time, location, activity, img) {
    this.name = name;
	this.time = time;
    this.location = location;
    this.activity = activity;
    this.img = img;
}

// array to hold our users
var users = [
    {
        uid: "1",
        username : "admin",
        password: "1234"
    }
];

  
// add a user and password to the user-list
app.post("/register/:username/:password",function(req,res,next){
    let username = req.params.username;
    let password = req.params.password;
    console.log("username = " + username);
    console.log("password = " + password);
    let userExist = false;
	
	// checks if the user already exists
	// or if its a new user we need to add
    for(i = 0; i < users.length; i++){
        if (users[i].username === username){
            userExist = true;
            break;
        }
    }
    if (userExist){
        console.log("user already exists");
        res.sendStatus(500);
    } else {
        console.log("Registration successful");
        users.push({username: username, password: password});
        res.sendStatus(200);
    }
});



