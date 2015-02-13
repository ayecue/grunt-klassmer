/*
 * grunt-klassmer
 * https://github.com/ayecue/grunt-klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/**/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },

    // Before generating any new files, remove any previously-created files.
    clean: {
      tests: ['tmp']
    },

    // Configuration to be run (and then tested).
    klassmer: {
      simple: {
        options : {
          src : 'test/fixtures/src/simpleB.js',
          out : 'tmp/merged_simple.js'
        }
      },
      simple_optimized: {
        options : {
          src : 'test/fixtures/src/simpleB.js',
          out : 'tmp/merged_simple_opt.js',
          optimizer : {
              beautify : false,
              comments : false
          }
        }
      },
      simple_namespace: {
        options : {
          namespace : 'myClass',
          src : 'test/fixtures/src/simpleB.js',
          out : 'tmp/merged_simple_namespace.js'
        }
      },
      object: {
        options : {
          src : 'test/fixtures/src/objectB.js',
          out : 'tmp/merged_object.js'
        }
      }
    },

    klassmer_info: {
      simple: {
        options : {
          src : 'test/fixtures/src/simpleB.js',
          out : 'tmp/test.html'
        }
      }
    },

    // Unit tests.
    nodeunit: {
      tests: ['test/*_test.js']
    }
  });

  // Actually load this plugin's task(s).
  grunt.loadTasks('tasks');

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  // Whenever the "test" task is run, first clean the "tmp" dir, then run this
  // plugin's task(s), then test the result.
  grunt.registerTask('test', ['clean', 'klassmer', 'klassmer_info', 'nodeunit']);

  // By default, lint and run all tests.
  grunt.registerTask('default', ['jshint', 'test']);
};
