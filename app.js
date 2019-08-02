var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var apikey = require('./config/apikey')

// AUTHENTICATION MODULES
session = require("express-session"),
bodyParser = require("body-parser"),
User = require( './models/User' ),
flash = require('connect-flash')
// END OF AUTHENTICATION MODULES

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

const mongoose = require( 'mongoose' );
mongoose.connect( 'mongodb://localhost/user' );
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("we are connected!")
}); //code to connect with mongoose

const commentController = require('./controllers/commentController.js')
const profileController = require('./controllers/profileController.js')
const calendarController = require('./controllers/calendarController')
const timeRecordingController = require('./controllers/timeRecordingController')

// Authentication
// Authentication
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// here we set up authentication with passport
const passport = require('passport')
const configPassport = require('./config/passport')
configPassport(passport)

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

/*************************************************************************
     HERE ARE THE AUTHENTICATION ROUTES
**************************************************************************/

app.use(session({ secret: 'zzbbyanana' }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: false }));



const approvedLogins = ["liuhantao@brandeis.edu","liu.hantao@outlook.com"];
const premiumList = ["rhuang@brandeis.edu"];


// here is where we check on their logged in status
app.use((req,res,next) => {
  res.locals.title="YellowCartwheel"
  res.locals.loggedIn = false
  if (req.isAuthenticated()){
    if (req.user.googleemail.endsWith("@brandeis.edu") ||
          approvedLogins.includes(req.user.googleemail))
          {
            console.log("user has been Authenticated")
            res.locals.user = req.user
            res.locals.loggedIn = true
          }
    else {
      res.locals.loggedIn = false
    }
    console.log('req.user = ')
    console.dir(req.user)
    // here is where we can handle whitelisted logins ...
    if (req.user){
      if (req.user.googleemail=='tjhickey@brandeis.edu'){
        console.log("Owner has logged in")
        res.locals.status = 'teacher'
      } else if (premiumList.includes(req.user.googleemail)){
        console.log("A premium member has logged in")
        res.locals.status = 'ta'
      }else {
        console.log('student has logged in')
        res.locals.status = 'student'
      }
    }
  }
  next()
})



// here are the authentication routes

app.get('/loginerror', function(req,res){
  res.render('loginerror',{})
})

app.get('/login', function(req,res){
  res.render('login',{})
})



// route for logging out
app.get('/logout', function(req, res) {
        req.session.destroy((error)=>{console.log("Error in destroying session: "+error)});
        console.log("session has been destroyed")
        req.logout();
        res.redirect('/');
    });


// =====================================
// GOOGLE ROUTES =======================
// =====================================
// send to google to do the authentication
// profile gets us their basic information including their name
// email gets their emails
app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));


app.get('/login/authorized',
        passport.authenticate('google', {
                successRedirect : '/',
                failureRedirect : '/loginerror'
        })
      );


// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
    console.log("checking to see if they are authenticated!")
    // if user is authenticated in the session, carry on
    res.locals.loggedIn = false
    if (req.isAuthenticated()){
      console.log("user has been Authenticated")
      res.locals.loggedIn = true
      return next();
    } else {
      console.log("user has not been authenticated...")
      res.redirect('/login');
    }
}

app.get('/personal', isLoggedIn, function(req, res) {
        res.render('personal')
// we require them to be logged in to see their profile
  });
app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile')/*, {
            user : req.user // get the user out of session and pass to template
        });*/
    });
app.get('/editProfile', isLoggedIn, function(req, res) {
            res.render('editProfile')
          });

app.get('/profiles', isLoggedIn, profileController.getAllProfiles);
app.get('/showProfile/:id', isLoggedIn, profileController.getOneProfile);
app.post('/updateProfile',profileController.update)
// END OF THE AUTHENTICATION ROUTES

app.use(function(req,res,next){
  console.log("about to look for routes!!!")
  //console.dir(req.headers)
  next()
});

app.get('/', function(req, res, next) {
  res.render('index',{title:"Express Demo"});
  res.render('index',{title:"Dailywater"});
});

app.get('/dashboard', function(req,res){
  res.render('dashboard'),{title:"dashboard"}
});

app.get('/profile', function(req, res, next) {
  res.render('profile',{title:"profile"});
});

app.get('/personal', function(req, res, next) {
  res.render('personal',{title:"personal"});
});
app.get('/myform', function(req, res, next) {
  res.render('myform',{title:"Form Demo"});
});



app.use(function(req,res,next){
  console.log("about to look for post routes!!!")
  next()
});

function processFormData(req,res,next){
  res.render('formdata',
     {title:"Form Data",url:req.body.url, coms:req.body.theComments});
}


app.post('/processform',commentController.saveComments)

app.get('/showComments',commentController.getAllComments)

app.get('/showComment/:id',commentController.getAllComments)

app.get('/calendar',
  function(req,res){
     res.render('calendar',{})
})

app.get('/suggestions',
  function(req,res){
     res.render('suggestions',{})
})

app.get('/historyData',
   isLoggedIn,
   (req,res)=>{
       res.render('historyData')
})

app.post('/processStart',timeRecordingController.saveStartTime)

app.post('/processEnd',timeRecordingController.saveEndTime)

app.get('/timeResult', timeRecordingController.getTimeRecording)

app.get('/timeRecording', (req, res) => {
  res.render('timeRecording',{title:"timeRecording"});
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
