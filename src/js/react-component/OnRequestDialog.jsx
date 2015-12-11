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
		propTypes: {
			className: React.PropTypes.string
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
		},
		/**
		 * did mount
		 */
		componentDidMount: function () {
			this.fixDocumentPadding();
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
					 style={{display: 'block', zIndex: NOnRequestModal.Z_INDEX + 1}}>
					<div className="modal-danger modal-dialog">
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
		}
	});
	$pt.Components.NOnRequestModal = NOnRequestModal;
}(window, jQuery, React, ReactDOM, $pt));
