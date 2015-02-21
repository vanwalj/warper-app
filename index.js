/**
 * Created by Jordan on 2/20/2015.
 */

var express = require('express'),
    app = express();

app.use('./routes');

module.exports = app;