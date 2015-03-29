/**
 * Created by Jordan on 2/20/2015.
 */

var restify     = require('restify'),
    winston     = require('winston'),
    server      = restify.createServer({
        name: "Warper !",
        version: "1.0.0"
    });

server.on('InternalServerError', function (req, res, err, cb) {
    winston.error(err);
    return cb();
});

server.on('after', function (req, res, route, error) {
    winston.log('info', "HTTP LOG", { request: {
        time: req.time(),
        headers: {
            contentLength: req.contentLength(),
            contentType: req.contentType(),
            href: req.href(),
            path: req.path()
        },
        secured: req.isSecure(),
        chunked: req.isChunked(),
        keepAlive: req.isKeepAlive(),
        params: req.params,
        body: req.body
    }, response: {
        statusCode: res.statusCode,
        send: res._data
    }, route: route,
        error: error });
});

server.use(restify.CORS());
server.use(restify.bodyParser({
    mapParams: true,
    overrideParams: false
}));

require('./configurations/passport')(server);
require('./configurations/winston');

require('./routes')(server);

module.exports = server;