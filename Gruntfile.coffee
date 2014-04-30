module.exports = ->
  # Project configuration
  @initConfig
    pkg: @file.readJSON 'package.json'

    # Updating the package manifest files
    noflo_manifest:
      update:
        files:
          'component.json': ['graphs/*', 'components/*']
          'package.json': ['graphs/*', 'components/*']

    # CoffeeScript compilation
    coffee:
      spec:
        options:
          bare: true
        expand: true
        cwd: 'spec'
        src: ['**.coffee']
        dest: 'spec'
        ext: '.js'

    # Fix broken Component aliases, as mentioned in
    # https://github.com/anthonyshort/component-coffee/issues/3
    combine:
      browser:
        input: 'browser/strings.js'
        output: 'browser/strings.js'
        tokens: [
          token: '.coffee"'
          string: '.js"'
        ,
          token: ".coffee'"
          string: ".js'"
        ]

    # JavaScript minification for the browser
    uglify:
      options:
        report: 'min'
      noflo:
        files:
          './browser/strings.min.js': ['./browser/strings.js']

    # Automated recompilation and testing when developing
    watch:
      files: ['spec/*.coffee', 'components/*.coffee']
      tasks: ['test']

    # BDD tests on Node.js
    cafemocha:
      nodejs:
        src: ['spec/*.coffee']
        options:
          reporter: 'spec'

    # BDD tests on browser
    mocha_phantomjs:
      options:
        output: 'spec/result.xml'
        reporter: 'spec'
      all: ['spec/runner.html']

    # Coding standards
    coffeelint:
      components: ['components/*.coffee']

    # noflo-test
    exec:
      install:
        command: 'node ./node_modules/component/bin/component install'
      build:
        command: 'node ./node_modules/component/bin/component build -u component-json,component-fbp,component-coffee -o browser -n noflo-ui -c'
      test:
        command: './node_modules/.bin/noflo-test --spec test/*.coffee'

  # Grunt plugins used for building
  @loadNpmTasks 'grunt-noflo-manifest'
  @loadNpmTasks 'grunt-contrib-coffee'
  @loadNpmTasks 'grunt-combine'
  @loadNpmTasks 'grunt-exec'
  @loadNpmTasks 'grunt-contrib-uglify'

  # Grunt plugins used for testing
  @loadNpmTasks 'grunt-contrib-watch'
  @loadNpmTasks 'grunt-cafe-mocha'
  @loadNpmTasks 'grunt-mocha-phantomjs'
  @loadNpmTasks 'grunt-coffeelint'

  # Our local tasks
  @registerTask 'build', 'Build NoFlo for the chosen target platform', (target = 'all') =>
    @task.run 'coffee'
    @task.run 'noflo_manifest'
    if target is 'all' or target is 'browser'
      @task.run 'exec:install'
      @task.run 'exec:build'
      @task.run 'combine'
      @task.run 'uglify'

  @registerTask 'test', 'Build NoFlo and run automated tests', (target = 'all') =>
    @task.run 'coffeelint'
    @task.run 'noflo_manifest'
    @task.run 'coffee'
    @task.run 'exec:test'
    if target is 'all' or target is 'nodejs'
      @task.run 'cafemocha'
    if target is 'all' or target is 'browser'
      @task.run 'exec:install'
      @task.run 'exec:build'
      @task.run 'combine'
      @task.run 'mocha_phantomjs'

  @registerTask 'default', ['test']
