// react-bootstrap tag name redefine
var Button = ReactBootstrap.Button;
var ButtonGroup = ReactBootstrap.ButtonGroup;
var ButtonToolbar = ReactBootstrap.ButtonToolbar;
var Glyphicon = ReactBootstrap.Glyphicon;
var Modal = ReactBootstrap.Modal;
var Panel = ReactBootstrap.Panel;

(function (context) {
    if ($.browser.msie && $.browser.versionNumber <= 10) {
        var method;
        var noop = function () {
        };
        var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group',
            'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'table', 'time',
            'timeEnd', 'timeStamp', 'trace', 'warn'];
        var length = methods.length;
        var console = (window.console = window.console || {});

        while (length--) {
            method = methods[length];

            // Only stub undefined methods.
            if (!console[method]) {
                console[method] = noop;
            }
        }
    }

    // add upperFirst function to String
    if (String.prototype.upperFirst === undefined) {
        String.prototype.upperFirst = function () {
            if (this.length == 1) {
                return this.toUpperCase();
            } else {
                return this.substring(0, 1).toUpperCase() + this.substring(1);
            }
        };
    }
    if (String.prototype.endsWith === undefined) {
        String.prototype.endsWith = function (suffix) {
            return this.indexOf(suffix, this.length - suffix.length) !== -1;
        };
    }
    if (String.prototype.trim === undefined) {
        String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/gm, '');
        };
    }
    if (String.prototype.isEmpty === undefined) {
        String.prototype.isEmpty = function () {
            return this === "";
        };
    }
    if (String.prototype.isBlank === undefined) {
        String.prototype.isBlank = function () {
            return this.trim() === "";
        };
    }
    /**
     * replace place holders %1, %2, etc with given string array
     *
     * @param strArray
     * @returns
     */
    if (String.prototype.format === undefined) {
        String.prototype.format = function (strArray) {
            return this.replace(/%(\d+)/g, function (_, m) {
                return strArray[--m];
            });
        };
    }
    /**
     * find element from array, return null if not found.
     */
    if (Array.prototype.find === undefined) {
        Array.prototype.find = function (func) {
            for (var index = 0, count = this.length; index < count; index++) {
                if (func.call(this, this[index], index, this)) {
                    return this[index];
                }
            }
            return null;
        };
    }
    /**
     * find element index from array, return -1 if not found.
     */
    if (Array.prototype.findIndex === undefined) {
        Array.prototype.findIndex = function (func) {
            for (var index = 0, count = this.length; index < count; index++) {
                if (func.call(this, this[index], index, this)) {
                    return index;
                }
            }
            return -1;
        };
    }

    // jsface conflict
    jsface.noConflict();

    // constants
    /**
     * component constants
     * @type {class}
     */
    var ComponentConstants = {
        // component types
        Text: "text",
        Select: "select",
        Check: "check",
        Table: "table",
        Date: "date",
        Search: "search",
        // exception codes
        Err_Unsupported_Component: "NEST-00001",
        Err_Unuspported_Column_Sort: "NEXT_00002"
    };

    // exceptions
    /**
     * component exception
     * @param value
     * @param message
     * @constructor
     */
    var ComponentException = function (value, message) {
        this.value = value;
        this.message = message;
        this.toString = function () {
            return this.value + ": " + this.message;
        };
    };

    // code table
    /**
     * code table sorter
     * @type {class}
     */
    var CodeTableSorter = jsface.Class({
        constructor: function (otherId) {
            this.otherId = otherId;
        },
        sort: function (codes) {
            var _this = this;
            codes.sort(function (a, b) {
                if (_this.otherId) {
                    if (a.id == _this.otherId) {
                        return 1;
                    } else if (b.id == _this.otherId) {
                        return -1;
                    }
                }
                return a.text < b.text ? -1 : (a.text > b.text ? 1 : 0);
            });
        }
    });
    /**
     * code table
     * @type {class}
     */
    var CodeTable = jsface.Class({
        /**
         * construct code table
         * @param codeTableArray array of json object, eg: {id:"1", text:"text"}
         * @param renderer optional
         * @param sorter {CodeTableSorter} optional
         */
        constructor: function (codeTableArray, renderer, sorter) {
            this.codes = codeTableArray;
            var map = {};
            this.codes.forEach(function (code) {
                map[code.id] = code;
                if (renderer) {
                    code.text = renderer(code);
                }
            });
            this.map = map;
            if (sorter) {
                sorter.sort(this.codes);
            }
        },
        filter: function (func) {
            return this.codes.filter(func);
        },
        get: function (code) {
            return this.map[code];
        },
        getText: function (code) {
            var item = this.get(code);
            return (item === undefined || item === null) ? null : item.text;
        },
        list: function () {
            return this.codes;
        },
        some: function (func) {
            return this.codes.some(func);
        }
    });

    // layout
    /**
     * cell layout
     * @type {class}
     */
    var CellLayout = jsface.Class({
        constructor: function (id, cell) {
            this.__id = id;
            this.__cell = cell;
        },
        /**
         * get id
         * @returns {*}
         */
        getId: function () {
            return this.__id;
        },
        /**
         * get row index
         * @returns {string}
         */
        getRowIndex: function () {
            return this.__cell.pos.row;
        },
        /**
         * get column index
         * @returns {Array|string|boolean|*}
         */
        getColumnIndex: function () {
            return this.__cell.pos.col;
        },
        /**
         * get width of cell, default is 3
         * @returns {number}
         */
        getWidth: function () {
            return this.__cell.pos.width ? this.__cell.pos.width : 3;
        },
        /**
         * get cell CSS, if not defined, return empty string
         * @param originalCSS optional
         * @returns {string}
         */
        getCellCSS: function (originalCSS) {
            return this.getAdditionalCSS("cell", originalCSS);
        },
        /**
         * get component type
         * @returns {string}
         */
        getComponentType: function () {
            var type = this.getComponentOption("type");
            return type === null ? $pt.ComponentConstants.Text : type;
        },
        /**
         * get component option by given key, return null when not defined
         * @param key optional, return all options if parameter not passed
         * @param defaultValue optional, only effective when key passed
         * @returns {*}
         */
        getComponentOption: function (key, defaultValue) {
            if (key) {
                if (defaultValue === undefined) {
                    defaultValue = null;
                }
                if (this.__cell.comp) {
                    var option = this.__cell.comp[key];
                    return option === undefined ? defaultValue : option;
                } else {
                    return defaultValue;
                }
            }
            return this.__cell.comp === undefined ? {} : this.__cell.comp;
        },
        /**
         * set component option by given key and value
         * @param key
         * @param value
         */
        setComponentOption: function (key, value) {
            if (this.__cell.comp === undefined) {
                this.__cell.comp = {};
            }
            this.__cell.comp[key] = value;
        },
        /**
         * get label
         * @returns {string}
         */
        getLabel: function () {
            return this.__cell.label;
        },
        /**
         * get label CSS, return empty string if not defined
         * @param originalCSS optional
         * @returns {string}
         */
        getLabelCSS: function (originalCSS) {
            return this.getAdditionalCSS("label", originalCSS);
        },
        /**
         * is additional css defined
         * @param key optional
         * @returns {boolean}
         */
        isAdditionalCSSDefined: function (key) {
            if (key) {
                return this.isAdditionalCSSDefined() && this.__cell.css[key] !== undefined;
            }
            return this.__cell.css !== undefined;
        },
        /**
         * get additional css object, return {} when not defined
         * @param key optional, return string or empty string(not defined) when passed this parameter
         * @param originalCSS optional, combine with additional CSS if exists
         * @returns {*|string}
         */
        getAdditionalCSS: function (key, originalCSS) {
            if (key) {
                var additionalCSS = this.isAdditionalCSSDefined(key) ? this.__cell.css[key] : "";
                if (originalCSS !== undefined && originalCSS.length !== 0) {
                    return originalCSS + " " + additionalCSS;
                } else {
                    return additionalCSS;
                }
            }
            return this.isAdditionalCSSDefined() ? this.__cell.css : {};
        }
    });
    /**
     * row layout
     * @type {class}
     */
    var RowLayout = jsface.Class({
        constructor: function (rowIndex) {
            this.__rowIndex = rowIndex;
        },
        /**
         * get row index
         * @returns {number}
         */
        getRowIndex: function () {
            return this.__rowIndex;
        },
        /**
         * add cell
         */
        addCell: function (cell) {
            if (this.__cells === undefined) {
                this.__cells = [];
            }
            this.__cells.push(cell);
            this.__cells.sort(function (c1, c2) {
                return c1.getColumnIndex() - c2.getColumnIndex();
            });
        },
        /**
         * get cells
         * @returns {[CellLayout]}
         */
        getCells: function () {
            return this.__cells;
        }
    });
    /**
     * form layout
     * @type {class}
     */
    var FormLayout = jsface.Class({
        /**
         * constructor of FormLayout, accepts one or more json object
         */
        constructor: function (layouts) {
            // all cells map
            this.__all = {};
            var all = this.__all;
            // an json object, contains key of rowIndex
            var rows = {};
            layouts.forEach(function (argu) {
                // read cells of arguments
                Object.keys(argu).forEach(function (key) {
                    var cell = new CellLayout(key, argu[key]);
                    all[cell.getId()] = cell;
                    var rowIndex = cell.getRowIndex();
                    var rowLayout = rows[rowIndex];
                    if (rowLayout === undefined) {
                        // initialize row layout
                        rowLayout = new RowLayout(rowIndex);
                        rows[rowIndex] = rowLayout;
                    }
                    rowLayout.addCell(cell);
                });
            });
            // put rows json to array
            this.__rows = [];
            var rowsArray = this.__rows;
            Object.keys(rows).forEach(function (key) {
                rowsArray.push(rows[key]);
            });
            // sort
            rowsArray.sort(function (r1, r2) {
                return r1.getRowIndex() - r2.getRowIndex();
            });
        },
        /**
         * get all rows
         * @returns {[RowLayout]}
         */
        getRows: function () {
            return this.__rows;
        },
        /**
         * get cell layout
         */
        getCell: function (id) {
            return this.__all[id];
        }
    });

    /**
     * table column layout, an array like object
     * @type {class}
     */
    var TableColumnLayout = jsface.Class({
        constructor: function (columns) {
            this.__columns = columns;
        },
        /**
         * clone
         * @returns {TableColumnLayout}
         */
        clone: function () {
            return new TableColumnLayout(this.__columns.slice(0));
        },
        columns: function () {
            return this.__columns;
        },
        get: function (index) {
            return this.__columns[index];
        },
        // implements methods of array
        push: function (column) {
            this.__columns.push(column);
        },
        splice: function (index, removeCount, newItem) {
            this.__columns.splice(index, removeCount, newItem);
        },
        map: function (func) {
            return this.__columns.map(func);
        },
        forEach: function (func) {
            this.__columns.forEach(func);
        },
        length: function () {
            return this.__columns.length;
        },
        some: function (func) {
            return this.__columns.some(func);
        }
    });

    // validation
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
         * push
         * @param model
         * @param error
         */
        push: function (model, error) {
            this.__errors[this.__startKeyIndex] = error;
            this.__models[this.__startKeyIndex] = model;
            this.__startKeyIndex++;
        },
        /**
         * remove
         * @param model
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
         * @param model
         * @returns {*}
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
     * validate rules
     * @type {class}
     */
    var ValidateRules = {
        required: function (model, value) {
            if (value === null || value.toString().isEmpty()) {
                return "\"%1\" is Required.";
            } else {
                return true;
            }
        },
        length: function (model, value, length) {
            if (value === null) {
                return true;
            } else if (value.length != length) {
                return "Length of \"%1\" should be " + length + ".";
            }
        },
        maxlength: function (model, value, length) {
            if (value === null) {
                return true;
            } else if (value.length > length) {
                return "Length of \"%1\" cannot be more than " + length + ".";
            }
        },
        minlength: function (model, value, length) {
            if (value === null) {
                return true;
            } else if (value.length < length) {
                return "Length of \"%1\" cannot be less than " + length + ".";
            }
        },
        maxsize: function (model, value, size) {
            if (value === null || value.length === 0) {
                return true;
            } else if (value.length > size) {
                return "Size of \"%1\" cannot be more than " + size + ".";
            }
        },
        minsize: function (model, value, size) {
            if (value === null || value.length < size) {
                return "Size of \"%1\" cannot be less than " + size + ".";
            } else {
                return true;
            }
        },
        before: function (model, value, settings) {
            return ValidateRules.__dateCompare(value, model, settings, ValidateRules.__beforeSpecial);
        },
        /**
         * before special time
         * @param momentValue
         * @param model
         * @param check
         * @param format
         * @param label
         * @returns {*}
         * @private
         */
        __beforeSpecial: function (momentValue, model, check, format, label) {
            var compareValue = ValidateRules.__convertToMomentValue(check, model, format);
            if (compareValue !== null) {
                if (momentValue.unix() > compareValue.unix()) {
                    if (typeof check === "string") {
                        return "Value of \"%1\" must be before than " + (label ? label : check) + ".";
                    }
                    return "Value of \"%1\" must be before than \"" + compareValue.format(format) + "\".";
                }
            }
            return true;
        },
        after: function (model, value, settings) {
            return ValidateRules.__dateCompare(value, model, settings, ValidateRules.__afterSpecial);
        },
        /**
         * after special time
         * @param momentValue
         * @param model
         * @param check
         * @param format
         * @param label
         * @returns {*}
         * @private
         */
        __afterSpecial: function (momentValue, model, check, format, label) {
            var compareValue = ValidateRules.__convertToMomentValue(check, model, format);
            if (compareValue !== null) {
                if (momentValue.unix() < compareValue.unix()) {
                    if (typeof check === "string") {
                        return "Value of \"%1\" must be after than " + (label ? label : check) + ".";
                    }
                    return "Value of \"%1\" must be after than \"" + compareValue.format(format) + "\".";
                }
            }
            return true;
        },
        /**
         * convert value to momentjs object
         * @param value
         * @param model
         * @param format
         * @returns {*}
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
         * @param value
         * @param model
         * @param settings
         * @param checkFunc
         * @returns {[string]|string}
         * @private
         */
        __dateCompare: function (value, model, settings, checkFunc) {
            if (value === null) {
                return true;
            }
            var format = typeof settings.format === "string" ? settings.format : "YYYY/MM/DD";
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
         * @param model
         * @param value
         * @param config
         */
        table: function (model, value, config) {
            if (value === null || value.length === 0) {
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
        constructor: function (validatorConfig, rules) {
            this.__validator = validatorConfig;
            this.__rules = rules;
            if (this.__rules === undefined) {
                this.__rules = ValidateRules;
            }
        },
        /**
         * get configuration
         * @returns {*}
         */
        getConfig: function () {
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
         * validate
         * @param model
         * @param id
         * @returns {*}
         */
        validate: function (model, id) {
            var _this = this;
            var result = null;
            if (id) {
                var config = this.getConfig()[id];
                if (config === undefined || config === null) {
                    // no rule defined
                    return true;
                } else {
                    result = Object.keys(config).map(function (rule) {
                        var ret = null;
                        var ruleBody = config[rule];
                        var value = model.get(id);
                        if (typeof ruleBody === "function") {
                            ret = ruleBody.call(_this, model, value);
                        } else {
                            ret = _this.getRule(rule).call(_this, model, value, ruleBody);
                        }
                        return (ret !== undefined && ret !== null && ret !== true) ? ret : null;
                    });
                    var finalResult = [];
                    result.forEach(function (item) {
                        if (item === null) {
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
                    var ret = _this.validate(model, id);
                    if (ret !== true) {
                        result[id] = ret;
                    }
                });
                return result;
            }
        }
    });

    // model
    var cloneJSON = function (jsonObject) {
        return $.extend(true, {}, jsonObject);
    };
    /**
     * model utilities
     * @type {class}
     */
    var ModelUtil = jsface.Class({
        $statics: {
            /**
             * create model
             * @param jsonObject
             * @param objectValidator {ModelValidator}
             */
            createModel: function (jsonObject, objectValidator) {
                // create model
                var model = {
                    constructor: function (model, objectValidator) {
                        this.__base = model;
                        this.__model = cloneJSON(model);
                        this.__validator = objectValidator;
                        this.__validateResults = {};
                        this.__changed = false;
                    },
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
                    getValidator: function () {
                        return this.__validator;
                    },
                    get: function (id) {
                        return this.__model[id];
                    },
                    set: function (id, value) {
                        var oldValue = this.__model[id];
                        if (oldValue == value) {
                            // value is same as old value
                            return;
                        }
                        this.__model[id] = value;
                        this.__changed = true;
                        this.fireEvent({
                            id: id,
                            old: oldValue,
                            "new": value,
                            time: "post",
                            type: "change"
                        });
                    },
                    /**
                     * add listener
                     * @param id id of property
                     * @param time post|pre
                     * @param type change|add|remove
                     * @param listener
                     */
                    addListener: function (id, time, type, listener) {
                        if (this.listeners === undefined) {
                            this.listeners = {};
                        }
                        var key = id + "-" + time + "-" + type;
                        var listeners = this.listeners[key];
                        if (listeners === undefined) {
                            listeners = [];
                            this.listeners[key] = listeners;
                        }
                        var index = listeners.findIndex(function (item) {
                            return item == listener;
                        });
                        if (index == -1) {
                            listeners.push(listener);
                        }
                    },
                    /**
                     * remove listener
                     * @param id id of property
                     * @param time post|pre
                     * @param type change|add|remove
                     * @param listener
                     */
                    removeListener: function (id, time, type, listener) {
                        if (this.listeners !== undefined) {
                            var listeners = this.listeners[id + "-" + time + "-" + type];
                            if (listeners !== undefined) {
                                // listeners is an array
                                var index = listeners.findIndex(function (item) {
                                    return item === listener;
                                });
                                if (index != -1) {
                                    listeners.splice(index, 1);
                                }
                            }
                        }
                    },
                    /**
                     * fire event
                     * @param evt
                     */
                    fireEvent: function (evt) {
                        if (this.listeners === undefined) {
                            // no listner defined
                            return;
                        }
                        var key = evt.id + "-" + evt.time + "-" + evt.type;
                        var listeners = this.listeners[key];
                        if (listeners === undefined || listeners.length === 0) {
                            // no listener defined
                            return;
                        }
                        // copy listeners array is very important.
                        // since change will invoke validate by FormCell,
                        // then validate will invoke forceUpdate,
                        // then forceUpdate will invoke remove listener,
                        // finally the original listeners are changed,
                        // so maybe some listener will not be invoked.
                        // this bug was found the relationship of 2 select2 component.
                        var listenersCopy = [];
                        listenersCopy.push.apply(listenersCopy, listeners);
                        var _this = this;
                        listenersCopy.forEach(function (listener) {
                            listener.call(_this, evt);
                        });
                    },
                    /**
                     * reset model
                     */
                    reset: function () {
                        this.__model = $pt.cloneJSON(this.__base);
                        this.__validateResults = {};
                        this.__changed = false;
                    },
                    /**
                     * validate
                     */
                    validate: function (id) {
                        var validator = this.getValidator();
                        if (validator === undefined || validator === null) {
                            // do nothing
                            return;
                        }
                        if (id) {
                            var ret = validator.validate(this, id);
                            if (ret !== true) {
                                this.__validateResults[id] = ret;
                            } else {
                                delete this.__validateResults[id];
                            }
                            this.fireEvent({
                                id: id,
                                time: "post",
                                type: "validate"
                            });
                        } else {
                            this.__validateResults = validator.validate(this);
                            var _this = this;
                            Object.keys(this.getCurrentModel()).forEach(function (id) {
                                _this.fireEvent({
                                    id: id,
                                    time: "post",
                                    type: "validate"
                                });
                            });
                        }
                    },
                    /**
                     * check the property is required or not
                     * @param id
                     */
                    isRequired: function (id) {
                        var validator = this.getValidator();
                        return validator && validator.getConfig() && validator.getConfig()[id] && validator.getConfig()[id].required !== undefined;
                    },
                    getError: function (id) {
                        if (id) {
                            // property level
                            return this.__validateResults[id];
                        } else {
                            return this.__validateResults;
                        }
                    },
                    /**
                     * check the model is has error or not
                     * @returns {boolean}
                     */
                    hasError: function (id) {
                        if (id) {
                            // property level
                            return this.__validateResults[id] !== undefined && this.__validateResults[id] !== null;
                        } else {
                            return Object.keys(this.__validateResults).length !== 0;
                        }
                    },
                    /**
                     * remove row from given id
                     * @param id
                     * @param row
                     */
                    remove: function (id, row) {
                        var data = this.get(id);
                        if (data === null || data.length === 0) {
                            return;
                        }
                        var index = data.findIndex(function (item) {
                            return item == row;
                        });
                        if (index != -1) {
                            data.splice(index, 1);
                            this.__changed = true;
                            this.fireEvent({
                                id: id,
                                array: data, // after remove
                                index: index,
                                old: row,
                                "new": null,
                                type: "remove",
                                time: "post"
                            });
                        }
                    },
                    /**
                     * add row into array by given id
                     * @param id
                     * @param row
                     */
                    add: function (id, row) {
                        var data = this.get(id);
                        if (data === null) {
                            data = [];
                            // do not call #set, since #set will invoke event
                            this.__model[id] = data;
                        }
                        var index = data.findIndex(function (item) {
                            return item == row;
                        });
                        if (index == -1) {
                            data.push(row);
                            this.__changed = true;
                            this.fireEvent({
                                id: id,
                                array: data,    // after add
                                index: data.length - 1,
                                old: null,
                                "new": row,
                                type: "add",
                                time: "post"
                            });
                        }
                    },
                    /**
                     * update new item instead of old item
                     * @param id
                     * @param _old
                     * @param _new
                     */
                    update: function (id, _old, _new) {
                        var data = this.get(id);
                        if (data === null) {
                            return;
                        }
                        var index = data.findIndex(function (item) {
                            return item == _old;
                        });
                        if (index != -1) {
                            data.splice(index, 1, _new);
                            this.__changed = true;
                            this.fireEvent({
                                id: id,
                                array: data, // after update
                                index: index,
                                old: _old,
                                "new": _new,
                                type: "change",
                                time: "post"
                            });
                        }
                    }
                };
                // create getter and setter
                Object.keys(jsonObject).forEach(function (key) {
                    var name = key.upperFirst();
                    model["get" + name] = function () {
                        return this.get(key);
                    };
                    model["set" + name] = function (value) {
                        this.set(key, value);
                    };
                });
                var ModelClass = jsface.Class(model);
                return new ModelClass(jsonObject, objectValidator);
            }
        }
    });

    // component
    /**
     * Component Base
     * @type {*}
     */
    var ComponentBase = {
        /**
         * get component
         * @returns {*|jQuery|HTMLElement}
         */
        getComponent: function () {
            return $("#" + this.getId());
        },
        /**
         * get model
         * @returns {*}
         */
        getModel: function () {
            return this.props.model;
        },
        /**
         * get value from model
         * @returns {*}
         */
        getValueFromModel: function () {
            return this.getModel().get(this.getId());
        },
        /**
         * set value to model
         * @param value
         */
        setValueToModel: function (value) {
            this.getModel().set(this.getId(), value);
        },
        /**
         * get layout
         * @returns {CellLayout}
         */
        getLayout: function () {
            return this.props.layout;
        },
        /**
         * get id of component
         * @returns {string}
         */
        getId: function () {
            return this.getLayout().getId();
        },
        /**
         * get component css
         * @param originalCSS original CSS
         * @returns {string}
         */
        getComponentCSS: function (originalCSS) {
            return this.getCombineCSS(originalCSS, "comp");
        },
        /**
         * get combine css
         * @param originalCSS css class names
         * @param additionalKey key of additional css in layout
         * @returns {string}
         */
        getCombineCSS: function (originalCSS, additionalKey) {
            return this.getLayout().getAdditionalCSS(additionalKey, originalCSS);
        },
        /**
         * get option
         * @param key
         */
        getComponentOption: function (key) {
            var option = this.getLayout().getComponentOption(key);
            if (option === null) {
                option = this.props.defaultOptions[key];
            }
            return option === undefined ? null : option;
        },
        /**
         * get component rule value.
         * get component option by given key. return default value if not defined.
         * otherwise call when function and return.
         * @param key
         * @param defaultValue
         * @returns {*}
         */
        getComponentRuleValue: function (key, defaultValue) {
            var rule = this.getComponentOption(key);
            if (rule === null) {
                return defaultValue;
            } else {
                var when = rule.when;
                return when.call(this, this.getModel(), this.getValueFromModel());
            }
        },
        /**
         * is enabled
         * @returns {boolean}
         */
        isEnabled: function () {
            return this.getComponentRuleValue("enabled", true);
        },
        /**
         * is visible
         * @returns {boolean}
         */
        isVisible: function () {
            return this.getComponentRuleValue("visible", true);
        },
        /**
         * is read only
         * @returns {boolean}
         */
        isReadonly: function () {
            return this.getComponentRuleValue("readonly", false);
        },

        // event
        addPostChangeListener: function (listener) {
            this.getModel().addListener(this.getId(), "post", "change", listener);
        },
        removePostChangeListener: function (listener) {
            this.getModel().removeListener(this.getId(), "post", "change", listener);
        },
        addPostAddListener: function (listener) {
            this.getModel().addListener(this.getId(), "post", "add", listener);
        },
        removePostAddListener: function (listener) {
            this.getModel().removeListener(this.getId(), "post", "add", listener);
        },
        addPostRemoveListener: function (listener) {
            this.getModel().addListener(this.getId(), "post", "remove", listener);
        },
        removePostRemoveListener: function (listener) {
            this.getModel().removeListener(this.getId(), "post", "remove", listener);
        },
        addPostValidateListener: function (listener) {
            this.getModel().addListener(this.getId(), "post", "validate", listener);
        },
        removePostValidateListener: function (listener) {
            this.getModel().removeListener(this.getId(), "post", "validate", listener);
        }
    };

    /**
     * create $pt
     * @type {*}
     */
    context.$pt = {
        ComponentConstants: ComponentConstants,
        /**
         * create component exception
         * @param code {string}
         * @param message {string}
         * @returns {ComponentException}
         */
        createComponentException: function (code, message) {
            return new ComponentException(code, message);
        },
        /**
         * create default code table sorter
         * @param otherId {string} optional. if appointed, item with this id will be last one.
         * @returns {CodeTableSorter}
         */
        createDefaultCodeTableSorter: function (otherId) {
            return new CodeTableSorter(otherId);
        },
        /**
         * create code table object
         * @param items {[*]}items array
         * @param render {function} params: item; return: text
         * @param sorter {CodeTableSorter}
         * @returns {CodeTable}
         */
        createCodeTable: function (items, render, sorter) {
            return new CodeTable(items, render, sorter);
        },
        /**
         * create form layout
         * @param {*|[*]}
         * @returns {FormLayout}
         */
        createFormLayout: function () {
            var layouts = [];
            if (arguments) {
                for (var index = 0, count = arguments.length; index < count; index++) {
                    layouts.push(arguments[index]);
                }
            }
            return new FormLayout(layouts);
        },
        /**
         * create table column layout
         * @param columns
         * @returns {TableColumnLayout}
         */
        createTableColumnLayout: function (columns) {
            return new TableColumnLayout(columns);
        },
        /**
         * create model validator
         * @param config {*} validator configuration
         * @param rules {*} rules
         * @returns {ModelValidator}
         */
        createModelValidator: function (config, rules) {
            return new ModelValidator(config, rules);
        },
        /**
         * create table validation result
         * @returns {TableValidationResult}
         */
        createTableValidationResult: function () {
            return new TableValidationResult();
        },
        /**
         * create model
         * @param model {*}
         * @param validator {}
         * @returns {*}
         */
        createModel: function (model, validator) {
            return ModelUtil.createModel(model, validator);
        },
        /**
         * clone json object
         * @param jsonObject
         */
        cloneJSON: cloneJSON,
        /**
         * define component config
         * @param config
         * @returns {*}
         */
        defineComponentConfig: function (config) {
            return $.extend({}, ComponentBase, config);
        }
    };
})(this);
