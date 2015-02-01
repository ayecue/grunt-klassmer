'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.klassmer = {
  setUp: function(done) {
    // setup here if necessary
    done();
  },
  merge_files: function(test) {
    var files = [
      'merged_simple.js',
      'merged_simple_opt.js',
      'merged_simple_namespace.js'
    ];

    test.expect(files.length);

    files.forEach(function(file) {
      var actual = grunt.file.read(['tmp', file].join('/'));
      var expected = grunt.file.read(['test', 'fixtures', 'expected', file].join('/'));
      test.equal(actual, expected, 'task output should equal ' + file);
    });

    test.done();
  }
};
