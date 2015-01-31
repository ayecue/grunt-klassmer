/*
 * grunt-klassmer
 * https://github.com/ayecue/grunt-klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var glob = require("glob"),
    Dependency = require('./lib/dependency'),
    DependencyMapper = require("./lib/dependencymapper"),
    Writer = require("./lib/writer"),
    File = require("./lib/file"),
    path = require("path"),
    Config = require("./lib/config");

module.exports = function(grunt) {
    grunt.registerMultiTask('klassmer', 'Merge your files', function() {
        var options = this.options({
                separator: "\n\n",
                name: "result",
                wrapper: {
                    module: "var <%= names %> = (function(){ <%= code %> })();",
                    start: "(function (global, factory) {global.<%= result %> = factory(global);}(this, function (global) {",
                    end: "return <%= result %>;}));"
                },
                wrap: {
                    moduleFile: null,
                    startFile: null,
                    endFile: null
                },
                src: null,
                out: null
            });

        var config = new Config(options);

        if (config.hasExceptions()) {
            config.print();
            return;
        }

        var dependencyMapper = new DependencyMapper(),
            writer = new Writer(config);

        Dependency.listener.on('create',function(){
            writer.addDependency(this);
        });

        File.listener.on('create',function(){
            dependencyMapper.add(this);
        });

        //get source file
        var filepath = config.src;

        if (!grunt.file.isFile(filepath)) {
            grunt.log.error('Invalid path "' + filepath + '".');
            return;
        }

        //find deps and load them
        var dep = new Dependency(config.name,filepath,filepath),
            file = new File(filepath);

        file.findDependencies();
        file.loadDependencies();

        //sort deps
        var sorted = dependencyMapper.sort();

        //add sorted list to writer
        grunt.log.writeln("Merging " + sorted.length + " files.");
        writer.setList(sorted);

        //comile source code
        var src = [
            grunt.template.process(config.wrapper.start, {
                data: {
                    result : config.name
                }
            }),
            writer.get(),
            grunt.template.process(config.wrapper.end, {
                data: {
                    result : config.name
                }
            })
        ].join("");

        //confirm message
        grunt.file.write(config.out,src);
        grunt.log.oklns("Merging complete.");
    });
};
