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
			tag: 'NSelect',
			model: 'model',
			layout: 'layout'
		});
		var codes = $pt.createCodeTable([{id: 'F', text: 'Female'}, {id: 'M', text: 'Male'}]);
		var codesCode = $demo.convertCodeTableCreatorToString({variable: 'codes', codetable: codes});
		var childCodes = $pt.createCodeTable([
			{id: '1', text: 'Father', gender: 'M'},
			{id: '2', text: 'Uncle', gender: 'M'},
			{id: '3', text: 'Mother', gender: 'F'},
			{id: '4', text: 'Aunt', gender: 'F'}
		]);
		var childCodesCode = $demo.convertCodeTableCreatorToString({variable: 'childCodes', codetable: childCodes});

		var hierarchy = {
			local: function () {
				var parentLayoutTemplate = {
					comp: {
						data: codes
					}
				};
				var parentLayoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'parentLayout',
					cellKey: 'parent',
					template: parentLayoutTemplate
				});
				var parentCompCode = $demo.convertComponentCreatorToString({
					tag: 'NSelect',
					model: 'model',
					layout: 'parentLayout'
				});
				var childLayoutTemplate = {
					comp: {
						data: childCodes,
						parentPropId: 'parent',
						parentFilter: 'gender'
					}
				};
				var childLayoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'childLayout',
					cellKey: 'child',
					template: childLayoutTemplate
				});
				var childCompCode = $demo.convertComponentCreatorToString({
					tag: 'NSelect',
					model: 'model',
					layout: 'childLayout'
				});
				return {
					id: 'select-hierarchy-local',
					title: 'Local',
					desc: 'All code tables are in browser side',
					xml: [<NSelect model={model} layout={$pt.createCellLayout('parent', parentLayoutTemplate)}/>,
						<NSelect model={model} layout={$pt.createCellLayout('child', childLayoutTemplate)}/>],
					code: [codesCode, childCodesCode, modelCode, parentLayoutCode, childLayoutCode, parentCompCode, childCompCode],
					index: 10
				};
			},
			remote: function () {
				return {
					id: 'select-hierarchy-remote',
					title: 'Remote',
					desc: 'Remote code table is not implemented by this component, but supported via CodeTable itself.',
					index: 20
				}
			},
			other: function () {
				return {
					id: 'hierarchy-other',
					title: 'Other Properties',
					desc: 'There\'re are a set of properties, such as support monitor another data model.',
					code: 'var layout = {\n' +
					"\t// another model to monitor if declared, the parentPropId will point to this model.\n" +
					"\tparentModel: ModelInterface,\n" +
					"\t\n" +
					"\t// default is false. display all options when no parent value.\n" +
					"\t// consider of the performance issue, turn this option to true is not recommended.\n" +
					"\tavailableWhenNoParentValue: boolean,\n" +
					"\t\n" +
					"\t// string: property name in child code table. filter the code items by parent value.\n" +
					"\t// function: call this function to filter the options, parameters are parent value and child code table.\n" +
					"\t// object: {name: string}. name should be property name of child code table.\n" +
					"\t// \t\tWill call filter method of code table. local or remote depends on the code table definition.\n" +
					'\tparentFilter: string|function(parentValue, codetable)|JSON,\n' +
					'}',
					index: 30
				}
			}
		};
		var all = {
			defaultOptions: function () {
				var layoutTemplate = {
					comp: {
						data: codes
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'select-default',
					title: 'Default',
					desc: 'A simple select.',
					xml: <NSelect model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>,
					code: [codesCode, modelCode, layoutCode, compCode],
					index: 10
				};
			},
			hierarchy: function () {
				return {
					id: 'select-ierarchy',
					title: 'Hierarchy',
					desc: ['Hierarchy Selects',
						'Actually implementation of hierarchy selects are not monitor the component changing but the model changing. ' +
						'Which means the parent can be a text, a check box, or even not displayed in UI.' +
						'When the parent value in model was changed, the child select grab the changing and refresh the options.'],
					index: 20,
					children: $demo.convertToExampleList(hierarchy)
				}
			},
			properties: function () {
				return {
					id: 'select-properties',
					title: 'Properties',
					desc: ['Available properties.', 'Refers to Select2'],
					index: 30,
					code: $demo.convertJSON({
						variable: 'layout',
						json: {
							comp: {
								allowClear: null,
								minimumResultsForSearch: null
							}
						}
					})
				};
			},
			constants: function () {
				return {
					id: 'select-constants',
					title: 'Constants',
					desc: 'Available constants. Constants must be change before construct component.',
					index: 40,
					code: $demo.convertJSON({
						variable: 'NSelect',
						json: {
							statics: {
								PLACEHOLDER: NSelect.PLACEHOLDER,
								NO_OPTION_FOUND: 'No Option Found',
								FILTER_PLACEHOLDER: 'Search...'
							}
						}
					})
				};
			},
			css: function () {
				return $demo.convertCSSJSONToExample({
					id: 'select-css',
					index: 50,
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
	renderer.formSelect = function () {
		React.render(<ExampleList title='Form Select/DropDown'
		                          formType='$pt.ComponentConstants.Select'
		                          items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));
