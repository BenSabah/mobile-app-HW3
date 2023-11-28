// array to hold our users
const users = [
    {
        uid: "0",
        username: "admin",
        password: "1234"
    }
];

/// post requests handlers

// add a user and a password to the user-list
app.post("/register/:username/:password", function (req, res) {
    let username = req.params.username;
    let password = req.params.password;
    console.log("username = " + username);
    console.log("password = " + password);
    let userExist = false;

    // checks if the user already exists
    // or if it's a new user we need to add
    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username) {
            userExist = true;
            break;
        }
    }
    if (userExist) {
        console.log("user already exists");
        res.send(500);
    } else {
        console.log("Registration successful");
        users.push({uid: users.length.toString(), username: username, password: password});
        res.send(200);
    }
});

// login and go to the events page
app.post("/login/:username/:password", function (req, res) {
    let username = req.params.username;
    let password = req.params.password;
    let foundUser = false;

    for (let i = 0; i < users.length; i++) {
        if ((users[i].username === username) && (users[i].password === password)) {
            // user is signed
            foundUser = true;
            // get a user ID
            let uid = guid();
            // send uid cookie with max lifetime of 60 min
            res.cookie('uid', uid, {maxAge: 3.6e+6});
            // set the users id
            users[i].uid = uid;
            console.log("user logged in = " + users[i].username);
            res.send(200);
            break;
        }
    }
    if (!foundUser) {
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

    // can change length as needed for safety reasons
    return uUidMaker() + '-' + uUidMaker() + uUidMaker() + '-' + uUidMaker() + uUidMaker() + uUidMaker() +
        '-' + uUidMaker() + uUidMaker() + uUidMaker() + uUidMaker();
}

// adds a user's event
app.post("/item/", function (req, res) {
    let newEvent = req.body;
    // can use the same UID function for event IDs
    newEvent.id = guid();
    newEvent.time = generateTimeStamp();
    events.unshift(newEvent);
    res.redirect("/events");
});

// helper method - generate a timestamp
function generateTimeStamp() {
    const date = new Date().toUTCString();
    console.log("Date is:" + date)
    return date;
}


/// get requests handlers

// return all the items as an array object
app.get("/items", function (req, res) {
    res.send(events);
});

// returns the item with the right id or 404 if no such an item
app.get("/item/:id", function (req, res, next) {
    let id = req.params.id;
    console.log("id to return = " + id);
    let found = false;
    for (let i = 0; i < events.length; i++) {
        const event = events[i];
        if (event.id === id) {
            found = true;
            res.send(event);
            break;
        }
    }
    if (!found) {
        next();
    }
});

app.get("/edit/:id", function (req, res) {
    let id = req.params.id;
    let eventToReturn;
    events.forEach(function (event) {
        if (event.id === id) {
            eventToReturn = event;
        }
    });
    res.render("edit-event", {event: eventToReturn});
});

app.use("/events", function (req, res) {
    console.log("/events");
    res.render("events", {events: events});
});


//upload home page
app.get("/public/login-page.html", function (req, res) {
    res.render("login-page");
});


/// delete requests handler

app.delete("/item/:id", function (req, res, next) {
    let id = req.params.id;
    let found = false;
    for (let i = 0; i < events.length; i++) {
        let event = events[i];
        if (event.id === id) {
            found = true;
            events.splice(i, 1);
            console.log("deleted event id = " + id);
            break;
        }
    }
    if (!found) {
        next();
    } else {
        res.redirect(res.get("/events"));
    }
});


/// put requests handler

// overwrite the properties values of the item with the same id or 404 if no such an item
app.put("/item/", function (req, res, next) {
    console.log("PUT /item/");
    let updatedEvent = req.body;
    let id = updatedEvent.id;
    let found = false;
    console.log("event to update = " + JSON.stringify(updatedEvent));
    events.forEach(function (event) {
        if (id === event.id) {
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
app.use("/", function (req, res, next) {
    let cookieUid = req.cookies.uid;
    let cookieFound = false;

    // if the user id exists continue
    // else show him the login page again
    if (cookieUid) {
        users.forEach(function (user) {
            if (cookieUid === user.uid) {
                cookieFound = true;
                console.log("cookie verified - " + user.uid);
                res.redirect("/events");
            }
        });
    }

    if (!cookieFound) {
        res.render("login-page");
    } else {
        next();
    }
});

// catch 404 and forward to error handler
app.use(function (req, res) {
    const err = new Error('Not Found');
    err.status = 404;
    res.send(err);
});