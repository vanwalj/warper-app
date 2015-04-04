/**
 * Created by Jordan on 2/25/2015.
 */

var hippie  = require('hippie');

module.exports = function (option) {

    var app = option.app;
    var models = option.models;

    describe('Get account', function () {

        beforeEach(function (done) {
            models.sequelize.sync({force: true}).then(function () {
                done();
            });
        });

        it('should return an error - no credentials', function (done) {
            hippie(app)
                .get('/user')
                .json()
                .expectStatus(403)
                .end(function (err) {
                    if (err) throw err;
                    done();
                });
        });

        it('should return an error - bad credentials', function (done) {
            hippie(app)
                .header('Authorization', 'Bearer bearer_value')
                .get('/user')
                .expectStatus(403)
                .end(function (err) {
                    if (err) throw err;
                    done();
                });
        });

        it('should return the user account', function (done) {
            models.User.create({ email: 'user@mail.com', gender: 'male', firstName: 'Jean', lastName: 'YOLO', username: 'username' })
                .then(function (user) {
                    models.Sequelize.Promise.join(
                        models.EmailAuth.create({ email: 'user@mail.com', password: 'password' }),
                        models.UserToken.create(),
                        function (emailAuth, userToken) {
                            models.Sequelize.Promise.join(
                                user.setEmailAuth(emailAuth),
                                user.addUserToken(userToken),
                                function () {
                                    hippie(app)
                                        .header('Authorization', 'Bearer ' + userToken.value)
                                        .get('/user')
                                        .json()
                                        .expectValue('id', user.id)
                                        .expectValue('email', user.email)
                                        .expectValue('firstName', user.firstName)
                                        .expectValue('lastName', user.lastName)
                                        .expectValue('username', user.username)
                                        .expectStatus(200)
                                        .end(function (err) {
                                            if (err) throw err;
                                            done();
                                        });
                                }
                            )
                        });

                });
        });

    });
};