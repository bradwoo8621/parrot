(function (context, $) {
	var $demo = $pt.getService(context, '$demo');


	var painter = function () {
		var modelTemplate = {
			items: [
				{name: 'Jack', salary: 900},
				{name: 'Mary', salary: 1000}
			]
		};
		var model = $pt.createModel(modelTemplate);
		var modelCode = $demo.convertModelCreatorToString({
			variable: 'model',
			template: modelTemplate
		});
		var compCode = $demo.convertComponentCreatorToString({
			tag: 'NTable',
			model: 'model',
			layout: 'layout'
		});
		var layoutTemplate = {
			label: 'Items',
			comp: {
				columns: [
					{
						title: 'Name',
						data: 'name'
					}, {
						title: 'Salary',
						data: 'salary'
					}
				]
			}
		};

		var sort = {
			disable: function () {
				var layout = $.extend(true, {}, layoutTemplate, {comp: {sortable: false}});
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layout
				});
				return {
					id: 'table-sort-disable',
					title: 'Disable',
					desc: 'Sorter can be disabled.',
					xml: {
						width: 12,
						xml: <NTable model={model} layout={$pt.createCellLayout('items', layout)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 10
				};
			},
			column: function () {
				var layout = $.extend(true, {}, layoutTemplate, {
					comp: {
						sortable: false,
						columns: [
							{
								title: 'Name',
								data: 'name',
								sort: true
							}, {
								title: 'Salary',
								data: 'salary'
							}
						]
					}
				});
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layout
				});
				var layout2 = $.extend(true, {}, layoutTemplate, {
					comp: {
						columns: [
							{
								title: 'Name',
								data: 'name',
								sort: false
							}, {
								title: 'Salary',
								data: 'salary'
							}
						]
					}
				});
				var layoutCode2 = $demo.convertCellLayoutCreatorToString({
					variable: 'layout2',
					cellKey: 'value',
					template: layout2
				});
				var compCode2 = $demo.convertComponentCreatorToString({
					tag: 'NTable',
					model: 'model',
					layout: 'layout2'
				});
				return {
					id: 'table-sort-column',
					title: 'Column',
					desc: 'Sorter can be enabled or disabled on column level.',
					xml: [{
						width: 12,
						xml: <NTable model={model} layout={$pt.createCellLayout('items', layout)}/>
					}, {
						width: 12,
						xml: <NTable model={model} layout={$pt.createCellLayout('items', layout2)}/>
					}],
					code: [modelCode, layoutCode, layoutCode2, compCode, compCode2],
					index: 20
				};
			},
			number: function () {
				var layout = $.extend(true, {}, layoutTemplate, {
					comp: {
						columns: [
							{
								title: 'Name',
								data: 'name'
							}, {
								title: 'Salary',
								data: 'salary',
								sort: 'number'
							}
						]
					}
				});
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layout
				});
				return {
					id: 'table-sort-number',
					title: 'Number',
					desc: 'Sort by number.',
					xml: {
						width: 12,
						xml: <NTable model={model} layout={$pt.createCellLayout('items', layout)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 30
				};
			},
			function: function () {
				var layout = $.extend(true, {}, layoutTemplate, {
					comp: {
						columns: [
							{
								title: 'Name',
								data: 'name',
								sort: function (row1, row2) {
									return -1 * row1.name.localeCompare(row2.name);
								}
							}, {
								title: 'Salary',
								data: 'salary'
							}
						]
					}
				});
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layout
				});
				return {
					id: 'table-sort-function',
					title: 'Function',
					desc: <span>Column sorter can be a function.<br/>
					In the following example, name sort is reversed by appointed sort function.
					</span>,
					xml: {
						width: 12,
						xml: <NTable model={model} layout={$pt.createCellLayout('items', layout)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 40
				};
			},
			table: function () {
				var layout = $.extend(true, {}, layoutTemplate, {
					comp: {
						sorter: function (sort) {
							console.log(sort);
							if (sort.data) {
								sort.data.sort(function (row1, row2) {
									return row1.name.localeCompare(row2.name);
								});
							}
						}
					}
				});
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layout
				});
				return {
					id: 'table-sort-table',
					title: 'Function In Table Level',
					desc: <span>Sorter function can be defined in table level, then the column level sorter will be skipped.<br/>
					In the following example, sort by name anyway. See Console for more information of parameter of sorter function.<br/>
					Use this function to sort anyway, including remote sorting.</span>,
					xml: {
						width: 12,
						xml: <NTable model={model} layout={$pt.createCellLayout('items', layout)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 50
				};
			}
		};

		var edit = {
			remove: function () {
				var layout = $.extend(true, {}, layoutTemplate, {comp: {removable: true}});
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layout
				});
				return {
					id: 'table-edit-remove',
					title: 'Row Remove',
					desc: <span>Row of table can be removable.</span>,
					xml: {
						width: 12,
						xml: <NTable model={model} layout={$pt.createCellLayout('items', layout)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 10
				};
			},
			canRemove: function () {
				var layout = $.extend(true, {}, layoutTemplate, {
					comp: {
						removable: true,
						canRemove: function (model, row) {
							console.log(model);
							console.log(row);
							return false;
						}
					}
				});
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layout
				});
				return {
					id: 'table-edit-remove-can',
					title: 'Can Remove',
					desc: <span>Row of table can be removable. Removing can be stopped by return false by <code>canRemove</code>.</span>,
					xml: {
						width: 12,
						xml: <NTable model={model} layout={$pt.createCellLayout('items', layout)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 20
				};
			},
			edit: function () {
				var layout = $.extend(true, {}, layoutTemplate, {
					comp: {
						editable: true,
						editLayout: {
							name: {
								label: 'Name',
								pos: {
									width: 6
								}
							},
							salary: {
								label: 'Salary',
								pos: {
									width: 6
								}
							}
						}
					}
				});
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layout
				});
				return {
					id: 'table-edit-edit',
					title: 'Default Row Edit',
					desc: <span>Row of table can be editable.</span>,
					xml: {
						width: 12,
						xml: <NTable model={model} layout={$pt.createCellLayout('items', layout)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 30
				};
			},
			editSave: function () {
				var layout = $.extend(true, {}, layoutTemplate, {
					comp: {
						editable: true,
						onEditSave: function (rowModel, dialog) {
							console.log(rowModel);
							return (rowModel.get('salary') * 1) <= 4000;
						},
						editLayout: {
							name: {
								label: 'Name',
								pos: {
									width: 6
								}
							},
							salary: {
								label: 'Salary',
								pos: {
									width: 6
								}
							}
						}
					}
				});
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layout
				});
				return {
					id: 'table-edit-editSave',
					title: <span>On Edit Save</span>,
					desc: <span>Handle the editing save.<br/>
					In the following example, forbidden the save operation if salary is more than 4,000.</span>,
					xml: {
						width: 12,
						xml: <NTable model={model} layout={$pt.createCellLayout('items', layout)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 35
				};
			},
			editClick: function () {
				var layout = $.extend(true, {}, layoutTemplate, {
					comp: {
						editable: true,
						editClick: function (model, rowModel, layout) {
							console.log(model);
							console.log(rowModel),
								console.log(layout);
							alert('Catch the edit click.');
						},
						editLayout: {
							name: {
								label: 'Name',
								pos: {
									width: 6
								}
							},
							salary: {
								label: 'Salary',
								pos: {
									width: 6
								}
							}
						}
					}
				});
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layout
				});
				return {
					id: 'table-edit-editClick',
					title: 'Custom Row Edit',
					desc: <span>Row of table can be editable. Row editing handler can be customized as a function. See console for more information of paramters.</span>,
					xml: {
						width: 12,
						xml: <NTable model={model} layout={$pt.createCellLayout('items', layout)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 40
				};
			},
			add: function () {
				var layout = $.extend(true, {}, layoutTemplate, {
					comp: {
						addable: true,
						editLayout: {
							name: {
								label: 'Name',
								pos: {
									width: 6
								}
							},
							salary: {
								label: 'Salary',
								pos: {
									width: 6
								}
							}
						}
					}
				});
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layout
				});
				return {
					id: 'table-edit-add',
					title: 'Default Row Add',
					desc: <span>Row of table can be addable.</span>,
					xml: {
						width: 12,
						xml: <NTable model={model} layout={$pt.createCellLayout('items', layout)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 50
				};
			},
			addSave: function () {
				var layout = $.extend(true, {}, layoutTemplate, {
					comp: {
						addable: true,
						onAddSave: function (rowModel, dialog) {
							console.log(rowModel);
							return (rowModel.get('salary') * 1) <= 4000;
						},
						editLayout: {
							name: {
								label: 'Name',
								pos: {
									width: 6
								}
							},
							salary: {
								label: 'Salary',
								pos: {
									width: 6
								}
							}
						}
					}
				});
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layout
				});
				return {
					id: 'table-edit-addSave',
					title: <span>On Add Save</span>,
					desc: <span>Handle the adding save.<br/>
					In the following example, forbidden the save operation if salary is more than 4,000.</span>,
					xml: {
						width: 12,
						xml: <NTable model={model} layout={$pt.createCellLayout('items', layout)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 55
				};
			},
			addClick: function () {
				var layout = $.extend(true, {}, layoutTemplate, {
					comp: {
						addable: true,
						addClick: function (model, rowModel, layout) {
							console.log(model);
							console.log(rowModel),
								console.log(layout);
							alert('Catch the add click.');
						},
						editLayout: {
							name: {
								label: 'Name',
								pos: {
									width: 6
								}
							},
							salary: {
								label: 'Salary',
								pos: {
									width: 6
								}
							}
						}
					}
				});
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layout
				});
				return {
					id: 'table-edit-addClick',
					title: 'Custom Row Add',
					desc: <span>Row of table can be addable. Row adding handler can be customized as a function. See console for more information of paramters.</span>,
					xml: {
						width: 12,
						xml: <NTable model={model} layout={$pt.createCellLayout('items', layout)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 60
				};
			},
			rowOperation: function () {
				var layout = $.extend(true, {}, layoutTemplate, {
					comp: {
						rowOperations: [
							{
								icon: 'ban',
								click: function (row) {
									console.log(row);
									alert('BAN clicked');
								}
							}, {
								icon: 'search',
								click: function (row) {
									console.log(row);
									alert('SEARCH clicked');
								}
							}
						]
					}
				});
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layout
				});
				return {
					id: 'table-edit-custom',
					title: <span>Custom Operations</span>,
					desc: <span>Customized operations can be plugged in to row.<br/>
					See console for more information of paramters.</span>,
					xml: {
						width: 12,
						xml: <NTable model={model} layout={$pt.createCellLayout('items', layout)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 70
				};
			},
			maxRowButton: function () {
				var layout = $.extend(true, {}, layoutTemplate, {
					comp: {
						maxOperationButtonCount: 1,
						rowOperations: [
							{
								icon: 'ban',
								click: function (row) {
									console.log(row);
									alert('BAN clicked');
								}
							}, {
								icon: 'search',
								click: function (row) {
									console.log(row);
									alert('SEARCH clicked');
								}
							}
						]
					}
				});
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layout
				});
				return {
					id: 'table-edit-maxRowButton',
					title: <span>Max Row Buttons</span>,
					desc: <span>Set <code>maxOperationButtonCount</code> to fix row operation buttons,
					more operation button automatically added and show more operation buttons in popover.<br/>
					If there is any button declared with no <code>icon</code>, then popover will be renderred as menu style.
					Or force to render as menu style by set <code>moreAsMenu</code> to true.</span>,
					xml: {
						width: 12,
						xml: <NTable model={model} layout={$pt.createCellLayout('items', layout)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 75
				};
			},
			buttonEnabled: function () {
				var layout = $.extend(true, {}, layoutTemplate, {
					comp: {
						rowOperations: [
							{
								icon: 'ban',
								click: function (row) {
									console.log(row);
									alert('BAN clicked');
								},
								enabled: {
									depends: 'name',
									when: function(model) {
										return model.get('name') == 'Jack';
									}
								}
							}, {
								icon: 'search',
								click: function (row) {
									console.log(row);
									alert('SEARCH clicked');
								}
							}
						]
					}
				});
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layout
				});
				return {
					id: 'table-edit-buttonEnabled',
					title: <span>Button Enabled</span>,
					desc: <span>Define <code>enabled</code> in rowOperations to monitor property value to change button enabled.
					Default button edit and remove can be set by <code>rowEditEnabled</code> and <code>rowRemoveEnabled</code>.</span>,
					xml: {
						width: 12,
						xml: <NTable model={model} layout={$pt.createCellLayout('items', layout)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 76
				};
			},
			rowSelect: function () {
				var layout = $.extend(true, {}, layoutTemplate, {
					comp: {
						rowSelectable: 'selected'
					}
				});
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layout
				});
				return {
					id: 'table-edit-rowSelect',
					title: <span>Row Selection</span>,
					desc: <span>A column of row selection can be enabled by set <code>rowSelectable</code>,
						it should be a property name of row data JSON.</span>,
					xml: {
						width: 12,
						xml: <NTable model={model} layout={$pt.createCellLayout('items', layout)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 80
				};
			},
			dialogButtons: function () {
				var layout = $.extend(true, {}, layoutTemplate, {
					comp: {
						editable: true,
						addable: true,
						dialogResetVisible: true,
						dialogValidateVisible: true,
						editLayout: {
							name: {
								label: 'Name',
								pos: {
									width: 6
								}
							},
							salary: {
								label: 'Salary',
								pos: {
									width: 6
								}
							}
						}
					}
				});
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layout
				});
				return {
					id: 'table-edit-dialogButtons',
					title: 'Dialog Buttons',
					desc: <span>Default buttons reset and validate can be enabled.</span>,
					xml: {
						width: 12,
						xml: <NTable model={model} layout={$pt.createCellLayout('items', layout)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 90
				};
			},
			inline: function () {
				var Gender = $pt.createCodeTable([{id: 'F', text: 'Female'}, {id: 'M', text: 'Male'}]);
				Gender.name('gender');
				var layout = $.extend(true, {}, layoutTemplate, {
					comp: {
						scrollY: 200,
			            columns: [{
			                title: 'Name',
			                data: 'name',
			                inline: 'text',
			                width: 150
			            }, {
			                title: 'Code',
			                data: 'code',
			                width: 150,
			                inline: {
			                    inlineType: 'cell',
			                    comp: {
			                        type: {type: $pt.ComponentConstants.Text, label: false}
			                    }
			                }
			            }, {
			                data: 'gender',
			                title: 'Gender',
			                codes: Gender,
			                inline: 'select',
			                width: 150
			            }, {
			                // data: 'object_age',
			                title: 'Age',
			                width: 150,
							inline: {
								'object_age': {
									comp: {
										type: {type: $pt.ComponentConstants.Text, label: false},
										placeholder: 'Age'
									},
									pos: {
										width: 6
									}
								},
								'object_lunarAge': {
									comp: {
										type: {type: $pt.ComponentConstants.Text, label: false},
										placeholder: 'Lunar Age'
									},
									pos: {
										width: 6
									}
								}
							}
			            }, {
			                title: 'Selected',
			                data: 'selected',
			                inline: 'check',
			                width: 150
			            }, {
			                data: 'gender',
			                title: 'Radio',
			                codes: Gender,
			                inline: 'radio',
			                width: 300
			            }, {
			                data: 'birth',
			                title: 'Date of Birth',
			                inline: 'date',
			                width: 200
			            }]
					},
			        css: {
			            comp: 'inline-editor'
			        }
				});
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layout
				});
				return {
					id: 'table-edit-inline',
					title: 'Inline Editor',
					desc: <span>Inline editor:<br/>
					1. Pre-defined: There are 5 pre-defined inline editors. <code>text</code>, <code>select</code>, <code>radio</code>, <code>check</code> and <code>date</code>.
					<code>data</code> property of column should be used as data id for cell, and <code>codes</code> used as data options for <code>select</code> and <code>radio</code><br/>
					Or register more via <code>NTable.registerInlineEditor(type: string, def: JSON);</code>, <code>def</code> is cell layout format.<br/>
					2. Cell Layout: Simply use cell layout JSON, such as <code>inline: {"{}"}</code>. Note in JSON object, <code>inlineType: 'cell'</code> is necessary,
					or the JSON object will be treated as option 3.<br/>
					3. Form Layout: Use form layout JSON, take care of the CSS, it's very important. Form CSS class name can be defined via additional property <code>__className</code> in JSON.<br/>
					4. User <code>rowListener</code> to monitor change of row model. Pattern of <code>rowListener</code> is JSON or an array of JSON, each object format as below,<br/>
					4.1 id: string. Property id of row model.<br/>
					4.2 time: string. Event time, see ModelInterface.<br/>
					4.3 type: string. Event type, see ModelInterface.<br/>
					4.4 listener: function(evt). Event listener, see ModelInterface.<br/>
					<span className='text-danger'>Note: <br/>
					1. NEVER try to wrap lines in cell, if need, customized your own component, DONOT use Table.<br/>
					2. NEVER forget the set comp CSS as <code>inline-editor</code> for Table which has inline editor.</span>
					</span>,
					xml: {
						width: 12,
						xml: <NTable model={model} layout={$pt.createCellLayout('items', layout)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 100
				};
			}
		};

		var scroll = {
			y: function () {
				var modelTemplate = {
					items: [
						{name: 'Jack', salary: 900},
						{name: 'Mary', salary: 1000},
						{name: 'Alice', salary: 1100},
						{name: 'Tom', salary: 1000},
						{name: 'Taylor', salary: 1000},
						{name: 'Raymond', salary: 1000},
						{name: 'Sandy', salary: 1000},
						{name: 'Nadia', salary: 1000},
						{name: 'Whitley', salary: 1000}
					]
				};
				var model = $pt.createModel(modelTemplate);
				var layout = $.extend(true, {}, layoutTemplate, {
					comp: {
						scrollY: 200,
						columns: [
							{
								title: 'Name',
								data: 'name',
								width: 300
							}, {
								title: 'Salary',
								data: 'salary',
								width: 200
							}
						]
					}
				});
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layout
				});
				var modelCode = $demo.convertModelCreatorToString({
					variable: 'model',
					template: modelTemplate
				});
				return {
					id: 'table-style-scroll-y',
					title: 'Y Axis',
					desc: <span>Y axis scroll bar can be enabled by set height via <code>scrollY</code>.<br/>
					<code>scrollX</code> will be enabled by <code>scrollY</code>, see X Axis for more information.</span>,
					xml: {
						width: 12,
						xml: <NTable model={model} layout={$pt.createCellLayout('items', layout)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 10
				};
			},
			x: function () {
				var layout = $.extend(true, {}, layoutTemplate, {
					comp: {
						scrollX: true,
						columns: [
							{
								title: 'Name',
								data: 'name',
								width: 300
							}, {
								title: 'Salary',
								data: 'salary',
								width: 200
							}, {
								title: 'Gender',
								data: 'gender',
								width: 100
							}, {
								title: 'Date of Birth',
								data: 'dob',
								width: 200
							}, {
								title: 'Age',
								data: 'age',
								width: 200
							}
						]
					}
				});
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layout
				});
				return {
					id: 'table-style-scroll-x',
					title: 'X Axis',
					desc: <span>X axis scroll bar can be enabled by set height via <code>scrollX</code>.<br/>
					Width of columns are required when enable scroll X.<br/>
					Be careful to choose the width of columns, it's always a right choice to fill/over whole content of table, not just like the example.</span>,
					xml: {
						width: 12,
						xml: <NTable model={model} layout={$pt.createCellLayout('items', layout)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 20
				};
			},
			fixLeft: function () {
				var layout = $.extend(true, {}, layoutTemplate, {
					comp: {
						scrollX: true,
						fixedLeftColumns: 1,
						columns: [
							{
								title: 'Name',
								data: 'name',
								width: 300
							}, {
								title: 'Salary',
								data: 'salary',
								width: 200
							}, {
								title: 'Gender',
								data: 'gender',
								width: 100
							}, {
								title: 'Date of Birth',
								data: 'dob',
								width: 200
							}, {
								title: 'Age',
								data: 'age',
								width: 200
							}
						]
					}
				});
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layout
				});
				return {
					id: 'table-style-scroll-fix-left',
					title: 'Fix Left',
					desc: <span>Left columns can be fixed by set <code>fixedLeftColumns</code>.<br/>
					<code>indexFixed</code>, <code>rowSelectFixed</code> also
					can be set as true to fix the index column and row selection column,
					and they will not be counted into <code>fixedLeftColumns</code>. Try it.</span>,
					xml: {
						width: 12,
						xml: <NTable model={model} layout={$pt.createCellLayout('items', layout)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 30
				};
			},
			fixRight: function () {
				var layout = $.extend(true, {}, layoutTemplate, {
					comp: {
						scrollX: true,
						fixedRightColumns: 1,
						columns: [
							{
								title: 'Name',
								data: 'name',
								width: 300
							}, {
								title: 'Salary',
								data: 'salary',
								width: 200
							}, {
								title: 'Gender',
								data: 'gender',
								width: 100
							}, {
								title: 'Date of Birth',
								data: 'dob',
								width: 200
							}, {
								title: 'Age',
								data: 'age',
								width: 200
							}
						]
					}
				});
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layout
				});
				return {
					id: 'table-style-scroll-fix-right',
					title: 'Fix Right',
					desc: <span>Right columns can be fixed by set <code>fixedRightColumns</code>.<br/>
					<code>operationFixed</code> also can be set as true to fix the operation buttons column,
					and it will not be counted into <code>fixedRightColumns</code>. Try it.</span>,
					xml: {
						width: 12,
						xml: <NTable model={model} layout={$pt.createCellLayout('items', layout)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 40
				};
			}
		}

		var style = {
			title: function () {
				var layout = $.extend(true, {}, layoutTemplate, {comp: {header: false}});
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layout
				});
				return {
					id: 'table-style-title',
					title: 'Title',
					desc: 'Hide title.',
					xml: {
						width: 12,
						xml: <NTable model={model} layout={$pt.createCellLayout('items', layout)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 10
				};
			},
			style: function () {
				var layout = $.extend(true, {}, layoutTemplate, {comp: {style: 'success'}});
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layout
				});
				return {
					id: 'table-style-stlye',
					title: 'Style',
					desc: 'Style.',
					xml: {
						width: 12,
						xml: <NTable model={model} layout={$pt.createCellLayout('items', layout)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 20
				};
			},
			collapsible: function () {
				var layout = $.extend(true, {}, layoutTemplate, {comp: {collapsible: true, expanded: false}});
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layout
				});
				return {
					id: 'table-style-collapisble',
					title: 'Collapsible',
					desc: 'An index column can be added in the left.',
					xml: {
						width: 12,
						xml: <NTable model={model} layout={$pt.createCellLayout('items', layout)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 30
				};
			},
			index: function () {
				var layout = $.extend(true, {}, layoutTemplate, {comp: {indexable: true}});
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layout
				});
				return {
					id: 'table-style-index',
					title: 'Index',
					desc: 'An index column can be added in the left.',
					xml: {
						width: 12,
						xml: <NTable model={model} layout={$pt.createCellLayout('items', layout)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 40
				};
			},
			scroll: function () {
				return {
					id: 'table-style-scroll',
					title: 'Scroll',
					desc: 'Table can be scrollable.',
					index: 50,
					children: $demo.convertToExampleList(scroll)
				}
			}
		};

		var pageModelTemplate = {
			items: [
				{name: 'Jack', salary: 900},
				{name: 'Mary', salary: 1000},
				{name: 'Alice', salary: 1100},
				{name: 'Tom', salary: 1000},
				{name: 'Taylor', salary: 1000},
				{name: 'Raymond', salary: 1000},
				{name: 'Sandy', salary: 1000},
				{name: 'Nadia', salary: 1000},
				{name: 'Whitley', salary: 1000}
			]
		};
		var pageModel = $pt.createModel(pageModelTemplate);
		var pageModelCode = $demo.convertModelCreatorToString({
			variable: 'model',
			template: pageModelTemplate
		});
		var page = {
			local: function () {
				var layout = $.extend(true, {}, layoutTemplate, {comp: {pageable: true, countPerPage: 5}});
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layout
				});
				return {
					id: 'table-page-local',
					title: 'Local',
					desc: <span>All data is in local (browser) side. Simply enable the <code>pageable</code> and <code>countPerPage</code>.</span>,
					xml: {
						width: 12,
						xml: <NTable model={pageModel} layout={$pt.createCellLayout('items', layout)}/>
					},
					code: [pageModelCode, layoutCode, compCode],
					index: 10
				};
			},
			remote: function () {
				return {
					id: 'table-page-remote',
					title: 'Remote',
					desc: <span>Data is from server side, it's complex and let's follow the steps as below:<br/>
					1. The data model of table has a property which named <code>items</code> to store the data array.
					Link to NTable component by cell layout definition.<br/>
					2. To invoke remote search by pagination buttons, define a <code>{"{comp: {criteria: 'temp'}}"}</code>,
					<code>temp</code> is the criteria object, also in data model of table.
					So far, the data model of table should be <code>{"{items: [], temp: {}}"}</code>.<br/>
					3. Define the initial status of pagination in <code>temp</code>, there are four properties:<br/>
					3.a <code>countPerPage</code>, row count of per page.
					In remote case, the cell layout attribute <code>countPerPage</code> will be skipped.<br/>
					3.b <code>pageIndex</code>, current page index, starts from 1,<br/>
					3.c <code>pageCount</code>, total page count, starts from 1,<br/>
					3.d <code>url</code>, url for handle the pagination request.
					The return data should be same pattern as data model,
					in this case, it should be <code>{"{items: [], temp: {}}"}</code>.
					For <code>temp</code>, only <code>pageIndex</code> and <code>pageCount</code> is necessary.<br/>
					<br/>
					Table will merge the returned data from server side to data model automatically, and refresh the display.<br/>
					And make sure only one page of data is returned from server side.<br/>
					</span>,
					index: 20
				};
			}
		};

		var render = {
			codes: function () {
				var gender = $pt.createCodeTable([{id: 'F', text: 'Female'}, {id: 'M', text: 'Male'}]);
				gender.name('gender');
				var modelTemplate = {
					items: [
						{name: 'Jack', salary: 900, gender: 'M'},
						{name: 'Mary', salary: 1000, gender: 'F'}
					]
				};
				var model = $pt.createModel(modelTemplate);
				var modelCode = $demo.convertModelCreatorToString({
					variable: 'model',
					template: modelTemplate
				});
				var layout = $.extend(true, {}, layoutTemplate, {
					comp: {
						columns: [
							{
								title: 'Name',
								data: 'name'
							}, {
								title: 'Salary',
								data: 'salary'
							}, {
								title: 'Gender',
								data: 'gender',
								codes: gender
							}
						]
					}
				});
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layout
				});
				return {
					id: 'table-render-codes',
					title: 'Code Table',
					desc: 'Text get from a code table.',
					xml: {
						width: 12,
						xml: <NTable model={model} layout={$pt.createCellLayout('items', layout)}/>
					},
					code: ["var gender = $pt.createCodeTable([{id: 'F', text: 'Female'}, {id: 'M', text: 'Male'}]);",
						modelCode, layoutCode, compCode],
					index: 10
				};
			},
			func: function () {
				var gender = $pt.createCodeTable([{id: 'F', text: 'Female'}, {id: 'M', text: 'Male'}]);
				var modelTemplate = {
					items: [
						{name: 'Jack', salary: 900, gender: 'M'},
						{name: 'Mary', salary: 1000, gender: 'F'}
					]
				};
				var model = $pt.createModel(modelTemplate);
				var modelCode = $demo.convertModelCreatorToString({
					variable: 'model',
					template: modelTemplate
				});
				var layout = $.extend(true, {}, layoutTemplate, {
					comp: {
						columns: [
							{
								title: 'Name',
								data: 'name'
							}, {
								title: 'Salary',
								data: 'salary'
							}, {
								title: 'Gender',
								render: function (row) {
									return gender.getText(row.gender);
								}
							}
						]
					}
				});
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layout
				});
				return {
					id: 'table-render-func',
					title: 'Function',
					desc: 'Text convert by a function.',
					xml: {
						width: 12,
						xml: <NTable model={model} layout={$pt.createCellLayout('items', layout)}/>
					},
					code: ["var gender = $pt.createCodeTable([{id: 'F', text: 'Female'}, {id: 'M', text: 'Male'}]);",
						modelCode, layoutCode, compCode],
					index: 20
				};
			}
		};

		var all = {
			defaultOptions: function () {
				var layout = layoutTemplate;
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layout
				});
				return {
					id: 'table-default',
					title: 'Default',
					desc: 'A simple table. Table is mapping the array table.',
					xml: {
						width: 12,
						xml: <NTable model={model} layout={$pt.createCellLayout('items', layout)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 10
				};
			},
			style: function () {
				return {
					id: 'table-style',
					title: 'Style',
					desc: 'Styles of table.',
					index: 20,
					children: $demo.convertToExampleList(style)
				};
			},
			sort: function () {
				return {
					id: 'table-sort',
					title: 'Sort',
					desc: 'Sorter can be controlled on table level or column level.',
					index: 50,
					children: $demo.convertToExampleList(sort)
				};
			},
			search: function () {
				var layout = $.extend(true, {}, layoutTemplate, {comp: {searchable: false}});
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layout
				});
				return {
					id: 'table-search',
					title: 'Search',
					desc: 'Search is designed to filter on local data since its a fuzzy search which only match the displaying text. And it can be disabled, default is enabled.',
					xml: {
						width: 12,
						xml: <NTable model={model} layout={$pt.createCellLayout('items', layout)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 60
				};
			},
			render: function () {
				return {
					id: 'table-render',
					title: 'Renderer',
					desc: 'Renderer for each columns can be defined.',
					index: 65,
					children: $demo.convertToExampleList(render)
				};
			},
			edit: function () {
				return {
					id: 'table-edit',
					title: 'Edit',
					desc: 'Data in table can be editable.',
					index: 70,
					children: $demo.convertToExampleList(edit)
				};
			},
			page: function () {
				return {
					id: 'table-page',
					title: 'Pagination',
					desc: 'Data in table can be pageable.',
					index: 80,
					children: $demo.convertToExampleList(page)
				};
			},
			constants: function () {
				var statics = {
					TOOLTIP_EDIT: NTable.TOOLTIP_EDIT,
					TOOLTIP_REMOVE: NTable.TOOLTIP_REMOVE,
					/**
					 * set operation button width
					 * @param width {number}
					 */
					setOperationButtonWidth: function (width) {
					},
					ADD_BUTTON_ICON: NTable.ADD_BUTTON_ICON,
					ADD_BUTTON_TEXT: NTable.ADD_BUTTON_TEXT,
					SEARCH_PLACE_HOLDER: NTable.SEARCH_PLACE_HOLDER,
					ROW_EDIT_BUTTON_ICON: NTable.ROW_EDIT_BUTTON_ICON,
					ROW_REMOVE_BUTTON_ICON: NTable.ROW_REMOVE_BUTTON_ICON,
					EDIT_DIALOG_SAVE_BUTTON_TEXT: NTable.EDIT_DIALOG_SAVE_BUTTON_TEXT,
					EDIT_DIALOG_SAVE_BUTTON_ICON: NTable.EDIT_DIALOG_SAVE_BUTTON_ICON,
					SORT_ICON: NTable.SORT_ICON,
					SORT_ASC_ICON: NTable.SORT_ASC_ICON,
					SORT_DESC_ICON: NTable.SORT_DESC_ICON,
					NO_DATA_LABEL: NTable.NO_DATA_LABEL,
					DETAIL_ERROR_MESSAGE: NTable.DETAIL_ERROR_MESSAGE,
					REMOVE_CONFIRM_TITLE: NTable.REMOVE_CONFIRM_TITLE,
					REMOVE_CONFIRM_MESSAGE: NTable.REMOVE_CONFIRM_MESSAGE,
					BOOLEAN_TRUE_DISPLAY_TEXT: NTable.BOOLEAN_TRUE_DISPLAY_TEXT,
					BOOLEAN_FALSE_DISPLAY_TEXT: NTable.BOOLEAN_FALSE_DISPLAY_TEXT,
					PAGE_JUMPING_PROXY: NTable.PAGE_JUMPING_PROXY
				};
				return {
					id: 'table-constants',
					title: 'Constants',
					desc: <span>Available constants. Constants must be change before construct component.<br/>
						<code>NTable.PAGE_JUMPING_PROXY</code> is a function which proxy the page jumping,
						before send criteria to remote, can set this proxy function to change the format of criteria JSON.
					</span>,
					index: 900,
					code: $demo.convertJSON({
						variable: 'NTable',
						json: {
							statics: statics
						}
					})
				};
			},
			css: function () {
				return $demo.convertCSSJSONToExample({
					id: 'table-css',
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
	renderer.formTable = function () {
		React.render(<ExampleList title='Form Table'
		                          formType='$pt.ComponentConstants.Table'
		                          items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));
