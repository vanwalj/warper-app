/**
 * Created by Jordan on 4/3/2015.
 */
'use strict';

var AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.AWS_AKEY,
    secretAccessKey: process.env.AWS_SKEY,
    region: 'eu-west-1'
});
