var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user');
var Application = require('../models/application');
// Register
// router.get('/register', function(req, res) {
//     res.render('register');
// });

// Login
router.get('/login', function(req, res) {
    res.render('login');
});

// Checks form username in data base for Validation
router.post('/checkUsername', function(req, res) {
    var username = req.body.username;
    User.getUserByUsername(username, function(err, user) {
        if (!user) {
            res.write('true');
        } else {
            res.write('"username already exists"');
        }
        res.end();
    });
});

// Checks form Email in data base for Validation
router.post('/checkEmail', function(req, res) {
    var email = req.body.email;
    User.getUserByEmail(email, function(err, user) {
        if (!user) {
            res.write('true');
        } else {
            res.write('"Email already exists"');
        }
        res.end();
    });
});

// Register User
router.post('/register', function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    // Validation
    req.checkBody('name', 'Name is require').notEmpty();
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('email', 'Email is not valid').isEmail();
    req.checkBody('username', 'Username is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

    var errors = req.validationErrors();

    if (errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        var newUser = new User({
            name: name,
            email: email,
            username: username,
            password: password
        });
        User.createUser(newUser, function(err, user) {
            if (err) throw err;
            console.log(user);
        });

        req.flash('success_msg', 'You are registered and can now login');

        res.redirect('/users/login');
    }
});

// Add App
router.post('/addApp', function(req, res) {
    var appName = req.body.appName;
    var PACKAGE_NAME = req.body.PACKAGE_NAME;
    var appVersion = req.body.appVersion;

    // Validation
    // req.checkBody('appName', 'Application Name is require').notEmpty();
    // req.checkBody('PACKAGE_NAME', 'PACKAGE_NAME is required').notEmpty();
    // req.checkBody('appVersion', 'Aplication Version is required').notEmpty();

    // var errors = req.validationErrors();

    // if (errors) {
    //     res.render('index', {
    //         errors: errors
    //     });
    // } else {
    var newApplication = new Application({
        "username": req.user.username,
        "appName": appName,
        "PACKAGE_NAME": PACKAGE_NAME,
        "appVersion": appVersion
    });
    Application.addApplication(newApplication, function(err, application) {
        if (err) throw err;
        // console.log(application);
        // req.flash('success_msg', 'Your App added');

        console.log("done");
        res.write("");
        res.end();
    });
    // }
});

passport.use(new LocalStrategy(
    function(username, password, done) {
        // Find User in the database by @username if there was no User sends error message
        User.getUserByUsername(username, function(err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'unknown user' });
            }
            // Compare entered pass with database 
            User.comparePassword(password, user.password, function(err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'invalid password' });
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
// logging in 
router.post('/login',
    passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true }),
    function(req, res) {
        res.redirect('/');
    });

// Logout
router.get('/logout', function(req, res) {
    req.logout();

    req.flash('success_msg', 'you are logged out');

    res.redirect('/users/login');
});


module.exports = router;