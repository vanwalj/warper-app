/**
 * Created by Jordan on 2/25/2015.
 */

var hippie  = require('hippie'),
    expect  = require('chai').expect;

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
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(403);
                    done();
                });
        });

        it('should return an error - bad credentials', function (done) {
            hippie(app)
                .header('Authorization', 'Bearer bearer_value')
                .get('/user')
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(403);
                    done();
                });
        });

        it('should return the user account', function (done) {
            models.User.create({ email: 'user@mail.com', gender: 'male' })
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
                                        .end(function (err, res) {
                                            expect(res.statusCode).to.equal(200);
                                            done();
                                        });
                                }
                            )
                        });

                });
        });

    });
};