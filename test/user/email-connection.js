/**
 * Created by Jordan on 2/25/2015.
 */

var hippie  = require('hippie'),
    expect  = require('chai').expect;

module.exports = function (option) {

    var app = option.app;
    var models = option.models;

    describe('Email connection', function () {

        beforeEach(function (done) {
            models.sequelize.sync({force: true}).then(function () {
                done();
            });
        });

        it('Should return a 403 since no credentials are set.', function (done) {
            hippie(app)
                .post('/user/token/email')
                .expectStatus(403)
                .end(function (err) {
                    if (err) throw err;
                    done();
                });
        });

        it('Should return a 403 since user does not exist.', function (done) {
            hippie(app)
                .post('/user/token/email')
                .auth('user', 'password')
                .expectStatus(403)
                .end(function (err) {
                    if (err) throw err;
                    done();
                });
        });

        it('Should return a 200 and a token.', function (done) {

            var newUser = {
                email: "email@email.com",
                password: "password"
            };

            models.User.create(newUser)
                .then(function (user) {
                    models.EmailAuth.create(newUser)
                        .then(function (emailAuth) {
                            return user.setEmailAuth(emailAuth);
                        })
                        .then(function () {
                            hippie(app)
                                .post('/user/token/email')
                                .json()
                                .auth(newUser.email, newUser.password)
                                .expectStatus(200)
                                .expect(function (res, body, next) {
                                    next(body.access_token ? undefined : "Value should not be empty." );
                                })
                                .end(function (err) {
                                    if (err) throw err;
                                    done();
                                });
                        });
                });

        });

    });

};