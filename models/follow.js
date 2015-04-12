/**
 * Created by Jordan on 4/1/2015.
 */
'use strict';

module.exports = function (sequelize) {
    var Follow = sequelize.define('Follow', {}, {
        classMethods: {}
    });

    return Follow;
};