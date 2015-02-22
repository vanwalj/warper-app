/**
 * Created by Jordan on 2/21/2015.
 */

var bodyParser  = require('body-parser'),
    winston     = require('winston'),
    parameters  = require('../parameters'),
    models      = require('../models');

module.exports = {

    /**
     * @api {post} /teacher/course/:courseId/file Post a new file
     * @apiVersion 0.1.0
     * @apiName PostCourseFile
     * @apiGroup Teacher
     * @apiDescription Post a file details to get an upload url,
     * then do a put request against this request with the file content in the request body
     *
     * @apiParam {String} courseId
     * @apiParam {String} fileName file name
     * @apiParam {String} path path where to upload
     * @apiParam {String} ContentType file mime type
     * @apiParam {Number} ContentLength file length
     * @apiParam {Boolean} [published] file state
     * @apiParam {String} [comment] file comment
     *
     * @apiParamExample {json} Request-Example:
     *      POST /teacher/course/dakjhwdjwa68786/file
     *      {
     *        "fileName": "report.pdf",
     *        "path": "/week1/report/",
     *        "ContentType": "application/pdf",
     *        "ContentLength": 5566578
     *      }
     *
     * @apiSuccessExample Success-Response:
     *      HTTP/1.1 200 OK
     *      {
     *          url: "https://aws.com/file.jpg?expire=6486",
     *          id: "jdawhdo21q31iopdklaw"
     *      }
     *
     */


    getAwsUrl: [
        bodyParser.json(),
        function (req, res, next) {
            if (!req.body.contentType || !req.body.contentLength || !req.body.friends) return res.shortResponses.badRequest();
            //if (contentLength > parameters.fileUpload.maxSize) return res.shortResponses.badRequest();
            models.File.create({
                contentType: req.body.contentType,
                contentLength: req.body.contentLength
            }).then(function (file) {
                    s3.getSignedUrl('putObject', {
                        Bucket: parameters.aws.s3Bucket,
                        Key: file.id,
                        ContentType: req.body.contentType,
                        ContentLength: req.body.contentLength,
                        Expires: 60
                    }, function (err, url) {
                        if (err) throw err;
                        return res.shortResponses.created({ url: url });
                    });
                }).catch(next);


        }
    ],
    snsNotification: [
        bodyParser.text(),
        function (req, res) {
            var objectKey;
            try {
                objectKey = JSON.parse(req.body.Message).Records[0].s3.object.key;
                winston.log('info', 'Receive a notification from SNS for object.', objectKey);
                models.File.find(objectKey)
                    .then(function (file) {
                        if (!file) return res.shortResponses.notFound();
                        file.save();
                        return res.shortResponses.ok();
                    }).catch(function () {
                        winston.error(e);
                        return res.shortResponses.badRequest();
                    });
            } catch (err) {
                winston.error(e);
                return res.shortResponses.badRequest();
            }
        }
    ]
};