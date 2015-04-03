/**
 * Created by Jordan on 22/02/15.
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var Warp = sequelize.define('Warp', {
        latitude: DataTypes.FLOAT,
        longitude: DataTypes.FLOAT,
        distance: DataTypes.BIGINT.UNSIGNED,
        transmit: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    }, {
        classMethods: {
            associate: function (models) {
                Warp.belongsTo(Warp, { as: "Previous" });
                Warp.belongsTo(Warp, { as: "Next" });
                Warp.belongsTo(models.User, { as: "Sender" });
                Warp.belongsTo(models.User, { as: "Receiver" });
                Warp.belongsTo(models.Media);
            }
        },
        paranoid: true
    });

    return Warp;
};