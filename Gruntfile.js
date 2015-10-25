module.exports = function (grunt) {
    // Project configuration.
    grunt
        .initConfig({
            pkg: grunt.file.readJSON('package.json'),
            clean: {
                all: ['target', 'intermediate'],
                mid: ['intermediate']
            },
            csscomb: {
                dist: {
                    files: {
                        'target/css/<%= pkg.groupId %>.<%= pkg.artifactId %>-<%= pkg.version %>.css': ['src/css/parrat.css']
                    }
                }
            },
            cssmin: {
                options: {
                    shorthandCompacting: false,
                    roundingPrecision: -1,
                    sourceMap: true
                },
                target: {
                    files: {
                        'target/css/<%= pkg.groupId %>.<%= pkg.artifactId %>-<%= pkg.version %>.min.css': ['target/css/<%= pkg.groupId %>.<%= pkg.artifactId %>-<%= pkg.version %>.css']
                    }
                }
            },
            concat: {
                options: {
                    separator: '\n'
                },
                dist: {
                    src: ['src/js/parrot.js', 'intermediate/js/react-component/*.js'],
                    dest: 'target/js/<%= pkg.groupId %>.<%= pkg.artifactId %>-<%= pkg.version %>.js'
                }
            },
            uglify: {
                options: {
                    banner: '/*! <%= pkg.groupId %>.<%= pkg.artifactId %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                    sourceMap: true
                },
                dist: {
                    files: {
                        'target/js/<%= pkg.groupId %>.<%= pkg.artifactId %>-<%= pkg.version %>.min.js': ['<%= concat.dist.dest %>']
                    }
                }
            },
            jshint: {
                // define the files to lint
                files: ['gruntfile.js', 'src/js/parrot.js', 'intermediate/react-component/*.js'],
                // configure JSHint (documented at
                // http://www.jshint.com/docs/)
                options: {
                    // more options here if you want to override JSHint
                    // defaults
                    globals: {
                        jQuery: true,
                        console: true,
                        module: true
                    }
                }
            },
            react: {
                dynamic_mappings: {
                    files: [{
                        expand: true,
                        cwd: 'src/js/react-component',
                        src: ['*.jsx'],
                        dest: 'intermediate/js/react-component',
                        ext: '.js'
                    }]
                }
            }
        });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-csscomb');
    grunt.loadNpmTasks('grunt-react');

    grunt.registerTask('package', ['jshint', 'concat', 'uglify']);
    grunt.registerTask('default', ['clean:all', 'csscomb', 'cssmin', 'react', 'jshint', 'concat', 'uglify', 'clean:mid']);
};