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

    watch : {
       scripts: {
        files: ['timer.js'],
        tasks: ['uglify'],
        options: {
          nospawn: true,
        },
      }
    }

  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['watch']);

};