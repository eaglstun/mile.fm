"use strict";

module.exports = function( grunt ) {
    grunt.initConfig( {
        browserify: {
            dist: {
                files: [ {
                    cwd: 'assets/js',
                    dest: 'public_html/assets/js',
                    expand: true,
                    ext: '.js',
                    src: [ 'app.js' ]
                } ],
                options: {
                    browserifyOptions: {
                        debug: true,
                        paths: []
                    },
                    transform: [
                        [
                            "babelify", {
                                presets: [
                                    "es2015"
                                ]
                            }
                        ]
                    ]
                }
            }
        },

        cssmin: {
            target: {
                files: [ {
                    expand: true,
                    cwd: 'public/css',
                    src: [ '**/*.css', '!*.min.css' ],
                    dest: 'public/css',
                    ext: '.min.css'
                } ]
            }
        },

        sass: {
            options: {
                includePaths: [

                ]
            },
            dist: {
                options: {
                    outputStyle: 'compact'
                },
                files: [ {
                    cwd: 'assets/scss',
                    dest: 'public_html/assets/css',
                    expand: true,
                    ext: '.css',
                    src: [ 'app.scss' ]
                } ],
            }
        },

        uglify: {
            scripts: {
                files: [ {
                    cwd: 'public/js',
                    dest: 'public/js',
                    expand: true,
                    ext: '.min.js',
                    src: [ '**/*.js', '!*.min.js' ]
                } ]
            }
        },

        watch: {
            css: {
                files: [ 'assets/scss/**/*.scss' ],
                tasks: [ 'sass' ]
            },
            scripts: {
                files: [ 'assets/js/**/*.js' ],
                tasks: [ 'browserify' ]
            },
        }
    } );

    grunt.loadNpmTasks( 'grunt-browserify' );
    grunt.loadNpmTasks( 'grunt-contrib-cssmin' );
    grunt.loadNpmTasks( 'grunt-contrib-uglify' );
    grunt.loadNpmTasks( 'grunt-contrib-watch' );
    grunt.loadNpmTasks( 'grunt-sass' );

    grunt.registerTask( 'default', [
        'browserify', 'sass'
    ] );
};