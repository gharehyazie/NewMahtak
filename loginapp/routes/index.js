var express = require('express');
var path = require('path');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var request = require('request');
var btoa = require('btoa');
var router = express.Router();
var Application = require('../models/application');

var mongodb = require('mongodb');
var MongoClient = mongodb.MongoClient;

var appz;
var sitez;
var currentApp;
var currentSite;
var lang = 'en';

router.get('/', ensureAuthenticated, function(req, res) {
    var group = res.locals.user.username;
    url = "http://localhost/piwik/?module=API&method=SitesManager.getSitesFromGroup&group=" + group + "&token_auth=fbfbd1c44a838aa7afc3bb9cf2d3aece&format=JSON";
    request(url, function(error, response, webSites) {
        sitez = JSON.parse(webSites);
        Application.viewTable(res.locals.user.username, function(err, application) {
            if (err) throw err;
            req.i18n.changeLanguage(lang);
            appz = application;
            res.render('projects', {
                apps: application,
                sites: sitez
            });
        });
    });
});

router.get('/projects', ensureAuthenticated, function(req, res) {
    req.i18n.changeLanguage(lang);
    res.render('index', {
        apps: appz,
        sites: sitez
    });
});

router.get('/chartjs', ensureAuthenticated, function(req, res) {
    req.i18n.changeLanguage(lang);
    if (req.query.app != null) {
        currentApp = req.query.app;
    }
    res.render('echarts', {
        apps: appz,
        sites: sitez
    });
});

router.get('/piwik', ensureAuthenticated, function(req, res) {
    req.i18n.changeLanguage(lang);
    if (req.query.site != null) {
        currentSite = req.query.site;
    }
    res.render('piwik', {
        apps: appz,
        sites: sitez,
        currentSite: currentSite
    });
});

router.post('/visits', ensureAuthenticated, function(req, res) {
    var group = res.locals.user.username;
    url2 = "http://localhost/piwik/?module=API&method=VisitsSummary.get&idSite=1&period=day&date=last30&format=JSON&token_auth=fbfbd1c44a838aa7afc3bb9cf2d3aece"
    var visits = {
        'dates': [],
        'visitors': [],
        'uniqueVisitors': [],
        'numberOfActions': [],
        'sumOfVisitsLenght': [],
        'avgTimeOnSite': []
    };
    request(url2, function(error, response, body) {
        resBody = JSON.parse(body);
        for (var i in resBody) {
            visits.dates.push(i);
            if (resBody[i].length == 0) {
                visits.visitors.push(0);
                visits.uniqueVisitors.push(0);
                visits.numberOfActions.push(0);
                visits.sumOfVisitsLenght.push(0);
                visits.avgTimeOnSite.push(0);
            } else {
                visits.visitors.push(resBody[i].nb_visits);
                visits.uniqueVisitors.push(resBody[i].nb_uniq_visitors);
                visits.numberOfActions.push(resBody[i].nb_actions);
                visits.sumOfVisitsLenght.push(resBody[i].sum_visit_length);
                visits.avgTimeOnSite.push(resBody[i].avg_time_on_site);
            }
        }

        res.write(JSON.stringify(visits));
        res.end();
    });

});

router.get('/events', ensureAuthenticated, function(req, res) {
    req.i18n.changeLanguage(lang);
    if (req.query.app != null) {
        currentApp = req.query.app;
    }
    res.render('events', {
        apps: appz,
        sites: sitez
    });
});


router.get('/chartjs2', ensureAuthenticated, function(req, res) {
    req.i18n.changeLanguage(lang);
    if (req.query.app != null) {
        currentApp = req.query.app;
    }
    res.render('chartjs', {
        apps: appz,
        sites: sitez
    });
});

router.get('/addApp', ensureAuthenticated, function(req, res) {
    res.render('index');
});

