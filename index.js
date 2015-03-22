/**
 * Created by Jordan on 2/20/2015.
 */

var restify     = require('restify'),
    winston     = require('winston'),
    passport    = require('passport'),
    server      = restify.createServer({
        name: "Warper !",
        version: "1.0.0"
    });


require('./configurations/passport')(server);
require('./configurations/winston');

require('./routes')(server);

module.exports = server;