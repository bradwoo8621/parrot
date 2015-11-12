/**
 * panel
 * depends NForm
 *
 * layout: {
 *      label: string,
 *      pos: {
 *          row: number,
 *          col: number,
 *          width: number,
 *          section: string,
 *          card: string
 *      },
 *      comp: {
 *          type: $pt.ComponentConstants.Panel,
 *          expanded: boolean,
 *          collapsible: boolean,
 *          style: string,
 *          expandedLabel: string|function,
 *          collapsedLabel: string|function,
 *          checkInTitle: {
 *              data: string,
 *              label: string,
 *              collapsible: string
 *          },
 *          editLayout: {}, // see form layout
 *          visible: {
 *              when: function,
 *              depends: string|string[]
 *          }
 *      },
 *      css: {
 *          cell: string,
 *          comp: string
 *      }
 * }
 */
(function (context, $, $pt) {
	var NPanel = React.createClass($pt.defineCellComponent({
		propTypes: {
			// model
			model: React.PropTypes.object,
			// CellLayout
			layout: React.PropTypes.object,
			direction: React.PropTypes.oneOf(['vertical', 'horizontal'])
		},
		/**
		 * will update
		 * @param nextProps
		 */
		componentWillUpdate: function (nextProps) {
			if (this.hasCheckInTitle()) {
				this.getModel().removeListener(this.getCheckInTitleDataId(), 'post', 'change', this.onTitleCheckChanged);
			}
			this.removeDependencyMonitor(this.getDependencies("collapsedLabel"));
			this.removeDependencyMonitor(this.getDependencies("expandedLabel"));
			this.unregisterFromComponentCentral();
		},
		/**
		 * did update
		 * @param prevProps
		 * @param prevState
		 */
		componentDidUpdate: function (prevProps, prevState) {
			if (this.hasCheckInTitle()) {
				this.getModel().addListener(this.getCheckInTitleDataId(), 'post', 'change', this.onTitleCheckChanged);
			}
			this.addDependencyMonitor(this.getDependencies("collapsedLabel"));
			this.addDependencyMonitor(this.getDependencies("expandedLabel"));
			this.registerToComponentCentral();
		},
		/**
		 * did mount
		 */
		componentDidMount: function () {
			if (this.hasCheckInTitle()) {
				this.getModel().addListener(this.getCheckInTitleDataId(), 'post', 'change', this.onTitleCheckChanged);
			}
			this.addDependencyMonitor(this.getDependencies("collapsedLabel"));
			this.addDependencyMonitor(this.getDependencies("expandedLabel"));
			this.registerToComponentCentral();
		},
		/**
		 * will unmount
		 */
		componentWillUnmount: function () {
			if (this.hasCheckInTitle()) {
				this.getModel().removeListener(this.getCheckInTitleDataId(), 'post', 'change', this.onTitleCheckChanged);
			}
			this.removeDependencyMonitor(this.getDependencies("collapsedLabel"));
			this.removeDependencyMonitor(this.getDependencies("expandedLabel"));
			this.unregisterFromComponentCentral();
		},
		getDefaultProps: function () {
			return {
				defaultOptions: {
					collapsible: false,
					expanded: true,
					style: 'default'
				}
			};
		},
		getInitialState: function () {
			return {
				expanded: null
			};
		},
		/**
		 * render check in title
		 * @returns {XML}
		 */
		renderCheckInTitle: function () {
			if (!this.hasCheckInTitle()) {
				return null;
			}

			var layout = {
				label: this.getCheckInTitleLabel(),
				dataId: this.getCheckInTitleDataId(),
				comp: $.extend({labelAttached: 'left'}, this.getCheckInTitleOption(), {
					type: $pt.ComponentConstants.Check,
					labelDirection: 'horizontal'
				})
			};
			return (<div>
				(
				<NCheck model={this.getModel()} layout={$pt.createCellLayout('check', layout)}/>
				)
			</div>);
		},
		/**
		 * render heading
		 * @returns {XML}
		 */
		renderHeading: function () {
			var label = this.getTitle();
			var css = {
				'panel-title': true
			};
			if (this.isCollapsible()) {
				css['n-collapsible-title-check'] = this.hasCheckInTitle();
				return (<div className='panel-heading'>
					<h4 className={$pt.LayoutHelper.classSet(css)}>
						<a href='javascript:void(0);' onClick={this.onTitleClicked} ref='head'>{label}</a>
						{this.renderCheckInTitle()}
					</h4>
				</div>);
			} else if (this.hasCheckInTitle()) {
				css['n-normal-title-check'] = this.hasCheckInTitle();
				return (<div className='panel-heading'>
					<h4 className={$pt.LayoutHelper.classSet(css)}>
						<span ref='head'>{label}</span>
						{this.renderCheckInTitle()}
					</h4>
				</div>);
			} else {
				return <div className='panel-heading' ref='head'>{label}</div>;
			}
		},
		/**
		 * render row
		 * @param row {RowLayout}
		 */
		renderRow: function (row) {
			var _this = this;
			var cells = row.getCells().map(function (cell) {
				return <NFormCell layout={cell}
				                  model={_this.getModel()}
				                  ref={cell.getId()}
				                  direction={_this.props.direction}/>;
			});
			return (<div className="row">{cells}</div>);
		},
		/**
		 * render
		 * @returns {XML}
		 */
		render: function () {
			var label = this.getLayout().getLabel();
			if (label == null) {
				return (<div ref='panel'>
					{this.getInnerLayout().getRows().map(this.renderRow)}
				</div>);
			}
			var css = {
				panel: true
			};
			css['panel-' + this.getStyle()] = true;
			css[this.getComponentCSS('n-panel')] = true;
			var bodyStyle = {
				display: this.isInitExpanded() ? 'block' : 'none'
			};
			return (<div className={$pt.LayoutHelper.classSet(css)} ref='panel'>
				{this.renderHeading()}
				<div className='panel-body' style={bodyStyle} ref='body'>
					{this.getInnerLayout().getRows().map(this.renderRow)}
				</div>
			</div>);
		},
		/**
		 * get inner layout
		 * @returns {SectionLayout}
		 */
		getInnerLayout: function () {
			if (this.state.innerLayout == null) {
				this.state.innerLayout = $pt.createSectionLayout({layout: this.getComponentOption('editLayout')});
			}
			return this.state.innerLayout;
		},
		/**
		 * is collapsible or not
		 * @returns {boolean}
		 */
		isCollapsible: function () {
			return this.getComponentOption('collapsible');
		},
		/**
		 * is expanded
		 * @returns {boolean}
		 */
		isInitExpanded: function () {
			if (this.state.expanded == null) {
				// first equals 'expanded' definition
				this.state.expanded = this.getComponentOption('expanded');
				if (this.hasCheckInTitle()) {
					// when there is a check-box in title
					var value = this.getCheckInTitleValue();
					var action = this.getCheckInTitleCollapsible();
					if (action === 'same') {
						// check behavior same as collapsible
						// all expanded, finally expanded
						this.state.expanded = this.state.expanded && (value === true);
					} else if (action === 'reverse') {
						// check behavior reversed as collapsible
						// all expanded, finally expanded
						this.state.expanded = this.state.expanded && (value !== true);
					}
				}
			}
			return this.state.expanded;
		},
		/**
		 * get style
		 * @returns {string}
		 */
		getStyle: function () {
			return this.getComponentOption('style');
		},
		getTitle: function () {
			var label = this.getLayout().getLabel();
			if (this.state.expanded) {
				var expandedLabel = this.getExpandedLabelRenderer();
				if (expandedLabel) {
					if (typeof expandedLabel === 'string') {
						label = expandedLabel;
					} else {
						label = expandedLabel.when.call(this, this.getModel());
					}
				}
			} else {
				var collapsedLabel = this.getCollapsedLabelRenderer();
				if (collapsedLabel) {
					if (typeof collapsedLabel === 'string') {
						label = collapsedLabel;
					} else {
						label = collapsedLabel.when.call(this, this.getModel());
					}
				}
			}
			return label;
		},
		getExpandedLabelRenderer: function () {
			return this.getComponentOption('expandedLabel');
		},
		getCollapsedLabelRenderer: function () {
			return this.getComponentOption('collapsedLabel');
		},
		/**
		 * has check box in title or not
		 * @returns {boolean}
		 */
		hasCheckInTitle: function () {
			return this.getComponentOption('checkInTitle') != null;
		},
		/**
		 * get check box value of panel title
		 * @returns {boolean}
		 */
		getCheckInTitleValue: function () {
			var id = this.getCheckInTitleDataId();
			return id ? this.getModel().get(id) : null;
		},
		/**
		 * get check box data id of panel title
		 * @returns {string}
		 */
		getCheckInTitleDataId: function () {
			var checkInTitle = this.getComponentOption('checkInTitle');
			return checkInTitle ? checkInTitle.data : null;
		},
		/**
		 * get check box label of panel title
		 * @returns {string}
		 */
		getCheckInTitleLabel: function () {
			var checkInTitle = this.getComponentOption('checkInTitle');
			return checkInTitle ? checkInTitle.label : null;
		},
		/**
		 * get check box value and collapsible is related or not
		 * @returns {same|reverse}
		 */
		getCheckInTitleCollapsible: function () {
			var checkInTitle = this.getComponentOption('checkInTitle');
			return checkInTitle ? checkInTitle.collapsible : null;
		},
		/**
		 * get other check in title options
		 * @returns {null}
		 */
		getCheckInTitleOption: function () {
			var checkInTitle = this.getComponentOption('checkInTitle');
			if (checkInTitle) {
				var options = $.extend({}, checkInTitle);
				delete options.data;
				delete options.label;
				delete options.collapsible;
				return options;
			} else {
				return null;
			}
		},
		/**
		 * on title clicked
		 * @param e
		 */
		onTitleClicked: function (e) {
			e.selected = false;
			e.preventDefault();
			this.toggleExpanded(!this.state.expanded);
		},
		/**
		 * on title check-box value changed
		 * @param evt
		 */
		onTitleCheckChanged: function (evt) {
			var value = evt.new;
			var collapsible = this.getCheckInTitleCollapsible();
			if (collapsible === 'same') {
				this.toggleExpanded(value);
			} else if (collapsible === 'reverse') {
				this.toggleExpanded(!value);
			}
		},
		/**
		 * toggle panel expanded
		 * @param expanded {boolean}
		 */
		toggleExpanded: function (expanded) {
			if (expanded) {
				if (this.canExpanded()) {
					// panel can be expanded
					$(React.findDOMNode(this.refs.body)).slideDown(300, function () {
						this.setState({expanded: true});
					}.bind(this));
				}
			} else {
				$(React.findDOMNode(this.refs.body)).slideUp(300, function () {
					this.setState({expanded: false});
				}.bind(this));
			}
		},
		/**
		 * check the panel can expanded or not
		 * @returns {boolean}
		 */
		canExpanded: function () {
			if (this.hasCheckInTitle()) {
				var value = this.getCheckInTitleValue();
				var collapsible = this.getCheckInTitleCollapsible();
				if (collapsible === 'same') {
					// check behavior same as collapsible
					return value === true;
				} else if (collapsible === 'reverse') {
					// check behavior reversed as collapsible
					return value !== true;
				}
			}
			return true;
		}
	}));
	context.NPanel = NPanel;
}(this, jQuery, $pt));
