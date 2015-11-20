/**
 * depends on jquery, jsface
 * depends on parrot-pre-define
 */
(function (context, $) {
	// define parrot context
	var $pt = context.$pt;
	if ($pt == null) {
		$pt = {};
		context.$pt = $pt;
	}

	$pt.BUILD_PROPERTY_VISITOR = true;
	$pt.PROPERTY_SEPARATOR = '_';

	/**
	 * clone json object
	 * @param jsonObject {{}}
	 */
	$pt.cloneJSON = function (jsonObject) {
		return $.extend(true, {}, jsonObject);
	};
	/**
	 * get value from json object
	 * @param jsonObject {{}}
	 * @param id {string} key of property, can be linked by underline
	 * @returns {*}
	 */
	$pt.getValueFromJSON = function (jsonObject, id) {
		if (id.indexOf($pt.PROPERTY_SEPARATOR) != -1) {
			// hierarchy id
			var ids = id.split($pt.PROPERTY_SEPARATOR);
			var parent = jsonObject;
			var value = null;
			var values = ids.map(function (id) {
				if (parent == null) {
					return null;
				} else {
					value = parent[id];
					parent = value;
					return value;
				}
			});
			return values[values.length - 1];
		} else {
			return jsonObject[id];
		}
	};
	$pt.setValueIntoJSON = function (jsonObject, id, value) {
		if (id.indexOf($pt.PROPERTY_SEPARATOR) == -1) {
			jsonObject[id] = value;
		} else {
			var ids = id.split($pt.PROPERTY_SEPARATOR);
			var parent = jsonObject;
			for (var index = 0, count = ids.length - 1; index < count; index++) {
				if (parent[ids[index]] == null) {
					// new object
					parent[ids[index]] = {};
				}
				parent = parent[ids[index]];
			}
			parent[ids[ids.length - 1]] = value;
		}
		return $pt;
	};

	/**
	 * table validation result
	 * @type {class}
	 */
	var TableValidationResult = jsface.Class({
		constructor: function () {
			this.__errors = {};
			this.__models = {};
			this.__startKeyIndex = 1;
		},
		/**
		 * push error
		 * @param model {{}} element of array
		 * @param error {{}} error messages
		 */
		push: function (model, error) {
			this.__errors[this.__startKeyIndex] = error;
			this.__models[this.__startKeyIndex] = model;
			this.__startKeyIndex++;
			return this;
		},
		/**
		 * remove error
		 * @param model {{}} element of array
		 */
		remove: function (model) {
			var _this = this;
			Object.keys(this.__models).forEach(function (key) {
				var item = _this.__models[key];
				if (item == model) {
					delete _this.__models[key];
					delete _this.__errors[key];
				}
			});
			return this;
		},
		/**
		 * has error
		 * @returns {boolean}
		 */
		hasError: function () {
			return Object.keys(this.__models).length !== 0;
		},
		/**
		 * get error
		 * @param model {{}} element of array
		 * @returns {{}}
		 */
		getError: function (model) {
			var keys = Object.keys(this.__models);
			for (var index = 0, count = keys.length; index < count; index++) {
				var item = this.__models[keys[index]];
				if (item == model) {
					return this.__errors[keys[index]];
				}
			}
			return null;
		}
	});
	/**
	 * create table validation result
	 * @returns {TableValidationResult}
	 */
	$pt.createTableValidationResult = function () {
		return new TableValidationResult();
	};

	$pt.defineMessage('validate.required', '"%1" is Required.');
	$pt.defineMessage('validate.length', 'Length of "%1" should be %2.');
	$pt.defineMessage('validate.length.max', 'Length of "%1" cannot be more than %2.');
	$pt.defineMessage('validate.length.min', 'Length of "%1" cannot be less than %2.');
	$pt.defineMessage('validate.size.max', 'Size of "%1" cannot be more than %2.');
	$pt.defineMessage('validate.size.min', 'Size of "%1" cannot be less than %2.');
	$pt.defineMessage('validate.date.before', 'Value of "%1" must be before than %2.');
	$pt.defineMessage('validate.date.after', 'Value of "%1" must be after than %2.');
	/**
	 * validate rules
	 * @type {class}
	 */
	$pt.ValidateRules = {
		/**
		 * check null or empty string
		 * @param model model itself
		 * @param value {*} property value
		 * @param settings {{}}
		 * @returns {string|boolean} return true when pass the validation
		 */
		required: function (model, value, settings) {
			if (settings === false) {
				// close the required check
				return true;
			}
			if (value == null || value.toString().isEmpty()) {
				return $pt.getMessage('validate.required');
			} else {
				return true;
			}
		},
		/**
		 * length check
		 * @param model model itself
		 * @param value {string} property value
		 * @param length {number}
		 * @returns {string|boolean} return true when pass the validation
		 */
		length: function (model, value, length) {
			if (value == null || value.length == 0) {
				return true;
			} else if (value.length != length) {
				return $pt.getMessage('validate.length').format(['%1', '' + length]);
			}
		},
		/**
		 * max length check
		 * @param model model itself
		 * @param value {string} property value
		 * @param length {number}
		 * @returns {string|boolean} return true when pass the validation
		 */
		maxlength: function (model, value, length) {
			if (value == null || value.length == 0) {
				return true;
			} else if (value.length > length) {
				return $pt.getMessage('validate.length.max').format(['%1', '' + length]);
			}
		},
		/**
		 * min length check
		 * @param model model itself
		 * @param value {string} property value
		 * @param length {number}
		 * @returns {string|boolean} return true when pass the validation
		 */
		minlength: function (model, value, length) {
			if (value == null || value.length == 0) {
				return true;
			} else if (value.length < length) {
				return $pt.getMessage('validate.length.min').format(['%1', '' + length]);
			}
		},
		/**
		 * max size check
		 * @param model model itself
		 * @param value {{}[]} property value, should be an array
		 * @param size {number}
		 * @returns {string|boolean} return true when pass the validation
		 */
		maxsize: function (model, value, size) {
			if (value == null || value.length == 0) {
				return true;
			} else if (value.length > size) {
				return $pt.getMessage('validate.size.max').format(['%1', '' + size]);
			}
		},
		/**
		 * min size check
		 * @param model model itself
		 * @param value {{}[]} property value, should be an array
		 * @param size {number}
		 * @returns {string|boolean} return true when pass the validation
		 */
		minsize: function (model, value, size) {
			if (value == null || value.length < size) {
				return $pt.getMessage('validate.size.min').format(['%1', '' + size]);
			} else {
				return true;
			}
		},
		/**
		 * before special date check
		 * @param model model itself
		 * @param value {momentjs} date
		 * @param settings {{}} check rules
		 * @returns {string[]|string|boolean}
		 */
		before: function (model, value, settings) {
			return $pt.ValidateRules.__dateCompare(value, model, settings, $pt.ValidateRules.__beforeSpecial);
		},
		/**
		 * before or equals special date
		 * @param momentValue {momentjs} datetime momentjs
		 * @param model {{}} model itself
		 * @param check {{}}
		 * @param format {string} datetime format, momentjs
		 * @param label {string} label in error message
		 * @returns {string|string[]|boolean}
		 * @private
		 */
		__beforeSpecial: function (momentValue, model, check, format, label) {
			var compareValue = $pt.ValidateRules.__convertToMomentValue(check, model, format);
			if (compareValue !== null) {
				if (momentValue.unix() > compareValue.unix()) {
					if (typeof check === "string") {
						return $pt.getMessage('validate.date.before').format(['%1', label ? label : check]);
					}
					return $pt.getMessage('validate.date.before').format(['%1', compareValue.format(format)]);
				}
			}
			return true;
		},
		after: function (model, value, settings) {
			return $pt.ValidateRules.__dateCompare(value, model, settings, $pt.ValidateRules.__afterSpecial);
		},
		/**
		 * after or equals special date
		 * @param momentValue {momentjs} datetime momentjs
		 * @param model {{}} model itself
		 * @param check {{}}
		 * @param format {string} datetime format, momentjs
		 * @param label {string} label in error message
		 * @returns {string|string[]|boolean}
		 * @private
		 */
		__afterSpecial: function (momentValue, model, check, format, label) {
			var compareValue = $pt.ValidateRules.__convertToMomentValue(check, model, format);
			if (compareValue !== null) {
				if (momentValue.unix() < compareValue.unix()) {
					if (typeof check === "string") {
						return $pt.getMessage('validate.date.after').format(['%1', label ? label : check]);
					}
					return $pt.getMessage('validate.date.after').format(['%1', compareValue.format(format)]);
				}
			}
			return true;
		},
		/**
		 * convert value to momentjs object
		 * @param value {string|momentjs|function}
		 * @param model {{}} model itself
		 * @param format {string} datetime format, momentjs
		 * @returns {momentjs}
		 * @private
		 */
		__convertToMomentValue: function (value, model, format) {
			var compareValue = null;
			if (value === "now") {
				compareValue = moment();
			} else if (value.unix !== undefined) {
				// value is a moment value
				compareValue = value;
			} else if (typeof (value) === "function") {
				compareValue = value();
			} else if (model.get(value) !== undefined) {
				// value from another property
				if (model.get(value) !== null) {
					compareValue = moment(model.get(value), format);
				}
			} else {
				// plain date time string
				compareValue = moment(value, format);
			}
			return compareValue;
		},
		/**
		 * compare data
		 * @param value {momentjs} property value
		 * @param model {{}} model itself
		 * @param settings {{format: string, rule: string|function|momentjs, label:string}|string|function|momentjs}
		 *      can be JSON object
		 *          format: momentjs format
		 *          rule: check rule, string or function or momentjs or array of three types.
		 *                  can be 'now' if it is a string,
		 *                  or be property id of model if it is a string.
		 *          label: label in error message, optional.
		 *              if rule is an array, and label declared, it must be an array which same length with rule property.
		 *      can be string or function or momentjs or array of three types.
		 *      if check rule is function, return a momentjs object
		 * @param checkFunc {function}
		 * @returns {string[]|string|boolean}
		 * @private
		 */
		__dateCompare: function (value, model, settings, checkFunc) {
			if (value == null) {
				return true;
			}
			var format = typeof settings.format === "string" ? settings.format : $pt.ComponentConstants.Default_Date_Format;
			var checks = settings.rule ? settings.rule : settings;
			var labels = settings.rule ? settings.label : null;
			var dateValue = moment(value, format);
			var results = [];
			if (Array.isArray(checks)) {
				for (var index = 0, count = checks.length; index < count; index++) {
					var check = checks[index];
					var label = labels ? labels[index] : null;
					results.push(checkFunc(dateValue, model, check, format, label));
				}
			} else {
				results.push(checkFunc(dateValue, model, checks, format, labels));
			}
			var messages = results.filter(function (result) {
				return result !== true;
			});
			return messages.length === 0 ? true : (messages.length == 1 ? messages[0] : messages);
		},
		/**
		 * table detail validate method
		 * @param model {{}} model itself
		 * @param value {{}[]} value of property, must be an array
		 * @param config {{}} validate rules config
		 * @returns {TableValidationResult|boolean}
		 */
		table: function (model, value, config) {
			if (value == null || value.length == 0) {
				// no data
				return true;
			}

			var results = $pt.createTableValidationResult();
			var validator = $pt.createModelValidator(config);
			for (var index = 0, count = value.length; index < count; index++) {
				var item = value[index];
				var itemModel = $pt.createModel(item, validator);
				itemModel.validate();
				var error = itemModel.getError();
				if (Object.keys(error).length !== 0) {
					results.push(item, error);
				} else {
					results.remove(item);
				}
			}

			return results.hasError() ? results : true;
		}
	};

	/**
	 * model validator
	 * @type {class}
	 */
	var ModelValidator = jsface.Class({
		constructor: function (validatorConfigs, rules) {
			if (Array.isArray(validatorConfigs)) {
				this.__validator = {};
				$.extend.apply($, [true, this.__validator].concat(validatorConfigs));
			} else {
				this.__validator = validatorConfigs;
			}
			this.__rules = rules;
			if (this.__rules === undefined) {
				this.__rules = $pt.ValidateRules;
			} else {
				this.__rules = $.extend(true, $pt.ValidateRules, rules);
			}
		},
		/**
		 * get configuration
		 * @param id {string} optional
		 * @returns {*}
		 */
		getConfig: function (id) {
			if (id) {
				return this.__validator[id];
			}
			return this.__validator;
		},
		/**
		 * get rule
		 * @param ruleName
		 * @returns {*}
		 */
		getRule: function (ruleName) {
			return this.__rules[ruleName];
		},
		/**
		 * validate by phase
		 * @param model {ModelInterface}
		 * @param value {*}
		 * @param ruleKey {string}
		 * @param phase {string}
		 * @param ruleBody {function|{_phase:string|string[], _when: function, rule: *}|{}[]}
		 * @returns {*}
		 * @private
		 */
		_validateByPhase: function (model, value, ruleKey, phase, ruleBody) {
			var ret = null;
			if (typeof ruleBody === "function") {
				// a simple function, call it, gather the return value
				ret = ruleBody.call(this, model, value, phase);
			} else if (Array.isArray(ruleBody)) {
				// rule body is an array
				var _this = this;
				var result = ruleBody.map(function (body) {
					return _this._validateByPhase(model, value, ruleKey, phase, body);
				});
				var finalResult = [];
				result.forEach(function (item) {
					if (item == null) {
						return;
					}
					if (Array.isArray(item)) {
						// array of plain string
						item.forEach(function (i) {
							finalResult.push(i);
						});
					} else {
						// plain string
						finalResult.push(item);
					}
				});
				return finalResult;
			} else {
				var realRuleBody = ruleBody;
				var runRule = true;
				if (phase != null && ruleBody._phase) {
					realRuleBody = ruleBody.rule;
					// phase is null, run all phase, pass this block
					// no phase definition, pass this block
					if (Array.isArray(ruleBody._phase)) {
						var phaseMatched = ruleBody._phase.some(function (p) {
							return p == phase;
						});
						if (!phaseMatched) {
							runRule = false;
						}
					} else if (ruleBody._phase != phase) {
						runRule = false;
					}
				}
				// a simple json
				if (ruleBody._when) {
					realRuleBody = ruleBody.rule;
					var when = ruleBody._when.call(this, model);
					if (!when) {
						// only validate when '_when' returns true
						runRule = false;
					}
				}
				if (runRule) {
					if (typeof realRuleBody === 'function') {
						ret = realRuleBody.call(this, model, value, phase);
					} else {
						ret = this.getRule(ruleKey).call(this, model, value, realRuleBody);
					}
				}
			}
			return ret;
		},
		/**
		 * validate by phase
		 * @param model
		 * @param phase
		 * @param id
		 */
		validateByPhase: function (model, phase, id) {
			var _this = this;
			var result = null;
			if (id) {
				var config = this.getConfig(id);
				if (config == null) {
					// no rule defined
					return true;
				} else {
					result = Object.keys(config).map(function (rule) {
						var ruleBody = config[rule];
						var value = model.get(id);
						var ret = _this._validateByPhase(model, value, rule, phase, ruleBody);
						return (ret != null && ret !== true) ? ret : null;
					});
					var finalResult = [];
					result.forEach(function (item) {
						if (item == null) {
							return;
						}
						if (Array.isArray(item)) {
							// array of plain string
							item.forEach(function (i) {
								finalResult.push(i);
							});
						} else {
							// plain string
							finalResult.push(item);
						}
					});
					return finalResult.length === 0 ? true : finalResult;
				}
			} else {
				result = {};
				Object.keys(this.getConfig()).forEach(function (id) {
					var ret = _this.validateByPhase(model, phase, id);
					if (ret !== true) {
						result[id] = ret;
					}
				});
				return result;
			}
		},
		/**
		 * validate
		 * @param model
		 * @param id
		 * @returns {*}
		 */
		validate: function (model, id) {
			// validate by phase, all phases
			return this.validateByPhase(model, null, id);
		},
		/**
		 * check property is required or not
		 * @param id
		 */
		isRequired: function (id) {
			// TODO more complex scenarios need to be supported
			var config = this.getConfig(id);
			if (config == null) {
				return false;
			} else {
				return config.required != null && config.required === true;
			}
		}
	});

	/**
	 * create model validator
	 * @param config {{}|{}[]} validator configuration
	 * @param rules {{}} rules
	 * @returns {ModelValidator}
	 */
	$pt.createModelValidator = function (config, rules) {
		return new ModelValidator(config, rules);
	};

	/**
	 * model interface
	 */
	var ModelInterface = {
		/**
		 * constructor model class
		 * @param model {*}
		 * @param validator {ModelValidator}
		 */
		constructor: function (model, validator) {
			this.__base = model;
			this.__model = $pt.cloneJSON(model);
			this.__validator = validator;
			this.__validateResults = {};
			this.__changed = false;
		},
		name: function (name) {
			if (name) {
				this.__name = name;
				return this;
			} else {
				return this.__name;
			}
		},
		/**
		 * get/set parent model
		 * @param parent {*} optional
		 * @returns {*}
		 */
		parent: function (parent) {
			if (parent !== undefined) {
				this.__parent = parent;
				return this;
			} else {
				return this.__parent;
			}
		},
		/**
		 * check the model is changed or not
		 * @returns {boolean}
		 */
		isChanged: function () {
			return this.__changed;
		},
		/**
		 * get original model
		 * @returns {*}
		 */
		getOriginalModel: function () {
			return this.__base;
		},
		/**
		 * get current model
		 * @returns {*}
		 */
		getCurrentModel: function () {
			return this.__model;
		},
		/**
		 * use base model as current model
		 */
		useBaseAsCurrent: function () {
			this.__model = this.__base;
			return this;
		},
		/**
		 * merge data into current model.
		 * Attention: this is deep copy. if don't want do deep copy, use getCurrentModel, and merge manually.
		 * @param newModel {{}}
		 */
		mergeCurrentModel: function (newModel) {
			this.__model = $.extend(true, this.__model, newModel);
			return this;
		},
		/**
		 * apply current data to base model.
		 */
		applyCurrentToBase: function() {
			this.__base = $.extend(true, {}, this.__model);
			return this;
		},
		/**
		 * get validator
		 * @returns {ModelValidator}
		 */
		getValidator: function () {
			return this.__validator;
		},
		/**
		 * get value by given id
		 * @param id {string} property id
		 * @returns {*}
		 */
		get: function (id) {
			return $pt.getValueFromJSON(this.__model, id);
		},
		/**
		 * set value by given id and value
		 * @param id {string} property id
		 * @param value {*}
		 */
		set: function (id, value) {
			var oldValue = this.get(id);
			if (oldValue == value) {
				// value is same as old value
				return;
			}
			$pt.setValueIntoJSON(this.__model, id, value);
			this.__changed = true;
			this.fireEvent({
				model: this,
				id: id,
				old: oldValue,
				"new": value,
				time: "post",
				type: "change"
			});
			return this;
		},
		/**
		 * add listener
		 * @param id {string} id of property
		 * @param time {string} post|pre
		 * @param type {string} change|add|remove
		 * @param listener {function} function with parameter event
		 */
		addListener: function (id, time, type, listener) {
			if (!id) {
				// monitor all
				id = '--all';
			}
			if (id instanceof RegExp) {
				return this.__addRegExpListener(id, time, type, listener);
			} else {
				return this.__addListener(id, time, type, listener);
			}
		},
		__addRegExpListener: function (id, time, type, listener) {
			if (this.__regExpListeners === undefined) {
				this.__regExpListeners = {};
			}
			var key = time + "-" + type;
			var listeners = this.__regExpListeners[key];
			if (listeners === undefined) {
				listeners = [];
				this.__regExpListeners[key] = listeners;
			}
			var index = listeners.findIndex(function (item) {
				return item.listener === listener && item.regexp.toString() == id.toString();
			});
			if (index == -1) {
				listeners.push({
					regexp: id,
					listener: listener
				});
			}
			return this;
		},
		__addListener: function (id, time, type, listener) {
			if (this.__listeners === undefined) {
				this.__listeners = {};
			}
			var key = id + '-' + time + "-" + type;
			var listeners = this.__listeners[key];
			if (listeners === undefined) {
				listeners = [];
				this.__listeners[key] = listeners;
			}
			var index = listeners.findIndex(function (item) {
				return item === listener;
			});
			if (index == -1) {
				listeners.push(listener);
			}
			return this;
		},
		addPostChangeListener: function (id, listener) {
			return this.addListener(id, 'post', 'change', listener);
		},
		/**
		 * remove listener
		 * @param id {string} id of property
		 * @param time {string} post|pre
		 * @param type {string} change|add|remove
		 * @param listener {function} function which added
		 */
		removeListener: function (id, time, type, listener) {
			if (!id) {
				id = '--all';
			}
			if (id instanceof RegExp) {
				return this.__removeRegExpListener(id, time, type, listener);
			} else {
				return this.__removeListener(id, time, type, listener);
			}
		},
		__removeRegExpListener: function (id, time, type, listener) {
			if (this.__regExpListeners !== undefined) {
				var listeners = this.__regExpListeners[time + "-" + type];
				if (listeners != null) {
					var index = listeners.findIndex(function (item) {
						// 正则和监听器都相同
						return item.listener === listener && item.regexp.toString() == id.toString();
					});
					if (index != -1) {
						listeners.splice(index, 1);
					}
				}
			}
			return this;
		},
		__removeListener: function (id, time, type, listener) {
			if (this.__listeners !== undefined) {
				var listeners = this.__listeners[id + "-" + time + "-" + type];
				if (listeners != null) {
					// listeners is an array
					var index = listeners.findIndex(function (item) {
						return item === listener;
					});
					if (index != -1) {
						listeners.splice(index, 1);
					}
				}
			}
			return this;
		},
		removePostChangeListener: function (id, listener) {
			this.removeListener(id, 'post', 'change', listener);
		},
		firePostChangeEvent: function(id, _old, _new) {
			this.fireEvent({
				model: this,
				id: id,
				old: _old,
				"new": _new,
				time: "post",
				type: "change"
			});
		},
		/**
		 * fire event
		 * @param evt {{type:string, time:string, id:string}} and more properties depend on event type
		 */
		fireEvent: function (evt) {
			// copy listeners array is very important.
			// since change will invoke validate by FormCell,
			// then validate will invoke forceUpdate,
			// then forceUpdate will invoke remove listener,
			// finally the original listeners are changed,
			// so maybe some listener will not be invoked.
			// this bug was found the relationship of 2 select2 component.
			var listenersCopy = [];

			// find listeners which defined on property
			var key = evt.id + "-" + evt.time + "-" + evt.type;
			var listeners = this.__listeners ? this.__listeners[key] : null;
			if (listeners != null && listeners.length != 0) {
				listenersCopy.push.apply(listenersCopy, listeners);
			}
			// find listeners which monitor all
			key = '--all-' + evt.time + "-" + evt.type;
			listeners = this.__listeners ? this.__listeners[key] : null;
			if (listeners != null && listeners.length != 0) {
				listenersCopy.push.apply(listenersCopy, listeners);
			}
			// find listeners which defined as regexp
			key = evt.time + '-' + evt.type;
			listeners = this.__regExpListeners ? this.__regExpListeners[key] : null;
			if (listeners != null && listeners.length != 0) {
				listeners.forEach(function (item) {
					if (evt.id.match(item.regexp)) {
						listenersCopy.push.apply(listenersCopy, [item.listener]);
					}
				});
			}

			var _this = this;
			listenersCopy.forEach(function (listener) {
				listener.call(_this, evt);
			});
			return this;
		},
		/**
		 * reset model
		 */
		reset: function () {
			this.__model = $pt.cloneJSON(this.__base);
			this.__validateResults = {};
			this.__changed = false;
			return this;
		},
		/**
		 * clear validate results
		 * @param id {string} property id
		 */
		clearValidateResults: function (id) {
			if (id) {
				delete this.__validateResults[id]
				;
			} else {
				this.__validateResults = {};
			}
			return this;
		},
		/**
		 * validate by phase
		 * @param phase
		 * @param id
		 */
		validateByPhase: function (phase, id) {
			var validator = this.getValidator();
			if (validator === undefined || validator === null) {
				// do nothing
				return this;
			}
			if (id) {
				var ret = validator.validateByPhase(this, phase, id);
				if (ret !== true) {
					this.__validateResults[id] = ret;
				} else {
					delete this.__validateResults[id]
					;
				}
				this.fireEvent({
					model: this,
					id: id,
					time: "post",
					type: "validate"
				});
			} else {
				this.__validateResults = validator.validateByPhase(this, phase);
				var _this = this;
				Object.keys(this.getCurrentModel()).forEach(function (id) {
					_this.fireEvent({
						model: this,
						id: id,
						time: "post",
						type: "validate"
					});
				});
			}
			return this;
		},
		/**
		 * validate value of give property id, or whole model if no parameter passed.
		 * will fire post-validate event for each property after validation
		 * @param id {string} property id
		 */
		validate: function (id) {
			return this.validateByPhase(null, id);
		},
		/**
		 * check the property is required or not
		 * @param id {string} property id
		 * @returns {boolean}
		 */
		isRequired: function (id) {
			var validator = this.getValidator();
			return validator != null && validator.isRequired(id);
		},
		/**
		 * get error of given id, or return all error when no parameter passed
		 * @param id {string} property id
		 * @returns {*}
		 */
		getError: function (id) {
			if (id) {
				// property level
				return this.__validateResults[id];
			} else {
				return this.__validateResults;
			}
		},
		/**
		 * check the model is has error or not, check property only when id appointed,
		 * or check whole model when no parameter passed.
		 * @returns {boolean}
		 */
		hasError: function (id) {
			if (id) {
				// property level
				return this.__validateResults[id] != null;
			} else {
				return Object.keys(this.__validateResults).length != 0;
			}
		},
		mergeError: function (error, id) {
			if (id) {
				if (error) {
					this.__validateResults[id] = error;
				} else {
					delete this.__validateResults[id];
				}
			} else {
				this.__validateResults = error ? error : {};
			}
			return this;
		},
		/**
		 * remove row from given id
		 * @param id {string} property id
		 * @param row {{}} row data
		 */
		remove: function (id, row) {
			var data = this.get(id);
			if (data == null || data.length == 0) {
				return this;
			}
			var index = data.findIndex(function (item) {
				return item === row;
			});
			if (index != -1) {
				data.splice(index, 1);
				this.__changed = true;
				this.fireEvent({
					model: this,
					id: id,
					array: data, // after remove
					index: index,
					old: row,
					"new": null,
					type: "remove",
					time: "post"
				});
			}
			return this;
		},
		/**
		 * add row into array by given id
		 * @param id {string} property id
		 * @param row {{}} row data
		 */
		add: function (id, row, index) {
			var data = this.get(id);
			if (data == null) {
				data = [];
				// do not call #set, since #set will invoke event
				this.__model[id] = data;
			}
			var findIndex = data.findIndex(function (item) {
				return item === row;
			});
			if (findIndex == -1) {
				if (index == null) {
					data.push(row);
					index = data.length - 1;
				} else {
					if (index >= data.length) {
						index = data.length;
					}
					data.splice(index, 0, row);
				}
				this.__changed = true;
				this.fireEvent({
					model: this,
					id: id,
					array: data, // after add
					index: index,
					old: null,
					"new": row,
					type: "add",
					time: "post"
				});
			}
			return this;
		},
		/**
		 * update new item instead of old item
		 * @param id {string} property id
		 * @param _old {{}} old row data
		 * @param _new {{}} new row data
		 */
		update: function (id, _old, _new) {
			var data = this.get(id);
			if (data == null) {
				return this;
			}
			var index = data.findIndex(function (item) {
				return item === _old;
			});
			if (index != -1) {
				data.splice(index, 1, _new);
				this.__changed = true;
				this.fireEvent({
					model: this,
					id: id,
					array: data, // after update
					index: index,
					old: _old,
					"new": _new,
					type: "change",
					time: "post"
				});
			}
			return this;
		}
	};

	/**
	 * create model
	 * @param jsonObjects {*|*[]}
	 * @param validator {ModelValidator}
	 */
	$pt.createModel = function (jsonObjects, validator) {
		// create model

		var inputModel = null;
		if (Array.isArray(jsonObjects)) {
			// merge all json objects into one
			inputModel = {};
			$.extend.apply($, [true, inputModel].concat(jsonObjects));
		} else {
			inputModel = jsonObjects == null ? {} : jsonObjects;
		}

		var model = {};

		if ($pt.BUILD_PROPERTY_VISITOR) {
			// create getter and setter
			Object.keys(inputModel).forEach(function (key) {
				var name = key.upperFirst();
				model['get' + name] = function () {
					return this.get(key);
				};
				model['set' + name] = function (value) {
					this.set(key, value);
				};
			});
		}
		var ModelClass = jsface.Class($.extend(model, ModelInterface));
		return new ModelClass(inputModel, validator);
	};
})(this, jQuery);
