/**
 * Created by Jordan on 4/8/2015.
 */
'use strict';

var models = require('../models');

module.exports = function (server) {
    if (process.env.NODE_ENV == "debug") {
        server.get('/utils/drop',
            function (req, res, next) {
                models.sequelize.sync().then(function () {
                    res.send(204);
                    return next();
                });
            }
        );
    }
};