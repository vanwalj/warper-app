/**
 * Created by Jordan on 2/21/2015.
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    var Friends = sequelize.define("Friends", {
        status: {
            type: DataTypes.ENUM,
            values: ['active', 'pending']
        },
        from: {
            type: DataTypes.INTEGER.UNSIGNED,
            unique: 'userIndex'
        },
        to: {
            type: DataTypes.INTEGER.UNSIGNED,
            unique: 'userIndex'
        }
    }, {
        paranoid: true
    });

    return Friends;
};