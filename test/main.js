/**
 * Created by Jordan on 2/3/2015.
 */
"use strict";

require('mocha');
var models  = require('../models'),
    app     = require('../index');

before(function (done) {
    models.sequelize.sync({force: true}).then(function () {
        done();
    });
});

var options = { app: app, models: models };

require('./user')(options);
require('./follow')(options);
require('./warp')(options);