/**
 * modal confirm dialog
 */
var NConfirm = React.createClass({
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
        return (<Button bsStyle="danger" onClick={this.onConfirmClicked}>
            <Icon icon="check"/> {this.props.confirmText}
        </Button>);
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
        return (<Button onClick={this.hide}>
            <Icon icon="times-circle"/> {text}
        </Button>);
    },
    /**
     * render footer
     * @returns {XML}
     */
    renderFooter: function () {
        if (this.state.options && this.state.options.disableButtons) {
            return null;
        }
        return (<div className="modal-footer">
            {this.renderConfirmButton()}
            {this.renderCloseButton()}
        </div>);
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
            return <h5>{element}</h5>;
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

        return (<Modal className={this.props.css} bsStyle="danger" title={this.state.title}
                       onRequestHide={this.hide} backdrop="static">
            <div className="modal-body" ref="body">
                {this.renderContent()}
            </div>
            {this.renderFooter()}
        </Modal>);
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