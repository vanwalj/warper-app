/**
 * Created by Jordan on 4/1/2015.
 */
'use strict';

module.exports = function (sequelize) {
    var Follow = sequelize.define('Follow', {}, {
        classMethods: {
            associate: function (models) {

                Follow.belongsTo(models.User, {
                    as: 'Follower',
                    foreignKey: 'FollowerId'
                });

                Follow.belongsTo(models.User, {
                    as: 'Follow',
                    foreignKey: 'FollowId'
                });

            }
        }
    });

    return Follow;
};