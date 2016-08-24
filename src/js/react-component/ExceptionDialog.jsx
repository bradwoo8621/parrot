/**
 * exception modal dialog
 * z-index is 9999 and 9998, the max z-index.
 */
(function (window, $, React, ReactDOM, $pt) {
	var NExceptionModal = React.createClass({
		displayName: 'NExceptionModal',
		statics: {
			getExceptionModal: function (className) {
				if ($pt.exceptionDialog === undefined || $pt.exceptionDialog === null) {
					// must initial here. since the function will execute immediately after load,
					// and NExceptionModal doesn't defined in that time
					var exceptionContainer = $("#exception_modal_container");
					if (exceptionContainer.length == 0) {
						$("<div id='exception_modal_container' />").appendTo($(document.body));
					}
					$pt.exceptionDialog = ReactDOM.render(<$pt.Components.NExceptionModal className={className}/>,
						document.getElementById("exception_modal_container"));
				}
				return $pt.exceptionDialog;
			},
			TITLE: 'Exception Raised...',
			Z_INDEX: 9998
		},
		propTypes: {
			className: React.PropTypes.string
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
		 * render content
		 */
		renderContent: function () {
			var status = this.state.status;
			var statusMessage = $pt.ComponentConstants.Http_Status[status];
			var message = this.state.message;
			return (<div>
				<h6>{status}: {statusMessage}</h6>
				{message != null ? (<pre>{message}</pre>) : null}
			</div>);
		},
		/**
		 * render
		 * @returns {*}
		 */
		render: function () {
			if (!this.state.visible) {
				return null;
			}

			var css = {
				'n-exception-modal': true,
				modal: true,
				fade: true,
				in: true
			};
			if (this.props.className) {
				css[this.props.className] = true;
			}
			return (<div>
				<div className="modal-backdrop fade in" style={{zIndex: NExceptionModal.Z_INDEX}}></div>
				<div className={$pt.LayoutHelper.classSet(css)}
					 tabIndex="-1"
					 role="dialog"
					 ref="container"
					 style={{display: 'block', zIndex: NExceptionModal.Z_INDEX + 1}}>
					<div className="modal-danger modal-dialog" tabIndex="0">
						<div className="modal-content" role="document">
							<div className="modal-header">
								<button className="close"
										onClick={this.hide}
										aria-label="Close"
										style={{marginTop: '-2px'}}>
									<span aria-hidden="true">×</span>
								</button>
								<h4 className="modal-title">{NExceptionModal.TITLE}</h4>
							</div>
							<div className="modal-body">
								{this.renderContent()}
							</div>
						</div>
					</div>
				</div>
			</div>);
		},
		onDocumentKeyUp: function(evt) {
			if (evt.keyCode === 27) { // escape
				this.hide();
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
			this.setState({visible: false, status: null, message: null});
		},
		/**
		 * show dialog
		 * @param status http status
		 * @param message error message
		 */
		show: function (status, message) {
			$(':focus').blur();
			this.setState({visible: true, status: status, message: message});
		}
	});
	$pt.Components.NExceptionModal = NExceptionModal;
}(window, jQuery, React, ReactDOM, $pt));
