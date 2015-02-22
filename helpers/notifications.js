/**
 * Created by Jordan on 2/22/2015.
 */

var apns = require("apns"),
    options,
    connection,
    notification;

options = {
    keyFile : __dirname + "/../conf/key.pem",
    certFile : __dirname + "/../conf/cert.pem",
    debug : true
};

connection = new apns.Connection(options);

notification = new apns.Notification();
notification.device = new apns.Device("iphone_token");
notification.alert = "Hello World !";

connection.sendNotification(notification);