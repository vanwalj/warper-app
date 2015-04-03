/**
 * Created by Jordan on 2/21/2015.
 */

var restify     = require('restify');

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
        models.sequelize.transaction(function (t) {
            return models.Media.create({
                contentType: req.params.contentType,
                contentLength: req.params.contentLength
            }, { transaction: t })
                .then(function (media) {
                    return new models.Sequelize.Promise(function (resolve, reject) {
                        s3.getSignedUrl('putObject', {
                            Bucket: parameters.aws.s3Bucket,
                            Key: media.uuid,
                            ContentType: req.params.contentType,
                            ContentLength: req.params.contentLength,
                            Expires: 60
                        }, function (err, url) {
                            if (err) return reject(err);
                            return resolve(url);
                        });
                    });
                })
        })
            .then(function (url) {
                return res.send(201, { url: url });
            })
            .catch(models.Sequelize.Errors.ValidationError, function (err) {
                return next(new restify.errors.BadRequestError(err.message));
            })
            .catch(next);
    }
    ,
    snsNotification: function (req, res, next) {
        try {
            req.params = JSON.parse(req.body);
            console.log(req.params);
            res.send(200);
        } catch (err) { return next(new restify.BadRequestError(err.message)) }
    }
};