(function (window, $, React, ReactDOM, $pt) {
	var NPanel = React.createClass($pt.defineCellComponent({
		displayName: 'NPanel',
		getDefaultProps: function () {
			return {
				defaultOptions: {
					collapsible: false,
					expanded: true,
					style: 'default'
				}
			};
		},
		installMonitors: function() {
			if (this.hasCheckInTitle()) {
				this.getModel().addPostChangeListener(this.getCheckInTitleDataId(), this.onTitleCheckChanged);
			}
		},
		uninstallMonitors: function() {
			if (this.hasCheckInTitle()) {
				this.getModel().removePostChangeListener(this.getCheckInTitleDataId(), this.onTitleCheckChanged);
			}
		},
		beforeWillUpdate: function (nextProps) {
			this.uninstallMonitors();
		},
		beforeDidUpdate: function (prevProps, prevState) {
			this.installMonitors();
		},
		beforeDidMount: function () {
			this.installMonitors();
		},
		beforeWillUnmount: function () {
			this.uninstallMonitors();
		},
		getDependencyOptions: function() {
			return ['collapsedLabel', 'expandedLabel'];
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
				(<$pt.Components.NCheck model={this.getModel()} layout={$pt.createCellLayout('check', layout)} view={this.isViewMode()}/>)
			</div>);
		},
		renderHeadingButtons: function() {
			var headButtons = this.getComponentOption('headerButtons');
			if (headButtons) {
				headButtons = Array.isArray(headButtons) ? headButtons : [headButtons];
				var _this = this;
				return (<div className="btn-toolbar pull-right" role='toolbar'>
					{headButtons.map(function(button, buttonIndex) {
						if (_this.isViewMode() && button.view == 'edit') {
							return null;
						} else if (!_this.isViewMode() && button.view == 'view') {
							return null;
						}
						var layout = {
							label: button.text,
							comp: button
						};
						// delete layout.comp.label;
						// console.log(layout);
						return <$pt.Components.NFormButton model={_this.getModel()}
														   layout={$pt.createCellLayout('pseudo-button', layout)}
														   key={buttonIndex} />;
					}).filter(function(button) {
						return button != null;
					})}
				</div>);
			} else {
				return null;
			}
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
					{this.renderHeadingButtons()}
				</div>);
			} else if (this.hasCheckInTitle()) {
				css['n-normal-title-check'] = this.hasCheckInTitle();
				return (<div className='panel-heading'>
					<h4 className={$pt.LayoutHelper.classSet(css)}>
						<span ref='head'>{label}</span>
						{this.renderCheckInTitle()}
					</h4>
					{this.renderHeadingButtons()}
				</div>);
			} else {
				return (<div className='panel-heading' ref='head'>
					{label}
					{this.renderHeadingButtons()}
				</div>);
			}
		},
		/**
		 * render row
		 * @param row {RowLayout}
		 */
		renderRow: function (row, rowIndex) {
			var _this = this;
			var cells = row.getCells().map(function (cell, cellIndex) {
				return <$pt.Components.NFormCell layout={cell}
				                  model={_this.getModel()}
				                  ref={cell.getId()}
				                  direction={_this.props.direction}
								  view={_this.isViewMode()}
								  key={'' + rowIndex + '-' + cellIndex}/>;
			});
			return (<div className="row" key={rowIndex}>{cells}</div>);
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
				panel: true,
				'panel-collapsible': this.isCollapsible(),
				'panel-expanded': this.isExpanded()
			};
			css['panel-' + this.getStyle()] = true;
			css[this.getComponentCSS('n-panel')] = true;
			var bodyStyle = {
				display: this.isExpanded() ? 'block' : 'none'
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
			return $pt.createSectionLayout({layout: this.getComponentOption('editLayout')});
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
		isExpanded: function () {
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
					$(ReactDOM.findDOMNode(this.refs.body)).slideDown(300, function () {
						this.setState({expanded: true});
					}.bind(this));
				}
			} else {
				$(ReactDOM.findDOMNode(this.refs.body)).slideUp(300, function () {
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
	$pt.Components.NPanel = NPanel;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.Panel, function (model, layout, direction, viewMode) {
		return <$pt.Components.NPanel {...$pt.LayoutHelper.transformParameters(model, layout, direction, viewMode)}/>;
	});
}(window, jQuery, React, ReactDOM, $pt));
