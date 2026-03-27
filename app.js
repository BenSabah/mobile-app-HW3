// import the relevant libraries
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

// make an express object
const app = express();

// create a virtual path prefix that enables using the following resources:
// images, CSS files, and JavaScript files from a directory named public
// you can load the files that are in the public directory from the /static path prefix.
app.use('/public', express.static(path.join(__dirname, 'public')));
app.set("view engine", "ejs");

// configure app to use express built-in body parsing
// this will let us get the data from a POST
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(cookieParser());

// START THE SERVER
// =============================================================================
const port = 8080;
app.listen(port);
console.log('Magic happens on port ' + port);

// all events are going to be stored in here
const events = [{
    name: "Basketball game, need 3 more players",
    time: "Thu, 21 Jun 2017 19:00:00 GMT",
    location: "Herzliya, park",
    activity: "basketball",
    img: "https://s-media-cache-ak0.pinimg.com/originals/32/77/9d/32779d944a90b66478da7e58a359d4a8.jpg",
    id: "0"
}, {
    name: "Ninja turtles meeting, need 2 more turtles",
    time: "Sat, 1 July 2017 20:30:00 GMT",
    location: "TA, Dizingof 23",
    activity: "kicking bad guys",
    img: "https://www.syfy.com/sites/syfy/files/styles/hero_image__large__computer__alt/public/batman_vs._tmnt_group.jpeg",
    id: "1"
}];

// array to hold our users
const users = [{
    uid: "0", username: "admin", password: "1234"
}];

// helper method - get a unique user ID
function guid() {
    function uUidMaker() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return uUidMaker() + '-' + uUidMaker() + uUidMaker() + '-' + uUidMaker() + uUidMaker() + uUidMaker() + '-' + uUidMaker() + uUidMaker() + uUidMaker() + uUidMaker();
}

// helper method - generate a timestamp
function generateTimeStamp() {
    const date = new Date().toUTCString();
    console.log("Date is:" + date)
    return date;
}

// --- PUBLIC ROUTES ---

// add a user and a password to the user-list
app.post("/register/:username/:password", function (req, res) {
    let username = req.params.username;
    let password = req.params.password;
    let userExist = users.some(u => u.username === username);

    if (userExist) {
        console.log("user already exists");
        res.sendStatus(500);
    } else {
        console.log("Registration successful");
        users.push({uid: users.length.toString(), username: username, password: password});
        res.sendStatus(200);
    }
});

// login and go to the events page
app.post("/login/:username/:password", function (req, res) {
    let username = req.params.username;
    let password = req.params.password;
    let user = users.find(u => u.username === username && u.password === password);

    if (user) {
        let uid = guid();
        res.cookie('uid', uid, {maxAge: 3.6e+6});
        user.uid = uid;
        console.log("user logged in = " + user.username);
        res.sendStatus(200);
    } else {
        console.log("user or password were not found");
        res.sendStatus(500);
    }
});

// --- AUTHENTICATION MIDDLEWARE ---

app.use(function (req, res, next) {
    // skip auth for public routes (registration/login endpoints)
    if (req.path.startsWith('/register/') || req.path.startsWith('/login/')) {
        return next();
    }

    let cookieUid = req.cookies.uid;
    let authenticatedUser = users.find(u => u.uid === cookieUid);

    if (authenticatedUser) {
        // If user is logged in and tries to access root, redirect to events
        if (req.path === '/') {
            return res.redirect("/events");
        }
        return next();
    }

    // Not authenticated: render login page for root or redirect to root for other routes
    if (req.path === '/') {
        res.render("login-page");
    } else {
        // For pages like /events or /item/:id, if not logged in, show login page
        res.render("login-page");
    }
});

// --- PROTECTED ROUTES ---

// view events
app.get("/events", function (req, res) {
    console.log("/events");
    res.render("events", {events: events});
});

// return all the items as an array object
app.get("/items", function (req, res) {
    res.send(events);
});

// adds a user's event
app.post("/item/", function (req, res) {
    let newEvent = req.body;
    newEvent.id = guid();
    newEvent.time = generateTimeStamp();
    events.unshift(newEvent);
    res.redirect("/events");
});

// returns the item with the right id or 404 if no such an item
app.get("/item/:id", function (req, res, next) {
    let id = req.params.id;
    let event = events.find(e => e.id === id);
    if (event) {
        res.send(event);
    } else {
        next();
    }
});

// edit event page
app.get("/edit/:id", function (req, res) {
    let id = req.params.id;
    let event = events.find(e => e.id === id);
    if (event) {
        res.render("edit-event", {event: event});
    } else {
        res.redirect("/events");
    }
});

// delete requests handler
app.delete("/item/:id", function (req, res, next) {
    let id = req.params.id;
    let index = events.findIndex(e => e.id === id);
    if (index !== -1) {
        events.splice(index, 1);
        console.log("deleted event id = " + id);
        res.sendStatus(200); // Ajax expects a status
    } else {
        next();
    }
});

// overwrite the property values of the item with the same id or 404 if no such an item
app.put("/item/", function (req, res, next) {
    let updatedEvent = req.body;
    let id = updatedEvent.id;
    let event = events.find(e => e.id === id);
    if (event) {
        event.name = updatedEvent.name;
        event.time = generateTimeStamp();
        event.location = updatedEvent.location;
        event.activity = updatedEvent.activity;
        event.img = updatedEvent.img;
        res.send("event " + id + " was replaced");
    } else {
        next();
    }
});

// catch 404 and forward to error handler
app.use(function (req, res) {
    res.status(404).send('Not Found');
});