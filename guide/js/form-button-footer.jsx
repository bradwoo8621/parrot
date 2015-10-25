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
			tag: 'NFormButtonFooter',
			model: 'model',
			layout: 'layout'
		});

		var all = {
			defaultOptions: function () {
				var layoutTemplate = {
					comp: {
						buttonLayout: {
							save: function (model) {
								alert('Save clicked');
							},
							reset: function (model) {
								alert('Reset clicked');
							},
							validate: function (model) {
								alert('Validate clicked');
							},
							cancel: function (model) {
								alert('Cancel clicked');
							},
							left: {
								icon: 'ban',
							},
							right: [{
								text: 'One'
							}, {text: 'Two'}]
						}
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'form-button-footer-default',
					title: 'Default',
					desc: ['Form Button Footer is a wrapper of NPanelFooter, makes it accepting data model and pass to buttons.',
						<span>All attributes and their usages is same as PanelFooter but wrapped in <code>buttonLayout</code></span>],
					xml: {
						width: 12,
						xml: <NFormButtonFooter model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 10
				};
			}
		};
		return $demo.convertToExampleList(all);
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.formButtonFooter = function () {
		React.render(<ExampleList title='Form Button Footer'
		                          formType='$pt.ComponentConstants.ButtonFooter'
		                          items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));