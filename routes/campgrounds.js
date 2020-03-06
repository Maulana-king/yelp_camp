var express = require("express");
var router  = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware"); //secara otomatis merujuk /index.js


// INDEX - show all
router.get("/", function(req, res){
    // Get all campgrounds from DataBase
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user, page: 'campgrounds'});
        }
    }); 
});

//CREATE - add new campground to the DB
router.post("/", middleware.isLoggedIn, function(req, res){
    // Mendapatkan data dari form dan add to campground array
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username : req.user.username
    }
    var newCampgrounds = {name: name, price: price, image: image, description: description, author: author};
    // Create a new campgrounds and save to the database
    Campground.create(newCampgrounds, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
             // Redirect back to campgrounds page
             console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    })
   
    
});


//NEW - show form to create new campgrounds
router.get("/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new")
});

//SHOW - show more info about one camprgounds
router.get("/:id",function(req, res){
    //Find the campground with the provide ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground);
            //Render show tempalte with that campground
            res.render("campgrounds/show", {campground: foundCampground}); 
        }
    })
    req.params.id
});

// EDIT CAMPGROUNDS ROUTE
router.get("/:id/edit", middleware.checkCampgroundOwnership, function(req, res){
    // is user login
        Campground.findById(req.params.id, function(err, foundCampground){
            req.flash("error", "Campground not found");
            res.render("campgrounds/edit", {campground: foundCampground});
        });
});

//UPDATE CAMPGROUNDS ROUTE
router.put("/:id", middleware.checkCampgroundOwnership, function(req, res){
    // find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updateCampground){
        if(err){
            res.redirect("/camgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    //redirect somewhere(show page)
});

// DESTROY CAMPGROUND ROUTE
router.delete("/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});


module.exports = router;