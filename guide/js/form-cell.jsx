(function (context, $) {
	var $demo = $pt.getService(context, '$demo');


	var painter = function () {
		var modelTemplate = {};
		var validatorTemplate = {
			value1: {
				minlength: 3,
			},
			value2: {
				minlength: 3
			},
			value3: {
				required: true
			},
			value4: {
				required: true
			}
		};
		var model = $pt.createModel(modelTemplate, $pt.createModelValidator(validatorTemplate));
		var modelCode = $demo.convertModelCreatorToString({
			variable: 'model',
			template: modelTemplate,
			validatorVariable: 'validator',
			validatorTemplate: validatorTemplate
		});
		var compCode = $demo.convertComponentCreatorToString({
			tag: 'NFormCell',
			model: 'model',
			layout: 'layout'
		});

		var all = {
			concept: function () {
				var layoutTemplate = {};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'form-cell-concept',
					title: 'Concept',
					desc: [
						<span>
						Form Cell is a container which contains other form components/containers,
						components or containers are declared in Form Cell JSON via <code>comp.type</code> attribute.
					</span>,
						'Form Cell plus some features into component/container.'],
					index: 10
				};
			},
			defaultOptions: function () {
				var layoutTemplate = {};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'form-cell-default',
					title: 'Default',
					desc: ['A simple form cell.',
						'No type given, treated as Text.',
						'No label given, keep it blank, but still leave the span element.',
						'No width given, treated as 3 (3 in 12).'],
					xml: {
						width: 12,
						xml: <NFormCell model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 20
				};
			},
			min: function () {
				var layoutTemplate = {
					label: 'Label Of Value1',
					comp: {
						type: $pt.ComponentConstants.Text
					},
					pos: {
						width: 12
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value1',
					template: layoutTemplate
				});
				var layoutTemplate2 = {
					label: 'Label Of Value2',
					comp: {
						type: {
							type: $pt.ComponentConstants.Text,
							label: false,
							popover: false
						}
					},
					pos: {
						width: 12
					}
				};
				var layoutCode2 = $demo.convertCellLayoutCreatorToString({
					variable: 'layout2',
					cellKey: 'value2',
					template: layoutTemplate2
				});
				var compCode2 = $demo.convertComponentCreatorToString({
					tag: 'NFormCell',
					model: 'model',
					layout: 'layout2'
				});
				return {
					id: 'form-cell-min',
					title: 'Min Options',
					desc: ['Form cell with appointed type, label and width.',
						<span>
						Option values of <code>type</code> are defined in <code>$pt.ComponentConstants</code>.
						There are 2 object types of <code>type</code>: <br/>
						One is string, such as <code>$pt.ComponentConstants.Text</code>,
						<code>$pt.ComponentConstants.Select</code>, etc. <br/>
						The other is a JSON object, contains three attributes,
						<code>type</code>, <code>label</code> and <code>popover</code>.
						Such as <code>$pt.ComponentConstants.Table</code>, <code>$pt.ComponentConstants.Panel</code>, etc.
					</span>,
						<span><code>type</code>: string. Type of component.</span>,
						<span><code>label</code>: boolean. Hide form cell label if it is false.</span>,
						<span><code>popover</code>: boolean. Hide validation popover if it is false.</span>,
						<br/>,
						'Table, Panel, Tab, Label, Nothing, Button, ButtonFooter are hiding label.',
						'Table is hiding popover.',
						'The others are declared as with default value (true) at label and popover',
						<br/>,
						<span>The following examples are declared <code>minlength: 3</code>, try it yourself.</span>],
					xml: [<NFormCell model={model} layout={$pt.createCellLayout('value1', layoutTemplate)}/>,
						<NFormCell model={model} layout={$pt.createCellLayout('value2', layoutTemplate2)}/>],
					code: [modelCode, layoutCode, layoutCode2, compCode, compCode2],
					index: 30
				};
			},
			required: function () {
				var layoutTemplate = {
					label: 'Label Of Value3',
					pos: {
						width: 12
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value3',
					template: layoutTemplate
				});
				var layoutTemplate2 = {
					label: 'Label Of Value4',
					comp: {
						paintRequired: false
					},
					pos: {
						width: 12
					}
				};
				var layoutCode2 = $demo.convertCellLayoutCreatorToString({
					variable: 'layout2',
					cellKey: 'value4',
					template: layoutTemplate2
				});
				var compCode2 = $demo.convertComponentCreatorToString({
					tag: 'NFormCell',
					model: 'model',
					layout: 'layout2'
				});
				return {
					id: 'form-cell-required',
					title: 'Required',
					desc: [<span>Form Cell will paint required sign only if there is <code>required: true</code> declared in validator</span>,
						'But sometimes, even validator rule is declared, the required sign also do not needed.'],
					xml: [<NFormCell model={model} layout={$pt.createCellLayout('value3', layoutTemplate)}/>,
						<NFormCell model={model} layout={$pt.createCellLayout('value4', layoutTemplate2)}/>],
					code: [modelCode, layoutCode, layoutCode2, compCode, compCode2],
					index: 40
				};
			},
			horizontal: function () {
				var layoutTemplate = {
					label: 'Label Of Value3',
					pos: {
						width: 12
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value3',
					template: layoutTemplate
				});
				var layoutTemplate2 = {
					label: 'Label Of Value4',
					comp: {
						paintRequired: false,
						labelDirection: 'horizontal'
					},
					pos: {
						width: 12
					}
				};
				var layoutCode2 = $demo.convertCellLayoutCreatorToString({
					variable: 'layout2',
					cellKey: 'value4',
					template: layoutTemplate2
				});
				var compCode2 = $demo.convertComponentCreatorToString({
					tag: 'NFormCell',
					model: 'model',
					layout: 'layout2'
				});
				var layoutTemplate3 = {
					label: 'Label Of Value4',
					comp: {
						paintRequired: false,
						labelDirection: 'horizontal',
						labelWidth: 6
					},
					pos: {
						width: 12
					}
				};
				var layoutCode3 = $demo.convertCellLayoutCreatorToString({
					variable: 'layout3',
					cellKey: 'value4',
					template: layoutTemplate3
				});
				var compCode3 = $demo.convertComponentCreatorToString({
					tag: 'NFormCell',
					model: 'model',
					layout: 'layout3'
				});
				return {
					id: 'form-cell-horizontal',
					title: 'Horizontal',
					desc: ['Form Cell can place the label and component via two ways, horizontal and vertical (default).',
						<span>As React component, Form Cell accepts <code>direction</code>, or declare <code>labelDirection</code> in cell layout JSON.</span>,
						<span>When aligned horizontal, can set the label width via <code>labelWidth</code>, default is 4 (in 12).</span>,
						<span>Note <code>labelDirection</code> has high priority to <code>direction</code>.</span>],
					xml: [
						{
							width: 4,
							xml: <NFormCell model={model} layout={$pt.createCellLayout('value3', layoutTemplate)}
							                direction='horizontal'/>
						},
						{
							width: 4,
							xml: <NFormCell model={model} layout={$pt.createCellLayout('value4', layoutTemplate2)}/>
						},
						{
							width: 4,
							xml: <NFormCell model={model} layout={$pt.createCellLayout('value4', layoutTemplate3)}/>
						}],
					code: [modelCode, layoutCode, layoutCode2, layoutCode3, compCode, compCode2, compCode3],
					index: 50
				};
			},
			tooltip: function () {
				var layoutTemplate = {
					label: 'Label Of Cell',
					comp: {
						tooltip: 'Hello, world.'
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'form-cell-tooltip',
					title: 'Tooltip',
					desc: ['A simple tooltip can be declared.'],
					xml: {
						width: 12,
						xml: <NFormCell model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 60
				};
			},
			width: function () {
				var layoutTemplate = {
					label: 'Label Of Cell',
					pos: {
						width: {
							sm: 12,
							md: 10,
							lg: 8,
							width: 8
						}
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'form-cell-width',
					title: 'Width',
					desc: ['Width of Form Cell can be declared as different values.',
						<span>
						<code>lg</code>, <code>md</code>, <code>sm</code> are all optional,
						use value of <code>width</code> instead if not defined.
						Or if the three attributes are all existed, then <code>width</code> is not required.
					</span>,
						<span><code>width</code> also can be declared as a number from 1 to 12, and default is 3 if not existed.</span>],
					xml: {
						width: 12,
						xml: <NFormCell model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 70
				};
			},
			visible: function () {
				return {
					id: 'form-cell-visible',
					title: 'Visible',
					desc: [<span>
						<code>visible</code> definition is same as <code>enabled</code>,
						the only difference is <code>visible</code> provided by Form Cell,
						<code>enabled</code> provided by it's inner component.
						Which means if component is used alone, <code>visible</code> is not worked.
					</span>
					],
					index: 80
				};
			},
			enabled: function () {
				var layoutTemplate = {
					label: 'Label Of Cell',
					comp: {
						enabled: false
					},
					pos: {
						width: 4
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				var another = $pt.createModel({});
				another.name('another');
				var layoutTemplate2 = {
					text1: {
						label: 'Enable depends on "enabled" property',
						comp: {
							enabled: {
								depends: 'enabled',
								when: function (model, value) {
									return model.get('enabled');
								}
							}
						},
						pos: {
							width: 5,
							row: 10
						}
					},
					text1Button: {
						label: 'Text1 Enabled Switch',
						comp: {
							type: $pt.ComponentConstants.Button,
							click: function (model) {
								model.set('enabled', !model.get('enabled'));
							}
						},
						pos: {
							row: 10
						}
					},
					text2: {
						label: 'Enable depends on another model',
						comp: {
							enabled: {
								depends: 'enabled',
								when: function (model, value) {
									return model.get('enabled');
								}
							},
							model: another
						},
						pos: {
							width: 5,
							row: 20
						}
					},
					text2Button: {
						label: 'Text2 Enabled Switch',
						comp: {
							type: $pt.ComponentConstants.Button,
							click: function (model) {
								model.set('enabled', !model.get('enabled'));
							},
							model: another
						},
						pos: {
							row: 20
						}
					},
					text3: {
						label: 'Declare another model but still depends on form\'s',
						comp: {
							enabled: {
								depends: {id: 'enabled', on: 'form'},
								when: function (model, value) {
									console.log(this.getFormModel());
									return this.getFormModel().get('enabled');
								}
							},
							model: another
						},
						pos: {
							width: 5,
							row: 30
						}
					},
					text3Button: {
						label: 'Text3 Enabled Switch',
						comp: {
							type: $pt.ComponentConstants.Button,
							click: function (model) {
								model.set('enabled', !model.get('enabled'));
							}
						},
						pos: {
							row: 30
						}
					}
				};
				var modelCode2 = $demo.convertModelCreatorToString({
					variable: 'another',
					template: {}
				});
				var layoutCode2 = $demo.convertFormLayoutCreatorToString({
					variable: 'layout2',
					template: layoutTemplate2
				});
				var compCode2 = $demo.convertComponentCreatorToString({
					tag: 'NForm',
					model: 'model',
					layout: 'layout2'
				});
				return {
					id: 'form-cell-enabled',
					title: 'Enabled',
					desc: ['It\'s easy to control the enabled of form cell. ' +
					'Actually the enabled is provided by the component which in Form Cell, ' +
					'so enabled attribute is not accepted by containers, such as Panel, Form, etc.',
						<span>
						<code>enabled</code> accepts the following syntax:<br/>
						boolean: simply true or false. default is true. component will always be false if set as false.<br/>
						JSON: two attributes <code>when</code> and <code>depends</code>.
						<code>when</code> is a function which accepts two paramters, current model and current value.
						returns boolean value to decide the enabled of component.
						<code>depends</code> can be a plain string, or a string array,
						or a JSON object likes <code>{'\u007B'}id: string, on: string{'\u007D'}</code>.
						the string, string array and id in JSON is property name of data model,
						component will call the <code>when</code> function when the declared properties are changed.
						In some special scenario, the monitored property is not in the current form model, so follow the steps: <br/>
						1. Add <code>model</code> declaration into cell layout,<br/>
						2. Use <code>useFormModel</code> to switch from the form model and special model.
						Be careful, default value of <code>useFormModel</code> is false when <code>model</code> declared,
						which means the whole model of Form Cell and it's component will be switched,
						but will not effects components in container.<br/>
						3. Declare <code>on</code> as <code>form</code> if the current model is switched to special model;
						or declare as <code>inner</code> when the current model is still the form model.
					</span>,
						<span><code>width</code> also can be declared as a number from 1 to 12, and default is 3 if not existed.</span>],
					xml: [{
						width: 12,
						xml: <NFormCell model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>
					}, {
						width: 12,
						xml: <NForm model={model} layout={$pt.createFormLayout(layoutTemplate2)}/>
					}],
					code: [modelCode, modelCode2, layoutCode, layoutCode2, compCode, compCode2],
					index: 90
				};
			},
			centralId: function() {
				var layoutTemplate = {
					label: 'Label of Cell',
					centralId: 'myCentralId'
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'form-cell-central-id',
					title: 'Central ID',
					desc: <span>Register react component to component central, get component via <code>$pt.LayoutHelper.getComponent(id)</code>.
					Parameter <code>id</code> is declared by <code>centralId</code>; meanwhile, form cell of component is registered as <code>id + '@cell'</code>.
					In this case, cell component id is <code>myCentralId@cell</code>.<br/>
					Purpose of registration is let component can be visited in runtime, sometimes force update or visit the APIs of component.</span>,
					index: 95,
					xml: {
						width: 12,
						xml: <NFormCell model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>
					},
					code: [modelCode, layoutCode, compCode]
				};
			},
			dataId: function () {
				var layoutTemplate = {
					label: 'Label of Cell',
					dataId: 'valueOther'
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'form-cell-data-id',
					title: 'Data ID',
					desc: <span>Layout generator use the key of cell layout to match the data property, and key cannot be duplicated.
				 But in some scenarios, one data property should be renderred in different part in same UI.
				 So <code>dataId</code> is introduced into cell layout declaration.
				 Data matcher will use value of <code>dataId</code> to match the data property if it is declared.<br/>
				 In the following example, text is binding with <code>valueOther</code>, not <code>value</code>.</span>,
					index: 100,
					xml: {
						width: 12,
						xml: <NFormCell model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>
					},
					code: [modelCode, layoutCode, compCode]
				};
			},
			base: function () {
				var layoutTemplate = {
					label: 'Overwrite Label',
					base: {
						label: 'Label of Cell',
						comp: {
							type: $pt.ComponentConstants.Check
						}
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'form-cell-base',
					title: 'Base',
					desc: <span><code>base</code> provides the possibility to declare common components in other places.
				Every attributes declared in cell layout also can be declared in base JSON.
				Layout generator will use the base JSON as basic declaration.
				If the same attribute also declared in cell layout, use values in cell layout.</span>,
					index: 110,
					xml: {
						width: 12,
						xml: <NFormCell model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>
					},
					code: [modelCode, layoutCode, compCode]
				};
			},
			constants: function () {
				return {
					id: 'form-cell-constants',
					title: 'Constants',
					desc: 'Available constants. Constants must be change before construct component.',
					index: 900,
					code: $demo.convertJSON({
						variable: 'NFormCell',
						json: {
							statics: {
								REQUIRED_ICON: NFormCell.REQUIRED_ICON,
								TOOLTIP_ICON: NFormCell.TOOLTIP_ICON,
								LABEL_WIDTH: NFormCell.LABEL_WIDTH
							}
						}
					})
				};
			},
			css: function () {
				return $demo.convertCSSJSONToExample({
					id: 'form-cell-css',
					index: 1000,
					css: {
						cell: 'your-class-name'
					}
				});
			},
			register: function () {
				var layoutTemplate = {
					label: 'Label Of Cell',
					comp: {
						type: {
							render: function (model, layout, direction, viewMode) {
								// return <span>Customized Component with direction={direction}</span>
								return <span>Customized Component with direction={direction}</span>;
							}
						}
					},
					pos: {
						width: 12
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'form-cell-register',
					title: 'Register',
					desc: [<span>
						Customize Form component is allowed by following:<br/>
						1: Declare as <code>comp: {'\u007B'}type: {'\u007B'}render: function{'\u007D\u007D'}</code>,
						It's temporary mode, when the customized component only use in current page.<br/>
						2. Register via static function of NFormCell, <code>$pt.LayoutHelper.registerComponentRenderer(type,
						function);</code>
						Type is a string such as 'new-one', then in cell layout JSON, type can be used as
						<code>comp: {'\u007B'}type: 'new-one'{'\u007D'}</code>,
						then NFromCell will use the registered function to render component.<br/>
						Function above accepts three parameters as below:<br/>
						1. model: form model,<br/>
						2. layout: cell layout, which needs to be accepted by customized component,<br/>
						3. direction: label direction, <code>vertical</code> or <code>horizontal</code>.<br/>
						4. viewMode: the component is shown on view mode or not.
					</span>, <br/>,
						<span>Here is a sample in registration mode one.</span>],
					xml: <NFormCell model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 1100
				};
			}
		};
		return $demo.convertToExampleList(all);
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.formCell = function () {
		React.render(<ExampleList title='Form Cell'
		                          items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));
