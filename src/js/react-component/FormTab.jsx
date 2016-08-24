(function (window, $, React, ReactDOM, $pt) {
	var NFormTab = React.createClass($pt.defineCellComponent({
		displayName: 'NFormTab',
		getDefaultProps: function () {
			return {
				defaultOptions: {
					tabType: 'tab',
					justified: false,
					titleDirection: 'horizontal'
				}
			};
		},
		beforeWillUpdate: function (nextProps) {
			this.uninstallBadgeMonitor();
		},
		beforeDidUpdate: function (prevProps, prevState) {
			this.installBadgeMonitor();
		},
		beforeDidMount: function () {
			this.installBadgeMonitor();
		},
		beforeWillUnmount: function () {
			this.uninstallBadgeMonitor();
		},
		installBadgeMonitor: function() {
			this.getTabs().forEach(function (tab) {
				if (tab.badgeId) {
					this.addDependencyMonitor([tab.badgeId]);
				}
			}.bind(this));
		},
		uninstallBadgeMonitor: function() {
			this.getTabs().forEach(function (tab) {
				if (tab.badgeId) {
					this.removeDependencyMonitor([tab.badgeId]);
				}
			}.bind(this));
		},
		renderTabContent: function (layout, index) {
			var activeIndex = this.getActiveTabIndex();
			var css = {
				'n-form-tab-card': true,
				show: index == activeIndex,
				hide: index != activeIndex
			};
			return (<$pt.Components.NForm model={this.getModel()}
			               layout={layout}
			               direction={this.props.direction}
						   view={this.isViewMode()}
			               className={$pt.LayoutHelper.classSet(css)}
			               key={'form-' + index}/>);
		},
		render: function () {
			var tabs = this.initializeTabs();
			var canActive = this.getComponentOption('canActive');
			if (canActive) {
				canActive.bind(this);
			}
			return (<div className={this.getComponentCSS('n-form-tab')}>
				<$pt.Components.NTab type={this.getComponentOption('tabType')}
				      justified={this.getComponentOption('justified')}
				      direction={this.getComponentOption('titleDirection')}
				      size={this.getComponentOption('titleIconSize')}
				      tabClassName={this.getAdditionalCSS('tabs')}
				      tabs={tabs}
				      canActive={canActive}
				      onActive={this.onTabClicked}
					  ref='tabs'/>

				<div className='n-form-tab-content' ref='content'>
					{this.getTabLayouts().map(this.renderTabContent)}
				</div>
			</div>);
		},
		getTabs: function() {
			return this.getComponentOption('tabs');
		},
		initializeTabs: function () {
			var _this = this;
			var tabs = this.getTabs();
			tabs.forEach(function (tab) {
				if (tab.badgeId) {
					tab.badge = _this.getModel().get(tab.badgeId);
					if (tab.badgeRender) {
						tab.badge = tab.badgeRender.call(_this, tab.badge, _this.getModel());
					}
				}
			});
			return tabs;
		},
		/**
		 * get tab layouts
		 * @returns {FormLayout[]}
		 */
		getTabLayouts: function () {
			return this.getTabs().map(function (tab) {
				return $pt.createFormLayout(tab.layout || tab.editLayout);
			});
		},
		/**
		 * on tab clicked
		 * @param tabValue {string} tab value
		 * @param index {number}
		 */
		onTabClicked: function (tabValue, index) {
			this.setActiveTabIndex(index);
			var onActive = this.getComponentOption('onActive');
			if (onActive) {
				onActive.call(this, tabValue, index);
			}
		},
		/**
		 * get active tab index
		 * @returns {number}
		 */
		getActiveTabIndex: function () {
			var tabs = this.getComponentOption('tabs');
			// find the active tab
			var activeTabIndex = tabs.findIndex(function (tab, index) {
				return tab.active === true;
			});
			if (activeTabIndex == -1) {
				// find the first visible tab if no active tab found
				activeTabIndex = tabs.findIndex(function (tab, index) {
					var visible =  tab.visible !== false;
					if (visible) {
						tab.active = true;
						return true;
					}
				});
			}
			return activeTabIndex;
		},
		/**
		 * set active tab index
		 * @param {number}
		 */
		setActiveTabIndex: function(index) {
			this.refs.tabs.setActiveTabIndex(index);
			this.forceUpdate();
		}
	}));
	$pt.Components.NFormTab = NFormTab;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.Tab, function (model, layout, direction, viewMode) {
		return <$pt.Components.NFormTab {...$pt.LayoutHelper.transformParameters(model, layout, direction, viewMode)}/>;
	});
}(window, jQuery, React, ReactDOM, $pt));
