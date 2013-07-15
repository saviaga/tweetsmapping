/**
 * @author Iker Garitaonandia - @ikertxu
 * @web http://orloxx.github.io
 * @timestamp 28/06/13 22:04
 */

var path = require('path');

module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    // For mobile testing. Change to your private IP.
                    hostname: '10.10.10.175',
                    port: 8080,
                    base: '.'
                }
            }
        },
        less: {
            compile: {
                options: {
                    paths: '.',
                    yuicompress: true
                },
                files: {
                    'css/styles.css': 'css/styles.less'
                }
            }
        },
        express: {
            server: {
                options: {
                    server: path.resolve('js/socket')
                }
            }
        },
        watch: {
            less: {
                files: ['css/*.less'],
                tasks:['less']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-express');

    //Dev
    grunt.registerTask('default', ['connect','less:compile','express','watch']);
};