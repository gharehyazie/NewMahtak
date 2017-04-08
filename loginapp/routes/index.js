var express = require('express');
var path = require('path');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var btoa = require('btoa');
var router = express.Router();
var Application = require('../models/application');

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

router.get('/', ensureAuthenticated, function(req, res) {
    Application.viewTable(res.locals.user.username, function(err, application) {
        if (err) throw err;
        res.render('applications', { apps: application });
    });
});
router.get('/addApp', ensureAuthenticated, function(req, res) {
    res.render('index');
});

router.get('/Build/*', ensureAuthenticated, function(req, res) {
    CallWebAPI(req.params[0]);
    res.redirect('/');
});

// opens dashboard html page 
router.get('/MahtakDashboard', ensureAuthenticated, function(req, res) {
    // res.sendFile(path.join(__dirname, '../public', 'index2.html'));
    res.render('dashboard');
});

// query @installDate db and responds @dates and @newInstalls 
router.post('/installDate', ensureAuthenticated, function(req, res) {
    MongoClient.connect('mongodb://mohsenhq:Mohsenhq102@localhost:27017/data?authMechanism=DEFAULT&authSource=admin', function(err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err)
        } else {
            var collection = db.collection('installDate');
            collection.find({}, { _id: 0 }).sort({ _id: +1 }).toArray(function(err, results) {
                var installDateArray = { 'dates': [], 'newInstalls': [] };
                for (i = 0; i < results.length; i++) {
                    installDateArray.dates.push(results[i].date);
                    installDateArray.newInstalls.push(results[i].newInstalls);
                }
                res.write(JSON.stringify(installDateArray));
                res.end();

            });
        }
    });
});

// query @dailyUsers db and responds @dates and @usersNumber
router.post('/dailyUsers', ensureAuthenticated, function(req, res) {
    MongoClient.connect('mongodb://mohsenhq:Mohsenhq102@localhost:27017/data?authMechanism=DEFAULT&authSource=admin', function(err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err)
        } else {
            var collection = db.collection('dailyUsers');
            collection.find({}, { _id: 0 }).toArray(function(err, results) {
                var dailyUsersArray = { 'dates': [], 'usersNumber': [] };
                for (i = 0; i < results.length; i++) {
                    dailyUsersArray.dates.push(results[i].date);
                    dailyUsersArray.usersNumber.push(results[i].UUID.length);
                }
                res.write(JSON.stringify(dailyUsersArray));
                res.end();
            });
        }
    });
});

// query @usageDate db and responds @dates and @sequences 
router.post('/usageDate', ensureAuthenticated, function(req, res) {
    MongoClient.connect('mongodb://mohsenhq:Mohsenhq102@localhost:27017/data?authMechanism=DEFAULT&authSource=admin', function(err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err)
        } else {
            var collection = db.collection('usageDate');
            collection.find({}, { _id: 0 }).sort({ _id: +1 }).toArray(function(err, results) {
                var usageDateArray = { 'dates': [], 'sequences': [] };
                for (i = 0; i < results.length; i++) {
                    usageDateArray.dates.push(results[i].date);
                    usageDateArray.sequences.push(results[i].sequence);
                }
                res.write(JSON.stringify(usageDateArray));
                res.end();
            });
        }
    });
});

// query @
router.post('/duration', ensureAuthenticated, function(req, res) {
    MongoClient.connect('mongodb://mohsenhq:Mohsenhq102@localhost:27017/data?authMechanism=DEFAULT&authSource=admin', function(err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err)
        } else {
            var collection = db.collection('duration');
            collection.aggregate([{ $group: { _id: "$duration", count: { $sum: 1 } } }]).sort({ _id: +1 }).toArray(function(err, results) {
                var duration = { 'time': [], 'count': [] };
                for (i = 0; i < results.length; i++) {
                    duration.time.push(results[i]._id);
                    duration.count.push(results[i].count);
                }
                res.write(JSON.stringify(duration));
                res.end();
            });
        }
    });
});

// query @
router.post('/dailyDuration', ensureAuthenticated, function(req, res) {
    MongoClient.connect('mongodb://mohsenhq:Mohsenhq102@localhost:27017/data?authMechanism=DEFAULT&authSource=admin', function(err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err)
        } else {
            var collection = db.collection('duration');
            collection.aggregate([{ $group: { _id: "$date", duration: { $sum: "$duration" } } }]).sort({ _id: +1 }).toArray(function(err, results) {
                var duration = { 'date': [], 'duration': [] };
                for (i = 0; i < results.length; i++) {
                    duration.date.push(results[i]._id);
                    duration.duration.push(results[i].duration);
                }
                res.write(JSON.stringify(duration));
                res.end();
            });
        }
    });
});

router.post('/deviceType', ensureAuthenticated, function(req, res) {
    MongoClient.connect('mongodb://mohsenhq:Mohsenhq102@localhost:27017/data?authMechanism=DEFAULT&authSource=admin', function(err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err)
        } else {
            // var collection = db.collection('usageDate');
            // collection.find({}, { _id: 0 }).sort({ _id: +1 }).toArray(function(err, results) {
            //     var usageDateArray = { 'dates': [], 'sequences': [] };
            //     for (i = 0; i < results.length; i++) {
            //         usageDateArray.dates.push(results[i].date);
            //         usageDateArray.sequences.push(results[i].sequence);
            //     }
            //     res.write(JSON.stringify(usageDateArray));
            //     res.end();
            // });
            var deviceTypes = { 'types': ['Android', 'IOS', 'Other'], 'percent': [80, 5, 15] };
            res.write(JSON.stringify(deviceTypes));
            res.end();
        }
    });
});

function authenticateUser(user, password) {
    var token = user + ":" + password;
    // Base64 Encoding -> btoa
    var hash = btoa(token);
    return "Basic " + hash;
};


/**
 * checks if request is from logged in user
 * if not returns to login page
 */
function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        // req.flash('error_msg','You are not logged in');
        res.redirect('/users/login');
    }
}

//calls jenkins to build aar file 
function CallWebAPI(a) {
    var username = a;
    var request = new XMLHttpRequest();
    request.open("POST", "http://198.143.180.135:8080/job/Module/buildWithParameters?token=mohsen&AAR=aarName=" + username, false);
    request.setRequestHeader("Authorization", authenticateUser('mohsenhq', 'Mohsenhq102w.hq'));
    request.send();
};

module.exports = router;