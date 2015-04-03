/**
 * Created by Jordan on 2/21/2015.
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var Media = sequelize.define('Media', {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true
        },
        contentType: { type: DataTypes.STRING, allowNull: false },
        contentLength: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        snsValid: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        classMethods: {
            associate: function (models) {
                Media.belongsTo(models.User, { as: 'Owner' });
                Media.hasMany(models.Warp);
            }
        },
        paranoid: true
    });

    return Media;
};