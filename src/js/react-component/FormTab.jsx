/**
 * Created by brad.wu on 8/20/2015.
 * depends NTab, NForm
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
 *      css: {
 *          cell: string,
 *          comp: string
 *      },
 *      comp: {
 *          type: $pt.ComponentConstants.Tab,
 *          tabType: string,
 *          justified: boolean,
 *          titleDirection: string,
 *          titleIconSize: string,
 *          canActive: function,
 *          onActive: function,
 *          tabs: {
 *              active: boolean,
 *              label: string,
 *              icon: string,
 *              badgeId: string,
 *              badgeRender: function,
 *              editLayout: {}
 *              layout: {} // see form layout, official key is 'editLayout'. for compatibility, keep key 'layout'
 *          }[]
 *      }
 * }
 */
(function (context, $, $pt) {
	var NFormTab = React.createClass($pt.defineCellComponent({
		propTypes: {
			// model
			model: React.PropTypes.object,
			// CellLayout
			layout: React.PropTypes.object,
			direction: React.PropTypes.oneOf(['vertical', 'horizontal'])
		},
		getDefaultProps: function () {
			return {
				defaultOptions: {
					tabType: 'tab',
					justified: false,
					titleDirection: 'horizontal'
				}
			};
		},
		getInitialState: function () {
			return {
				activeTabIndex: null
			};
		},
		/**
		 * will update
		 * @param nextProps
		 */
		componentWillUpdate: function (nextProps) {
			var _this = this;
			this.state.tabs.forEach(function (tab) {
				if (tab.badgeId) {
					_this.removeDependencyMonitor([tab.badgeId]);
				}
			});
			this.unregisterFromComponentCentral();
		},
		/**
		 * did update
		 * @param prevProps
		 * @param prevState
		 */
		componentDidUpdate: function (prevProps, prevState) {
			var _this = this;
			this.state.tabs.forEach(function (tab) {
				if (tab.badgeId) {
					_this.addDependencyMonitor([tab.badgeId]);
				}
			});
			this.registerToComponentCentral();
		},
		/**
		 * did mount
		 */
		componentDidMount: function () {
			var _this = this;
			this.state.tabs.forEach(function (tab) {
				if (tab.badgeId) {
					_this.addDependencyMonitor([tab.badgeId]);
				}
			});
			this.registerToComponentCentral();
		},
		/**
		 * will unmount
		 */
		componentWillUnmount: function () {
			var _this = this;
			this.state.tabs.forEach(function (tab) {
				if (tab.badgeId) {
					_this.removeDependencyMonitor([tab.badgeId]);
				}
			});
			this.unregisterFromComponentCentral();
		},
		renderTabContent: function (layout, index) {
			var activeIndex = this.getActiveTabIndex();
			var css = {
				'n-form-tab-card': true,
				show: index == activeIndex,
				hide: index != activeIndex
			};
			return (<NForm model={this.getModel()}
			               layout={layout}
			               direction={this.props.direction}
			               className={$pt.LayoutHelper.classSet(css)}
			               key={'form-' + index}/>);
		},
		render: function () {
			var tabs = this.getTabs();
			var canActive = this.getComponentOption('canActive');
			if (canActive) {
				canActive.bind(this);
			}
			return (<div className={this.getComponentCSS('n-form-tab')}>
				<NTab type={this.getComponentOption('tabType')}
				      justified={this.getComponentOption('justified')}
				      direction={this.getComponentOption('titleDirection')}
				      size={this.getComponentOption('titleIconSize')}
				      tabClassName={this.getAdditionalCSS('tabs')}
				      tabs={tabs}
				      canActive={canActive}
				      onActive={this.onTabClicked}/>

				<div className='n-form-tab-content' ref='content'>
					{this.getTabLayouts().map(this.renderTabContent)}
				</div>
			</div>);
		},
		getTabs: function () {
			if (this.state.tabs == null) {
				// clone from definition
				this.state.tabs = this.getComponentOption('tabs').slice(0);
			}
			var _this = this;
			this.state.tabs.forEach(function (tab) {
				if (tab.badgeId) {
					tab.badge = _this.getModel().get(tab.badgeId);
					if (tab.badgeRender) {
						tab.badge = tab.badgeRender.call(_this, tab.badge, _this.getModel());
					}
				}
			});
			return this.state.tabs;
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
			this.setState({
				activeTabIndex: index
			});
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
			if (this.state.activeTabIndex == null) {
				// get initial active tab index, or 0 if not set
				var _this = this;
				this.state.activeTabIndex = 0;
				this.getComponentOption('tabs').forEach(function (tab, index) {
					if (tab.active === true) {
						_this.state.activeTabIndex = index;
					}
				});
			}
			return this.state.activeTabIndex;
		},
		/**
		 * set active tab index
		 * @param {number}
		 */
		setActiveTabIndex: function(index) {
			if (index < 0) {
				index = 0;
			} else if (index > (this.state.tabs.length - 1)) {
				index = this.state.tabs.length - 1;
			}
			if (index < 0) {
				throw $pt.createComponentException($pt.ComponentConstants.Err_Tab_Index_Out_Of_Bound, 'Tab index[' + index + '] out of bound.');
			}
			this.setState({activeTabIndex: index});
		}
	}));
	context.NFormTab = NFormTab;
}(this, jQuery, $pt));
