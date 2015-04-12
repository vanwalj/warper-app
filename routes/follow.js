/**
 * Created by Jordan on 4/1/2015.
 */
'use strict';

var followController    = require('../controllers/follow');
var securityController  = require('../controllers/security');

module.exports = function (server) {

    /**
     * @api {post} /follow/:userId Follow a user.
     * @apiVersion 1.0.0
     * @apiName FollowUserId
     * @apiGroup Follow
     *
     * @apiUse BearerAuth
     *
     * @apiParam {userId} userId User id.
     *
     * @apiSuccess {Boolean} isFriend True if the users are friends.
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          "friends": false
     *      }
     */
    server.post('/follow/:userId',
        securityController.bearerAuth,
        followController.follow
    );

    /**
     * @api {post} /unfollow/:userId Unfollow a user.
     * @apiVersion 1.0.0
     * @apiName UnfollowUserId
     * @apiGroup Follow
     *
     * @apiUse BearerAuth
     *
     * @apiParam {userId} userId User id.
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 204 No Content
     */
    server.post('/unfollow/:userId',
        securityController.bearerAuth,
        followController.unfollow
    );

    /**
     * @api {get} /followers Get followers.
     * @apiVersion 1.0.0
     * @apiName GetFollowers
     * @apiGroup Follow
     *
     * @apiUse BearerAuth
     *
     * @apiSuccess {Object[]}   followers           List of followers
     * @apiSuccess {Number}     followers.id        Follower id.
     * @apiSuccess {String}     followers.username  Follower username.
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          followers:
     *              [
     *                  {id: 1234, username: "yoloSwag"},
     *                  {id: 123, username: "kikoo56"},
     *                  {id: 987, username: "PowerDu97"},
     *                  {id: 1422, username: "BCBG"},
     *                  {id: 666, username: "HEYGURL"}
     *              ]
     *      }
     */
    server.get('/followers',
        securityController.bearerAuth,
        followController.getFollowers
    );

    /**
     * @api {get} /followings Get followings.
     * @apiVersion 1.0.0
     * @apiName GetFollowings
     * @apiGroup Follow
     *
     * @apiUse BearerAuth
     *
     * @apiSuccess {Object[]}   followings           List of following.
     * @apiSuccess {Number}     followings.id        Following id.
     * @apiSuccess {String}     followings.username  Following username.
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          following:
     *              [
     *                  {id: 1234, username: "yoloSwag"},
     *                  {id: 123, username: "kikoo56"},
     *                  {id: 987, username: "PowerDu97"},
     *                  {id: 1422, username: "BCBG"},
     *                  {id: 666, username: "HEYGURL"}
     *              ]
     *      }
     */
    server.get('/followings',
        securityController.bearerAuth,
        followController.getFollowings
    );

    /**
     * @api {get} /friends Get friends.
     * @apiVersion 1.0.0
     * @apiName GetFriends
     * @apiGroup Follow
     *
     * @apiUse BearerAuth
     *
     * @apiSuccess {Object[]}   friends             List of friends.
     * @apiSuccess {Number}     friends.id          Friend id.
     * @apiSuccess {String}     friends.username    Friend username.
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          friends:
     *              [
     *                  {id: 1234, username: "yoloSwag"},
     *                  {id: 123, username: "kikoo56"},
     *                  {id: 987, username: "PowerDu97"},
     *                  {id: 1422, username: "BCBG"},
     *                  {id: 666, username: "HEYGURL"}
     *              ]
     *      }
     */
    server.get('/friends',
        securityController.bearerAuth,
        followController.getFriends
    );
};
