(function (context, $) {
	var $demo = $pt.getService(context, '$demo');


	var painter = function () {
		var modelTemplate = {
			premium: 1000,
			amount: 2000
		};
		var model = $pt.createModel(modelTemplate);
		var modelCode = $demo.convertModelCreatorToString({
			variable: 'model',
			template: modelTemplate
		});
		var compCode = $demo.convertComponentCreatorToString({
			tag: 'NFormTab',
			model: 'model',
			layout: 'layout'
		});

		var all = {
			defaultOptions: function () {
				var layoutTemplate = {
					comp: {
						tabType: 'tab',
						justified: false,
						titleDirection: 'horizontal',
						titleIconSize: '2x',
						canActive: function (newTabValue, newTabIndex, currentTabValue, currentTabIndex) {
							return true;
						},
						onActive: function (currentTabValue, currentTabIndex) {
							// do something
						},
						tabs: [
							{
								label: 'Tab One',
								icon: 'ban',
								badgeId: 'premium',
								editLayout: {
									name: {
										label: 'Name'
									},
									premium: {
										label: 'Premium'
									}
								}
							},
							{
								label: 'Tab Two',
								icon: 'money',
								badgeId: 'amount',
								badgeRender: function (value, model) {
									return (value + '').currencyFormat();
								},
								editLayout: {
									code: {
										label: 'Code'
									},
									amount: {
										label: 'Amount'
									}
								}
							}, {
								label: 'Tab Three',
								icon: 'circle-o',
								editLayout: {
									another: {
										label: 'Another',
										comp: {
											type: $pt.ComponentConstants.Check
										}
									}
								}
							}
						]
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'form-tab-default',
					title: 'Default',
					desc: ['Form Tab is wrapper of normal tab, and makes tab contents as forms.',
						'Because of above, the attribute of cell layout JSON is very similar with normal tab.',
						<span>
					Attributes not list in the following example is not supported.<br/>
					<code>badgeId</code> and <code>badgeRender</code> is additional, same as cards in Form.
					<code>badgeId</code> is monitored by component.
				</span>,
						<span>
					There is a property named <code>tabClassName</code> in normal tab,
					will use the CSS value <code>tabs</code> in form tab.
				</span>],
					xml: {
						width: 12,
						xml: <NFormTab model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 10
				};
			},
			css: function () {
				return $demo.convertCSSJSONToExample({
					id: 'form-tab-css',
					index: 20,
					css: {
						comp: 'your-class-name',
						tabs: 'your-class-name'
					}
				});
			}
		};
		return $demo.convertToExampleList(all);
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.formTab = function () {
		React.render(<ExampleList title='Form Tab'
		                          formType='$pt.ComponentConstants.Tab'
		                          items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));