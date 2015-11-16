(function (context, $) {
	var $demo = $pt.getService(context, '$demo');


	var painter = function () {
		var codes = $pt.createCodeTable([
			{
				id: 1,
				text: 'Languages',
				children: [
					{id: 2, text:'Java'},
					{id: 3, text:'C#'}
				]
			}, {
				id: 4,
				text: 'Costing',
				children: [
					{id: 5, text: '1,000'},
					{id: 6, text: '2,000'}
				]
			}, {
				id: 7,
				text: 'Others',
				folder: true
			}
		]);
		var codesCode = $demo.convertCodeTableCreatorToString({variable: 'codes', codetable: codes});
		var modelTemplate = {
			nodes: null
		};
		var model = $pt.createModel(modelTemplate);
		var modelCode = $demo.convertModelCreatorToString({
			variable: 'model',
			template: modelTemplate
		});
		var compCode = $demo.convertComponentCreatorToString({
			tag: 'NTree',
			model: 'model',
			layout: 'layout'
		});

		var style = {
			root: function () {
				var layoutTemplate = {comp: {root: false, data: codes}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'nodes',
					template: layoutTemplate
				});
				return {
					id: 'tree-style-root',
					title: 'Root',
					desc: 'Hide root node.',
					xml: <NTree model={model} layout={$pt.createCellLayout('nodes', layoutTemplate)}/>,
					code: [codesCode, modelCode, layoutCode, compCode],
					index: 10
				};
			},
			label: function () {
				var layoutTemplate = {comp: {root: "Informations", data: codes}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'nodes',
					template: layoutTemplate
				});
				return {
					id: 'tree-style-root-label',
					title: 'Root Label',
					desc: 'Root label can be defined.',
					xml: <NTree model={model} layout={$pt.createCellLayout('nodes', layoutTemplate)}/>,
					code: [codesCode, modelCode, layoutCode, compCode],
					index: 20
				};
			},
			nodeText: function() {
				var codes = $pt.createCodeTable([
					{
						id: 1,
						text: 'Languages',
						children: [
							{id: 2, text:'Java'},
							{id: 3, text:'C#'}
						]
					}, {
						id: 4,
						text: 'Costing',
						children: [
							{id: 5, text: '1,000'},
							{id: 6, text: '2,000'}
						]
					}, {
						id: 7,
						text: 'Others',
						folder: true
					}
				], function(item) {
					return item.text + ' and something';
				});
				var codesCode = $demo.convertCodeTableCreatorToString({variable: 'codes', codetable: codes});
				var layoutTemplate = {comp: {root: "Informations", data: codes}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'nodes',
					template: layoutTemplate
				});
				return {
					id: 'tree-style-root-nodeText',
					title: 'Node Text',
					desc: 'Node text can be renderred by code table renderer.',
					xml: {width: 12, xml: <NTree model={model} layout={$pt.createCellLayout('nodes', layoutTemplate)}/>},
					code: [codesCode, modelCode, layoutCode, compCode],
					index: 25
				};
			},
			op: function () {
				var layoutTemplate = {comp: {opIconEnabled: true, data: codes}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'nodes',
					template: layoutTemplate
				});
				return {
					id: 'tree-style-op',
					title: 'Operation Icon',
					desc: 'Show operation icons.',
					xml: <NTree model={model} layout={$pt.createCellLayout('nodes', layoutTemplate)}/>,
					code: [codesCode, modelCode, layoutCode, compCode],
					index: 30
				};
			},
			icons: function() {
				var layoutTemplate = {
					comp: {
						opIconEnabled: true,
						data: codes,
						opNodeIcon: function(options) {
							console.log(options);
							if (options.folder) {
								if (options.leaf) {
									return 'chevron-right';
								} else {
									return options.active ? 'chevron-down' : 'chevron-right';
								}
							} else {
								return '';
							}
						},
						nodeIcon: function(options) {
							console.log(options);
							if (options.folder) {
								if (options.leaf) {
									return 'folder';
								} else {
									return options.active ? 'folder-open' : 'folder';
								}
							} else {
								return 'file';
							}
						}
					}
				};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'nodes',
					template: layoutTemplate
				});
				return {
					id: 'tree-style-icons',
					title: 'Icons',
					desc: 'Icons can be defined, see console for more information.',
					xml: <NTree model={model} layout={$pt.createCellLayout('nodes', layoutTemplate)}/>,
					code: [codesCode, modelCode, layoutCode, compCode],
					index: 40
				};
			},
			slibing: function () {
				var layoutTemplate = {comp: {inactiveSlibing: false, data: codes}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'nodes',
					template: layoutTemplate
				});
				return {
					id: 'tree-style-slibing',
					title: 'Slibing',
					desc: 'To save pixels, collapse slibing nodes when expand one node. This feature can be disabled.',
					xml: <NTree model={model} layout={$pt.createCellLayout('nodes', layoutTemplate)}/>,
					code: [codesCode, modelCode, layoutCode, compCode],
					index: 50
				};
			},
			expand: function () {
				var layoutTemplate = {comp: {inactiveSlibing: false, expandLevel: 1, data: codes}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'nodes',
					template: layoutTemplate
				});
				return {
					id: 'tree-style-expand',
					title: 'Expand',
					desc: <span>Set initial expanded level via <code>expandLevel</code>, usually used with <code>inactiveSlibing: false</code>.<br/>
					Level is a number from zero, zero means expanding root node (whether root is painted or not).
					Default expands root node, set <code>expandLevel: -1</code> if want to collapse the root node.
					Set <code>expandLevel: 'all'</code> to expand all levels.</span>,
					xml: <NTree model={model} layout={$pt.createCellLayout('nodes', layoutTemplate)}/>,
					code: [codesCode, modelCode, layoutCode, compCode],
					index: 60
				};
			},
			border: function () {
				var layoutTemplate = {comp: {inactiveSlibing: false, expandLevel: 1, border: true, data: codes}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'nodes',
					template: layoutTemplate
				});
				return {
					id: 'tree-style-border',
					title: 'Border',
					desc: <span>Set <code>border</code> as true to render border.</span>,
					xml: <NTree model={model} layout={$pt.createCellLayout('nodes', layoutTemplate)}/>,
					code: [codesCode, modelCode, layoutCode, compCode],
					index: 70
				};
			},
			height: function () {
				var layoutTemplate = {comp: {inactiveSlibing: false, expandLevel: 1, border: true, height: 200, data: codes}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'nodes',
					template: layoutTemplate
				});
				return {
					id: 'tree-style-height',
					title: 'Height',
					desc: <span>Set <code>height</code> to fix tree height.</span>,
					xml: <NTree model={model} layout={$pt.createCellLayout('nodes', layoutTemplate)}/>,
					code: [codesCode, modelCode, layoutCode, compCode],
					index: 80
				};
			},
			maxHeight: function () {
				var layoutTemplate = {comp: {inactiveSlibing: false, expandLevel: 1, border: true, maxHeight: 200, data: codes}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'nodes',
					template: layoutTemplate
				});
				return {
					id: 'tree-style-maxHeight',
					title: 'Max Height',
					desc: <span>Set <code>maxHeight</code> to fix tree max height.</span>,
					xml: <NTree model={model} layout={$pt.createCellLayout('nodes', layoutTemplate)}/>,
					code: [codesCode, modelCode, layoutCode, compCode],
					index: 90
				};
			}
		};

		var check = {
			normal: function() {
				var layoutTemplate = {comp: {check: true, data: codes}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'nodes',
					template: layoutTemplate
				});
				return {
					id: 'tree-style-check-normal',
					title: 'Independent',
					desc: <span>Set <code>check</code> as true to enable check box.</span>,
					xml: <NTree model={model} layout={$pt.createCellLayout('nodes', layoutTemplate)}/>,
					code: [codesCode, modelCode, layoutCode, compCode],
					index: 10
				};
			},
			hierarchy: function() {
				var layoutTemplate = {comp: {check: true, hierarchyCheck: true, data: codes}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'nodes',
					template: layoutTemplate
				});
				return {
					id: 'tree-style-check-hierarchy',
					title: 'Hierarchy',
					desc: <span>Check box can be hierarchy linked.</span>,
					xml: <NTree model={model} layout={$pt.createCellLayout('nodes', layoutTemplate)}/>,
					code: [codesCode, modelCode, layoutCode, compCode],
					index: 20
				};
			},
			multiple: function() {
				var layoutTemplate = {comp: {check: true, multiple: false, data: codes}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'nodes',
					template: layoutTemplate
				});
				return {
					id: 'tree-style-check-multiple',
					title: 'Multiple',
					desc: <span>Check can set as multiple or single by <code>multiple</code>, default is multiple.
					<code>hierarchyCheck</code> will be ignored when <code>multiple: false</code>.</span>,
					xml: <NTree model={model} layout={$pt.createCellLayout('nodes', layoutTemplate)}/>,
					code: [codesCode, modelCode, layoutCode, compCode],
					index: 30
				};
			}
		};

		var all = {
			defaultOptions: function () {
				var layoutTemplate = {comp: {data: codes}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'nodes',
					template: layoutTemplate
				});
				return {
					id: 'tree-default',
					title: 'Default',
					desc: 'A simple tree.',
					xml: <NTree model={model} layout={$pt.createCellLayout('nodes', layoutTemplate)}/>,
					code: [codesCode, modelCode, layoutCode, compCode],
					index: 10
				};
			},
			click: function () {
				var layoutTemplate = {comp: {data: codes, nodeClick: function(node) {alert(node.text + ' clicked.');}}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'nodes',
					template: layoutTemplate
				});
				return {
					id: 'tree-click',
					title: 'Click',
					desc: <span>Handle node click by <code>nodeClick</code>.</span>,
					xml: <NTree model={model} layout={$pt.createCellLayout('nodes', layoutTemplate)}/>,
					code: [codesCode, modelCode, layoutCode, compCode],
					index: 15
				};
			},
			style: function () {
				return {
					id: 'tree-style',
					title: 'Style',
					desc: 'Style of tree can be defined.',
					index: 20,
					children: $demo.convertToExampleList(style)
				};
			},
			check: function () {
				return {
					id: 'tree-check',
					title: 'Selection',
					desc: <span>Check box can be added. Related model value can be hierarchy JSON object or array.
					If declared as an array by <code>valueAsArray</code>, MUST make sure the id of code item cannot have duplicated values.
					Default is hierarchy JSON.</span>,
					index: 30,
					children: $demo.convertToExampleList(check)
				};
			},
			constants: function () {
				var statics = {
					ROOT_LABEL: NTree.ROOT_LABEL,
		            FOLDER_ICON: NTree.FOLDER_ICON,
		            FOLDER_OPEN_ICON: NTree.FOLDER_OPEN_ICON,
		            FILE_ICON: NTree.FILE_ICON,
		            OP_FOLDER_LEAF_ICON: NTree.OP_FOLDER_LEAF_ICON,
		            OP_FOLDER_ICON: NTree.OP_FOLDER_ICON,
		            OP_FOLDER_OPEN_ICON: NTree.OP_FOLDER_OPEN_ICON,
		            OP_FILE_ICON: NTree.OP_FILE_ICON
				};
				return {
					id: 'tree-constants',
					title: 'Constants',
					desc: <span>Available constants. Constants must be change before construct component.<br/></span>,
					index: 900,
					code: $demo.convertJSON({
						variable: 'NTree',
						json: {
							statics: statics
						}
					})
				};
			},
			css: function () {
				return $demo.convertCSSJSONToExample({
					id: 'tree-css',
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
	renderer.formTree = function () {
		React.render(<ExampleList title='Form Tree'
		                          formType='$pt.ComponentConstants.Tree'
		                          items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));
