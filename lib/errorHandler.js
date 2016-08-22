'use strict';
var logger = require('./logger');

module.exports = function () {
    return function (err, req, res, next) {
        try {
            var message = 'Unhandled error: ' + (err && err.message);
            logger.error(err.stack);
            res.status(500).send(message);
            next && next(err);

        } catch (ex) {
            logger.error(ex.stack);
        }
    };
};
