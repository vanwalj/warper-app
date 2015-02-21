/**
 * Created by Jordan on 2/20/2015.
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var FacebookAuth = sequelize.define("FacebookAuth", {
        email: {
            type: DataTypes.STRING,
            unique: true,
            required: true
        },
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        gender: DataTypes.STRING,
        nickname: DataTypes.STRING
    }, {
        classMethods: {
            associate: function (models) {
                FacebookAuth.belongsTo(models.User);
            }
        },
        instanceMethods: {}
    });

    return FacebookAuth;
};