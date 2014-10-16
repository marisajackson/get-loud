'use strict';

module.exports = function(grunt){
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    // ---------------------------------------------------------------------- //
    watch: {
      code: {
        files: ['Gruntfile.js', 'app/**/*'],
        tasks: ['build']
      }
    },
    // ---------------------------------------------------------------------- //
    jshint: {
      options: {jshintrc: '.jshintrc', reporter: require('jshint-stylish')},
      all: ['Gruntfile.js', 'app/**/*.js']
    },
    // ---------------------------------------------------------------------- //
    jscs: {
      src: '<%= jshint.all %>',
      options: {
        config: '.jscsrc',
        reporter: 'console'
      }
    },
    // ---------------------------------------------------------------------- //
    jade: {
      build: {
        files: [{
          cwd: 'app',
          src: '**/*.jade',
          dest: 'public',
          ext: '.html',
          expand: true
        }]
      }
    },
    // ---------------------------------------------------------------------- //
    sass: {
      build: {
        files: [{
          cwd: 'app',
          src: '**/*.scss',
          dest: 'public',
          ext: '.css',
          expand: true
        }]
      }
    },
    // ---------------------------------------------------------------------- //
    clean: {
      server: 'public'
    },
    // ---------------------------------------------------------------------- //
    shell: {
      bower: {
        command: 'bower install'
      }
    },
    // ---------------------------------------------------------------------- //
    copy: {
      js: {
        cwd: 'app',
        src: ['**/*.js'],
        dest: 'public',
        expand: true
      },
      assets: {
        cwd: 'app/assets',
        src: ['**/*'],
        dest: 'public/assets',
        expand: true
      },
      favicon: {
        cwd: 'app',
        src: ['favicon.ico'],
        dest: 'public',
        expand: true
      }
    }
    // ---------------------------------------------------------------------- //
  });

  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-notify');

  grunt.registerTask('deploy', ['clean', 'build', 'shell:bower']);
  grunt.registerTask('build', ['jshint:all', 'jscs', 'jade', 'sass', 'copy:js', 'copy:assets', 'copy:favicon']);
  grunt.registerTask('default', ['build', 'watch']);
};
