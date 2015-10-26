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
			tag: 'NCheck',
			model: 'model',
			layout: 'layout'
		});

		var all = {
			defaultOptions: function () {
				var layoutTemplate = {
					label: 'Check me'
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'check-default',
					title: 'Default',
					desc: 'A simple check box.',
					xml: <NCheck model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 10
				};
			},
			label: function () {
				var layoutTemplate = {
					label: 'Check me',
					comp: {
						labelAttached: true
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				var layoutTemplate2 = {
					label: 'Check me',
					comp: {
						labelAttached: 'left'
					}
				};
				var layoutCode2 = $demo.convertCellLayoutCreatorToString({
					variable: 'layout2',
					cellKey: 'value',
					template: layoutTemplate2
				});
				var compCode2 = $demo.convertComponentCreatorToString({
					tag: 'NCheck',
					model: 'model',
					layout: 'layout2'
				});
				return {
					id: 'check-label',
					title: 'Label',
					desc: ['Check box with label.',
						<span>Attribute <code>labelAttached</code> can be boolean or <code>left</code>, <code>right</code>.</span>],
					xml: [<NCheck model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>,
						<NCheck model={model} layout={$pt.createCellLayout('value', layoutTemplate2)}/>],
					code: [modelCode, layoutCode, layoutCode2, compCode, compCode2],
					index: 20
				};
			},
			css: function () {
				return $demo.convertCSSJSONToExample({
					id: 'check-css',
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
	renderer.formCheck = function () {
		React.render(<ExampleList title='Form Check Box'
		                          formType='$pt.ComponentConstants.Check'
		                          items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));