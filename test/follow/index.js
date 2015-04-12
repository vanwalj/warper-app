/**
 * Created by Jordan on 4/2/2015.
 */

module.exports = function (options) {

    describe('Follow', function () {
        require('./follow')(options);
        require('./getFollowing')(options);
        require('./getFollower')(options);
        require('./getFriends')(options);
    });

};