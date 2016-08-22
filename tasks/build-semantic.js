'use strict';

module.exports = function buildSemantic(grunt) {

    grunt.loadNpmTasks('grunt-shell');

    return {
        install: {
            options: {
                targetDir: './.bower',
                cleanBowerDir: false
            }
        }
    };
};
