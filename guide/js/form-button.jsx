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
			tag: 'NFormButton',
			model: 'model',
			layout: 'layout'
		});

		var all = {
			defaultOptions: function () {
				var layoutTemplate = {
					label: 'Click me',
					comp: {
						click: function (model) {
							alert('Clicked');
							console.log(model);
						}
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'button',
					template: layoutTemplate
				});
				return {
					id: 'button-default',
					title: 'Default',
					desc: 'A simple button.',
					xml: <NFormButton model={model} layout={$pt.createCellLayout('button', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 10
				};
			},
			icon: function () {
				var layoutTemplate = {
					comp: {
						icon: 'commenting'
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'button',
					template: layoutTemplate
				});
				return {
					id: 'button-icon',
					title: 'Icon',
					desc: 'Button with icon.',
					xml: <NFormButton model={model} layout={$pt.createCellLayout('button', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 20
				};
			},
			labelPos: function () {
				var layoutTemplate = {
					label: 'Click me',
					comp: {
						icon: 'commenting',
						labelPosition: 'left'
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'button',
					template: layoutTemplate
				});
				return {
					id: 'button-label-position',
					title: 'Label Position',
					desc: ['Button with icon and text.', 'Position of icon and text can be exchanged.',
						<span>Default value of <code>labelPosition</code> is <code>right</code>.</span>],
					xml: <NFormButton model={model} layout={$pt.createCellLayout('button', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 30
				};
			},
			dropdown: function () {
				var layoutTemplate = {
					label: 'Click me',
					comp: {
						icon: 'commenting',
						labelPosition: 'left',
			            more: [
			                {icon: 'commenting-o', text: 'commenting', click: function(model) {alert('Commenting');}},
			                {divider: true},
			                {icon: 'balance-scale', text: 'Balance', click: function(model) {alert('Balance');}}
			            ]
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'button',
					template: layoutTemplate
				});
				return {
					id: 'button-label-dropdown',
					title: 'Dropdown',
					desc: ['Dropdown buttons.',
						<span>Dropdown item has <code>icon</code>, <code>text</code> and <code>click</code>.
						Or declared as a divider via <code>divider: true</code>.</span>],
					xml: <NFormButton model={model} layout={$pt.createCellLayout('button', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 35
				};
			},
			style: function () {
				var layoutTemplate = {
					label: 'Click me',
					comp: {
						style: 'danger'
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'button',
					template: layoutTemplate
				});
				return {
					id: 'button-style',
					title: 'Style',
					desc: ['Button with style.',
						<span>Style can be <code>default</code>, <code>primary</code>, <code>success</code>, <code>info</code>, <code>warning</code>, <code>danger</code>.</span>,
						'Or any customized style name, refer to Bootstrap button styles.'],
					xml: <NFormButton model={model} layout={$pt.createCellLayout('button', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 40
				};
			},
			css: function () {
				return $demo.convertCSSJSONToExample({
					id: 'button-css',
					index: 50,
					css: {
						comp: 'your-class-name'
					}
				});
			}
		};

		return $demo.convertToExampleList(all);
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.formButton = function () {
		React.render(<ExampleList title='Form Button'
		                          formType='$pt.ComponentConstants.Button'
		                          items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));
