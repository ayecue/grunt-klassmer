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
    Props = require('./props');

function Analyzer(){
}

Analyzer.from = function(values){
    if (grunt.util.kindOf(values) === "array") {
        return values;
    }
    return [values];
};
Analyzer.opts = {
    "Function" : function(object,last){
        var body = this.self.from(object.body);

        for (var index = body.length; index--;) {
            var props = new Props(body,index,last);

            this.findRequire(body[index],props);
        }
    },
    "Var" : function(object,last){
        var defs = this.self.from(object.definitions);

        for (var index = defs.length; index--;) {
            var def = defs[index],
                props = new Props(defs,index,last);

            this.findRequire(def,props);
        }

        if (defs.length === 0 && last) {
            var value = last.getValue(),
                key = last.getKey();

            value[key] = null;
            delete value[key];
        }
    },
    "VarDef" : function(object,last){
        var props;

        if (!object.value) {
            return;
        }

        if (object.value.TYPE === "Call") {
            props = new Props(object,"value",last);
            this.findRequire(object.value,props);
        } else if (object.value.TYPE === "Function") {
            props = new Props(object,"value",last);
            this.findRequire(object.value,props);
        } else if (object.value.TYPE === "Assign") {
            props = new Props(object,"value",last);
            this.findRequire(object.value,props);
        }
    },
    "Assign" : function(object,last){
        var props = new Props(object,"right",last);
            
        this.findRequire(object.right,props);
    }, 
    "Call" : function(object,last){
        if (object.start.value === "require") {
            var prev = last.getPrev(),
                value = prev.getValue(),
                key = prev.getKey();

            value.splice(key,1);
        } else {
            var props = new Props(object,"expression",last);
            this.findRequire(object.expression,props);
        }
    },
    "SimpleStatement" : function(object,last){
        if (object.body.operator === "=" && object.body.left.property === "exports") {
            if (object.body.left.expression.name === "module") {
                var value = last.getValue(),
                    key = last.getKey();

                value[key] = new uglifyjs.AST_Return({
                    value : object.body.right
                });
            }
        }

        var props = new Props(object,"body",last);
        this.findRequire(object.body,props);
    },
    "Toplevel" : function(object,last){
        var defs = object.body[0].definitions,
            index = defs.length - 1,
            props = new Props(defs,index,last);

        this.findRequire(defs[index],props);
    },
    "Object" : function(object,last){
        var properties = this.self.from(object.properties);

        for (var index = properties.length; index--;) {
            var props = new Props(properties,index,last);

            this.findRequire(properties[index],props);
        }
    },
    "ObjectKeyVal" : function(object,last){
        if (!object.value) {
            return;
        }

        if (object.value.TYPE === "Call" && object.value.start.value === "require") {
            object.value = new uglifyjs.AST_SymbolRef({
                name : object.key
            });
        }
    }
};

Analyzer.prototype = {
    self : Analyzer,
    findRequire : function (object,last) {
        if (object instanceof uglifyjs.AST_Node) {
            if (object.TYPE in this.self.opts) {
                this.self.opts[object.TYPE].apply(this,arguments);
            }
        }
    }
};

module.exports = new Analyzer();