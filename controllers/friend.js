/**
 * Created by Jordan on 2/21/2015.
 */

var bodyParser  = require('body-parser'),
    Promise     = require('bluebird'),
    models      = require('../models');

module.exports = {
    request: [
        bodyParser.json(),
        function (req, res, next) {
            models.User.find(req.body.userId)
                .then(function (user) {
                    if (!user) return res.shortResponses.notFound();
                    req.user.hasFriend(user)
                        .then(function (result) {
                            if (result) return res.shortResponses.badRequest();
                            req.user.addFriend(user, { status: "pending" })
                                .then(res.shortResponses.success());
                        })
                }).catch(next);
        }
    ],
    remove: [
        bodyParser.json(),
        function (req, res, next) {
            models.User.find(req.body.userId)
                .then(function (user) {
                    if (!user) return res.shortResponses.notFound();
                    Promise.join(user.removeFriend(req.user), req.user.removeFriend(user), res.shortResponses.success);
                }).catch(next);
        }
    ]
};