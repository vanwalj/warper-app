/**
 * Created by Jordan on 2/21/2015.
 */

var passport    = require('passport'),
    bodyParser  = require('body-parser'),
    winston     = require('winston');

module.exports = {
    bearerAuth: function (req, res, next) {
        passport.authenticate('bearer-token-strategy', function (err, user) {
            if (err) return next(err);
            if (!user) return res.shortResponses.unauthorized();
            req.login(user, { session: false }, function (err) {
                if (err) return next(err);
                next();
            });
        })(req, res, next);
    },

    httpAuth: function (req, res, next) {
        passport.authenticate('http-strategy', function (err, user) {
            if (err) return next(err);
            if (!user) return res.shortResponses.unauthorized();
            req.login(user, { session: false }, function (err) {
                if (err) return next(err);
                next();
            })
        })(req, res, next);
    },

    facebookTokenAuth: [
        bodyParser.json(),
        function (req, res, next) {

            passport.authenticate('facebook-token-strategy', function (err, user) {
                if (err) return next(err);
                if (!user) {
                    return res.shortResponses.unauthorized();
                }
                req.login(user, { session: false }, function (err) {
                    if (err) return next(err);
                    next();
                });
            })(req, res, next);
        }]
};