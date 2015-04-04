/**
 * Created by Jordan on 4/3/2015.
 */
'use strict';

var Consumer = require('sqs-consumer');

var app = Consumer.create({
    queueUrl: process.env.AWS_SQS_S3_UPLOAD,
    region: process.env.AWS_REGION,
    handleMessage: function (message, done) {
        try {
            var body = JSON.parse(message.Body);
            console.log(body);
            done();
        }
        catch (e) {
            console.log(e)
        }
    }
});

app.on('error', function (err) {
    console.log('ERR', err.message);
});

if (process.env.NODE_ENV == 'test') app.start();