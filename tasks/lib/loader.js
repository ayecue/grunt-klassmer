/*
 * grunt-klassmer
 * https://github.com/ayecue/grunt-klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var grunt = require('grunt'),
	Parser = require('./parser'),
    Module = require('./module').Module,
    generator = require('./module').generator,
    map = require('./module').map,
    finder = require('./finder'),
    CONSTANTS = require('./constants');

function Loader(mainfile,parser,showMessages){
	var me = this;

    me.main = Module.create(mainfile,parser,null,parser.getNamespace());
    me.parser = parser;
    me.showMessages = showMessages;
}

Loader.prototype = {
	self : Loader,
    run : function(){
        var me = this,
            seperator = me.parser.optimizer.beautify ? me.parser.getSeperator() : '';

        me.main
            .parse()
            .find()
            .load();

        
        if (me.showMessages) {
            grunt.log.writeln("Merging " + map.size() + " files.");
        }

        map.set(map.sort());

        var code = [
            me.parser.process(me.parser.getStart(),{
                namespace : me.parser.getNamespace()
            }),
            map.each(function(module){
                this.result.push(module.compile());
            },[]).join(seperator),
            me.parser.process(me.parser.getEnd(),{
                namespace : me.parser.getNamespace()
            })
        ].join(seperator);

        generator.reset();
        map.clear();

        return code;
    }
};

module.exports = Loader;