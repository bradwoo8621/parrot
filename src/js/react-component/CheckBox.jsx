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
        return (<a href="javascript:void(0);" onClick={this.handleHrefClicked} className="n-checkbox">
            <Icon icon={this.isChecked() ? "check-square-o" : "square-o"} size="lg"/>
        </a>);
    },
    /**
     * render
     * @returns {XML}
     */
    render: function () {
        return (<div className={this.getComponentCSS("")}>
            <label>
                {this.renderCheckbox()}
                <input type="checkbox" id={this.getId()} style={{display: "none"}}
                       onChange={this.onComponentChange}/>
            </label>
        </div>);
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