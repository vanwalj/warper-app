/**
 * Created by Jordan on 4/2/2015.
 */

var hippie  = require('hippie');
var expect  = require('chai').expect;

module.exports = function (option) {

    var app = option.app;
    var models = option.models;

    describe('Follow', function () {

        beforeEach(function (done) {
            models.sequelize.sync({force: true}).then(function () {
                done();
            });
        });

        it('should return an error - no credentials', function (done) {
            hippie(app)
                .post('/follow/1')
                .json()
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(403);
                    done();
                });
        });

        it('should return an error - bad credentials', function (done) {
            hippie(app)
                .header('Authorization', 'Bearer bearer_value')
                .post('/follow/1')
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(403);
                    done();
                });
        });

        it('should succeed', function (done) {
            models.Sequelize.Promise.join(
                models.User.create({ email: 'user1@gmail.com' }),
                models.User.create({ email: 'user2@gmail.com' }),
                models.UserToken.create(),
                models.UserToken.create(),
                function (user1, user2, userToken1, userToken2) {
                    models.Sequelize.Promise.join(
                        user1.addUserToken(userToken1),
                        user2.addUserToken(userToken2),
                        function () {
                            hippie(app)
                                .header('Authorization', 'Bearer ' + userToken1.value)
                                .post('/follow/' + user2.id)
                                .json()
                                .expectStatus(200)
                                .expectValue('friends', false)
                                .end(function (err) {
                                    if (err) throw err;
                                    hippie(app)
                                        .header('Authorization', 'Bearer ' + userToken2.value)
                                        .post('/follow/' + user1.id)
                                        .json()
                                        .expectStatus(200)
                                        .expectValue('friends', true)
                                        .end(function (err) {
                                            if (err) throw err;
                                            done();
                                        })
                                })
                        });
                }
            )
        })

    });
};