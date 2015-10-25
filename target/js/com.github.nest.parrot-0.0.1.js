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

/**
 * checkbox
 */
var NCheck = React.createClass($pt.defineComponentConfig({
    propTypes: {
        // model
        model: React.PropTypes.object,
        // CellLayout
        layout: React.PropTypes.object
    },
    /**
     * will update
     * @param nextProps
     */
    componentWillUpdate: function (nextProps) {
        // remove post change listener to handle model change
        this.removePostChangeListener(this.onModelChange);
    },
    /**
     * did update
     * @param prevProps
     * @param prevState
     */
    componentDidUpdate: function (prevProps, prevState) {
        // set model value to component
        this.getComponent().prop("checked", this.getValueFromModel());
        // add post change listener to handle model change
        this.addPostChangeListener(this.onModelChange);
    },
    /**
     * did mount
     */
    componentDidMount: function () {
        // set model value to component
        this.getComponent().prop("checked", this.getValueFromModel());
        // add post change listener to handle model change
        this.addPostChangeListener(this.onModelChange);
    },
    /**
     * will unmount
     */
    componentWillUnmount: function () {
        // remove post change listener to handle model change
        this.removePostChangeListener(this.onModelChange);
    },
    /**
     * render check box, using font awesome instead
     * @returns {XML}
     */
    renderCheckbox: function () {
        return (React.createElement("a", {href: "javascript:void(0);", onClick: this.handleHrefClicked, className: "n-checkbox"}, 
            React.createElement(Icon, {icon: this.isChecked() ? "check-square-o" : "square-o", size: "lg"})
        ));
    },
    /**
     * render
     * @returns {XML}
     */
    render: function () {
        return (React.createElement("div", {className: this.getComponentCSS("")}, 
            React.createElement("label", null, 
                this.renderCheckbox(), 
                React.createElement("input", {type: "checkbox", id: this.getId(), style: {display: "none"}, 
                       onChange: this.onComponentChange})
            )
        ));
    },
    /**
     * handle href clicked event
     */
    handleHrefClicked: function () {
        this.setValueToModel(!this.isChecked());
    },
    /**
     * on component change
     * @param evt
     */
    onComponentChange: function (evt) {
        // synchronize value to model
        this.setValueToModel(evt.target.checked);
    },
    /**
     * on model change
     * @param evt
     */
    onModelChange: function (evt) {
        this.getComponent().prop("checked", evt.new === true);
        this.forceUpdate();
    },
    /**
     * is checked or not
     * @returns {boolean}
     */
    isChecked: function () {
        return this.getValueFromModel() === true;
    }
}));
/**
 * datetime picker, see datetimepicker from bootstrap
 */
var NDateTime = React.createClass($pt.defineComponentConfig({
    propTypes: {
        // model
        model: React.PropTypes.object,
        // CellLayout
        layout: React.PropTypes.object
    },
    getDefaultProps: function () {
        return {
            defaultOptions: {
                format: "YYYY/MM/DD",
                dayViewHeaderFormat: "MMMM YYYY",
                stepping: 1,
                minDate: false,
                maxDate: false,
                collapse: true,
                defaultDate: false,
                disabledDates: false,
                enabledDates: false,
                icons: {
                    time: 'glyphicon glyphicon-time',
                    date: 'glyphicon glyphicon-calendar',
                    up: 'glyphicon glyphicon-chevron-up',
                    down: 'glyphicon glyphicon-chevron-down',
                    previous: 'glyphicon glyphicon-chevron-left',
                    next: 'glyphicon glyphicon-chevron-right',
                    today: 'glyphicon glyphicon-screenshot',
                    clear: 'glyphicon glyphicon-trash'
                },
                useStrict: false,
                sideBySide: true,
                daysOfWeekDisabled: [],
                calendarWeeks: false,
                viewMode: 'days',
                toolbarPlacement: 'default',
                showTodayButton: true,
                showClear: true,
                showClose: true,
                // value format can be different with display format
                valueFormat: "YYYY/MM/DD"
            }
        }
    },
    /**
     * will update
     * @param nextProps
     */
    componentWillUpdate: function (nextProps) {
        // remove post change listener to handle model change
        this.removePostChangeListener(this.onModelChange);
    },
    /**
     * overrride react method
     * @param prevProps
     * @param prevState
     * @override
     */
    componentDidUpdate: function (prevProps, prevState) {
        this.getComponent().data("DateTimePicker").date(this.getValueFromModel());
        // add post change listener
        this.addPostChangeListener(this.onModelChange);
    },
    /**
     * override react method
     * @override
     */
    componentDidMount: function () {
        this.createComponent();
        this.getComponent().data("DateTimePicker").date(this.getValueFromModel());
        // add post change listener
        this.addPostChangeListener(this.onModelChange);
    },
    /**
     * override react method
     * @override
     */
    componentWillUnmount: function () {
        // remove post change listener
        this.removePostChangeListener(this.onModelChange);
    },
    /**
     * create component
     */
    createComponent: function () {
        this.getComponent().datetimepicker(this.createDisplayOptions({
            format: null,
            dayViewHeaderFormat: null,
            stepping: null,
            minDate: null,
            maxDate: null,
            collapse: null,
            disabledDates: null,
            enabledDates: null,
            icons: null,
            useStrict: null,
            sideBySide: null,
            daysOfWeekDisabled: null,
            calendarWeeks: null,
            viewMode: null,
            toolbarPlacement: null,
            showTodayButton: null,
            showClear: null,
            showClose: null
        })).on("dp.change", this.onComponentChange);
    },
    /**
     * create display options
     * @param optionsDefine
     */
    createDisplayOptions: function (optionsDefine) {
        var _this = this;
        Object.keys(optionsDefine).forEach(function (key) {
            optionsDefine[key] = _this.getComponentOption(key);
        });
        return optionsDefine;
    },
    /**
     * get option
     * @param key
     */
    getComponentOption: function (key) {
        var option = this.getLayout().getComponentOption(key);
        if (option == null) {
            option = this.props.defaultOptions[key];
        }
        return option === undefined ? null : option;
    },
    /**
     * render
     * @returns {XML}
     */
    render: function () {
        return (React.createElement("div", {className: this.getCombineCSS("input-group", "div"), id: this.getDivId()}, 
            React.createElement("input", {id: this.getId(), type: "text", className: this.getComponentCSS("form-control")}), 
            React.createElement("span", {className: "input-group-addon"}, 
                React.createElement(Icon, {icon: "calendar"})
            )
        ));
    },
    /**
     * on component change
     * @param evt
     */
    onComponentChange: function (evt) {
        // synchronize value to model
        if (evt.date !== false) {
            this.setValueToModel(evt.date);
        } else {
            this.setValueToModel(null);
        }
    },
    /**
     * on model change
     * @param evt
     */
    onModelChange: function (evt) {
        this.getComponent().data("DateTimePicker").date(this.convertValueFromModel(evt.new));
    },
    /**
     * get component
     * @returns {*|jQuery|HTMLElement}
     * @override
     */
    getComponent: function () {
        return $("#" + this.getDivId());
    },
    /**
     * get value from model
     * @returns {*}
     * @override
     */
    getValueFromModel: function () {
        return this.convertValueFromModel(this.getModel().get(this.getId()));
    },
    /**
     * set value to model
     * @param value
     * @override
     */
    setValueToModel: function (value) {
        value = value == null ? null : value.format(this.getComponentOption("valueFormat"));
        this.getModel().set(this.getId(), value);
    },
    /**
     * convert value from model
     * @param value string date with value format
     * @returns {*} moment date
     */
    convertValueFromModel: function (value) {
        return value == null ? null : moment(value, this.getComponentOption("valueFormat"));
    },
    /**
     * get div id
     * @returns {string}
     */
    getDivId: function () {
        return "div_" + this.getId();
    }
}));
/**
 * form component, a div
 */
var NForm = React.createClass({displayName: "NForm",
    propTypes: {
        // model
        model: React.PropTypes.object,
        // layout, FormLayout
        layout: React.PropTypes.object
    },
    /**
     * render row
     * @param row {RowLayout}
     */
    renderRow: function (row) {
        var _this = this;
        var cells = row.getCells().map(function (cell) {
            return React.createElement(NFormCell, {layout: cell, model: _this.getModel()});
        });
        return (React.createElement("div", {className: "row"}, cells));
    },
    /**
     * render
     * @returns {XML}
     */
    render: function () {
        return (React.createElement("div", null, this.props.layout.getRows().map(this.renderRow)));
    },
    /**
     * get model
     * @returns {*}
     */
    getModel: function () {
        return this.props.model;
    },
    /**
     * get layout
     * @returns {*}
     */
    getLayout: function () {
        return this.props.layout;
    }
});
/**
 * form cell component
 */
var NFormCell = React.createClass($pt.defineComponentConfig({
    propTypes: {
        // model, whole model, not only for this cell
        // use id to get the value of this cell from model
        model: React.PropTypes.object,
        // CellLayout
        layout: React.PropTypes.object
    },
    /**
     * will update
     * @param nextProps
     */
    componentWillUpdate: function (nextProps) {
        $("#" + this.getLabelId()).popover("destroy");
        this.removePostChangeListener(this.onModelChange);
        this.removePostValidateListener(this.onModelValidateChange);
    },
    /**
     * did update
     * @param prevProps
     * @param prevState
     */
    componentDidUpdate: function (prevProps, prevState) {
        this.renderPopover();
        this.addPostChangeListener(this.onModelChange);
        this.addPostValidateListener(this.onModelValidateChange);
    },
    /**
     * did mount
     */
    componentDidMount: function () {
        this.renderPopover();
        this.addPostChangeListener(this.onModelChange);
        this.addPostValidateListener(this.onModelValidateChange);
    },
    /**
     * will unmount
     */
    componentWillUnmount: function () {
        $("#" + this.getLabelId()).popover("destroy");
        this.removePostChangeListener(this.onModelChange);
        this.removePostValidateListener(this.onModelValidateChange);
    },
    /**
     * render error popover
     */
    renderPopover: function () {
        if (this.getModel().hasError(this.getId())) {
            var labelComponent = $("#" + this.getLabelId());
            if (labelComponent.length == 0) {
                return;
            }
            var messages = this.getModel().getError(this.getId());
            var _this = this;
            var content = messages.map(function (msg) {
                return "<span style='display:block'>" + msg.format([_this.getLayout().getLabel()]) + "</span>";
            });
            labelComponent.popover({
                placement: 'top',
                trigger: 'hover',
                html: true,
                content: content,
                // false is very import, since when destroy popover,
                // the really destroy will be invoked by some delay,
                // and before really destory invoked,
                // the new popover is bind by componentDidUpdate method.
                // and finally new popover will be destroyed.
                animation: false
            });
        }
    },
    /**
     * render text input
     * @returns {XML}
     */
    renderText: function () {
        return React.createElement(NText, {model: this.getModel(), layout: this.getLayout()});
    },
    /**
     * render checkbox
     * @returns {XML}
     */
    renderCheck: function () {
        return React.createElement(NCheck, {model: this.getModel(), layout: this.getLayout()});
    },
    /**
     * render datetime picker
     * @returns {XML}
     */
    renderDateTime: function () {
        return React.createElement(NDateTime, {model: this.getModel(), layout: this.getLayout()});
    },
    /**
     * render select
     * @returns {XML}
     */
    renderSelect: function () {
        return React.createElement(NSelect, {model: this.getModel(), layout: this.getLayout()});
    },
    /**
     * render search text
     * @returns {XML}
     */
    renderSearch: function () {
        return React.createElement(NSearchText, {model: this.getModel(), layout: this.getLayout()});
    },
    /**
     * render table
     * @returns {XML}
     */
    renderTable: function () {
        return React.createElement(NTable, {model: this.getModel(), layout: this.getLayout()});
    },
    /**
     * render input component
     */
    renderInputComponent: function () {
        switch (this.getLayout().getComponentType()) {
            case $pt.ComponentConstants.Text:
                return this.renderText();
            case $pt.ComponentConstants.Date:
                return this.renderDateTime();
            case $pt.ComponentConstants.Select:
                return this.renderSelect();
            case $pt.ComponentConstants.Check:
                return this.renderCheck();
            case $pt.ComponentConstants.Search:
                return this.renderSearch();
            default:
                throw $pt.createComponentException($pt.ComponentConstants.Err_Unsupported_Component,
                    "Component type[" + this.getLayout().getComponentType() + "] is not supported yet.");
        }
    },
    /**
     * render
     * @returns {XML}
     */
    render: function () {
        if (this.getLayout().getComponentType() == $pt.ComponentConstants.Table) {
            return (React.createElement("div", {className: this.getCSSClassName()}, 
                this.renderTable()
            ));
        } else {
            var css = this.getCSSClassName();
            if (this.getModel().hasError(this.getId())) {
                css += " has-error";
            }
            var requiredLabel = this.getModel().isRequired(this.getId()) ?
                (React.createElement(Icon, {icon: "star", fixWidth: true, iconClassName: "required"})) : null;
            return (React.createElement("div", {className: css}, 
                React.createElement("label", {htmlFor: this.getId(), 
                       className: this.getLayout().getLabelCSS(), 
                       id: this.getLabelId()}, 
                    this.getLayout().getLabel(), 
                    requiredLabel, ":"
                ), 
                this.renderInputComponent()
            ));
        }
    },
    /**
     * on model change
     * @param evt
     */
    onModelChange: function (evt) {
        this.getModel().validate(evt.id);
    },
    /**
     * on model validate change
     * @param evt
     */
    onModelValidateChange: function (evt) {
        // maybe will introduce performance issue, cannot sure now.
        this.forceUpdate();
    },
    /**
     * get label id
     * @returns {string}
     */
    getLabelId: function () {
        return "nlabel-" + this.getId();
    },
    /**
     * get css class
     * @returns {string}
     */
    getCSSClassName: function () {
        var width = this.getLayout().getWidth();
        var css = "col-sm-" + width + " col-md-" + width + " col-lg-" + width;
        return this.getLayout().getCellCSS(css);
    }
}));
/**
 * icon based on font-awesome
 */
