/**
 * Created by Jordan on 22/03/15.
 */

var restify = require('restify');

module.exports =  {
    parseBody: function (req, res, next) {
        restify.bodyParser({
            mapParams: true,
            overrideParams: false
        })(req, res, function (err) {
            if (err) return next(err);
            if (!req.params) req.params = {};
            next()
        });
    }
};