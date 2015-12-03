(function (context, $) {
	var $demo = $pt.getService(context, '$demo');

	var painter = function () {
		var items = [
			{
				id: 'viewMode',
				title: 'View Mode',
				desc: [<span>
					In some cases, UI is shared between edit mode and view mode.
					Now form components support displaying in view mode by simply pass a property <code>view</code>,
					eg. <code>{"<NForm model={model} layout={layout} view={true} />"}</code>,
					then all form components are switched to view mode.<br/>
					<br/>
					See the rules of switching:<br/>
					1. NText, NTextArea, NSelect, NDateTime, NSearchText: change to NLabel,<br/>
					2. NCheck, NRadio, NToggle: change display color; switch off event handling,<br/>
					3. NPanel, NArrayPanel, NTree: follow the rules of NCheck,<br/>
					4. NArrayTab: hide the add tab,<br/>
					5. NSelectTree: switch off event handling, hide bottom border,<br/>
					6. NTable: hide add and remove button; show view mode edit dialog,<br/>
					7. Containers passes view mode to its components,<br/>
					8. Others are sames as edit mode.<br/>
					<br/>
					Beside these changes, sometimes the component is only shown in one mode,
					it can be declared by <code>{"{comp: {view: 'view'}}"}</code>,
					which means the component is only shown in view mode.
					<code>view</code> also can be defined as <code>edit</code>, which means the component is only shown in edit mode.
					Otherwise the component is shown on both mode.<br/>
					<br/>
					For buttons, they are always different in different modes.
					So in NTable, NButtonFooter, NModalForm and NForm,
					when defines <code>view</code> in button defintion, Parrot also do the same thing with form component.
					eg. <code>{"{rowOperations: [{text: 'Pickup', view: 'view'}, {text: 'Move to crash', view: 'edit'}]}"}</code>.<br/>
					<br/>
					And to replace the default view mode renderer,
					use <code>{"$pt.LayoutHelper.registerComponentViewModeRenderer(type: string, render: function)"}</code>.
					<code>type</code> is same as the component type.<br/>
					In <code>ComponentBase</code>, there are a set of methods to support the view mode renderer,<br/>
					1. <code>isViewMode</code>: check the component is in view mode or not,<br/>
					2. <code>renderInViewMode</code>: firstly find view mode renderer in registration,
					or render as a NLabel if not found. Note only the components call this method to render its view mode component can be replaced.<br/>
					3. <code>getTextInViewMode</code>: if these method is declared in customized component,
					the return value (should be string or string array) will be the text of NLabel which renderred by <code>renderInViewMode</code>.<br/>
					<br/>
					At last, the important thing is, if want to support view mode in customized component, have to consider it in your source code.
				</span>]
			}
		];
		return items;
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.viewMode = function () {
		React.render(<APIList title='View Mode' items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));
