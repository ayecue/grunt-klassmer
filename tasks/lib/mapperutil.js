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
    findCyclic : function(m){
        for (var x in m) {
            var c = m[x];

            for (var i = 0,l = c.length; i < l; i++) {
                if (c[i] in m && m[c[i]].indexOf(x) !== -1) {
                    return true;
                }
            }
        }

        return false;
    },
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

module.exports = MapperUtil;