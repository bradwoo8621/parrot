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
			tag: 'NPanel',
			model: 'model',
			layout: 'layout'
		});

		var check = {
			normal: function () {
				var layoutTemplate = {
					label: 'Panel Title',
					comp: {
						checkInTitle: {
							data: 'enabled'
						},
						editLayout: {
							name: {
								label: 'Name'
							}
						}
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'panel',
					template: layoutTemplate
				});
				return {
					id: 'form-panel-check-normal',
					title: 'In Title',
					desc: ['Panel with a check box in title.'],
					xml: [{
						width: 12,
						xml: <NPanel model={model} layout={$pt.createCellLayout('panel', layoutTemplate)}/>
					}],
					code: [modelCode, layoutCode, compCode],
					index: 10
				};
			},
			label: function () {
				var layoutTemplate = {
					label: 'Panel Title',
					comp: {
						checkInTitle: {
							data: 'enabled',
							label: 'Need Confirm?'
						},
						editLayout: {
							name: {
								label: 'Name'
							}
						}
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'panel',
					template: layoutTemplate
				});
				return {
					id: 'form-panel-check-label',
					title: 'Label',
					desc: ['A check box with label in title.'],
					xml: [{
						width: 12,
						xml: <NPanel model={model} layout={$pt.createCellLayout('panel', layoutTemplate)}/>
					}],
					code: [modelCode, layoutCode, compCode],
					index: 20
				};
			},
			collapsible: function () {
				var layoutTemplate = {
					label: 'Panel Title',
					comp: {
						checkInTitle: {
							data: 'enabled',
							label: 'Need Confirm?',
							collapsible: 'same'
						},
						editLayout: {
							name: {
								label: 'Name'
							}
						}
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'panel',
					template: layoutTemplate
				});
				return {
					id: 'form-panel-check-collapsible',
					title: 'Collapsible',
					desc: [<span>Check box control the collapsible.
					<code>same</code> means when the check box value is true, expand the panel.
					Or set as <code>reverse</code> to exchange. Can be used with or with no <code>collapsible</code>.</span>],
					xml: [{
						width: 12,
						xml: <NPanel model={model} layout={$pt.createCellLayout('panel', layoutTemplate)}/>
					}],
					code: [modelCode, layoutCode, compCode],
					index: 30
				};
			}
		};
		var all = {
			defaultOptions: function () {
				var layoutTemplate = {
					comp: {
						editLayout: {
							name: {
								label: 'Name'
							}
						}
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'panel',
					template: layoutTemplate
				});
				return {
					id: 'form-panel-default',
					title: 'Default',
					desc: <span>Panel use <code>editLayout</code> to render its inner content,
				<code>editLayout</code> is a JSON to describe the section layout,
				using <code>key : cell JSON</code>.</span>,
					xml: {
						width: 12,
						xml: <NPanel model={model} layout={$pt.createCellLayout('panel', layoutTemplate)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 10
				};
			},
			title: function () {
				var layoutTemplate = {
					label: 'Panel Title',
					comp: {
						editLayout: {
							name: {
								label: 'Name'
							}
						}
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'panel',
					template: layoutTemplate
				});
				var layoutTemplate2 = {
					label: 'Any',	// to enable the panel title
					comp: {
						collapsible: true,
						collapsedLabel: 'Collapsed',
						expandedLabel: 'Expanded',
						editLayout: {
							name: {
								label: 'Name'
							}
						}
					}
				};
				var layoutCode2 = $demo.convertCellLayoutCreatorToString({
					variable: 'layout2',
					cellKey: 'panel2',
					template: layoutTemplate2
				});
				var compCode2 = $demo.convertComponentCreatorToString({
					tag: 'NPanel',
					model: 'model',
					layout: 'layout2'
				});
				var layoutTemplate3 = {
					label: 'Any',	// to enable the panel title
					comp: {
						collapsible: true,
						collapsedLabel: {
							depends: 'name',
							when: function (model) {
								return 'Collapsed ' + model.get('name');
							}
						},
						expandedLabel: {
							depends: 'name',
							when: function (model) {
								return 'Expanded ' + model.get('name');
							}
						},
						editLayout: {
							name: {
								label: 'Name'
							}
						}
					}
				};
				var layoutCode3 = $demo.convertCellLayoutCreatorToString({
					variable: 'layout3',
					cellKey: 'panel3',
					template: layoutTemplate3
				});
				var compCode3 = $demo.convertComponentCreatorToString({
					tag: 'NPanel',
					model: 'model',
					layout: 'layout3'
				});
				return {
					id: 'form-panel-label',
					title: 'Label',
					desc: ['Label used as title of panel.',
						<span>Or control title by <code>expandedLabel</code> and <code>collapsedLabel</code>.<br/>
				Use these features must set something in <code>label</code>, to enable the panel title.<br/>
				Use <code>collapsedLabel</code> must true <code>collapsible</code> .</span>,
						<span>
					<code>expandedLabel</code> and <code>collapsedLabel</code> also can be declared as <code>enabled</code> (see Form Cell),
					contains <code>depends</code> and <code>when</code>.
				</span>],
					xml: [{
						width: 12,
						xml: <NPanel model={model} layout={$pt.createCellLayout('panel', layoutTemplate)}/>
					},
						{
							width: 12,
							xml: <NPanel model={model} layout={$pt.createCellLayout('panel', layoutTemplate2)}/>
						},
						{
							width: 12,
							xml: <NPanel model={model} layout={$pt.createCellLayout('panel', layoutTemplate3)}/>
						}],
					code: [modelCode, layoutCode, layoutCode2, layoutCode3, compCode, compCode2, compCode3],
					index: 20
				};
			},
			style: function () {
				var layoutTemplate = {
					label: 'Panel Title',
					comp: {
						style: 'success',
						editLayout: {
							name: {
								label: 'Name'
							}
						}
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'panel',
					template: layoutTemplate
				});
				return {
					id: 'form-panel-style',
					title: 'Style',
					desc: ['Panel with style.',
						<span>Style can be <code>default</code>, <code>primary</code>, <code>success</code>, <code>info</code>, <code>warning</code>, <code>danger</code>.</span>,
						'Or any customized style name, refer to Bootstrap panel styles.'],
					xml: [{
						width: 12,
						xml: <NPanel model={model} layout={$pt.createCellLayout('panel', layoutTemplate)}/>
					}],
					code: [modelCode, layoutCode, compCode],
					index: 30
				};
			},
			expand: function () {
				var layoutTemplate = {
					label: 'Panel Title',
					comp: {
						collapsible: true,
						expanded: false,
						editLayout: {
							name: {
								label: 'Name'
							}
						}
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'panel',
					template: layoutTemplate
				});
				return {
					id: 'form-panel-expand',
					title: 'Expand',
					desc: ['Panel with initial expanded.'],
					xml: [{
						width: 12,
						xml: <NPanel model={model} layout={$pt.createCellLayout('panel', layoutTemplate)}/>
					}],
					code: [modelCode, layoutCode, compCode],
					index: 40
				};
			},
			check: function () {
				return {
					id: 'form-panel-check',
					title: 'Check',
					desc: 'A check box can be added into panel title.',
					index: 50,
					children: $demo.convertToExampleList(check)
				}
			},
			css: function () {
				return $demo.convertCSSJSONToExample({
					id: 'form-panel-css',
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
	renderer.formPanel = function () {
		React.render(<ExampleList title='Form Panel'
		                          formType='$pt.ComponentConstants.Panel'
		                          items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));