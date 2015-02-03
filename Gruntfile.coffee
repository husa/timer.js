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

    watch:
       scripts:
        files: ['src/timer.js']
        tasks: ['copy', 'uglify', 'compress'],
        options:
          nospawn: true

  @loadNpmTasks 'grunt-contrib-uglify'
  @loadNpmTasks 'grunt-contrib-watch'
  @loadNpmTasks 'grunt-contrib-compress'
  @loadNpmTasks 'grunt-contrib-copy'

  @registerTask 'default', [
    'build'
    'watch'
  ]

  @registerTask 'build', [
    'copy'
    'uglify'
    'compress'
  ]
