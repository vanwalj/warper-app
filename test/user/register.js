/**
 * Created by Jordan on 2/25/2015.
 */

var hippie  = require('hippie'),
    expect  = require('chai').expect;

module.exports = function (option) {

    var app = option.app;
    var models = option.models;

    describe('Register', function () {

        beforeEach(function (done) {
            models.sequelize.sync({force: true}).then(function () {
                done();
            });
        });

        it('should fail and return a client error because password and mail are omitted.', function (done) {
            hippie(app)
                .post('/register')
                .expectStatus(400)
                .end(function (err) {
                    if (err) throw err;
                    done();
                });
        });

        it('should fail and return a client error because email is omitted.', function (done) {
            hippie(app)
                .post('/register')
                .json()
                .send({password: "password"})
                .expectStatus(400)
                .end(function (err) {
                    if (err) throw err;
                    done();
                });
        });

        it('should fail and return a client error because password is omitted.', function (done) {
            hippie(app)
                .post('/register')
                .json()
                .send({email: "email"})
                .expectStatus(400)
                .end(function (err) {
                    if (err) throw err;
                    done();
                });
        });

        it('should fail and return a client error because email is badly formatted.', function (done) {
            var newUser = {
                email: "email.com",
                password: "password"
            };

            hippie(app)
                .post('/register')
                .send(newUser)
                .json()
                .expectStatus(400)
                .end(function (err) {
                    if (err) throw err;
                    done();
                });
        });

        it('should fail and return an error because the email is already used.', function (done) {
            var newUser = {
                email: "email@email.com",
                password: "password"
            };

            hippie(app)
                .post('/register')
                .json()
                .send(newUser)
                .expectStatus(201)
                .end(function (err) {
                    if (err) throw err;
                    hippie(app)
                        .post('/register')
                        .json()
                        .send(newUser)
                        .expectStatus(409)
                        .end(function (err) {
                            if (err) throw err;
                            done();
                        });
                });
        });

        it('should success and create a new user.', function (done) {
            var newUser = {
                email: "email@email.com",
                password: "password"
            };

            hippie(app)
                .json()
                .post('/register')
                .send(newUser)
                .expectStatus(201)
                .end(function (err) {
                    if (err) throw err;
                    models.User.findOne({email: newUser.email})
                        .then(function (user) {
                            expect(user.email).to.equal(newUser.email);
                            done();
                        }).catch(function (err) {
                            throw err;
                        });
                });
        });
    });
};