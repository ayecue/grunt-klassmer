/*
 * grunt-klassmer
 * https://github.com/ayecue/grunt-klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var grunt = require('grunt');

function Config(options){
    var me = this;

    me.options = options;
    me.exceptions = [];
    me.wrapper = {
        module : options.wrapper.module,
        start : options.wrapper.start,
        end : options.wrapper.end
    };
    me.src = options.src;
    me.out = options.out;
    me.name = options.name;
    me.separator = options.separator;

    me.init();
}

Config.prototype = {
    self : Config,
    init : function(){
        var me = this,
            options = me.options;

        if (!me.src) {
            me.exceptions.push('Please define src parameter in options.');
            return;
        }

        if (!me.out) {
            me.exceptions.push('Please define out parameter in options.');
            return;
        }

        if (grunt.util.kindOf(me.name) !== "string") {
            me.exceptions.push('Invalid name option. Have to be a string.');
            return;
        }

        if (grunt.util.kindOf(me.separator) !== "string") {
            me.exceptions.push('Invalid separator option. Have to be a string.');
            return;
        }

        if (options.wrap.moduleFile) {
            if (!grunt.file.isFile(options.wrap.moduleFile)) {
                me.exceptions.push('Invalid wrap.moduleFile option. Not a file.');
                return;
            }

            me.wrapper.module = grunt.file.read(options.wrap.moduleFile);
        }

        if (options.wrap.startFile) {
            if (!grunt.file.isFile(options.wrap.startFile)) {
                me.exceptions.push('Invalid wrap.startFile option. Not a file.');
                return;
            }

            me.wrapper.start = grunt.file.read(options.wrap.startFile);
        }

        if (options.wrap.endFile) {
            if (!grunt.file.isFile(options.wrap.endFile)) {
                me.exceptions.push('Invalid wrap.endFile option. Not a file.');
                return;
            }

            me.wrapper.end = grunt.file.read(options.wrap.endFile);
        }
    },
    hasExceptions : function(){
        return this.exceptions.length > 0;
    },
    print : function(){
        var me = this,
            exceptions = me.exceptions;

        for (var index = 0, length = exceptions.length; index < length; index++) {
            grunt.log.error(exceptions[index]);
        }
    }
};

module.exports = Config;