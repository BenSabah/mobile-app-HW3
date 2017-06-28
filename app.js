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
var port = process.env.PORT || 8080;        // set our port
app.listen(port);
console.log('Magic happens on port ' + port);

var uidCounter = 1;
var logedInUsers = {};
var logedInUsersTag = {};



// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);


// ROUTES FOR OUR API
// =============================================================================
             
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });   
});

// more routes for our API will happen here

app.post('/register/:username/:password',function(req,res,next){
    
    console.log("body",req.body);
    
    var uid = logedInUsers[req.params.user];
    if(uid){
        res.cookie('uid', uid);
    }else{
        uidCounter++;
        logedInUsers[req.params.user] = uidCounter;
        logedInUsersTag[uidCounter] = req.params.user;
        res.cookie('uid', uidCounter);
    }
    res.json({msg: "OK", secretKey: 23});


});


module.exports = app;