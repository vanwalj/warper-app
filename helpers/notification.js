/**
 * Created by Jordan on 4/5/2015.
 */
'use strict';

var Promise = require('bluebird');

var notificationHelper = {};

notificationHelper.notify = function (device, message) {
    return new Promise(function (success) {
        console.log(device, message);
        success();
    });
};

module.exports = notificationHelper;