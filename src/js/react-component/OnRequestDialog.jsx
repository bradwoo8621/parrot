/**
 * on request modal dialog.
 * z-index is 9899 and 9898, less than exception dialog, more than any other.
 */
(function (window, $, React, ReactDOM, $pt) {
	var NOnRequestModal = React.createClass({
		displayName: 'NOnRequestModal',
		statics: {
			getOnRequestModal: function (className) {
				if ($pt.onRequestDialog === undefined || $pt.onRequestDialog === null) {
					var onRequestContainer = $("#onrequest_modal_container");
					if (onRequestContainer.length == 0) {
						$("<div id='onrequest_modal_container' />").appendTo($(document.body));
					}
					$pt.onRequestDialog = ReactDOM.render(
						<$pt.Components.NOnRequestModal className={className}/>, document.getElementById("onrequest_modal_container"));
				}
				return $pt.onRequestDialog;
			},
			WAITING_MESSAGE: 'Send request to server and waiting for response...',
			Z_INDEX: 9898
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
				$(document).on('keydown', this.onDocumentKeyDown);
			} else {
				$(document).off('keydown', this.onDocumentKeyDown);
			}
		},
		componentWillUpdate: function() {
			$(document).off('keydown', this.onDocumentKeyDown);
		},
		/**
		 * did mount
		 */
		componentDidMount: function () {
			this.fixDocumentPadding();
			if (this.state.visible) {
				$(document).on('keydown', this.onDocumentKeyDown);
			} else {
				$(document).off('keydown', this.onDocumentKeyDown);
			}
		},
		componentWillUnmount: function() {
			$(document).off('keydown', this.onDocumentKeyDown);
		},
		render: function () {
			if (!this.state.visible) {
				return null;
			}
			var css = {
				'n-on-request': true,
				modal: true,
				fade: true,
				in: true
			};
			if (this.props.className) {
				css[this.props.className] = true;
			}
			return (<div>
				<div className="modal-backdrop fade in" style={{zIndex: NOnRequestModal.Z_INDEX}}></div>
				<div className={$pt.LayoutHelper.classSet(css)}
					 tabIndex="-1"
					 role="dialog"
					 ref="container"
					 style={{display: 'block', zIndex: NOnRequestModal.Z_INDEX + 1}}>
					<div className="modal-danger modal-dialog" tabIndex='0'>
						<div className="modal-content" role="document">
							<div className="modal-body" ref='body'>
								<span className='fa fa-fw fa-lg fa-spin fa-spinner'/> {NOnRequestModal.WAITING_MESSAGE}
							</div>
						</div>
					</div>
				</div>
			</div>);
		},
		/**
		 * hide dialog
		 */
		hide: function () {
			this.setState({visible: false});
		},
		/**
		 * show dialog
		 */
		show: function () {
			this.setState({visible: true});
		},
		onDocumentKeyDown: function(evt) {
			if (evt.keyCode === 9) { // tab
				// evt.preventDefault();
				var target = $(evt.target);
				var container = $(this.refs.container);
				if (target.closest(container).length == 0) {
					container.focus();
				}
			}
		}
	});
	$pt.Components.NOnRequestModal = NOnRequestModal;
}(window, jQuery, React, ReactDOM, $pt));
