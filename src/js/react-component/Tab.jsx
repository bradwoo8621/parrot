(function (window, $, React, ReactDOM, $pt) {
	var NTab = React.createClass({
		displayName: 'NTab',
		getDefaultProps: function () {
			return {
				type: 'tab',
				justified: false,
				removable: false
			};
		},
		getInitialState: function () {
			return {};
		},
		componentDidUpdate: function() {
			this.renderRelatedDOM();
		},
		componentDidMount: function () {
			this.renderRelatedDOM();
		},
		renderRelatedDOM: function() {
			var activeTabIndex = this.getActiveTabIndex();
			this.props.tabs.forEach(function (tab, index) {
				if (activeTabIndex == index) {
					$('#' + tab.innerId).show();
				} else {
					$('#' + tab.innerId).hide();
				}
			});
		},
		/**
		 * render icon
		 * @param icon {string|XML}
		 * @param size {string}
		 * @returns {XML}
		 */
		renderIcon: function (icon, size) {
			if (typeof icon === 'string') {
				var css = {
					'fa': true,
					'fa-fw': true
				};
				css['fa-' + icon] = true;
				if (size) {
					css['fa-' + size] = true;
				}
				return <span className={$pt.LayoutHelper.classSet(css)}/>;
			} else {
				return icon;
			}
		},
		/**
		 * render label
		 * @param label {string}
		 * @returns {XML}
		 */
		renderLabel: function (label) {
			if (label) {
				return <span>{' ' + label}</span>;
			} else {
				return null;
			}
		},
		renderBadge: function (badge) {
			if (badge) {
				return <span className='badge'>{badge}</span>;
			} else {
				return null;
			}
		},
		/**
		 * render tab
		 * @param tab {{active:boolean, label:string, icon:string, badge:string, removable: boolean, visible:boolean}}
		 * @param index
		 * @returns {XML}
		 */
		renderTab: function (tab, index) {
			var css = {
				active: index == this.getActiveTabIndex(),
				hide: tab.visible === false
			};
			if (tab.css) {
				css[tab.css] = true;
			}
			var removeButton = (
				<a href='javascript:void(0);' className='n-tab-delete'
				   onClick={this.onRemoveClicked}>
					<span className='fa fa-fw fa-times'/>
				</a>);
			return (<li role="presentation" className={$pt.LayoutHelper.classSet(css)} key={index}>
				<a href='javascript:void(0);' onClick={this.onClicked}>
					{this.renderIcon(tab.icon, this.props.size)}
					{this.renderLabel(tab.label)}
					{this.renderBadge(tab.badge)}
				</a>
				{this.canRemove(tab) ? removeButton : null}
			</li>);
		},
		/**
		 * render
		 * @returns {XML}
		 */
		render: function () {
			var css = {
				'nav': true,
				'nav-justified': this.props.justified === true,
				'nav-tabs': this.props.type === 'tab',
				'nav-pills': this.props.type === 'pill',
				'nav-direction-vertical': this.props.direction === 'vertical'
			};
			if (this.props.tabClassName) {
				css[this.props.tabClassName] = true;
			}
			return (<div className='n-tab'>
				<ul className={$pt.LayoutHelper.classSet(css)} ref='tabs'>
					{this.props.tabs.map(this.renderTab)}
				</ul>
			</div>);
		},
		/**
		 * check the given tab can be removed or not
		 * @param tab {{removable: boolean}}
		 * @returns {boolean}
		 */
		canRemove: function (tab) {
			if (tab.removable != null) {
				return tab.removable === true;
			} else {
				return this.props.removable;
			}
		},
		/**
		 * get active tab index
		 * @returns {number}
		 */
		getActiveTabIndex: function () {
			// find the active tab
			var activeTabIndex = this.props.tabs.findIndex(function (tab, index) {
				return tab.active === true;
			});
			if (activeTabIndex == -1) {
				// find the first visible tab if no active tab found
				activeTabIndex = this.props.tabs.findIndex(function (tab, index) {
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
			if (index < 0 || index >= this.props.tabs.length) {
				window.console.warn('Tab index[' + index + '] out of bound.');
			}
			this.props.tabs.forEach(function(tab, tabIndex) {
				tab.active = (tabIndex == index);
			});
			this.forceUpdate();
			return this;
		},
		/**
		 * on tab clicked
		 * @param evt
		 */
		onClicked: function (evt) {
			var newTab = $(evt.target).closest('li');
			var newTabIndex = newTab.index();
			var activeTabIndex = this.getActiveTabIndex();

			var canActive = this.props.canActive;
			if (canActive) {
				var activeTab = this.props.tabs[activeTabIndex];
				var ret = canActive.call(this, this.props.tabs[newTabIndex].value, newTabIndex, activeTab.value, activeTabIndex);
				if (ret === false) {
					$(':focus').blur();
					return;
				}
			}

			this.setActiveTabIndex(newTabIndex);

			var onActive = this.props.onActive;
			if (onActive) {
				onActive.call(this, this.props.tabs[newTabIndex].value, newTabIndex);
			}
		},
		/**
		 * on tab remove clicked
		 * @param evt
		 */
		onRemoveClicked: function (evt) {
			var selectedTab = $(evt.target).closest('li');
			selectedTab.addClass('active');
			selectedTab.parent().children('li').not(selectedTab).removeClass('active');

			var activeIndex = selectedTab.index();
			var activeTab = this.props.tabs[activeIndex];
			var activeValue = activeTab.value;

			// trigger can remove event, check it can remove or not
			var canRemove = this.props.canRemove;
			if (canRemove) {
				var ret = canRemove.call(this, activeValue, activeIndex);
				if (ret === false) {
					return;
				}
			}

			// remove tab
			this.props.tabs[activeIndex].visible = false;
			// find the visible tab
			// if tab index more than removed one, stop finding
			// or return the last visible tab which before removed tab
			var activeTabIndex = -1;
			this.props.tabs.some(function (tab, index) {
				if (tab.visible !== false) {
					activeTabIndex = index;
					return index > activeIndex;
				}
			});
			this.setActiveTabIndex(activeTabIndex);

			// trigger on remove event
			var onRemove = this.props.onRemove;
			if (onRemove) {
				onRemove.call(this, activeValue, activeIndex);
			}
		}
	});
	$pt.Components.NTab = NTab;
}(window, jQuery, React, ReactDOM, $pt));
