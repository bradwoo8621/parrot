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
			tag: 'NTextArea',
			model: 'model',
			layout: 'layout'
		});

		var all = {
			defaultOptions: function () {
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: {}
				});
				return {
					id: 'text-area-default',
					title: 'Default Options',
					desc: 'A simple text area with no special options.',
					xml: <NTextArea model={model} layout={$pt.createCellLayout('value', {})}/>,
					code: [modelCode, layoutCode, compCode],
					index: 10
				};
			},
			placeholder: function () {
				var layoutTemplate = {comp: {placeholder: 'Placeholder...'}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'text-area-placeholder',
					title: 'Placeholder',
					desc: 'Text area with placeholder.',
					xml: <NTextArea model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 20
				};
			},
			lines: function () {
				var layoutTemplate = {comp: {lines: 5}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'text-area-lines',
					title: 'Lines',
					desc: ['Text area with given rows.',
						'Default height of each row is 30 pixels.',
						<span>Row height can be adjusted via <code>textarea.l[x],
							textarea.form-control.l[x]</code>, <code>x</code> is row count.</span>],
					xml: <NTextArea model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 30
				};
			},
			css: function () {
				return $demo.convertCSSJSONToExample({
					id: 'text-area-css',
					index: 40,
					css: {
						comp: 'your-class-name',
						'normal-line': 'your-class-name',
						'focus-line': 'your-class-name'
					}
				});
			}
		};
		return $demo.convertToExampleList(all);
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.formTextArea = function () {
		React.render(<ExampleList title='Form Text Area'
		                          formType='$pt.ComponentConstants.TextArea'
		                          items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));