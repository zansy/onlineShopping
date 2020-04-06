var express = require('express');
var app = express();
var path = require('path');
var mongoose = require("mongoose");

var bodyParser = require('body-parser');
var multer = require('multer');
var session = require('express-session');

global.dbHelper = require( './common/dbHelper' );

global.db = mongoose.connect("mongodb://127.0.0.1:27017/test");

app.use(session({
  secret:'secret',
  cookie:{
    maxAge:1000*60*30
  }
}));


//Sets the directory where the view is stored
app.set('views', require('path').join(__dirname, 'views'));

//Access view page
app.set( 'view engine', 'html' );
app.engine( '.html', require( 'ejs' ).__express );

//Invoke middleware usage
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer());

// Set the static file directory, such as the local file
app.use(express.static(path.join(__dirname, 'public')));

//Use middleware to deliver prompt messages
app.use(function(req, res, next){
  res.locals.user = req.session.user; //Save user information
  var err = req.session.error;  //Save the resulting response information
  res.locals.message = '';  // Save the HTML tag
  if (err) res.locals.message = '<div class="alert alert-danger" style="margin-bottom: 20px;color:red;">' + err + '</div>';
  next();
});

//Access to the routing
require('./routes')(app);

app.get('/', function(req, res) {
  res.render('register');
});

app.listen(8080);