var Icon = React.createClass({displayName: "Icon",
    propTypes: {
        size: React.PropTypes.oneOf(["lg", "2x", "3x", "4x", "5x"]),
        fixWidth: React.PropTypes.bool,

        icon: React.PropTypes.string.isRequired,
        spin: React.PropTypes.bool,
        pulse: React.PropTypes.bool,
        rotate: React.PropTypes.oneOf([90, 180, 270]),
        flip: React.PropTypes.oneOf(["h", "v"]),
        iconClassName: React.PropTypes.string,

        backIcon: React.PropTypes.string,
        backSpin: React.PropTypes.bool,
        backPulse: React.PropTypes.bool,
        backRotate: React.PropTypes.oneOf([90, 180, 270]),
        backFlip: React.PropTypes.oneOf(["h", "v"]),
        backClassName: React.PropTypes.string
    },
    getDefaultProps: function () {
        return {
            fixWidth: false,
            spin: false
        };
    },
    /**
     * get size
     * @returns {}
     */
    getSize: function () {
        return {
            "fa-lg": this.props.size === "lg",
            "fa-2x": this.props.size === "2x",
            "fa-3x": this.props.size === "3x",
            "fa-4x": this.props.size === "4x",
            "fa-5x": this.props.size === "5x",
            "fa-fw": this.props.fixWidth
        };
    },
    /**
     * get icon
     * @returns {*}
     */
    getIcon: function () {
        var c = {
            "fa": true,
            "fa-spin": this.props.spin,
            "fa-pulse": this.props.backPulse,
            "fa-rotate-90": this.props.backRotate == 90,
            "fa-rotate-180": this.props.backRotate == 180,
            "fa-rotate-270": this.props.backRotate == 270,
            "fa-flip-horizontal": this.props.backFlip === "h",
            "fa-flip-vertical": this.props.backFlip === "v"
        };
        c["fa-" + this.props.icon] = true;
        if (this.props.iconClassName) {
            c[this.props.iconClassName] = true;
        }
        return c;
    },
    /**
     * get background icon
     * @returns {*}
     */
    getBackIcon: function () {
        var c = {
            "fa": true,
            "fa-spin": this.props.backSpin,
            "fa-pulse": this.props.pulse,
            "fa-rotate-90": this.props.rotate == 90,
            "fa-rotate-180": this.props.rotate == 180,
            "fa-rotate-270": this.props.rotate == 270,
            "fa-flip-horizontal": this.props.flip === "h",
            "fa-flip-vertical": this.props.flip === "v"
        };
        c["fa-" + this.props.backIcon] = true;
        if (this.props.backClassName) {
            c[this.props.backClassName] = true;
        }
        return c;
    },
    /**
     * render
     * @returns {XML}
     */
    render: function () {
        var size = this.getSize();
        var iconClasses = this.getIcon();
        if (this.props.backIcon) {
            size["fa-stack"] = true;
            var backIconClasses = this.getBackIcon();
            return (React.createElement("span", {className: size}, 
                React.createElement("i", {className: iconClasses}), 
                React.createElement("i", {className: backIconClasses})
            ));
        }
        $.extend(iconClasses, size);
        return React.createElement("span", {className: React.addons.classSet(iconClasses)});
    }
});
/**
 * Jumbortron
 */
var NJumbortron = React.createClass({displayName: "NJumbortron",
    propTypes: {
        highlightText: React.PropTypes.oneOfType(
            React.PropTypes.string,
            React.PropTypes.arrayOf(React.PropTypes.string)).isRequired
    },
    renderText: function () {
        if (Array.isArray(this.props.highlightText)) {
            return this.props.highlightText.map(function (text) {
                return React.createElement("h4", null, text);
            });
        } else {
            return React.createElement("h4", null, "this.props.highlightText");
        }
    },
    render: function () {
        return (
            React.createElement("div", {className: "jumbotron"}, 
                this.renderText()
            )
        );
    }
});
/**
 * modal confirm dialog
 */
var NConfirm = React.createClass({displayName: "NConfirm",
    propTypes: {
        css: React.PropTypes.string,
        zIndex: React.PropTypes.number
    },
    getDefaultProps: function () {
        return {
            confirmText: "OK",
            closeText: "Close",
            cancelText: "Cancel"
        };
    },
    getInitialState: function () {
        return {
            visible: false,
            title: null,
            options: null,
            onConfirm: null
        };
    },
    /**
     * set z-index
     */
    setZIndex: function () {
        if (this.props.zIndex != undefined) {
            var div = $(React.findDOMNode(this.refs.body)).closest(".modal");
            if (div.length > 0) {
                div.css({"z-index": this.props.zIndex * 1 + 1});
                div.prev().css({"z-index": this.props.zIndex});
            }
        }
    },
    /**
     * did update
     * @param prevProps
     * @param prevState
     */
    componentDidUpdate: function (prevProps, prevState) {
        this.setZIndex();
    },
    /**
     * did mount
     */
    componentDidMount: function () {
        this.setZIndex();
    },
    /**
     * render confirm button
     * @returns {XML}
     */
    renderConfirmButton: function () {
        if (this.state.options && this.state.options.disableConfirm) {
            return null;
        }
        return (React.createElement(Button, {bsStyle: "danger", onClick: this.onConfirmClicked}, 
            React.createElement(Icon, {icon: "check"}), " ", this.props.confirmText
        ));
    },
    /**
     * render close button
     * @returns {XML}
     */
    renderCloseButton: function () {
        if (this.state.options && this.state.options.disableClose) {
            return null;
        }
        var text = (this.state.options && this.state.options.close) ? this.props.closeText : this.props.cancelText;
        return (React.createElement(Button, {onClick: this.hide}, 
            React.createElement(Icon, {icon: "times-circle"}), " ", text
        ));
    },
    /**
     * render footer
     * @returns {XML}
     */
    renderFooter: function () {
        if (this.state.options && this.state.options.disableButtons) {
            return null;
        }
        return (React.createElement("div", {className: "modal-footer"}, 
            this.renderConfirmButton(), 
            this.renderCloseButton()
        ));
    },
    /**
     * render content
     */
    renderContent: function () {
        var messages = this.state.options;
        if (typeof messages === "string") {
            messages = [messages];
        }
        if (!Array.isArray(messages)) {
            messages = messages.messages;
            if (typeof messages === "string") {
                messages = [messages];
            }
        }
        // string array
        return messages.map(function (element) {
            return React.createElement("h5", null, element);
        });
    },
    /**
     * render
     * @returns {*}
     */
    render: function () {
        if (!this.state.visible) {
            return null;
        }

        return (React.createElement(Modal, {className: this.props.css, bsStyle: "danger", title: this.state.title, 
                       onRequestHide: this.hide, backdrop: "static"}, 
            React.createElement("div", {className: "modal-body", ref: "body"}, 
                this.renderContent()
            ), 
            this.renderFooter()
        ));
    },
    /**
     * hide dialog
     */
    hide: function () {
        this.setState({visible: false, title: null, options: null, onConfirm: null});
    },
    /**
     * on confirm clicked
     */
    onConfirmClicked: function () {
        if (this.state.onConfirm) {
            this.state.onConfirm();
        }
        this.hide();
    },
    /**
     * show dialog
     * @param title title of dialog
     * @param options string or string array, or object as below.
     *          {
     *              disableButtons: true, // hide button bar
     *              disableConfirm: true, // hide confirm button
     *              disableClose: true, // hide close button
     *              messsages: "", // string or string array,
     *              close: true // show close button text as "close"
     *          }
     * @param onConfirm callback function when confirm button clicked
     */
    show: function (title, options, onConfirm) {
        var state = {
            visible: true,
            title: title,
            options: options,
            onConfirm: onConfirm
        };
        this.setState(state);
    }
});
/**
 * modal form dialog
 */
