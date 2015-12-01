/**
 * modal confirm dialog
 * z-index is 9699 and 9698, less than exception dialog, on request dialog and code search dialog, more than any other.
 *
 * depends NFormButton
 */
(function (context, $, $pt) {
	var NConfirm = React.createClass({
		displayName: 'NConfirm',
		statics: {
			getConfirmModal: function (className) {
				if ($pt.confirmDialog === undefined || $pt.confirmDialog === null) {
					var confirmContainer = $("#confirm_modal_container");
					if (confirmContainer.length == 0) {
						$("<div id='confirm_modal_container' />").appendTo($(document.body));
					}
					$pt.confirmDialog = React.render(<NConfirm className={className}/>,
						document.getElementById("confirm_modal_container"));
				}
				return $pt.confirmDialog;
			},
			OK_TEXT: 'OK',
			OK_ICON: 'check',
			CLOSE_TEXT: 'Close',
			CLOSE_ICON: 'ban',
			CANCEL_TEXT: 'Cancel',
			CANCEL_ICON: 'ban'
		},
		propTypes: {
			className: React.PropTypes.string
		},
		getDefaultProps: function () {
			return {};
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
			var div = $(React.findDOMNode(this.refs.body)).closest(".modal");
			if (div.length > 0) {
				div.css({
					"z-index": 9699
				});
				div.prev().css({
					"z-index": 9698
				});
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
		 * render confirm button
		 * @returns {XML}
		 */
		renderConfirmButton: function () {
			if (this.state.options && this.state.options.disableConfirm) {
				return null;
			}
			var layout = $pt.createCellLayout('pseudo-button', {
				label: NConfirm.OK_TEXT,
				comp: {
					type: $pt.ComponentConstants.Button,
					icon: NConfirm.OK_ICON,
					style: 'primary',
					click: this.onConfirmClicked.bind(this)
				}
			});
			return <NFormButton layout={layout}/>;
		},
		/**
		 * render close button
		 * @returns {XML}
		 */
		renderCloseButton: function () {
			if (this.state.options && this.state.options.disableClose) {
				return null;
			}
			var layout = $pt.createCellLayout('pseudo-button', {
				label: (this.state.options && this.state.options.close) ? NConfirm.CLOSE_TEXT : NConfirm.CANCEL_TEXT,
				comp: {
					type: $pt.ComponentConstants.Button,
					icon: (this.state.options && this.state.options.close) ? NConfirm.CLOSE_ICON : NConfirm.CANCEL_ICON,
					style: 'danger',
					click: this.onCancelClicked.bind(this)
				}
			});
			return <NFormButton layout={layout}/>;
		},
		/**
		 * render footer
		 * @returns {XML}
		 */
		renderFooter: function () {
			if (this.state.options && this.state.options.disableButtons) {
				return <div className='modal-footer-empty'/>;
			}
			return (<Modal.Footer>
				{this.renderCloseButton()}
				{this.renderConfirmButton()}
			</Modal.Footer>);
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
				return <h6>{element}</h6>;
			});
		},
		/**
		 * render
		 * @returns {XML}
		 */
		render: function () {
			if (!this.state.visible) {
				return null;
			}
			var css = {
				'n-confirm': true
			};
			if (this.props.className) {
				css[this.props.className] = true;
			}
			return (<Modal className={$pt.LayoutHelper.classSet(css)}
			               bsStyle="danger" backdrop="static"
			               onHide={this.onCancelClicked}>
				<Modal.Header closeButton={true}>
					<Modal.Title>{this.state.title}</Modal.Title>
				</Modal.Header>
				<Modal.Body ref="body">
					{this.renderContent()}
				</Modal.Body>
				{this.renderFooter()}
			</Modal>);
		},
		/**
		 * hide dialog
		 */
		hide: function () {
			this.setState({
				visible: false,
				title: null,
				options: null,
				onConfirm: null,
				onCancel: null
			});
		},
		/**
		 * on confirm clicked
		 */
		onConfirmClicked: function () {
			if (this.state.onConfirm) {
				this.state.onConfirm.call(this);
			}
			this.hide();
			if (this.state.afterClose) {
				this.state.afterClose.call(this, 'confirm');
			}
		},
		/**
		 * on cancel clicked
		 */
		onCancelClicked: function () {
			if (this.state.onCancel) {
				this.state.onCancel.call(this);
			}
			this.hide();
			if (this.state.afterClose) {
				this.state.afterClose.call(this, 'cancel');
			}
		},
		/**
		 * show dialog
		 *
		 * from 0.0.3
		 * all parameters should be pass to #show in first as a JSON object
		 *
		 * @param title deprecated title of dialog
		 * @param options string or string array, or object as below.
		 *          {
	 *              disableButtons: true, // hide button bar
	 *              disableConfirm: true, // hide confirm button
	 *              disableClose: true, // hide close button
	 *              messsages: "", // string or string array,
	 *              close: true, // show close button text as "close"
	 *              onConfirm: function,
	 *              onCancel: function,
	 *              afterClose: function,
	 *              title: string
	 *          }
		 * @param onConfirm deprecated callback function when confirm button clicked
		 * @param onCancel deprecated callback function when cancel button clicked
		 */
		show: function (title, options, onConfirm, onCancel) {
			$(':focus').blur();
			var state;
			if (typeof title === 'string') {
				state = {
					visible: true,
					title: title,
					options: options,
					onConfirm: onConfirm,
					onCancel: onCancel,
					afterClose: options.afterClose
				};
			} else {
				// for new API
				options = title;
				state = {
					visible: true,
					title: options.title,
					options: {
						disableButtons: options.disableButtons,
						disableConfirm: options.disableConfirm,
						disableClose: options.disableClose,
						close: options.close,
						messages: options.messages
					},
					onConfirm: options.onConfirm,
					onCancel: options.onCancel,
					afterClose: options.afterClose
				};
			}
			this.setState(state);
		}
	});
	context.NConfirm = NConfirm;
}(this, jQuery, $pt));
