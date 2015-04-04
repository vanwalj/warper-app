/**
 * Created by Jordan on 2/20/2015.
 */
'use strict';

var userController      = require('../controllers/user');
var securityController  = require('../controllers/security');

module.exports = function(server) {

    server.get({ path: '/user', name: 'Get account' },
        securityController.bearerAuth,
        userController.getSelf
    );

    server.post({ path: '/user', name: 'Register' },
        userController.register
    );

    server.put({ path: '/user', name: 'Update account' },
        securityController.bearerAuth,
        userController.putSelf
    );

    server.del({ path: '/user', name: 'Delete account' },
        securityController.bearerAuth,
        userController.deleteSelf
    );

    server.post({ path: '/user/token/email', name: 'Request bearer token with email' },
        securityController.httpAuth,
        userController.getToken
    );

    server.post({ path: '/user/token/facebook', name: 'Request bearer token with facebook' },
        securityController.facebookTokenAuth,
        userController.getToken
    );

    server.get({ path: '/user/:userName/is-valid', name: 'Test if username is valid' },
        userController.isAValidUsername
    );

};