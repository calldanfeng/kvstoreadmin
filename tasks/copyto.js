'use strict';

var providerLookUp = require('../lib/providerLookUp'),
    extend = require('extend');

module.exports = function copyto(grunt) {
    // Load task
    grunt.loadNpmTasks('grunt-copy-to');

    var staticFiles = [{
        cwd: 'public',
        src: ['**/*'],
        dest: '.temp/'
    }];

    providerLookUp.getAvailableProviders().forEach(function (provider) {
        staticFiles.push({
            cwd: provider.rootPath + '/public',
            src: ['**/*'],
            dest: '.temp/'
        });
    });

    // Options
    return {
        'copy-static-for-rjs': {
            files: staticFiles
        },
        build: {
            files: [{
                cwd: 'public/images',
                src: ['**/*'],
                dest: '.build/images/'
            }]
        }
    };
};
