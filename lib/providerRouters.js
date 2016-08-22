'use strict';
var serveStatic = require('serve-static'),
    enrouten = require('express-enrouten'),
    providerLookUp = require('./providerLookUp');

module.exports = (function () {

    var serveStaticFiles = function (app) {
        if (!process.env.NODE_ENV || process.env.NODE_ENV.toLowerCase() === 'development') {

            providerLookUp.getAvailableProviders().forEach(function (provider) {
                var providerRoot = __dirname + '/../providers/' + provider.name + '/';
                app.use(serveStatic(providerRoot + 'public'));
            });
        }
    };

    var registerRoutes = function (app) {
        providerLookUp.getAvailableProviders().forEach(function (provider) {
            var providerRoot = '../providers/' + provider.name + '/';
            app.use(enrouten({
                directory: providerRoot + 'controllers'
            }));
        });
    };

    return {
        serveStaticFiles: serveStaticFiles,
        registerRoutes: registerRoutes
    };

})();
