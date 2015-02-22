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
        username: DataTypes.STRING
    }, {
        classMethods: {
            associate: function (models) {
                User.belongsToMany(User, {
                    as: 'Friend',
                    through: models.Friends
                });
                User.hasMany(models.Device);
                User.hasMany(models.Warp, { as: "Sender" });
                User.hasMany(models.Warp, { as: "Receiver" });
                User.hasMany(models.UserToken);
                User.hasMany(models.File);
                User.hasOne(models.FacebookAuth);
                User.hasOne(models.EmailAuth);
            }
        },
        instanceMethods: {},
        paranoid: true
    });

    return User;
};