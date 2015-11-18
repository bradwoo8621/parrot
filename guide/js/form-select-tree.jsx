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
			tag: 'NSelectTree',
			model: 'model',
			layout: 'layout'
		});

		var all = {
			defaultOptions: function () {
				var layoutTemplate = {comp: {data: codes}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'nodes',
					template: layoutTemplate
				});
				return {
					id: 'select-tree-default',
					title: 'Default',
					desc: 'A simple tree select.',
					xml: {width: 12, xml: <NSelectTree model={model} layout={$pt.createCellLayout('nodes', layoutTemplate)}/>},
					code: [codesCode, modelCode, layoutCode, compCode],
					index: 10
				};
			},
			hierarchy: function() {
				return {
					id: 'select-tree-hierarchy',
					title: 'Hierarchy',
					desc: <span>Hierarchy with another property value.<br/>
					There are a set of properties to build the hierarchy.<br/>
					1. <code>parentPropId</code>: property id of parent model. Required if hierarchy built.<br/>
					2. <code>parentModel</code>: parent model. Optional, use current model from <code>this.getModel()</code> is not defined.<br/>
					3. <code>parentFilter</code>: filter according to parent property value. Accepts two parameters tree model and parent property value.
					MUST return a code table which is filtered.<br/>
					4. <code>parentChanged</code>: calculate the values when parent property value changed. Optional, set to null if not defined.
					<span className='text-danger'>Be careful, value type is choosen by tree layout.</span></span>,
					index: 20
				};
			},
			tree: function() {
				return {
					id: 'select-tree-tree',
					title: 'Tree',
					desc: <span>Tree is declared sames as NTree by <code>treeLayout</code> (optional).
					Which means such as type of value, multiple or not, hierarchy check etc is defined by <code>treeLayout</code>,
					<span className='text-danger'>it's very important</span> and find more information in NTree.<br/>
					Note, property <code>data</code> is declared by <code>{"comp: {data: codeTable}"}</code>,
					not by <code>{"comp: {treeLayout: {data: codeTable}}"}</code></span>,
					index: 30
				};
			},
			hideChild: function() {
				var layoutTemplate = {comp: {data: codes, hideChildWhenParentChecked: true, treeLayout: {comp: {hierarchyCheck: true}}}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'nodes',
					template: layoutTemplate
				});
				return {
					id: 'select-tree-hideChild',
					title: 'Hide Child',
					desc: <span>Child node can be hide by set <code>hideChildWhenParentChecked</code> as true only when <code>hierarchyCheck</code> is enabled.</span>,
					xml: {width: 12, xml: <NSelectTree model={model} layout={$pt.createCellLayout('nodes', layoutTemplate)}/>},
					code: [codesCode, modelCode, layoutCode, compCode],
					index: 40
				};
			},
			css: function () {
				return $demo.convertCSSJSONToExample({
					id: 'select-tree-css',
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
	renderer.formSelectTree = function () {
		React.render(<ExampleList title='Form Tree Select'
		                          formType='$pt.ComponentConstants.SelectTree'
		                          items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));
