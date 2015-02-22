/**
 * Created by Jordan on 2/22/2015.
 */

module.exports = function (sequelize, DataTypes) {
    var Device = sequelize.define('Device', {
        type: DataTypes.ENUM(['iOS', 'Android']),
        token: DataTypes.STRING
    }, {
        classMethods: {
            associate: function (models) {
                Device.belongsTo(models.User);
            }
        },
        paranoid: true
    });

    return Device;
};