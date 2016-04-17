"use strict";

module.exports = function(grunt) {
  require("load-grunt-tasks")(grunt);

  var config = {
    pkg: grunt.file.readJSON("package.json"),

    clean: {
      build: ["build"]
    },

    copy: {
      build: {
        files: [{
          expand: true,
          cwd: "source",
          src: ["img/**", "*.html"],
          dest: "build"
        }]
      }
    },

    less: {
      style: {
        files: {
          "build/css/style.css": ["source/less/style.less"]
        }
      }
    },

    cmq: {
      style: {
        files: {
          "build/css/style.css": ["build/css/style.css"]
        }
      }
    },

    postcss: {
      options: {
        processors: [
          require("autoprefixer")({browsers: "last 2 versions"})
        ]
      },
      style: {
        src: "build/css/*.css"
      }
    },

    cssmin: {
      options: {
        keepSpecialComments: 0,
        report: "gzip"
      },
      style: {
        files: {
          "build/css/style.min.css": ["build/css/style.css"]
        }
      }
    },

    concat: {
      js: {
        files: {
          'build/js/script.js': ['source/js/lib/mustache.js', 'source/js/script.js']
        }
      }
    },

    uglify: {
      js: {
        files: {
          'build/js/script.min.js': ['build/js/script.js']
        }
      }
    },

    imagemin: {
      images: {
        options: {
          optimizationLevel: 3
        },
        files: [{
          expand: true,
          src: ["build/img/**/*.{png,jpg,gif,svg}"]
        }]
      }
    },

    watch: {
      style: {
        files: ["source/less/**/*.less"],
        tasks: ["less", "postcss", "cssmin"],
        options: {
          spawn: false,
          livereload: true
        }
      }
    }
  };
  
  grunt.initConfig(config);

  grunt.registerTask("build", [
    "clean",
    "copy",
    "less",
    "cmq",
    "postcss",
    "cssmin",
    "concat",
    "uglify",
    "imagemin"
  ]);
};
