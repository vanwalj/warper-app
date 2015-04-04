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
                function (user, userToken) {
                    return user.addUserToken(userToken)
                        .return([user, userToken]);
                }
            )
                .spread(function (user, userToken) {
                    hippie(app)
                        .post('/warp/request-upload')
                        .json()
                        .header('Authorization', 'Bearer ' + userToken.value)
                        .send({
                            contentLength: 7899,
                            contentType: 'image/png',
                            latitude: 48.109851,
                            longitude: -1.679404
                        })
                        .expectStatus(201)
                        .expect(function (res, body, next) {
                            next(!body.url);
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