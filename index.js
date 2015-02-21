/**
 * Created by Jordan on 2/20/2015.
 */

var express = require('express'),
    app = express();

require('./routes')(app);

app.use(require('./helpers/short-responses'));
app.use(require('./helpers/error-handling'));

module.exports = app;