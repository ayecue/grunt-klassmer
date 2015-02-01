/*
 * grunt-klassmer
 * https://github.com/ayecue/grunt-klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var uglifyjs = require('uglify-js'),
    Dependency = require('./lib/dependency'),
    dependencyMapper = require("./lib/dependencymapper"),
    writer = require("./lib/writer"),
    File = require("./lib/file"),
    path = require("path"),
    Config = require("./lib/config");

module.exports = function(grunt) {
    grunt.registerMultiTask('klassmer', 'Merge your files', function() {
        var config = new Config(this.options({
            separator: "\n\n",
            namespace: "result",
            wrapper: {
                module: "var <%= names %> = (function(){ <%= code %> })();",
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

        writer.setConfig(config);

        Dependency.listener.on('create',function(){
            writer.addDependency(this);
        });

        File.listener.on('create',function(){
            dependencyMapper.addFile(this);
        });

        //get source file
        var filepath = config.src;

        if (!grunt.file.isFile(filepath)) {
            grunt.fail.fatal('Invalid path "' + filepath + '".');
            return;
        }

        //find deps and load them
        var dep = new Dependency(config.namespace,filepath,filepath),
            file = new File(filepath);

        file.findDependencies();

        var success = file.loadDependencies(function(){
            return dependencyMapper.isCyclic();
        });

        if (success === false) {
            return;
        }

        //sort deps
        var sorted = dependencyMapper.sort();

        //add sorted list to writer
        grunt.log.writeln("Merging " + sorted.length + " files.");
        writer.setList(sorted);

        //comile source code
        var start = writer.process(config.wrapper.start, {
                namespace : config.namespace
            }),
            end = writer.process(config.wrapper.end, {
                namespace : config.namespace
            }),
            src = writer.get(),
            code = writer.parse(start + src + end);

        grunt.file.write(config.out,code);

        writer.clear();
        dependencyMapper.clear();

        //confirm message
        grunt.log.oklns("Merging complete.");
    });
};
