/**
 * Created by Jordan on 08/04/2015.
 */
'use strict';

var hippie  = require('hippie');
var timers = require('timers');

module.exports = function (option) {

    var app = option.app;
    var models = option.models;

    describe('Get follower', function () {

        beforeEach(function (done) {
            this.timeout(10000);
            models.sequelize.sync({force: true}).then(function () {
                timers.setTimeout(done, 3000);
            });
        });

        //it('should return an error - no credentials', function (done) {
        //    hippie(app)
        //        .get('/following')
        //        .json()
        //        .end(function (err, res) {
        //            expect(res.statusCode).to.equal(403);
        //            done();
        //        });
        //});
        //
        //it('should return an error - bad credentials', function (done) {
        //    hippie(app)
        //        .header('Authorization', 'Bearer bearer_value')
        //        .get('/following')
        //        .end(function (err, res) {
        //            expect(res.statusCode).to.equal(403);
        //            done();
        //        });
        //});

        it('should succeed', function (done) {
            this.timeout(10000);
            models.Sequelize.Promise.join(
                models.User.create({ email: 'user1@gmail.com', username: 'User 1' }),
                models.User.create({ email: 'user2@gmail.com', username: 'User 2'  }),
                models.UserToken.create(),
                models.UserToken.create(),
                function (user1, user2, userToken1, userToken2) {
                    models.Sequelize.Promise.join(
                        user1.addUserToken(userToken1),
                        user2.addUserToken(userToken2),
                        user2.addFollowing(user1),
                        function () {
                            hippie(app)
                                .header('Authorization', 'Bearer ' + userToken1.value)
                                .get('/followers')
                                .json()
                                .expectStatus(200)
                                .expectValue('followers[0].id', 2)
                                .expectValue('followers[0].username', 'User 2')
                                .end(function (err) {
                                    if (err) throw err;
                                    done()
                                })
                        });
                }
            )
        })

    });
};