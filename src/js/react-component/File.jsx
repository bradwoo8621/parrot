(function (window, $, React, ReactDOM, $pt) {
	var NFile = React.createClass($pt.defineCellComponent({
		displayName: 'NFile',
		statics: {
			// PROPERTY_LIST: {
			// 	ajaxDeleteSettings: null,
			// 	ajaxSettings: null,
			// 	allowedFileExtensions: null,
			// 	allowedFileTypes: null,
			// 	allowedPreviewMimeTypes: null,
			// 	allowedPreviewTypes: null,
			// 	autoReplace: null,
			// 	browseClass: null,
			// 	browseIcon: null,
			// 	browseLabel: null,
			// 	browseOnZoneClick: null,
			// 	buttonLabelClass: null,
			// 	captionClass: null,
			// 	customLayoutTags: null,
			// 	customPreviewTags: null,
			// 	defaultPreviewContent: null,
			// 	deleteExtraData: null,
			// 	deleteUrl: null,
			// 	dropZoneClickTitle: null,
			// 	dropZoneEnabled: null,
			// 	dropZoneTitle: null,
			// 	dropZoneTitleClass: null,
			// 	fileActionSettings: null,
			// 	fileSizeGetter: null,
			// 	fileTypeSettings: null,
			// 	initialCaption: null,
			// 	initialPreview: null,
			// 	initialPreviewAsData: null,
			// 	initialPreviewConfig: null,
			// 	initialPreviewCount: null,
			// 	initialPreviewDelimiter: null,
			// 	initialPreviewFileType: null,
			// 	initialPreviewShowDelete: null,
			// 	initialPreviewThumbTags: null,
			// 	language: null,
			// 	layoutTemplates: null,
			// 	mainClass: null,
			// 	maxFileCount: null,
			// 	maxFileSize: null,
			// 	maxImageHeight: null,
			// 	maxImageWidth: null,
			// 	maxPreviewFileSize: null,
			// 	minFileCount: null,
			// 	minImageHeight: null,
			// 	minImageWidth: null,
			// 	msgCancelled: null,
			// 	msgErrorClass: null,
			// 	msgFileNotFound: null,
			// 	msgFileNotReadable: null,
			// 	msgFilePreviewAborted: null,
			// 	msgFilePreviewError: null,
			// 	msgFileSecured: null,
			// 	msgFilesTooLess: null,
			// 	msgFilesTooMany: null,
			// 	msgFoldersNotAllowed: null,
			// 	msgImageHeightLarge: null,
			// 	msgImageHeightSmall: null,
			// 	msgImageWidthLarge: null,
			// 	msgImageWidthSmall: null,
			// 	msgInvalidFileExtension: null,
			// 	msgInvalidFileType: null,
			// 	msgLoading: null,
			// 	msgNo: null,
			// 	msgProgress: null,
			// 	msgSelected: null,
			// 	msgSizeTooLarge: null,
			// 	msgUploadAborted: null,
			// 	msgValidationError: null,
			// 	msgValidationErrorClass: null,
			// 	msgValidationErrorIcon: null,
			// 	msgZoomModalHeading: null,
			// 	msgZoomTitle: null,
			// 	otherActionButtons: null,
			// 	overwriteInitial: null,
			// 	previewClass: null,
			// 	previewFileExtSettings: null,
			// 	previewFileIcon: null,
			// 	previewFileIconClass: null,
			// 	previewFileIconSettings: null,
			// 	previewFileType: null,
			// 	previewSettings: null,
			// 	previewTemplates: null,
			// 	previewThumbTags: null,
			// 	previewZoomButtonClasses: null,
			// 	previewZoomButtonIcons: null,
			// 	previewZoomButtonTitles: null,
			// 	previewZoomSettings: null,
			// 	progressClass: null,
			// 	progressCompleteClass: null,
			// 	progressErrorClass: null,
			// 	purifyHtml: null,
			// 	removeClass: null,
			// 	resizeDefaultImageType: null,
			// 	removeIcon: null,
			// 	removeLabel: null,
			// 	removeFromPreviewOnError: null,
			// 	removeTitle: null,
			// 	resizeImage: null,
			// 	resizeImageQuality: null,
			// 	resizePreference: null,
			// 	showBrowse: null,
			// 	showAjaxErrorDetails: null,
			// 	showCaption: null,
			// 	showCancel: null,
			// 	showClose: null,
			// 	showPreview: null,
			// 	showRemove: null,
			// 	showUpload: null,
			// 	showUploadedThumbs: null,
			// 	slugCallback: null,
			// 	textEncoding: null,
			// 	theme: null,
			// 	uploadAsync: null,
			// 	uploadClass: null,
			// 	uploadExtraData: null,
			// 	uploadIcon: null,
			// 	uploadLabel: null,
			// 	uploadTitle: null,
			// 	uploadUrl: null,
			// 	validateInitialCount: null,
			// 	zoomIndicator: null
			// },
			DEFAULT_PROPERTY_VALUES: {
				browseLabel: '',
				browseIcon: '<i class="fa fa-fw fa-folder-open-o"></i>',
				browseClass: 'btn btn-link',
				uploadLabel: '',
				uploadIcon: '<i class="fa fa-fw fa-upload"></i>',
				uploadClass: 'btn btn-link',
				removeLabel: '',
				removeIcon: '<i class="fa fa-fw fa-trash-o"></i>',
				removeClass: 'btn btn-link',
				showClose: false,
				showPreview: true
			},
			MOBILE_SETTINGS: {
				previewSettings: {
	                image: {width: "80px", height: "80px"},
	                html: {width: "80px", height: "80px"},
	                text: {width: "80px", height: "80px"},
	                video: {width: "80px", height: "80px"},
	                audio: {width: "80px", height: "80px"},
	                flash: {width: "80px", height: "80px"},
	                object: {width: "80px", height: "80px"},
	                other: {width: "80px", height: "80px"}
	            },
	            browseIcon: '<i class="fa fa-fw fa-plus-square"></i>',
	            showCaption: true,
	            layoutTemplates: {
	            	caption: '<span />',
		            progress: '<span />'
		        },
		        showCancel: false,
	            dropZoneEnabled: false
            }
		},
		getDefaultProps: function () {
			return {
				defaultOptions: {
					mobileEnabled: true,
					multiple: true,
					inputName: 'fileData'
				}
			};
		},
		getInitialState: function () {
			return {
				monitors: {}
			};
		},
		beforeDidMount: function () {
			var input = $(ReactDOM.findDOMNode(this.refs.file));
			input.fileinput(this.createDisplayOptions());
			// event monitor
			var _this = this;
			var monitors = this.getEventMonitor();
			Object.keys(monitors).forEach(function (eventKey) {
				_this.state.monitors[eventKey] = function() {
					var args = Array.prototype.slice.call(arguments);
					// attach this component to event object
					args[0].reactComponent = _this;
					monitors[eventKey].apply(this, args);
				};
				input.on(eventKey, _this.state.monitors[eventKey]);
			});

			var comp = $(ReactDOM.findDOMNode(this.refs.comp));
			comp.find('.kv-fileinput-caption')
				.focus(this.onComponentFocused)
				.blur(this.onComponentBlurred);
			comp.find('.input-group-btn>.btn')
				.focus(this.onComponentFocused)
				.blur(this.onComponentBlurred);
		},
		beforeWillUnmount: function () {
			var input = $(ReactDOM.findDOMNode(this.refs.file));
			// event monitor
			var monitors = this.getEventMonitor();
			Object.keys(this.state.monitors).forEach(function (eventKey) {
				input.off(eventKey, this.state.monitors[eventKey]);
			}.bind(this));
			// destroy the component
			input.fileinput('destroy');
		},
		render: function () {
			var css = {
				'n-disabled': !this.isEnabled()
			};
			css[this.getComponentCSS('n-file')] = true;
			css.mobile = this.isMobileEnabled();
			var inputCSS = {
				file: true
			};
			return (<div className={$pt.LayoutHelper.classSet(css)} ref='comp'>
				<input type='file'
				       className={$pt.LayoutHelper.classSet(inputCSS)}
				       multiple={this.allowMultipleFiles()}
				       disabled={!this.isEnabled()}
				       name={this.getComponentOption('inputName')}
				       ref='file'/>
				{this.renderNormalLine()}
				{this.renderFocusLine()}
			</div>);
		},
		createDisplayOptions: function () {
			var _this = this;
			// get all component options
			var options = this.getLayout().getComponentOption();
			Object.keys(options).filter(function(key) {
				// the component type should be filterred
				return ['type', 'multiple', 'inputName', 'mobileEnabled'].indexOf(key) == -1;
			}).forEach(function (key) {
				options[key] = _this.getComponentOption(key);
				// console.log(key, options[key]);
				if (options[key] == null) {
					var defaultValue = NFile.DEFAULT_PROPERTY_VALUES[key];
					// console.log(defaultValue);
					if (defaultValue) {
						options[key] = defaultValue;
					} else {
						delete options[key];
					}
				}
			});
			Object.keys(NFile.DEFAULT_PROPERTY_VALUES).forEach(function(key) {
				if (options[key] == null) {
					options[key] = NFile.DEFAULT_PROPERTY_VALUES[key];
				}
			});
			if (this.isMobileEnabled()) {
				Object.keys(NFile.MOBILE_SETTINGS).forEach(function(key) {
					var value = NFile.MOBILE_SETTINGS[key];
					if (value) {
						options[key] = value;
					}
				});
			}
			return options;
		},
		allowMultipleFiles: function () {
			return this.getComponentOption('multiple');
		},
		onComponentFocused: function () {
			$(ReactDOM.findDOMNode(this.refs.focusLine)).toggleClass('focus');
			$(ReactDOM.findDOMNode(this.refs.normalLine)).toggleClass('focus');
		},
		onComponentBlurred: function () {
			$(ReactDOM.findDOMNode(this.refs.focusLine)).toggleClass('focus');
			$(ReactDOM.findDOMNode(this.refs.normalLine)).toggleClass('focus');
		},
		isMobileEnabled: function() {
			return this.isMobile() && this.getComponentOption('mobileEnabled');
		}
	}));
	$pt.Components.NFile = NFile;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.File, function (model, layout, direction, viewMode) {
		return <$pt.Components.NFile {...$pt.LayoutHelper.transformParameters(model, layout, direction, viewMode)}/>;
	});
}(window, jQuery, React, ReactDOM, $pt));
