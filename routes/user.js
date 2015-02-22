/**
 * Created by Jordan on 2/20/2015.
 */

var express             = require('express'),
    models              = require('../models'),
    securityController  = require('../controllers/security'),
    userController      = require('../controllers/user');

module.exports = function(app) {
    var router = express.Router();

    // Routes params
    router.param('userId', function (req, res, next, userId) {
        models.User.find(userId)
            .then(function (user) {
                if (!user) return res.shortResponses.notFound();
                req.qUser = user;
                next();
            });
    });

    router.param('userName', function (req, res, next, userName) {
        models.User.findOne({ username: userName })
            .then(function (user) {
                if (!user) res.shortResponses.notFound();
                req.qUser = user;
                next()
            }).catch(next);
    });

    // Routes
    router.route('/register')
        .post(userController.register);

    router.route('/token/bearer')
        .get(securityController.httpAuth, userController.getToken);

    router.route('/token/facebook')
        .post(securityController.facebookTokenAuth, userController.getToken);

    router.route('/me')
        .get(securityController.bearerAuth, userController.getMe)
        .delete(securityController.bearerAuth, userController.deleteMe)
        .post(securityController.bearerAuth, userController.postMe);

    router.route('/:userName')
        .get(securityController.bearerAuth, userController.getUserByUsername);

    router.route('/friend')
        .get(securityController.bearerAuth)
        .post(securityController.bearerAuth)
        .delete(securityController.bearerAuth);

    app.use('/user', router);
};