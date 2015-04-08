/**
 * Created by Jordan on 4/5/2015.
 */
'use strict';

var _ = require('underscore');

var models = require('../models');

var deviceController = {};

deviceController.postDevice = function (req, res, next) {
    models.Device.create(_.extend({}, req.params, { UserId: req.user.id }), { fields: ['platform', 'token', 'UserId'] })
        .then(function (device) {
            res.send(device.get());
            return next();
        })
        .catch(next);
};

deviceController.getDevices = function (req, res, next) {
    req.user.getDevices({ attributes: ['id', 'platform', 'token'] })
        .then(function (devices) {
            res.send({ devices: devices });
            return next();
        })
        .catch(next);
};

deviceController.deleteDevice = function (req, res, next) {
    models.Device.destroy({ where: { id: req.params.deviceId, UserId: req.user.id } })
        .then(function () {
            res.send(204);
            return next();
        })
        .catch(next)
};

module.exports = deviceController;