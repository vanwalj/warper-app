/**
 * Created by Jordan on 2/22/2015.
 */

var express         = require('express'),
    fileController  = require('../controllers/file');

module.exports = function (app) {

    var router = express.Router();

    router.route('/sns')
        .post(fileController.snsNotification);

    app.use('/file', router);

};