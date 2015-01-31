/*
 * grunt-klassmer
 * https://github.com/ayecue/grunt-klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var grunt = require('grunt'),
    MapperUtil = require('./mapperutil');

function DependencyMapper(){
    this.collection = [];
    this.util = new MapperUtil();
}

DependencyMapper.prototype = {
    self : DependencyMapper,
    add : function(){
        this.collection.push.apply(this.collection,arguments);
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
            map = me.getMap(),
            isCyclic = me.util.findCyclic();

        if (isCyclic) {
            grunt.log.error('Dependency map is cyclic.');
            return;
        }

        var sorted = me.util.sortMap(map),
            refs = me.getRefMap(),
            result = [];

        for (var index = 0, length = sorted.length; index < length; index++) {
            var filepath = sorted[index];

            if (filepath in refs) {
                result.push(refs[filepath]);
            }
        }

        return result;
    }
};

module.exports = DependencyMapper;