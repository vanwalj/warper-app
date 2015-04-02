/**
 * Created by Jordan on 2/22/2015.
 */

var mediaController  = require('../controllers/media');

module.exports = function (server) {

    server.post('/media/request-upload', mediaController.getAwsUrl);

    server.post('/media/sns-notification', mediaController.snsNotification);

};