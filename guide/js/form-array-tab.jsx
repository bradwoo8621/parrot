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
			tag: 'NArrayTab',
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
						badge: 'premium',
						badgeRender: function (value, item, model) {
							return (value + '').currencyFormat();
						},
						itemIcon: {
							depends: 'owner',
							when: function (item) {
								var items = this.getModel().get('items');
								return items.indexOf(item.getCurrentModel()) == 0 ? 'usd' : 'cny'
							}
						},
						itemTitle: {
							depends: 'premium',
							when: function (item) {
								return item.get('owner');
							}
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
					id: 'form-array-tab-default',
					title: 'Default',
					desc: ['Form Array Tab is wrapper of normal tab to deal with the array data, and makes tab contents as forms.',
						'Because of above, the attribute of cell layout JSON is very similar with normal tab.',
						<span>
						Attributes not list in the following example is not supported.<br/>
						<code>badge</code> and <code>badgeRender</code> is additional, same as cards in Form.
						<code>badge</code> also can be declared as a JSON sames as <code>enabled</code>,
						in this situation, <code>badgeRender</code> is not necessary.
						Note it monitors the item of array, not form model of tab.
					</span>,
						<span>
						<code>itemTitle</code>, <code>itemIcon</code> can be a plain string,
						or likes <code>enabled</code>, is a JSON with <code>depends</code> and <code>when</code>.
						Which means it can monitor the given properties. see <code>enabled</code> in Form Cell.
						Note it monitors the item model, not form model of tab.
						Of course, form model and inner model can be got from this of <code>when</code> function.
					</span>,
						<span>
						<code>editLayout</code> can be JSON or function. Item model will be passed to function and returns a JSON.
						It makes even for an array, different layout for each tab is possible.
						If it is JSON, then same layout for every tab.
					</span>,
						<span>
						There is a property named <code>tabClassName</code> in normal tab,
						will use the CSS value <code>tabs</code> in form tab.
					</span>],
					xml: {
						width: 12,
						xml: <NArrayTab model={model} layout={$pt.createCellLayout('items', layoutTemplate)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 10
				};
			},
			addable: function() {
				return {
					id: 'form-array-tab-addable',
					title: 'Addable',
					desc: [<span>Let tab be addable by set <code>onAdd</code>,
						it is a function which be passed two parameters: current data model and current data value array.
						Add new item into array in this function.<br/>
						An add tab (cannot be active) should be renderred.</span>],
					index: 20
				};
			},
			constants: function () {
				return {
					id: 'form-array-tab-constants',
					title: 'Constants',
					desc: 'Available constants. Constants must be change before construct component.',
					index: 1000,
					code: $demo.convertJSON({
						variable: 'NArrayTab',
						json: {
							statics: {
								UNTITLED: NArrayTab.UNTITLED,
								ADD_ICON: NArrayTab.ADD_ICON,
								ADD_LABEL: NArrayTab.ADD_LABEL
							}
						}
					})
				};
			},
			css: function () {
				return $demo.convertCSSJSONToExample({
					id: 'form-array-tab-css',
					index: 2000,
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
	renderer.formArrayTab = function () {
		React.render(<ExampleList title='Form Array Tab'
		                          formType='$pt.ComponentConstants.ArrayTab'
		                          items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));
