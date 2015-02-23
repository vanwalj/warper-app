/**
 * Created by Jordan on 2/22/2015.
 */

var notifications   = require('./notifications'),
    winston         = require('winston'),
    Sequelize       = require('sequelize');

var sendWarp = function (warp) {
    warp.transmit = true;
    warp.save()
        .then(function (warp) {
            Sequelize.join(warp.getSender, warp.getReceiver)
                .then(function (sender, receiver) {
                    return receiver.getDevices()
                        .then(function (devices) {
                            devices.forEach(function (device) {
                                notifications.iOS(device.token, {
                                    alert: "COUCOU"
                                });
                            });
                        });
                }).catch(function (err) {
                    winston.error(err);
                });
        });
};

var shareFile = function (file) {
    file.getWarps()
        .then(function (warps) {
            warps.filter(function (warp) {
                return !warp.transmit
            }).forEach(function (warp) {
                sendWarp(warp);
            });
        });
};


module.exports = {
    sendWarp: sendWarp,
    shareFile: shareFile
};