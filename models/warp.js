/**
 * Created by Jordan on 22/02/15.
 */
'use strict';

module.exports = function (sequelize, DataTypes) {
    var Warp = sequelize.define('Warp', {
        latitude: { type: DataTypes.FLOAT },
        longitude: { type: DataTypes.FLOAT },
        dispatched: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false },
        seen: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false }
    }, {
        classMethods: {
            associate: function (models) {
                Warp.belongsTo(Warp, { as: "PreviousWarp" });
                Warp.hasMany(Warp, { as: "NextWarps" });
                Warp.belongsTo(models.User, { as: "Dest" });
                Warp.belongsTo(models.Medium);
            }
        },
        paranoid: true
    });

    return Warp;
};