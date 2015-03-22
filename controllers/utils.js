/**
 * Created by Jordan on 22/03/15.
 */

var restify = require('restify');

module.exports =  {
    parseBody: function (req, res, next) {
        restify.bodyParser()(req, res, function (err) {
            if (err) return next(err);
            if (!req.body) req.body = {};
            next()
        });
    }
};