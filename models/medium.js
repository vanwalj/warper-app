/**
 * Created by Jordan on 2/21/2015.
 */
'use strict';

var AWS = require('aws-sdk');
var s3 = new AWS.S3();

module.exports = function (sequelize, DataTypes) {
    var Medium = sequelize.define('Medium', {
        uuid: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
            allowNull: false
        },
        url: {
            type: DataTypes.VIRTUAL,
            get: function (){
                if (this.isValid)
                    return s3.getSignedUrl('getObject', {Bucket: process.env.AWS_S3_BUCKET, Key: this.uuid, Expires: 60}, undefined );
                return null;
            }
        },
        contentType: { type: DataTypes.STRING, allowNull: false },
        contentLength: { type: DataTypes.INTEGER.UNSIGNED, allowNull: false },
        isValid: { type: DataTypes.BOOLEAN, defaultValue: false, allowNull: false }
    }, {
        classMethods: {
            associate: function (models) {
                Medium.belongsTo(models.User, { as: 'Owner' });
                Medium.hasMany(models.Warp);
                Medium.hasOne(models.Warp, { as: 'RootWarp' });
            }
        },
        paranoid: true
    });

    return Medium;
};