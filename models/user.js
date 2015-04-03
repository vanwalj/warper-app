/**
 * Created by Jordan on 2/20/2015.
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var User = sequelize.define("User", {
        email: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false,
            validate: {
                isEmail: true
            }
        },
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        gender: DataTypes.STRING,
        username: { type: DataTypes.STRING }
    }, {
        classMethods: {
            associate: function (models) {

                User.belongsToMany(User, {
                    as: 'Follower',
                    through: models.Follower
                });

                User.hasMany(models.Device);
                User.hasMany(models.Warp, { as: "Sender" });
                User.hasMany(models.Warp, { as: "Receiver" });
                User.hasMany(models.UserToken);
                User.hasMany(models.Media);

                User.hasOne(models.FacebookAuth);
                User.hasOne(models.EmailAuth);
            }
        },
        instanceMethods: {},
        paranoid: true
    });

    return User;
};