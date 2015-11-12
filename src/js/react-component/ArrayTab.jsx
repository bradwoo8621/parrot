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
				tabs: null,
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
		renderTabContent: function (tab, index) {
			var activeIndex = this.getActiveTabIndex();
			var css = {
				'n-array-tab-card': true,
				show: index == activeIndex,
				hide: index != activeIndex
			};

			var parentModel = this.getModel();
			var parentValidator = parentModel.getValidator();
			var validator = null;
			if (parentValidator) {
				var parentValidationConfig = parentValidator.getConfig()[this.getDataId()];
				if (parentValidationConfig && parentValidationConfig.table) {
					validator = $pt.createModelValidator(parentValidationConfig.table);
				}
			}
			var model = validator ? $pt.createModel(tab.data, validator) : $pt.createModel(tab.data);
			model.useBaseAsCurrent();
			model.parent(parentModel);
			// synchronized the validation result from parent model
			// get errors about current value
			var errors = this.getModel().getError(this.getDataId());
			if (errors) {
				var itemError = null;
				for (var errorIndex = 0, errorCount = errors.length; errorIndex < errorCount; errorIndex++) {
					if (typeof errors[errorIndex] !== "string") {
						itemError = errors[errorIndex].getError(tab.data);
						model.mergeError(itemError);
					}
				}
			}
			// no base here. since no apply operation
			var _this = this;
			// add item title and item icon listener
			this.getDependencies(['itemTitle', 'itemIcon']).forEach(function (key) {
				model.addListener(key, "post", "change", function () {
					_this.forceUpdate();
				});
			});
			// add badge listener
			var badge = this.getComponentOption('badge');
			if (badge != null) {
				if (typeof badge === 'string') {
					model.addListener(badge, "post", "change", function () {
						_this.forceUpdate();
					});
				} else {
					this.getDependencies(badge).forEach(function (key) {
						model.addListener(key, "post", "change", function () {
							_this.forceUpdate();
						});
					});
				}
			}
			return (<NForm model={model}
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
			return (<div className={this.getComponentCSS('n-array-tab')}>
				<NTab type={this.getComponentOption('tabType')}
				      justified={this.getComponentOption('justified')}
				      direction={this.getComponentOption('titleDirection')}
				      size={this.getComponentOption('titleIconSize')}
				      tabClassName={this.getAdditionalCSS('tabs')}
				      tabs={tabs}
				      canActive={this.getComponentOption('canActive')}
				      onActive={this.onTabClicked}
				      ref='tab'>
				</NTab>

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
			var _this = this;
			var tabs = [];
			var data = this.getValueFromModel();
			data.forEach(function (item) {
				tabs.push({
					label: _this.getTabTitle(item),
					icon: _this.getTabIcon(item),
					layout: _this.getEditLayout(item),
					badge: _this.getTabBadge(item),
					data: item
				});
			});
			this.state.tabs = tabs;
			this.getActiveTabIndex();
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
			this.forceUpdate();
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
		 * @param item
		 * @returns {FormLayout}
		 */
		getEditLayout: function (item) {
			var layout = this.getComponentOption('editLayout');
			if (typeof layout === 'function') {
				return layout.call(this, item);
			} else {
				return layout;
			}
		},
		/**
		 * get item title
		 * @param item
		 * @returns {string}
		 */
		getTabTitle: function (item) {
			var title = this.getComponentOption('itemTitle');
			if (title == null) {
				return NArrayTab.UNTITLED;
			} else if (typeof title === 'string') {
				return title;
			} else {
				var titleText = title.when.call(this, item);
				return (titleText == null || titleText.isBlank()) ? NArrayTab.UNTITLED : titleText;
			}
		},
		getTabBadge: function (item) {
			var badge = this.getComponentOption('badge');
			if (badge == null) {
				return null;
			} else if (typeof badge === 'string') {
				var badgeValue = $pt.getValueFromJSON(item, badge);
				var badgeRender = this.getComponentOption('badgeRender');
				if (badgeRender) {
					badgeValue = badgeRender.call(this, badgeValue, item, this.getModel());
				}
				return badgeValue;
			} else {
				return badge.when.call(this, item);
			}
		},
		/**
		 * get item icon
		 * @param item
		 * @returns {string}
		 */
		getTabIcon: function (item) {
			var icon = this.getComponentOption('itemIcon');
			if (icon == null) {
				return null;
			} else if (typeof icon === 'string') {
				return icon;
			} else {
				return icon.when.call(this, item);
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
				var _this = this;
				this.state.activeTabIndex = 0;
				this.state.tabs.forEach(function (tab, index) {
					if (tab.active === true) {
						_this.state.activeTabIndex = index;
					}
				});
			}
			return this.state.activeTabIndex;
		}
	}));
	context.NArrayTab = NArrayTab;
}(this, jQuery, $pt));
