/**
 * Created by Jordan on 2/20/2015.
 */
"use strict";

var winston = require('winston'),
    Slack = require('winston-slack-pls').Slack;

winston.setLevels(winston.config.npm.levels);

winston.add(Slack, {
    apiToken: process.env.SLACK_API,
    channel: process.env.SLACK_WINSTON_CHANNEL
});

module.exports = winston;