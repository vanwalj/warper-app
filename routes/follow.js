/**
 * Created by Jordan on 4/1/2015.
 */
'use strict';

var securityController  = require('../controllers/security');
var followController    = require('../controllers/follow');

module.exports = function (server) {

    server.post('/user/follow',
        securityController.bearerAuth,
        followController.follow
    );

    server.post('/user/unfollow',
        securityController.bearerAuth,
        followController.unfollow
    );

    //
    //server.get('/user/followers');
    //server.get('/user/following');
};
