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
    Analyzer = require('./analyzer');

var analyzer = new Analyzer();

function Writer(config){
    this.names = {};
    this.list = [];
    this.config = config;
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
    get : function(){
        var me = this,
            config = me.config,
            list = me.list,
            converted = [],
            createVarDef = function(v){
                var other = v.slice(1),
                    result = [];

                if (other.length > 0) {
                    result.push(other);
                }

                result.push(v.join('='));

                return result.join(',');
            };

        for (var index = 0, length = list.length; index < length; index++) {
            var module = list[index],
                names = me.names[module.getFilepath()],
                filecontent = module.getFilecontent();

            var varDef = createVarDef(names),
                processed = grunt.template.process(config.wrapper.module, {
                    data: {
                        names : varDef,
                        code : filecontent
                    }
                }),
                parsed = uglifyjs.parse(processed),
                stream = uglifyjs.OutputStream({
                    beautify : true,
                    comments : true
                });

            analyzer.findRequire(parsed);

            parsed.print(stream);

            var code = stream.toString();

            converted.push(code);
        }

        return converted.join(config.separator);
    }
};

module.exports = Writer;