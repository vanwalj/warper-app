/**
 * Created by Jordan on 4/3/2015.
 */

var hippie  = require('hippie');

module.exports = function (option) {

    var app = option.app;
    var models = option.models;

    describe('Request upload', function () {

        beforeEach(function (done) {
            models.sequelize.sync({force: true}).then(function () {
                done();
            });
        });

        it('should succeed', function (done) {
            models.Sequelize.Promise.join(
                models.User.create({email: 'jordan@test.com'}),
                models.UserToken.create({email: 'jordan@test.com', password: 'yolo4242'}),
                models.User.create({email: 'user1@test.com'}),
                models.User.create({email: 'user2@test.com'}),
                models.User.create({email: 'user3@test.com'}),
                models.User.create({email: 'user4@test.com'}),
                models.User.create({email: 'user5@test.com'}),
                function (user, userToken, user1, user2, user3, user4, user5) {
                    return user.addUserToken(userToken)
                        .then(function (user) {
                            return [user, userToken,[user1.id, user2.id, user3.id, user4.id, user5.id] ];
                        })
                }
            )
                .spread(function (user, userToken, dests) {
                    console.log(dests);
                    hippie(app)
                        .post('/warps/request-upload')
                        .json()
                        .header('Authorization', 'Bearer ' + userToken.value)
                        .send({
                            contentLength: 25652,
                            contentType: 'image/png',
                            latitude: 48.109851,
                            longitude: -1.679404,
                            dest: dests
                        })
                        .expectStatus(201)
                        .expect(function (res, body, next) {
                            next(!body.putUrl);
                        })
                        .end(function (err,res, body) {
                            console.log(body);
                            if (err) throw err;
                            done();
                        });
                });

        });
    });
};