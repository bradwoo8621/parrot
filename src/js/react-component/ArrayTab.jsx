(function (window, $, React, ReactDOM, $pt) {
	var NArrayTab = React.createClass($pt.defineCellComponent({
		displayName: 'NArrayTab',
		mixins: [$pt.mixins.ArrayComponentMixin],
		statics: {
			UNTITLED: 'Untitled Item',
			ADD_ICON: 'plus-circle',
			ADD_LABEL: 'Add'
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
		/**
		 * render tab content
		 * @param tab
		 * @param tabIndex
		 * @returns {XML}
		 */
		renderTabContent: function (tab, tabIndex) {
			var activeTabIndex = this.getActiveTabIndex();
			var css = {
				'n-array-tab-card': true,
				show: tabIndex == activeTabIndex,
				hide: tabIndex != activeTabIndex
			};

			// no base here. since no apply operation
			var _this = this;
			// add item title and item icon listener
			this.getDependencies(['itemTitle', 'itemIcon']).forEach(function (key) {
				tab.data.addListener(key, "post", "change", function () {
					_this.forceUpdate();
				});
			});
			// add badge listener
			var badge = this.getComponentOption('badge');
			if (badge != null) {
				if (typeof badge === 'string') {
					tab.data.addListener(badge, "post", "change", function () {
						_this.forceUpdate();
					});
				} else {
					this.getDependencies(badge).forEach(function (key) {
						tab.data.addListener(key, "post", "change", function () {
							_this.forceUpdate();
						});
					});
				}
			}
			return (<$pt.Components.NForm model={tab.data}
			               layout={$pt.createFormLayout(tab.layout)}
			               direction={this.props.direction}
						   view={this.isViewMode()}
			               className={$pt.LayoutHelper.classSet(css)}
						   key={tabIndex}/>
			);
		},
		/**
		 * render
		 * @returns {XML}
		 */
		render: function () {
			var tabs = this.getTabs();
			var canActiveProxy = function(newTabValue, newTabIndex, activeTabValue, activeTabIndex) {
				if (this.isAddable() && (newTabIndex == tabs.length - 1)) {
					var onAdd = this.getComponentOption('onAdd');
					onAdd.call(this, this.getModel(), this.getValueFromModel());
					return false;
				} else {
					var canActive = this.getComponentOption('canActive');
					if (canActive) {
						return canActive.call(this, newTabValue, newTabIndex, activeTabValue, activeTabIndex);
					}
				}
			}.bind(this);

			// when state.clear is true, forcily clear the tab title dom
			// and then delete the state
			// see the following code in #onModelChanged
			// this.setState({clear: true}, this.forceUpdate);
			// forceUpdate must be passed as callback to #setState
			// all these are to remove the flicking when remove data from model side
			var tabTitle = null;
			if (this.state.clear !== true) {
				tabTitle = (<$pt.Components.NTab type={this.getComponentOption('tabType')}
				      justified={this.getComponentOption('justified')}
				      direction={this.getComponentOption('titleDirection')}
				      size={this.getComponentOption('titleIconSize')}
				      tabClassName={this.getAdditionalCSS('tabs')}
				      tabs={tabs}
				      canActive={canActiveProxy}
				      onActive={this.onTabClicked}
				      ref='tabs'>
				</$pt.Components.NTab>);
			} else {
				delete this.state.clear;
			}

			return (<div className={this.getComponentCSS('n-array-tab')}>
				{tabTitle}

				<div className='n-array-tab-content' ref='content'>
					{tabs.map(this.renderTabContent)}
				</div>
			</div>);
		},
		/**
		 * get tabs
		 * @returns {Array}
		 */
		getTabs: function () {
			var activeTabIndex = 0;
			if (this.state.transientActiveTabIndex != null) {
				activeTabIndex = this.state.transientActiveTabIndex;
				delete this.state.transientActiveTabIndex;
			} else {
				activeTabIndex = this.getActiveTabIndex();
			}
			this.state.tabs = this.getValueFromModel().map(function (item, itemIndex) {
				var model = this.createRowModel(item, true);
				this.addRowListener(model);
				return {
					label: this.getTabTitle(model),
					icon: this.getTabIcon(model),
					layout: this.getEditLayout(model),
					badge: this.getTabBadge(model),
					data: model,
					active: itemIndex == activeTabIndex
				};
			}.bind(this));
			if (this.isAddable()) {
				this.state.tabs.push({
					icon: NArrayTab.ADD_ICON,
					label: NArrayTab.ADD_LABEL,
					layout: {
						nothing: {
							comp: {
								type: $pt.ComponentConstants.Nothing
							}
						}
					},
					data: $pt.createModel({}),
					css: 'add-tab'
				});
			}
			return this.state.tabs;
		},
		clearTabs: function(callback) {
			if (callback) {
				this.setState({tabs: null}, callback.bind(this));	
			} else {
				this.setState({tabs: null});
			}
		},
		/**
		 * return [] when is null
		 * @returns {[*]}
		 */
		getValueFromModel: function () {
			var data = this.getModel().get(this.getDataId());
			return data == null ? [] : data;
		},
		/**
		 * on model changed
		 * @param evt
		 */
		onModelChanged: function (evt) {
			if (evt.type === 'add') {
				this.state.transientActiveTabIndex = evt.index;
				// this.clearTabs(this.setActiveTabIndex.bind(this, evt.index));
			} else if (evt.type === 'remove') {
				var index = evt.index;
				var data = this.getValueFromModel();
				if (index == data.length) {
					index = index - 1;
				}
				this.state.transientActiveTabIndex = index;
				// this.clearTabs(this.setActiveTabIndex.bind(this, index));
			} else {
				// this.forceUpdate();
				this.state.transientActiveTabIndex = evt.index != null ? evt.index : null;
			}
			this.setState({clear: true}, this.forceUpdate);
			// this.forceUpdate();
		},
		/**
		 * get edit layout
		 * @param model {ModelInterface} item model
		 * @returns {FormLayout}
		 */
		getEditLayout: function (model) {
			var layout = this.getComponentOption('editLayout');
			if (typeof layout === 'function') {
				return layout.call(this, model);
			} else {
				return layout;
			}
		},
		/**
		 * get item title
		 * @param model {ModelInterface} item model
		 * @returns {string}
		 */
		getTabTitle: function (model) {
			var title = this.getComponentOption('itemTitle');
			if (title == null) {
				return NArrayTab.UNTITLED;
			} else if (typeof title === 'string') {
				return title;
			} else {
				var titleText = title.when.call(this, model);
				return (titleText == null || titleText.isBlank()) ? NArrayTab.UNTITLED : titleText;
			}
		},
		getTabBadge: function (model) {
			var badge = this.getComponentOption('badge');
			if (badge == null) {
				return null;
			} else if (typeof badge === 'string') {
				var badgeValue = model.get(badge);
				var badgeRender = this.getComponentOption('badgeRender');
				if (badgeRender) {
					badgeValue = badgeRender.call(this, badgeValue, model, this.getModel());
				}
				return badgeValue;
			} else {
				return badge.when.call(this, model);
			}
		},
		/**
		 * get item icon
		 * @param model {ModelInterface} item model
		 * @returns {string}
		 */
		getTabIcon: function (model) {
			var icon = this.getComponentOption('itemIcon');
			if (icon == null) {
				return null;
			} else if (typeof icon === 'string') {
				return icon;
			} else {
				return icon.when.call(this, model);
			}
		},
		isAddable: function() {
			return !this.isViewMode() && this.getComponentOption('onAdd') != null;
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
			var tabs = this.state.tabs;
			if (tabs == null) {
				return -1;
			}
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
	$pt.Components.NArrayTab = NArrayTab;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.ArrayTab, function (model, layout, direction, viewMode) {
		return <$pt.Components.NArrayTab {...$pt.LayoutHelper.transformParameters(model, layout, direction, viewMode)}/>;
	});
}(window, jQuery, React, ReactDOM, $pt));
