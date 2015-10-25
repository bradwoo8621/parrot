/**
 * form component, a div
 */
var NForm = React.createClass({
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
            return <NFormCell layout={cell} model={_this.getModel()}/>;
        });
        return (<div className="row">{cells}</div>);
    },
    /**
     * render
     * @returns {XML}
     */
    render: function () {
        return (<div>{this.props.layout.getRows().map(this.renderRow)}</div>);
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
        return <NText model={this.getModel()} layout={this.getLayout()}/>;
    },
    /**
     * render checkbox
     * @returns {XML}
     */
    renderCheck: function () {
        return <NCheck model={this.getModel()} layout={this.getLayout()}/>;
    },
    /**
     * render datetime picker
     * @returns {XML}
     */
    renderDateTime: function () {
        return <NDateTime model={this.getModel()} layout={this.getLayout()}/>;
    },
    /**
     * render select
     * @returns {XML}
     */
    renderSelect: function () {
        return <NSelect model={this.getModel()} layout={this.getLayout()}/>;
    },
    /**
     * render search text
     * @returns {XML}
     */
    renderSearch: function () {
        return <NSearchText model={this.getModel()} layout={this.getLayout()}/>;
    },
    /**
     * render table
     * @returns {XML}
     */
    renderTable: function () {
        return <NTable model={this.getModel()} layout={this.getLayout()}/>;
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
            return (<div className={this.getCSSClassName()}>
                {this.renderTable()}
            </div>);
        } else {
            var css = this.getCSSClassName();
            if (this.getModel().hasError(this.getId())) {
                css += " has-error";
            }
            var requiredLabel = this.getModel().isRequired(this.getId()) ?
                (<Icon icon="star" fixWidth={true} iconClassName="required"/>) : null;
            return (<div className={css}>
                <label htmlFor={this.getId()}
                       className={this.getLayout().getLabelCSS()}
                       id={this.getLabelId()}>
                    {this.getLayout().getLabel()}
                    {requiredLabel}:
                </label>
                {this.renderInputComponent()}
            </div>);
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