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
(function (context, $, $pt) {
	var NArrayTab = React.createClass($pt.defineCellComponent({
		statics: {
			UNTITLED: 'Untitled Item'
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
				activeTabIndex: null
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

			// TODO since NTab will keep the active tab index in state, force change it.
			this.refs.tab.setActiveTabIndex(this.getActiveTabIndex());
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
		 * @param index
		 * @returns {XML}
		 */
		renderTabContent: function (tab) {
			var css = {
				'n-array-tab-card': true,
				show: tab.active,
				hide: !tab.active
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
			return (<NForm model={tab.data}
			               layout={$pt.createFormLayout(tab.layout)}
			               direction={this.props.direction}
			               className={$pt.LayoutHelper.classSet(css)}/>
			);
		},
		/**
		 * render
		 * @returns {XML}
		 */
		render: function () {
			var tabs = this.getTabs();
			this.activeTab(tabs, this.getActiveTabIndex());
			var canActive = this.getComponentOption('canActive');
			if (canActive) {
				canActive.bind(this);
			}
			var _this = this;
			return (<div className={this.getComponentCSS('n-array-tab')}>
				<NTab type={this.getComponentOption('tabType')}
				      justified={this.getComponentOption('justified')}
				      direction={this.getComponentOption('titleDirection')}
				      size={this.getComponentOption('titleIconSize')}
				      tabClassName={this.getAdditionalCSS('tabs')}
				      tabs={tabs}
				      canActive={canActive}
				      onActive={this.onTabClicked}
				      ref='tab'>
				</NTab>

				<div className='n-array-tab-content' ref='content'>
					{tabs.map(this.renderTabContent)}
				</div>
			</div>);
		},
		activeTab: function(tabs, activeTabIndex) {
			if (activeTabIndex >= tabs.length) {
				activeTabIndex = tabs.length - 1;
			}
			if (activeTabIndex < 0) {
				activeTabIndex = 0;
			}
			if (tabs.length > 0) {
				tabs[activeTabIndex].active = true;
			}
			this.state.activeTabIndex = activeTabIndex;
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
			var tabs = [];
			var data = this.getValueFromModel();
			data.forEach(function (item) {
				var model = _this.createItemModel(item);
				tabs.push({
					label: _this.getTabTitle(model),
					icon: _this.getTabIcon(model),
					layout: _this.getEditLayout(model),
					badge: _this.getTabBadge(model),
					data: model
				});
			});
			return tabs;
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
				this.setActiveTabIndex(evt.index);
			} else if (evt.type === 'remove') {
				var index = evt.index;
				this.setActiveTabIndex(index);
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
				this.state.activeTabIndex = 0;
			}
			return this.state.activeTabIndex;
		},
		/**
		 * set active tab index
		 * @param {number}
		 */
		setActiveTabIndex: function(index) {
			this.setState({activeTabIndex: index});
		}
	}));
	context.NArrayTab = NArrayTab;
}(this, jQuery, $pt));
