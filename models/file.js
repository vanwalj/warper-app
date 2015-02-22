/**
 * Created by Jordan on 2/21/2015.
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var File = sequelize.define('File', {
        contentType: DataTypes.STRING,
        contentLength: DataTypes.STRING
    }, {
        classMethods: {
            associate: function (models) {
                File.belongsTo(models.User, { as: 'Owner' });
            }
        }
    });

    return File;
};