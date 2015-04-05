/**
 * Created by Jordan on 2/22/2015.
 */
'use strict';

module.exports = function (sequelize, DataTypes) {
    var Device = sequelize.define('Device', {
        platform: DataTypes.ENUM(['iOS', 'Android']),
        token: DataTypes.STRING,
        snsToken: DataTypes.STRING
    }, {
        classMethods: {
            associate: function (models) {
                Device.belongsTo(models.User);
            }
        },
        paranoid: true
    });

    return Device;
};