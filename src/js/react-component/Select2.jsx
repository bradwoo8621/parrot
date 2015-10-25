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
        return <select style={{width: this.getComponentOption("width")}} id={this.getId()}/>;
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
