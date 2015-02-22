/**
 * Created by Jordan on 22/02/15.
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var Warp = sequelize.define('Warp', {
        latitude: DataTypes.FLOAT,
        longitude: DataTypes.FLOAT,
        distance: DataTypes.FLOAT.UNSIGNED
    }, {
        classMethods: {
            associate: function (models) {
                Warp.belongsTo(Warp, { as: "Previous" });
                Warp.belongsTo(Warp, { as: "Next" });
                Warp.belongsTo(models.User, { as: "Sender" });
                Warp.belongsTo(models.User, { as: "Dest" });
                Warp.belongsTo(models.File);
            }
        }
    });

    return Warp;
};