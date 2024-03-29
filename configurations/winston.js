/**
 * Created by Jordan on 2/20/2015.
 */
'use strict';

var Slack = require('winston-slack-pls').Slack;
var winston = require('winston');


winston.setLevels(winston.config.npm.levels);

if (process.env.NODE_ENV != 'test') {
    winston.add(Slack, {
        apiToken: process.env.SLACK_API,
        channel: process.env.SLACK_WINSTON_CHANNEL,
        level: 'info'
    });
}

module.exports = winston;