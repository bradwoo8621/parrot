(function (context, $) {
	var $demo = $pt.getService(context, '$demo');


	var painter = function () {
		var modelTemplate = {};
		var model = $pt.createModel(modelTemplate);
		var modelCode = $demo.convertModelCreatorToString({
			variable: 'model',
			template: modelTemplate
		});
		var compCode = $demo.convertComponentCreatorToString({
			tag: 'NFile',
			model: 'model',
			layout: 'layout'
		});

		var all = {
			defaultOptions: function () {
				var layoutTemplate = {};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'file-default',
					title: 'Default',
					desc: 'A simple file browser.',
					xml: <NFile model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 10
				};
			},
			properties: function () {
				return {
					id: 'file-properties',
					title: 'Properties',
					desc: ['Available properties.', 'Refers to Bootstrap File-Input',
						<span
							className='required'>Only wrapper the 3rd-party component, find how to use by yourself.</span>],
					index: 50,
					code: $demo.convertJSON({
						variable: 'layout',
						json: {
							comp: {
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
							}
						}
					})
				}
			},
			css: function () {
				return $demo.convertCSSJSONToExample({
					id: 'file-css',
					index: 30,
					css: {
						comp: 'your-class-name',
						'normal-line': 'your-class-name',
						'focus-line': 'your-class-name'
					}
				});
			}
		}
		return $demo.convertToExampleList(all);
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.formFile = function () {
		React.render(<ExampleList title='Form File Browser'
		                          formType='$pt.ComponentConstants.File'
		                          items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));