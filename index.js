/**
 * Created by Jordan on 2/20/2015.
 */
'use strict';

var server = require('./configurations/restify');

require('./configurations/aws');
require('./configurations/passport')(server);
require('./configurations/winston');

require('./routes')(server);
require('./worker/index');

module.exports = server;