module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      build: {
        src: 'timer.js',
        dest: 'timer.min.js'
      }
    },

    copy : {
      main : {
        src : 'timer.js',
        dest : 'node/node_modules/timer/'
      }
    },

    watch : {
       scripts: {
        files: ['timer.js'],
        tasks: ['uglify', 'copy'],
        options: {
          nospawn: true,
        },
      }
    }

  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
  grunt.registerTask('default', ['watch']);

};