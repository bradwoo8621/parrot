/**
 * panel footer which only contains buttons
 * depends NFormButton
 */
(function (window, $, React, ReactDOM, $pt) {
	var NPanelFooter = React.createClass({
		displayName: 'NPanelFooter',
		statics: {
			RESET_TEXT: "Reset",
			RESET_ICON: "reply-all",
			RESET_STYLE: "warning",

			VALIDATE_TEXT: "Validate",
			VALIDATE_ICON: "bug",
			VALIDATE_STYLE: "default",

			SAVE_TEXT: 'Save',
			SAVE_ICON: 'floppy-o',
			SAVE_STYLE: 'primary',

			CANCEL_TEXT: 'Cancel',
			CANCEL_ICON: 'ban',
			CANCEL_STYLE: 'danger'
		},
		propTypes: {
			save: React.PropTypes.func,
			validate: React.PropTypes.func,
			cancel: React.PropTypes.func,
			reset: React.PropTypes.func,

			// left: React.PropTypes.arrayOf(React.PropTypes.shape({
			// 	icon: React.PropTypes.string,
			// 	text: React.PropTypes.string,
			// 	style: React.PropTypes.string,
			// 	click: React.PropTypes.func.isRequired,
			// 	enabled: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.shape({
			// 		when: React.PropTypes.func,
			// 		depends: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.arrayOf(React.PropTypes.string)])
			// 	})])
			// })),
			// right: React.PropTypes.arrayOf(React.PropTypes.shape({
			// 	icon: React.PropTypes.string,
			// 	text: React.PropTypes.string,
			// 	style: React.PropTypes.string, // references to bootstrap styles
			// 	click: React.PropTypes.func.isRequired,
			// 	enabled: React.PropTypes.oneOfType([React.PropTypes.bool, React.PropTypes.shape({
			// 		when: React.PropTypes.func,
			// 		depends: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.arrayOf(React.PropTypes.string)])
			// 	})])
			// })),

			// model, pass to click
			model: React.PropTypes.object,
			view: React.PropTypes.bool
		},
		/**
		 * will update
		 * @param nextProps
		 */
		componentWillUpdate: function (nextProps) {
		},
		/**
		 * did update
		 * @param prevProps
		 * @param prevState
		 */
		componentDidUpdate: function (prevProps, prevState) {
		},
		/**
		 * did mount
		 */
		componentDidMount: function () {
		},
		/**
		 * will unmount
		 */
		componentWillUnmount: function () {
		},
		/**
		 * render left buttons
		 */
		renderLeftButtons: function () {
			if (this.props.left) {
				if (Array.isArray(this.props.left)) {
					return this.props.left.map(this.renderButton);
				} else {
					return this.renderButton(this.props.left);
				}
			} else {
				return null;
			}
		},
		/**
		 * render right buttons
		 */
		renderRightButtons: function () {
			if (this.props.right) {
				if (Array.isArray(this.props.right)) {
					return this.props.right.map(this.renderButton);
				} else {
					return this.renderButton(this.props.right);
				}
			} else {
				return null;
			}
		},
		/**
		 * render button
		 */
		renderButton: function (option, buttonIndex) {
			if (this.isViewMode() && option.view == 'edit') {
				return null;
			} else if (!this.isViewMode() && option.view == 'view') {
				return null;
			}
			var layout = {
				label: option.text,
				comp: {
					type: $pt.ComponentConstants.Button,
					icon: option.icon,
					style: option.style,
					click: option.click,
					enabled: option.enabled,
					visible: option.visible
				}
			};
			return <$pt.Components.NFormButton model={this.getModel()}
											   layout={$pt.createCellLayout('pseudo-button', layout)}
											   key={buttonIndex}/>;
		},
		/**
		 * render
		 * @returns {XML}
		 */
		render: function () {
			return (<div className="row n-panel-footer">
				<div className="col-sm-12 col-md-12 col-lg-12">
					<div className="btn-toolbar n-panel-footer-left" role='toolbar'>
						{this.props.reset ? this.renderButton({
							icon: NPanelFooter.RESET_ICON,
							text: NPanelFooter.RESET_TEXT,
							style: NPanelFooter.RESET_STYLE,
							click: this.props.reset.click ? this.props.reset.click : this.props.reset,
							enabled: this.props.reset.enabled ? this.props.reset.enabled : true,
							visible: this.props.reset.visible ? this.props.reset.visible : true
						}) : null}
						{this.props.validate ? this.renderButton({
							icon: NPanelFooter.VALIDATE_ICON,
							text: NPanelFooter.VALIDATE_TEXT,
							style: NPanelFooter.VALIDATE_STYLE,
							click: this.props.validate.click ? this.props.validate.click : this.props.validate,
							enabled: this.props.validate.enabled ? this.props.validate.enabled : true,
							visible: this.props.validate.visible ? this.props.validate.visible : true
						}) : null}
						{this.renderLeftButtons()}
					</div>
					<div className="btn-toolbar n-panel-footer-right" role='toolbar'>
						{this.props.cancel ? this.renderButton({
							icon: NPanelFooter.CANCEL_ICON,
							text: NPanelFooter.CANCEL_TEXT,
							style: NPanelFooter.CANCEL_STYLE,
							click: this.props.cancel.click ? this.props.cancel.click : this.props.cancel,
							enabled: this.props.cancel.enabled ? this.props.cancel.enabled : true,
							visible: this.props.cancel.visible ? this.props.cancel.visible : true
						}) : null}
						{this.props.save ? this.renderButton({
							icon: NPanelFooter.SAVE_ICON,
							text: NPanelFooter.SAVE_TEXT,
							style: NPanelFooter.SAVE_STYLE,
							click: this.props.save.click ? this.props.save.click : this.props.save,
							enabled: this.props.save.enabled ? this.props.save.enabled : true,
							visible: this.props.save.visible ? this.props.save.visible : true
						}) : null}
						{this.renderRightButtons()}
					</div>
				</div>
			</div>);
		},
		/**
		 * get model
		 * @returns {ModelInterface}
		 */
		getModel: function () {
			return this.props.model;
		},
		isViewMode: function() {
			return this.props.view;
		}
	});
	$pt.Components.NPanelFooter = NPanelFooter;
}(window, jQuery, React, ReactDOM, $pt));
