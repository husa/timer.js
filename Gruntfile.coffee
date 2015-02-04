module.exports = ->
  @initConfig

    pkg: @file.readJSON 'package.json'

    uglify:
      build:
        src: 'dist/timer.js'
        dest: 'dist/timer.min.js'

    compress:
      build:
        options:
          mode : 'gzip'
          pretty: true
        src : 'dist/timer.min.js'
        dest : 'dist/timer.min.js.gz'

    copy:
      build:
        src: 'src/timer.js'
        dest: 'dist/timer.js'

    jasmine:
      options:
          specs: 'test/specs/*.js'
      source:
        src: 'src/timer.js'
      build:
        src: 'dist/timer.min.js'

    watch:
      scripts:
        files: ['src/timer.js', 'test/**/*.js']
        tasks: ['jasmine:source']

  @loadNpmTasks 'grunt-contrib-uglify'
  @loadNpmTasks 'grunt-contrib-watch'
  @loadNpmTasks 'grunt-contrib-compress'
  @loadNpmTasks 'grunt-contrib-copy'
  @loadNpmTasks 'grunt-contrib-jasmine'

  @registerTask 'default', [
    'build'
    'watch'
  ]

  @registerTask 'test', [
    'build'
    'jasmine:build'
  ]

  @registerTask 'build', [
    'jasmine:source'
    'copy'
    'uglify'
    'compress'
  ]
