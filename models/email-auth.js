/**
 * Created by Jordan on 2/20/2015.
 */
"use strict";

var bcrypt  = require('bcrypt');

module.exports = function (sequelize, DataTypes) {
    var EmailAuth = sequelize.define("EmailAuth", {
        email: {
            type: DataTypes.STRING,
            unique: true,
            required: true
        },
        password: {
            type: DataTypes.STRING,
            required: true,
            set: function (v) {
                this.setDataValue('password', bcrypt.hashSync(v, 10));
            }
        }
    }, {
        classMethods: {
            associate: function (models) {
                EmailAuth.belongsTo(models.User);
            }
        },
        instanceMethods: {
            validatePassword: function (password, cb) {
                bcrypt.compare(password, this.password, function (err, res) {
                    if (err) return cb(err);
                    cb(null, res);
                });
            }
        }
    });

    return EmailAuth;
};
