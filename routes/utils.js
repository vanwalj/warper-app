/**
 * Created by Jordan on 4/8/2015.
 */
'use strict';

modules.exports = function (server) {
    if (process.env.NODE_ENV == "debug") {
        server.get('/utils/drop',
            function (req, res, next) {
                models.sequelize.sync().then(next);
            }
        );
    }
};