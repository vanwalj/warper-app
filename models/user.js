/**
 * Created by Jordan on 2/20/2015.
 */
'use strict';

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
        username: { type: DataTypes.STRING }
    }, {
        classMethods: {
            associate: function (models) {

                User.belongsToMany(User, {
                    as: 'Followers',
                    through: models.Follower
                });

                User.hasMany(models.Device);
                User.hasMany(models.UserToken);
                User.hasMany(models.Medium);

                User.hasOne(models.FacebookAuth);
                User.hasOne(models.EmailAuth);
            }
        },
        instanceMethods: {},
        paranoid: true
    });

    return User;
};