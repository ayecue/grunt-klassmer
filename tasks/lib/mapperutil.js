/*
 * grunt-klassmer
 * https://github.com/ayecue/grunt-klassmer
 *
 * Copyright (c) 2015 "AyeCue" Sören Wehmeier, contributors
 * Licensed under the MIT license.
 */
'use strict';

function MapperUtil(){

}

MapperUtil.prototype = {
    isDepRequiredSomewhere : function(filepath,m){
        for (var key in m) {
            if (m[key].indexOf(filepath) !== -1) {
                return key;
            }
        }

        return false;
    },
    sortMap : function(m){
        var nm = {},
            result = [];

        for (var filepath in m) {
            var isRequired = this.isDepRequiredSomewhere(filepath,m);

            if (isRequired === false) {
                result.unshift(filepath);
            } else {
                nm[filepath] = m[filepath];
            }
        }

        if (Object.keys(nm).length > 0) {
            result = this.sortMap(nm).concat(result);
        }

        return result;
    }
};

module.exports = new MapperUtil();