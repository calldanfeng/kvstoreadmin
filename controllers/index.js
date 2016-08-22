'use strict';

var providerLookUp = require('../lib/providerLookUp');

module.exports = function (router) {

    function compareVersion(v1, v2) {

        var arr1 = v1.split('.'),
            arr2 = v2.split('.');

        for (var i = 0; i < 3; i++) {
            var n1 = parseInt(arr1[i] || 0);
            var n2 = parseInt(arr2[i] || 0);

            if (n1 !== n2) {
                return n1 - n2;
            }
        }

        return 0;
    }


    router.get('/', function (req, res) {
        var supported = false;
        if (req.useragent) {
            var browser = req.useragent.browser,
                version = req.useragent.version;

            var versionMap = {
                Chrome: '43',
                Chromium: '43',
                Firefox: '45',
                Safari: '9',
                IE: '11',
                Edge: '0',
                Opera: '39'
            };

            supported = versionMap[browser] && compareVersion(String(version), versionMap[browser]) >= 0;
        }

        var providers = providerLookUp.getAvailableProviders();

        if (supported) {
            res.render('main', {
                providers: providers,
                providersJSON: JSON.stringify(providers),
                isDev: !process.env.NODE_ENV || process.env.NODE_ENV.toLowerCase() === 'development'
            });
        } else {
            res.render('browser-not-supported');
        }
    });
};
