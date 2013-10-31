var fs = require('fs');
var spawn = require('child_process').spawn;
module.exports = function(grunt) {
  grunt.initConfig({
    connect: {
      test: {
        options: {
          hostname: '0.0.0.0',
          port: 9999
        }
      },
      example: {
        options: {
          port: 3000
        }
      },
      example_https: {
        options: {
          base:  "example",
          port:  3000,
          protocol: 'https',
          hostname: '*',
          cert: fs.readFileSync(__dirname + '/test/https_test_certs/server.crt').toString(),
          key:  fs.readFileSync(__dirname + '/test/https_test_certs/server.key').toString(),
        }
      }
    },
    browserify: {
      dist: {
        files: {
          'build/auth0.js': ['standalone.js'],
        }
      }
    },
    uglify: {
      min: {
        files: {
          'build/auth0.min.js': ['build/auth0.js']
        }
      }
    },
    copy: {
      example: {
        files: {
          'example/auth0.js': 'build/auth0.js',
        }
      }
    },
    clean: {
      build: ["build/", "example/auth0.js"],
    },
    watch: {
      another: {
        files: ['node_modules', 'standalone.js', 'lib/*.js'],
        tasks: ['build']
      }
    },
    exec: {
      'test-phantom': {
        cmd: 'testem -f testem_dev.yml ci -l PhantomJS',
        stdout: true,
        stderr: true
      },
      'test-desktop': {
        cmd: 'testem ci -l bs_chrome,bs_firefox,bs_ie_8,bs_ie_9,bs_ie_10',
        stdout: true,
        stderr: true
      },
      'test-mobile': {
        cmd: 'testem ci -l bs_iphone_5,bs_android_41',
        stdout: true,
        stderr: true
      }
    }
  });


    // "test": "testem ci -l bs_chrome,bs_firefox,bs_ie_8,bs_ie_9,bs_ie_10 && testem ci -l bs_iphone_5,bs_android_41",
    // "test-phantom": "testem -f testem_dev.yml ci -l PhantomJS",
    // "example": "echo \"open http://localhost:3000\" && grunt example"


  // Loading dependencies
  for (var key in grunt.file.readJSON("package.json").devDependencies) {
    if (key !== "grunt" && key.indexOf("grunt") === 0) grunt.loadNpmTasks(key);
  }

  grunt.registerTask("build",   ["clean", "browserify:dist", "uglify:min", "copy:example"]);
  grunt.registerTask("example", ["connect:example", "watch"]);
  grunt.registerTask("example_https", ["connect:example_https", "watch"]);
  grunt.registerTask("dev",     ["connect:test", "watch"]);
  grunt.registerTask("test",    ["exec:test-phantom"]);
  grunt.registerTask("integration", ["exec:test-desktop", "exec:test-mobile"]);
};