/*
 * grunt-klassmer
 * https://github.com/ayecue/grunt-klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

var Listener = require('./listener');

function Dependency(name,origpath,filepath){
	var me = this;

    me.name = name;
    me.origpath = origpath;
    me.filepath = filepath;

    me.self.listener.fire('create',me,arguments);
}

Dependency.listener = new Listener();

Dependency.prototype = {
	self : Dependency,
    getName : function(){
        return this.name;
    },
    getOrigpath : function(){
        return this.origpath;
    },
    getFilepath : function(){
        return this.filepath;
    }
};

module.exports = Dependency;