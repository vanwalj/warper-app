/**
 * Created by Jordan on 2/25/2015.
 */

var hippie  = require('hippie'),
    expect  = require('chai').expect;

module.exports = function (option) {

    var app = option.app;
    var models = option.models;

    describe('Edit account', function () {

        beforeEach(function (done) {
            models.sequelize.sync({force: true}).then(function () {
                done();
            });
        });

        it('should return an error - no credentials', function (done) {
            hippie(app)
                .put('/user')
                .json()
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(403);
                    done();
                });
        });

        it('should return an error - bad credentials', function (done) {
            hippie(app)
                .header('Authorization', 'Bearer bearer_value')
                .put('/user')
                .end(function (err, res) {
                    expect(res.statusCode).to.equal(403);
                    done();
                });
        });

        it('should return an error - bad email format', function (done) {

            var editInfo = {
                email: 'secondmail.com',
                gender: 'female',
                firstName: 'Jordan',
                lastName: 'Van Walleghem',
                username: 'bogos'
            };

            models.Sequelize.Promise.join(
                models.User.create({ email: 'user@mail.com', gender: 'male' }),
                models.UserToken.create(),
                function (user, userToken) {
                    user.addUserToken(userToken).then(
                        function () {
                            hippie(app)
                                .header('Authorization', 'Bearer ' + userToken.value)
                                .put('/user')
                                .json()
                                .send(editInfo)
                                .expectStatus(400)
                                .end(function (err) {
                                    if (err) throw err;
                                    user.reload().then(function (user){
                                        expect(user.email).to.equal('user@mail.com');
                                        done();
                                    });
                                });
                        });
                });
        });

        it('should edit the user account', function (done) {

            var editInfo = {
                email: 'second@mail.com',
                gender: 'female',
                firstName: 'Jordan',
                lastName: 'Van Walleghem',
                username: 'bogos'
            };

            models.Sequelize.Promise.join(
                models.User.create({ email: 'user@mail.com', gender: 'male' }),
                models.UserToken.create(),
                function (user, userToken) {
                    user.addUserToken(userToken).then(
                        function () {
                            hippie(app)
                                .header('Authorization', 'Bearer ' + userToken.value)
                                .put('/user')
                                .json()
                                .send(editInfo)
                                .end(function (err, res) {
                                    expect(res.statusCode).to.equal(200);
                                    user.reload().then(function (user){
                                        expect(user.email).to.equal(editInfo.email);
                                        done();
                                    });
                                });
                        });
                });
        });


    });
};