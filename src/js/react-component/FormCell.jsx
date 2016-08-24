/**
 * Created by brad.wu on 8/18/2015.
 * depends cell components which will be renderred in cell.
 *
 * the following settings are shared with all form cell components
 * layout: {
 *      dataId: string,
 *      comp: {
 *          paintRequired: boolean,
 *          labelDirection: string,
 *          labelWidth: number
 *      },
 *      css: {
 *          cell: string,
 *          label: string
 *      }
 * }
 */
(function (window, $, React, ReactDOM, $pt) {
	var NFormCell = React.createClass($pt.defineCellComponent({
		displayName: 'NFormCell',
		keepRender: true,
		statics: {
			REQUIRED_ICON: 'asterisk',
			TOOLTIP_ICON: 'question-circle',
			LABEL_WIDTH: 4,
			__componentRenderer: {},
			registerComponentRenderer: function (type, func) {
				$pt.LayoutHelper.registerComponentRenderer(type, func);
			},
			getComponentRenderer: function (type) {
				return $pt.LayoutHelper.getComponentRenderer(type);
			}
		},
		getDefaultProps: function () {
			return {
				defaultOptions: {
					// paintRequired: true
				},
				direction: 'vertical'
			};
		},
		beforeWillUpdate: function (nextProps) {
			this.destroyPopover();
			this.removeRequiredDependencyMonitor();
		},
		beforeDidUpdate: function (prevProps, prevState) {
			this.renderPopover();
			this.addRequiredDependencyMonitor();
		},
		beforeDidMount: function () {
			this.renderPopover();
			this.addRequiredDependencyMonitor();
		},
		beforeWillUnmount: function () {
			this.destroyPopover();
			this.removeRequiredDependencyMonitor();
		},
		destroyPopover: function () {
			var comp = this.refs.comp;
			if (comp != null) {
				$(ReactDOM.findDOMNode(comp)).popover("destroy");
			}
			var tooltip = this.refs.tooltip;
			if (tooltip != null) {
				$(ReactDOM.findDOMNode(tooltip)).popover('destroy');
			}
		},
		/**
		 * render error popover
		 */
		renderPopover: function () {
			var tooltip = this.getComponentOption('tooltip');
			if (tooltip != null) {
				if (typeof tooltip === 'string') {
					tooltip = {
						text: tooltip
					};
				}
				var tooltipPopover = {
					title: tooltip.title,
					content: tooltip.text,
					placement: tooltip.position ? tooltip.position: 'top',
					trigger: 'hover',
					container: 'body',
					html: true,
					animation: false
				};
				$(ReactDOM.findDOMNode(this.refs.tooltip)).popover(tooltipPopover);
			}

			if ($pt.ComponentConstants.ERROR_POPOVER 
					&& this.getLayout().getComponentType().popover !== false 
					&& this.getModel().hasError(this.getDataId())) {
				var messages = this.getModel().getError(this.getDataId());
				var _this = this;
				var popover = {
					placement: 'top',
					trigger: 'hover',
					html: true,
					content: messages.map(function (msg) {
						return "<span style='display:block'>" + msg.format([_this.getLayout().getLabel()]) + "</span>";
					}),
					container: 'body',
					// false is very import, since when destroy popover,
					// the really destroy will be invoked by some delay,
					// and before really destory invoked,
					// the new popover is bind by componentDidUpdate method.
					// and finally new popover will be destroyed.
					animation: false,
					template: '<div class="popover form-cell-error" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
				};

				var comp = this.refs.comp;
				if (comp != null) {
					var dom = $(ReactDOM.findDOMNode(comp))
					dom.popover(popover);
					if (dom.has($(':focus')).length != 0) {
						dom.popover('show');
					}
				}
			}
		},
		/**
		 * render input component
		 * @param componentDefinition
		 */
		renderInputComponent: function (componentDefinition) {
			// always pass form model to component,
			// since maybe getModel() returns inner model which defined with comp: {model: another}
			var direction = this.props.direction ? this.props.direction : 'vertical';
			if (componentDefinition.render) {
				// user defined component
				return componentDefinition.render.call(this, this.getFormModel(), this.getLayout(), direction, this.isViewMode());
			}

			// pre-defined components
			var type = componentDefinition.type;
			if (!type) {
				type = "text";
			}
			var innerComponent = $pt.LayoutHelper.getComponentRenderer(type).call(this, this.getFormModel(), this.getLayout(), direction, this.isViewMode());
			return (<div ref="comp">
				{innerComponent}
			</div>);
		},
		isRequiredSignPaint: function() {
			if (this.isViewMode()) {
				return false;
			}
			// calculate the 'paintRequired' attribute
			var requiredPaint = this.getComponentOption("paintRequired");
			if (requiredPaint == null) {
				// not given, calculate 'required' rules
				requiredPaint = this.getModel().isRequired(this.getDataId());
				return requiredPaint ? true : this.isRequiredSignNeeded();
			} else if (typeof requiredPaint === 'boolean') {
				// boolean type, return directly
				return requiredPaint;
			} else if (typeof requiredPaint === 'function') {
				requiredPaint = requiredPaint.call(this);
				if (typeof requiredPaint === 'boolean') {
					// boolean type, return directly
					return requiredPaint;
				}
			}
			// calculate from model validator
			return this.getModel().isRequired(this.getDataId(), requiredPaint);
		},
		/**
		 * render label
		 * @returns {XML}
		 */
		renderLabel: function () {
			var labelIcon = this.getComponentOption('labelIcon');
			var iconLabel = labelIcon ? <span className={'label-icon fa fa-fw fa-' + labelIcon} /> : null;
			var requireIconCSS = {
				fa: true,
				'fa-fw': true,
				required: true
			};
			requireIconCSS['fa-' + NFormCell.REQUIRED_ICON] = true;
			var requiredLabel = this.isRequiredSignPaint() ? (<span className={$pt.LayoutHelper.classSet(requireIconCSS)}/>) : null;
			var tooltip = this.getComponentOption('tooltip');
			var tooltipIcon = null;
			var tooltipCSS = {
				fa: true,
				'fa-fw': true,
				'n-form-cell-tooltip': true
			};
			if (tooltip != null) {
				tooltipCSS['fa-' + NFormCell.TOOLTIP_ICON] = true;
				tooltipIcon = <span className={$pt.LayoutHelper.classSet(tooltipCSS)} ref='tooltip'/>;
			}
			return (<span className={this.getLayout().getLabelCSS()}
						onClick={this.onLabelClicked}
						ref="label">
				{iconLabel}
				{this.getLayout().getLabel()}
				{tooltipIcon}
				{requiredLabel}
			</span>);
		},
		/**
		 * render
		 * @returns {XML}
		 */
		render: function () {
			if (!this.isVisible()) {
				return (<div className={this.getCSSClassName() + ' n-form-cell-invisible'}/>);
			} else {
				var css = this.getCSSClassName();
				if (this.getModel().hasError(this.getDataId())
					&& !this.isViewMode()
					&& this.getLayout().getComponentType().renderError !== false) {
					css += " has-error";
				}
				if (!this.isEnabled()) {
					css += ' n-form-cell-disabled';
				}
				// read component definition
				var type = this.getLayout().getComponentType();
				if (type.label === false) {
					return (<div className={css} ref='div'>
						{this.renderInputComponent(type)}
					</div>);
				} else {
					var labelDirection = this.getComponentOption("labelDirection");
					if (labelDirection == null) {
						labelDirection = this.props.direction ? this.props.direction : 'vertical';
					}
					if (labelDirection != 'vertical') {
						return (<div className={css + ' horizontal-label'} ref='div'>
							<div className='row'>
								<div className={this.getHorizontalLabelCSS()}>
									{this.renderLabel()}
								</div>
								<div className={this.getHorizontalComponentCSS()}>
									{this.renderInputComponent(type)}
								</div>
							</div>
						</div>);
					} else {
						return (<div className={css + ' vertical-label'} ref='div'>
							{this.renderLabel()}
							{this.renderInputComponent(type)}
						</div>);
					}
				}
			}
		},
		/**
		 * on model change
		 * @param evt
		 */
		onModelChanged: function (evt) {
			var delay = this.getValidationOption('delay', this.getLayout().getComponentType().delay);
			if (delay != null && delay > 0) {
				if (this.state.delayedValidation) {
					window.clearTimeout(this.state.delayedValidation);
				}
				this.state.delayedValidation = window.setTimeout(function() {
					this.validate();
				}.bind(this), delay);
			} else {
				// no delay for validation
				this.validate();
			}
		},
		/**
		 * on label clicked
		 */
		onLabelClicked: function () {
			$(ReactDOM.findDOMNode(this.refs.comp)).focus();
		},
		/**
		 * get css class
		 * @returns {string}
		 */
		getCSSClassName: function () {
			var width = this.getLayout().getWidth();
			var css = {
				'n-form-cell': true
			};
			if (typeof width === 'number' || typeof width === 'string') {
				css['col-sm-' + width] = true;
				css['col-md-' + width] = true;
				css['col-lg-' + width] = true;
			} else {
				Object.keys(width).forEach(function(key) {
					css['col-' + key + '-' + width[key]] = true;
				});
				if (typeof width.sm === 'undefined') {
					css['col-sm-' + width.width] = true;
				}
				if (typeof width.md === 'undefined') {
					css['col-md-' + width.width] = true;
				}
				if (typeof width.lg === 'undefined') {
					css['col-lg-' + width.width] = true;
				}
				// css['col-sm-' + (width.sm ? width.sm : width.width)] = true;
				// css['col-md-' + (width.md ? width.md : width.width)] = true;
				// css['col-lg-' + (width.lg ? width.lg : width.width)] = true;
			}
			return this.getLayout().getCellCSS($pt.LayoutHelper.classSet(css));
		},
		/**
		 * get label css when horizontal direction
		 * @returns {string}
		 */
		getHorizontalLabelCSS: function () {
			var width = this.getHorizontalLabelWidth();
			return "col-sm-" + width + " col-md-" + width + " col-lg-" + width;
		},
		/**
		 * get component css when horizontal direction
		 * @returns {string}
		 */
		getHorizontalComponentCSS: function () {
			var width = 12 - this.getHorizontalLabelWidth();
			return "col-sm-" + width + " col-md-" + width + " col-lg-" + width;
		},
		getHorizontalLabelWidth: function () {
			var width = this.getComponentOption('labelWidth');
			return width ? width : NFormCell.LABEL_WIDTH;
		},
		/**
		 * register to component central
		 */
		registerToComponentCentral: function() {
			var id = this.getComponentCentralId();
			if (id) {
				$pt.LayoutHelper.registerComponent(id + '@cell', this);
			}
		},
		/**
		 * unregsiter from component central
		 */
		unregisterFromComponentCentral: function() {
			var id = this.getComponentCentralId();
			if (id) {
				$pt.LayoutHelper.unregisterComponent(id + '@cell', this);
			}
		}
	}));
	$pt.Components.NFormCell = NFormCell;
}(window, jQuery, React, ReactDOM, $pt));
