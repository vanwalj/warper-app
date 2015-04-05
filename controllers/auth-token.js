/**
 * Created by Jordan on 4/5/2015.
 */
'use strict';

var restify     = require('restify');

var models      = require('../models');

var authTokenController = {};

authTokenController.getToken = function (req, res, next) {
    models.sequelize.transaction(function (transaction) {
        return models.UserToken.create({}, { transaction: transaction }).then(function (userToken) {
            return userToken.setUser(req.user, { transaction: transaction }).return(userToken);
        });
    })
        .then(function (userToken) {
            if (!req.user.created) return [200, { access_token: userToken.value }];
            return req.user.reload({ attributes: ['id', 'email', 'username', 'createdAt'] })
                .then(function (user) {
                    return [201, { access_token: userToken.value, user: user }]
                });
        })
        .spread(function (status, responseContent) {
            res.send(status, responseContent);
            return next()
        })
        .catch(models.Sequelize.ValidationError, function (err) {
            return next(new restify.BadRequestError(err.message));
        })
        .catch(next);
};

module.exports = authTokenController;