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
			tag: 'NSearchText',
			model: 'model',
			layout: 'layout'
		});

		var mockSearch = {
			url: "/test",
			response: function (settings) {
				var request = JSON.parse(settings.data);
				var code = request.code;
				this.responseText = {
					code: code,
					name: code.replace("code", "name")
				}
			}
		};
		$pt.mock(mockSearch);
		var mockAdvancedSearch = {
			url: "/test/query",
			response: function (settings) {
				var items = [];
				var request = JSON.parse(settings.data);
				if (request.pageIndex) {
					for (var index = 0; index < 10; index++) {
						items.push({
							code: "code" + (request.countPerPage * (request.pageIndex - 1) + index + 1),
							name: "name" + (request.countPerPage * (request.pageIndex - 1) + index + 1)
						});
					}
				} else {
					items = [{code: "code01", name: "name01"},
						{code: "code02", name: "name02"},
						{code: "code03", name: "name03"},
						{code: "code04", name: "name04"},
						{code: "code05", name: "name05"},
						{code: "code06", name: "name06"},
						{code: "code07", name: "name07"},
						{code: "code08", name: "name08"},
						{code: "code09", name: "name09"},
						{code: "code10", name: "name10"}
					];
				}
				this.responseText = {
					items: items,
					criteria: {
						pageIndex: request.pageIndex ? request.pageIndex : 1,
						pageCount: 5,
						countPerPage: 10,
						name: "abcde"
					}
				};
			}
		};
		$pt.mock(mockAdvancedSearch);

		var all = {
			defaultOptions: function () {
				var layoutTemplate = {
					comp: {
						searchTriggerDigits: 6,
						searchUrl: '/test',
						advancedUrl: '/test/query'
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'code-search-default',
					title: 'Default',
					desc: <span>A simple code search box.<br/>
					Set <code>labelPropId</code> to initial label value by data model,
					or send remote request to retrieve label by code value. <br/>
					Remote request may cause the performance issue in some scenarios, so set <code>labelPropId</code> is recommended.</span>,
					xml: {
						width: 6,
						xml: <NSearchText model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 10
				};
			},
			customize: function () {
				var layoutTemplate = {
					comp: {
						searchTriggerDigits: 6,
						searchUrl: '/test',
						searchDialogModel: {
							name: null,
							countPerPage: 10,
							pageIndex: 1,

							items: null,
							criteria: {
								pageIndex: 1,
								pageCount: 1,
								countPerPage: 10
							}
						},
						searchDialogLayout: function () {
							var _this = this;
							return {
								name: {
									label: 'Code',
									comp: {
										type: $pt.ComponentConstants.Text
									},
									pos: {
										row: 10,
										col: 10,
										width: 6
									}
								},
								button: {
									comp: {
										type: $pt.ComponentConstants.Button,
										icon: 'search',
										style: 'danger',
										click: function (model) {
											var currentModel = $.extend({}, model.getCurrentModel());
											delete currentModel.items;
											delete currentModel.criteria;

											$pt.doPost('/test/query', currentModel, {
												done: function (data) {
													if (typeof data === 'string') {
														data = JSON.parse(data);
													}
													model.mergeCurrentModel(data);
													model.set('criteria_url', '/test/query');
													console.debug(model.getCurrentModel());
													this.state.searchDialog.forceUpdate();
												}.bind(_this)
											});
										}
									},
									css: {
										comp: 'pull-right pull-down'
									},
									pos: {
										row: 10,
										col: 20,
										width: 6
									}
								},
								items: {
									label: NSearchText.ADVANCED_SEARCH_DIALOG_RESULT_TITLE,
									comp: {
										type: $pt.ComponentConstants.Table,
										indexable: true,
										searchable: false,
										rowOperations: {
											icon: "check",
											click: function (row) {
												_this.pickupAdvancedResultItem(row);
												_this.state.searchDialog.hide();
											}
										},
										pageable: true,
										criteria: "criteria",
										columns: [{
											title: 'Code',
											width: 200,
											data: "code"
										}, {
											title: 'Name',
											width: 400,
											data: "name"
										}]
									},
									pos: {
										row: 20,
										col: 10,
										width: 12
									}
								}
							};
						}
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'code-search-customize',
					title: 'Customize',
					desc: 'Search box with customized advanced search dialog.',
					xml: {
						width: 6,
						xml: <NSearchText model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 20
				};
			},
			constants: function () {
				return {
					id: 'code-search-constants',
					title: 'Constants',
					desc: 'Available constants. Constants must be change before construct component.',
					index: 30,
					code: $demo.convertJSON({
						variable: 'NSearchText',
						json: {
							statics: {
								ADVANCED_SEARCH_BUTTON_ICON: 'search',
								ADVANCED_SEARCH_DIALOG_NAME_LABEL: 'Name',
								ADVANCED_SEARCH_DIALOG_BUTTON_TEXT: 'Search',
								ADVANCED_SEARCH_DIALOG_CODE_LABEL: 'Code',
								ADVANCED_SEARCH_DIALOG_RESULT_TITLE: 'Search Result'
							}
						}
					})
				};
			},
			mock: function () {
				return $demo.convertMockJSONToExample({
					id: 'code-search-mock',
					index: 50,
					mock: [mockSearch, mockAdvancedSearch]
				});
			},
			css: function () {
				return $demo.convertCSSJSONToExample({
					id: 'code-search-css',
					index: 40,
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
	renderer.formCodeSearch = function () {
		React.render(<ExampleList title='Form Code Search'
		                          formType='$pt.ComponentConstants.Search'
		                          items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));
