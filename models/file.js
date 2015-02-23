/**
 * Created by Jordan on 2/21/2015.
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var File = sequelize.define('File', {
        id: {
            type: DataTypes.BIGINT.UNSIGNED,
            primaryKey: true,
            autoIncrement: true
        },
        contentType: DataTypes.STRING,
        contentLength: DataTypes.INTEGER.UNSIGNED,
        snsValid: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        classMethods: {
            associate: function (models) {
                File.belongsTo(models.User, { as: 'Owner' });
                File.hasMany(models.Warp);
            }
        },
        paranoid: true
    });

    return File;
};