var NModalForm = React.createClass({displayName: "NModalForm",
    propTypes: {
        title: React.PropTypes.string,
        css: React.PropTypes.string,
        zIndex: React.PropTypes.number
    },
    getInitialState: function () {
        return {
            visible: false
        };
    },
    /**
     * set z-index
     */
    setZIndex: function () {
        if (this.props.zIndex != undefined) {
            var div = $(React.findDOMNode(this.refs.body)).closest(".modal");
            if (div.length > 0) {
                div.css({"z-index": this.props.zIndex * 1 + 1});
                div.prev().css({"z-index": this.props.zIndex});
            }
        }
    },
    /**
     * did update
     * @param prevProps
     * @param prevState
     */
    componentDidUpdate: function (prevProps, prevState) {
        this.setZIndex();
    },
    /**
     * did mount
     */
    componentDidMount: function () {
        this.setZIndex();
    },
    /**
     * render
     * @returns {*}
     */
    render: function () {
        if (!this.state.visible) {
            return null;
        }

        return (React.createElement(Modal, {className: this.props.css, title: this.props.title, 
                       closeButton: false, backdrop: "static"}, 
            React.createElement("div", {className: "modal-body", ref: "body"}, 
                React.createElement(NForm, {model: this.getModel(), layout: this.getLayout(), ref: "form"})
            ), 
            React.createElement("div", {className: "modal-footer modal-form-footer"}, 
                React.createElement(NPanelFooter, {reset: this.onResetClicked.bind(this), 
                              validate: this.onValidateClicked.bind(this), 
                              save: this.getSaveButton(), 
                              cancel: this.onCancelClicked.bind(this), 
                              left: this.getLeftButton(), 
                              right: this.getRightButton()})
            ), 
            React.createElement(NConfirm, {zIndex: 9000, ref: "confirmDialog"})
        ));
    },
    /**
     * on reset clicked
     */
    onResetClicked: function () {
        var reset = function () {
            this.getModel().reset();
            this.refs.form.forceUpdate();
        };
        this.refs.confirmDialog.show("Reset Data",
            ["Are you sure to reset data?",
                "All data will be lost and cannot be recovered."],
            reset.bind(this));
    },
    /**
     * on validate clicked
     */
    onValidateClicked: function () {
        this.getModel().validate();
        this.forceUpdate();
    },
    /**
     * on cancel clicked
     */
    onCancelClicked: function () {
        this.refs.confirmDialog.show("Cancel Editing",
            ["Are you sure to cancel current operating?",
                "All data will be lost and cannot be recovered."],
            this.hide.bind(this));
    },
    /**
     * get model
     * @returns {*|null}
     */
    getModel: function () {
        return this.state.model;
    },
    /**
     * get layout
     * @returns {*}
     */
    getLayout: function () {
        return this.state.layout;
    },
    /**
     * get left button configuration
     * @returns {*}
     */
    getLeftButton: function () {
        return this.state.buttons ? this.state.buttons.left : null;
    },
    /**
     * get right button configuration
     * @returns {*}
     */
    getRightButton: function () {
        return this.state.buttons ? this.state.buttons.right : null;
    },
    /**
     * get save button configuration
     * @returns {*}
     */
    getSaveButton: function () {
        return this.state.buttons ? this.state.buttons.save : null;
    },
    /**
     * hide dialog
     * @return model
     */
    hide: function () {
        var model = this.state.model;
        this.setState({visible: false, model: null, layout: null, buttons: null});
        return model;
    },
    /**
     * show dialog
     * @param title
     * @param messages
     * @param onConfirm
     */
    show: function (model, layout, buttons) {
        this.setState({visible: true, model: model, layout: layout, buttons: buttons});
    }
});
/**
 * page footer.<br>
 */
var NPageFooter = React.createClass({displayName: "NPageFooter",
	propTypes: {
		name: React.PropTypes.string.isRequired
	},
	render: function() {
		return (
			React.createElement("footer", {className: "footer"}, 
				React.createElement("div", {className: "container"}, 
					React.createElement("p", {className: "text-muted pull-right"}, 
						"Code licensed under ", React.createElement("a", {href: "https://www.apache.org/licenses/LICENSE-2.0", target: "_blank"}, "Apache License 2.0"), ". ", this.props.name, " by ", React.createElement("a", {href: "https://github.com/bradwoo8621/nest", target: "_blank"}, "NEST@Github.")
					)
				)
			));
	}
});
/**
 * Page Header<br>
 */
var NPageHeader = React.createClass({displayName: "NPageHeader",
    propTypes: {
        // brand string
        brand: React.PropTypes.string.isRequired,
        brandUrl: React.PropTypes.string,
        brandFunc: React.PropTypes.func,
        // menu object
        menus: React.PropTypes.array,
        // search box properties
        search: React.PropTypes.func,
        searchPlaceholder: React.PropTypes.string
    },
    getDefaultProps: function () {
        return {
            searchPlaceholder: "Search..."
        };
    },
    /**
     * render search box
     * @returns {XML}
     */
    renderSearchBox: function () {
        return (React.createElement("div", {className: "navbar-form navbar-right", role: "search"}, 
            React.createElement("div", {className: "form-group"}, 
                React.createElement("div", {className: "input-group"}, 
                    React.createElement("input", {id: "nheader-search-text", type: "text", className: "form-control", 
                           placeholder: this.props.searchPlaceholder}), 
                        React.createElement("span", {className: "input-group-btn"}, 
                            React.createElement("button", {className: "btn btn-default", type: "button", onClick: this.onSearchClicked}, 
                                React.createElement(Icon, {icon: "search"})
                            )
                        )
                )
            )
        ));
    },
    renderMenuItem: function (item, index, menus, onTopLevel) {
        if (item.children !== undefined) {
            // render dropdown menu
            var _this = this;
            return (
                React.createElement("li", {className: onTopLevel ? "dropdown" : "dropdown-submenu"}, 
                    React.createElement("a", {href: "#", className: "dropdown-toggle", "data-toggle": "dropdown", role: "button", 
                       "aria-expanded": "false"}, 
                        item.text, " ", onTopLevel ? React.createElement("span", {className: "caret"}) : null
                    ), 
                    React.createElement("ul", {className: "dropdown-menu", role: "menu"}, 
                        item.children.map(function (childItem, childIndex, dropdownItems) {
                            return _this.renderMenuItem(childItem, childIndex, dropdownItems, false);
                        })
                    )
                )
            );
        } else if (item.divider === true) {
            // render divider
            return (React.createElement("li", {className: "divider"}));
        } else if (item.func !== undefined) {
            // call javascript function
            return (React.createElement("li", null, 
                React.createElement("a", {href: "javascript:void(0);", onClick: this.onMenuClicked.bind(this, item.func)}, item.text)
            ));
        } else {
            // jump to url
            return (React.createElement("li", null, React.createElement("a", {href: item.url}, item.text)));
        }
    },
    /**
     * render menus
     * @returns {XML}
     */
    renderMenus: function () {
        var _this = this;
        return (
            React.createElement("ul", {className: "nav navbar-nav"}, 
                this.props.menus.map(function (item, index, menu) {
                    return _this.renderMenuItem(item, index, menu, true);
                })
            )
        );
    },
    renderBrand: function () {
        if (this.props.brandUrl) {
            return React.createElement("a", {href: this.props.brandUrl}, React.createElement("span", {className: "navbar-brand"}, this.props.brand));
        } else if (this.props.brandFunc) {
            return (React.createElement("a", {href: "javascript:void(0);", onClick: this.onBrandClicked}, 
                React.createElement("span", {className: "navbar-brand"}, this.props.brand)
            ));
        } else {
            return React.createElement("span", {className: "navbar-brand"}, this.props.brand);
        }
    },
    /**
     * on brand clicked
     * @param func
     */
    onBrandClicked: function () {
        this.props.brandFunc();
    },
    /**
     * on menu clicked
     * @param func
     */
    onMenuClicked: function (func) {
        func();
    },
    /**
     * on search clicked
     */
    onSearchClicked: function () {
        var value = $("#nheader-search-text").val();
        if (value == null || value.length == 0) {
            // do nothing
            return;
        }
        this.props.search(value);
    },
    /**
     * render component
     * @returns {XML}
     */
    render: function () {
        return (
            React.createElement("nav", {className: "navbar navbar-default navbar-fixed-top"}, 
                React.createElement("div", {className: "container-fluid"}, 
                    React.createElement("div", {className: "navbar-header"}, 
                        React.createElement("button", {type: "button", className: "navbar-toggle collapsed", "data-toggle": "collapse", 
                                "data-target": "#navbar-1"}, 
                            React.createElement("span", {className: "sr-only"}, "Toggle navigation"), 
                            React.createElement("span", {className: "icon-bar"}), 
                            React.createElement("span", {className: "icon-bar"}), 
                            React.createElement("span", {className: "icon-bar"})
                        ), 
                        this.renderBrand()
                    ), 
                    React.createElement("div", {className: "collapse navbar-collapse", id: "navbar-1"}, 
                        this.renderMenus(), 
                        this.props.search ? this.renderSearchBox() : null
                    )
                )
            )
        );
    }
});
/**
 * pagination
 */
