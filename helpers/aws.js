/**
 * Created by Jordan on 4/4/2015.
 */

var AWS = require('aws-sdk');
var Promise = require('bluebird');

var s3 = new AWS.S3();

var awsHelper = {
    s3: {}
};

awsHelper.s3.deleteFile = function (params) {
    return new Promise(function (succes, reject) {
        s3.deleteObject(params, function (err, data) {
            if (err) return reject(err);
            return succes(data);
        });
    });
};

awsHelper.s3.getPutObjectSignedUrl = function (medium) {
    return new Promise(function (resolve, reject) {
        s3.getSignedUrl('putObject', {
            Bucket: process.env.AWS_S3_BUCKET,
            Key: medium.uuid,
            ContentType: medium.contentType,
            Expires: process.env.NODE_ENV == 'test' ? 600 : 60
        }, function (err, url) {
            if (err) return reject(err);
            return resolve([medium, url]);
        });
    });
};

module.exports = awsHelper;