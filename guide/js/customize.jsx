(function (context, $) {
	var $demo = $pt.getService(context, '$demo');

	var painter = function () {
		var items = [
			{
				id: 'customize',
				title: 'Long Story',
				desc: [<span>
					An UI contains a set of components, and layout calculate the positions of components.
					Component is bound with data model. Parrot is designed based on this concept.<br/>
					<br/>
					In current version, there is only one layout implementation,
					which is based on Bootstrap grid system, called <code>FormLayout</code>.
					<code>FormLayout</code> contains cells, each cell has its own row index and column index, also with width.
					<code>FormLayout</code> uses these information to calculate the position of cell.<br/>
					For each cell, besides the position, there are several parts of definitions, they are: component properties, label,
					css, dataId, evt and base. Cell is defined as a JSON object, eg.
					<code>{"{label: 'name', comp: {}, css: {}, evt: {}, base: {}, dataId: 'name', pos: {}}"}</code>,
					they are the base properties of a cell, each form component can use these definitions.
					JSON defintion is read as <code>CellLayout</code>, and a set of methods are provided to get these properties.
					When a cell is defined in form, there is a key to identify the cell, eg.
					<code>{"{name: {}, code: {}}"}</code>, <code>name</code> and <code>code</code> are identities of cells.
					Note the keys cannot be duplicated in same level. And if there is no <code>dataId</code> declared,
					key is used to bind the property of data model.
					Meanwhile, for simplify the binding with data model, key can be concatenated by underline (default), eg.
					<code>{"{person_name: {}}"}</code>, it is binding with <code>{"{person: {name: 'Jack'}}"}</code>.
					Underline can be changed to other string, eg. <code>$pt.PROPERTY_SEPARATOR = '.';</code>.<br/>
					For those form components which are container type, such as <code>NPanel</code>,
					<code>NForm</code> (Form is also can be used as a cell), since they don't care of the data,
					just keep the cell key not duplicated, eg. <code>{"{panel: {}}"}</code>, <code>panel</code> is not a property name of data model.
					<br/>
					<br/>
					After understanding the form, cell and data model binding, here is a sample to define a new cell component.<br/>
					<code>{"{name: {comp: {type: {render: function(model, layout, direction, view) {return <div/>;}}}}}"}</code>.<br/>
					It's a very simple customized component which defined by <code>type.render</code>.
					Four parameters are passed to function, which are <code>ModelInterface</code>, <code>CellLayout</code>,
					label direction (horizontal or vertical) and view mode (boolean or undefined).
					You can use these parameters to build the component, in this case, a div returned.<br/>
					<br/>
					Normally, the customized component will be reused, so using <code>type.render</code> will cause the code copying.
					So a React Class can be defined, and accept these four properties, and registered by
					<code>{"$pt.LayoutHelper.registerComponentRenderer(type: string, render: function)"}</code>.
					<code>type</code> means the type of component, and function of <code>render</code> is same as the previous sample.<br/>
				</span>,
				<span>
					eg.<br/>
					<pre>{"$pt.LayoutHelper.registerComponentRenderer(type: 'NewType', render: function() {return <div/>;});"}</pre>
				</span>,
				<span>
					After registration, declare in JSON as <code>{"{name: {comp: {type: 'NewType'}}}"}</code>.
					Note if the type is duplicated (even pre-defined by Parrot itself),
					only the last is effective.<br/>
					<br/>
					Now we can defined customized component by standard React.<br/>
					In React component liftcycle, there are four timing are using to bind or unbind with the data model, they are:
					<code>componentDidMount</code>, <code>componentWillUnmount</code>, <code>componentDidUpdate</code> and <code>componentWillUpdate</code>.
					In didMount and didUpdate, bind with data model; in willUnmount and willUpdate, unbind with data model.
					The reason is, in some cases, especially in one HTML App, React updates components if UI changed.
					And if in same DOM structure, when renderring with same component, React only trigger the update, not mount.
					So unbinding is very important to make sure the component is binding with the correct property in correct data model.<br/>
				</span>,
				<span>
					eg.<br/>
					<pre>{"componentWillUpdate: function (nextProps) {this.removePostChangeListener(this.onModelChanged);}"}</pre><br/>
					<pre>{"componentDidUpdate: function (nextProps) {this.addPostChangeListener(this.onModelChanged);}"}</pre><br/>
					<pre>{"componentDidMount: function (nextProps) {this.addPostChangeListener(this.onModelChanged);}"}</pre><br/>
					<pre>{"componentWillUnmount: function (nextProps) {this.removePostChangeListener(this.onModelChanged);}"}</pre><br/>
					<code>this.addPostChangeListener</code> and <code>this.removePostChangeListener</code> are provided by <code>ComponentBase</code>.
					They always appear as a pair.
					There are three more listeners are pre-defined: <code>PostAddListener</code>, <code>PostRemoveListener</code> and <code>PostValidateListener</code>.
					Meanwhile, two monitors are pre-defined: <code>EnableDependencyMonitor</code> and <code>VisibleDependencyMonitor</code>.
					And at last, the component can be registered into central instance repository automatically by <code>registerToComponentCentral</code>
					and quit the central control by <code>unregisterToComponentCentral</code>.<br/>
					Using these listeners, monitors to handle the change of data model, and change the behavior of customized component.<br/>
				</span>,
				<span>
					Another important thing is monitor the DOM component in customized component. eg.<br/>
					<pre>{"<input onChange={this.onComponentChanged} />"}</pre>
					In <code>onComponentChanged</code>, synchronize the value in DOM component to data model.<br/>
				</span>,
				<span>
					It's a very simple guide to customize your own cell component, hope it's helpful.<br/>
					And for more details, or want to create a new layout, learn the source code of Parrot please.
				</span>
				]
			}
		];
		return items;
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.customize = function () {
		React.render(<APIList title='Customize' items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));
