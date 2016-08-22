'use strict';


module.exports = function (grunt) {

    // Load the project's grunt tasks from a directory
    require('grunt-config-dir')(grunt, {
        configDir: require('path').resolve('tasks')
    });


    grunt.loadNpmTasks('grunt-makara-amdify');

    grunt.registerTask('requirejs-with-providers', ['copyto:copy-static-for-rjs', 'requirejs']);

    // Register group tasks
    grunt.registerTask('build', ['eslint', 'eslint', 'bower', 'makara-amdify', 'less', 'requirejs-with-providers', 'dustjs', 'copyto:build']);

    grunt.registerTask('test', ['eslint', 'mochacli']);


};
