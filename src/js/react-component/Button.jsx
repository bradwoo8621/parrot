/**
 * Created by brad.wu on 8/18/2015.
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
 *          comp: string
 *      },
 *      comp: {
 *          type: $pt.ComponentConstants.Button,
 *          icon: string,
 *          style: string,
 *          labelPosition: string,
 *          enabled: {
 *              when: function,
 *              depends: string|string[]
 *          },
 *          visible: {
 *              when: function,
 *              depends: string|string[]
 *          },
 *          click: function
 *      }
 * }
 */
(function (context, $, $pt) {
	var NFormButton = React.createClass($pt.defineCellComponent({
		propTypes: {
			// model, whole model, not only for this cell
			// use id to get the value of this cell from model
			model: React.PropTypes.object,
			// CellLayout
			layout: React.PropTypes.object
		},
		getDefaultProps: function () {
			return {
				defaultOptions: {
					style: 'default',
					labelFromModel: false
				}
			};
		},
		/**
		 * will update
		 * @param nextProps
		 */
		componentWillUpdate: function (nextProps) {
			this.removeEnableDependencyMonitor();
			this.unregisterFromComponentCentral();
		},
		/**
		 * did update
		 * @param prevProps
		 * @param prevState
		 */
		componentDidUpdate: function (prevProps, prevState) {
			this.addEnableDependencyMonitor();
			this.registerToComponentCentral();
		},
		/**
		 * did mount
		 */
		componentDidMount: function () {
			this.addEnableDependencyMonitor();
			this.registerToComponentCentral();
		},
		/**
		 * will unmount
		 */
		componentWillUnmount: function () {
			this.removeEnableDependencyMonitor();
			this.unregisterFromComponentCentral();
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
				return <span className={$pt.LayoutHelper.classSet(css)}/>;
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
				var dropdown = (<a href='javascript:void(0);'
					className={$pt.LayoutHelper.classSet(css) + ' dropdown-toggle'}
					onClick={this.onClicked}
					disabled={!this.isEnabled()}
					data-toggle="dropdown"
					aria-haspopup="true"
					aria-expanded="false">
				   	<span className="caret"></span>
				</a>);
				var emptyFunction = function(){};
				var _this = this;
				var menus = (<ul className="dropdown-menu">
					{more.map(function(menu) {
						if (menu.divider) {
							return (<li role='separator' className='divider'></li>);
						} else {
							var click = menu.click ? menu.click : emptyFunction;
							var label = menu.text;
							var icon = _this.renderIcon(menu.icon);
							if (label && icon) {
								label = ' ' + label;
							}
							return (<li>
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
			var label = this.getLabel();
			var icon = this.renderButtonIcon();
			if (this.getLabelPosition() === 'left') {
				if (label && icon) {
					label = label + ' ';
				}
				// label in left
				return (<div className={$pt.LayoutHelper.classSet(compCSS)}>
					<div className='btn-group'>
						<a href='javascript:void(0);'
						   className={$pt.LayoutHelper.classSet(css)}
						   onClick={this.onClicked}
						   disabled={!this.isEnabled()}
						   title={this.getComponentOption('tooltip')}
						   ref='a'>
							{label}{icon}
						</a>
						{this.renderMoreButtons(css)}
					</div>
				</div>);
			} else {
				if (label && icon) {
					label = ' ' + label;
				}
				// default label in right
				return (<div className={$pt.LayoutHelper.classSet(compCSS)}>
					<div className='btn-group'>
						<a href='javascript:void(0);'
						   className={$pt.LayoutHelper.classSet(css)}
						   onClick={this.onClicked}
						   disabled={!this.isEnabled()}
						   title={this.getComponentOption('tooltip')}
						   ref='a'>
							{icon}{label}
						</a>
						{this.renderMoreButtons(css)}
					</div>
				</div>);
			}
		},
		onClicked: function (evt) {
			if (this.isEnabled()) {
				$(React.findDOMNode(this.refs.a)).toggleClass('effect');
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
			return this.getComponentOption("style");
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
	context.NFormButton = NFormButton;
}(this, jQuery, $pt));
