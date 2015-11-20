(function (context, $) {
	var $demo = $pt.getService(context, '$demo');

	var painter = function () {
		var items = [
			{
				id: 'data',
				title: 'ModelInterface',
				pattern: '$pt.createModel(jsons: JSON|JSON[], validator: ModelValidator) : ModelClass',
				desc: <span><code>ModelInterface</code>, and its dynamic implementation instance <code>ModelClass</code>
				which create base on JSON is the core of Parrot.<br/>
				Two-way data binding is base on the event mechanism of this object.<br/>
				<br/>
				<strong>
					Parameter <code>id</code> in its functions can be connected by '_',
					see <code>$pt.setValueIntoJSON</code> and <code>$pt.getValueFromJSON</code>.
					When declaring the layout JSON object, key or <code>dataId</code> is used to match this
					<code>id</code>,
					so it makes key or <code>dataId</code> in layout can be connected by '_' too.<br/>
					It's very important, remember this please.
				</strong></span>,
				children: [
					{
						id: 'data-property',
						title: 'Property',
						children: [
							{
								id: 'data-add',
								title: '#add',
								pattern: '#add(id: string, row: JSON, index) : ModelInterface',
								desc: <span>Add a JSON object into the array which located by give id. Returns model itself.<br/>
								Parameter <code>index</code> is optional, default push data at the end of array.<br/>
								Fire event <code>{'\u007B'}model: this, id: id, array: data, index: index,
										old: null, new: row, time: "post", type: "add"{'\u007D'}</code>.</span>
							}, {
								id: 'data-get',
								title: '#get',
								pattern: '#get(id: string) : *',
								desc: 'Get value from model.'
							}, {
								id: 'data-isRequired',
								title: '#isRequired',
								pattern: '#isRequired(id: string) : boolean',
								desc: <span>Check the given id is required or not, returns true only when <code>required:
									true</code> is declared in validator.</span>
							}, {
								id: 'data-remove',
								title: '#remove',
								pattern: '#remove(id: string, row: JSON) : ModelInterface',
								desc: <span>Remove a JSON object from the array which located by give id.
								Returns model itself. Note the JSON removed from array must be exactly <strong>same
										object (===)</strong> as parameter.<br/>
								Fire event <code>{'\u007B'}model: this, id: id, array: data, index: index, old: row,
										new: null, time: "post", type: "remove"{'\u007D'}</code>,
								Note the oldRow updated from array must be exactly <strong>same object (===)</strong> as parameter.</span>
							}, {
								id: 'data-set',
								title: '#set',
								pattern: '#set(id: string, value: *) : ModelInterface',
								desc: <span>Set value into model.<br/>
								Fire event <code>{'\u007B'}model: this, id: id, old: oldValue, new: value, time: "post",
										type: "change"{'\u007D'}</code></span>
							}, {
								id: 'data-update',
								title: '#update',
								pattern: '#update(id: string, oldRow: JSON, newRow: JSON) : ModelInterface',
								desc: <span>Set value into model.<br/>
								Fire event <code>{'\u007B'}model: this, id: id, array: data, index: index, old: oldRow,
										new: newRow, time: "post", type: "change"{'\u007D'}</code>,
								Note the oldRow updated from array must be exactly <strong>same object (===)</strong> as parameter.</span>
							}
						]
					}, {
						id: 'data-event',
						title: 'Event',
						children: [
							{
								id: 'data-addListener',
								title: '#addListener',
								pattern: '#addListener(id: string|RegExp, time: string, type: string, listener: function) : ModelInterface',
								desc: <span>Add listener to monitor the data changing or something.<br/>
										1. <code>id</code>: can be property name or aa RegExp. Or keep <code>null</code> to monitor all change.<br/>
										2. <code>time</code>: <code>pre</code> or <code>post</code>. Currently only <code>post</code> is opened.<br/>
										3. <code>type</code>: <code>add</code>, <code>remove</code>, <code>change</code> or <code>validate</code>.<br/>
										4. <code>listener</code>: with one parameter <code>evt</code>.
										Event is a JSON object, content depends event type and trigger timing.<br/>
										Returns model itself.</span>
							}, {
								id: 'data-addPostChangeListener',
								title: '#addPostChangeListener',
								pattern: '#addPostChangeListener(id: string|RegExp, listener: function) : ModelInterface',
								desc:
									<span>Shortcut to add a listener on <code>post</code> + <code>change</code>.</span>
							}, {
								id: 'data-fireEvent',
								title: '#fireEvent',
								pattern: '#fireEvent(evt: JSON) : ModelInterface',
								desc: 'Fire given event.'
							}, {
								id: 'data-removeListener',
								title: '#removeListener',
								pattern: '#removeListener(id: string|RegExp, time: string, type: string, listener: function) : ModelInterface',
								desc: <span>Add listener to monitor the data changing or something.<br/>
										1. <code>id</code>: can be property name or aa RegExp. Or keep <code>null</code> to monitor all change.<br/>
										2. <code>time</code>: <code>pre</code> or <code>post</code>. Currently only <code>post</code> is opened.<br/>
										3. <code>type</code>: <code>add</code>, <code>remove</code>, <code>change</code> or <code>validate</code>.<br/>
										4. <code>listener</code>: with one parameter <code>evt</code>.
										Event is a JSON object, content depends event type and trigger timing.<br/>
										Note the listener removed from array must be exactly <strong>same object
										(===)</strong> as parameter.<br/>
										Returns model itself.</span>
							}, {
								id: 'data-removePostChangeListener',
								title: '#removePostChangeListener',
								pattern: '#removePostChangeListener(id: string|RegExp, listener: function) : ModelInterface',
								desc:
									<span>Shortcut to remove a listener on <code>post</code> + <code>change</code>.</span>
							}
						]
					}, {
						id: 'data-validator',
						title: 'Validator',
						children: [
							{
								id: 'data-clearValidateResults',
								title: '#clearValidateResults',
								pattern: '#clearValidateResults(id: string) : ModelInterface',
								desc: 'Clear validation result of given id, or clear all if no parameter passed.'
							}, {
								id: 'data-getError',
								title: '#getError',
								pattern: '#getError(id: string) : string|string[]|TableValidationResult|JSON',
								desc: <span>Get error of given id, or whole errors. <br/>
									When it is a simple property, should be string or string array. <br/>
									When it is an array, returns TableValidationResult. <br/>
									No id given, JSON returns.</span>
							}, {
								id: 'data-getValidator',
								title: '#getValidator',
								pattern: '#getValidator() : ModelValidator',
								desc: 'Get model validator.'
							}, {
								id: 'data-hasError',
								title: '#hasError',
								pattern: '#hasError(id: string) : boolean',
								desc: 'Check there is error existed of given id, or error existed for whole data model if no id given.'
							}, {
								id: 'data-mergeError',
								title: '#mergeError',
								pattern: '#mergeError(error: string|string[]|TableValidationResult|JSON, id: string) : ModelInterface',
								desc: 'Merge error into data model. Note it is replace, and replace all if no id given.'
							}, {
								id: 'data-validate',
								title: '#validate',
								pattern: '#validate(id: string) : ModelInterface',
								desc: <span>Validate the given id, or whole model if no id given.</span>
							}, {
								id: 'data-validateByPhase',
								title: '#validateByPhase',
								pattern: '#validateByPhase(phase: string, id: string) : ModelInterface',
								desc: <span>Validate the given id and appointed phase, whole rules if no phase given and whole model if no id given.</span>
							}
						]
					}, {
						id: 'data-model',
						title: 'Myself',
						children: [
							{
								id: 'data-getCurrentModel',
								title: '#getCurrentModel',
								pattern: '#getCurrentModel() : JSON',
								desc: 'Get current JSON data model.'
							}, {
								id: 'data-getOriginalModel',
								title: '#getOriginalModel',
								pattern: '#getOriginalModel() : JSON',
								desc: <span>Get original model, which constructs this data model object.<br/>
								All operations are use the current model, recreate the current model from original model when call <code>reset</code>.
								Use original model to do operations after call <code>useBaseAsCurrent</code>.</span>
							}, {
								id: 'data-isChanged',
								title: '#isChanged',
								pattern: '#isChanged() : boolean',
								desc: 'Check the data model is changed or not.'
							}, {
								id: 'data-mergeCurrentModel',
								title: '#mergeCurrentModel',
								pattern: '#mergeCurrentModel(newModel: JSON) : ModelInterface',
								desc: 'Merge data from give model to current model. Deep copy by call jQuery.'
							}, {
								id: 'data-applyCurrentToBase',
								title: '#applyCurrentToBase',
								pattern: '#applyCurrentToBase() : ModelInterface',
								desc: 'Apply current model data to base model.'
							}, {
								id: 'data-name',
								title: '#name',
								pattern: '#name(name: string) : ModelInterface|string',
								desc: 'Get name when no parameter passed, return name of model. Or set given parameter as name, return data model itself.'
							}, {
								id: 'data-parent',
								title: '#parent',
								pattern: '#parent(parent: *) : ModelInterface|*',
								desc: 'Get parent when no parameter passed, return parent of model. Or set given parameter as parent, return data model itself.'
							}, {
								id: 'data-reset',
								title: '#reset',
								pattern: '#reset(id: string|RegExp, listener: function) : ModelInterface',
								desc: <span>Reset current model, clear validation result and reset changed to false.
								Note the current model is recreated base on original model.</span>
							}, {
								id: 'data-useBaseAsCurrent',
								title: '#useBaseAsCurrent',
								pattern: '#useBaseAsCurrent() : ModelInterface',
								desc: <span>Use original model as current model. The two model will be same object after call this method.
								Call <code>reset</code> to re-separate them, but data write into original model cannot be reset again.</span>
							}
						]
					},
				]
			}, {
				id: 'data-cloneJSON',
				title: 'cloneJSON',
				pattern: '$pt.cloneJSON(jsons: JSON) : JSON',
				desc: <span>Clone JSON object, call jQuery <code>$.extend(true, {'\u007B\u007D'}, json);</code></span>
			}, {
				id: 'data-createModel',
				title: 'createModel',
				pattern: '$pt.createModel(jsons: JSON|JSON[], validator: ModelValidator) : ModelClass',
				desc: 'Create a ModelClass instance.'
			}, {
				id: 'data-getValueFromJSON',
				title: 'getValueFromJSON',
				pattern: '$pt.getValueFromJSON(jsons: JSON, id: string) : *',
				desc: <span>Get value from JSON object. Id can be key names connected by '_'.<br/>
				eg. a JSON <code>var json = {'\u007B'}a: {'\u007B'}b: {'\u007B'}c:
						1{'\u007D\u007D\u007D'};</code>, <br/>
				call <code>$pt.getValueFromJSON(json, 'a_b_c');</code>, return <code>1</code>.</span>
			}, {
				id: 'data-setValueIntoJSON',
				title: 'setValueIntoJSON',
				pattern: '$pt.setValueIntoJSON(jsons: JSON, id: string, value: *) : $pt',
				desc: <span>Set value from JSON object. Id can be key names connected by '_'.<br/>
				eg. a JSON <code>var json = {'\u007B'}{'\u007D'}</code>, <br/>
				call <code>$pt.setValueIntoJSON(json, 'a_b_c', 1);</code>,<br/>
				result is <code>{'\u007B'}a: {'\u007B'}b: {'\u007B'}c: 1{'\u007D\u007D\u007D'}</code>.<br/>
				If the middle sections in json is null, create it as empty JSON object.</span>
			}, {
				id: 'data-constants',
				title: 'Constants',
				children: [
					{
						id: 'data-BUILD_PROPERTY_VISITOR',
						title: 'BUILD_PROPERTY_VISITOR',
						pattern: '$pt.BUILD_PROPERTY_VISITOR',
						desc: <span>Boolean value, default is true.
						<code>$pt.createModel</code> will create the getter/setter for first level properties if property exists.
						And after that, can visit the property via such as <code>getName()</code> and <code>setName()</code>,
						if the JSON object in parameter is <code>{'\u007B'}name: 'value'{'\u007D'}</code>. <br/>
						For reduce the memory costing, set this constant to false to close this feature.
						Use <code>get</code> and <code>set</code> instead.</span>
					}
				]
			}
		];
		return items;
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.data = function () {
		React.render(<APIList title='Data Model' items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));
