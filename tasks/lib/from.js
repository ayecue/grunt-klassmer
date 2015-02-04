/*
 * grunt-klassmer
 * https://github.com/ayecue/grunt-klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';
var grunt = require('grunt');

module.exports = function(values){
	if (grunt.util.kindOf(values) === "array") {
        return values;
    }
    return [values];
};