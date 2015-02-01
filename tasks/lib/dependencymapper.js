/*
 * grunt-klassmer
 * https://github.com/ayecue/grunt-klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var grunt = require('grunt'),
    mapperUtil = require('./mapperutil');

function DependencyMapper(){
    this.collection = [];
}

DependencyMapper.prototype = {
    self : DependencyMapper,
    indexOfFile : function(filepath){
        var me = this,
            collection = me.collection;

        for (var index = 0, length = collection.length; index < length; index++) {
            var module = collection[index];

            if (module.getFilepath() === filepath) {
                return index;
            }
        }

        return -1;
    },
    findFile : function(filepath){
        var me = this,
            idx = me.indexOfFile(filepath);

        if (idx !== -1) {
            return me.collection[idx];
        }

        return null;
    },
    addFile : function(){
        var me = this,
            collection = me.collection;

        collection.push.apply(collection,arguments);
    },
    isCyclic: function(){
        var me = this,
            collection = me.collection;

        for (var index = 0, length = collection.length; index < length; index++) {
            var module = collection[index],
                deps = module.getDependencies();

            for (var x = 0,y = deps.length; x < y; x++) {
                var dep = deps[x],
                    otherModule = me.findFile(dep.getFilepath());

                if (otherModule) {
                    var otherDep = otherModule.getDependency(module.getFilepath());

                    if (otherDep) {
                        grunt.fail.fatal('Dependency map is cyclic.');
                        return false;
                    }
                }
            }
        }

        return true;
    },
    getMap : function(){
        var me = this,
            result = {},
            find = function(deps){
                var result = [];

                for (var y = 0, x = deps.length; y < x; y++) {
                    result.push(deps[y].getFilepath());
                }

                return result;
            };

        for (var index = 0, length = me.collection.length; index < length; index++) {
            var file = me.collection[index];

            result[file.getFilepath()] = find(file.getDependencies());
        }

        return result;
    },
    getRefMap : function(){
        var me = this,
            result = {};

        for (var index = 0, length = me.collection.length; index < length; index++) {
            var file = me.collection[index];
            result[file.getFilepath()] = file;
        }

        return result;
    },
    sort : function(){
        var me = this,
            map = me.getMap();

        var sorted = mapperUtil.sortMap(map),
            refs = me.getRefMap(),
            result = [];

        for (var index = 0, length = sorted.length; index < length; index++) {
            var filepath = sorted[index];

            if (filepath in refs) {
                result.push(refs[filepath]);
            }
        }

        return result;
    },
    clear : function(){
        this.collection = [];
    }
};

module.exports = new DependencyMapper();