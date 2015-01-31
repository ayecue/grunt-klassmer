/*
 * grunt-klassmer
 * https://github.com/ayecue/grunt-klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var grunt = require('grunt'),
    path = require('path'),
    Dependency = require('./dependency'),
    Listener = require('./listener');

function File(filepath,basedir){
    var me = this;

    me.filepath = filepath;
    me.filecontent = grunt.file.read(filepath);
    me.dependencies = [];
    me.basedir = basedir || path.dirname(filepath);
    me.files = [];

    me.self.listener.fire('create',me,arguments);
}

File.listener = new Listener();
File.requirePattern = /(\w*?)\s*[^.]\s*require\s*\(\s*["']([^'"\s]+)["']\s*\)/g;
File.normalizeRelativePath = /^\.\//;
File.normalizeRelativeBackPath = /^\.\.\//;
File.normalizeLastDir = /\/?[^\/]+\/?$/;
File.normalize = function(source,target,basedir){
    var sourceDirectory = path.dirname(source),
        result = [];

    basedir = basedir || sourceDirectory;

    if (target.charAt(0) === '.') {
        if (target.charAt(1) === '.') {
            var dir = sourceDirectory.replace(this.normalizeLastDir,'');

            result.push(target.replace(this.normalizeRelativeBackPath,dir + '/') + '.js');
        } else {
            result.push(target.replace(this.normalizeRelativePath,sourceDirectory + '/') + '.js');
        }
    } else {
        result.push(basedir);
        result.push(target  + '.js');
    }

    return result.join('/');
};

File.prototype = {
    self : File,
    getDependencies : function(){
        return this.dependencies;
    },
    getFilepath : function(){
        return this.filepath;
    },
    getFilecontent : function(){
        return this.filecontent;
    },
    setBasedir : function(v){
        if (this.basedir === null) {
            this.basedir = v;
        }
        return this;
    },
    getBasedir : function(){
        return this.basedir;
    },
    indexOfDep : function(filepath){
        var me = this,
            deps = me.dependencies;

        for (var index = 0, length = deps.length; index < length; index++) {
            var dep = deps[index];

            if (dep.getFilepath() === filepath) {
                return index;
            }
        }

        return -1;
    },
    findDep : function(filepath){
        var me = this,
            idx = me.indexOfDep(filepath);

        if (idx !== -1) {
            return me.dependencies[idx];
        }

        return null;
    },
    findDependencies : function(){
        var me = this,
            deps = me.dependencies;

        me.filecontent.replace(me.self.requirePattern, function (match,name,fp) {
            var dep = new Dependency(
                name,
                fp,
                me.self.normalize(me.filepath,fp,me.getBasedir())
            );

            deps.push(dep);
        });
    },
    loadDependencies : function(processFn){
        var me = this,
            deps = me.dependencies;

        for (var index = 0, length = deps.length; index < length; index++){
            var dependency = deps[index],
                filepath = dependency.getFilepath();

            if (!grunt.file.isFile(filepath)) {
                grunt.fail.fatal('Invalid require path "' + filepath + '".');
                return false;
            }

            if (processFn && processFn(dependency) === false) {
                return false;
            }

            var source = new File(filepath,me.getBasedir());

            source.findDependencies();

            var success = source.loadDependencies(processFn);

            if (success === true) {
                me.files.push(source);
            } else {
                return false;
            }
        }

        return true;
    }
};

module.exports = File;