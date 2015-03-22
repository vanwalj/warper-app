/**
 * Created by Jordan on 2/20/2015.
 */

var fs  = require('fs');

module.exports = function (server) {

    fs
        .readdirSync(__dirname)
        .filter(function (fileName) {
            return fileName !== "index.js";
        }).forEach(function (fileName) {
            require('./' + fileName)(server);
        });

};
