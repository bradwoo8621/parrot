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
			tag: 'NRadio',
			model: 'model',
			layout: 'layout'
		});
		var codes = $pt.createCodeTable([{id: 'F', text: 'Female'}, {id: 'M', text: 'Male'}]);
		var codesCode = $demo.convertCodeTableCreatorToString({variable: 'codes', codetable: codes});

		var all = {
			defaultOptions: function () {
				var layoutTemplate = {
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
					id: 'radio-default',
					title: 'Default',
					desc: 'A simple radio button.',
					xml: <NRadio model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>,
					code: [codesCode, modelCode, layoutCode, compCode],
					index: 10
				};
			},
			label: function () {
				var layoutTemplate = {
					comp: {
						data: codes,
						labelAtLeft: true
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'radio-label',
					title: 'Label',
					desc: 'Label position of radio button can be adjusted.',
					xml: <NRadio model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>,
					code: [codesCode, modelCode, layoutCode, compCode],
					index: 20
				};
			},
			vertical: function () {
				var layoutTemplate = {
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
					id: 'radio-vertical',
					title: 'Vertical',
					desc: 'Alignment of radio buttons can be vertical.',
					xml: <NRadio model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>,
					code: [codesCode, modelCode, layoutCode, compCode],
					index: 20
				};
			},
			css: function () {
				return $demo.convertCSSJSONToExample({
					id: 'text-area-css',
					index: 40,
					css: {
						comp: 'your-class-name'
					}
				});
			}
		};

		return $demo.convertToExampleList(all);
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.formRadio = function () {
		React.render(<ExampleList title='Form Radio Button'
		                          formType='$pt.ComponentConstants.Radio'
		                          items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));
