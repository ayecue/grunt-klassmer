# grunt-klassmer v0.1.3

> Optimize CommonJS projects for your browser.


## Getting Started
This plugin requires Grunt `~0.4.0`

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


## Example:

Example project: [require-klass](https://github.com/ayecue/require-klass)

```js
grunt.initConfig({
    klassmer: {
        application: {
            options: {
                name: 'klass',
                src: '<%= pkg.directories.source %>klass.js',
                out: '<%= pkg.directories.build %>require-klass.js'
            }
        }
    }
});
```


## Info

Right now it's a pretty early version which I just tested with my own project.

Tests and more documentation will be added soon.