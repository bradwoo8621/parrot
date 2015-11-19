/**
 * normal tab
 */
(function (context, $, $pt) {
	var NTab = React.createClass({
		propTypes: {
			type: React.PropTypes.oneOf(['tab', 'pill']),
			justified: React.PropTypes.bool,
			direction: React.PropTypes.oneOf(['vertical', 'horizontal']),
			size: React.PropTypes.oneOf(["lg", "2x", "3x", "4x", "5x"]),
			removable: React.PropTypes.bool,
			canActive: React.PropTypes.func,
			onActive: React.PropTypes.func,
			canRemove: React.PropTypes.func,
			onRemove: React.PropTypes.func,
			tabClassName: React.PropTypes.string,

			tabs: React.PropTypes.arrayOf(React.PropTypes.shape({
				label: React.PropTypes.string,
				icon: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element]),
				active: React.PropTypes.bool,
				value: React.PropTypes.any,
				badge: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.number]),
				innerId: React.PropTypes.string,
				removable: React.PropTypes.bool,
				className: React.PropTypes.string
			}))
		},
		getDefaultProps: function () {
			return {
				type: 'tab',
				justified: false,
				removable: false
			};
		},
		getInitialState: function () {
			return {
				activeTabIndex: null
			};
		},
		componentDidMount: function () {
			var activeTabIndex = this.getActiveTabIndex();
			this.props.tabs.map(function (tab, index) {
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
			var css = $pt.LayoutHelper.classSet({
				active: index == this.getActiveTabIndex(),
				hide: tab.visible === false
			});
			var removeButton = (
				<a href='javascript:void(0);' className='n-tab-delete'
				   onClick={this.onRemoveClicked}>
					<span className='fa fa-fw fa-times'/>
				</a>);
			return (<li role="presentation" className={css}>
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
			if (this.state.activeTabIndex != null) {
				return this.state.activeTabIndex;
			}
			var activeTabIndex = 0;
			this.props.tabs.forEach(function (tab, index) {
				if (tab.active === true) {
					activeTabIndex = index;
				}
			});
			this.state.activeTabIndex = activeTabIndex;
			return this.state.activeTabIndex;
		},
		/**
		 * set active tab index
		 * @param {number}
		 */
		setActiveTabIndex: function(index) {
			if (index < 0) {
				index = 0;
			} else if (index >= this.props.tabs.length) {
				index = this.props.tabs.length - 1;
			}
			if (index < 0) {
				throw $pt.createComponentException($pt.ComponentConstants.Err_Tab_Index_Out_Of_Bound, 'Tab index[' + index + '] out of bound.');
			}
			this.setState({activeTabIndex: index});
			return this;
		},
		/**
		 * on tab clicked
		 * @param evt
		 */
		onClicked: function (evt) {
			var newTab = $(evt.target).closest('li');
			var newTabIndex = newTab.index();

			var canActive = this.props.canActive;
			if (canActive) {
				var activeTab = this.props.tabs[this.state.activeTabIndex];
				var ret = canActive.call(this, this.props.tabs[newTabIndex].value, newTabIndex, activeTab.value, this.state.activeTabIndex);
				if (ret === false) {
					$(':focus').blur();
					return;
				}
			}

			newTab.addClass('active');
			newTab.parent().children('li').not(newTab).removeClass('active');
			this.state.activeTabIndex = newTabIndex;

			var activeInnerId = this.props.tabs[this.state.activeTabIndex].innerId;
			this.props.tabs.map(function (tab) {
				if (tab.innerId == activeInnerId) {
					$('#' + tab.innerId).show();
				} else {
					$('#' + tab.innerId).hide();
				}
			});
			var onActive = this.props.onActive;
			if (onActive) {
				onActive.call(this, this.props.tabs[this.state.activeTabIndex].value, this.state.activeTabIndex);
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

			// check it can remove or not
			var canRemove = this.props.canRemove;
			if (canRemove) {
				var ret = canRemove.call(this, activeValue, activeIndex);
				if (ret === false) {
					return;
				}
			}

			// remove tab
			this.props.tabs[activeIndex].visible = false;
			var _this = this;
			// find the visible tab
			// if tab index more than removed one, stop finding
			// or return the last visible tab which before removed tab
			this.props.tabs.some(function (tab, index) {
				if (tab.visible !== false) {
					_this.state.activeTabIndex = index;
					return index > activeIndex;
				}
			});

			this.forceUpdate(function () {
				var onRemove = _this.props.onRemove;
				if (onRemove) {
					onRemove.call(_this, activeValue, activeIndex);
				}
			});
		}
	});
	context.NTab = NTab;
}(this, jQuery, $pt));
