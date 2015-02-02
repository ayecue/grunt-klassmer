# grunt-klassmer v0.1.8 
[![Build Status](https://travis-ci.org/ayecue/grunt-klassmer.png?branch=master)](https://travis-ci.org/ayecue/grunt-klassmer)

> Optimize CommonJS projects for your browser.


## Getting Started
This plugin requires Grunt `~0.4.5` and UglifyJS `~2.4.16`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-klassmer --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-klassmer');
```

## Description

This package will merge your CommonJS project to one file to use it in frontend without any overhead.

This project is mainly tested and optimized for this project [require-klass](https://github.com/ayecue/require-klass). I will try to improve it for other structures. 


## Example:

Example project: [require-klass](https://github.com/ayecue/require-klass)

```js
grunt.initConfig({
    klassmer: {
        application: {
            options: {
                namespace: 'klass',
                src: '<%= pkg.directories.source %>klass.js',
                out: '<%= pkg.directories.build %>require-klass.js'
            }
        }
    }
});
```


## Options

#### options.namespace
Type: `String`
Name of the output variable of your main module.

#### options.wrapper
Type: `Object`
Settings for wrapper strings.

#### options.wrapper.module
Type: `String`
Wrapper for every single module.

#### options.wrapper.start
Type: `String`
Start of wrapper for whole merged project.

#### options.wrap
Type: `Object`
Settings for wrapper files.

#### options.wrap.moduleFile
Type: `String`
Path to file which should wrap for every single module.

#### options.wrap.startFile
Type: `String`
Path to file which should start wrapping the whole merged project.

#### options.wrap.endFile
Type: `String`
Path to file which should end wrapping the whole merged project.

#### options.src
Type: `String`
Path to main project file. (All other files will get loaded automaticly)

#### options.out
Type: `String`
Path to merged output file.

#### options.optimizer
Type: `Object`
[Configuration variables](http://lisperator.net/uglifyjs/codegen)
