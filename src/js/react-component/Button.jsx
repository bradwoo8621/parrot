(function (window, $, React, ReactDOM, $pt) {
	var NFormButton = React.createClass($pt.defineCellComponent({
		displayName: 'NFormButton',
		getDefaultProps: function () {
			return {
				defaultOptions: {
					style: 'default',
					labelFromModel: false
				}
			};
		},
		renderIcon: function(icon) {
			if (icon == null) {
				return null;
			} else {
				var css = {
					fa: true,
					'fa-fw': true
				};
				css['fa-' + icon] = true;
				return <span className={$pt.LayoutHelper.classSet(css)} key='icon'/>;
			}
		},
		/**
		 * render icon
		 * @returns {*}
		 */
		renderButtonIcon: function () {
			return this.renderIcon(this.getIcon());
		},
		renderMoreButtons: function(css) {
			var more = this.getComponentOption('more');
			if (more) {
				// onClick={this.onClicked}
				var dropdown = (<a href='javascript:void(0);'
					className={$pt.LayoutHelper.classSet(css) + ' dropdown-toggle'}
					disabled={!this.isEnabled()}
					data-toggle="dropdown"
					aria-haspopup="true"
					aria-expanded="false"
					key='a'>
					{!this.getComponentOption('click') ? this.getButtonContext() : null}
				   	<span className="caret"></span>
				</a>);
				var emptyFunction = function(){};
				var _this = this;
				var menus = (<ul className="dropdown-menu" key='ul'>
					{more.map(function(menu, menuIndex) {
						if (menu.divider) {
							return (<li role='separator' className='divider' key={menuIndex}></li>);
						} else {
							var click = menu.click ? menu.click : emptyFunction;
							var label = menu.text;
							var icon = _this.renderIcon(menu.icon);
							if (label && icon) {
								label = ' ' + label;
							}
							return (<li key={menuIndex}>
								<a href='javascript:void(0);' onClick={click.bind(_this, _this.getModel())}>
									{icon}{label}
								</a>
							</li>);
						}
					})}
				</ul>);
				return [dropdown, menus];
			} else {
				return null;
			}
		},
		getButtonContext: function() {
			var label = this.getLabel();
			var icon = this.renderButtonIcon();
			var buttonContext = null;
			if (this.getLabelPosition() === 'left') {
				// label in left
				if (label && icon) {
					label = <span key='lbl'>{label + ' '}</span>;
				}
				buttonContext = [label, icon];
			} else {
				// default label in right
				if (label && icon) {
					label = <span key='lbl'>{' ' + label}</span>;
				}
				buttonContext = [icon, label];
			}
			return buttonContext;
		},
		render: function () {
			if (!this.isVisible()) {
				return null;
			}
			var compCSS = {};
			compCSS[this.getComponentCSS('n-button')] = true;
			compCSS['n-disabled'] = !this.isEnabled();
			var css = {
				btn: true,
				disabled: !this.isEnabled()
			};
			css['btn-' + this.getStyle()] = true;
			var defaultClick = this.getComponentOption("click");
			var more = this.getComponentOption('more');
			var defaultButton = null;
			if (defaultClick || !more) {
				defaultButton = (<a href='javascript:void(0);'
				   className={$pt.LayoutHelper.classSet(css)}
				   onMouseUp={this.onClicked}
				   disabled={!this.isEnabled()}
				   title={this.getComponentOption('tooltip')}
				   ref='a'>
					{this.getButtonContext()}
				</a>);
			}
			return (<div className={$pt.LayoutHelper.classSet(compCSS)}>
				<div className='btn-group'>
					{defaultButton}
					{this.renderMoreButtons(css)}
				</div>
			</div>);
		},
		onClicked: function (evt) {
			if (evt.button != 0) {
				// not left button
				return;
			}
			// console.log(evt.button);
			if (this.isEnabled()) {
				$(ReactDOM.findDOMNode(this.refs.a)).toggleClass('effect');
				var onclick = this.getComponentOption("click");
				if (onclick) {
					onclick.call(this, this.getModel(), evt.target);
				}
			}
		},
		/**
		 * get icon
		 * @returns {string}
		 */
		getIcon: function () {
			return this.getComponentOption("icon");
		},
		/**
		 * get button style
		 * @returns {string}
		 */
		getStyle: function () {
			var style = this.getComponentOption('style');
			if (typeof style === 'function') {
				return style.call(this);
			} else {
				return style;
			}
		},
		/**
		 * get label position
		 * @returns {string}
		 */
		getLabelPosition: function () {
			return this.getComponentOption("labelPosition");
		},
		getLabel: function() {
			var labelFromModel = this.getComponentOption('labelFromModel');
			if (labelFromModel) {
				return this.getValueFromModel();
			} else {
				return this.getLayout().getLabel();
			}
		},
		/**
		 * @overrides do nothing
		 * @param value
		 */
		setValueToModel: function (value) {
			// nothing
		}
	}));
	$pt.Components.NFormButton = NFormButton;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.Button, function (model, layout, direction, viewMode) {
		return <$pt.Components.NFormButton {...$pt.LayoutHelper.transformParameters(model, layout, direction, viewMode)}/>;
	});
}(window, jQuery, React, ReactDOM, $pt));
