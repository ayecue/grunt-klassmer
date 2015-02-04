/*
 * grunt-klassmer
 * https://github.com/ayecue/grunt-klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Loader = require('./lib/loader'),
	Parser = require('./lib/parser'),
	Config = require("./lib/config");

module.exports = function(grunt) {
	grunt.registerMultiTask('klassmer', 'Merge your files', function() {
		var config = new Config(this.options({
			separator: "\n\n",
			namespace: "result",
			wrapper: {
				module: "var <%= idx %> = (function(){ <%= code %> })();",
				start: "(function (global, factory) {global.<%= namespace %> = factory(global);}(this, function (global) {",
				end: "return <%= namespace %>;}));"
			},
			wrap: {
				moduleFile: null,
				startFile: null,
				endFile: null
			},
			src: null,
			out: null,
			optimizer: {
				beautify : true,
				comments : true
			}
		}));

        if (config.hasExceptions()) {
			config.print();
			return;
		}

		var parser = new Parser(
				config.namespace,
				config.wrapper.module,
				config.wrapper.start,
				config.wrapper.end,
				config.separator,
				config.optimizer
			),
			loader = new Loader(config.src,parser,true);

		grunt.file.write(config.out,loader.run());

		//confirm message
        grunt.log.oklns("Merging complete.");
	});
};