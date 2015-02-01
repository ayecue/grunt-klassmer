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
    var me = this;

    me.moduleExport = false;
    me.objectExport = false;
}

Analyzer.from = function(values){
    if (grunt.util.kindOf(values) === "array") {
        return values;
    }
    return [values];
};
Analyzer.opts = {
    "Function" : function(object,last){
        var me = this,
            body = me.self.from(object.body);

        for (var index = body.length; index--;) {
            var props = new Props(body,index,last);

            me.findRequireEx(body[index],props);
        }
    },
    "Var" : function(object,last){
        var me = this,
            defs = me.self.from(object.definitions);

        for (var index = defs.length; index--;) {
            var def = defs[index],
                props = new Props(defs,index,last);

            me.findRequireEx(def,props);
        }

        if (defs.length === 0 && last) {
            var value = last.getValue(),
                key = last.getKey();

            value[key] = null;
            delete value[key];
        }
    },
    "VarDef" : function(object,last){
        var me = this,
            props;

        if (!object.value) {
            return;
        }

        if (object.value.TYPE === "Call") {
            props = new Props(object,"value",last);
            me.findRequireEx(object.value,props);
        } else if (object.value.TYPE === "Function") {
            props = new Props(object,"value",last);
            me.findRequireEx(object.value,props);
        } else if (object.value.TYPE === "Assign") {
            props = new Props(object,"value",last);
            me.findRequireEx(object.value,props);
        }
    },
    "Assign" : function(object,last){
        var props = new Props(object,"right",last);
            
        this.findRequireEx(object.right,props);
    }, 
    "Call" : function(object,last){
        if (object.start.value === "require") {
            var prev = last.getPrev(),
                value = prev.getValue(),
                key = prev.getKey();

            value.splice(key,1);
        } else {
            var props = new Props(object,"expression",last);
            this.findRequireEx(object.expression,props);
        }
    },
    "SimpleStatement" : function(object,last){
        var me = this,
            body = object.body,
            left = body.left;

        if (body.operator === "=" && left.property === "exports") {
            if (left.expression && left.expression.name === "module") {
                var value = last.getValue(),
                    key = last.getKey();

                value[key] = new uglifyjs.AST_Return({
                    value : object.body.right
                });

                me.moduleExport = true;
            }
        } else if (body.operator === "=" && left.expression && left.expression.name === "exports") {
            me.objectExport = true;
        } 

        var props = new Props(object,"body",last);
        me.findRequireEx(object.body,props);
    },
    "Toplevel" : function(object,last){
        var me = this,
            defs = object.body[0].definitions,
            index = defs.length - 1,
            props = new Props(defs,index,last);

        me.findRequireEx(defs[index],props);

        if (me.ifObjectExport() && !me.ifModuleExport()) {
            me.injectObjectExport(object);
        }
    },
    "Object" : function(object,last){
        var me = this,
            properties = me.self.from(object.properties);

        for (var index = properties.length; index--;) {
            var props = new Props(properties,index,last);

            me.findRequireEx(properties[index],props);
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
    ifModuleExport : function(){
        return this.moduleExport;
    },
    ifObjectExport : function(){
        return this.objectExport;
    },
    findRequire : function (object,last) {
        var me = this;

        me.moduleExport = false;
        me.objectExport = false;
        me.findRequireEx(object,last);
    },
    findRequireEx : function (object,last) {
        var me = this;

        if (object instanceof uglifyjs.AST_Node) {
            if (object.TYPE in me.self.opts) {
                me.self.opts[object.TYPE].apply(me,arguments);
            }
        }
    },
    injectObjectExport : function(object){
        if (object instanceof uglifyjs.AST_Toplevel) {
            var scope = object.body[0].definitions[0].value,
                arg = new uglifyjs.AST_Object({
                    properties : []
                }),
                argName = new uglifyjs.AST_SymbolFunarg({
                    name : "exports"
                }),
                symbolRef = new uglifyjs.AST_SymbolRef({
                    name : "exports"
                }),
                bodyReturn = new uglifyjs.AST_Return({
                    value : symbolRef
                });

            scope.args.push(arg);
            scope.expression.argnames.push(argName);
            scope.expression.body.push(bodyReturn);
        }
    }
};

module.exports = new Analyzer();