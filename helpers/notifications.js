/**
 * Created by Jordan on 2/22/2015.
 */

var apns = require("apns"),
    _ = require('underscore'),
    options,
    connection;

options = {
    keyFile : __dirname + "/../conf/key.pem",
    certFile : __dirname + "/../conf/cert.pem",
    debug : true
};

connection = new apns.Connection(options);

var iOS = function (token, notification) {
    var _notification = new apns.Notification();
    _notification = _.extend(_notification, notification);
    _notification.device = new apns.Device(token);
    connection.sendNotification(_notification);
};

module.exports = {
    iOS: iOS
};