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
        name: "Basketball game, need 3 more players",
        time: "Thu, 21 Jun 2017 19:00:00 GMT",
        location: "Herzelia, park",
        activity: "basketball",
        img: "https://s-media-cache-ak0.pinimg.com/originals/32/77/9d/32779d944a90b66478da7e58a359d4a8.jpg",
        id: "0"
    },
    {
        name: "Ninja turtles meeting, need 2 more turtles",
        time: "Sat, 1 July 2017 20:30:00 GMT",
        location: "TA, dizingof 23",
        activity: "kicking bad guys",
        img: "http://www.pcgalaxy.co.il/wp-content/uploads/2015/12/teenage-mutant-ninja-turtles-1987-52775990e3252.png",
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

	/// post requests handlers
  
// add a user and a password to the user-list
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
        res.send(500);
    } else {
        console.log("Registration successful");
        users.push({username: username, password: password});
        res.send(200);
    }
});


// login an go to the events page
app.post("/login/:username/:password",function(req,res,next){
    let username = req.params.username;
    let password = req.params.password;
    let foundUser = false;
    
	for(i = 0; i < users.length; i++){
        if ((users[i].username === username) && (users[i].password === password)){
            // user is signed
			foundUser = true;
			// get a user ID
            let uid = guid();
            // send uid cookie with max life time of 60 min
            res.cookie('uid',uid, { maxAge: 3.6e+6 });
			// set the users id
            users[i].uid = uid;
            console.log("user logged in = " + users[i].username);
            res.send(200);
            break;
        }
    }
    if (!foundUser){
        console.log("user or password were not found");
        res.send(500);
    }
});


// helper method - get a unique user ID
function guid() {
	// create a unique user ID
    function uUidMaker() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
	// can change length as needed for safty reasons
    return uUidMaker() + '-' + uUidMaker() + uUidMaker() + '-' + uUidMaker() + uUidMaker() + uUidMaker() +
         '-' + uUidMaker() + uUidMaker() + uUidMaker() + uUidMaker();
}

// adds a user's event
app.post("/item/", function(req,res){
    let newEvent = req.body;
	// can use the same UID function for event IDs
    newEvent.id = guid();
    newEvent.time = generateTimeStamp();
    events.unshift(newEvent);
    res.redirect("/events");
});

// helper method - generate a timestamp
function generateTimeStamp() {
    var date = new Date().toUTCString();
    console.log("Date is:" + date)
    return date;
}

	/// get requests handlers

// return all the items as an array object
app.get("/items",function(req,res,next){
    res.send(events);
});

// returns the item with the right id or 404 if no such an item
app.get("/item/:id", function(req,res,next){
    let id = req.params.id;
    console.log("id to return = " + id);
    let found = false;
    for(i = 0; i < events.length; i++) {
        var event = events[i];
        if(event.id === id) {
            found = true;
            res.send(event);
            break;
        }
    }
    if (!found){
        next();
    }
});

app.get("/edit/:id",function(req,res){
    let id = req.params.id;
    let eventToReturn;
    events.forEach(function(event){
       if (event.id === id){
           eventToReturn = event;
       }
    });
    res.render("edit-event", {event: eventToReturn});
});

app.use("/events", function(req,res){
    console.log("/events");
    res.render("events", {events: events});
});


//upload home page
app.get("/public/ReglogPage.html", function(req,res,next){
    res.render("ReglogPage");
});




	/// delete requests handler

app.delete("/item/:id",function(req,res,next){
    let id = req.params.id;
    let found = false;
    for(i = 0; i < events.length; i++) {
        let event = events[i];
        if(event.id == id) {
            found = true;
            events.splice(i, 1);
            console.log("deleted event id = " + id);
            break;
        }
    }
    if (!found){
        next();
    } else {
        res.redirect(res.get("/events"));
    }
});	

	/// put requests handler
	
// overwrite the properties values of the item with the same id or 404 if no such an item
app.put("/item/", function(req,res,next){
    console.log("PUT /item/");
    let updatedEvent = req.body;
    let id = updatedEvent.id;
    let found = false;
    console.log("event to update = " + JSON.stringify(updatedEvent));
    events.forEach(function(event){
        if (id === event.id){
            event.name = updatedEvent.name;
            event.time = generateTimeStamp();
            event.location = updatedEvent.location;
            event.activity = updatedEvent.activity;
            event.img = updatedEvent.img;
            res.send("event " + id + " was replaced");
            found = true;
        }
    });
    if (!found) {
        next();
    }
});


	/// general handlers 

// checks if a user's id exists
app.use("/", function(req,res,next){
    let cookieUid = req.cookies.uid;
    let cookieFound = false;
	
	// if the user id exists continue
	// else show him the login page again
    if (cookieUid){
        users.forEach(function(user){
            if(cookieUid === user.uid){
                cookieFound = true;
                console.log("cookie verified");
            }
        });
    }
    if (!cookieFound){
        res.render("ReglogPage");
    } else {
        next();
    }

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    res.send(err);
});