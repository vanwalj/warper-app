/**
 * Created by Jordan on 2/21/2015.
 */
'use strict';

var restify     = require('restify');
var AWS         = require('aws-sdk');
var _           = require('underscore');

var models          = require('../models');
var awsHelper       = require('../helpers/aws');
var rewarpHelper    = require('../helpers/rewarp');

var warpController  = {};

warpController.requestUpload = function (req, res, next) {
    models.sequelize.transaction(function (transaction) {
        return models.Medium.create({
            contentType: req.params.contentType, contentLength: req.params.contentLength, OwnerId: req.user.id
        }, { transaction: transaction })
            .then(function (medium) {
                return models.Warp.create({
                    latitude: req.params.latitude, longitude: req.params.longitude,
                    MediumUuid: medium.uuid, dispatched: true, seen: true
                }, { transaction: transaction })
                    .then(function (rootWarp) {
                        return rewarpHelper.fromWarp({
                            dest: req.params.dest, user: req.user,
                            warp: rootWarp, medium: medium },
                            { transaction: transaction });
                    })
                    .return(medium);
            })
            .then(awsHelper.s3.getPutObjectSignedUrl)
    })
        .spread(function (medium, url) {
            res.send(201, { medium: medium.get(), putUrl: url });
            return next();
        })
        .catch(models.Sequelize.ValidationError, function (err) {
            return next(new restify.errors.BadRequestError(err.message));
        })
        .catch(next);
};

warpController.untap = function (req, res, next) {
    models.Warp.findOne({ where: { id: req.params.warpId, dispatched: true, DestId: req.user.id } },
        { include: [
            { model: models.Medium, attributes: ['uuid', 'contentType', 'contentLength', 'url', 'createdAt'],
                include: [{ model: models.User, as: 'Owner', attributes: ['id', 'username'] }]
            },
            { model: models.Wrap, as: 'PreviousWarp', attributes: ['id', 'latitude', 'longitude'],
                include: [{ model: model.User, as: 'Dest', attributes: ['id', 'username'] }]
            }
        ] })
        .then(function (warp) {
            if (!warp) throw new restify.errors.NotFoundError('Warp not found.');
            if (warp.seen) return warp;
            return warp.update({ seen: true, latitude: req.params.latitude, longitude: req.params.longitude });
        })
        .then(function (warp) {
            res.send(warp.get());
            return next();
        })
        .catch(next);
};

warpController.rewarp = function (req, res, next) {
    models.Warp.findOne({ where: { id: req.params.warpId, seen: true, DestId: req.user.id } })
        .then(function (warp) {
            if (!warp) throw new restify.errors.NotFoundError('Warp not found.');
            return warp.getMedium()
                .then(function (medium) {
                    return models.sequelize.transaction(function (transaction) {
                        return rewarpHelper.fromWarp({ dest: req.params.dest, user: req.user, medium: medium, warp: warp },
                            { transaction: transaction })
                            .then(function () {
                                return rewarpHelper.dispatch(warp, { transaction: transaction });
                            });
                    });
                });
        })
        .then(function () {
            res.send(204);
            return next();
        })
        .catch(next);
};

warpController.getWarpsReceived = function (req, res, next) {
    models.Warps.findAll({ where: _.extend(req.query, { DestId: req.user.id, dispatched: true })},
        { attributes: ['id', 'seen', 'createdAt'] })
        .then(function (warps) {
            res.send({ warps: warps });
            return next();
        })
        .catch(next);
};

warpController.getWarpsSent = function (req, res, next) {
    models.Warps.findAll({ where: { UserId: req.user.id, dispatched: true }},
        { attributes: ['id', 'seen', 'createdAt'], include: [{ model: models.User, as: 'Dest' }] })
        .then(function (warps) {
            res.send({ warps: warps });
            return next();
        })
        .catch(next);
};

module.exports = warpController;