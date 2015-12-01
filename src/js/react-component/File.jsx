(function (context, $, $pt) {
	var NFile = React.createClass($pt.defineCellComponent({
		displayName: 'NFile',
		statics: {},
		propTypes: {
			// model
			model: React.PropTypes.object,
			// CellLayout
			layout: React.PropTypes.object
		},
		getDefaultProps: function () {
			return {
				defaultOptions: {
					multiple: true,
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
				}
			};
		},
		getInitialState: function () {
			return {};
		},
		componentWillUpdate: function() {
			this.unregisterFromComponentCentral();
		},
		componentDidUpdate: function() {
			this.registerToComponentCentral();
		},
		componentDidMount: function () {
			var input = $(React.findDOMNode(this.refs.file));
			input.fileinput(this.createDisplayOptions({
				ajaxDeleteSettings: null,
				ajaxSettings: null,
				allowedFileExtensions: null,
				allowedFileTypes: null,
				allowedPreviewMimeTypes: null,
				allowedPreviewTypes: null,
				autoReplace: null,
				browseClass: null,
				browseIcon: null,
				browseLabel: null,
				buttonLabelClass: null,
				captionClass: null,
				customLayoutTags: null,
				customPreviewTags: null,
				deleteExtraData: null,
				deleteUrl: null,
				dropZoneEnabled: null,
				dropZoneTitle: null,
				dropZoneTitleClass: null,
				fileTypeSettings: null,
				initialCaption: null,
				initialPreview: null,
				initialPreviewConfig: null,
				initialPreviewCount: null,
				initialPreviewDelimiter: null,
				initialPreviewShowDelete: null,
				initialPreviewThumbTags: null,
				language: null,
				mainClass: null,
				maxFileCount: null,
				maxFileSize: null,
				maxImageHeight: null,
				maxImageWidth: null,
				minFileCount: null,
				minImageHeight: null,
				minImageWidth: null,
				msgErrorClass: null,
				msgFileNotFound: null,
				msgFileNotReadable: null,
				msgFilePreviewAborted: null,
				msgFilePreviewError: null,
				msgFileSecured: null,
				msgFilesTooLess: null,
				msgFilesTooMany: null,
				msgFoldersNotAllowed: null,
				msgImageHeightLarge: null,
				msgImageHeightSmall: null,
				msgImageWidthLarge: null,
				msgImageWidthSmall: null,
				msgInvalidFileExtension: null,
				msgInvalidFileType: null,
				msgLoading: null,
				msgProgress: null,
				msgSelected: null,
				msgSizeTooLarge: null,
				msgUploadAborted: null,
				msgValidationError: null,
				msgValidationErrorClass: null,
				msgValidationErrorIcon: null,
				msgZoomModalHeading: null,
				msgZoomTitle: null,
				overwriteInitial: null,
				previewClass: null,
				previewFileExtSettings: null,
				previewFileIcon: null,
				previewFileIconClass: null,
				previewFileIconSettings: null,
				previewFileType: null,
				previewSettings: null,
				previewThumbTags: null,
				progressClass: null,
				progressCompleteClass: null,
				removeClass: null,
				removeIcon: null,
				removeLabel: null,
				removeTitle: null,
				showAjaxErrorDetails: null,
				showCaption: null,
				showClose: null,
				showPreview: null,
				showRemove: null,
				showUpload: null,
				showUploadedThumbs: null,
				uploadAsync: null,
				uploadClass: null,
				uploadExtraData: null,
				uploadIcon: null,
				uploadLabel: null,
				uploadTitle: null,
				uploadUrl: null,
				validateInitialCount: null,
				zoomIndicator: null
			}));
			// event monitor
			var monitors = this.getEventMonitor();
			Object.keys(monitors).forEach(function (eventKey) {
				input.on(eventKey, monitors[eventKey]);
			});

			var comp = $(React.findDOMNode(this.refs.comp));
			comp.find('.kv-fileinput-caption')
				.focus(this.onComponentFocused)
				.blur(this.onComponentBlurred);
			comp.find('.input-group-btn>.btn')
				.focus(this.onComponentFocused)
				.blur(this.onComponentBlurred);
			this.registerToComponentCentral();
		},
		componentWillUnmount: function () {
			var input = $(React.findDOMNode(this.refs.file));
			// event monitor
			var monitors = this.getEventMonitor();
			Object.keys(monitors).forEach(function (eventKey) {
				input.off(eventKey, monitors[eventKey]);
			});
			// destroy the component
			input.fileinput('destroy');
			this.unregisterFromComponentCentral();
		},
		render: function () {
			var css = {};
			css[this.getComponentCSS('n-file')] = true;
			var inputCSS = {
				file: true
			};
			return (<div className={$pt.LayoutHelper.classSet(css)} ref='comp'>
				<input type='file'
				       className={$pt.LayoutHelper.classSet(inputCSS)}
				       multiple={this.allowMultipleFiles()}
				       disabled={!this.isEnabled()}
				       ref='file'/>
				{this.renderNormalLine()}
				{this.renderFocusLine()}
			</div>);
		},
		createDisplayOptions: function (options) {
			var _this = this;
			Object.keys(options).forEach(function (key) {
				options[key] = _this.getComponentOption(key);
				if (options[key] == null) {
					delete options[key];
				}
			});
			return options;
		},
		allowMultipleFiles: function () {
			return this.getComponentOption('multiple');
		},
		onComponentFocused: function () {
			$(React.findDOMNode(this.refs.focusLine)).toggleClass('focus');
			$(React.findDOMNode(this.refs.normalLine)).toggleClass('focus');
		},
		onComponentBlurred: function () {
			$(React.findDOMNode(this.refs.focusLine)).toggleClass('focus');
			$(React.findDOMNode(this.refs.normalLine)).toggleClass('focus');
		}
	}));
	context.NFile = NFile;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.File, function (model, layout, direction, viewMode) {
		return <NFile {...$pt.LayoutHelper.transformParameters(model, layout, direction, viewMode)}/>;
	});
}(this, jQuery, $pt));
