var express    = require('express'),
app            = express(),
bodyParser     = require('body-parser'),
mongoose       = require('mongoose'),
flash          = require('connect-flash'),
passport       = require('passport'),
LocalStrategy  = require('passport-local'),
methodOverride = require("method-override"),
Campground     = require("./models/campground"),
Comment        = require("./models/comment"),
User           = require("./models/user"),
seedDB         = require("./seeds");

//Requring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index")

mongoose.connect("mongodb://localhost:27017/yelp_camp", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');
//seed the database
//seedDB();

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "I will kill you",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

//  Campground.create({
//      name: "Batu Betambuk", 
//      image: "https://www.photosforclass.com/download/pixabay-1845719?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e8d1464d53a514f6da8c7dda793f7f1636dfe2564c704c7d2d7edd9048c15d_960.jpg&user=Pexels",
//      description: "Lokasi batu besar yang saling bertampuk, tidak tersedia kolam, air, hanya batu betampuk yang indah."
//  },
//   function(err, campground){
//      if(err){
//          console.log(err);
//      } else {
//          console.log("New Campground");
//          console.log(campground);
//      }
//  });


//INDEX - Show all campgrounds
// var campgrounds = [
//     {name: "Sungai Bakau", image: "https://www.photosforclass.com/download/pixabay-1149402?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e1d14a4e52ae14f6da8c7dda793f7f1636dfe2564c704c7d2d7ed59249c45f_960.jpg&user=Free-Photos"},
//     {name: "Batu Betambuk", image: "https://www.photosforclass.com/download/pixabay-1845719?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e8d1464d53a514f6da8c7dda793f7f1636dfe2564c704c7d2d7edd9048c15d_960.jpg&user=Pexels"},
//     {name: "Ujung Kulon", image: "https://www.photosforclass.com/download/pixabay-4817872?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F52e8d4444255ae14f6da8c7dda793f7f1636dfe2564c704c7d2d7ed59249c45f_960.jpg&user=chulmin1700"},
//     {name: "Sungai Bakau", image: "https://www.photosforclass.com/download/pixabay-1149402?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e1d14a4e52ae14f6da8c7dda793f7f1636dfe2564c704c7d2d7ed59249c45f_960.jpg&user=Free-Photos"},
//     {name: "Batu Betambuk", image: "https://www.photosforclass.com/download/pixabay-1845719?webUrl=https%3A%2F%2Fpixabay.com%2Fget%2F57e8d1464d53a514f6da8c7dda793f7f1636dfe2564c704c7d2d7edd9048c15d_960.jpg&user=Pexels"}

// ];



app.listen(5000, function(req, res){
    console.log('Server YelpCamp Start Now..!');
});