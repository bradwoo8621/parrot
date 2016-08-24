(function (window, $, React, ReactDOM, $pt) {
	var NText = React.createClass($pt.defineCellComponent({
		displayName: 'NText',
		statics: {
			NUMBER_FORMAT: function(value) {
				var parts = (value + '').split('.');
				var integral = parts[0];
				var fraction = parts.length > 1 ? '.' + parts[1] : '';
				var rgx = /(\d+)(\d{3})/;
				while (rgx.test(integral)) {
					integral = integral.replace(rgx, '$1' + ',' + '$2');
				}
				return integral + fraction;
			},
			PERCENTAGE: {
				model: function(value) {
					return (isNaN(value) || (value + '').isBlank()) ? value : ((value + '').movePointLeft(2));
				},
				view: function(value) {
					return (isNaN(value) || (value + '').isBlank()) ? value : ((value + '').movePointRight(2));
				}
			},
			TRIM: false
		},
		getDefaultProps: function () {
			return {
				defaultOptions: {}
			};
		},
		afterWillUpdate: function (nextProps) {
			this.getComponent().off('change', this.onComponentChanged);
		},
		/**
		 * did update
		 * @param prevProps
		 * @param prevState
		 */
		beforeDidUpdate: function (prevProps, prevState) {
			var formattedValue = this.getValueFromModel();
			if (!$(ReactDOM.findDOMNode(this.refs.focusLine)).hasClass('focus')) {
				formattedValue = this.getFormattedValue(formattedValue);
			}
			if (this.getComponent().val() != formattedValue) {
				this.getComponent().val(formattedValue);
			}
		},
		afterDidUpdate: function() {
			this.getComponent().on('change', this.onComponentChanged);
		},
		beforeDidMount: function () {
			// set model value to component
			this.getComponent().val(this.getFormattedValue(this.getValueFromModel()));
		},
		afterDidMount: function() {
			this.getComponent().on('change', this.onComponentChanged);
		},
		afterWillUnmount: function () {
			this.getComponent().off('change', this.onComponentChanged);
		},
		/**
		 * render left add-on
		 * @returns {XML}
		 */
		renderLeftAddon: function () {
			return this.renderAddon(this.getComponentOption('leftAddon'));
		},
		/**
		 * render text
		 * @returns {XML}
		 */
		renderText: function () {
			// TODO needs to handle the control keys
			var css = {
				'form-control': true
			};
			return (<input type={this.getComponentOption('pwd', false) ? 'password' : 'text'}
			               className={$pt.LayoutHelper.classSet(css)}
			               disabled={!this.isEnabled()}
			               placeholder={this.getComponentOption('placeholder')}

			               onKeyPress={this.onComponentChanged}
			               onChange={this.onComponentChanged}
			               onFocus={this.onComponentFocused}
			               onBlur={this.onComponentBlurred}
			               onKeyUp={this.onKeyUp}

			               ref='txt'/>);
		},
		/**
		 * render right add-on
		 * @returns {XML}
		 */
		renderRightAddon: function () {
			return this.renderAddon(this.getComponentOption('rightAddon'));
		},
		/**
		 * render add-on
		 * @param addon {{
	 *              icon: string,
	 *              text: string,
	 *              iconFirst: boolean,
	 *              click: function(model: object, value: object)
	 *              }}
		 * @returns {XML}
		 */
		renderAddon: function (addon) {
			if (addon == null) {
				return null;
			}

			var spanCss = {
				'input-group-addon': true,
				link: addon.click != null,
				disabled: !this.isEnabled()
			};

			var iconCss = {
				fa: true,
				'fa-fw': true
			};
			var icon = addon.icon;
			if (icon != null) {
				iconCss['fa-' + icon] = true;
			}
			var iconPart = icon == null ? null : (<span className={$pt.LayoutHelper.classSet(iconCss)} key='iconPart'/>);
			var textPart = addon.text;
			var innerParts = addon.iconFirst === false ? [textPart, iconPart] : [iconPart, textPart];
			return (<span className={$pt.LayoutHelper.classSet(spanCss)}
			              onClick={this.onAddonClicked.bind(this, addon.click)}>
				{innerParts.map(function (part) {
					return part;
				})}
			</span>);
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
			css[this.getComponentCSS('n-text')] = true;
			return (<div className={$pt.LayoutHelper.classSet(css)}>
				<div className='input-group'>
					{this.renderLeftAddon()}
					{this.renderText()}
					{this.renderRightAddon()}
				</div>
				{this.renderNormalLine()}
				{this.renderFocusLine()}
			</div>);
		},
		onComponentFocused: function () {
			$(ReactDOM.findDOMNode(this.refs.focusLine)).toggleClass('focus');
			$(ReactDOM.findDOMNode(this.refs.normalLine)).toggleClass('focus');

			var value = this.getValueFromModel();
			if (value == this.getComponent().val()) {
				return;
			}
			this.getComponent().val(value);
			// window.console.log("focused: " + this.getValueFromModel());
		},
		onComponentBlurred: function (evt) {
			$(ReactDOM.findDOMNode(this.refs.focusLine)).toggleClass('focus');
			$(ReactDOM.findDOMNode(this.refs.normalLine)).toggleClass('focus');

			// if (this.state.componentChanged) {
			// 	clearTimeout(this.state.componentChanged);
			// }
			var value = evt.target.value;
			if (this.getComponentOption('trim', NText.TRIM)) {
				value = value == null ? null : (value + '').trim();
			}
			if (value && !value.isBlank()) {
				var formattedValue = this.getFormattedValue(value);
				if (formattedValue != value) {
					// window.console.debug('Change component display formatted value when onBlur.');
					this.getComponent().val(formattedValue);
				}
			}
			if (!this.textEquals(value, this.getValueFromModel())) {
				this.setValueToModel(value);
			}
			var monitor = this.getEventMonitor('blur');
			if (monitor) {
				monitor.call(this, evt);
			}
		},
		hasText: function(value) {
			return value != null && !(value + '').isEmpty();
		},
		textEquals: function(v1, v2) {
			var hasText1 = this.hasText(v1);
			var hasText2 = this.hasText(v2);
			if (hasText1) {
				var strV1 = v1 + '';
				var strV2 = v2 + '';
				return strV1 === strV2;
			} else {
				return !hasText2
			}
			//return hasText1 ? ((v1 + '') === (v2 + '')) : !hasText2;
		},
		/**
		 * on component change
		 * @param evt
		 */
		onComponentChanged: function (evt) {
			// console.debug('Text component changed[modelValue=' + this.getValueFromModel() + ', compValue=' + evt.target.value + '].');
			var newValue = evt.target.value;
			var oldValue = this.getValueFromModel();
			if (!this.textEquals(newValue, oldValue)) {
				this.setValueToModel(evt.target.value);
			}
		},
		onKeyUp: function (evt) {
			var monitor = this.getEventMonitor('keyUp');
			if (monitor) {
				monitor.call(this, evt);
			}
		},
		/**
		 * on addon clicked
		 * @param userDefinedClickFunc
		 */
		onAddonClicked: function (userDefinedClickFunc) {
			if (this.isAddonClickable(userDefinedClickFunc)) {
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
		/**
		 * is add-on clickable
		 * @param userDefinedClickFunc
		 * @returns {*}
		 */
		isAddonClickable: function (userDefinedClickFunc) {
			return this.isEnabled() && userDefinedClickFunc;
		},
		getTextFormat: function() {
			return this.getComponentOption('format');
		},
		getFormattedValue: function(value) {
			if (value) {
				if (typeof value === 'number') {
					value = value + '';
				}
				if (!value.isBlank()) {
					var format = this.getTextFormat();
					if (format) {
						var formatValue = value;
						if (format == 'currency') {
							formatValue = value.currencyFormat();
						} else {
							formatValue = format.call(this, value);
						}
						return formatValue;
					}
				}
			}
			return value;
		},
		getTextConvertor: function() {
			return this.getComponentOption('transformer') || this.getComponentOption('convertor');
		},
		getValueFromModel: function() {
			var value = this.getModel().get(this.getDataId());
			var convertor = this.getTextConvertor();
			if (convertor && convertor.view) {
				return convertor.view.call(this, value);
			} else {
				return value;
			}
		},
		setValueToModel: function (value) {
			var convertor = this.getTextConvertor();
			if (convertor && convertor.model) {
				this.getModel().set(this.getDataId(), convertor.model.call(this, value));
			} else {
				this.getModel().set(this.getDataId(), value);
			}
		},
		getTextInViewMode: function() {
			return this.getModel().get(this.getDataId());
		}
	}));
	$pt.Components.NText = NText;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.Text, function (model, layout, direction, viewMode) {
		return <$pt.Components.NText {...$pt.LayoutHelper.transformParameters(model, layout, direction, viewMode)}/>;
	});
}(window, jQuery, React, ReactDOM, $pt));