var NPagination = React.createClass({displayName: "NPagination",
    /**
     * @override
     */
    propTypes: {
        // max page buttons
        maxPageButtons: React.PropTypes.number,
        // page count
        pageCount: React.PropTypes.number,
        // current page index, start from 1
        currentPageIndex: React.PropTypes.number,

        // jump to page, will be invoked when page index changed
        toPage: React.PropTypes.func.isRequired,

        className: React.PropTypes.string,

        // show status label
        showStatus: React.PropTypes.bool
    },
    /**
     * override react method
     * @returns {*}
     * @override
     */
    getDefaultProps: function () {
        return {
            maxPageButtons: 5,
            pageCount: 1, // page count default 1
            currentPageIndex: 1, // page number count from 1
            showStatus: true
        };
    },
    /**
     * make max page buttons is an odd number and at least 3
     */
    getMaxPageButtons: function () {
        var maxPageButtons = this.props.maxPageButtons;
        if (maxPageButtons % 2 == 0) {
            maxPageButtons = maxPageButtons - 1;
        }
        if (maxPageButtons < 3) {
            maxPageButtons = 3;
        }
        return maxPageButtons;
    },
    /**
     * get buttons range
     * @returns {{min: number, max: number}}
     */
    getPageButtonsRange: function () {
        var maxPageButtons = this.getMaxPageButtons();
        // calc the steps from currentPageIndex to maxPageIndex(pageCount)
        var max = 0;
        var availablePageCountFromCurrent = this.props.pageCount - this.props.currentPageIndex;
        var maxButtonCountFromCurrent = Math.floor(maxPageButtons / 2);
        if (availablePageCountFromCurrent >= maxButtonCountFromCurrent) {
            //
            max = parseInt(this.props.currentPageIndex) + maxButtonCountFromCurrent;
        } else {
            max = parseInt(this.props.currentPageIndex) + availablePageCountFromCurrent;
            // move to min buttons, since no enough available pages to display
            maxButtonCountFromCurrent += (maxButtonCountFromCurrent - availablePageCountFromCurrent);
        }
        // calc the steps from currentPageIndex to first page
        var min = 0;
        var availablePageCountBeforeCurrent = this.props.currentPageIndex - 1;
        if (availablePageCountBeforeCurrent >= maxButtonCountFromCurrent) {
            min = parseInt(this.props.currentPageIndex) - maxButtonCountFromCurrent;
        } else {
            min = 1;
        }

        // calc the steps
        if ((max - min) < maxPageButtons) {
            // no enough buttons
            max = min + maxPageButtons - 1;
            max = max > this.props.pageCount ? this.props.pageCount : max;
        }

        return {min: min, max: max};
    },
    /**
     * render button which jump to first page
     * @param buttonsRange
     * @returns {XML}
     */
    renderFirst: function (buttonsRange) {
        var className = "";
        if (this.props.currentPageIndex == 1) {
            className = "disabled";
        }
        return (React.createElement("li", {className: className}, 
            React.createElement("a", {href: "javascript:void(0);", "aria-label": "First", onClick: this.toFirst}, 
                React.createElement(Icon, {icon: "fast-backward"})
            )
        ));
    },
    /**
     * render button which jump to previous page section
     * @param buttonsRange
     * @returns {XML}
     */
    renderPreviousSection: function (buttonsRange) {
        var className = "";
        if (this.props.currentPageIndex == 1) {
            className = "disabled";
        }
        return (React.createElement("li", {className: className}, 
            React.createElement("a", {href: "javascript:void(0);", "aria-label": "PreviousSection", onClick: this.toPreviousSection}, 
                React.createElement(Icon, {icon: "backward"})
            )
        ));
    },
    /**
     * render button which jump to previous page
     * @param buttonsRange
     * @returns {XML}
     */
    renderPrevious: function (buttonsRange) {
        var className = "";
        if (this.props.currentPageIndex == 1) {
            className = "disabled";
        }
        return (React.createElement("li", {className: className}, 
            React.createElement("a", {href: "javascript:void(0);", "aria-label": "Previous", onClick: this.toPrevious}, 
                React.createElement(Icon, {icon: "chevron-left"})
            )
        ));
    },
    /**
     * render buttons
     * @param buttonsRange
     * @returns {[XML]}
     */
    renderButtons: function (buttonsRange) {
        var buttons = [];
        for (var index = buttonsRange.min; index <= buttonsRange.max; index++) {
            buttons.push(index);
        }
        var _this = this;
        return buttons.map(function (index) {
            var style = {};
            if (index == _this.props.currentPageIndex) {
                style.backgroundColor = "#eee";
            }
            return (React.createElement("li", null, 
                React.createElement("a", {href: "javascript:void(0);", onClick: _this.toPage, "data-index": index, style: style}, index)
            ));
        });
    },
    /**
     * render button which jump to next page
     * @param buttonsRange
     * @returns {XML}
     */
    renderNext: function (buttonsRange) {
        var className = "";
        if (this.props.currentPageIndex == this.props.pageCount) {
            className = "disabled";
        }
        return (React.createElement("li", {className: className}, 
            React.createElement("a", {href: "javascript:void(0);", "aria-label": "Next", onClick: this.toNext}, 
                React.createElement(Icon, {icon: "chevron-right"})
            )
        ));
    },
    /**
     * render button which jump to next page section
     * @param buttonsRange
     * @returns {XML}
     */
    renderNextSection: function (buttonsRange) {
        var className = "";
        if (this.props.currentPageIndex == this.props.pageCount) {
            className = "disabled";
        }
        return (React.createElement("li", {className: className}, 
            React.createElement("a", {href: "javascript:void(0);", "aria-label": "NextSection", onClick: this.toNextSection}, 
                React.createElement(Icon, {icon: "forward"})
            )
        ));
    },
    /**
     * render button which jump to last page
     * @param buttonsRange
     * @returns {XML}
     */
    renderLast: function (buttonsRange) {
        var className = "";
        if (this.props.currentPageIndex == this.props.pageCount) {
            className = "disabled";
        }
        return (React.createElement("li", {className: className}, 
            React.createElement("a", {href: "javascript:void(0);", "aria-label": "Last", onClick: this.toLast}, 
                React.createElement(Icon, {icon: "fast-forward"})
            )
        ));
    },
    /**
     * render status
     * @returns {XML}
     */
    renderStatus: function () {
        if (this.props.showStatus) {
            return (React.createElement("div", {className: "pagination-status col-sm-2 col-md-2 col-lg-2"}, 
                React.createElement("div", null, 
                    "Page: ", this.props.currentPageIndex, " / ", this.props.pageCount
                )
            ));
        } else {
            return null;
        }
    },
    /**
     * override react method
     * @returns {XML}
     * @override
     */
    render: function () {
        var buttonsRange = this.getPageButtonsRange();
        var className = "row" + (this.props.className ? (" " + this.props.className) : "");
        return (React.createElement("div", {className: className}, 
            this.renderStatus(), 
            React.createElement("div", {className: "col-sm-10 col-md-10 col-lg-10 pagination-status-buttons"}, 
                React.createElement("ul", {className: "pagination"}, 
                    this.renderFirst(buttonsRange), 
                    this.renderPreviousSection(buttonsRange), 
                    this.renderPrevious(buttonsRange), 
                    this.renderButtons(buttonsRange), 
                    this.renderNext(buttonsRange), 
                    this.renderNextSection(buttonsRange), 
                    this.renderLast(buttonsRange)
                )
            )
        ));
    },
    /**
     * get current page index
     * @param button
     * @returns {*|jQuery}
     */
    getCurrentPageIndex: function (button) {
        return $(button).attr("data-index");
    },
    /**
     * jump to first page
     */
    toFirst: function () {
        this.jumpTo(1);
    },
    /**
     * jump to previous page section
     */
    toPreviousSection: function () {
        var previousIndex = this.props.currentPageIndex - this.getMaxPageButtons();
        previousIndex = previousIndex < 1 ? 1 : previousIndex;
        this.jumpTo(previousIndex);
    },
    /**
     * jump to previous page
     */
    toPrevious: function () {
        var previousIndex = this.props.currentPageIndex - 1;
        this.jumpTo(previousIndex < 1 ? 1 : previousIndex);
    },
    /**
     * jump to given page according to event
     * @param evt
     */
    toPage: function (evt) {
        this.jumpTo(this.getCurrentPageIndex(evt.target));
    },
    /**
     * jump to next page
     */
    toNext: function () {
        var nextIndex = this.props.currentPageIndex + 1;
        this.jumpTo(nextIndex > this.props.pageCount ? this.props.pageCount : nextIndex);
    },
    /**
     * jump to next page section
     */
    toNextSection: function () {
        var nextIndex = this.props.currentPageIndex + this.getMaxPageButtons();
        nextIndex = nextIndex > this.props.pageCount ? this.props.pageCount : nextIndex;
        this.jumpTo(nextIndex);
    },
    /**
     * jump to last page
     */
    toLast: function () {
        this.jumpTo(this.props.pageCount);
    },
    /**
     * jump to given page index
     * @param pageIndex
     */
    jumpTo: function (pageIndex) {
        if (this.props.toPage) {
            this.props.toPage(pageIndex);
        }
    }
});
/**
 * panel footer which only contains buttons
 */
var NPanelFooter = React.createClass({displayName: "NPanelFooter",
    propTypes: {
        save: React.PropTypes.func,
        validate: React.PropTypes.func,
        cancel: React.PropTypes.func,
        reset: React.PropTypes.func,

        left: React.PropTypes.arrayOf(React.PropTypes.shape({
            icon: React.PropTypes.string,
            text: React.PropTypes.string,
            style: React.PropTypes.string,
            onClick: React.PropTypes.func.isRequired
        })),
        right: React.PropTypes.arrayOf(React.PropTypes.shape({
            icon: React.PropTypes.string,
            text: React.PropTypes.string,
            style: React.PropTypes.string, // references to bootstrap styles
            onClick: React.PropTypes.func.isRequired
        }))
    },
    /**
     * render left buttons
     */
    renderLeftButtons: function () {
        if (this.props.left) {
            return this.props.left.map(this.renderButton);
        } else {
            return null;
        }
    },
    /**
     * render right buttons
     */
    renderRightButtons: function () {
        if (this.props.right) {
            return this.props.right.map(this.renderButton);
        } else {
            return null;
        }
    },
    /**
     * render button
     */
    renderButton: function (option) {
        return (React.createElement(Button, {bsStyle: option.style ? option.style : "default", 
                        onClick: this.onButtonClicked.bind(this, option.onClick)}, 
            option.icon ? React.createElement(Icon, {icon: option.icon}) : null, " ", option.text
        ));
    },
    /**
     * render
     * @returns {XML}
     */
    render: function () {
        return (React.createElement("div", {className: "row"}, 
            React.createElement("div", {className: "col-sm-6 col-md-6 col-lg-6"}, 
                React.createElement(ButtonToolbar, {className: "panel-footer panel-footer-left"}, 
                    this.props.reset ? this.renderButton({
                        icon: "reply-all", text: "Reset", style: "warning", onClick: this.props.reset
                    }) : null, 
                    this.props.validate ? this.renderButton({
                        icon: "bug", text: "Validate", onClick: this.props.validate
                    }) : null, 
                    this.renderLeftButtons()
                )
            ), 
            React.createElement("div", {className: "col-sm-6 col-md-6 col-lg-6"}, 
                React.createElement(ButtonToolbar, {className: "panel-footer panel-footer-right"}, 
                    this.renderRightButtons(), 
                    this.props.save ? this.renderButton({
                        icon: "floppy-o", text: "Save", style: "primary", onClick: this.props.save
                    }) : null, 
                    this.props.cancel ? this.renderButton({
                        icon: "trash-o", text: "Cancel", style: "danger", onClick: this.props.cancel
                    }) : null
                )
            )
        ));
    },
    /**
     * on button clicked
     */
    onButtonClicked: function (onClickFunc) {
        if (onClickFunc) {
            onClickFunc();
        }
    }
});
/**
 * search text
 */
var NSearchText = React.createClass($pt.defineComponentConfig({
    propTypes: {
        // model
        model: React.PropTypes.object,
        // CellLayout
        layout: React.PropTypes.object
    },
    getDefaultProps: function () {
        return {
            defaultOptions: {
                searchButtonIcon: "check",
                advancedSearchButtonIcon: "search"
            }
        };
    },
    /**
     * will update
     * @param nextProps
     */
    componentWillUpdate: function (nextProps) {
        // remove post change listener to handle model change
        this.removePostChangeListener(this.onModelChange);
    },
    /**
     * did update
     * @param prevProps
     * @param prevState
     */
    componentDidUpdate: function (prevProps, prevState) {
        this.getComponent().val(this.getValueFromModel());
        // add post change listener to handle model change
        this.addPostChangeListener(this.onModelChange);
    },
    /**
     * did mount
     */
    componentDidMount: function () {
        // set model value to component
        this.getComponent().val(this.getValueFromModel());
        // add post change listener to handle model change
        this.addPostChangeListener(this.onModelChange);
    },
    /**
     * will unmount
     */
    componentWillUnmount: function () {
        // remove post change listener to handle model change
        this.removePostChangeListener(this.onModelChange);
    },
    /**
     * render
     * @returns {XML}
     */
    render: function () {
        return (React.createElement("div", {className: "input-group search-text"}, 
            React.createElement("input", {type: "text", className: this.getCombineCSS("form-control search-code", "text"), 
                   id: this.getId(), onChange: this.onComponentChange}), 
            React.createElement("span", {className: "input-group-btn", style: {width: "0px"}}), 
            React.createElement("input", {type: "text", className: this.getCombineCSS("form-control search-label", "label"), 
                   readOnly: true, onFocus: this.onLabelFocused}), 
            React.createElement("span", {className: "input-group-addon search-btn", onClick: this.onSearchClicked}, 
                React.createElement(Icon, {icon: this.getComponentOption("searchButtonIcon")})
            ), 
            React.createElement("span", {className: "input-group-addon advanced-search-btn", onClick: this.onAdvancedSearchClicked}, 
                React.createElement(Icon, {icon: this.getComponentOption("advancedSearchButtonIcon")})
            )
        ));
    },
    /**
     * on advanced search clicked
     */
    onAdvancedSearchClicked: function () {
        alert("onAdvancedSearchClicked");
    },
    /**
     * on search clicked
     */
    onSearchClicked: function () {
        alert("onSearchClicked");
    },
    /**
     * transfer focus to first text input
     */
    onLabelFocused: function () {
        this.getComponent().focus();
    },
    /**
     * on component changed
     */
    onComponentChange: function (evt) {
        this.setValueToModel(evt.target.value);
    },
    /**
     * on model change
     * @param evt
     */
    onModelChange: function (evt) {
        this.getComponent().val(evt.new);
    }
}));
/**
 * select component, see select2 from jQuery
 */
