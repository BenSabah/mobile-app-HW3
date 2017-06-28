var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();



var uidCounter = 1;
var logedInUsers = {};
var logedInUsersTag = {};


// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;        // set our port

var router = express.Router(); // get an instance of the express Router

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);


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