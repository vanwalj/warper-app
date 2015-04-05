/**
 * Created by Jordan on 2/21/2015.
 */
'use strict';

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
        .then(function (friends) {
            res.send({ isFriend: friends });
            return next();
        })
        .catch(next);
};

followController.unfollow = function (req, res, next) {
    if (req.user.id === req.params.userId) return next(new restify.errors.BadRequestError('User can\'t unfollow himself.'));
    models.User.findOne({ where: { id: req.params.userId } })
        .then(function (user) {
            if (!user) throw new restify.errors.NotFoundError('User not found.');
            return user.removeFollower(req.user.id);
        })
        .then(function (follower) {
            if (!follower) throw new restify.errors.BadRequestError('User is not followed.');
        })
        .then(function () {
            res.send(204);
            return next();
        })
        .catch(next);
};

followController.getFollowers = function (req, res, next) {
    req.user.getFollowers({ attributes: ['id', 'username'] })
        .then(function (followers) {
            res.send({ followers: followers });
            return next();
        })
        .catch(next);
};

followController.getFollowing = function (req, res, next) {
    models.User.findAll({ attributes: ['id', 'username'], include: [{ model: models.Followers, where: { UserId: req.user.id }, attributes: [] }] })
        .then(function (users) {
            res.send({ following: users });
            return next();
        })
        .catch(next);
};

followController.getFriends = function (req, res, next) {
    req.user.getFollowers({ attributes: ['id', 'username'], include: [{ model: models.Followers, where: { UserId: req.user.id }, attributes: [] }] })
        .then(function (users) {
            res.send({ friends: users });
            return next();
        })
        .catch(next);
};

module.exports = followController;