var NSelect = React.createClass($pt.defineComponentConfig({
    propTypes: {
        // model
        model: React.PropTypes.object,
        // CellLayout
        layout: React.PropTypes.object
    },
    getDefaultProps: function () {
        return {
            defaultOptions: {
                allowClear: true,
                minimumResultsForSearch: 1,
                multiple: false,
                placeholder: "Please Select...",
                width: "100%",
                data: [],

                availableWhenNoParentValue: false
                // other
                /*
                 parentPropId: parent property id
                 parentModel: parent model, default is this.props.model is not defined
                 parentFilter: filter of options according to parent property value,
                 can be property of self options
                 or a function with parameters
                 1: parent value
                 2: self options array
                 */
            }
        }
    },
    /**
     * will update
     */
    componentWillUpdate: function (nextProps) {
        this.removePostChangeListener(this.onModelChange);
        if (this.hasParent()) {
            // add post change listener into parent model
            this.getParentModel().removeListener(this.getParentPropertyId(), "post", "change", this.onParentModelChange);
        }
    },
    /**
     * did update
     * @param prevProps
     * @param prevState
     */
    componentDidUpdate: function (prevProps, prevState) {
        // react will not clear the options when component updating,
        // so have to reset select options manually
        if (prevProps.model != this.props.model) {
            var options = this.createDisplayOptions({
                multiple: null,
                allowClear: null,
                placeholder: null,
                minimumResultsForSearch: null,
                data: null
            });
            this.resetOptions(options);
        }
        // reset the value when component update
        this.getComponent().val(this.getValueFromModel()).trigger("change");

        this.addPostChangeListener(this.onModelChange);
        if (this.hasParent()) {
            // remove post change listener from parent model
            this.getParentModel().addListener(this.getParentPropertyId(), "post", "change", this.onParentModelChange);
        }

        this.removeTooltip();
    },
    /**
     * did mount
     */
    componentDidMount: function () {
        // Set up Select2
        this.createComponent();
        this.addPostChangeListener(this.onModelChange);
        if (this.hasParent()) {
            // add post change listener into parent model
            this.getParentModel().addListener(this.getParentPropertyId(), "post", "change", this.onParentModelChange);
        }
        this.removeTooltip();
    },
    /**
     * will unmount
     */
    componentWillUnmount: function () {
        // remove post change listener
        this.removePostChangeListener(this.onModelChange);
        if (this.hasParent()) {
            // remove post change listener from parent model
            this.getParentModel().removeListener(this.getParentPropertyId(), "post", "change", this.onParentModelChange);
        }
        // remove the jquery dom element
        this.getComponent().next("span").remove();
    },
    /**
     * create component
     */
    createComponent: function () {
        var options = this.createDisplayOptions({
            multiple: null,
            allowClear: null,
            placeholder: null,
            minimumResultsForSearch: null,
            data: null
        }, this.getLayout());
        this.getComponent().fireOnDisable().select2(options)
            .val(this.getValueFromModel()).trigger("change")
            .change(this.onComponentChange);
    },
    /**
     * create display options
     * @param options
     * @param source {CellLayout}
     */
    createDisplayOptions: function (options) {
        var _this = this;
        Object.keys(options).forEach(function (key) {
            options[key] = _this.getComponentOption(key);
        });
        options.data = this.convertDataOptions(options.data);
        // if has parent, filter options by parent property value
        if (this.hasParent()) {
            options.data = this.getAvailableOptions(this.getParentPropertyValue());
        }
        return options;
    },
    /**
     * convert data options, options can be CodeTable object or an array
     * @param options
     * @returns {*}
     */
    convertDataOptions: function (options) {
        return Array.isArray(options) ? options : options.list();
    },
    /**
     * remove tooltip, which is default set by select2 component.
     * it's unnecessary.
     */
    removeTooltip: function () {
        $("#select2-" + this.getId() + "-container").removeAttr("title");
    },
    /**
     * render
     * @returns {XML}
     */
    render: function () {
        return React.createElement("select", {style: {width: this.getComponentOption("width")}, id: this.getId()});
    },
    /**
     * on component change
     * @param evt
     */
    onComponentChange: function (evt) {
        var value = this.getComponent().val();
        if (value != this.getValueFromModel()) {
            // synchronize value to model
            this.setValueToModel(this.getComponent().val());
        }
        this.removeTooltip();
    },
    /**
     * on model change
     * @param evt
     */
    onModelChange: function (evt) {
        var oldValue = this.getComponent().val();
        if (oldValue == evt.new) {
            // do nothing
            return;
        } else {
            this.getComponent().val(evt.new).trigger("change");
        }
    },
    /**
     * on parent model change
     * @param evt
     */
    onParentModelChange: function (evt) {
        var data = this.getAvailableOptions(evt.new);
        this.resetOptions({data: data});
    },
    /**
     * get parent model
     * @returns {*}
     */
    getParentModel: function () {
        var parentModel = this.getComponentOption("parentModel");
        return parentModel == null ? this.getModel() : parentModel;
    },
    /**
     * get parent property value
     * @returns {*}
     */
    getParentPropertyValue: function () {
        return this.getParentModel().get(this.getParentPropertyId());
    },
    /**
     * get parent property id
     * @returns {string}
     */
    getParentPropertyId: function () {
        return this.getComponentOption("parentPropId");
    },
    /**
     * has parent or not
     * @returns {boolean}
     */
    hasParent: function () {
        return this.getParentPropertyId() != null;
    },
    /**
     * get available options.
     * if no parent assigned, return all data options
     * @param parentValue
     * @returns {[*]}
     */
    getAvailableOptions: function (parentValue) {
        if (parentValue == null) {
            return this.isAvailableWhenNoParentValue() ? this.convertDataOptions(this.getComponentOption("data")) : [];
        } else {
            var data = this.convertDataOptions(this.getComponentOption("data"));
            var filter = this.getComponentOption("parentFilter");
            if (typeof filter === "function") {
                return filter.filter(parentValue, data);
            } else {
                return data.filter(function (item) {
                    return item[filter] == parentValue;
                });
            }
        }
    },
    /**
     * is available when no parent value.
     * if no parent assigned, always return true.
     * @returns {boolean}
     */
    isAvailableWhenNoParentValue: function () {
        // when has parent, return availableWhenNoParentValue
        // or return true
        return this.hasParent() ? this.getComponentOption("availableWhenNoParentValue") : true;
    },
    /**
     * reset select options
     * @param newOptions
     */
    resetOptions: function (newOptions) {
        // really sucks because select2 doesn't support change the options dynamically
        var component = this.getComponent();
        var orgValue = component.val();
        var orgSelected = false;
        // first is Options object, second is really options
        var originalOptions = component.data("select2").options.options;
        component.html("");
        // data
        $.extend(originalOptions, newOptions);
        var innerHTML = "";
        originalOptions.data.forEach(function (element) {
            if (element.id == orgValue) {
                innerHTML += "<option value=\"" + element.id + "\"" + (element.id == orgValue ? " selected" : "") + ">" + element.text + "</option>";
                orgSelected = true;
            } else {
                innerHTML += "<option value=\"" + element.id + "\">" + element.text + "</option>";
            }
        });
        component.append(innerHTML);
        component.select2(originalOptions);

        if (!orgSelected) {
            component.val("").trigger("change");
        }
    }
}));

// to fix the select2 disabled property not work in IE8-10
// provided by https://gist.github.com/cmcnulty/7036509
(function ($) {
    "use strict";

    $.fn.fireOnDisable = function (settings) {
        // Only perform this DOM change if we have to watch changes with
        // propertychange
        // Also only perform if getOwnPropertyDescriptor exists - IE>=8
        // I suppose I could test for "propertychange fires, but not when form
        // element is disabled" - but it would be overkill
        if (!( 'onpropertychange' in document.createElement('input') ) || Object.getOwnPropertyDescriptor === undefined) {
            return this;
        }

        // IE9-10 use HTMLElement proto, IE8 uses Element proto
        var someProto = window.HTMLElement === undefined ? window.Element.prototype : window.HTMLElement.prototype,
            someTrigger = function () {
            },
            origDisabled = Object.getOwnPropertyDescriptor(someProto, 'disabled');

        if (document.createEvent) {
            someTrigger = function (newVal) {
                var event = document.createEvent('MutationEvent');
                /*
                 * Instantiate the event as close to native as possible:
                 * event.initMutationEvent(eventType, canBubble, cancelable,
                 * relatedNodeArg, prevValueArg, newValueArg, attrNameArg,
                 * attrChangeArg);
                 */
                event.initMutationEvent('DOMAttrModified', true, false, this.getAttributeNode('disabled'), '', '', 'disabled', 1);
                this.dispatchEvent(event);
            };
        } else if (document.fireEvent) {
            someTrigger = function () {
                this.fireEvent('onpropertychange');
            };
        }

        return this.each(function () {
            // call prototype's set, and then trigger the change.
            Object.defineProperty(this, 'disabled', {
                set: function (isDisabled) {
                    // We store preDisabled here, so that when we inquire as to
                    // the result after throwing the event, it will be accurate
                    // We can't throw the event after the native send, because
                    // it won't be be sent.
                    // We must do a native fire/dispatch, because native
                    // listeners don't catch jquery trigger 'propertychange'
                    // events
                    $.data(this, 'preDisabled', isDisabled);
                    if (isDisabled) {
                        // Trigger with dispatchEvent
                        someTrigger.call(this, isDisabled);
                    }

                    return origDisabled.set.call(this, isDisabled);
                },
                get: function () {
                    var isDisabled = $.data(this, 'preDisabled');
                    if (isDisabled === undefined) {
                        isDisabled = origDisabled.get.call(this);
                    }
                    return isDisabled;
                }
            });
        });
    };
})(jQuery);

/**
 * table
 */
