(function (context, $) {
	var $demo = $pt.getService(context, '$demo');


	var painter = function () {
		var codes = $pt.createCodeTable([
			{id: '1', text: 'Option One'},
			{id: '2', text: 'Option Two'},
			{id: '3', text: 'Option Three'}
		]);
		var modelTemplate = {
			value: ['1', '3']
		};
		var model = $pt.createModel(modelTemplate);
		var modelCode = $demo.convertModelCreatorToString({
			variable: 'model',
			template: modelTemplate
		});
		var compCode = $demo.convertComponentCreatorToString({
			tag: 'NArrayCheck',
			model: 'model',
			layout: 'layout'
		});
		var codesCode = $demo.convertCodeTableCreatorToString({variable: 'codes', codetable: codes});

		var all = {
			defaultOptions: function () {
				var layoutTemplate = {
					label: 'Check me',
					comp: {
						data: codes
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'array-check-default',
					title: 'Default',
					desc: 'A simple array check box.',
					xml: {width: 12, xml:<NArrayCheck model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>},
					code: [codesCode, modelCode, layoutCode, compCode],
					index: 10
				};
			},
			label: function () {
				var layoutTemplate = {
					label: 'Check me',
					comp: {
						data: codes,
						labelAttached: 'left'
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'array-check-label',
					title: 'Label',
					desc: ['Check box with label in left.',
						<span>Attribute <code>labelAttached</code> can be <code>left</code>, <code>right</code>, <code>right</code> is default value.</span>],
					xml: [{width: 12, xml: <NArrayCheck model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>}],
					code: [codesCode, modelCode, layoutCode, compCode],
					index: 20
				};
			},
			vertical: function () {
				var layoutTemplate = {
					label: 'Check me',
					comp: {
						data: codes,
						direction: 'vertical'
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'array-check-vertical',
					title: 'Vertical',
					desc: ['Check box vertial alignment.',
						<span>Attribute <code>direction</code> can be <code>horizontal</code>, <code>vertical</code>. <code>horizontal</code> is default value.</span>],
					xml: [{width: 12, xml: <NArrayCheck model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>}],
					code: [codesCode, modelCode, layoutCode, compCode],
					index: 30
				};
			},
			css: function () {
				return $demo.convertCSSJSONToExample({
					id: 'array-check-css',
					index: 1000,
					css: {
						comp: 'your-class-name'
					}
				});
			}
		};
		return $demo.convertToExampleList(all);
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.formArrayCheck = function () {
		React.render(<ExampleList title='Form Array Check Box'
		                          formType='$pt.ComponentConstants.ArrayCheck'
		                          items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));
