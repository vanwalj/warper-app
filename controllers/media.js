/**
 * Created by Jordan on 2/21/2015.
 */

var restify     = require('restify');

var sharing     = require('../helpers/sharing');
var parameters  = require('../parameters');
var models      = require('../models');

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


    getAwsUrl: function (req, res, next) {
        if (!req.params.contentType || !req.params.contentLength || !req.params.friends) return res.shortResponses.badRequest();
        //if (contentLength > parameters.fileUpload.maxSize) return res.shortResponses.badRequest();
        models.File.create({
            contentType: req.params.contentType,
            contentLength: req.params.contentLength
        }).then(function (file) {
                s3.getSignedUrl('putObject', {
                    Bucket: parameters.aws.s3Bucket,
                    Key: file.id,
                    ContentType: req.params.contentType,
                    ContentLength: req.params.contentLength,
                    Expires: 60
                }, function (err, url) {
                    if (err) throw err;
                    return res.send(201, { url: url });
                });
            }).catch(next);


    }
    ,
    snsNotification: function (req, res, next) {
        var objectKey;
        try {
            console.log(req.params);
            objectKey = JSON.parse(req.params.Message).Records[0].s3.object.key;
            models.File.find(objectKey)
                .then(function (file) {
                    if (!file) return next(new restify.NotFoundError());
                    file.snsValid = true;
                    file.save().then(function (file) {
                        res.end();
                        sharing.shareFile(file);
                    });
                }).catch(function (e) { return next(new restify.BadRequestError(e.message)) });
        } catch (err) { return next(new restify.BadRequestError(err.message)) }
    }
};