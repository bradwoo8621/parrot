(function (context, $) {
	var $demo = $pt.getService(context, '$demo');


	var painter = function () {
		var modelTemplate = {
			nodes: [
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
			]
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
				var layoutTemplate = {comp: {root: false}};
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
					code: [modelCode, layoutCode, compCode],
					index: 10
				};
			},
			label: function () {
				var layoutTemplate = {comp: {root: "Informations"}};
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
					code: [modelCode, layoutCode, compCode],
					index: 20
				};
			},
			nodeText: function() {
				var layoutTemplate = {comp: {root: "Informations", textRender: function(node) {
					return node.text + ' & something';
				}}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'nodes',
					template: layoutTemplate
				});
				return {
					id: 'tree-style-root-nodeText',
					title: 'Node Text',
					desc: 'Node text can be defined.',
					xml: <NTree model={model} layout={$pt.createCellLayout('nodes', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 25
				};
			},
			op: function () {
				var layoutTemplate = {comp: {opIconEnabled: true}};
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
					code: [modelCode, layoutCode, compCode],
					index: 30
				};
			},
			icons: function() {
				var layoutTemplate = {
					comp: {
						opIconEnabled: true,
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
					code: [modelCode, layoutCode, compCode],
					index: 40
				};
			},
			slibing: function () {
				var layoutTemplate = {comp: {inactiveSlibing: false}};
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
					code: [modelCode, layoutCode, compCode],
					index: 50
				};
			},
			expand: function () {
				var layoutTemplate = {comp: {inactiveSlibing: false, expandLevel: 1}};
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
					code: [modelCode, layoutCode, compCode],
					index: 60
				};
			}
		};

		var check = {
			normal: function() {
				var layoutTemplate = {comp: {check: 'selected'}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'nodes',
					template: layoutTemplate
				});
				return {
					id: 'tree-style-check-normal',
					title: 'Independent',
					desc: <span>Use <code>check</code> to set the property name in each node which binds the check box value.</span>,
					xml: <NTree model={model} layout={$pt.createCellLayout('nodes', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 10
				};
			},
			hierarchy: function() {
				var layoutTemplate = {comp: {check: 'selected', hierarchyCheck: true}};
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
					code: [modelCode, layoutCode, compCode],
					index: 10
				};
			}
		};

		var all = {
			defaultOptions: function () {
				var layoutTemplate = {};
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
					code: [modelCode, layoutCode, compCode],
					index: 10
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
					desc: 'Check box can be added.',
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
