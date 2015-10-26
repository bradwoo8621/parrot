/**
 * modal form dialog
 *
 * depends NPanelFooter, NForm, NConfirm
 */
var NModalForm = React.createClass({
	statics: {
		/**
		 * create form modal dialog
		 * @param title
		 * @param className
		 * @returns {object}
		 */
		createFormModal: function (title, className) {
			if ($pt.formModalIndex === undefined || $pt.formModalIndex === null) {
				$pt.formModalIndex = 1500;
			} else {
				$pt.formModalIndex += 1;
			}
			var containerId = "form_modal_container_" + $pt.formModalIndex;
			var container = $("#" + containerId);
			if (container.length == 0) {
				$("<div id='" + containerId + "' />").appendTo($(document.body));
			}
			var css = {
				"n-modal-form": true
			};
			if (className) {
				css[className] = true;
			}
			return React.render(<NModalForm title={title} className={$pt.LayoutHelper.classSet(css)}
			                                zIndex={$pt.formModalIndex}/>,
				document.getElementById(containerId));
		},
		RESET_CONFIRM_TITLE: "Reset Data",
		RESET_CONFIRM_MESSAGE: ["Are you sure to reset data?", "All data will be lost and cannot be recovered."],
		CANCEL_CONFIRM_TITLE: "Cancel Editing",
		CANCEL_CONFIRM_MESSAGE: ["Are you sure to cancel current operating?", "All data will be lost and cannot be recovered."]
	},
	propTypes: {
		title: React.PropTypes.string,
		className: React.PropTypes.string,
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
				div.css({
					"z-index": this.props.zIndex * 1 + 1
				});
				div.prev().css({
					"z-index": this.props.zIndex * 1
				});
				div.removeAttr('tabIndex');
			}
		}
		document.body.style.paddingRight = 0;
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
	 * render footer
	 * @returns {XML}
	 */
	renderFooter: function () {
		if (this.state.footer === false) {
			return <div></div>;
		} else {
			return (<Modal.Footer className="n-modal-form-footer">
				<NPanelFooter reset={this.getResetButton()}
				              validate={this.getValidationButton()}
				              save={this.getSaveButton()}
				              cancel={this.getCancelButton()}
				              left={this.getLeftButton()}
				              right={this.getRightButton()}
				              model={this.getModel()}/>
			</Modal.Footer>);
		}
	},
	/**
	 * render
	 * @returns {*}
	 */
	render: function () {
		if (!this.state.visible) {
			return null;
		}
		var title = this.state.title ? this.state.title : this.props.title;
		return (<Modal className={this.props.className} backdrop="static" onHide={this.hide} bsStyle="danger">
			<Modal.Header closeButton>
				<Modal.Title>{title}</Modal.Title>
			</Modal.Header>
			<Modal.Body ref="body">
				<NForm model={this.getModel()} layout={this.getLayout()} direction={this.getDirection()} ref="form"/>
			</Modal.Body>

			{this.renderFooter()}
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
		NConfirm.getConfirmModal().show(NModalForm.RESET_CONFIRM_TITLE,
			NModalForm.RESET_CONFIRM_MESSAGE,
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
		NConfirm.getConfirmModal().show(NModalForm.CANCEL_CONFIRM_TITLE,
			NModalForm.CANCEL_CONFIRM_MESSAGE,
			this.hide.bind(this));
	},
	/**
	 * get model
	 * @returns {ModelInterface}
	 */
	getModel: function () {
		return this.state.model;
	},
	/**
	 * get layout
	 * @returns {FormLayout}
	 */
	getLayout: function () {
		return this.state.layout;
	},
	/**
	 * get direction
	 * @returns {string}
	 */
	getDirection: function () {
		return this.state.direction;
	},
	/**
	 * get left button configuration
	 * @returns {{}|{}[]}
	 */
	getLeftButton: function () {
		return this.state.buttons ? this.state.buttons.left : null;
	},
	/**
	 * get right button configuration
	 * @returns {{}|{}[]}
	 */
	getRightButton: function () {
		return this.state.buttons ? this.state.buttons.right : null;
	},
	/**
	 * get validation button
	 * @returns {function}
	 */
	getValidationButton: function () {
		if (this.state.buttons && this.state.buttons.validate === false) {
			return null;
		} else {
			return this.onValidateClicked.bind(this);
		}
	},
	/**
	 * get cancel button
	 * @returns {function}
	 */
	getCancelButton: function () {
		if (this.state.buttons && this.state.buttons.cancel === false) {
			return null;
		} else {
			return this.onCancelClicked.bind(this);
		}
	},
	/**
	 * get reset button
	 * @returns {function}
	 */
	getResetButton: function () {
		if (this.state.buttons && this.state.buttons.reset === false) {
			return null;
		} else {
			return this.onResetClicked.bind(this);
		}
	},
	/**
	 * get save button configuration
	 * @returns {{}}
	 */
	getSaveButton: function () {
		return this.state.buttons ? this.state.buttons.save : null;
	},
	/**
	 * validate
	 * @returns {boolean}
	 */
	validate: function () {
		this.getModel().validate();
		this.forceUpdate();
		return this.getModel().hasError();
	},
	/**
	 * hide dialog
	 * @return model
	 */
	hide: function () {
		var model = this.state.model;
		this.setState({
			visible: false,
			model: null,
			layout: null,
			buttons: null
		});
		return model;
	},
	/**
	 * show dialog
	 *
	 * from 0.0.3, all parameters can be defined in first as a JSON.
	 * @param model
	 * @param layout
	 * @param buttons
	 * @param direction vertical or horizontal
	 * @param footer {boolean}
	 * @param title {string}
	 */
	show: function (model, layout, buttons, direction, footer, title) {
		if (!model.getCurrentModel) {
			// test the model is ModelInterface or not
			this.setState({
				visible: true,
				model: model.model,
				layout: model.layout,
				buttons: model.buttons,
				direction: model.direction,
				footer: model.footer,
				title: model.title
			});
		} else {
			this.setState({
				visible: true,
				model: model,
				layout: layout,
				buttons: buttons,
				direction: direction,
				footer: footer,
				title: title
			});
		}
	}
});