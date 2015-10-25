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
			tag: 'NText',
			model: 'model',
			layout: 'layout'
		});

		var leftAddon = {
			icon: function () {
				var layoutTemplate = {comp: {leftAddon: {icon: 'money'}}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'text-left-add-on-icon',
					title: 'Icon',
					desc: 'Left add-on of icon.',
					xml: <NText model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 10
				};
			},
			string: function () {
				var layoutTemplate = {comp: {leftAddon: {text: '$'}}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'text-left-add-on-string',
					title: 'Text',
					desc: 'Left add-on of string.',
					xml: <NText model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 20
				};
			},
			both: function () {
				var layoutTemplate = {comp: {leftAddon: {icon: 'cc-visa', text: '$'}}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				var layoutTemplate2 = {comp: {leftAddon: {icon: 'cc-visa', text: '$', iconFirst: false}}};
				var layoutCode2 = $demo.convertCellLayoutCreatorToString({
					variable: 'layout2',
					cellKey: 'value',
					template: layoutTemplate2
				});
				var compCode2 = $demo.convertComponentCreatorToString({
					tag: 'NText',
					model: 'model',
					layout: 'layout2'
				});
				return {
					id: 'text-left-add-on-both',
					title: 'Both',
					desc: ['Left add-on of both icon and string.', 'Position of icon and string can be exchanged.'],
					xml: [<NText model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>,
						<NText model={model} layout={$pt.createCellLayout('value', layoutTemplate2)}/>],
					code: [modelCode, layoutCode, layoutCode2, compCode, compCode2],
					index: 30
				};
			},
			click: function () {
				var layoutTemplate = {
					comp: {
						leftAddon: {
							icon: 'cc-visa',
							text: '$',
							click: function (model, value) {
								alert('Input value: ' + value);
							}
						}
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'text-left-add-on-click',
					title: 'Click',
					desc: 'Left add-on with click bound.',
					xml: <NText model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 40
				};
			}
		};
		var rightAddon = {
			icon: function () {
				var layoutTemplate = {comp: {rightAddon: {icon: 'money'}}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'text-right-add-on-icon',
					title: 'Icon',
					desc: 'Right add-on of icon.',
					xml: <NText model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 10
				};
			},
			string: function () {
				var layoutTemplate = {comp: {rightAddon: {text: '$'}}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'text-right-add-on-text',
					title: 'Text',
					desc: 'Right add-on of string.',
					xml: <NText model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 20
				};
			},
			both: function () {
				var layoutTemplate = {comp: {rightAddon: {icon: 'cc-visa', text: '$'}}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				var layoutTemplate2 = {comp: {rightAddon: {icon: 'cc-visa', text: '$', iconFirst: false}}};
				var layoutCode2 = $demo.convertCellLayoutCreatorToString({
					variable: 'layout2',
					cellKey: 'value',
					template: layoutTemplate2
				});
				var compCode2 = $demo.convertComponentCreatorToString({
					tag: 'NText',
					model: 'model',
					layout: 'layout2'
				});
				return {
					id: 'text-right-add-on-both',
					title: 'Both',
					desc: ['Right add-on of both icon and string.', 'Position of icon and string can be exchanged.'],
					xml: [<NText model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>,
						<NText model={model} layout={$pt.createCellLayout('value', layoutTemplate2)}/>],
					code: [modelCode, layoutCode, layoutCode2, compCode, compCode2],
					index: 30
				};
			},
			click: function () {
				var layoutTemplate = {
					comp: {
						rightAddon: {
							icon: 'cc-visa',
							text: '$',
							click: function (model, value) {
								alert('Input value: ' + value);
							}
						}
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'text-right-add-on-click',
					title: 'Click',
					desc: 'Right add-on with click bound.',
					xml: <NText model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 40
				};
			}
		};
		var event = {
			keyUp: function () {
				var layoutTemplate = {
					evt: {
						keyUp: function (evt) {
							alert('Key up invoked.');
							console.log(evt);
						}
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'text-event',
					title: 'Event',
					desc: 'Capture the key up event.',
					xml: <NText model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 10
				};
			}
		};
		var all = {
			defaultOptions: function () {
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: {}
				});
				return {
					id: 'text-default',
					title: 'Default Options',
					desc: 'Text as password.',
					xml: <NText model={model} layout={$pt.createCellLayout('value', {})}/>,
					code: [modelCode, layoutCode, compCode],
					index: 10
				};
			},
			password: function () {
				var layoutTemplate = {comp: {pwd: true}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'text-password',
					title: 'Password',
					desc: 'A simple text input with no special options.',
					xml: <NText model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 20
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
					id: 'text-placeholder',
					title: 'Placeholder',
					desc: 'Text with placeholder.',
					xml: <NText model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 30
				};
			},
			left: function () {
				return {
					id: 'text-left-add-on',
					title: 'Left Add-on',
					desc: 'Icon, text can be added as left add-on on text.',
					index: 40,
					children: $demo.convertToExampleList(leftAddon)
				};
			},
			right: function () {
				return {
					id: 'text-right-add-on',
					title: 'Right Add-on',
					desc: 'Icon, text can be added as right add-on on text.',
					index: 50,
					children: $demo.convertToExampleList(rightAddon)
				};
			},
			event: function () {
				return {
					id: 'text-event',
					title: 'Event',
					desc: 'Event capture.',
					index: 60,
					children: $demo.convertToExampleList(event)
				};
			},
			css: function () {
				return $demo.convertCSSJSONToExample({
					id: 'text-css',
					index: 70,
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
	renderer.formText = function () {
		React.render(<ExampleList title='Form Text Input'
		                          formType='$pt.ComponentConstants.Text'
		                          items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));