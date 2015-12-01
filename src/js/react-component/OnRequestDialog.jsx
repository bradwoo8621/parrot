/**
 * on request modal dialog.
 * z-index is 9899 and 9898, less than exception dialog, more than any other.
 */
(function (context, $, $pt) {
	var NOnRequestModal = React.createClass({
		displayName: 'NOnRequestModal',
		statics: {
			getOnRequestModal: function (className) {
				if ($pt.onRequestDialog === undefined || $pt.onRequestDialog === null) {
					var onRequestContainer = $("#onrequest_modal_container");
					if (onRequestContainer.length == 0) {
						$("<div id='onrequest_modal_container' />").appendTo($(document.body));
					}
					$pt.onRequestDialog = React.render(
						<NOnRequestModal className={className}/>, document.getElementById("onrequest_modal_container"));
				}
				return $pt.onRequestDialog;
			},
			WAITING_MESSAGE: 'Send request to server and waiting for response...'
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
		setZIndex: function () {
			var div = $(React.findDOMNode(this.refs.body)).closest(".modal");
			if (div.length > 0) {
				div.css({"z-index": 9899});
				div.prev().css({"z-index": 9898});
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
		render: function () {
			if (!this.state.visible) {
				return null;
			}
			var css = {
				'n-on-request': true
			};
			if (this.props.className) {
				css[this.props.className] = true;
			}
			return (<Modal className={$pt.LayoutHelper.classSet(css)}>
				<Modal.Body ref="body">
					<span className='fa fa-fw fa-lg fa-spin fa-spinner'/> {NOnRequestModal.WAITING_MESSAGE}
				</Modal.Body>
			</Modal>);
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
	context.NOnRequestModal = NOnRequestModal;
}(this, jQuery, $pt));
