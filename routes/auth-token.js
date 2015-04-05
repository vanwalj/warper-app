/**
 * Created by Jordan on 4/5/2015.
 */
'use strict';

var securityController  = require('../controllers/security');
var authTokenController = require('../controllers/auth-token');

module.exports = function(server) {

    /**
     * @api {post} /auth-token/using-email Request a bearer token using user email.
     * @apiVersion 1.0.0
     * @apiName PostTokenRequestUsingEmail
     * @apiGroup AuthToken
     *
     * @apiUse HttpAuth
     *
     * @apiSuccess {String} access_token    A bearer token.
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          "access_token":     "dwaiiajdwkada54daw65dawdw"
     *      }
     */
    server.post({ path: '/auth-token/using-email', name: 'Request bearer token with email' },
        securityController.httpAuth,
        authTokenController.getToken
    );

    /**
     * @api {post} /auth-token/using-facebook Request a bearer token using facebook.
     * @apiVersion 1.0.0
     * @apiName PostTokenRequestUsingFacebook
     * @apiGroup AuthToken
     * @apiDescription Return a bearer token using a facebook token.
     * create a user account if the user login for the first time.
     * If an account is created, then the HTTP code is 201
     *
     * @apiParam {String} access_token      Facebook access token.
     * @apiParam {String} [refresh_token]   Facebook refresh token.
     *
     * @apiSuccess {String} access_token    A bearer token.
     * @apiSuccess {Object} user            User object.
     * @apiSuccess {Number} user.id         User id.
     * @apiSuccess {String} user.email      User email.
     * @apiSuccess {String} user.username   User username.
     * @apiSuccess {String} user.createdAt  User registration date.
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          "access_token":     "dwaiiajdwkada54daw65dawdw"
     *      }
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 201 Created
     *      {
     *          "access_token":     "dwaiiajdwkada54daw65dawdw",
     *          "user": {
     *              "id":           879754
     *              "email":        "anonymous@yopmail.com",
     *              "username":     "darkSasuke42",
     *              "createdAt":    "2015-04-05T04:04:09.000Z"
     *          }
     *      }
     */
    server.post({ path: '/auth-token/using-facebook', name: 'Request bearer token with facebook' },
        securityController.facebookTokenAuth,
        authTokenController.getToken
    );

};