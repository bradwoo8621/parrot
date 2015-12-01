/**
 * exception modal dialog
 * z-index is 9999 and 9998, the max z-index.
 */
(function (context, $, $pt) {
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
					$pt.exceptionDialog = React.render(<NExceptionModal className={className}/>,
						document.getElementById("exception_modal_container"));
				}
				return $pt.exceptionDialog;
			},
			TITLE: 'Exception Raised...'
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
				status: null,
				message: null
			};
		},
		/**
		 * set z-index
		 */
		setZIndex: function () {
			var div = $(React.findDOMNode(this.refs.body)).closest(".modal");
			if (div.length > 0) {
				div.css({"z-index": 9999});
				div.prev().css({"z-index": 9998});
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
				'n-exception-modal': true
			};
			if (this.props.className) {
				css[this.props.className] = true;
			}
			return (<Modal className={$pt.LayoutHelper.classSet(css)} bsStyle="danger"
			               onHide={this.hide} backdrop="static">
				<Modal.Header closeButton>
					<Modal.Title>{NExceptionModal.TITLE}</Modal.Title>
				</Modal.Header>

				<Modal.Body ref="body">
					{this.renderContent()}
				</Modal.Body>
			</Modal>);
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
	context.NExceptionModal = NExceptionModal;
}(this, jQuery, $pt));
