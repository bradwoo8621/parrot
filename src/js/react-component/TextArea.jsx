(function (window, $, React, ReactDOM, $pt) {
	var NTextArea = React.createClass($pt.defineCellComponent({
		displayName: 'NTextArea',
		getDefaultProps: function () {
			return {
				defaultOptions: {
					lines: 1
				}
			};
		},
		afterWillUpdate: function (nextProps) {
			this.getComponent().off('change', this.onComponentChanged);
		},
		beforeDidUpdate: function (prevProps, prevState) {
			if (this.getComponent().val() != this.getValueFromModel()) {
				this.getComponent().val(this.getValueFromModel());
			}
		},
		afterDidUpdate: function() {
			this.getComponent().on('change', this.onComponentChanged);
		},
		/**
		 * did mount
		 */
		beforeDidMount: function () {
			// set model value to component
			this.getComponent().val(this.getValueFromModel());
		},
		afterDidMount: function () {
			this.getComponent().on('change', this.onComponentChanged);
		},
		/**
		 * will unmount
		 */
		afterWillUnmount: function () {
			this.getComponent().off('change', this.onComponentChanged);
		},
		/**
		 * render text
		 * @returns {XML}
		 */
		renderText: function () {
			var css = {
				'form-control': true
			};
			css['l' + this.getComponentOption('lines')] = true;
			return (<textarea className={$pt.LayoutHelper.classSet(css)}
			                  disabled={!this.isEnabled()}
			                  placeholder={this.getComponentOption('placeholder')}

			                  onKeyPress={this.onComponentChanged}
			                  onChange={this.onComponentChanged}
			                  onFocus={this.onComponentFocused}
			                  onBlur={this.onComponentBlurred}

			                  ref='txt'/>);
		},
		/**
		 * render
		 * @returns {XML}
		 */
		render: function () {
			if (this.isViewMode()) {
				return this.renderInViewMode();
			}
			var css = {
				'n-disabled': !this.isEnabled()
			};
			css[this.getComponentCSS('n-textarea')] = true;
			return (<div className={$pt.LayoutHelper.classSet(css)}>
				{this.renderText()}
				{this.renderNormalLine()}
				{this.renderFocusLine()}
			</div>);
		},
		onComponentFocused: function () {
			$(ReactDOM.findDOMNode(this.refs.focusLine)).toggleClass('focus');
			$(ReactDOM.findDOMNode(this.refs.normalLine)).toggleClass('focus');
		},
		onComponentBlurred: function () {
			$(ReactDOM.findDOMNode(this.refs.focusLine)).toggleClass('focus');
			$(ReactDOM.findDOMNode(this.refs.normalLine)).toggleClass('focus');
		},
		/**
		 * on component change
		 * @param evt
		 */
		onComponentChanged: function (evt) {
			this.setValueToModel(evt.target.value);
		},
		/**
		 * on addon clicked
		 * @param userDefinedClickFunc
		 */
		onAddonClicked: function (userDefinedClickFunc) {
			if (userDefinedClickFunc) {
				userDefinedClickFunc.call(this, this.getModel(), this.getValueFromModel());
			}
		},
		/**
		 * get component
		 * @returns {jQuery}
		 * @override
		 */
		getComponent: function () {
			return $(ReactDOM.findDOMNode(this.refs.txt));
		},
		getTextInViewMode: function() {
			var value = this.getValueFromModel();
			if (value != null) {
				value = value.split(/\r|\n/);
			}
			return value;
		}
	}));
	$pt.Components.NTextArea = NTextArea;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.TextArea, function (model, layout, direction, viewMode) {
		return <$pt.Components.NTextArea {...$pt.LayoutHelper.transformParameters(model, layout, direction, viewMode)}/>;
	});
}(window, jQuery, React, ReactDOM, $pt));
