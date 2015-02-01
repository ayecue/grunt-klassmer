/*
 * grunt-klassmer
 * https://github.com/ayecue/grunt-klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var grunt = require('grunt'),
    uglifyjs = require('uglify-js'),
    File = require('./file'),
    analyzer = require('./analyzer');

function Writer(){
    var me = this;

    me.names = {};
    me.list = [];
    me.config = {};
}

Writer.prototype = {
    self : Writer,
    addDependency : function(dep){
        var filepath = dep.getFilepath(),
            name = dep.getName();

        if (filepath in this.names) {
            if (this.names[filepath].indexOf(name) === -1) {
                this.names[filepath].push(name);
            }
        } else {
            this.names[filepath] = [name];
        }
    },
    setList : function(list){
        this.list = list;
    },
    setConfig : function(config){
        this.config = config;
    },
    get : function(){
        var me = this,
            config = me.config,
            list = me.list,
            converted = [];

        for (var index = 0, length = list.length; index < length; index++) {
            var module = list[index],
                names = me.names[module.getFilepath()],
                filecontent = module.getFilecontent(),
                processed = me.moduleWrap(names,filecontent),
                code = me.parse(processed,analyzer.findRequire.bind(analyzer));

            converted.push(code);
        }

        return converted.join(config.separator);
    },
    getAssign : function(names){
        var other = names.slice(1),
            result = [];

        if (other.length > 0) {
            result.push(other);
        }

        result.push(names.join('='));

        return result.join(',');
    },
    moduleWrap : function(names,code){
        var me = this,
            config = me.config;

        return me.process(config.wrapper.module, {
            names : me.getAssign(names),
            code : code
        });
    },
    parse : function(code,process){
        var me = this,
            config = me.config,
            parsed = uglifyjs.parse(code),
            stream = uglifyjs.OutputStream(config.optimizer);

        if (process) {
            process(parsed);
        }

        parsed.print(stream);

        return stream.toString();
    },
    process : function(code,data){
        var me = this;

        return grunt.template.process(code, {
            data: data
        });
    },
    clear : function(){
        var me = this;

        me.names = {};
        me.list = [];
        me.config = {};
    }
};

module.exports = new Writer();