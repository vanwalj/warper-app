/**
 * Created by Jordan on 2/20/2015.
 */

var express     = require('express'),
    winston     = require('winston'),
    passport    = require('passport'),
    app         = express();

app.use(passport.initialize());

require('./configurations/passport');
require('./configurations/winston');
app.use(require('./helpers/short-responses'));
app.use(require('./helpers/error-handling'));

require('./routes')(app);


app.use(function (req, res, next) {
    winston.log('silly', "Received", req.headers);
    next();
});

module.exports = app;