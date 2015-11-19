(function (context, $) {
	var $demo = $pt.getService(context, '$demo');

	var painter = function () {
		var modelTemplate = {
			items: [
				{premium: 1000, owner: 'Jack'},
				{premium: 2000, owner: 'Mary'}
			]
		};
		var model = $pt.createModel(modelTemplate);
		var modelCode = $demo.convertModelCreatorToString({
			variable: 'model',
			template: modelTemplate
		});
		var compCode = $demo.convertComponentCreatorToString({
			tag: 'NArrayPanel',
			model: 'model',
			layout: 'layout'
		});

		var all = {
			defaultOptions: function () {
				var layoutTemplate = {
					label: 'Any',
					comp: {
						itemTitle: 'Any Title',
						expanded: false,
						collapsible: true,
						expandedLabel: {
							depends: 'owner',
							when: function (item) {
								return 'Expanded, ' + item.get('owner');
							}
						},
						collapsedLabel: {
							depends: 'owner',
							when: function (item) {
								return 'Collapsed, ' + item.get('owner');
							}
						},
						checkInTitle: {
							data: 'enabled',
							label: 'Y/N?',
							collapsible: 'reverse'
						},
						editLayout: function (item) {
							var basic = {
								owner: {
									label: 'Owner',
									pos: {
										row: 10
									}
								},
								premium: {
									label: 'Premium',
									pos: {
										row: 10
									}
								}
							};
							var items = this.getModel().get('items');
							return items.indexOf(item.getCurrentModel()) == 0 ? $.extend(true, {}, basic, {
								another: {
									label: 'Enabled',
									comp: {type: $pt.ComponentConstants.Check},
									pos: {row: 20}
								}
							}) : $.extend(true, {}, basic, {
								comments: {
									label: 'Comments',
									comp: {type: $pt.ComponentConstants.TextArea},
									pos: {row: 20, width: 12}
								}
							});
						}
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'items',
					template: layoutTemplate
				});
				return {
					id: 'form-array-panel-default',
					title: 'Default',
					desc: ['Form Array Panel is a wrapper for deal with the array data.',
						'All attributes are same as Form Panel, but be careful with the follows:',
						<span><code>itemTitle</code>, can be plain text or JSON with <code>depends</code> and <code>when</code>.</span>,
						<span><code>editLayout</code>, <code>itemTitle</code>, <code>expandedLabel</code> and <code>collapsedLabel</code> are all monitor the item model of array, not form model.</span>],
					xml: {
						width: 12,
						xml: <NArrayPanel model={model} layout={$pt.createCellLayout('items', layoutTemplate)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 10
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
	renderer.formArrayPanel = function () {
		React.render(<ExampleList title='Form Array Panel'
		                          formType='$pt.ComponentConstants.ArrayPanel'
		                          items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));
