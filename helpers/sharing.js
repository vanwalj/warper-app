/**
 * Created by Jordan on 2/22/2015.
 */

var sendWarp = function (warp) {
    warp.transmit = true;
    warp.save()
        .then(function (warp) {

        });
};

var shareFile = function (file) {
    file.getWarps()
        .then(function (warps) {
            warps.filter(function (warp) {
                return !warp.transmit
            }).forEach(function (warp) {
                sendWarp(warp);
            });
        });
};


module.exports = {
    sendWarp: sendWarp,
    shareFile: shareFile
};