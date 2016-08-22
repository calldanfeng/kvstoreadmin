'use strict';

module.exports = function bower(grunt) {

    grunt.loadNpmTasks('grunt-bower-task');

    return {
        install: {
            options: {
                targetDir: './.bower',
                cleanBowerDir: false
            }
        }
    };
};
