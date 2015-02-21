/**
 * Created by Jordan on 2/20/2015.
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var UserToken = sequelize.define("UserToken", {
        value: DataTypes.STRING
    }, {
        classMethods: {
            associate: function (models) {
                UserToken.belongsTo(models.User);
            }
        },
        instanceMethods: {}
    });

    return UserToken;
};