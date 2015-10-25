/**
 * panel footer which only contains buttons
 */
var NPanelFooter = React.createClass({
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
        return (<Button bsStyle={option.style ? option.style : "default"}
                        onClick={this.onButtonClicked.bind(this, option.onClick)}>
            {option.icon ? <Icon icon={option.icon}/> : null} {option.text}
        </Button>);
    },
    /**
     * render
     * @returns {XML}
     */
    render: function () {
        return (<div className="row">
            <div className="col-sm-6 col-md-6 col-lg-6">
                <ButtonToolbar className="panel-footer panel-footer-left">
                    {this.props.reset ? this.renderButton({
                        icon: "reply-all", text: "Reset", style: "warning", onClick: this.props.reset
                    }) : null}
                    {this.props.validate ? this.renderButton({
                        icon: "bug", text: "Validate", onClick: this.props.validate
                    }) : null}
                    {this.renderLeftButtons()}
                </ButtonToolbar>
            </div>
            <div className="col-sm-6 col-md-6 col-lg-6">
                <ButtonToolbar className="panel-footer panel-footer-right">
                    {this.renderRightButtons()}
                    {this.props.save ? this.renderButton({
                        icon: "floppy-o", text: "Save", style: "primary", onClick: this.props.save
                    }) : null}
                    {this.props.cancel ? this.renderButton({
                        icon: "trash-o", text: "Cancel", style: "danger", onClick: this.props.cancel
                    }) : null}
                </ButtonToolbar>
            </div>
        </div>);
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