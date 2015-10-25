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
			tag: 'NToggle',
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
					id: 'toggle-default',
					title: 'Default',
					desc: 'A simple toggle button.',
					xml: <NToggle model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 10
				};
			},
			label: function () {
				var layoutTemplate = {
					label: 'Check me',
					comp: {
						labelAttached: {
							left: 'Yes',
							right: 'No'
						}
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'toggle-label',
					title: 'Label',
					desc: ['Toggle Button with label.',
						<span className='required'>The left side is true, the other side is false or no value.</span>],
					xml: <NToggle model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 20
				};
			},
			css: function () {
				return $demo.convertCSSJSONToExample({
					id: 'toggle-css',
					index: 30,
					css: {
						comp: 'your-class-name'
					}
				});
			}
		};
		return $demo.convertToExampleList(all);
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.formToggle = function () {
		React.render(<ExampleList title='Form Toggle Button'
		                          formType='$pt.ComponentConstants.Toggle'
		                          items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));