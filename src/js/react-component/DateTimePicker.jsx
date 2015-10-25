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
        return (<div className={this.getCombineCSS("input-group", "div")} id={this.getDivId()}>
            <input id={this.getId()} type='text' className={this.getComponentCSS("form-control")}/>
            <span className="input-group-addon">
                <Icon icon="calendar"/>
            </span>
        </div>);
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