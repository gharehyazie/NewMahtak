var User, app, mongoose, request, expect, user;

expect = require("chai").expect;
app = require("../app");
User = require('../models/user');
var request = require('supertest');

describe('User', function() {
    before(function(done) {
        user = new User({
            name: "test",
            email: "user@user.com",
            username: "test",
            password: "1234qwer"
        });
        User.createUser(user, function(err, user) {
            if (err) throw err;
        });
        done();
    });
    describe('Login test', function() {
        app.request.isAuthenticated = function() {
            return true;
        };
        it('1: should redirect to /', function(done) {
            request(app)
                .post('/users/login')
                .send({ username: 'test', password: '1234qwer' })
                .expect(302)
                .end(function(err, res) {
                    expect(res.header.location).to.equal('/');
                    if (err) return done(err);
                    done();
                });
        });
        // it('1: render /', function(done) {
        //     request(app)
        //         .get('/')
        //         .expect(200)
        //         .end(function(err, res) {
        //             expect(res.text).to.be.ok;
        //             if (err) return done(err);
        //             done();
        //         });
        // });
        it('2: return json Installdate', function(done) {
            request(app)
                .post('/installDate')
                .expect(200)
                .end(function(err, res) {
                    // console.log((res.text));
                    expect(res.text).to.be.ok;
                    if (err) return done(err);
                    done();
                });
        });
        it('3: return json DailyUsers', function(done) {
            request(app)
                .post('/dailyUsers')
                .expect(200)
                .end(function(err, res) {
                    // console.log((res.text));
                    expect(res.text).to.be.ok;
                    if (err) return done(err);
                    done();
                });
        });
        it('4: return json UsageDate', function(done) {
            request(app)
                .post('/usageDate')
                .expect(200)
                .end(function(err, res) {
                    // console.log((res.text));
                    expect(res.text).to.be.ok;
                    if (err) return done(err);
                    done();
                });
        });
        it('5: call webapi', function(done) {
            request(app)
                .get('/build/test')
                .expect(302)
                .end(function(err, res) {
                    expect(res.header.location).to.equal('/');
                    expect(res.text).to.be.ok;
                    if (err) return done(err);
                    done();
                });
        });
        it('6: call Dashboard', function(done) {
            request(app)
                .get('/MahtakDashboard')
                .expect(200)
                .end(function(err, res) {
                    expect(res.text).to.contain('<title>RazorFlow Quick Start</title>');
                    if (err) return done(err);
                    done();
                });
        });
        it('7: addApp', function(done) {
            request(app)
                .get('/addApp')
                .expect(200)
                .end(function(err, res) {
                    expect(res.text).to.be.ok;
                    if (err) return done(err);
                    done();
                });
        });
        after(function(done) {
            User.remove().exec();
            return done();
        });
    });
});