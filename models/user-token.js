/**
 * Created by Jordan on 2/20/2015.
 */
"use strict";

var hat = require('hat'),
    userTokenRack = hat.rack(256, 36);

module.exports = function (sequelize, DataTypes) {
    var UserToken = sequelize.define("UserToken", {
        value: DataTypes.STRING
    }, {
        classMethods: {
            associate: function (models) {
                UserToken.belongsTo(models.User);
            }
        },
        instanceMethods: {},
        hooks: {
            beforeValidate: function (userToken) {
                if (userToken.isNewRecord) userToken.setDataValue('value', userTokenRack());
                sequelize.Promise.resolve(userToken);
            }
        },
        paranoid: true
    });

    return UserToken;
};