'use strict';

var providerLookUp = require('../lib/providerLookUp');

module.exports = function requirejs(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-contrib-requirejs');

    // Options
    var thirdParties = ['jquery', 'jqueryui', 'knockout', 'komapping', 'semantic', 'text', 'underscore', 'promise'];

    // Option for having the providers combined together with the main frame.
    var includesProviders = providerLookUp.getAvailableProviders().map(function (provider) {
        return provider.name + '/registration';
    });

    return {
        'build-main-frame': {
            options: {
                removeCombined: true,
                baseUrl: '.temp',
                dir: '.build',
                optimize: 'uglify',
                skipDirOptimize: true,
                optimizeCss: 'none',
                paths: {
                    'jquery': 'components/jquery/dist/jquery.min',
                    'jqueryui': 'components/jquery-ui/jquery-ui.min',
                    'promise': 'components/promise-polyfill/promise.min',
                    'underscore': 'components/underscore/underscore-min',
                    'knockout': 'components/knockout/dist/knockout',
                    'komapping': 'components/knockout-mapping/build/output/knockout.mapping-latest',
                    'text': 'components/text/text',
                    'semantic': 'components/semantic/dist/semantic.min',
                    'rest': 'lib/ajax-restful',
                    'store': 'lib/browser-local-store'
                },
                modules: [
                    {
                        name: 'boot',
                        include: includesProviders,
                        exclude: thirdParties
                    }
                ]
            }
        }
    };
};
