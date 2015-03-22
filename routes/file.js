/**
 * Created by Jordan on 2/22/2015.
 */

var restify         = require('restify'),
    fileController  = require('../controllers/file');

module.exports = function (server) {

    server.post('/file/sns', fileController.snsNotification);

};