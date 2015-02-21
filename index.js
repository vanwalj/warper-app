/**
 * Created by Jordan on 2/20/2015.
 */

var express = require('express'),
    winston = require('winston'),
    app     = express();

require('./routes')(app);

app.use(function (req, res, next) {
    winston.log('silly', "Received", req.headers);
    next();
});

app.use(require('./helpers/short-responses'));
app.use(require('./helpers/error-handling'));

module.exports = app;