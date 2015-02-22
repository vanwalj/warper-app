/**
 * Created by Jordan on 2/20/2015.
 */
"use strict";

var winston = require('winston');

module.exports = function (req, res, next) {

    res.shortResponses = {
        _response: function (code, content) {
            winston.log('silly', "Send", code, content);
            res.status(code).send(content);
        },
        success: function (content) {
            this._response(200, content || { Success: "OK" });
        },
        created: function (content) {
            this._response(201, content || { Success: "Created" });
        },
        noContent: function (content) {
            this._response(204, content || { Success: "No Content" });
        },
        notModified: function (content) {
            this._response(304, content || { Redirection: "Not Modified" });
        },
        badRequest: function (content) {
            this._response(400, content || { "Client Error": "Bad Request" });
        },
        unauthorized: function (content) {
            this._response(401, content || { "Client Error": "Unauthorized" });
        },
        forbidden: function (content) {
            this._response(403, content || { "Client Error": "Forbidden" });
        },
        notFound: function (content) {
            this._response(404, content || { "Client Error": "Not Found" });
        },
        conflict: function (content) {
            this._response(409, content || { "Client Error": "Conflict" });
        },
        internalServerError: function (content) {
            this._response(500, content || { "Server Error": "Internal Server Error" });
        }
    };
    next();
};