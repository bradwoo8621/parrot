(function (context, $) {
	var $demo = $pt.getService(context, '$demo');


	var painter = function () {
		var all = {
			defaultOptions: function () {
				var define = {
					save: {
						click: function (model) {
							alert('Save clicked');
						},
						enabled: true,
						visible: true
					},
					reset: function (model) {
						alert('Reset clicked');
					},
					validate: function (model) {
						alert('Validate clicked');
					},
					cancel: function (model) {
						alert('Validate clicked');
					},
					left: {
						icon: 'play',
						text: 'Play',
						style: 'primary',
						enabled: true,
						visible: true,
						click: function (model) {
							alert('Play clicked');
						}
					},
					right: [
						{
							icon: 'stop',
							text: 'Stop'
						},
						{
							icon: 'pause',
							text: 'Pause'
						}
					]
				};
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NPanelFooter',
					save: 'define.save',
					reset: 'define.reset',
					validate: 'define.validate',
					cancel: 'define.cancel',
					left: 'define.left',
					right: 'define.right'
				});
				var comp = <NPanelFooter save={define.save} reset={define.reset}
				                         validate={define.validate} cancel={define.cancel}
				                         left={define.left} right={define.right}/>;
				return {
					id: 'panel-footer-default',
					title: 'Default',
					desc: <span>Panel Footer.<br/>
					Contains four standard button and can define additional buttons.<br/>
					Note order of right buttons is reversed.
					</span>,
					xml: {width: 12, xml: comp},
					code: [$demo.convertJSON({variable: 'define', json: define}), compCode],
					index: 10
				};
			},
			constants: function () {
				var statics = {
					RESET_TEXT: NPanelFooter.RESET_TEXT,
					RESET_ICON: NPanelFooter.RESET_ICON,
					RESET_STYLE: NPanelFooter.RESET_STYLE,

					VALIDATE_TEXT: NPanelFooter.VALIDATE_TEXT,
					VALIDATE_ICON: NPanelFooter.VALIDATE_ICON,
					VALIDATE_STYLE: NPanelFooter.VALIDATE_STYLE,

					SAVE_TEXT: NPanelFooter.SAVE_TEXT,
					SAVE_ICON: NPanelFooter.SAVE_ICON,
					SAVE_STYLE: NPanelFooter.SAVE_STYLE,

					CANCEL_TEXT: NPanelFooter.CANCEL_TEXT,
					CANCEL_ICON: NPanelFooter.CANCEL_ICON,
					CANCEL_STYLE: NPanelFooter.CANCEL_STYLE
				};
				return {
					id: 'panel-footer-constants',
					title: 'Constants',
					desc: 'Available constants. Constants must be change before construct component.',
					index: 1000,
					code: $demo.convertJSON({
						variable: 'NPanelFooter',
						json: {
							statics: statics
						}
					})
				};
			}
		};
		return $demo.convertToExampleList(all);
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.panelFooter = function () {
		React.render(<ExampleList title='NPanelFooter'
		                          formType='<NPanelFooter />'
		                          items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));