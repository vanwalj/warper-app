/**
 * Created by Jordan on 2/22/2015.
 */
'use strict';

var warpController      = require('../controllers/warp');
var securityController  = require('../controllers/security');

module.exports = function (server) {

    server.post('/warp/request-upload',
        securityController.bearerAuth,
        warpController.requestUpload
    );

};