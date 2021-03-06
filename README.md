# grunt-klassmer v0.4.3
[![Build Status](https://travis-ci.org/ayecue/grunt-klassmer.png?branch=master)](https://travis-ci.org/ayecue/grunt-klassmer)

> Optimize CommonJS/AMD projects for your browser and visualize dependencies.

[klassmer v0.4.8](https://github.com/ayecue/klassmer)

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

This package will merge your CommonJS project to one file to use it in frontend without any overhead. Also you can generate HTML files which show all dependencies of your project. Another feature is that you got the possibility to use the intern 'Klass' system in your project.


## Changelog

Since `~0.3.0` there's also an autoloader which also loads external modules. If you don't want to add certain modules you are able to exclude them with the new `excludes` property.

Since `~0.3.2` klassmer automaticly detects if you have choosen a javascript file as source or a package json.

Since `~0.3.5` optimized certain finder options and loading (so it's faster). I also tried klassmer on react-bootstrap which seems to be working.

Since `~0.3.6` optimized processor for call types.

Since `~0.3.7` removed some unnecessary deps.

Since `~0.3.8` improved logic of package mapping. Merging is abit slower now since cyclic checking is more complex. In the next release I'll try to improved speed again.

Since `~0.3.9` you can select which compiler you want to use (right now there's just one for CommonJS). Also the speed of the cyclic check is now faster.

Since `~0.4.0` refactored the whole library in preperation to new possible code patterns. Added functionality to create a html file which shows all dependencies.

Since `~0.4.2` containing all fixes of the newest klassmer version.


## klassmer

### Example:

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


### Options

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


## klassmer_info

### Example:

```js
grunt.initConfig({
    klassmer_info: {
        application: {
            options: {
                src: '<%= pkg.directories.source %>klass.js',
                out: '<%= pkg.directories.build %>visual.html'
            }
        }
    }
});
```


### Options

Either use the source option or the package option.

#### options.src
Type: `String`
Path to main project javascript file or package json. (All other files will get loaded automaticly)

#### options.out
Type: `String`
Path to merged output file.

#### options.excludes (optional)
Type: `Array`
Ignore certain required modules.