/**
 * Created by brad.wu on 8/20/2015.
 * TODO add & remove are not supported yet
 * TODO since no apply action, must reset the whole model if want to reset the items data
 *
 * depends NTab
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
 *      comp: {
 *          type: $pt.ComponentConstants.ArrayTab,
 *          tabType: string,
 *          itemTitle: string|{when: function, depends: string|string[]},
 *          itemIcon: string|{when: function, depends: string|string[]},
 *          badge: string|{when: function, depends: string|string[]},
 *          titleDirection: string,
 *          titleIconSize: string,
 *          justified: boolean,
 *          canActive: function,
 *          onActive: function,
 *          editLayout: {}|function, // see form layout
 *          visible: {
 *              when: function,
 *              depends: string|string[]
 *          },
 *      },
 *      css: {
 *          cell: string,
 *          comp: string
 *      }
 * }
 */
(function (window, $, React, ReactDOM, $pt) {
	var NArrayTab = React.createClass($pt.defineCellComponent({
		displayName: 'NArrayTab',
		statics: {
			UNTITLED: 'Untitled Item',
			ADD_ICON: 'plus-circle',
			ADD_LABEL: 'Add'
		},
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
				tabs: null
			};
		},
		/**
		 * will update
		 * @param nextProps
		 */
		componentWillUpdate: function (nextProps) {
			// remove post change listener to handle model change
			this.removePostChangeListener(this.onModelChanged);
			this.removePostAddListener(this.onModelChanged);
			this.removePostRemoveListener(this.onModelChanged);
			this.removePostValidateListener(this.onModelValidateChanged);
			this.unregisterFromComponentCentral();
		},
		/**
		 * did update
		 * @param prevProps
		 * @param prevState
		 */
		componentDidUpdate: function (prevProps, prevState) {
			// add post change listener to handle model change
			this.addPostChangeListener(this.onModelChanged);
			this.addPostAddListener(this.onModelChanged);
			this.addPostRemoveListener(this.onModelChanged);
			this.addPostValidateListener(this.onModelValidateChanged);
			this.registerToComponentCentral();
		},
		/**
		 * did mount
		 */
		componentDidMount: function () {
			// add post change listener to handle model change
			this.addPostChangeListener(this.onModelChanged);
			this.addPostAddListener(this.onModelChanged);
			this.addPostRemoveListener(this.onModelChanged);
			this.addPostValidateListener(this.onModelValidateChanged);
			this.registerToComponentCentral();
		},
		/**
		 * will unmount
		 */
		componentWillUnmount: function () {
			// remove post change listener to handle model change
			this.removePostChangeListener(this.onModelChanged);
			this.removePostAddListener(this.onModelChanged);
			this.removePostRemoveListener(this.onModelChanged);
			this.removePostValidateListener(this.onModelValidateChanged);
			this.unregisterFromComponentCentral();
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
						canActive.call(this, newTabValue, newTabIndex, activeTabValue, activeTabIndex);
					}
				}
			}.bind(this);
			return (<div className={this.getComponentCSS('n-array-tab')}>
				<$pt.Components.NTab type={this.getComponentOption('tabType')}
				      justified={this.getComponentOption('justified')}
				      direction={this.getComponentOption('titleDirection')}
				      size={this.getComponentOption('titleIconSize')}
				      tabClassName={this.getAdditionalCSS('tabs')}
				      tabs={tabs}
				      canActive={canActiveProxy}
				      onActive={this.onTabClicked}
				      ref='tabs'>
				</$pt.Components.NTab>

				<div className='n-array-tab-content' ref='content'>
					{tabs.map(this.renderTabContent)}
				</div>
			</div>);
		},
		createItemModel: function(item) {
			var parentModel = this.getModel();
			var parentValidator = parentModel.getValidator();
			var validator = null;
			if (parentValidator) {
				var parentValidationConfig = parentValidator.getConfig()[this.getDataId()];
				if (parentValidationConfig && parentValidationConfig.table) {
					validator = $pt.createModelValidator(parentValidationConfig.table);
				}
			}
			var model = validator ? $pt.createModel(item, validator) : $pt.createModel(item);
			model.useBaseAsCurrent();
			model.parent(parentModel);
			// synchronized the validation result from parent model
			// get errors about current value
			var errors = this.getModel().getError(this.getDataId());
			if (errors) {
				var itemError = null;
				for (var errorIndex = 0, errorCount = errors.length; errorIndex < errorCount; errorIndex++) {
					if (typeof errors[errorIndex] !== "string") {
						itemError = errors[errorIndex].getError(item);
						model.mergeError(itemError);
					}
				}
			}
			return model;
		},
		/**
		 * get tabs
		 * @returns {Array}
		 */
		getTabs: function () {
			var _this = this;
			if (this.state.tabs) {
				this.state.tabs.forEach(function(tab, tabIndex) {
					if ((_this.isAddable() && (tabIndex != _this.state.tabs.length - 1)) || !_this.isAddable()) {
						var model = tab.data;
						tab.label = _this.getTabTitle(model);
						tab.icon = _this.getTabIcon(model);
						tab.layout = _this.getEditLayout(model);
						tab.badge = _this.getTabBadge(model);
					}
				});
				return this.state.tabs;
			}

			this.state.tabs = this.getValueFromModel().map(function (item) {
				var model = _this.createItemModel(item);
				return {
					label: _this.getTabTitle(model),
					icon: _this.getTabIcon(model),
					layout: _this.getEditLayout(model),
					badge: _this.getTabBadge(model),
					data: model
				};
			});
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
					data: $pt.createModel({})
				});
			}
			return this.state.tabs;
		},
		clearTabs: function(callback) {
			this.setState({tabs: null}, callback.call(this));
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
				this.clearTabs(this.setActiveTabIndex.bind(this, evt.index));
			} else if (evt.type === 'remove') {
				var index = evt.index;
				var data = this.getValueFromModel();
				if (index == data.length) {
					index = index - 1;
				}
				this.clearTabs(this.setActiveTabIndex.bind(this, index));
			} else {
				this.forceUpdate();
			}
		},
		/**
		 * monitor the parent model validation
		 * @param evt
		 */
		onModelValidateChanged: function (evt) {
			// TODO maybe will introduce performance issue, cannot sure now.
			this.forceUpdate();
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
