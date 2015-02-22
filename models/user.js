/**
 * Created by Jordan on 2/20/2015.
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
        email: {
            type: DataTypes.STRING,
            unique: true,
            required: true
        },
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        gender: DataTypes.STRING,
        nickname: {
            type: DataTypes.STRING,
            required: true
        }
    }, {
        classMethods: {
            associate: function (models) {
                User.belongsToMany(User, {
                    as: 'Friend',
                    through: models.Friends
                });
            }
        },
        instanceMethods: {}
    });

    return User;
};