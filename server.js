// Require the Express Module
var express = require('express');
// Create an Express App
var app = express();
// Require body-parser (to receive post data from clients)
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
// Use native promises
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/quotingdojo');

// We are setting this Schema in our Models as 'User'

// Create a Schema for Users
var UserSchema = new mongoose.Schema({
  name: {
    type: String
  },
  quote: {
    type: String
  },
  created_at: {
    type: Date,
    default: Date.now
  }
})
mongoose.model('User', UserSchema);
var User = mongoose.model('User') // We are retrieving this Schema from our Models, named 'User'
// Integrate body-parser with our App
app.use(bodyParser.urlencoded({
  extended: true
}));

// Require path
var path = require('path');
// Setting our Static Folder Directory
app.use(express.static(path.join(__dirname, './static')));
// Setting our Views Folder Directory
app.set('views', path.join(__dirname, './views'));
// Setting our View Engine set to EJS
app.set('view engine', 'ejs');
app.get('/', function(req, res) {
  // This is where we will retrieve the users from the database and include them in the view page we will be rendering.
  res.render('index');
})

app.post('/users', function(req, res) {
  console.log("POST DATA", req.body);
  // create a new User with the name and age corresponding to those from req.body
  var user = new User({
    name: req.body.name,
    quote: req.body.quote,

  });
  // Try to save that new user to the database (this is the method that actually inserts into the db) and run a callback function with an error (if any) from the operation.
  user.save(function(err) {
    // if there is an error console.log that something went wrong!
    if (err) {
      console.log('something went wrong');
    } else { // else console.log that we did well and then redirect to the root route
      console.log('successfully added a user!');
      console.log(user);
      res.redirect('/quotes');
    }
  })
})

app.get('/quotes', function(req, res) {
  User.find({}).sort({
    'timestamps': -1
  }).exec(function(err, users) {
    if (err) {
      console.log(err);
    }
    res.render('quotes', {
      'user': users


    });
    // This is the method that finds all of the users from the database
    // Notice how the first parameter is the options for what to find and the second is the
    //   callback function that has an error (if any) and all of the users
    // Keep in mind that everything you want to do AFTER you get the users from the database must
    //   happen inside of this callback for it to be synchronous
    // Make sure you handle the case when there is an error, as well as the case when there is no error
  })
})

// Setting our Server to Listen on Port: 8000
app.listen(8000, function() {
  console.log("listening on port 8000");
})

// The root route -- we want to get all of the users from the database and then render the index view passing it all of the users
