/**
 * Created by Jordan on 2/20/2015.
 */
'use strict';

var userController      = require('../controllers/user');
var securityController  = require('../controllers/security');

module.exports = function(server) {

    /**
     * @apiDefine BearerAuth
     * @apiHeader (Auth) Authorization Bearer token auth (see header example).
     * @apiHeaderExample {json} Header-Example:
     *      {
     *          "Authorization": "Bearer j6daw6867adw4534gjhgjj4b65"
     *      }
     */

    /**
     * @apiDefine HttpAuth
     * @apiHeader (Auth) Authorization Http auth (see header example).
     * @apiHeaderExample {json} Header-Example:
     *      {
     *          "Authorization": "Basic dwaa658746w5a==" (base64(email + ":" + password))
     *      }
     */

    /**
     * @api {get} /users/:userId Get user by id.
     * @apiVersion 1.0.0
     * @apiName GetUser
     * @apiGroup Users
     *
     * @apiUse BearerAuth
     *
     * @apiParam {userId}   userId  User id to get.
     *
     * @apiSuccess {Number} userId      User id.
     * @apiSuccess {String} username    User username.
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          "id":           66587,
     *          "username":     "darkSasuke42"
     *      }
     */
    server.get('/users/:userId',
        securityController.bearerAuth,
        userController.getUser
    );

    /**
     * @api {post} /users/:username/is-valid Test if a username is valid.
     * @apiVersion 1.0.0
     * @apiName IsUsernameValid
     * @apiGroup Users
     * @apiDescription This method is useful to know if a user is allowed to chose a username.
     * If the username requested is not valid or is already in use, isValid will be false.
     *
     * @apiParam {username}   username  Username to test.
     *
     * @apiSuccess {Boolean}    isValid     True if the username is valid.
     * @apiSuccess {String}     username    Requested username.
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          "id":           66587,
     *          "username":     "darkSasuke42"
     *      }
     */
    server.post({ path: '/users/:username/is-valid', name: 'Test if username is valid' },
        userController.isAValidUsername
    );

    /**
     * @api {get} /users/:usernameLike/search?limit=10&offset=0 Search for users by username.
     * @apiVersion 1.0.0
     * @apiName SearchUser
     * @apiGroup Users
     * @apiDescription
     *  - This method should be used to find user, for example, when a user search for someone to follow.<br>
     *  - usernameLike can be a simple string, but also a mysql 'find where like' parameter, using for example _ and %.<br>
     *  - For more details: https://dev.mysql.com/doc/refman/5.0/en/pattern-matching.html<br>
     *  - limit and offset params are usefull when there are to many results, by default limit is set to 10 and offset to 0.<br>
     *  - limit can't be > 100.<br>
     *  - limit and offset can be passed as query parameters<br>
     *
     * @apiParam {usernameLike}     usernameLike    Username to search.
     * @apiParam {Number{0-100}}    [limit=10]      Search query size limit.
     * @apiParam {Number{0-inf}}    [offset=0]      Search query start offset.
     *
     * @apiSuccess {Object[]}   users           Found users.
     * @apiSuccess {Number}     users.id        True if the username is valid.
     * @apiSuccess {String}     users.username  Requested username.
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          "users": [
     *              { id: 65645,    username: "YOLO" },
     *              { id: 5645,     username: "Night hawk" },
     *              { id: 6453,     username: "EHE" },
     *              { id: 42145,    username: "Silver." }
     *          ]
     *      }
     */
    server.get('/users/:usernameLike/search',
        securityController.bearerAuth,
        userController.search
    );

};