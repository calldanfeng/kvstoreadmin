'use strict';

var domain = require('domain'),
    errorHandler = require('./errorHandler');

/**
 * Some libs (e.g.) that have async methods may cause the server crash.
 * Wrap the funcs who call these libs with this function to respond
 *  unhandled exceptions in this case.
 * @param handler
 * @returns {Function}
 */
module.exports = function errorSafe(handler) {
    return function (req, res) {

        var d = domain.create();

        var args = arguments;

        d.on('error', function (err) {
            errorHandler(err, req, res);
            d.dispose();
        });

        d.run(function () {
            return handler.apply(this, args);
        });
    };
};
