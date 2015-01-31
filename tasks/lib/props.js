/*
 * grunt-klassmer
 * https://github.com/ayecue/grunt-klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

function Props(value,key,prev){
	this.value = value;
	this.key = key;
	this.prev = prev;
}

Props.prototype = {
    self : Props,
    getValue : function(){
        return this.value;
    },
    getKey : function(){
        return this.key;
    },
    getPrev : function(){
        return this.prev;
    }
};

module.exports = Props;