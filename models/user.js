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
        username: { type: DataTypes.STRING }
    }, {
        classMethods: {
            associate: function (models) {

                User.hasMany(models.Follow, {
                    as: 'Followers',
                    foreignKey: 'FollowerId'
                });

                User.hasMany(models.Follow, {
                    as: 'Follows',
                    foreignKey: 'FollowId'
                });

                User.hasMany(models.Device);
                User.hasMany(models.UserToken);
                User.hasMany(models.Medium);

                User.hasOne(models.FacebookAuth);
                User.hasOne(models.EmailAuth);
            }
        },
        instanceMethods: {
            follow: function (userId, options) {
                options = options || {};
                return sequelize.models.Follow.create({
                    FollowerId: this.id,
                    FollowingId: userId
                }, { transaction: options.transaction })
                    .return(this);
            }
        },
        paranoid: true
    });

    return User;
};