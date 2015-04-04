/**
 * Created by Jordan on 4/3/2015.
 */
'use strict';

var Consumer = require('sqs-consumer');

var timers = require('timers');

var app = Consumer.create({
    queueUrl: process.env.AWS_SQS_S3_UPLOAD,
    region: process.env.AWS_REGION,
    handleMessage: function (message, done) {
        console.log(message);
        try {
            var body = JSON.parse(message.Body);
            console.log('Receive message', body);
            timers.setTimeout(function () {
                console.log('Done msg');
                done();
            }, 10000);
        }
        catch (e) {
            console.log(e)
        }
    }
});

app.on('error', function (err) {
    console.log('ERR', err.message);
});

app.start();