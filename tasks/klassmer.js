/*
 * grunt-klassmer
 * https://github.com/ayecue/grunt-klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

require('klassmer');

module.exports = function(grunt) {
	grunt.registerMultiTask('klassmer', 'Merge your files', function() {
		var options = this.options({
			separator: "\n\n",
			namespace: "result",
			wrapper: {
				module: "var %idx% = (function(){ %code% })();",
				start: "(function (global, factory) {global.%namespace% = factory(global);}(this, function (global) {",
				end: "return %namespace%;}));"
			},
			wrap: {
				moduleFile: null,
				startFile: null,
				endFile: null
			},
			excludes: [],
			src: null,
			out: null,
			optimizer: {
				beautify : true,
				comments : true
			}
		});

        Klassmer.merge({
			separator : options.separator,
			namespace: options.namespace,
			wrapper: {
				module: options.wrapper.module,
				start: options.wrapper.start,
				end: options.wrapper.end
			},
			wrap: {
				moduleFile: options.wrap.moduleFile,
				startFile: options.wrap.startFile,
				endFile: options.wrap.endFile
			},
			excludes: options.excludes,
			source: options.src,
			output: options.out,
			optimizer: options.optimizer
        });
	});

	grunt.registerMultiTask('klassmer_info', 'Generate dependency map', function() {
		var options = this.options({
			excludes: [],
			src: null,
			out: null
		});

        Klassmer.info({
			excludes: options.excludes,
			source: options.src,
			output: options.out
        });
	});
};