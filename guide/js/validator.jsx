(function (context, $) {
	var $demo = $pt.getService(context, '$demo');

	var painter = function () {
		var validator = [
			{
				id: 'validator-getConfig',
				title: '#getConfig',
				pattern: '#getConfig(id: string) : JSON',
				desc: <span>Get check configuration of given id, or get all configuration if no id passed.</span>
			}, {
				id: 'validator-getRule',
				title: '#getRule',
				pattern: '#getRule(ruleName: string) : JSON',
				desc: <span>Get validate rule definition by given rule name.</span>
			}, {
				id: 'validator-isRequired',
				title: '#isRequired',
				pattern: '#isRequired(id: string) : JSON',
				desc:
					<span>Check if it is required of given id. Returns true only if it is declared as <code>{"{required: true}"}</code>.</span>
			}, {
				id: 'validator-validate',
				title: '#validate',
				pattern: '#validate(model: ModelInterface, id: string) : string|string[]|TableValidationResult|JSON',
				desc: <span>Validate.<br/>
				1. Returns string or string if the given id is a simple property.<br/>
				2. Returns TableValidationResult if the given id is an array.<br/>
				3. Returns JSON if no id given.</span>
			}, {
				id: 'validator-validateByPhase',
				title: '#validateByPhase',
				pattern: '#validateByPhase(model: ModelInterface, phase: string, id: string) : string|string[]|TableValidationResult|JSON',
				desc: <span>Validate by given phase.<br/>
				1. Returns string or string if the given id is a simple property.<br/>
				2. Returns TableValidationResult if the given id is an array.<br/>
				3. Returns JSON if no id given.</span>
			}
		];

		var tableResult = [
			{
				id: 'validator-table-result-getError',
				title: '#getError',
				pattern: '#getError(row: JSON) : JSON',
				desc: <span>Get errors of given rows.<br/>
				Note the given row must be exactly the item of array.</span>
			}, {
				id: 'validator-table-result-hasError',
				title: '#hasError',
				pattern: '#hasError() : boolean',
				desc: <span>Check there is error occured or not.</span>
			}, {
				id: 'validator-table-result-push',
				title: '#push',
				pattern: '#push(row: JSON, error: JSON) : TableValidationResult',
				desc: <span>Put error to result.<br/>
				Note the given row must be exactly the item of array.</span>
			}, {
				id: 'validator-table-result-remove',
				title: '#remove',
				pattern: '#remove(row: JSON) : TableValidationResult',
				desc: <span>Remove error from result.<br/>
				Note the given row must be exactly the item of array.</span>
			}
		];

		var rules = [
			{
				id: 'validator-rules-single',
				title: 'Single Rule',
				desc: <span>Single rule definition.<br/>
					<code>name</code> is property name of data model. Connected by '_' is allowed here, but not recommended.<br/>
					<Code code={$demo.convertJSON({variable: 'config', json: {name: {required: true}}})}/>
				</span>
			}, {
				id: 'validator-rules-multiple',
				title: 'Multiple Rules',
				desc: <span>Mulitple rules definition.<br/>
					More rules can be added for one property, just use the key of rule to define it.<br/>
					<Code
						code={$demo.convertJSON({variable: 'config', json: {name: {required: true, maxlength: 10}}})}/>
				</span>
			}, {
				id: 'validator-rules-complex',
				title: 'Complex Rule',
				desc: <span>Settings of rule can be any complex object.<br/>
					Date rule <code>before</code> and <code>after</code> follow the same setting as below:<br/>
					1. Can be string, <br/>
					1.a <code>now</code>, means now.<br/>
					1.b some property id of model, can be parsed by pattern <code>$pt.ComponentConstants.Default_Date_Format</code>,<br/>
					1.c a plain date time text, can be parsed by pattern <code>$pt.ComponentConstants.Default_Date_Format</code>.<br/>
					2. Can be function, return a momentjs object,<br/>
					3. Can be momentjs object,<br/>
					4. Or array of above three types,<br/>
					5. JSON, contains <br/>
					5.a <code>format</code>, a momentjs format pattern. Optional, use <code>$pt.ComponentConstants.Default_Date_Format</code> if not defined.<br/>
					5.b <code>rule</code>, follow point 1 - 4,<br/>
					5.c <code>label</code>, a plain text. if <code>rule</code> defined as array, <code>label</code> must be defined as array too, has same length with <code>rule</code>.
					<Code
						code={$demo.convertJSON({variable: 'config', json: {birthday: {before: {format: 'YYYY/MM/DD', rule: 'now', label: 'Today'}}}})}/>
				</span>
			}, {
				id: 'validator-rules-array',
				title: 'Array',
				desc: <span>Rule <code>table</code> is pre-defined for array property.<br/>
					The following definition will validate each <code>name</code> in <code>items</code>.
					<Code
						code={$demo.convertJSON({variable: 'config', json: {items: {table: {name: {required: true}}}}})}/>
				</span>
			}, {
				id: 'validator-rules-phase',
				title: 'Phase',
				desc: <span>Rule can be defined in appointed phase.
					Use <code>validateByPhase()</code> to validate, or validate all by <code>validate()</code>.<br/>
				</span>,
				children: [
					{
						id: 'validator-rules-phase-simple',
						title: 'Simple',
						desc: <span>Simple phase:
						<Code
							code={$demo.convertJSON({variable: 'config', json: {name: {required: {_phase: 'one', rule: true}}}})}/>
						</span>
					},
					{
						id: 'validator-rules-phase-multiple',
						title: 'Mulitple',
						desc: <span>Defined one rule for multiple phases:
						<Code
							code={$demo.convertJSON({variable: 'config', json: {name: {required: {_phase: ['one', 'two'], rule: true}}}})}/>
						</span>
					},
					{
						id: 'validator-rules-phase-mixed',
						title: 'Mixed',
						desc: <span>Different rules or different phase:
						<Code
							code={$demo.convertJSON({variable: 'config', json: {name: {maxlength: [{_phase: ['one', 'two'], rule: 10}, {_phase: 'three', rule: 8}]}}})}/>
						</span>
					}
				]
			}, {
				id: 'validator-rules-condition',
				title: 'Condition',
				desc: <span>Rule can be triggerred under appointed condition:
				<Code
					code={$demo.convertJSON({variable: 'config', json: {name: {required: {_when: function(model) {return model.get('enabled');}, rule: true}}}})}/>
				</span>
			}, {
				id: 'validator-rules-function',
				title: 'Function',
				desc: <span>Rule can be defined as function. Three parameters passed to function:<br/>
				1. <code>model</code>: data model,<br/>
				2. <code>value</code>: property value,<br/>
				3. <code>phase</code>: phase given by caller.<br/>
				<Code
					code={$demo.convertJSON({variable: 'config', json: {name: {_fly: function(model) {return model.get('name').endsWith('Fly');}}}})}/>
				</span>
			}, {
				id: 'validator-rules-mixed',
				title: 'Mixed',
				desc: <span>All of above can be mixed defined. Try it.</span>
			}, {
				id: 'validator-rules-customize',
				title: 'Customize',
				desc: <span>Rule function can be customized and validator passes parameters as below:<br/>
				1. <code>model</code>: data model.<br/>
				2. <code>value</code>: property value.<br/>
				3. <code>settings</code>: settings in definition. eg. <code>{"{required: true}"}</code>, value of <code>settings</code> is <code>true</code>.<br/>
				To register into common rules, call <code>$pt.ValidateRules['your-rule-name'] =
						your-rule-function;</code>,
				and in definition, as <code>{"name: {'your-rule-name': your-settings}"}</code>. Make sure the customized function can accept the settings.
				</span>
			}
		];

		var items = [
			{
				id: 'validator',
				title: 'ModelValidator',
				pattern: '$pt.createModelValidator(config: JSON|JSON[], rules: JSON) : ModelValidator',
				desc: <span>Create a model validator.<br/>
				<code>config</code>: configuration of checks,<br/>
				<code>rules</code>: rules of checks. Optional, use <code>$pt.ValidateRules</code> if not passed.
				Or use <code>$pt.ValidateRules</code> + parameter is passed, if key duplicated, use rule in parameter.</span>,
				children: validator
			}, {
				id: 'validator-table-result',
				title: 'TableValidationResult',
				pattern: '$pt.createTableValidationResult() : TableValidationResult',
				desc: 'Create instance.',
				children: tableResult
			}, {
				id: 'validator-rules',
				title: 'ValidateRules',
				pattern: '$pt.ValidateRules',
				desc: <span>Pre-defined validation rules. A simple JSON, add additional validation rule by edit this JSON.<br/>
				Here are the pre-defined rules:<br/>
				<code>required</code>: boolean. for any data type. <br/>
				<code>minlength</code>: number. for any data type which has <code>length</code> function. normally string.<br/>
				<code>maxlength</code>: number. for any data type which has <code>length</code> function. normally string.<br/>
				<code>minsize</code>: number. for any data type which has <code>length</code> function. normally array.<br/>
				<code>maxsize</code>: number. for any data type which has <code>length</code> function. normally array.<br/>
				<code>length</code>: number. for any data type which has <code>length</code> function. normally string.<br/>
				<code>before</code>: JSON. for date.<br/>
				<code>after</code>: JSON. for date.<br/>
				<code>table</code>: JSON. for check each item of array.<br/>
				</span>
			}, {
				id: 'validator-rules-understanding',
				title: 'Understanding Rules',
				desc: <span>It's very important to understanding the design of validation rules.</span>,
				children: rules
			}
		];
		return items;
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.validator = function () {
		React.render(<APIList title='Model Validator' items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));