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
            }).then(res.shortResponses.created)
                .catch(next)
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
                                return res.shortResponses.created();
                            res.shortResponses.success();
                        });
                }).catch(next);
        }
    ],
    getMe: [
        function (req, res) {
            res.shortResponses.success(req.user);
        }
    ],
    getUser: [
        function (req, res) {
            res.shortResponses.success(req.qUser);
        }
    ],
    postMe: [
        bodyParser.json(),
        function (req, res, next) {
            req.user.updateAttributes(req.body, {fields: [
                'email', 'type', 'firstName', 'lastName', 'gender', 'nickname'
            ]}).then(res.shortResponses.success)
                .catch(next);
        }
    ],
    deleteMe: [
        function (req, res, next) {
            req.user.delete()
                .then(res.shortResponses.success)
                .catch(next);
        }
    ]
};