var NTable = React.createClass($pt.defineComponentConfig({
    propTypes: {
        // model
        model: React.PropTypes.object,
        // CellLayout
        layout: React.PropTypes.object
    },
    getDefaultProps: function () {
        return {
            defaultOptions: {
                scrollY: false,
                scrollX: false,
                fixedRightColumns: 0,
                fixedLeftColumns: 0,

                addable: true,
                addButtonIcon: "plus-square-o",
                addButtonText: "Add",
                searchable: true,
                searchPlaceholder: "Search...",

                operationFixed: true,
                editable: false,
                rowEditButtonIcon: "pencil-square-o",
                removable: false,
                rowRemoveButtonIcon: "trash-o",
                editDialogSaveButtonText: "Save",
                editDialogSaveButtonIcon: "floppy-o",

                indexable: false,
                indexFixed: true,

                sortable: true,
                sortIcon: "sort",
                sortAscIcon: "sort-amount-asc",
                sortDescIcon: "sort-amount-desc",

                pageable: false,
                countPerPage: 20,

                noDataLabel: "No Data",
                detailErrorMessage: "Detail error please open item and do validate."
            }
        }
    },
    /**
     * get initial state
     * @returns {*}
     */
    getInitialState: function () {
        return {
            sortColumn: null,
            sortWay: null, // asc|desc

            countPerPage: 20,
            pageCount: 1,
            currentPageIndex: 1,

            searchText: null
        };
    },
    /**
     * will update
     * @param nextProps
     */
    componentWillUpdate: function (nextProps) {
        $("#" + this.getHeaderLabelId()).popover("destroy");
        this.removePostChangeListener(this.onModelChange);
        this.removePostRemoveListener(this.onModelChange);
        this.removePostAddListener(this.onModelChange);
        this.removePostValidateListener(this.onModelValidateChange);
    },
    /**
     * did update
     * @param prevProps
     * @param prevState
     */
    componentDidUpdate: function (prevProps, prevState) {
        this.renderIfIE8();
        this.renderHeaderPopover();
        this.addPostChangeListener(this.onModelChange);
        this.addPostRemoveListener(this.onModelChange);
        this.addPostAddListener(this.onModelChange);
        this.addPostValidateListener(this.onModelValidateChange);
    },
    /**
     * did mount
     */
    componentDidMount: function () {
        this.createComponent();
        this.renderHeaderPopover();
        this.addPostChangeListener(this.onModelChange);
        this.addPostRemoveListener(this.onModelChange);
        this.addPostAddListener(this.onModelChange);
        this.addPostValidateListener(this.onModelValidateChange);
    },
    /**
     * will unmount
     */
    componentWillUnmount: function () {
        $("#" + this.getHeaderLabelId()).popover("destroy");
        this.removePostChangeListener(this.onModelChange);
        this.removePostRemoveListener(this.onModelChange);
        this.removePostAddListener(this.onModelChange);
        this.removePostValidateListener(this.onModelValidateChange);
    },
    /**
     * create component
     */
    createComponent: function () {
        var _this = this;
        this.renderIfIE8();
        $("#" + this.getScrolledBodyDivId()).scroll(function (e) {
            var $this = $(this);
            $("#" + _this.getScrolledHeaderDivId()).scrollLeft($this.scrollLeft());
            $("#" + _this.getFixedLeftBodyDivId()).scrollTop($this.scrollTop());
            $("#" + _this.getFixedRightBodyDivId()).scrollTop($this.scrollTop());
        });
    },
    /**
     * render when IE8, fixed the height of table since IE8 doesn't support max-height
     */
    renderIfIE8: function () {
        if (!this.isIE8() || !this.hasVerticalScrollBar()) {
            return;
        }
        var mainTable = this.getComponent();
        var leftFixedDiv = $("#" + this.getFixedLeftBodyDivId());
        var rightFixedDiv = $("#" + this.getFixedRightBodyDivId());
        var trs = mainTable.find("tr");
        var rowCount = trs.length;
        var height = rowCount * 32; // 32 is defined in css, if value in css is changed, it must be changed together
        if (height > this.getComponentOption("scrollY")) {
            height = this.getComponentOption("scrollY");
        }
        // calculate height of body if ie8 and scrollY
        mainTable.closest("div").css({height: height + 17});
        leftFixedDiv.css({height: height});
        rightFixedDiv.css({height: height});
    },
    /**
     * check browser is IE8 or not
     * @returns {boolean}
     */
    isIE8: function () {
        return $.browser.msie && $.browser.versionNumber == 8;
    },
    /**
     * prepare display options
     */
    prepareDisplayOptions: function () {
        // if scrollY is set, force set scrollX to true, since the table will be
        // splitted to head table and body table.
        // for make sure the cell is aligned, width of columns must be set.
        if (this.hasVerticalScrollBar()) {
            this.getLayout().setComponentOption("scrollX", true);
        }
        // copy from this.props.columns
        this.columns = this.getComponentOption("columns").clone();
        this.fixedRightColumns = this.getComponentOption("fixedRightColumns");
        this.fixedLeftColumns = this.getComponentOption("fixedLeftColumns");

        // if editable or removable, auto add last column to render the buttons
        var editable = this.isEditable();
        var removable = this.isRemovable();
        if (editable || removable) {
            var config = {
                editable: editable,
                removable: removable,
                title: ""
            };
            config.width = (config.editable ? 30 : 0) + (config.removable ? 30 : 0);
            this.columns.push(config);
            if (this.fixedRightColumns > 0 || this.getComponentOption("operationFixed") === true) {
                this.fixedRightColumns++;
            }
        }
        // if indexable, auto add first column to render the row index
        var indexable = this.isIndexable();
        if (indexable) {
            var config = {
                indexable: true,
                width: 40,
                title: ""
            };
            this.columns.splice(0, 0, config);
            if (this.fixedLeftColumns > 0 || this.getComponentOption("indexFixed") === true) {
                this.fixedLeftColumns++;
            }
        }
    },
    /**
     * render search  box
     * @returns {XML}
     */
    renderSearchBox: function () {
        if (this.isSearchable()) {
            return (
                React.createElement("input", {id: "ntable-search-" + this.getId(), className: "form-control n-table-search-box pull-right", 
                       placeholder: this.getComponentOption("searchPlaceholder"), 
                       onChange: this.onSearchBoxChanged})
            );
        } else {
            return null;
        }
    },
    /**
     * render heading buttons
     * @returns {XML}
     */
    renderHeadingButtons: function () {
        if (this.isAddable()) {
            return (
                React.createElement("ul", {className: "n-table-heading-buttons pagination pull-right"}, 
                    React.createElement("li", null, 
                        React.createElement("a", {href: "javascript:void(0);", onClick: this.onAddClicked}, 
                            React.createElement(Icon, {
                                icon: this.getComponentOption("addButtonIcon")}), " ", this.getComponentOption("addButtonText")
                        )
                    )
                )
            );
        } else {
            return null;
        }
    },
    /**
     * render panel heading label
     * @returns {XML}
     */
    renderPanelHeadingLabel: function () {
        var css = "col-sm-3 col-md-3 col-lg-3";
        if (this.getModel().hasError(this.getId())) {
            css += " has-error";
        }
        return React.createElement("div", {className: css}, 
            React.createElement("label", {className: this.getCombineCSS("n-table-heading-label","headingLabel"), 
                   id: this.getHeaderLabelId()}, 
                this.getLayout().getLabel()
            )
        );
    },
    /**
     * render header popover
     */
    renderHeaderPopover: function () {
        if (this.getModel().hasError(this.getId())) {
            var messages = this.getModel().getError(this.getId());
            var _this = this;
            var content = messages.map(function (msg) {
                if (typeof msg === "string") {
                    return "<span style='display:block'>" + msg.format([_this.getLayout().getLabel()]) + "</span>";
                } else {
                    return "<span style='display:block'>" + _this.getComponentOption("detailErrorMessage") + "</span>";
                }
            });
            $("#" + this.getHeaderLabelId()).popover({
                placement: 'top',
                trigger: 'hover',
                html: true,
                content: content,
                // false is very import, since when destroy popover,
                // the really destroy will be invoked by some delay,
                // and before really destory invoked,
                // the new popover is bind by componentDidUpdate method.
                // and finally new popover will be destroyed.
                animation: false
            });
        }
    },
    /**
     * render panel heading
     * @returns {XML}
     */
    renderPanelHeading: function () {
        return (React.createElement("div", {className: this.getCombineCSS("panel-heading n-table-heading","heading")}, 
            React.createElement("div", {className: "row"}, 
                this.renderPanelHeadingLabel(), 
                React.createElement("div", {className: "col-sm-9 col-md-9 col-lg-9"}, 
                    this.renderHeadingButtons(), 
                    this.renderSearchBox()
                )
            )
        ));
    },
    /**
     * render sort button
     * @param column
     * @returns {XML}
     */
    renderTableHeaderSortButton: function (column) {
        if (this.isSortable(column)) {
            var icon = this.getComponentOption("sortIcon");
            var sortClass = this.getCombineCSS("pull-right n-table-sort", "sort");
            if (this.state.sortColumn == column) {
                sortClass += " " + this.getCombineCSS("n-table-sorted", "sorted");
                if (this.state.sortWay == "asc") {
                    icon = this.getComponentOption("sortAscIcon");
                } else {
                    icon = this.getComponentOption("sortDescIcon");
                }
            }
            return (React.createElement("a", {href: "javascript:void(0);", className: sortClass, 
                       onClick: this.onSortClicked.bind(this, column)}, 
                React.createElement(Icon, {icon: icon})
            ));
        }
    },
    /**
     * render heading content.
     * at least and only one parameter can be true.
     * if more than one parameter is true, priority as all > leftFixed > rightFixed
     * @param all {boolean} render all columns?
     * @param leftFixed {boolean} render left fixed columns?
     * @param rightFixed {boolean} render right fixed columns?
     * @returns {XML}
     * @see #getRenderColumnIndexRange
     */
    renderTableHeading: function (all, leftFixed, rightFixed) {
        var indexToRender = this.getRenderColumnIndexRange(all, leftFixed, rightFixed);
        var columnIndex = 0;
        var _this = this;
        return (React.createElement("thead", null, 
        this.columns.map(function (column) {
            if (columnIndex >= indexToRender.min && columnIndex <= indexToRender.max) {
                // column is fixed.
                columnIndex++;
                var style = {};
                style.width = column.width;
                if (!(column.visible === undefined || column.visible === true)) {
                    style.display = "none";
                }
                return (React.createElement("td", {style: style}, 
                    column.title, 
                    _this.renderTableHeaderSortButton(column)
                ));
            } else {
                columnIndex++;
            }
        })
        ));
    },
    /**
     * render operation cell
     * @param column
     * @param data
     * @returns {XML}
     */
    renderOperationCell: function (column, data) {
        var editButton = column.editable ?
            (React.createElement(Button, {bsSize: "xsmall", bsStyle: "link", onClick: this.onEditClicked.bind(this, data), 
                     className: "n-table-op-btn"}, 
                React.createElement(Icon, {icon: this.getComponentOption("rowEditButtonIcon"), size: "lg"})
            )) : null;
        var removeButton = column.removable ?
            (React.createElement(Button, {bsSize: "xsmall", bsStyle: "link", onClick: this.onRemoveClicked.bind(this, data), 
                     className: "n-table-op-btn"}, 
                React.createElement(Icon, {icon: this.getComponentOption("rowRemoveButtonIcon"), size: "lg", iconClassName: "fa-middle"})
            )) : null;
        return (React.createElement(ButtonGroup, {className: "n-table-op-btn-group"}, 
            editButton, 
            removeButton
        ));
    },
    /**
     * render table body rows
     * @param row {*} data of row, json object
     * @param rowIndex {number}
     * @param all {boolean}
     * @param leftFixed {boolean}
     * @param rightFixed {boolean}
     * @returns {XML}
     */
    renderTableBodyRow: function (row, rowIndex, all, leftFixed, rightFixed) {
        var indexToRender = this.getRenderColumnIndexRange(all, leftFixed, rightFixed);
        var columnIndex = 0;
        var _this = this;
        var className = rowIndex % 2 == 0 ? "even" : "odd";
        if (this.getModel().hasError(this.getId())) {
            var rowError = null;
            var errors = this.getModel().getError(this.getId());
            for (var index = 0, count = errors.length; index < count; index++) {
                if (typeof errors[index] !== "string") {
                    rowError = errors[index].getError(row);
                }
            }
            if (rowError != null) {
                className += " has-error";
            }
        }
        return (React.createElement("tr", {className: className}, 
            this.columns.map(function (column) {
                if (columnIndex >= indexToRender.min && columnIndex <= indexToRender.max) {
                    // column is fixed.
                    columnIndex++;
                    var style = {width: column.width};
                    if (!(column.visible === undefined || column.visible === true)) {
                        style.display = "none";
                    }
                    var data;
                    if (column.editable || column.removable) {
                        // operation column
                        data = _this.renderOperationCell(column, row);
                    } else if (column.indexable) {
                        // index column
                        data = rowIndex;
                    } else {
                        // data is property name
                        data = _this.getDisplayTextOfColumn(column, row);
                    }
                    return (React.createElement("td", {style: style}, data));
                } else {
                    columnIndex++;
                }
            })
        ))
    },
    /**
     * render table body
     * at least and only one parameter can be true.
     * if more than one parameter is true, priority as all > leftFixed > rightFixed
     * @param all
     * @param leftFixed
     * @param rightFixed
     * @returns {XML}
     */
    renderTableBody: function (all, leftFixed, rightFixed) {
        var data = this.getDataToDisplay();
        if (data == null || data.length == 0) {
            // no data
            return null;
        }
        var rowIndex = 1;
        var _this = this;
        var range = this.computePagination(data);
        return (React.createElement("tbody", null, 
        data.map(function (element) {
            if (rowIndex >= range.min && rowIndex <= range.max) {
                return _this.renderTableBodyRow(element, rowIndex++, all, leftFixed, rightFixed);
            } else {
                rowIndex++;
                return null;
            }
        })
        ));
    },
    /**
     * render table with no scroll Y
     * @returns {XML}
     */
    renderTableNoScrollY: function () {
        return (React.createElement("div", {className: this.getCombineCSS("n-table-panel-body", "panelBody")}, 
            React.createElement("table", {cellSpacing: "0", className: this.getCombineCSS("n-table cell-border", "table"), 
                   style: this.computeTableStyle(), 
                   id: this.getId()}, 
                this.renderTableHeading(true), 
                this.renderTableBody(true)
            )
        ));
    },
    /**
     * render table with scroll Y
     * @returns {XML}
     */
    renderTableScrollY: function () {
        var style = this.computeTableStyle();
        return (React.createElement("div", {className: this.getCombineCSS("n-table-panel-body", "panelBody")}, 
            React.createElement("div", {className: "n-table-scroll-head", id: this.getScrolledHeaderDivId()}, 
                React.createElement("div", {className: "n-table-scroll-head-inner", style: style}, 
                    React.createElement("table", {cellSpacing: "0", className: this.getCombineCSS("n-table cell-border", "table"), style: style}, 
                        this.renderTableHeading(true)
                    )
                )
            ), 
            React.createElement("div", {className: "n-table-scroll-body", 
                 style: {maxHeight: this.getComponentOption("scrollY"), overflowY: "scroll"}, 
                 id: this.getScrolledBodyDivId()}, 
                React.createElement("table", {cellSpacing: "0", className: this.getCombineCSS("n-table cell-border", "table"), style: style, 
                       id: this.getId()}, 
                    this.renderTableBody(true)
                )
            )
        ));
    },
    /**
     * render table
     * @returns {XML}
     */
    renderTable: function () {
        if (this.hasVerticalScrollBar()) {
            return this.renderTableScrollY();
        } else {
            return this.renderTableNoScrollY();
        }
    },
    /**
     * render fixed left columns with scroll Y
     * @returns {XML}
     */
    renderFixedLeftColumnsScrollY: function () {
        var divStyle = {width: this.computeFixedLeftColumnsWidth() + 1};
        var bodyDivStyle = {width: "100%", overflow: "hidden"};
        if (this.hasHorizontalScrollBar()) {
            // for IE8 box model
            bodyDivStyle.maxHeight = this.getComponentOption("scrollY") - ((this.isIE8()) ? 0 : 18);
        }
        return (
            React.createElement("div", {className: "n-table-fix-left", style: divStyle}, 
                React.createElement("table", {cellSpacing: "0", style: {width: "100%"}, 
                       className: this.getCombineCSS("n-table cell-border", "table")}, 
                    this.renderTableHeading(false, true)
                ), 
                React.createElement("div", {id: this.getFixedLeftBodyDivId(), style: bodyDivStyle}, 
                    React.createElement("table", {cellSpacing: "0", className: this.getCombineCSS("n-table cell-border", "table")}, 
                        this.renderTableBody(false, true)
                    )
                )
            )
        );
    },
    /**
     * render fixed left columns with no scroll Y
     * @returns {XML}
     */
    renderFixedLeftColumnsNoScrollY: function () {
        var divStyle = {width: this.computeFixedLeftColumnsWidth()};
        return (React.createElement("div", {className: "n-table-fix-left", style: divStyle}, 
            React.createElement("table", {cellSpacing: "0", className: this.getCombineCSS("n-table cell-border", "table"), 
                   style: {width: "100%"}}, 
                this.renderTableHeading(false, true), 
                this.renderTableBody(false, true)
            )
        ));
    },
    /**
     * render fixed left columns
     * @returns {XML}
     */
    renderFixedLeftColumns: function () {
        if (!this.hasFixedLeftColumns()) {
            return null;
        }
        if (this.hasVerticalScrollBar()) {
            return this.renderFixedLeftColumnsScrollY();
        } else {
            return this.renderFixedLeftColumnsNoScrollY();
        }
    },
    /**
     * render fixed right columns with no scroll Y
     * @returns {XML}
     */
    renderFixedRightColumnsNoScrollY: function () {
        var divStyle = {width: this.computeFixedRightColumnsWidth() + 1};
        return (React.createElement("div", {className: "n-table-fix-right", style: divStyle}, 
            React.createElement("table", {cellSpacing: "0", className: this.getCombineCSS("n-table cell-border", "table"), 
                   style: {width: "100%"}}, 
                this.renderTableHeading(false, false, true), 
                this.renderTableBody(false, false, true)
            )
        ));
    },
    /**
     * render fixed right columns with scroll Y
     * @returns {XML}
     */
    renderFixedRightColumnsScrollY: function () {
        var divStyle = {width: this.computeFixedRightColumnsWidth() + 1, right: "16px"};
        var bodyDivStyle = {width: "100%", overflow: "hidden"};
        if (this.hasHorizontalScrollBar()) {
            // ie8 box mode, scrollbar is not in height.
            // ie>8 or chrome, scrollbar is in height.
            bodyDivStyle.maxHeight = this.getComponentOption("scrollY") - ((this.isIE8()) ? 0 : 18);
        }
        return (
            React.createElement("div", {className: "n-table-fix-right", style: divStyle}, 
                React.createElement("div", {className: "n-table-fix-right-head-wrapper"}, 
                    React.createElement("div", {className: "n-table-fix-right-top-corner"}), 
                    React.createElement("table", {cellSpacing: "0", style: {width: "100%"}, 
                           className: this.getCombineCSS("n-table cell-border", "table")}, 
                        this.renderTableHeading(false, false, true)
                    )
                ), 
                React.createElement("div", {id: this.getFixedRightBodyDivId(), style: bodyDivStyle}, 
                    React.createElement("table", {cellSpacing: "0", className: this.getCombineCSS("n-table cell-border", "table")}, 
                        this.renderTableBody(false, false, true)
                    )
                )
            )
        );
    },
    /**
     * render fixed right columns
     * @returns {XML}
     */
    renderFixedRightColumns: function () {
        if (!this.hasFixedRightColumns()) {
            return null;
        }
        if (this.hasVerticalScrollBar()) {
            return this.renderFixedRightColumnsScrollY();
        } else {
            return this.renderFixedRightColumnsNoScrollY();
        }
    },
    /**
     * render not data reminder label
     * @returns {XML}
     */
    renderNoDataReminder: function () {
        if (this.hasDataToDisplay()) {
            return null;
        } else {
            return (React.createElement("div", {className: "n-table-no-data"}, React.createElement("span", null, this.getComponentOption("noDataLabel"))));
        }
    },
    /**
     * render pagination
     * @returns {XML}
     */
    renderPagination: function () {
        if (this.isPageable() && this.hasDataToDisplay()) {
            // only show when pageable and has data to display
            return (React.createElement(NPagination, {className: "n-table-pagination", pageCount: this.state.pageCount, 
                                 currentPageIndex: this.state.currentPageIndex, toPage: this.toPage}));
        } else {
            return null;
        }
    },
    /**
     * render
     * @returns {XML}
     */
    render: function () {
        this.prepareDisplayOptions();
        return (
            React.createElement("div", {className: this.getCombineCSS("n-table-container panel panel-default", "div"), id: this.getDivId()}, 
                this.renderPanelHeading(), 
                React.createElement("div", {className: this.getCombineCSS("n-table-body-container panel-body", "body")}, 
                    this.renderTable(), 
                    this.renderFixedLeftColumns(), 
                    this.renderFixedRightColumns(), 
                    this.renderNoDataReminder()
                ), 
                this.renderPagination(), 
                React.createElement(NModalForm, {ref: "editDialog", title: this.getLayout().getLabel(), css: "n-table-edit-dialog"}), 
                React.createElement(NConfirm, {zIndex: 9000, ref: "confirmDialog"})
            )
        );
    },
    /**
     * has vertical scroll bar
     * @returns {boolean}
     */
    hasVerticalScrollBar: function () {
        var scrollY = this.getComponentOption("scrollY");
        return scrollY === false ? false : true;
    },
    /**
     * has horizontal scroll bar
     * @returns {boolean}
     */
    hasHorizontalScrollBar: function () {
        var scrollX = this.getComponentOption("scrollX");
        return scrollX === true;
    },
    /**
     * compute table style
     * @returns {{width: number, maxWidth: number}}
     */
    computeTableStyle: function () {
        var width = 0;
        if (this.hasHorizontalScrollBar()) {
            width = 0;
            // calculate width
            this.columns.forEach(function (column) {
                if (column.visible === undefined || column.visible === true) {
                    width += column.width;
                }
            });
        } else {
            width = "100%";
        }
        return {width: width, maxWidth: width};
    },
    /**
     * compute fixed left columns width
     * @returns {number}
     */
    computeFixedLeftColumnsWidth: function () {
        var width = 0;
        var fixedLeftColumns = this.getMaxFixedLeftColumnIndex();
        var columnIndex = 0;
        this.columns.forEach(function (element) {
            if (columnIndex <= fixedLeftColumns && (element.visible === undefined || element.visible === true)) {
                // column is fixed.
                width += element.width;
            }
            columnIndex++;
        });
        return width;
    },
    /**
     * compute fixed right columns width
     * @returns {number}
     */
    computeFixedRightColumnsWidth: function () {
        var width = 0;
        var fixedRightColumns = this.getMinFixedRightColumnIndex();
        var columnIndex = 0;
        this.columns.forEach(function (element) {
            if (columnIndex >= fixedRightColumns && (element.visible === undefined || element.visible === true)) {
                // column is fixed
                width += element.width;
            }
            columnIndex++;
        });
        return width;
    },

    /**
     * get column index range for rendering
     * at least and only one parameter can be true.
     * if more than one parameter is true, priority as all > leftFixed > rightFixed
     * @param all
     * @param leftFixed
     * @param rightFixed
     * @returns {{min, max}}
     */
    getRenderColumnIndexRange: function (all, leftFixed, rightFixed) {
        var index = {};
        if (all) {
            index.min = 0;
            index.max = 10000;
        } else if (leftFixed) {
            index.min = 0;
            index.max = this.getMaxFixedLeftColumnIndex();
        } else if (rightFixed) {
            index.min = this.getMinFixedRightColumnIndex();
            index.max = 10000;
        }
        return index;
    },
    /**
     * get max fixed left column index. if no column is fixed in left, return -1
     * @returns {number}
     */
    getMaxFixedLeftColumnIndex: function () {
        return this.fixedLeftColumns - 1;
    },
    /**
     * get min fixed right column index. if no column is fixed in right, return
     * max column index.
     * eg. there are 3 columns in table, if no fixed right column, return 3. if
     * 1 fixed right column, return 2.
     * @returns {number}
     */
    getMinFixedRightColumnIndex: function () {
        return this.columns.length() - this.fixedRightColumns;
    },
    /**
     * compute pagination
     * @param data array of data
     * @returns {{min, max}}
     */
    computePagination: function (data) {
        var minRowIndex = 0;
        var maxRowIndex = 999999;
        if (this.isPageable()) {
            this.state.countPerPage = this.getComponentOption("countPerPage");
            this.state.pageCount = this.computePageCount(data, this.state.countPerPage);
            this.state.currentPageIndex = this.state.currentPageIndex > this.state.pageCount ? this.state.pageCount : this.state.currentPageIndex;
            this.state.currentPageIndex = this.state.currentPageIndex <= 0 ? 1 : this.state.currentPageIndex;
            minRowIndex = (this.state.currentPageIndex - 1) * this.state.countPerPage + 1;
            maxRowIndex = minRowIndex + this.state.countPerPage - 1;
        }
        return {min: minRowIndex, max: maxRowIndex};
    },
    /**
     * compute page count
     * @param data {[*]}
     * @param countPerPage {number}
     * @returns {number}
     */
    computePageCount: function (data, countPerPage) {
        var pageCount = data.length == 0 ? 1 : data.length / countPerPage;
        return (Math.floor(pageCount) == pageCount) ? pageCount : (Math.floor(pageCount) + 1);
    },
    /**
     * has fixed left columns
     * @returns {boolean}
     */
    hasFixedLeftColumns: function () {
        return this.fixedLeftColumns > 0;
    },
    /**
     * has fixed right columns or not
     * @returns {boolean}
     */
    hasFixedRightColumns: function () {
        return this.fixedRightColumns > 0;
    },
    /**
     * check the table is addable or not
     * @returns {boolean}
     */
    isAddable: function () {
        return this.getComponentOption("addable");
    },
    /**
     * check the table is editable or not
     * @returns {boolean}
     */
    isEditable: function () {
        return this.getComponentOption("editable");
    },
    /**
     * check the table is removable or not
     * @returns {boolean}
     */
    isRemovable: function () {
        return this.getComponentOption("removable");
    },
    /**
     * check the table is searchable or not
     * @returns {boolean}
     */
    isSearchable: function () {
        return this.getComponentOption("searchable");
    },
    /**
     * check the table is indexable or not
     * @returns {boolean}
     */
    isIndexable: function () {
        return this.getComponentOption("indexable");
    },
    /**
     * check the table is pageable or not
     * @returns {boolean}
     */
    isPageable: function () {
        return this.getComponentOption("pageable");
    },
    /**
     * check the column is sortable or not
     * @param column if no passed, check the table
     * @returns {boolean}
     */
    isSortable: function (column) {
        if (column === undefined) {
            return this.getComponentOption("sortable");
        } else if (this.isSortable()) {
            // check the table option
            if (column.sort === false) {
                // if column is defined as not sortable, return false
                return false;
            } else if (column.editable || column.removable || column.indexable) {
                // operation and index column cannot sort
                return false;
            } else {
                return true;
            }
        } else {
            // even table is not sortable, the special column can be sortable
            return column.sort !== undefined && column.sort != null;
        }
    },
    /**
     * check has data to display or not
     * @returns {boolean}
     */
    hasDataToDisplay: function () {
        var data = this.getDataToDisplay();
        return data != null && data.length > 0;
    },
    /**
     * get display text of given column configuration
     * @param column column configuration
     * @param data row data
     * @return display text
     */
    getDisplayTextOfColumn: function (column, data) {
        var text = null;
        if (column.render) {
            text = column.render(data);
        } else {
            text = data[column.data];
        }
        if (typeof text === "boolean") {
            if (text === true) {
                return "Y";
            } else if (text === false) {
                return "N";
            }
        }
        return text == null ? null : text.toString();
    },
    /**
     * filter data to display
     * @param row
     * @param rowIndex
     * @param all
     * @returns {boolean} true means data of row can match the search text
     */
    filterData: function (row, rowIndex, all) {
        var text = this.state.searchText.toUpperCase();
        // do not use this.column, it maybe add index or operation columns
        var columns = this.getComponentOption("columns");
        var _this = this;
        return columns.some(function (column) {
            var data = _this.getDisplayTextOfColumn(column, row);
            if (data == null) {
                return false;
            }
            if (data.toString().toUpperCase().indexOf(text) != -1) {
                return true;
            }
            return false;
        });
    },
    /**
     * get data to display
     * @returns {[*]}
     */
    getDataToDisplay: function () {
        var data = this.getValueFromModel();
        return this.isSearching() ? data.filter(this.filterData) : data;
    },
    /**
     * is searching
     * @returns {boolean}
     */
    isSearching: function () {
        return this.isSearchable() && this.state.searchText != null && this.state.searchText.length != 0;
    },
    /**
     * on add button clicked
     */
    onAddClicked: function () {
        var data = $pt.cloneJSON(this.getComponentOption("modelTemplate"));
        this.refs.editDialog.show(this.createEditingModel(data),
            $pt.createFormLayout(this.getComponentOption("editLayout")), {
                right: [{
                    icon: this.getComponentOption("editDialogSaveButtonIcon"),
                    text: this.getComponentOption("editDialogSaveButtonText"),
                    style: "primary",
                    onClick: this.onAddCompleted.bind(this)
                }]
            });
    },
    /**
     * on add completed
     */
    onAddCompleted: function () {
        var data = this.refs.editDialog.hide();
        this.getModel().add(this.getId(), data.getCurrentModel());
    },
    /**
     * on edit button clicked
     * @param data {*} data of row
     */
    onEditClicked: function (data) {
        this.refs.editDialog.show(this.createEditingModel(data),
            $pt.createFormLayout(this.getComponentOption("editLayout")), {
                right: [{
                    icon: this.getComponentOption("editDialogSaveButtonIcon"),
                    text: this.getComponentOption("editDialogSaveButtonText"),
                    style: "primary",
                    onClick: this.onEditCompleted.bind(this)
                }]
            });
    },
    /**
     * on edit completed
     */
    onEditCompleted: function () {
        var data = this.refs.editDialog.hide();
        var original = data.getOriginalModel();
        var current = data.getCurrentModel();
        this.getModel().update(this.getId(), original, current);
    },
    /**
     * on remove button clicked
     * @param data {*} data of row
     */
    onRemoveClicked: function (data) {
        var removeRow = function (data) {
            this.getModel().remove(this.getId(), data);
            this.refs.confirmDialog.hide();
        };
        this.refs.confirmDialog.show("Delete data?",
            ["Are you sure you want to delete data?", "Deleted data cannot be recovered."],
            removeRow.bind(this, data));
    },
    /**
     * on search box changed
     */
    onSearchBoxChanged: function (evt) {
        var value = evt.target.value;
        if (value == "") {
            this.setState({searchText: null});
        } else {
            this.setState({searchText: value});
        }
    },
    /**
     * on sort icon clicked
     * @param column
     */
    onSortClicked: function (column) {
        var sortWay = "asc";
        if (this.state.sortColumn == column) {
            // the column is sorted, so set sortWay as another
            sortWay = this.state.sortWay == "asc" ? "desc" : "asc";
        }
        var sorter = null;
        var isNumberValue = false;
        // specific sort
        if (column.sort !== undefined && column.sort != null) {
            if (typeof column.sort === "function") {
                sorter = column.sort;
            } else if (column.sort === "number") {
                isNumberValue = true;
            } else {
                throw $pt.createComponentException($pt.ComponentConstants.Err_Unuspported_Column_Sort,
                    "Column sort [" + column.sort + "] is not supported yet.");
            }
        }
        var _this = this;
        // if no sorter specific in column
        var sorter = sorter == null ? (function (a, b) {
            var v1 = _this.getDisplayTextOfColumn(column, a),
                v2 = _this.getDisplayTextOfColumn(column, b);
            if (v1 == null) {
                return v2 == null ? 0 : -1;
            } else if (v2 == null) {
                return 1;
            } else {
                if (isNumberValue) {
                    // parse to number value
                    v1 *= 1;
                    v2 *= 1;
                }
                if (v1 > v2) {
                    return 1;
                } else if (v1 < v2) {
                    return -1;
                } else {
                    return 0;
                }
            }
        }) : sorter;

        if (sortWay == "asc") {
            this.getValueFromModel().sort(sorter);
        } else {
            this.getValueFromModel().sort(function (a, b) {
                return 0 - sorter(a, b);
            });
        }
        this.setState({sortColumn: column, sortWay: sortWay});
    },
    /**
     * create editing model
     * @param item
     */
    createEditingModel: function (item) {
        var modelValidator = this.getModel().getValidator();
        var tableValidator = modelValidator ? modelValidator.getConfig()[this.getId()] : null;
        var itemValidator = tableValidator ? $pt.createModelValidator(tableValidator["table"]) : null;
        return $pt.createModel(item, itemValidator);
    },
    /**
     * on model change
     * @param evt
     */
    onModelChange: function (evt) {
        if (evt.type == "add") {
            this.computePagination(this.getDataToDisplay());
            this.state.currentPageIndex = this.state.pageCount;
        } else if (evt.type == "remove") {
            // do nothing
        } else if (evt.type == "change") {
            // do nothing
        }

        if (this.getModel().getValidator() != null) {
            this.getModel().validate(this.getId());
        } else {
            this.forceUpdate();
        }
    },
    /**
     * on model validate change
     * @param evt
     */
    onModelValidateChange: function (evt) {
        // maybe will introduce performance issue, cannot sure now.
        this.forceUpdate();
    },
    /**
     * jump to page by given page index
     * @param pageIndex
     */
    toPage: function (pageIndex) {
        this.setState({currentPageIndex: pageIndex});
    },
    /**
     * get div id
     * @returns {string}
     */
    getDivId: function () {
        return "ntable-" + this.getId();
    },
    /**
     * get header label id
     * @returns {string}
     */
    getHeaderLabelId: function () {
        return "ntable-header-label-" + this.getId();
    },
    /**
     * get scrolled header div id
     * @returns {string}
     */
    getScrolledHeaderDivId: function () {
        return "ntable-scrolled-head-" + this.getId();
    },
    /**
     * get scrolled body div id
     * @returns {string}
     */
    getScrolledBodyDivId: function () {
        return "ntable-scrolled-body-" + this.getId();
    },
    /**
     * get scrolled fixed left body div id
     * @returns {string}
     */
    getFixedLeftBodyDivId: function () {
        return "ntable-scrolled-left-body-" + this.getId();
    },
    /**
     * get scrolled fixed right body div id
     * @returns {string}
     */
    getFixedRightBodyDivId: function () {
        return "ntable-scrolled-right-body-" + this.getId();
    }
}));

