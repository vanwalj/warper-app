/**
 * Created by Jordan on 2/20/2015.
 */
'use strict';

var restify     = require('restify');

var models      = require('../models');

var userController = {};

userController.isAValidUsername = function (req, res, next) {
    models.User.findOne({ where: { username: req.params.username } })
        .then(function (user) {
            res.send({ isValid: !user, username: req.params.username });
            return next();
        })
        .catch(next);

};

userController.search = function (req, res, next) {
    req.params.limit = req.params.limit || 10;
    req.params.offset = req.params.offset || 0;
    if (req.params.limit > 100) req.params.limit = 100;
    if (req.params.limit < 0) req.params.limit = 0;
    models.User.findAll({ where: { username: { like: req.params.userNameLike } } ,
        offset: req.params.offset, limit: req.params.limit, attributes: ['id', 'username'] })
        .then(function (users) {
            res.send({ users: users });
            return next();
        });
};

userController.getUser = function (req, res, next) {
    models.User.findOne({ where: { id: req.params.id } }, { attributes: ['id', 'username'] })
        .then(function (user) {
            if (!user) throw new restify.errors.NotFoundError('User not found.');
            return user;
        })
        .then(function (user) {
            res.send(user.get());
            return next();
        })
        .catch(next);
};

module.exports = userController;
