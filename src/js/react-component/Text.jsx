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
        return <input type="text" className={this.getComponentCSS("form-control")} id={this.getId()}
                      onChange={this.onComponentChange} disabled={!this.isEnabled()}/>
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