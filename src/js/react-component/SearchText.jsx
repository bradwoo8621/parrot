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
        return (<div className="input-group search-text">
            <input type="text" className={this.getCombineCSS("form-control search-code", "text")}
                   id={this.getId()} onChange={this.onComponentChange}/>
            <span className="input-group-btn" style={{width: "0px"}}></span>
            <input type="text" className={this.getCombineCSS("form-control search-label", "label")}
                   readOnly={true} onFocus={this.onLabelFocused}/>
            <span className="input-group-addon search-btn" onClick={this.onSearchClicked}>
                <Icon icon={this.getComponentOption("searchButtonIcon")}/>
            </span>
            <span className="input-group-addon advanced-search-btn" onClick={this.onAdvancedSearchClicked}>
                <Icon icon={this.getComponentOption("advancedSearchButtonIcon")}/>
            </span>
        </div>);
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