router.get('/Build/*', ensureAuthenticated, function(req, res) {
    CallWebAPI(req.params[0]);
    res.redirect('/projects');
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
            collection.find({
                "APP": currentApp
            }, {
                _id: 0
            }).sort({
                _id: +1
            }).toArray(function(err, results) {
                var installDateArray = {
                    'dates': [],
                    'newInstalls': [],
                    'totalInstalls': [],
                    'app': [currentApp]
                };
                // var installDateArray = [];
                var sumInstals = 0;
                for (i = 0; i < results.length; i++) {
                    // installDateArray.push([results[i].date, results[i].newInstalls]);
                    installDateArray.dates.push(results[i].date);
                    installDateArray.newInstalls.push(results[i].newInstalls);
                    sumInstals += results[i].newInstalls;
                }
                installDateArray.totalInstalls.push(sumInstals);
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
            collection.find({
                "APP": currentApp
            }, {
                _id: 0
            }).toArray(function(err, results) {
                var dailyUsersArray = {
                    'dates': [],
                    'usersNumber': []
                };
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
            collection.find({
                "APP": currentApp
            }, {
                _id: 0
            }).sort({
                _id: +1
            }).toArray(function(err, results) {
                var usageDateArray = {
                    'dates': [],
                    'sequences': []
                };
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
            collection.aggregate([{
                $match: {
                    "APP": currentApp
                }
            }, {
                $group: {
                    _id: "$duration",
                    count: {
                        $sum: 1
                    }
                }
            }]).sort({
                _id: +1
            }).toArray(function(err, results) {
                var duration = {
                    'time': [],
                    'count': []
                };
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

// ToDo item first
router.post('/custom', ensureAuthenticated, function(req, res) {
    MongoClient.connect('mongodb://mohsenhq:Mohsenhq102@localhost:27017/data?authMechanism=DEFAULT&authSource=admin', function(err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err)
        } else {
            var responds = {};
            var selectedEvents = req.body.selectedEvents;
            var collection = db.collection('data');
            var customCharts = db.collection('customCharts');
            customCharts.update({ 'APP': currentApp }, { $addToSet: { 'values': selectedEvents } }, { 'upsert': true }, function(err, result) {
                if (err) {
                    console.log("hello .. " + err)
                }
            });
            selectedEvents.forEach(function(element) {
                collection.aggregate([{
                        $match: {
                            "PACKAGE_NAME": currentApp,
                            [element]: {
                                $exists: true
                            }
                        }
                    },
                    {
                        $group: {
                            _id: {
                                $substr: ['$date', 0, 10]
                            },
                            count: {
                                $sum: "$" + element
                            }
                        }
                    }
                ]).toArray(function(err, results) {
                    var temp = {
                        'date': [],
                        'count': []
                    };
                    for (i = 0; i < results.length; i++) {
                        temp.date.push(results[i]._id);
                        temp.count.push(results[i].count);
                        responds[element] = temp;
                    }
                    if (Object.keys(responds).length === selectedEvents.length) {
                        res.write(JSON.stringify(responds));
                        res.end();
                    }
                });
            });
            // });
        }
    });
});

router.post("/loadCustoms", ensureAuthenticated, function(req, res) {
    MongoClient.connect('mongodb://mohsenhq:Mohsenhq102@localhost:27017/data?authMechanism=DEFAULT&authSource=admin', function(err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err)
        } else {
            var customCharts = db.collection('customCharts');
            customCharts.find({ 'APP': currentApp }).toArray(function(err, result) {
                if (err) {
                    console.log("hello .. " + err)
                } else {
                    if (result.length > 0) {
                        res.write(JSON.stringify(result[0].values));
                        res.end();
                    }
                }

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
            collection.aggregate([{
                $match: {
                    "APP": currentApp
                }
            }, {
                $group: {
                    _id: "$date",
                    duration: {
                        $sum: "$duration"
                    }
                }
            }]).sort({
                _id: +1
            }).toArray(function(err, results) {
                var duration = {
                    'date': [],
                    'duration': []
                };
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


// query @
router.post('/operator', ensureAuthenticated, function(req, res) {
    MongoClient.connect('mongodb://mohsenhq:Mohsenhq102@localhost:27017/data?authMechanism=DEFAULT&authSource=admin', function(err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err)
        } else {
            var collection = db.collection('data');
            collection.aggregate([{
                $match: {
                    "APP": currentApp
                }
            }, {
                $group: {
                    _id: "$Network Operator name",
                    count: {
                        $sum: 1
                    }
                }
            }]).sort({
                _id: +1
            }).toArray(function(err, results) {
                var operators = {
                    'operator': [],
                    'count': []
                };
                for (i = 0; i < results.length; i++) {
                    operators.operator.push(results[i]._id);
                    operators.count.push(results[i].count);
                }
                res.write(JSON.stringify(operators));
                res.end();
            });
        }
    });
});


// query @
router.post('/manufacturer', ensureAuthenticated, function(req, res) {
    MongoClient.connect('mongodb://mohsenhq:Mohsenhq102@localhost:27017/data?authMechanism=DEFAULT&authSource=admin', function(err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err)
        } else {
            var collection = db.collection('data');
            collection.aggregate([{
                $match: {
                    "APP": currentApp
                }
            }, {
                $group: {
                    _id: "$Manufacturer",
                    count: {
                        $sum: 1
                    }
                }
            }]).sort({
                _id: +1
            }).toArray(function(err, results) {
                var Manufacturers = {
                    'manufacturer': [],
                    'count': []
                };
                for (i = 0; i < results.length; i++) {
                    Manufacturers.manufacturer.push(results[i]._id);
                    Manufacturers.count.push(results[i].count);
                }
                res.write(JSON.stringify(Manufacturers));
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
            var deviceTypes = {
                'types': ['Android', 'IOS', 'Other'],
                'percent': [80, 5, 15]
            };
            res.write(JSON.stringify(deviceTypes));
            res.end();
        }
    });
});

// query @
router.post('/appVersion', ensureAuthenticated, function(req, res) {
    MongoClient.connect('mongodb://mohsenhq:Mohsenhq102@localhost:27017/data?authMechanism=DEFAULT&authSource=admin', function(err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err)
        } else {
            var collection = db.collection('data');
            collection.aggregate([{
                $match: {
                    "APP": currentApp
                }
            }, {
                $group: {
                    _id: "$versuinName",
                    count: {
                        $sum: 1
                    }
                }
            }]).sort({
                _id: +1
            }).toArray(function(err, results) {
                var Versions = {
                    'versuinName': [],
                    'count': []
                };
                for (i = 0; i < results.length; i++) {
                    Versions.versuinName.push(results[i]._id);
                    Versions.count.push(results[i].count);
                }
                res.write(JSON.stringify(Versions));
                res.end();
            });
        }
    });
});

router.post('/customEvent', ensureAuthenticated, function(req, res) {
    MongoClient.connect('mongodb://mohsenhq:Mohsenhq102@localhost:27017/data?authMechanism=DEFAULT&authSource=admin', function(err, db) {
        if (err) {
            console.log('Unable to connect to the mongoDB server. Error:', err)
        } else {
            var collection = db.collection('customEvent');
            collection.find({
                "APP": currentApp
            }, {
                _id: 0,
                custom: 1
            }).toArray(function(err, results) {
                res.write(JSON.stringify(results[0].custom));
                res.end();
            });
        }
    });
});


router.get('/changeLng', ensureAuthenticated, function(req, res) {
    // if (req.session.lng == 'en') {
    //     req.session.lng = 'fa'
    // } else {
    //     req.session.lng = 'en'
    // }
    if (lang == 'en') {
        lang = 'fa';
    } else {
        lang = 'en';
    }
    res.redirect(req.get('referer'));
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