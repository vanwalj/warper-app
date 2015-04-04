/**
 * Created by Jordan on 2/20/2015.
 */
'use strict';

var restify     = require('restify');

var models      = require('../models');

var userController = {};

userController.register = function (req, res, next) {
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

userController.getToken = function (req, res, next) {
    models.sequelize.transaction(function (transaction) {
        return models.UserToken.create({}, { transaction: transaction }).then(function (userToken) {
            return userToken.setUser(req.user, { transaction: transaction }).return(userToken);
        });
    })
        .then(function (userToken) {
            res.send(req.user.created ? 201 : 200, { access_token: userToken.value });
            return next()
        })
        .catch(models.Sequelize.ValidationError, function (err) {
            return next(new restify.BadRequestError(err.message));
        })
        .catch(next);
};

userController.getSelf = function (req, res) {
    res.send(200, req.user.get());
    return next();
};

userController.putSelf = function (req, res, next) {
    req.user.getEmailAuth().then(function (emailAuth) {
        return models.sequelize.transaction(function (transaction) {
            if (emailAuth) {
                return models.Sequelize.Promise.join(
                    req.user.update(req.params, {
                            fields: [ 'email', 'type', 'firstName', 'lastName', 'gender', 'username' ],
                            transaction: transaction
                    }),
                    emailAuth.update(req.params, { fields: ['email', 'password'], transaction: transaction }),
                    function (user) {
                        return user;
                    }
                )
            } else return req.user.update(req.params, {
                    fields: [ 'email', 'type', 'firstName', 'lastName', 'gender', 'username' ],
                    transaction: transaction
                }
            )
        });
    })
        .then(function (user) {
            res.send(200, user.get());
            return next();
        })
        .catch(models.Sequelize.ValidationError, function (err) {
            return next(new restify.BadRequestError(err.message));
        })
        .catch(next);
};

userController.deleteSelf = function (req, res, next) {
    req.user.destroy()
        .then(function () {
            res.send(204);
            return next();
        })
        .catch(next);
};

userController.isAValidUsername = function (req, res, next) {
    models.User.findOne({ where: { username: req.params.username } })
        .then(function (user) {
            res.send({ result: !user });
            return next();
        })
        .catch(next);

};

module.exports = userController;
