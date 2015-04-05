/**
 * Created by Jordan on 4/5/2015.
 */
'use strict';

var restify     = require('restify');

var models      = require('../models');

var accountController = {};

accountController.register = function (req, res, next) {
    models.sequelize.transaction(function (transaction) {
        return models.Sequelize.Promise.join(
            models.User.create(req.params, { fields: ['email'], transaction: transaction }),
            models.EmailAuth.create(req.params, { fields: ['email', 'password'], transaction: transaction }),
            models.UserToken.create({}, { transaction: transaction }),
            function (user, emailAuth, userToken) {
                return models.Sequelize.Promise.join(
                    user.setEmailAuth(emailAuth, { transaction: transaction }),
                    user.addUserToken(userToken, { transaction: transaction }),
                    function () {
                        return [userToken, user];
                    }
                );
            }
        )
    })
        .spread(function (userToken, user) {
            return user.reload({ attributes: ['id', 'email', 'username', 'createdAt'] })
                .then(function (user) {
                    return [userToken, user];
                });
        })
        .spread(function (userToken, user) {
            res.send(201, { access_token: userToken.value, user: user.get() });
            return next();
        })
        .catch(models.sequelize.UniqueConstraintError, function (err) {
            return next(new restify.ConflictError(err.message));
        })
        .catch(models.Sequelize.ValidationError, function (err) {
            return next(new restify.BadRequestError(err.message));
        })
        .catch(next);
};

accountController.getSelf = function (req, res) {
    req.user.reload({ attributes: ['id', 'email', 'username', 'createdAt', 'updatedAt'] })
        .then(function (user) {
            res.send(user.get());
            return next();
        })
        .catch(next);
};

accountController.putSelf = function (req, res, next) {
    req.user.getEmailAuth().then(function (emailAuth) {
        return models.sequelize.transaction(function (transaction) {
            if (emailAuth) {
                return models.Sequelize.Promise.join(
                    req.user.update(req.params, {
                        fields: ['email', 'username'],
                        transaction: transaction
                    }),
                    emailAuth.update(req.params, { fields: ['email', 'password'], transaction: transaction }),
                    function (user) {
                        return user;
                    }
                )
            } else return req.user.update(req.params, {
                    fields: ['email', 'username'],
                    transaction: transaction
                }
            )
        });
    })
        .then(function (user) {
            return user.reload({attributes: ['id', 'email', 'username', 'createdAt', 'updatedAt']});
        })
        .then(function (user) {
            res.send(user.get());
            return next();
        })
        .catch(models.Sequelize.ValidationError, function (err) {
            return next(new restify.BadRequestError(err.message));
        })
        .catch(next);
};

accountController.deleteSelf = function (req, res, next) {
    req.user.destroy()
        .then(function () {
            res.send(204);
            return next();
        })
        .catch(next);
};

module.exports = accountController;