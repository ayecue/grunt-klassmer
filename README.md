# grunt-klassmer v0.3.3
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

Since `~0.3.0` there's also an autoloader which also loads external modules. If you don't want to add certain modules you are able to exclude them with the new `excludes` property.

Since `~0.3.2` klassmer automaticly detects if you have choosen a javascript file as source or a package json.


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

Either use the source option or the package option.

#### options.src
Type: `String`
Path to main project javascript file or package json. (All other files will get loaded automaticly)

#### options.out
Type: `String`
Path to merged output file.

#### options.namespace (optional)
Type: `String`
Name of the output variable of your main module.

#### options.wrapper (optional)
Type: `Object`
Settings for wrapper strings.

#### options.wrapper.module (optional)
Type: `String`
Wrapper for every single module.

#### options.wrapper.start (optional)
Type: `String`
Start of wrapper for whole merged project.

#### options.wrapper.end (optional)
Type: `String`
End of wrapper for whole merged project.

#### options.wrap (optional)
Type: `Object`
Settings for wrapper files.

#### options.wrap.moduleFile (optional)
Type: `String`
Path to file which should wrap for every single module.

#### options.wrap.startFile (optional)
Type: `String`
Path to file which should start wrapping the whole merged project.

#### options.wrap.endFile (optional)
Type: `String`
Path to file which should end wrapping the whole merged project.

#### options.excludes (optional)
Type: `Array`
Ignore certain required modules.

#### options.optimizer (optional)
Type: `Object`
[Configuration variables](http://lisperator.net/uglifyjs/codegen)