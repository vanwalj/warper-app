/**
 * Created by Jordan on 2/20/2015.
 */

var restify             = require('restify'),
    models              = require('../models'),
    userController      = require('../controllers/user'),
    securityController  = require('../controllers/security'),
    utilsController     = require('../controllers/utils');

module.exports = function(server) {

    server.get({ path: '/user' },
        securityController.bearerAuth,
        userController.getMe
    );

    server.post({ path: '/user' },
        utilsController.parseBody,
        userController.register
    );

    server.put({ path: '/user' },
        securityController.bearerAuth,
        utilsController.parseBody,
        userController.putMe
    );

    server.del({ path: '/user' },
        securityController.bearerAuth,
        userController.deleteMe
    );

    server.get({ path: '/user/token/email' },
        securityController.httpAuth,
        userController.getToken
    );

    server.post({ path: '/user/token/facebook' },
        utilsController.parseBody,
        securityController.facebookTokenAuth,
        userController.getToken
    );

    server.get({ path: '/user/:userName/is-valid' },
        userController.isAValidUsername
    );

};