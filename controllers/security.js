/**
 * Created by Jordan on 2/21/2015.
 */
'use strict';

var restify     = require('restify');
var passport    = require('passport');

var securityController = {};

securityController.bearerAuth = function (req, res, next) {
    passport.authenticate('bearer-token-strategy', function (err, user) {
        if (err) return next(err);
        if (!user) return next(new restify.ForbiddenError());
        req.login(user, { session: false }, function (err) {
            if (err) return next(err);
            next();
        });
    })(req, res, next);
};

securityController.httpAuth = function (req, res, next) {
    passport.authenticate('http-strategy', function (err, user) {
        if (err) return next(err);
        if (!user) return next(new restify.ForbiddenError());
        req.login(user, { session: false }, function (err) {
            if (err) return next(err);
            next();
        })
    })(req, res, next);
};

securityController.facebookTokenAuth = function (req, res, next) {

    passport.authenticate('facebook-token-strategy', function (err, user) {
        if (err) return next(err);
        if (!user) return next(new restify.ForbiddenError());
        req.login(user, { session: false }, function (err) {
            if (err) return next(err);
            next();
        });
    })(req, res, next);
};

module.exports = securityController;