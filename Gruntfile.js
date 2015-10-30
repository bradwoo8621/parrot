module.exports = function(grunt) {
	// Project configuration.
	grunt
		.initConfig({
			pkg: grunt.file.readJSON('package.json'),
			targetPath: 'target',
			middlePath: 'intermediate',
			bowerPath: 'bower_components',
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
					banner: '/** <%= pkg.groupId %>.<%= pkg.artifactId %>.V<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
				},
				js: {
					src: ['<%= middlePath %>/js/browser-patch.js',
						'<%= middlePath %>/js/react-bootstrap.js',
						'<%= middlePath %>/js/parrot-jsface.js',
						'<%= middlePath %>/js/parrot-pre-define.js',
						'<%= middlePath %>/js/parrot-ajax.js',
						'<%= middlePath %>/js/parrot-codetable.js',
						'<%= middlePath %>/js/parrot-model.js',
						'<%= middlePath %>/js/parrot-component.js',
						'<%= middlePath %>/js/react-component/*.js'],
					dest: '<%= targetPath %>/parrot/js/<%= pkg.groupId %>.<%= pkg.artifactId %>.js'
				}
			},
			uglify: {
				parrot: {
					options: {
						banner: '/** <%= pkg.groupId %>.<%= pkg.artifactId %>.V<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n',
						sourceMap: true
					},
					files: {
						'<%= targetPath %>/parrot/js/<%= pkg.groupId %>.<%= pkg.artifactId %>.min.js': ['<%= concat.js.dest %>']
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
			// convert jsx to js
			react: {
				parrot: {
					files: [{
						expand: true,
						cwd: 'src/js/',
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
						cwd: 'src/fonts/',
						src: ['**'],
						dest: '<%= targetPath %>/fonts/'
					}]
				},
				// copy bower dependencies
				'bower-dependency': {
					files: [
						// bootstrap3
						{
							expand: true,
							cwd: '<%= bowerPath %>/bootstrap/dist/',
							src: ['**/*', '!**/npm.js'],
							dest: '<%= targetPath %>/bootstrap3/'
						},
						// bootstrap3 ie10 viewport bug workaround
						{
							expand: true,
							cwd: '<%= bowerPath %>/bootstrap3-ie10-viewport-bug-workaround/',
							src: ['ie10-viewport-bug-workaround.js'],
							dest: '<%= targetPath %>/bootstrap3/js/'
						},
						// bootstrap datetime picker
						{
							expand: true,
							cwd: '<%= bowerPath %>/eonasdan-bootstrap-datetimepicker/src/js/',
							src: ['bootstrap-datetimepicker.js'],
							dest: '<%= targetPath %>/bootstrap3/js/'
						},
						{
							expand: true,
							cwd: '<%= bowerPath %>/eonasdan-bootstrap-datetimepicker/build/',
							src: ['**/*'],
							dest: '<%= targetPath %>/bootstrap3/'
						},
						// bootstrap file-input
						{
							expand: true,
							cwd: '<%= bowerPath %>/bootstrap-fileinput/js/',
							src: ['fileinput.js', 'fileinput.min.js'],
							dest: '<%= targetPath %>/bootstrap3/js/'
						},
						{
							expand: true,
							cwd: '<%= bowerPath %>/bootstrap-fileinput/js/',
							src: ['fileinput_*.js'],
							dest: '<%= targetPath %>/bootstrap3/js/file-input/'
						},
						{
							expand: true,
							cwd: '<%= bowerPath %>/bootstrap-fileinput/css/',
							src: ['*.css'],
							dest: '<%= targetPath %>/bootstrap3/css/'
						},
						{
							expand: true,
							cwd: '<%= bowerPath %>/bootstrap-fileinput/img/',
							src: ['*.gif'],
							dest: '<%= targetPath %>/bootstrap3/img/'
						},
						// es5-shim
						{
							expand: true,
							cwd: '<%= bowerPath %>/es5-shim/',
							src: ['*.js', '*.map'],
							dest: '<%= targetPath %>/es5-shim/'
						},
						// html5shiv
						{
							expand: true,
							cwd: '<%= bowerPath %>/html5shiv/dist/',
							src: ['*.js'],
							dest: '<%= targetPath %>/html5shiv/'
						},
						// jquery
						{
							expand: true,
							cwd: '<%= bowerPath %>/jquery/dist/',
							src: ['*.js', '*.map'],
							dest: '<%= targetPath %>/jquery/'
						},
						// jquery brower
						{
							expand: true,
							cwd: '<%= bowerPath %>/jquery.browser/dist/',
							src: ['*.js'],
							dest: '<%= targetPath %>/jquery/'
						},
						// jquery mockjax
						{
							expand: true,
							cwd: '<%= bowerPath %>/jquery-mockjax/dist/',
							src: ['*.js'],
							dest: '<%= targetPath %>/jquery/'
						},
						// jquery deparam
						{
							expand: true,
							cwd: '<%= bowerPath %>/jquery-deparam/',
							src: ['jquery-deparam.js'],
							dest: '<%= targetPath %>/jquery/'
						},
						// jquery storage api
						{
							expand: true,
							cwd: '<%= bowerPath %>/jQuery-Storage-API/',
							src: ['*.js'],
							dest: '<%= targetPath %>/jquery/'
						},
						// jsface
						{
							expand: true,
							cwd: '<%= bowerPath %>/jsface/',
							src: ['*.js'],
							dest: '<%= targetPath %>/jsface/'
						},
						// moment
						{
							expand: true,
							cwd: '<%= bowerPath %>/moment/min/',
							src: ['moment-with-locales.js', 'moment-with-locales.min.js'],
							dest: '<%= targetPath %>/moment/'
						},
						// moment-taiwan
						{
							expand: true,
							cwd: '<%= bowerPath %>/moment-taiwan/target/',
							src: ['**'],
							dest: '<%= targetPath %>/moment/'
						},
						// react
						{
							expand: true,
							cwd: '<%= bowerPath %>/react/',
							src: ['JSXTransformer.js', 'react-with-addons.js', 'react-with-addons.min.js'],
							dest: '<%= targetPath %>/react/'
						},
						// react bootstrap
						{
							expand: true,
							cwd: '<%= bowerPath %>/react-bootstrap/',
							src: ['**/*.js', '**/*.map'],
							dest: '<%= targetPath %>/react-bootstrap/'
						},
						// respond
						{
							expand: true,
							cwd: '<%= bowerPath %>/Respond/dest/',
							src: ['respond.matchmedia.addListener.min.js', 'respond.min.js'],
							dest: '<%= targetPath %>/respond/'
						},
						{
							src: ['<%= bowerPath %>/Respond/dest/respond.matchmedia.addListener.src.js'],
							dest: '<%= targetPath %>/respond/respond.matchmedia.addListener.js'
						},
						{
							src: ['<%= bowerPath %>/Respond/dest/respond.src.js'],
							dest: '<%= targetPath %>/respond/respond.js'
						},
						// select2
						{
							expand: true,
							cwd: '<%= bowerPath %>/select2/dist/',
							src: ['**/*'],
							dest: '<%= targetPath %>/select2/'
						},
						// font awesome
						{
							expand: true,
							cwd: '<%= bowerPath %>/fontawesome/css/',
							src: ['**/*'],
							dest: '<%= targetPath %>/fontawesome/css/'
						},
						{
							expand: true,
							cwd: '<%= bowerPath %>/fontawesome/fonts/',
							src: ['**/*'],
							dest: '<%= targetPath %>/fontawesome/fonts/'
						},
						// js-cookie
						{
							expand: true,
							cwd: '<%= bowerPath %>/js-cookie/src/',
							src: ['*.js'],
							dest: '<%= targetPath %>/js-cookie/'
						}
					]
				},
				'parrot-min-css-pre': {
					files: [
						//{
						//    expand: true,
						//    cwd: 'src/css/',
						//    src: 'parrot.*.css',
						//    dest: '<%= middlePath %>/parrot/css/temp/',
						//    rename: function (dest, src) {
						//        return dest + src.replace('parrot.', 'parrot_');
						//    }
						//},
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
							newName: '<%= pkg.groupId %>.<%= pkg.artifactId %>',
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
							cwd: '<%= bowerPath %>/bootswatch/',
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
			}
		});

	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-react');
	grunt.loadNpmTasks('grunt-replace');

	// grunt.loadNpmTasks('grunt-webpack');

	// copy bower files to target
	grunt.registerTask('bower-copy', ['copy:bower-dependency']);
	grunt.registerTask('js-compile', ['react:parrot', 'jshint:parrot', 'concat:js', 'uglify:parrot']);
	grunt.registerTask('bootswatch', ['copy:bootswatch-pre', 'replace:bootswatch', 'cssmin:bootswatch', 'copy:bootswatch-post']);
	grunt.registerTask('css-parrot', ['less:parrot', 'copy:parrot-min-css-pre', 'cssmin:parrot', 'copy:parrot-min-css-post', 'copy:parrot-css']);
	grunt.registerTask('css-compile', ['bootswatch', 'css-parrot']);
	grunt.registerTask('deploy', ['clean:all', 'bower-copy', 'js-compile', 'css-compile', 'copy:fonts', 'clean:mid']);
	grunt.registerTask('default', ['clean:compile', 'js-compile', 'css-parrot', 'clean:mid']);
};
