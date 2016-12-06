var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
var Application = require('../models/application');
// Register
router.get('/register', function(req, res){
	res.render('register');
});

// Login
router.get('/login', function(req, res){
	res.render('login');
});

// // Applications
// router.get('/applications', function(req, res){
// Application.viewTable( function(err, application){
// 		if(err) throw err;
// 		console.log(application);
// 		res.render('applications',{apps : application });
// });
// });

// Register User
router.post('/register', function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 =req.body.password2;

	// Validation
	req.checkBody('name', 'Name is require').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password
		});
		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');

		res.redirect('/users/login');
	}
});

// Add App
router.post('/addApp', function(req,res){
	var appName = req.body.appName;
	var companyDomain = req.body.companyDomain;
	var appVersion = req.body.appVersion;

	// Validation
	req.checkBody('appName', 'Application Name is require').notEmpty();
	req.checkBody('companyDomain', 'Company Domain is required').notEmpty();
	req.checkBody('appVersion', 'Aplication Version is required').notEmpty();

	var errors = req.validationErrors();

	if(errors){
		res.render('index',{
			errors:errors
		});
	} else {
		var newApplication = new Application({
			username: req.user.username,
			appName: appName,
			companyDomain: companyDomain,
			appVersion: appVersion
		});
		Application.addApplication(newApplication, function(err, application){
			if(err) throw err;
			console.log(application);
		});
		
		req.flash('success_msg', 'Your App added');

		res.redirect('/');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
  	User.getUserByUsername(username, function(err,user){
  		if(err) throw err;
  		if(!user){
  			return done(null, false,{massage: 'unknown user'});
		}

		User.comparePassword(password, user.password, function(err, isMatch){
			if(err) throw err;
			if(isMatch){
				return done(null,user);
			} else {
				return done(null, false, {message: 'invalid password'});
			}
		});
  	});
}));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local',{successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  	function(req, res) {
  	res.redirect('/');
  });

// Logout
router.get('/logout', function(req, res){
	req.logout();
	
	req.flash('success_msg', 'you are logged out');

	res.redirect('/users/login');
});


module.exports = router;