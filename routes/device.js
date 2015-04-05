/**
 * Created by Jordan on 4/5/2015.
 */
'use strict';

var deviceController = require('../controllers/device');
var securityController = require('../controllers/security');

module.exports = function (server) {

    /**
     * @api {post} /devices Post user device.
     * @apiVersion 1.0.0
     * @apiName PostDevice
     * @apiGroup Devices
     *
     * @apiUse BearerAuth
     *
     * @apiParam {String}   platform    Device platform.
     * @apiParam {String}   token       Push notification api unique device token.
     *
     * @apiSuccess {Number}                     id          Device id.
     * @apiSuccess {String="iOS", "Android"}    platform    Device platform.
     * @apiSuccess {String}                     token       Device token.
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          "id": 44654,
     *          "platform": "Android",
     *          "token": "7grd45pklnwaom"
     *      }
     */
    server.post('/devices',
        securityController.bearerAuth,
        deviceController.postDevice
    );

    /**
     * @api {get} /devices Get user devices.
     * @apiVersion 1.0.0
     * @apiName GetDevices
     * @apiGroup Devices
     *
     * @apiUse BearerAuth
     *
     * @apiSuccess {Object[]}   devices             User devices.
     * @apiSuccess {Number}     devices.id          Device id.
     * @apiSuccess {String}     devices.platform    Device platform.
     * @apiSuccess {String}     devices.token       Device token.
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          "devices": [
     *              {
     *                  "id": 44654,
     *                  "platform": "Android",
     *                  "token": "7grd45pklnwaom"
     *              },
     *              {
     *                  "id": 987,
     *                  "platform": "iOS",
     *                  "token": "87jyg54hfdesa"
     *              },
     *              {
     *                  "id": 455,
     *                  "platform": "iOS",
     *                  "token": "jyhgjg78yjg"
     *              }
     *          ]
     *      }
     */
    server.get('/devices',
        securityController.bearerAuth,
        deviceController.getDevices
    );

    /**
     * @api {delete} /devices/:deviceId Delete user device.
     * @apiVersion 1.0.0
     * @apiName DeleteDevice
     * @apiGroup Devices
     *
     * @apiUse BearerAuth
     *
     * @apiParam {deviceId} deviceId    Device id.
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 204 No Content
     */
    server.del('/devices/:deviceId',
        securityController.bearerAuth,
        deviceController.deleteDevice
    );

};