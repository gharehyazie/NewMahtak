var request = require('supertest');
var expect = require('chai').expect;
var should = require('chai').should;
var app = require('../app');

describe('routes ping', function() {
    it('register', function(done) {
        request(app)
            .get('/users/register')
            .expect(200, function(err, res) {
                if (err) throw err;
                done();
            });
    });
    it('login', function(done) {
        request(app)
            .get('/users/login')
            .expect(200, function(err, res) {
                if (err) throw err;
                done();
            });
    });
    it('logout redirects to "/users/login"', function(done) {
        request(app)
            .get('/users/logout')
            .expect(302, function(err, res) {
                if (err) throw err;
                expect(res.header.location).to.equal('/users/login');
                done();
            });
    });
});