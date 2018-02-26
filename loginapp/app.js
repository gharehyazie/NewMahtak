var express = require('express');

var i18next = require('i18next');
var i18nextMiddleware = require('i18next-express-middleware');
var Backend = require('i18next-node-fs-backend');

var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongo = require('mongodb');
var mongoose = require('mongoose');

mongoose.connect('mongodb://mohsenhq:Mohsenhq102@localhost:27017/loginapp?authMechanism=DEFAULT&authSource=admin');
var db = mongoose.connection;

var routes = require('./routes/index');
var piwik = require('./routes/piwik');
var users = require('./routes/users');

i18next
    .use(Backend)
    .use(i18nextMiddleware.LanguageDetector)
    .init({
        backend: {
            loadPath: __dirname + '/locales/{{lng}}.json',
            addPath: __dirname + '/locales/{{lng}}.missing.json'
        },
        detection: {
            order: ['session'],
            lookupSession: 'lng'
        },
        fallbackLng: 'en',
        preload: ['en', 'fa'],
        saveMissing: true
    }, function() {
        i18nextMiddleware.addRoute(i18next, '/:lng/key-to-translate', ['en', 'fa'], app, 'get', function(req, res) {});
    });

// Init App
var app = express();

app.use(i18nextMiddleware.handle(i18next, {
    removeLngFromUrl: false
}));


// View Engine
// app.set('views', path.join(__dirname, 'views'));
app.set('views', path.join(__dirname, 'production'));
// app.engine('handlebars', exphbs({ defaultLayout: 'layout' }));
// app.set('view engine', 'handlebars');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;

        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// app.set("lang","en");

app.use('/', routes);
app.use('/piwik', piwik);
app.use('/users', users);
// Set Port
app.set('port', (process.env.PORT || 3000));

app.listen(app.get('port'), function() {
    console.log('Server started on port ' + app.get('port'));
});
module.exports = app;