/**
 * Created by Jordan on 2/20/2015.
 */
"use strict";

var bodyParser  = require('body-parser'),
    models      = require('../models'),
    hat         = require('hat'),
    rack        = hat.rack(256, 36);

module.exports = {
    register: [
        bodyParser.json(),
        function (req, res, next) {
            if (!req.body.email || !req.body.password)
                return res.shortResponses.badRequest();
            models.User.create({
                email: req.body.email,
                password: req.body.password
            }).then(function () {
                res.shortResponses.created();
            }).catch(next)
        }
    ],
    getToken: [
        function (req, res, next) {
            models.UserToken.create({
                value: rack()
            })
                .then(function (userToken) {
                    userToken.setUser(req.user)
                        .then(function () {
                            if (req.user.created)
                                return res.shortResponses.created({access_token: userToken.value});
                            res.shortResponses.success({access_token: userToken.value});
                        });
                }).catch(next);
        }
    ],
    getMe: [
        function (req, res) {
            res.shortResponses.success(req.user.values);
        }
    ],
    getUserByUsername: [
        function (req, res) {
            var user = {
                id: req.qUser.id,
                username: req.qUser.username
            };

            res.shortResponses.success(user);
        }
    ],
    putMe: [
        bodyParser.json(),
        function (req, res, next) {
            req.user.update(req.body, {fields: [
                'email', 'type', 'firstName', 'lastName', 'gender', 'username'
            ]}).then(function () {
                res.shortResponses.success();
            }).catch(next);
        }
    ],
    deleteMe: [
        function (req, res, next) {
            req.user.destroy()
                .then(res.shortResponses.success)
                .catch(next);
        }
    ],
    isAValidUsername: [
        function (req, res, next) {
            models.User.findOne({ username: req.qUser })
                .then(function (user) {
                    if (user) return res.shortResponses({ result: false });
                    res.shortResponses({ result: true });
                }).catch(next);
        }
    ]
};