/**
 * modal confirm dialog
 * z-index is 9699 and 9698, less than exception dialog, on request dialog and code search dialog, more than any other.
 *
 * depends NFormButton
 */
(function (window, $, React, ReactDOM, $pt) {
	var NConfirm = React.createClass({
		displayName: 'NConfirm',
		statics: {
			getConfirmModal: function (className) {
				if ($pt.confirmDialog === undefined || $pt.confirmDialog === null) {
					var confirmContainer = $("#confirm_modal_container");
					if (confirmContainer.length == 0) {
						$("<div id='confirm_modal_container' />").appendTo($(document.body));
					}
					$pt.confirmDialog = ReactDOM.render(<$pt.Components.NConfirm className={className}/>,
						document.getElementById("confirm_modal_container"));
				}
				return $pt.confirmDialog;
			},
			OK_TEXT: 'OK',
			OK_ICON: 'check',
			CLOSE_TEXT: 'Close',
			CLOSE_ICON: 'ban',
			CANCEL_TEXT: 'Cancel',
			CANCEL_ICON: 'ban',
			Z_INDEX: 9698
		},
		getDefaultProps: function () {
			return {};
		},
		getInitialState: function () {
			return {
				visible: false
			};
		},
		/**
		 * set z-index
		 */
		fixDocumentPadding: function () {
			document.body.style.paddingRight = 0;
		},
		/**
		 * did update
		 * @param prevProps
		 * @param prevState
		 */
		componentDidUpdate: function (prevProps, prevState) {
			this.fixDocumentPadding();
			if (this.state.visible) {
				$(document).on('keyup', this.onDocumentKeyUp);
			} else {
				$(document).off('keyup', this.onDocumentKeyUp);
			}
		},
		/**
		 * did mount
		 */
		componentDidMount: function () {
			this.fixDocumentPadding();
			if (this.state.visible) {
				$(document).on('keyup', this.onDocumentKeyUp);
			} else {
				$(document).off('keyup', this.onDocumentKeyUp);
			}
		},
		componentWillUpdate: function() {
			$(document).off('keyup', this.onDocumentKeyUp);
		},
		componentWillUnmount: function() {
			$(document).off('keyup', this.onDocumentKeyUp);
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
					click: this.onConfirmClicked
				}
			});
			return <$pt.Components.NFormButton layout={layout} model={$pt.createModel({})}/>;
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
					click: this.onCancelClicked
				}
			});
			return <$pt.Components.NFormButton layout={layout} model={$pt.createModel({})}/>;
		},
		renderDialogCloseButton: function() {
			if (this.isDialogCloseShown()) {
				return (<button className="close"
						onClick={this.onCancelClicked}
						aria-label="Close"
						style={{marginTop: '-2px'}}>
					<span aria-hidden="true">×</span>
				</button>);
			}
			return null;
		},
		/**
		 * render footer
		 * @returns {XML}
		 */
		renderFooter: function () {
			if (this.state.options && this.state.options.disableButtons) {
				return <div className='modal-footer-empty'/>;
			}
			return (<div className="modal-footer">
				{this.renderCloseButton()}
				{this.renderConfirmButton()}
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
			return messages.map(function (element, index) {
				return <h6 key={index}>{element}</h6>;
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
				'n-confirm': true,
				modal: true,
				fade: true,
				in: true
			};
			if (this.props.className) {
				css[this.props.className] = true;
			}
			return (<div>
				<div className="modal-backdrop fade in" style={{zIndex: NConfirm.Z_INDEX}}></div>
				<div className={$pt.LayoutHelper.classSet(css)}
					 tabIndex="-1"
					 role="dialog"
					 ref="container"
					 style={{display: 'block', zIndex: NConfirm.Z_INDEX + 1}}>
					<div className="modal-dialog" tabIndex='0'>
						<div className="modal-content" role="document">
							<div className="modal-header">
								{this.renderDialogCloseButton()}
								<h4 className="modal-title">{this.state.title}</h4>
							</div>
							<div className="modal-body">
								{this.renderContent()}
							</div>
							{this.renderFooter()}
						</div>
					</div>
				</div>
			</div>);
		},
		onDocumentKeyUp: function(evt) {
			if (evt.keyCode === 27) { // escape
				this.onCancelClicked();
			} else if (evt.keyCode === 9) { // tab
				// evt.preventDefault();
				var target = $(evt.target);
				var container = $(this.refs.container);
				if (target.closest(container).length == 0) {
					container.focus();
				}
			}
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
		isDialogCloseShown: function() {
			return this.state && this.state.buttons && this.state.buttons.disableDialogClose === true;
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
						disableDialogClose: options.disableDialogClose,
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
	$pt.Components.NConfirm = NConfirm;
}(window, jQuery, React, ReactDOM, $pt));
