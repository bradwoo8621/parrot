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
		propTypes: {
			// model, whole model, not only for this cell
			// use id to get the value of this cell from model
			model: React.PropTypes.object,
			// CellLayout
			layout: React.PropTypes.object,
			// label direction
			direction: React.PropTypes.oneOf(['vertical', 'horizontal']),
			// is view mode or not
			view: React.PropTypes.bool
		},
		getDefaultProps: function () {
			return {
				defaultOptions: {
					paintRequired: true
				},
				direction: 'vertical'
			};
		},
		/**
		 * will update
		 * @param nextProps
		 */
		componentWillUpdate: function (nextProps) {
			this.destroyPopover();
			this.removePostChangeListener(this.onModelChanged);
			this.removePostValidateListener(this.onModelValidateChanged);
			this.removeVisibleDependencyMonitor();
			this.removeEnableDependencyMonitor();
			this.unregisterFromComponentCentral();
		},
		/**
		 * did update
		 * @param prevProps
		 * @param prevState
		 */
		componentDidUpdate: function (prevProps, prevState) {
			this.renderPopover();
			this.addPostChangeListener(this.onModelChanged);
			this.addPostValidateListener(this.onModelValidateChanged);
			this.addVisibleDependencyMonitor();
			this.addEnableDependencyMonitor();
			this.registerToComponentCentral();
		},
		/**
		 * did mount
		 */
		componentDidMount: function () {
			this.renderPopover();
			this.addPostChangeListener(this.onModelChanged);
			this.addPostValidateListener(this.onModelValidateChanged);
			this.addVisibleDependencyMonitor();
			this.addEnableDependencyMonitor();
			this.registerToComponentCentral();
		},
		/**
		 * will unmount
		 */
		componentWillUnmount: function () {
			this.destroyPopover();
			this.removePostChangeListener(this.onModelChanged);
			this.removePostValidateListener(this.onModelValidateChanged);
			this.removeVisibleDependencyMonitor();
			this.removeEnableDependencyMonitor();
			this.unregisterFromComponentCentral();
		},
		destroyPopover: function () {
			var comp = this.refs.comp;
			if (comp != null) {
				$(ReactDOM.findDOMNode(comp)).popover("destroy");
			}
		},
		/**
		 * render error popover
		 */
		renderPopover: function () {
			if (this.getLayout().getComponentType().popover !== false && this.getModel().hasError(this.getDataId())) {
				var messages = this.getModel().getError(this.getDataId());
				var _this = this;
				var popover = {
					placement: 'top',
					trigger: 'hover',
					html: true,
					content: messages.map(function (msg) {
						return "<span style='display:block'>" + msg.format([_this.getLayout().getLabel()]) + "</span>";
					}),
					// false is very import, since when destroy popover,
					// the really destroy will be invoked by some delay,
					// and before really destory invoked,
					// the new popover is bind by componentDidUpdate method.
					// and finally new popover will be destroyed.
					animation: false
				};

				var comp = this.refs.comp;
				if (comp != null) {
					$(ReactDOM.findDOMNode(comp)).popover(popover);
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
			return (<div ref="comp">
				{$pt.LayoutHelper.getComponentRenderer(type).call(this, this.getFormModel(), this.getLayout(), direction, this.isViewMode())}
			</div>);
		},
		/**
		 * render label
		 * @returns {XML}
		 */
		renderLabel: function () {
			var requiredPaint = this.getComponentOption("paintRequired");
			var requireIconCSS = {
				fa: true,
				'fa-fw': true,
				required: true
			};
			requireIconCSS['fa-' + NFormCell.REQUIRED_ICON] = true;
			var requiredLabel = requiredPaint && this.getModel().isRequired(this.getDataId()) ?
				(<span className={$pt.LayoutHelper.classSet(requireIconCSS)}/>) : null;
			//var showColon = !this.getLayout().getLabel().endsWith('?')
			//{showColon ? ':' : null}
			var tooltip = this.getComponentOption('tooltip');
			var tooltipIcon = null;
			if (tooltip != null && !tooltip.isBlank()) {
				var tooltipCSS = {
					fa: true,
					'fa-fw': true,
					'n-form-cell-tooltip': true
				};
				tooltipCSS['fa-' + NFormCell.TOOLTIP_ICON] = true;
				tooltipIcon = <span className={$pt.LayoutHelper.classSet(tooltipCSS)} title={tooltip}/>;
			}
			return (<span className={this.getLayout().getLabelCSS()} onClick={this.onLabelClicked} ref="label">
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
			// when the component is not visible
			// or declared only view in edit mode
			// hide it
			var visible = this.isVisible();
			if (visible) {
				var view = this.getComponentOption('view');
				if (this.isViewMode()) {
					visible = (view == 'edit') != true;
				} else if (!this.isViewMode()) {
					visible = (view == 'view') != true;
				}
			}

			if (!visible) {
				return (<div className={this.getCSSClassName() + ' n-form-cell-invisible'}/>);
			} else {
				var css = this.getCSSClassName();
				if (this.getModel().hasError(this.getDataId())) {
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
			this.getModel().validate(evt.id);
		},
		/**
		 * on model validate change
		 * @param evt not used
		 */
		onModelValidateChanged: function (evt) {
			// TODO maybe will introduce performance issue, cannot sure now.
			// this.forceUpdate();
			var div;
			if (this.getModel().hasError(this.getDataId())) {
				this.renderPopover();
				div = this.refs.div;
				if (div != null) {
					$(ReactDOM.findDOMNode(div)).addClass('has-error');
				}
			} else {
				this.destroyPopover();
				div = this.refs.div;
				if (div != null) {
					$(ReactDOM.findDOMNode(div)).removeClass('has-error');
				}
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
			if (typeof width === 'number') {
				css['col-sm-' + width] = true;
				css['col-md-' + width] = true;
				css['col-lg-' + width] = true;
			} else {
				Object.keys(width).forEach(function(key) {
					css['col-' + key + '-' + width[key]] = true;
				});
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
