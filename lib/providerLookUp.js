'use strict';
var fs = require('fs'),
    logger = require('./logger');

module.exports = (function () {

    var _providersCache = null;

    var getAvailableProviders = function () {
        if (!_providersCache) {
            _providersCache = [];
            fs.readdirSync('./providers').forEach(function (providerName) {
                var packagePath, packageBody, providerInfo;
                packagePath = 'providers/' + providerName + '/package.json';

                if (fs.existsSync('./' + packagePath)) {
                    try {
                        packageBody = require('../' + packagePath);
                        if ((providerInfo = packageBody['provider-info']) &&
                            providerInfo['name'] && providerInfo['title']) {

                            providerInfo['rootPath'] = 'providers/' + providerInfo['name'];
                            _providersCache.push(providerInfo);

                        } else {
                            logger.error('package.json of the data source provider ' + providerName + ' must ' +
                                'contain a "provider-info" node with "name" and "display-name" property.');
                        }
                    } catch (ex) {
                        logger.error('Invalid package.json structure for data source provider:' + providerName);
                    }
                }
            });

            _providersCache.sort(function (p1, p2) {
                var o1 = typeof p1.order === 'number' ? p1.order : Number.MAX_VALUE,
                    o2 = typeof p2.order === 'number' ? p2.order : Number.MAX_VALUE;
                return o1 - o2;
            });
        }
        return _providersCache;
    };

    return {
        getAvailableProviders: getAvailableProviders
    };

})();
