/**
 * text input
 * onKeyUp listener makes sure the keyboard operation monitored.
 * and change listener makes sure the mouse operation monitored on blur.
 *
 * layout: {
 *      label: string,
 *      dataId: string,
 *      pos: {
 *          row: number,
 *          col: number,
 *          width: number,
 *          section: string,
 *          card: string
 *      },
 *      css: {
 *          cell: string,
 *          comp: string,
 *          'normal-line': string,
 *          'focus-line': string
 *      },
 *      comp: {
 *          type: $pt.ComponentConstants.Text,
 *          pwd: boolean,
 *          placeholder: string,
 *          enabled: {
 *              when: function,
 *              depends: string|string[]
 *          },
 *          visible: {
 *              when: function,
 *              depends: string|string[]
 *          },
 *          leftAddon: {
 *              text: string,
 *              icon: string,
 *              iconFirst: boolean,
 *              click: function
 *          },
 *          rightAddon: {
 *              text: string,
 *              icon: string,
 *              iconFirst: boolean,
 *              click: function
 *          }
 *      }
 * }
 */
(function (context, $, $pt) {
	var NText = React.createClass($pt.defineCellComponent({
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
					return isNaN(value) ? value : ((value + '').movePointLeft(2));
				},
				view: function(value) {
					return isNaN(value) ? value : ((value + '').movePointRight(2));
				}
			}
		},
		propTypes: {
			// model
			model: React.PropTypes.object,
			// CellLayout
			layout: React.PropTypes.object
		},
		getDefaultProps: function () {
			return {
				defaultOptions: {}
			};
		},
		getInitialState: function () {
			return {};
		},
		/**
		 * will update
		 * @param nextProps
		 */
		componentWillUpdate: function (nextProps) {
			// remove post change listener to handle model change
			this.removePostChangeListener(this.onModelChanged);
			this.removeEnableDependencyMonitor();
			this.getComponent().off('change', this.onComponentChanged);
			this.unregisterFromComponentCentral();
		},
		/**
		 * did update
		 * @param prevProps
		 * @param prevState
		 */
		componentDidUpdate: function (prevProps, prevState) {
			var formattedValue = this.getFormattedValue(this.getValueFromModel());
			if (this.getComponent().val() != formattedValue) {
				this.getComponent().val(formattedValue);
			}
			// add post change listener to handle model change
			this.addPostChangeListener(this.onModelChanged);
			this.addEnableDependencyMonitor();
			this.getComponent().on('change', this.onComponentChanged);
			this.registerToComponentCentral();
		},
		/**
		 * did mount
		 */
		componentDidMount: function () {
			// set model value to component
			this.getComponent().val(this.getFormattedValue(this.getValueFromModel()));
			// add post change listener to handle model change
			this.addPostChangeListener(this.onModelChanged);
			this.addEnableDependencyMonitor();
			this.getComponent().on('change', this.onComponentChanged);
			this.registerToComponentCentral();
		},
		/**
		 * will unmount
		 */
		componentWillUnmount: function () {
			// remove post change listener to handle model change
			this.removePostChangeListener(this.onModelChanged);
			this.removeEnableDependencyMonitor();
			this.getComponent().off('change', this.onComponentChanged);
			this.unregisterFromComponentCentral();
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
			var iconPart = icon == null ? null : (<span className={$pt.LayoutHelper.classSet(iconCss)}/>);
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
			$(React.findDOMNode(this.refs.focusLine)).toggleClass('focus');
			$(React.findDOMNode(this.refs.normalLine)).toggleClass('focus');

			var value = this.getValueFromModel();
			if (value == this.getComponent().val()) {
				return;
			}
			this.getComponent().val(value);
			// console.log("focused: " + this.getValueFromModel());
		},
		onComponentBlurred: function (evt) {
			$(React.findDOMNode(this.refs.focusLine)).toggleClass('focus');
			$(React.findDOMNode(this.refs.normalLine)).toggleClass('focus');

			// if (this.state.componentChanged) {
			// 	clearTimeout(this.state.componentChanged);
			// }
			var value = evt.target.value;
			if (value && !value.isBlank()) {
				var formattedValue = this.getFormattedValue(value);
				if (formattedValue != value) {
					// console.debug('Change component display formatted value when onBlur.');
					this.getComponent().val(formattedValue);
				}
			}
			this.setValueToModel(value);
		},
		/**
		 * on component change
		 * @param evt
		 */
		onComponentChanged: function (evt) {
			// console.debug('Text component changed[modelValue=' + this.getValueFromModel() + ', compValue=' + evt.target.value + '].');
			this.setValueToModel(evt.target.value);
		},
		/**
		 * on model change
		 * @param evt
		 */
		onModelChanged: function (evt) {
			var formattedValue = this.getValueFromModel();
			if (!$(React.findDOMNode(this.refs.focusLine)).hasClass('focus')) {
				formattedValue = this.getFormattedValue(formattedValue);
			}
			if (formattedValue == this.getComponent().val()) {
				return;
			}
			// console.debug('Text model changed[modelValue=' + evt.new + ', compValue=' + this.getComponent().val() + '].');
			this.getComponent().val(formattedValue);
		},
		onKeyUp: function (evt) {
			var monitor = this.getEventMonitor('keyUp');
			if (monitor) {
				monitor.call(evt.target, evt);
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
			return $(React.findDOMNode(this.refs.txt));
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
			return this.getComponentOption('convertor');
		},
		getValueFromModel: function() {
			var value = this.getModel().get(this.getDataId());
			var convertor = this.getTextConvertor();
			if (convertor) {
				return convertor.view.call(this, value);
			} else {
				return value;
			}
		},
		setValueToModel: function (value) {
			var convertor = this.getTextConvertor();
			if (convertor) {
				this.getModel().set(this.getDataId(), convertor.model.call(this, value));
			} else {
				this.getModel().set(this.getDataId(), value);
			}
		}
	}));
	context.NText = NText;
}(this, jQuery, $pt));
