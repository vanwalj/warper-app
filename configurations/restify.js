/**
 * Created by Jordan on 4/3/2015.
 */
'use strict';

var restify = require('restify');
var winston = require('winston');
var cors    = require('cors');
var server = restify.createServer({
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

server.use(cors());
//server.use(restify.CORS());


server.use(restify.bodyParser({
    mapParams: true,
    overrideParams: false
}));

server.use(restify.queryParser());

module.exports = server;