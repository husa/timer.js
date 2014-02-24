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

    compress : {
        options : {
            mode : 'gzip',
            pretty: true
        },
        files : {
            src : 'timer.min.js',
            dest : 'timer.min.js.gz'
        }
    },

    watch : {
       scripts: {
        files: ['timer.js'],
        tasks: ['uglify', 'compress'],
        options: {
          nospawn: true,
        },
      }
    }

  });

  // Load the plugins
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compress');

  // Default task(s).
  grunt.registerTask('default', ['watch']);

};
