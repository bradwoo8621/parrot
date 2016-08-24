(function (window, $, React, ReactDOM, $pt) {
	var NSideMenu = React.createClass({
		displayName: 'NSideMenu',
		statics: {
			/**
			 * get side menu
			 * @param menus
			 * @param containerId optional, default is 'side_menu_container'
			 * @param className
			 * @param hover
			 * @returns {react element}
			 */
			getSideMenu: function (menus, containerId, className, hover) {
				if (!containerId) {
					containerId = "side_menu_container";
				}
				if ($pt.sideMenu == null) {
					$pt.sideMenu = {};
				}
				if ($pt.sideMenu[containerId] == null) {
					// must initial here. since the function will execute immediately after load,
					// and NExceptionModal doesn't defined in that time
					var sideMenuContainer = $("#" + containerId);
					if (sideMenuContainer.length == 0) {
						$("<div id='" + containerId + "' />").appendTo($(document.body));
					}
					$pt.sideMenu[containerId] = ReactDOM.render(
						<$pt.Components.NSideMenu menus={menus}
						           className={className}
						           hover={hover ? true : false}/>,
						document.getElementById(containerId));
				}
				return $pt.sideMenu[containerId];
			}
		},
		getDefaultProps: function () {
			return {
				hover: false
			};
		},
		getInitialState: function () {
			return {};
		},
		componentDidMount: function () {
			$(ReactDOM.findDOMNode(this.refs.menus)).hide();
		},
		renderMenuItem: function (item, index, menus, onTopLevel) {
			if (item.children !== undefined) {
				// render dropdown menu
				var _this = this;
				var id = 'item_' + index;
				return (<li ref={id} key={index}>
					<a href="javascript:void(0);"
					   onClick={this.onParentMenuClicked.bind(this, id)} ref={id + '_link'}>
						{item.text}
						<span className='fa fa-fw fa-angle-double-down n-side-menu-ul' ref={id + '_icon'}/>
					</a>
					<ul ref={id + '_child'} style={{display: 'none'}}>
						{item.children.map(function (childItem, childIndex, dropdownItems) {
							return _this.renderMenuItem(childItem, index + '_' + childIndex, dropdownItems, false);
						})}
					</ul>
				</li>);
			} else if (item.func !== undefined) {
				// call javascript function
				return (<li key={index}>
					<a href="javascript:void(0);"
					   onClick={this.onMenuClicked.bind(this, item.func, item.value)}>{item.text}</a>
				</li>);
			} else if (item.divider === true) {
				return null;
			} else {
				// jump to url
				return (<li key={index}><a href={item.url}>{item.text}</a></li>);
			}
		},
		render: function () {
			var _this = this;
			return (<div className="n-side-menu" ref='menus'
			             onMouseEnter={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
				<ul className="nav navbar-nav">
					{this.props.menus.map(function (item, index, menu) {
						return _this.renderMenuItem(item, index, menu, true);
					})}
					<li className="n-side-menu-close">
						<a href='javascript:void(0);' onClick={this.onCloseClicked}>
							<span className='fa fa-fw fa-arrow-circle-left'/>
						</a>
					</li>
				</ul>
			</div>);
		},
		onMouseEnter: function () {
			if (this.props.hover) {
				this.show();
			}
		},
		onMouseLeave: function () {
			if (this.props.hover) {
				this.willHide();
			}
		},
		/**
		 * on menu clicked
		 * @param func
		 * @param value
		 */
		onMenuClicked: function (func, value) {
			func.call(this, value);
		},
		onParentMenuClicked: function (id) {
			$(ReactDOM.findDOMNode(this.refs[id + '_link'])).blur();
			var ul = $(ReactDOM.findDOMNode(this.refs[id + '_child']));
			ul.toggle('fade', function () {
				// if close, then close all sub menus
				if (ul.not(':visible')) {
					ul.find('ul').hide();
				}
			});
			$(ReactDOM.findDOMNode(this.refs[id + '_icon'])).toggleClass('fa-angle-double-down fa-angle-double-up');

			this.collapseMenus(id);
		},
		/**
		 * collapse menus
		 * @param id {string} menu id which keep expanding
		 */
		collapseMenus: function (id) {
			var _this = this;
			Object.keys(this.refs).forEach(function (key) {
				if (key.endsWith('_link')) {
					var linkId = key.substr(0, key.length - 5);
					if (!id || !id.startsWith(linkId)) {
						var ul = $(ReactDOM.findDOMNode(_this.refs[linkId + '_child']));
						ul.hide('fade', function () {
							ul.find('ul').hide();
						});
					}
				}
			});
			$(ReactDOM.findDOMNode(this.refs[id + '_icon'])).toggleClass('fa-angle-double-down fa-angle-double-up');
		},
		/**
		 * on close button clicked
		 */
		onCloseClicked: function () {
			this.hide();
		},
		/**
		 * show side menu
		 */
		show: function () {
			if (this.state.willHide) {
				clearTimeout(this.state.willHide);
				this.state.willHide = null;
			}
			$(ReactDOM.findDOMNode(this.refs.menus)).show('fade');
		},
		/**
		 * hide side menu
		 */
		hide: function () {
			var _this = this;
			$(ReactDOM.findDOMNode(this.refs.menus)).hide('fade', function () {
				_this.collapseMenus();
			});
		},
		willHide: function () {
			var _this = this;
			this.state.willHide = setTimeout(function () {
				_this.hide();
			}, 300);
		}
	});
	$pt.Components.NSideMenu = NSideMenu;
}(window, jQuery, React, ReactDOM, $pt));
