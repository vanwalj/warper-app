/**
 * Created by Jordan on 4/3/2015.
 */
'use strict';

var Consumer = require('sqs-consumer');

var s3Upload = require('./s3-upload');

var sqsS3Upload = Consumer.create({
    queueUrl: process.env.AWS_SQS_S3_UPLOAD,
    region: process.env.AWS_REGION,
    handleMessage: function (message, done) {
        try {
            var body = JSON.parse(message.Body);
            var event = body.Records[0];
            switch (event.eventName) {
                case "ObjectCreated:Put":
                    s3Upload.process(event, done);
                    break;
                default:
                    console.log('Unknown event', event);
                    done();
            }
        }
        catch (e) {
            console.log(e);
            done(e);
        }
    }
});

sqsS3Upload.on('error', function (err) {
    console.log('ERR', err.message);
});

if (process.env.NODE_ENV == 'test') sqsS3Upload.start();
