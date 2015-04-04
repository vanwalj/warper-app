/**
 * Created by Jordan on 2/21/2015.
 */
'use strict';

var restify     = require('restify');
var AWS         = require('aws-sdk');

var models      = require('../models');


var s3 = new AWS.S3();
var warpController = {};

warpController.requestUpload = function (req, res, next) {
    models.sequelize.transaction(function (transaction) {
        return models.Media.create(req.params, {
            fields: ['contentType', 'contentLength', 'latitude', 'longitude'],
            transaction: transaction
        })
            .then(function (media) {
                return media.setOwner(req.user.id, { transaction: transaction })
                    .return(media);
            })
            .then(function (media) {
                return models.Sequelize.Promise(function (resolve, reject) {
                    s3.getSignedUrl('putObject', {
                        Bucket: process.env.AWS_S3_BUCKET,
                        Key: media.uuid,
                        //ContentType: media.contentType,
                        Expires: process.env.NODE_ENV == 'test' ? 600 : 30
                    }, function (err, url) {
                        if (err) return reject(err);
                        return resolve([media, url]);
                    });
                });
            })
    })
        .spread(function (media, url) {
            return res.send(201, { media: media.get(), url: url });
        })
        .catch(models.Sequelize.ValidationError, function (err) {
            return next(new restify.errors.BadRequestError(err.message));
        })
        .catch(function (err) {
            console.log(err);
            next(err);
        });
};

module.exports = warpController;