/**
 * text input
 */
var NText = React.createClass($pt.defineComponentConfig({
    propTypes: {
        // model
        model: React.PropTypes.object,
        // CellLayout
        layout: React.PropTypes.object
    },
    getDefaultProps: function () {
        return {defaultOptions: {}};
    },
    /**
     * will update
     * @param nextProps
     */
    componentWillUpdate: function (nextProps) {
        // remove post change listener to handle model change
        this.removePostChangeListener(this.onModelChange);
    },
    /**
     * did update
     * @param prevProps
     * @param prevState
     */
    componentDidUpdate: function (prevProps, prevState) {
        this.getComponent().val(this.getValueFromModel());
        // add post change listener to handle model change
        this.addPostChangeListener(this.onModelChange);
    },
    /**
     * did mount
     */
    componentDidMount: function () {
        // set model value to component
        this.getComponent().val(this.getValueFromModel());
        // add post change listener to handle model change
        this.addPostChangeListener(this.onModelChange);
    },
    /**
     * will unmount
     */
    componentWillUnmount: function () {
        // remove post change listener to handle model change
        this.removePostChangeListener(this.onModelChange);
    },
    /**
     * render
     * @returns {XML}
     */
    render: function () {
        return React.createElement("input", {type: "text", className: this.getComponentCSS("form-control"), id: this.getId(), 
                      onChange: this.onComponentChange, disabled: !this.isEnabled()})
    },
    /**
     * on component change
     * @param evt
     */
    onComponentChange: function (evt) {
        this.setValueToModel(evt.target.value);
    },
    /**
     * on model change
     * @param evt
     */
    onModelChange: function (evt) {
        this.getComponent().val(evt.new);
    }
}));