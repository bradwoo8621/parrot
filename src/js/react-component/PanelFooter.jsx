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
		// componentWillUpdate: function (nextProps) {
		// },
		// componentDidUpdate: function (prevProps, prevState) {
		// },
		// componentDidMount: function () {
		// },
		// componentWillUnmount: function () {
		// },
		/**
		 * render left buttons
		 */
		renderLeftButtons: function () {
			if (this.props.left) {
				if (Array.isArray(this.props.left)) {
					return this.props.left.map(function(button, buttonIndex) {
						return this.renderButton(button, buttonIndex, true)
					}.bind(this));
				} else {
					return this.renderButton(this.props.left, 'left', true);
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
					return this.props.right.map(function(button, buttonIndex) {
						return this.renderButton(button, buttonIndex, false)
					}.bind(this));
				} else {
					return this.renderButton(this.props.right, 'right', false);
				}
			} else {
				return null;
			}
		},
		/**
		 * render button
		 */
		renderButton: function (option, buttonIndex, onLeft) {
			if (this.isViewMode() && option.view == 'edit') {
				return null;
			} else if (!this.isViewMode() && option.view == 'view') {
				return null;
			}
			var layout = $.extend(true, {
				label: option.text,
				comp: {type: $pt.ComponentConstants.Button},
				css: {comp: (onLeft ? 'on-left' : 'on-right')}
			}, {
				comp: option
			});
			delete layout.comp.label;
			var model = this.getModel();
			return <$pt.Components.NFormButton model={this.getModel()}
											   layout={$pt.createCellLayout('pseudo-button', layout)}
											   key={buttonIndex}/>;
			// }
		},
		/**
		 * render
		 * @returns {XML}
		 */
		render: function () {
			return (<div className="row n-panel-footer">
				<div className="col-sm-12 col-md-12 col-lg-12">
					<div className="btn-toolbar" role='toolbar'>
						{this.props.reset ? this.renderButton({
							icon: NPanelFooter.RESET_ICON,
							text: NPanelFooter.RESET_TEXT,
							style: NPanelFooter.RESET_STYLE,
							click: this.props.reset.click ? this.props.reset.click : this.props.reset,
							enabled: this.props.reset.enabled ? this.props.reset.enabled : true,
							visible: this.props.reset.visible ? this.props.reset.visible : true
						}, 'reset', true) : null}
						{this.props.validate ? this.renderButton({
							icon: NPanelFooter.VALIDATE_ICON,
							text: NPanelFooter.VALIDATE_TEXT,
							style: NPanelFooter.VALIDATE_STYLE,
							click: this.props.validate.click ? this.props.validate.click : this.props.validate,
							enabled: this.props.validate.enabled ? this.props.validate.enabled : true,
							visible: this.props.validate.visible ? this.props.validate.visible : true
						}, 'validate', true) : null}
						{this.renderLeftButtons()}
						{this.props.cancel ? this.renderButton({
							icon: NPanelFooter.CANCEL_ICON,
							text: NPanelFooter.CANCEL_TEXT,
							style: NPanelFooter.CANCEL_STYLE,
							click: this.props.cancel.click ? this.props.cancel.click : this.props.cancel,
							enabled: this.props.cancel.enabled ? this.props.cancel.enabled : true,
							visible: this.props.cancel.visible ? this.props.cancel.visible : true
						}, 'cancel', false) : null}
						{this.props.save ? this.renderButton({
							icon: NPanelFooter.SAVE_ICON,
							text: NPanelFooter.SAVE_TEXT,
							style: NPanelFooter.SAVE_STYLE,
							click: this.props.save.click ? this.props.save.click : this.props.save,
							enabled: this.props.save.enabled ? this.props.save.enabled : true,
							visible: this.props.save.visible ? this.props.save.visible : true
						}, 'save', false) : null}
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
			return this.props.model == null ? $pt.createModel({}) : this.props.model;
		},
		isViewMode: function() {
			return this.props.view;
		}
	});
	$pt.Components.NPanelFooter = NPanelFooter;
}(window, jQuery, React, ReactDOM, $pt));
