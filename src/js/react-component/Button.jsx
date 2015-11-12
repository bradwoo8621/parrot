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
					style: 'default'
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
		/**
		 * render icon
		 * @returns {*}
		 */
		renderIcon: function () {
			var icon = this.getIcon();
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
			if (this.getLabelPosition() === 'left') {
				// label in left
				return (<div className={$pt.LayoutHelper.classSet(compCSS)}>
					<a href='javascript:void(0);'
					   className={$pt.LayoutHelper.classSet(css)}
					   onClick={this.onClicked}
					   disabled={!this.isEnabled()}
					   ref='a'>
						{this.getLayout().getLabel()} {this.renderIcon()}
					</a>
				</div>);
			} else {
				// default label in right
				return (<div className={$pt.LayoutHelper.classSet(compCSS)}>
					<a href='javascript:void(0);'
					   className={$pt.LayoutHelper.classSet(css)}
					   onClick={this.onClicked}
					   disabled={!this.isEnabled()}
					   ref='a'>
						{this.renderIcon()} {this.getLayout().getLabel()}
					</a>
				</div>);
			}
		},
		onClicked: function () {
			$(React.findDOMNode(this.refs.a)).toggleClass('effect');
			if (this.isEnabled()) {
				var onclick = this.getComponentOption("click");
				if (onclick) {
					onclick.call(this, this.getModel());
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
		/**
		 * @overrides always return null
		 * @returns {*}
		 */
		getValueFromModel: function () {
			return null;
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
