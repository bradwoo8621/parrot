/**
 * Created by brad.wu on 10/20/2015.
 */
(function (context, $) {
	var $demo = $pt.getService(context, '$demo');


	var painter = function () {
		var modelTemplate = {label: 'Label Text', amount: 1500};
		var model = $pt.createModel(modelTemplate);
		var modelCode = $demo.convertModelCreatorToString({
			variable: 'model',
			template: modelTemplate
		});
		var compCode = $demo.convertComponentCreatorToString({
			tag: 'NLabel',
			model: 'model',
			layout: 'layout'
		});

		var all = {
			defaultOptions: function () {
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'label',
					template: {}
				});
				return {
					id: 'label-default',
					title: 'Default Options',
					desc: 'A simple label with no special options.',
					xml: <NLabel model={model} layout={$pt.createCellLayout('label', {})}/>,
					code: [modelCode, layoutCode, compCode],
					index: 10
				};
			},
			currency: function () {
				var layoutTemplate = {comp: {currency: true, fraction: 2}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'amount',
					template: layoutTemplate
				});
				return {
					id: 'label-currency',
					title: 'Currency',
					desc: ['Label with currency format.',
						'Array values are not supported.',
						<span>Using <code>String.prototype.currencyFormat</code> and <code>Number.prototype.currencyFormat</code> to change the currency format.</span>],
					xml: <NLabel model={model} layout={$pt.createCellLayout('amount', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 20
				};
			},
			convertor: function() {
				var layoutTemplate = {comp: {convertor: function(value) {return 'Who are you?';}}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'amount',
					template: layoutTemplate
				});
				return {
					id: 'label-convertor',
					title: 'Convertor',
					desc: 'A convertor can be defined in component option, can return value is displayed.',
					xml: <NLabel model={model} layout={$pt.createCellLayout('amount', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 25
				};
			},
			left: function () {
				var layoutTemplate = {comp: {left: '#: '}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'amount',
					template: layoutTemplate
				});
				return {
					id: 'label-left-add-on',
					title: 'Left Add-on',
					desc: 'Label with left add-on text.',
					xml: <NLabel model={model} layout={$pt.createCellLayout('amount', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 30
				};
			},
			right: function () {
				var layoutTemplate = {comp: {right: ' CNY'}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'amount',
					template: layoutTemplate
				});
				return {
					id: 'label-right-add-on',
					title: 'Right Add-on',
					desc: 'Label with right add-on text.',
					xml: <NLabel model={model} layout={$pt.createCellLayout('amount', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 40
				};
			},
			placeholder: function () {
				var layoutTemplate = {comp: {placeholder: 'N/A'}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'blank',
					template: layoutTemplate
				});
				return {
					id: 'label-placeholder',
					title: 'Placeholder',
					desc: ['Label with placeholder.',
						<span>Attribute <code>placeholder</code> also can be declared as <code>replaceBlank</code>.</span>],
					xml: <NLabel model={model} layout={$pt.createCellLayout('blank', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 50
				};
			},
			style: function () {
				var layoutTemplate = {comp: {style: 'danger'}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'amount',
					template: layoutTemplate
				});
				return {
					id: 'label-style',
					title: 'Style',
					desc: ['Label with style.',
						<span>Style can be <code>default</code>, <code>primary</code>, <code>success</code>, <code>info</code>, <code>warning</code>, <code>danger</code>.</span>,
						<span>Or any customized style name which declared css name <code>n-label-[your-style-name]</code>, eg. <code>n-label-fly</code>.</span>],
					xml: <NLabel model={model} layout={$pt.createCellLayout('amount', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 60
				};
			},
			fixed: function () {
				var layoutTemplate = {label: 'Label Predefined', comp: {textFromModel: false}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'amount',
					template: layoutTemplate
				});
				return {
					id: 'label-fixed',
					title: 'Fixed',
					desc: 'Lable text can be pre-defined.',
					xml: <NLabel model={model} layout={$pt.createCellLayout('amount', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 70
				};
			},
			css: function () {
				return $demo.convertCSSJSONToExample({
					id: 'label-css',
					index: 80,
					css: {
						comp: 'your-class-name'
					}
				});
			}
		}
		return $demo.convertToExampleList(all);
	};
	var renderer = $pt.getService($demo, 'renderer');
	renderer.formLabel = function () {
		React.render(<ExampleList title='Form Label'
		                          formType='$pt.ComponentConstants.Label'
		                          items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));
