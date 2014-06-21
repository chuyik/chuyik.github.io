module.exports = function(grunt) {
    'use strict';

    grunt.initConfig({

        //Read the bower.json ( or package.json )
        pkg: grunt.file.readJSON('bower.json'),

        meta: {
            banner: '/*\n' + ' * <%= pkg.name %> - v<%= pkg.version %> - ' +
                '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                ' * Copyright (c) <%= grunt.template.today("yyyy") %>\n' +
                ' */'
        },

        // Task configuration
        // clean: {
            // js: ["assets/js/*.min.js"]
        // },
        compass: {
            dev: {
                options: {
                    quiet: true
                }
            },
            dist: {
                options: {
                    banner: '<%= meta.banner %>',
                    outputStyle: 'compressed',
                    specify: 'assets/sass/*.scss'
                }
            },
            options: {
                sassDir: 'assets/sass',
                cssDir: 'assets/css',
                trace: true
            }
        },
        // Use compass instead.
        // sass: {
        //     dist: {
        //         files: {
        //             'assets/css/app.css': 'assets/sass/app.scss'
        //         },
        //         options: {
        //             style: 'compressed',
        //             quiet: true,
        //             sourcemap: true,
        //             trace: true
        //         }
        //     }
        // },
        uglify: {
            dist: {
                // avoid uglify *.min.js, and rename the uglified js to *.min.js
                files: grunt.file.expandMapping(['assets/js/*.js', '!assets/js/*.min.js'], '', {
                    rename: function(destBase, destPath) {
                        return destBase+destPath.replace('.js', '.min.js');
                    }
                })
            },
            options: {
                banner: '<%= meta.banner %>',
                sourceMap: true
            }
        },
        jshint: {
            files: [
                'assets/js/*.js', '!assets/js/*.min.js'
            ]
        },
        watch: {
            css: {
                files: ['assets/sass/*.scss'],
                tasks: ['compass:dev', 'copy']
            },
            js: {
                files: ['assets/js/*.js', '!assets/js/*.min.js'],
                tasks: ['uglify', 'copy']
            },
            images: {
                files: ['assets/images/*'],
                tasks: ['compass:dev', 'copy']
            },
            options: {
                livereload: true
            }
            // Use guard-jekyll-plus instead.
            // html: {
            //     files: ['**/*.html', '_posts/*.markdown'],
            //     tasks: ['jekyll:dist']
            // }
        },
        jekyll: {
            serve: {
                options: {
                    serve: true,
                    auto: true
                }
            },
            // Use guard-jekyll-plus instead.
            // dist: {
            //     options: {
            //         config: '_config.yml'
            //     }
            // },
            options:{
                bundleExec: true,
                src : '.',
                dest: './_site'
            }
        },
        copy: {
            // copy assets(js/css/images) files to _site directory
            assets: {
                // includes files within path and its sub-directories
                files: [
                    { src: ['assets/css/**'], dest: '_site/' },
                    { src: ['assets/js/**'], dest: '_site/' },
                    { src: ['assets/images/**'], dest: '_site/' }
                ]
            }
        },
        // The jekyll:serve will block the thread, 
        // so concurrent is needed to run jekyll and watch together.
        concurrent: {
            target1: {
                tasks: ['jekyll:serve', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-jekyll');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-concurrent');
    // grunt.loadNpmTasks('grunt-contrib-clean');
    // grunt.loadNpmTasks('grunt-contrib-sass');

    // Default task, used for development.
    grunt.registerTask('default', ['concurrent:target1']);

    // Check the syntax and minify files, used for deployment.
    grunt.registerTask('compile', ['jshint', 'uglify', 'compass:dist']);

};
