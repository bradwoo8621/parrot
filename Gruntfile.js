module.exports = function(grunt) {
	// Project configuration.
	grunt
		.initConfig({
			pkg: grunt.file.readJSON('package.json'),
			sourcePath: 'src',
			targetPath: 'target',
			middlePath: 'intermediate',
			bowerPath: 'bower_components',
			nodeModulePath: 'node_modules',
			babelVersion: '5.8.34',
			clean: {
				all: ['<%= targetPath %>/parrot/', '<%= middlePath %>'],
				mid: ['<%= middlePath %>'],
				compile: ['<%= targetPath %>/parrot/']
			},
			replace: {
				// remove the @import from bootswatch css
				bootswatch: {
					options: {
						patterns: [
							{
								match: /^@import url.*family=Roboto.*$/m,
								replacement: '@import url("../../fonts/css/fonts.roboto.css");'
							}, {
								match: /^@import url.*family=Source\+Sans\+Pro.*$/m,
								replacement: '@import url("../../fonts/css/fonts.sourcesanspro.css");'
							}, {
								match: /^@import url.*family=Lato.*$/m,
								replacement: '@import url("../../fonts/css/fonts.lato.css");'
							}, {
								match: /^@import url.*family=News\+Cycle.*$/m,
								replacement: '@import url("../../fonts/css/fonts.newscycle.css");'
							}, {
								match: /^@import url.*family=Raleway.*$/m,
								replacement: '@import url("../../fonts/css/fonts.raleway.css");'
							}, {
								match: /^@import url.*family=Open\+Sans.*$/m,
								replacement: '@import url("../../fonts/css/fonts.opensans.css");'
							}, {
								match: /^@import url.*family=Ubuntu.*$/m,
								replacement: '@import url("../../fonts/css/fonts.ubuntu.css");'
							}
						]
					},
					files: [
						{
							expand: true,
							cwd: '<%= middlePath %>/bootswatch/original/',
							src: ['*.css'],
							dest: '<%= middlePath %>/bootswatch/temp/',
							rename: function(dest, src) {
								return dest + src.replace('bootswatch.', 'bootswatch_');
							}
						}
					]
				},
				module: {
					options: {
						patterns: [
							{
								match: /\/\/ parrot body here/,
								replacement: '<%= grunt.file.read("target/parrot/js/nest-parrot.js") %>'
							}
						]
					},
					files: [
						{
							expand: true,
							cwd: 'src/module/',
							src: ['nest-parrot.js'],
							dest: '<%= targetPath %>/parrot/module/'
						}
					]
				},
				'parrot-css': {
	                options: {
	                    patterns: [
	                        {
	                            match: /("sources":\[")((.*\/)*)(.*css"\])/,
	                            replacement: '$1$4'
	                        }
	                    ]
	                },
	                files: [{
	                    expand: true,
	                    cwd: '<%= targetPath %>/parrot/css/',
	                    src: ['**/*.min.css.map'],
	                    dest: '<%= targetPath %>/parrot/css/'
	                }]
	            },
				'bootswatch-css': {
	                options: {
	                    patterns: [
	                        {
	                            match: /("sources":\[")((.*\/)*)(.*css"\])/,
	                            replacement: '$1$4'
	                        }
	                    ]
	                },
	                files: [{
	                    expand: true,
	                    cwd: '<%= middlePath %>/bootswatch/temp2/',
	                    src: ['**/*.min.css.map'],
	                    dest: '<%= middlePath %>/bootswatch/temp2/'
	                }]
	            }
			},
			cssmin: {
				options: {
					shorthandCompacting: false,
					roundingPrecision: -1,
					sourceMap: true,
					processImport: false
				},
				parrot: {
					files: [{
						expand: true,
						cwd: '<%= middlePath %>/parrot/css/temp/',
						src: ['parrot*.css'],
						dest: '<%= middlePath %>/parrot/css/temp2/',
						ext: '.min.css'
					}]
				},
				bootswatch: {
					files: [{
						expand: true,
						cwd: '<%= middlePath %>/bootswatch/temp/',
						src: ['*.css'],
						dest: '<%= middlePath %>/bootswatch/temp2/',
						ext: '.min.css'
					}]
				}
			},
			concat: {
				options: {
					separator: '\n',
					banner: '/** <%= pkg.name %>.V<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
				},
				parrot: {
					src: ['<%= middlePath %>/js/browser-patch.js',
						'<%= middlePath %>/js/parrot-pre-define.js',
						'<%= middlePath %>/js/parrot-ajax.js',
						'<%= middlePath %>/js/parrot-codetable.js',
						'<%= middlePath %>/js/parrot-model.js',
						'<%= middlePath %>/js/parrot-component.js',
						'<%= middlePath %>/js/react-component/*.js',
						'<%= middlePath %>/js/parrot-post-define.js'],
					dest: '<%= targetPath %>/parrot/js/<%= pkg.name %>.js'
				}
			},
			uglify: {
				parrot: {
					options: {
						banner: '/** <%= pkg.name %>.V<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
						sourceMap: true
					},
					files: {
						'<%= targetPath %>/parrot/js/<%= pkg.name %>.min.js': ['<%= concat.parrot.dest %>']
					}
				},
				module: {
					options: {
						sourceMap: true
					},
					files: {
						'<%= targetPath %>/parrot/module/<%= pkg.name %>.min.js': ['<%= targetPath %>/parrot/module/<%= pkg.name %>.js']
					}
				}
			},
			jshint: {
				options: {
					eqnull: true,
					"-W041": false, // disable the check "use === to compare with 0"
					scripturl: true, //disable the check "Script URL"
					// more options here if you want to override JSHint
					// defaults
					globals: {
						jQuery: true,
						console: true,
						module: true
					}
				},
				parrot: {
					files: {
						src: ['<%= middlePath %>/**/*.js']
					}
				}
			},
			babel: {
				parrot: {
					options: {
						"presets": ["react"],
						"plugins": ["transform-react-jsx"]
					},
					files: [{
						expand: true,
						cwd: '<%= sourcePath %>/js/',
						src: ['**/*.jsx'],
						dest: '<%= middlePath %>/js/',
						ext: '.js'
					}]
				}
			},
			copy: {
				// copy fonts
				fonts: {
					files: [{
						expand: true,
						cwd: '<%= sourcePath %>/fonts/',
						src: ['**'],
						dest: '<%= targetPath %>/fonts/'
					}]
				},
				bootstrap: {
					files: [{
						expand: true,
						cwd: '<%= nodeModulePath %>/bootstrap/dist/',
						src: ['**/*', '!**/npm.js'],
						dest: '<%= targetPath %>/bootstrap3/'
					}]
				},
				ie10_viewport: {
					files: [{
						expand: true,
						cwd: '<%= bowerPath %>/bootstrap3-ie10-viewport-bug-workaround/',
						src: ['ie10-viewport-bug-workaround.js'],
						dest: '<%= targetPath %>/bootstrap3/js/'
					}]
				},
				bootstrap_datetime_picker: {
					files: [{
						expand: true,
						cwd: '<%= nodeModulePath %>/eonasdan-bootstrap-datetimepicker/src/js/',
						src: ['bootstrap-datetimepicker.js'],
						dest: '<%= targetPath %>/bootstrap3/js/'
					}, {
						expand: true,
						cwd: '<%= nodeModulePath %>/eonasdan-bootstrap-datetimepicker/build/',
						src: ['**/*'],
						dest: '<%= targetPath %>/bootstrap3/'
					}]
				},
				bootstrap_fileinput: {
					files: [{
						expand: true,
						cwd: '<%= nodeModulePath %>/bootstrap-fileinput/js/',
						src: ['fileinput.js', 'fileinput.min.js'],
						dest: '<%= targetPath %>/bootstrap3/js/'
					}, {
						expand: true,
						cwd: '<%= nodeModulePath %>/bootstrap-fileinput/js/',
						src: ['fileinput_*.js'],
						dest: '<%= targetPath %>/bootstrap3/js/file-input/'
					}, {
						expand: true,
						cwd: '<%= nodeModulePath %>/bootstrap-fileinput/css/',
						src: ['*.css'],
						dest: '<%= targetPath %>/bootstrap3/css/'
					}, {
						expand: true,
						cwd: '<%= nodeModulePath %>/bootstrap-fileinput/img/',
						src: ['*.gif'],
						dest: '<%= targetPath %>/bootstrap3/img/'
					}]
				},
				font_awesome: {
					files: [{
						expand: true,
						cwd: '<%= nodeModulePath %>/font-awesome/css/',
						src: ['**/*'],
						dest: '<%= targetPath %>/fontawesome/css/'
					},
					{
						expand: true,
						cwd: '<%= nodeModulePath %>/font-awesome/fonts/',
						src: ['**/*'],
						dest: '<%= targetPath %>/fontawesome/fonts/'
					}]
				},
				es5_shim: {
					files: [{
						expand: true,
						cwd: '<%= nodeModulePath %>/es5-shim/',
						src: ['*.js', '*.map'],
						dest: '<%= targetPath %>/es5-shim/'
					}]
				},
				html5_shiv: {
					files: [{
						expand: true,
						cwd: '<%= nodeModulePath %>/html5shiv/dist/',
						src: ['*.js'],
						dest: '<%= targetPath %>/html5shiv/'
					}]
				},
				jquery: {
					files: [{
						expand: true,
						cwd: '<%= nodeModulePath %>/jquery/dist/',
						src: ['*.js', '*.map'],
						dest: '<%= targetPath %>/jquery/'
					}]
				},
				jquery_browser: {
					files: [{
						expand: true,
						cwd: '<%= nodeModulePath %>/jquery.browser/dist/',
						src: ['*.js'],
						dest: '<%= targetPath %>/jquery/'
					}]
				},
				jquery_deparam: {
					files: [{
						expand: true,
						cwd: '<%= nodeModulePath %>/jquery-deparam/',
						src: ['jquery-deparam.js'],
						dest: '<%= targetPath %>/jquery/'
					}]
				},
				jquery_mockjax: {
					files: [{
						expand: true,
						cwd: '<%= nodeModulePath %>/jquery-mockjax/dist/',
						src: ['*.js'],
						dest: '<%= targetPath %>/jquery/'
					}]
				},
				jquery_mousewheel: {
					files: [{
						expand: true,
						cwd: '<%= nodeModulePath %>/jquery-mousewheel',
						src: ['*.js', '*.map'],
						dest: '<%= targetPath %>/jquery/'
					}]
				},
				jquery_storage_api: {
					files: [{
						expand: true,
						cwd: '<%= nodeModulePath %>/jquery-storage-api/',
						src: ['*.js'],
						dest: '<%= targetPath %>/jquery/'
					}]
				},
				js_cookie: {
					files: [{
						expand: true,
						cwd: '<%= nodeModulePath %>/js-cookie/src/',
						src: ['*.js'],
						dest: '<%= targetPath %>/js-cookie/'
					}]
				},
				jsface: {
					files: [{
						expand: true,
						cwd: '<%= nodeModulePath %>/jsface/',
						src: ['j*.js'],
						dest: '<%= targetPath %>/jsface/'
					}]
				},
				moment: {
					files: [{
						expand: true,
						cwd: '<%= nodeModulePath %>/moment/min/',
						src: ['moment-with-locales.js', 'moment-with-locales.min.js'],
						dest: '<%= targetPath %>/moment/'
					}]
				},
				moment_taiwan: {
					files: [{
						expand: true,
						cwd: '<%= nodeModulePath %>/moment-taiwan/target/',
						src: ['**'],
						dest: '<%= targetPath %>/moment/'
					}]
				},
				react: {
					files: [{
						expand: true,
						cwd: '<%= nodeModulePath %>/react/dist/',
						src: ['react-with-addons.js', 'react-with-addons.min.js'],
						dest: '<%= targetPath %>/react/'
					}, {
						expand: true,
						cwd: '<%= nodeModulePath %>/react-dom/dist/',
						src: ['react-dom.js', 'react-dom.min.js'],
						dest: '<%= targetPath %>/react/'
					}, {
						expand: true,
						cwd: '<%= sourcePath %>/babel-browser-support/<%= babelVersion %>/',
						src: ['*.js'],
						dest: '<%= targetPath %>/react/',
						rename: function(dest, src) {
							return dest + src.replace('browser', 'babel-browser');
						}
					}]
				},
				respond_js: {
					files: [{
						expand: true,
						cwd: '<%= nodeModulePath %>/respond.js/dest/',
						src: ['respond.matchmedia.addListener.min.js', 'respond.min.js'],
						dest: '<%= targetPath %>/respond/'
					},
					{
						src: ['<%= nodeModulePath %>/respond.js/dest/respond.matchmedia.addListener.src.js'],
						dest: '<%= targetPath %>/respond/respond.matchmedia.addListener.js'
					},
					{
						src: ['<%= nodeModulePath %>/respond.js/dest/respond.src.js'],
						dest: '<%= targetPath %>/respond/respond.js'
					}]
				},
				select2: {
					files: [{
						expand: true,
						cwd: '<%= nodeModulePath %>/select2/dist/',
						src: ['**/*'],
						dest: '<%= targetPath %>/select2/'
					}]
				},
				'parrot-min-css-pre': {
					files: [
						{
							expand: true,
							cwd: 'src/css/',
							src: 'parrot.css',
							dest: '<%= middlePath %>/parrot/css/temp/'
						}
					]
				},
				// copy min and map files from temp2 to css
				// copy original css files to middle path
				'parrot-min-css-post': {
					files: [{
						expand: true,
						cwd: '<%= middlePath %>/parrot/css/temp2/',
						src: ['parrot*.css', 'parrot*.map'],
						dest: '<%= middlePath %>/parrot/css/',
						rename: function(dest, src) {
							return dest + src.replace('parrot_', 'parrot.');
						}
					}, {
						expand: true,
						cwd: 'src/css/',
						src: 'parrot*.css',
						dest: '<%= middlePath %>/parrot/css/'
					}]
				},
				// copy parrot css and rename
				'parrot-css': {
					files: [
						{
							expand: true,
							cwd: '<%= middlePath %>/parrot/css/',
							src: ['*.css', '*.map'],
							dest: '<%= targetPath %>/parrot/css/',
							newName: '<%= pkg.name %>',
							versionName: '<%= pkg.version %>',
							rename: function(dest, src, options) {
								return dest + src.replace('parrot', options.newName);
							}
						}
					]
				},
				// copy bootswatch css to middle path and rename
				'bootswatch-pre': {
					files: [
						{
							expand: true,
							cwd: '<%= nodeModulePath %>/bootswatch/',
							src: '**/bootstrap.css',
							dest: '<%= middlePath %>/bootswatch/original/',
							rename: function(dest, src) {
								var index = src.indexOf('/');
								return dest + "bootswatch." + src.substr(0, index) + ".css";
							}
						}
					]
				},
				'bootswatch-post': {
					files: [
						{
							expand: true,
							cwd: '<%= middlePath %>/bootswatch/temp2/',
							src: ['*.css', '*.map'],
							dest: '<%= targetPath %>/bootstrap3/css/',
							rename: function(dest, src) {
								return dest + src.replace('bootswatch_', 'bootswatch.');
							}
						}, {
							expand: true,
							cwd: '<%= middlePath %>/bootswatch/temp/',
							src: ['*.css'],
							dest: '<%= targetPath %>/bootstrap3/css/',
							rename: function(dest, src) {
								return dest + src.replace('bootswatch_', 'bootswatch.');
							}
						}
					]
				}
			},
			less: {
				parrot: {
					options: {
						paths: ["assets/css"]
					},
					files: {
						'src/css/parrot.css': 'src/less/parrot.less'
					}
				}
			},
			// Unit tests.
	        nodeunit: {
	            tests: ['unit-test/test.js']
	        },
	        jscpd: {
			    javascript: {
					path: 'target/parrot/module',
					exclude: ['*.min.js']
			    }
			}
		});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-nodeunit');
	grunt.loadNpmTasks('grunt-contrib-less');
	// grunt.loadNpmTasks('grunt-react');
	grunt.loadNpmTasks('grunt-replace');
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-jscpd');

	// copy bower files to target
	grunt.registerTask('dependency-copy',
		['copy:bootstrap', 'copy:ie10_viewport', 'copy:bootstrap_datetime_picker', 'copy:bootstrap_fileinput',
			'copy:font_awesome',
			'copy:es5_shim',
			'copy:html5_shiv',
			'copy:jquery', 'copy:jquery_browser', 'copy:jquery_deparam', 'copy:jquery_mockjax', 'copy:jquery_mousewheel', 'copy:jquery_storage_api',
			'copy:jsface',
			'copy:js_cookie',
			'copy:moment', 'copy:moment_taiwan',
			'copy:react',
			'copy:respond_js',
			'copy:select2'
		]);
	grunt.registerTask('parrot-browser-compile', [
		'babel:parrot',
		'jshint:parrot',
		'concat:parrot',
		'uglify:parrot'
	]);
	grunt.registerTask('bootswatch', [
		'copy:bootswatch-pre',
		'replace:bootswatch',
		'cssmin:bootswatch',
		'replace:bootswatch-css',
		'copy:bootswatch-post']);
	grunt.registerTask('css-parrot', [
		'less:parrot',
		'copy:parrot-min-css-pre',
		'cssmin:parrot',
		'copy:parrot-min-css-post',
		'copy:parrot-css',
		'replace:parrot-css'
	]);
	grunt.registerTask('css-compile', ['bootswatch', 'css-parrot']);
	grunt.registerTask('deploy', ['clean:all', 'dependency-copy', 'parrot-browser-compile', 'module', 'css-compile', 'copy:fonts', 'clean:mid']);
	grunt.registerTask('module', ['replace:module', 'uglify:module']);
	grunt.registerTask('default', ['clean:compile', 'parrot-browser-compile', 'module', 'css-parrot', 'clean:mid']);
	grunt.registerTask('test', ['nodeunit']);
};
