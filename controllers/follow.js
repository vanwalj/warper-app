/**
 * Created by Jordan on 2/21/2015.
 */

var restify = require('restify');

var models = require('../models');

var followController = {};

followController.follow = function (req, res, next) {
    if (req.user.id === req.params.userId) return next(new restify.errors.BadRequestError('User can\'t follow himself.'));
    models.User.findOne({ where: { id: req.params.userId } })
        .then(function (user) {
            if (!user) throw new restify.errors.NotFoundError('User not found.');
            return user.addFollower(req.user.id);
        })
        .then(function (follower) {
            if (!follower) throw new restify.errors.BadRequestError('User is already followed.');
            return req.user.hasFollower(follower.UserId);
        })
        .then(function (followBack) {
            res.send(200, { followBack: followBack });
            return next();
        })
        .catch(next);
};

module.exports = followController;