/**
 * Created by Jordan on 2/25/2015.
 */

module.exports = function (options) {

    describe('User', function () {
        require('./register')(options);
        require('./email-connection')(options);
        require('./facebook-connection')(options);
        require('./get-account')(options);
        require('./edit')(options);
    });

};