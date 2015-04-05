/**
 * Created by Jordan on 4/3/2015.
 */
'use strict';

var models = require('../models');
var awsHelper = require('../helpers/aws');
var rewarpHelper = require('../helpers/rewarp');

var sqsS3Upload = {};

sqsS3Upload.process = function (event, done) {
    var upload = event.s3;

    models.Medium.findOne({ where: { uuid: upload.object.key } })
        .then(function (medium) {
            if (!medium) return awsHelper.s3.deleteFile({ Bucket: upload.bucket.name, Key: upload.object.key });
            if (medium.contentLength != upload.object.size)
                return medium.destroy()
                    .then(awsHelper.s3.deleteFile({ Bucket: upload.bucket.name, Key: upload.object.key }));
            return medium.update({ isValid: true })
                .then(function (media) {
                    console.log('send message !');
                    media.getRootWarp()
                        .then(rewarpHelper.dispatch);
                });
        })
        .then(function () { done(); })
        .catch(done);
};

module.exports = sqsS3Upload;