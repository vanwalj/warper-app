/**
 * Created by Jordan on 2/22/2015.
 */
'use strict';

var warpController      = require('../controllers/warp');
var securityController  = require('../controllers/security');

module.exports = function (server) {

    /**
     * @api {get} /warps/received?seen=:seenQuery Get user received warps.
     * @apiVersion 1.0.0
     * @apiName GetReceivedWarps
     * @apiGroup Warps
     * @apiDescription
     *     - If seen is not specified : return all the warps sent to the current user. <br>
     *     - If seen is true : return all warp sent to the current user that have already ben "taped out". <br>
     *     - If seen is false : return all warp sent to the current user that user did not untap yet. <br>
     * @apiUse BearerAuth
     *
     * @apiParam {Boolean}  [seen]  Query for seen warp or not.
     *
     * @apiSuccess {Object[]}   warps             User sent warps.
     * @apiSuccess {Number}     warps.id          Warp id.
     * @apiSuccess {String}     warps.seen        Warp state.
     * @apiSuccess {String}     warps.createdAt   Warp creation date.
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          "warps": [
     *              {
     *                  "id":           44654,
     *                  "seen":         true,
     *                  "createdAt":    "2015-04-05T04:04:09.000Z"
     *              },
     *              {
     *                  "id":           7879,
     *                  "seen":         true,
     *                  "createdAt":    "2015-04-05T04:04:09.000Z"
     *              },
     *              {
     *                  "id":           6453,
     *                  "seen":         false,
     *                  "createdAt":    "2015-04-05T04:04:09.000Z"
     *              }
     *          ]
     *      }
     */
    server.get('/warps/received',
        securityController.bearerAuth,
        warpController.getWarpsReceived
    );

    /**
     * @api {get} /warps/sent Get user sent warps.
     * @apiVersion 1.0.0
     * @apiName GetSentWarps
     * @apiGroup Warps
     * @apiUse BearerAuth
     *
     * @apiSuccess {Object[]}   warps             User sent warps.
     * @apiSuccess {Number}     warps.id          Warp id.
     * @apiSuccess {String}     warps.createdAt   Warp creation date.
     * @apiSuccess {String}     warps.DestId      Dest user id.
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          "warps": [
     *              {
     *                  "id":           44654,
     *                  "createdAt":    "2015-04-05T04:04:09.000Z",
     *                  "DestId":       675645
     *              },
     *              {
     *                  "id":           7879,
     *                  "createdAt":    "2015-04-05T04:04:09.000Z",
     *                  "DestId":       675645
     *              },
     *              {
     *                  "id":           6453,
     *                  "createdAt":    "2015-04-05T04:04:09.000Z",
     *                  "DestId":       675645
     *              }
     *          ]
     *      }
     */
    server.get('/warps/sent',
        securityController.bearerAuth,
        warpController.getWarpsSent
    );

    /**
     * @api {post} /warps/:warpId/untap Untap warp.
     * @apiVersion 1.0.0
     * @apiName UntapWarp
     * @apiGroup Warps
     * @apiDescription
     *     Basically, work as a getter and reveal medium linked to this warp and original sender. <br>
     *      But also the first time change the state from unseen to seen and set the current user location. <br>
     *      So the latitude is only required if the state of seen is set to false (but can be passed anyway if seen is true but it will not update the location). <br>
     *
     * @apiUse BearerAuth
     *
     * @apiParam {Number}  latitude     User gps latitude at this moment.
     * @apiParam {Number}  longitude    User gps longitude at this moment.
     *
     * @apiSuccess {Number}     id                          Wrap id.
     *
     * @apiSuccess {Object}     Medium                      Wrap linked medium.
     * @apiSuccess {String}     Medium.uuid                 Medium uuid
     * @apiSuccess {String}     Medium.contentType          Medium content type (not verified, so don't trust a 100% this value)
     * @apiSuccess {String}     Medium.contentLength        Medium content size
     * @apiSuccess {String}     Medium.url                  Medium url (this url may expire shortly ~60sec)
     * @apiSuccess {String}     Medium.createdAt            Medium creation date
     * @apiSuccess {Object}     Medium.Owner                User who publish the medium.
     *
     * @apiSuccess {Number}     Medium.Owner.id             Owner id.
     * @apiSuccess {String}     Medium.Owner.username       Owner username.
     *
     * @apiSuccess {Object}     PreviousWarp                Previous warp.
     * @apiSuccess {Number}     PreviousWarp.id             Warp id.
     * @apiSuccess {Number}     PreviousWarp.latitude       Warp latitude.
     * @apiSuccess {Number}     PreviousWarp.longitude      Warp longitude.
     * @apiSuccess {Object}     PreviousWarp.Dest           Warp dest.
     *
     * @apiSuccess {Number}     PreviousWarp.Dest.id        Dest id.
     * @apiSuccess {String}     PreviousWarp.Dest.username  Dest username.
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          "id": 8875348,
     *          "Medium": {
     *              uuid: "dwadwa-65456awd-dwad",
     *              contentType: "image/png",
     *              contentLength: 78751,
     *              url: "https://aws.coucou.je.suis.le.lien.de/telechargement?temporaire=true",
     *              createdAt: "2015-04-05T04:04:09.000Z",
     *              Owner: {
     *                  id: 78464,
     *                  username: "Marc Dutroux"
     *              }
     *          },
     *          PreviousWarp: {
     *              id: 7898,
     *              latitude: -45.054,
     *              longitude: 78.579,
     *              Dest: {
     *                  id: 789541,
     *                  username: "Louis Poirson"
     *              }
     *          }
     *      }
     */
    server.post('/warps/:warpId/untap',
        securityController.bearerAuth,
        warpController.untap
    );

    /**
     * @api {post} /warps/:warpId/rewarp Post a rewarp.
     * @apiVersion 1.0.0
     * @apiName PostRewarp
     * @apiGroup Warps
     * @apiDescription
     *     - dest can be: a user id or an array of user id to receive the rewarp.
     *
     * @apiUse BearerAuth
     *
     * @apiParam {Number}   dest    Dest id.
     * @apiParam {Number[]} [dest]  Dest array of id (see description for details).
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 204 No Content
     */
    server.post('/warps/:warpId/rewarp',
        securityController.bearerAuth,
        warpController.rewarp
    );

    /**
     * @api {post} /warps/request-upload Post a file upload request.
     * @apiVersion 1.0.0
     * @apiName PostUploadRequest
     * @apiGroup Warps
     * @apiDescription
     *     - Return an url where you can PUT your file to upload.
     *
     * @apiUse BearerAuth
     *
     * @apiParam {Number}   dest            Dest id.
     * @apiParam {Number[]} [dest]          Dest array of id (see description for details).
     * @apiParam {Number}   latitude        User latitude.
     * @apiParam {Number}   longitude       User longitude.
     * @apiParam {Number}   contentLength   File content length.
     * @apiParam {String}   contentType     File content type.
     *
     * @apiSuccess {String} putUrl                  Upload url.
     * @apiSuccess {Object} medium                  The new medium.
     * @apiSuccess {String} medium.uuid             Medium uuid.
     * @apiSuccess {String} medium.contentType      Medium content type.
     * @apiSuccess {Number} medium.contentLength    Medium content length.
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          "putUrl": "http://aws.com/upload-link",
     *          "medium": {
     *              "uuid": "dwawda-4655daw-465awd",
     *              "contentType": "image/jpg".
     *              "contentLength": 46557
     *          }
     *      }
     */
    server.post('/warps/request-upload',
        securityController.bearerAuth,
        warpController.requestUpload
    );

};