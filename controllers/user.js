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
                models.EmailAuth.create(req.params, { fields: ['email', 'password'], transaction: t }),
                models.UserToken.create({}, { transaction: t }),
                function (user, emailAuth, userToken) {
                    return models.Sequelize.Promise.join(
                        user.setEmailAuth(emailAuth, { transaction: t }),
                        user.addUserToken(userToken, { transaction: t }),
                        function () { return userToken; }
                    );
                }
            )
        })
            .then(function (userToken) { res.send(201, { access_token: userToken.value }); return next() })
            .catch(models.sequelize.UniqueConstraintError, function (e) { return next(new restify.ConflictError(e.message)) })
            .catch(models.Sequelize.ValidationError, function (e) { return next(new restify.BadRequestError(e.message)) })
            .catch(function (e) { return next(new restify.InternalServerError(e.message)) });
    },
    getToken: function (req, res, next) {
        models.sequelize.transaction(function (t) {
            return models.UserToken.create({}, { transaction: t }).then(function (userToken) {
                return userToken.setUser(req.user, { transaction: t }).return(userToken);
            });
        })
            .then(function (userToken) { res.send(req.user.created ? 201 : 200, { access_token: userToken.value }); return next() })
            .catch(models.Sequelize.ValidationError, function (e) { return next(new restify.BadRequestError(e.message)) })
            .catch(next);
    },
    getMe: function (req, res) { res.send(req.user.get()) },
    putMe: function (req, res, next) {
        req.user.getEmailAuth().then(function (emailAuth) {
            return models.sequelize.transaction(function (t) {
                if (emailAuth) {
                    return models.Sequelize.Promise.join(
                        emailAuth.update(req.params, { fields: ['email', 'password'], transaction: t }),
                        req.user.update(req.params, {
                                fields: [ 'email', 'type', 'firstName', 'lastName', 'gender', 'username' ],
                                transaction: t
                            }
                        )
                    )
                } else return req.user.update(req.params, {
                        fields: [ 'email', 'type', 'firstName', 'lastName', 'gender', 'username' ],
                        transaction: t
                    }
                )
            });
        })
            .then(function () { res.send(200); return next() })
            .catch(models.Sequelize.ValidationError, function (e) { return next(new restify.BadRequestError(e.message)) })
            .catch(next);
    },
    deleteMe: function (req, res, next) {
        req.user.destroy()
            .then(function () { res.send(200); return next() })
            .catch(next);
    },
    isAValidUsername: function (req, res, next) {
        models.User.findOne({ where: { username: req.params.username } })
            .then(function (user) { res.send({ result: !user }); return next() })
            .catch(next);

    }
};