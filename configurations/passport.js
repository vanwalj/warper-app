/**
 * Created by Jordan on 2/20/2015.
 */

var passport                = require('passport'),
    FacebookTokenStrategy   = require('passport-facebook-token').Strategy,
    BearerTokenStrategy     = require('passport-http-bearer').Strategy,
    HttpStrategy            = require('passport-http').BasicStrategy,
    models                  = require('../models'),
    parameters              = require('../parameters');

passport.use("facebook-token-strategy", new FacebookTokenStrategy({
    clientID: parameters.facebook.appId,
    clientSecret: parameters.facebook.appSecret
}, function (accessToken, refreshToken, profile, done) {

    models.FacebookAuth.findOne({
        facebookId: profile.id
    }).then(function (facebookAuth) {
        if (facebookAuth) return facebookAuth.getUser();
        return models.FacebookAuth.create({
            email: profile.emails[0].value,
            familyName: profile.familyName,
            givenName: profile.givenName,
            middleName: profile.middleName,
            displayName: profile.displayName
        }).then(function (facebookAuth) {
            return models.User.create({
                email: facebookAuth.email,
                firstName: facebookAuth.givenName,
                lastName: facebookAuth.familyName,
                nickname: facebookAuth.displayName
            }).then(function (user) {
                return facebookAuth.setUser(user)
                    .then(function () {
                        return user;
                    });
            });
        });
    }).then(function (user) {
        if (!user) throw new Error("Can't get a user account liked to this facebook account");
        done(null, user);
    }).catch(done);

}));

passport.use("bearer-token-strategy", new BearerTokenStrategy(
    function (token, done) {
        models.UserToken.findOne({
            token: token
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
            email: email
        }).then(function (emailAuth) {
            if (!emailAuth) return done(null, false);
            emailAuth.validatePassword(password, function (err, valid) {
                if (err) return done(err);
                if (!valid) return done(null, false);
                return emailAuth.getUser();
            });
        }).then(function (user) {
            if (!user) return done(null, false);
            return done(null, user);
        }).catch(done);
    }
));