/**
 * Created by Jordan on 4/5/2015.
 */
'use strict';

var accountController   = require('../controllers/account');
var securityController  = require('../controllers/security');

module.exports = function (server) {
    /**
     * @api {post} /register Register a new account.
     * @apiVersion 1.0.0
     * @apiName Register
     * @apiGroup Account
     * @apiDescription Register a new account using an email.
     * For a facebook registration, just request a token using facebook.
     *
     * @apiParam {String} email         User email.
     * @apiParam {String} password      User password.
     * @apiParam {String} [username]    User username.
     *
     * @apiSuccess {String} access_token    An user bearer token.
     * @apiSuccess {Object} user            User object.
     * @apiSuccess {Number} user.id         User id.
     * @apiSuccess {String} user.email      User email.
     * @apiSuccess {String} user.username   User username.
     * @apiSuccess {String} user.createdAt  User registration date.
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 201 Created
     *      {
     *          "access_token": "dawdwa5757dawdwad7a5dw",
     *          "user": {
     *              "id":           879754
     *              "email":        "anonymous@yopmail.com",
     *              "username":     "darkSasuke42",
     *              "createdAt":    "2015-04-05T04:04:09.000Z"
     *          }
     *      }
     */
    server.post({ path: '/register', name: 'Register' },
        accountController.register
    );

    /**
     * @api {get} /account Get account details.
     * @apiVersion 1.0.0
     * @apiName GetAccount
     * @apiGroup Account
     *
     * @apiUse BearerAuth
     *
     * @apiSuccess {Number} userId      User id.
     * @apiSuccess {String} email       User email.
     * @apiSuccess {String} username    User username.
     * @apiSuccess {String} createdAt   User registration date.
     * @apiSuccess {String} updatedAt   User last update date.
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          "id":           849678
     *          "email":        "anonymous@yopmail.com",
     *          "username":     "darkSasuke42",
     *          "createdAt":    "2015-04-05T04:04:09.000Z",
     *          "updatedAt":    "2015-04-05T04:04:09.000Z"
     *      }
     */
    server.get({ path: '/account', name: 'GetAccount' },
        securityController.bearerAuth,
        accountController.getSelf
    );


    /**
     * @api {put} /account Update account details.
     * @apiVersion 1.0.0
     * @apiName PutAccount
     * @apiGroup Account
     *
     * @apiUse BearerAuth
     *
     * @apiParam {String} email         User email.
     * @apiParam {String} password      User password.
     * @apiParam {String} [username]    User username.
     *
     * @apiSuccess {Number} userId      User id.
     * @apiSuccess {String} email       User email.
     * @apiSuccess {String} username    User username.
     * @apiSuccess {String} createdAt   User registration date.
     * @apiSuccess {String} updatedAt   User last update date.
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          "id":           66587
     *          "email":        "anonymous@yopmail.com",
     *          "username":     "darkSasuke42",
     *          "createdAt":    "2015-04-05T04:04:09.000Z",
     *          "updatedAt":    "2015-04-05T04:04:09.000Z"
     *      }
     */
    server.put({ path: '/account', name: 'Update account' },
        securityController.bearerAuth,
        accountController.putSelf
    );

    /**
     * @api {delete} /account Delete user account.
     * @apiVersion 1.0.0
     * @apiName DeleteAccount
     * @apiGroup Account
     * @apiDescription Delete user account.
     * To avoid users mistakes, this method require a basic http auth.
     *
     * @apiUse HttpAuth
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 204 No Content
     */
    server.del({ path: '/account', name: 'Delete account' },
        securityController.httpAuth,
        accountController.deleteSelf
    );
};