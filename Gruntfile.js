module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    uglify: {
      build: {
        src: 'dist/timer.js',
        dest: 'dist/timer.min.js'
      }
    },

    compress : {
      build: {
        options : {
            mode : 'gzip',
            pretty: true
        },
        src : 'dist/timer.min.js',
        dest : 'dist/timer.min.js.gz'
      }
    },

    copy : {
      build : {
        src  : 'src/timer.js',
        dest : 'dist/timer.js'
      }
    },

    watch : {
       scripts: {
        files: ['src/timer.js'],
        tasks: ['copy', 'uglify', 'compress'],
        options: {
          nospawn: true,
        },
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-compress');
  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerTask('default', ['build', 'watch']);
  grunt.registerTask('build', ['copy', 'uglify', 'compress']);

};
