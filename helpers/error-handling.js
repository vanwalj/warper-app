/**
 * Created by Jordan on 2/20/2015.
 */

var winston = require('winston');

module.exports = function (err, req, res, next) {
    winston.error(err);
    res.shortResponses.internalServerError();
};