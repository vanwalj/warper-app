/**
 * Created by Jordan on 2/25/2015.
 */

var hippie  = require('hippie'),
    expect  = require('chai').expect;

module.exports = function (option) {

    var app = option.app;
    var models = option.models;

    describe('Facebook connection', function () {
        beforeEach(function (done) {
            models.sequelize.sync({force: true}).then(function () {
                done();
            });
        });

        it('should return an error - no facebook token', function (done) {
            hippie(app)
                .json()
                .post('/user/token/facebook')
                .send()
                .expectStatus(403)
                .end(function (err) {
                    if (err) throw err;
                    done();
                });
        });

        it('should return an error - bad facebook token', function (done) {
            this.timeout(20000);

            hippie(app)
                .json()
                .post('/user/token/facebook')
                .send({access_token: 'lol'})
                .expectStatus(403)
                .end(function (err) {
                    if (err) throw err;
                    done();
                });
        });

        it('should return a user token', function (done) {
            this.timeout(20000);
            hippie().get('https://graph.facebook.com/oauth/access_token?client_id=716234218459523&client_secret=399617b25aa652ab6ce0cd41b1046695&grant_type=client_credentials')
                .end(function (err, res, body) {
                    var re = /access_token=(.*)/g;
                    var m = re.exec(body);
                    hippie().post('https://graph.facebook.com/v2.2/716234218459523/accounts/test-users')
                        .form()
                        .send({ access_token: m[1], installed: true, permissions: 'email' })
                        .end(function (err, res, body) {
                            var data = JSON.parse(body);
                            hippie(app)
                                .json()
                                .post('/user/token/facebook')
                                .send({access_token: data.access_token})
                                .expectStatus(201)
                                .expect(function (res, body, next) {
                                    next( body.access_token ? undefined : "Error" )
                                })
                                .end(function (err) {
                                    if (err) throw err;
                                    done();
                                });
                        });
                });
        })
    });
};