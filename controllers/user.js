/**
 * Created by Jordan on 2/20/2015.
 */
"use strict";

var restify     = require('restify'),
    hat         = require('hat'),
    models      = require('../models');

module.exports = {
    register: function (req, res, next) {
        models.sequelize.transaction(function (t) {
            return models.Sequelize.Promise.join(
                models.User.create(req.params, { fields: ['email'], transaction: t }),
                models.EmailAuth.create(req.params, { fields: ['password'], transaction: t }),
                models.UserToken.create({}, { transaction: t }),
                function (user, emailAuth, userToken) {
                    return models.Sequelize.Promise.join(
                        user.setEmailAuth(emailAuth, { transaction: t }),
                        userToken.setUser(user, { transaction: t }),
                        function () { return userToken; }
                    );
                }
            )
        })
            .then(function (userToken) { return req.send(userToken.get()) })
            .catch(models.Sequelize.ValidationError, function (e) { return next(restify.BadRequestError(e.message)) })
            .catch(next);
    },
    getToken: function (req, res, next) {
        models.sequelize.transaction(function (t) {
            return models.UserToken.create({}, { transaction: t }).then(function (userToken) {
                return userToken.setUser(req.user, { transaction: t }).return(userToken);
            });
        })
            .then(function (userToken) { return res.send(req.user.created ? 201 : 200, userToken.get()) })
            .catch(models.Sequelize.ValidationError, function (e) { return next(restify.BadRequestError(e.message)) })
            .catch(next);
    },
    getMe: function (req, res) { res.send(req.user.get()) },
    putMe: function (req, res, next) {
        req.user.update(req.params, {fields: [ 'email', 'type', 'firstName', 'lastName', 'gender', 'username' ]})
            .then(function () { return res.end() })
            .catch(models.Sequelize.ValidationError, function (e) { return next(restify.BadRequestError(e.message)) })
            .catch(next);
    },
    deleteMe: function (req, res, next) {
        req.user.destroy()
            .then(function () { return res.end() })
            .catch(next);
    },
    isAValidUsername: function (req, res, next) {
        models.User.findOne({ where: { username: req.params.username } })
            .then(function (user) { return res.send({ result: !user }) })
            .catch(next);

    }
};