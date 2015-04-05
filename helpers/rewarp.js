/**
 * Created by Jordan on 4/4/2015.
 */
'use strict';

var models = require('../models');

var notificationHelper = require('../helpers/notification');

var rewarp = {};

rewarp.fromWarp = function (params, options) {
    options = options || {};

    return models.User.findAll({ where: { id: params.dest } })
        .map(function (dest) {
            if (dest && dest.id != params.user.id)
                return params.user.hasFollower(dest.id)
                    .then(function (hasFollower) {
                        if (hasFollower)
                            return models.Warp.create({
                                MediumUuid: params.medium.uuid, PreviousWarpId: params.warp.id,
                                DestId: dest.id, WarpId: params.warp.id
                            }, {transaction: options.transaction});
                    });
        }).return(params.warp);
};

rewarp.dispatch = function (warp, options) {
    options = options || {};

    return warp.getNextWarps()
        .map(function (nextWarp) {
            nextWarp.update({ dispatched: true }, { transaction: options.transaction })
                .call('getDest')
                .call('getDevices')
                .map(function (device) {
                    notificationHelper.notify(device, {
                        body: "New nextWarp",
                        warpId: nextWarp.id
                    });
                }).return(warp);
        });
};

module.exports = rewarp;