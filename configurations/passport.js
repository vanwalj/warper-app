/**
 * Created by Jordan on 2/20/2015.
 */

var FacebookTokenStrategy   = require('passport-facebook-token').Strategy,
    BearerTokenStrategy     = require('passport-http-bearer').Strategy,
    HttpStrategy            = require('passport-http').BasicStrategy,
    passport                = require('passport'),
    restify                 = require('restify'),
    parameters              = require('../parameters'),
    models                  = require('../models');

passport.use("facebook-token-strategy", new FacebookTokenStrategy({
        clientID: parameters.facebook.appId,
        clientSecret: parameters.facebook.appSecret
    },
    function (accessToken, refreshToken, profile, done) {
        if (!profile || !profile.emails || !profile.emails[0] || !profile.emails[0].value)
            return done(null, false, { message: "Insufficient permissions, email needed." });
        models.sequelize.transaction(function (t) {
            return models.FacebookAuth.find({ where: { facebookId: profile.id } })
                .then(function (facebookAuth) {
                    if (facebookAuth)
                        return facebookAuth.update({
                            accessToken: accessToken,
                            refreshToken: refreshToken
                        }, { transaction: t }).call('getUser');
                    return models.Sequelize.Promise.join(
                        models.User.create({
                            email: profile.emails[0].value,
                            lastName: profile.familyName,
                            username: profile.displayName,
                            firstName: profile.givenName
                        }, { transaction: t }),
                        models.FacebookAuth.create({
                            facebookId: profile.id,
                            accessToken: accessToken,
                            refreshToken: refreshToken,
                            email: profile.emails[0].value,
                            givenName: profile.givenName,
                            familyName: profile.familyName,
                            middleName: profile.middleName,
                            displayName: profile.displayName
                        }, { transaction: t }),
                        function (user, facebookAuth) {
                            user.created = true;
                            return facebookAuth.setUser(user, { transaction: t }).return(user);
                        }
                    );
                });
        }).then(function (user) {
            if (!user) return done(
                new restify.errors.InternalServerError("Can't get a user account linked to this facebook account."));
            done(null, user);
        }).catch(done);
    }
));

passport.use("bearer-token-strategy", new BearerTokenStrategy(
    function (token, done) {
        models.UserToken.findOne({
            where: { value: token }
        }).then(function (userToken) {
            if (!userToken) return done(null, false);
            return userToken.getUser()
        }).then(function (user) {
            if (!user) return done(null, false);
            done(null, user);
        }).catch(done);
    }
));

passport.use("http-strategy", new HttpStrategy(
    function (email, password, done) {
        models.EmailAuth.findOne({
            where: { email: email }
        }).then(function (emailAuth) {
            if (!emailAuth) return done(null, false);
            emailAuth.validatePassword(password, function (err, valid) {
                if (err) return done(err);
                if (!valid) return done(null, false);
                return emailAuth.getUser().then(function (user) {
                    if (!user) return done(null, false);
                    return done(null, user);
                }).catch(done);
            });
        })
    }
));

module.exports = function (server) { server.use(passport.initialize()) };