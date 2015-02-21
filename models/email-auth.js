/**
 * Created by Jordan on 2/20/2015.
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var EmailAuth = sequelize.define("EmailAuth", {
        email: {
            type: DataTypes.STRING,
            unique: true,
            required: true
        },
        password: {
            type: DataTypes.STRING,
            required: true
        }
    }, {
        classMethods: {
            associate: function (models) {
                EmailAuth.belongsTo(models.User);
            }
        },
        instanceMethods: {}
    });

    return EmailAuth;
};
