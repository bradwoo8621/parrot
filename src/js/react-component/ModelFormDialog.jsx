/**
 * modal form dialog
 */
var NModalForm = React.createClass({
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

        return (<Modal className={this.props.css} title={this.props.title}
                       closeButton={false} backdrop="static">
            <div className="modal-body" ref="body">
                <NForm model={this.getModel()} layout={this.getLayout()} ref="form"/>
            </div>
            <div className="modal-footer modal-form-footer">
                <NPanelFooter reset={this.onResetClicked.bind(this)}
                              validate={this.onValidateClicked.bind(this)}
                              save={this.getSaveButton()}
                              cancel={this.onCancelClicked.bind(this)}
                              left={this.getLeftButton()}
                              right={this.getRightButton()}/>
            </div>
            <NConfirm zIndex={9000} ref="confirmDialog"/>
        </Modal>);
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