/**
 * Page Header<br>
 */
(function (window, $, React, ReactDOM, $pt) {
	var NPageHeader = React.createClass({
		displayName: 'NPageHeader',
		statics: {
			SEARCH_PLACEHOLDER: 'Search...'
		},
		propTypes: {
			// brand string
			brand: React.PropTypes.oneOfType([React.PropTypes.object, React.PropTypes.string]).isRequired,
			brandUrl: React.PropTypes.string,
			brandFunc: React.PropTypes.func,
			// menu object
			menus: React.PropTypes.array,
			side: React.PropTypes.bool,
			// search box properties
			search: React.PropTypes.func
		},
		getDefaultProps: function () {
			return {
				side: false
			};
		},
		/**
		 * get initial state
		 * @returns {*}
		 */
		getInitialState: function () {
			return {
				model: $pt.createModel({
					text: null
				})
			};
		},
		/**
		 * render search box
		 * @returns {XML}
		 */
		renderSearchBox: function () {
			var layout = $pt.createCellLayout('text', {
				comp: {
					placeholder: NPageHeader.SEARCH_PLACEHOLDER,
					rightAddon: {
						icon: 'search',
						click: this.onSearchClicked
					}
				}
			});

			return (<div className="navbar-form navbar-right" role="search">
				<$pt.Components.NText model={this.state.model} layout={layout}/>
			</div>);
		},
		renderMenuItem: function (item, index, menus, onTopLevel) {
			if (item.children !== undefined) {
				// render dropdown menu
				var _this = this;
				return (
					<li className={onTopLevel ? "dropdown" : "dropdown-submenu"} key={index}>
						<a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button"
						   aria-expanded="false">
							{item.text} {onTopLevel ? <span className="caret"></span> : null}
						</a>
						<ul className="dropdown-menu" role="menu">
							{item.children.map(function (childItem, childIndex, dropdownItems) {
								return _this.renderMenuItem(childItem, childIndex, dropdownItems, false);
							})}
						</ul>
					</li>
				);
			} else if (item.divider === true) {
				// render divider
				return (<li className="divider" key={index}></li>);
			} else if (item.func !== undefined) {
				// call javascript function
				return (<li>
					<a href="javascript:void(0);" onClick={this.onMenuClicked.bind(this, item.func)} key={index}>{item.text}</a>
				</li>);
			} else {
				// jump to url
				return (<li key={index}><a href={item.url}>{item.text}</a></li>);
			}
		},
		/**
		 * render menus
		 * @returns {XML}
		 */
		renderMenus: function () {
			var _this = this;
			if (this.props.side) {
				this.state.sideMenu = NSideMenu.getSideMenu(this.props.menus, null, null, true);
			}
			var css = {
				'nav navbar-nav': true
			};
			if (this.props.side) {
				css['nav-side'] = true;
			}
			return (
				<ul className={$pt.LayoutHelper.classSet(css)}>
					{this.props.menus.map(function (item, index, menu) {
						return _this.renderMenuItem(item, index, menu, true);
					})}
				</ul>
			);
		},
		renderBrand: function () {
			if (this.props.brandUrl) {
				return <a href={this.props.brandUrl}><span className="navbar-brand">{this.props.brand}</span></a>;
			} else if (this.props.brandFunc || this.props.side) {
				return (<a href="javascript:void(0);"
				           onMouseEnter={this.onBrandMouseEnter}
				           onMouseLeave={this.onBrandMouseLeave}
				           onClick={this.onBrandClicked}>
					<span className="navbar-brand">{this.props.brand}</span>
				</a>);
			} else {
				return <span className="navbar-brand">{this.props.brand}</span>;
			}
		},
		onBrandMouseEnter: function () {
			if (this.props.side) {
				if (this.state.sideMenu) {
					this.state.sideMenu.show();
				}
			}
		},
		onBrandMouseLeave: function () {
			if (this.props.side) {
				if (this.state.sideMenu) {
					this.state.sideMenu.willHide();
				}
			}
		},
		/**
		 * on brand clicked
		 */
		onBrandClicked: function () {
			if (this.props.brandFunc) {
				this.props.brandFunc.call(this);
			}
		},
		/**
		 * on menu clicked
		 * @param func
		 */
		onMenuClicked: function (func) {
			func.call(this);
		},
		/**
		 * on search clicked
		 */
		onSearchClicked: function () {
			this.props.search.call(this, this.state.model.get('text'));
		},
		/**
		 * render component
		 * @returns {XML}
		 */
		render: function () {
			return (
				<nav className="navbar navbar-default navbar-fixed-top">
					<div className="container-fluid">
						<div className="navbar-header">
							<button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
							        data-target="#navbar-1">
								<span className="sr-only">Toggle navigation</span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
								<span className="icon-bar"></span>
							</button>
							{this.renderBrand()}
						</div>
						<div className="collapse navbar-collapse" id="navbar-1">
							{this.props.menus ? this.renderMenus() : null}
							{this.props.search ? this.renderSearchBox() : null}
							{this.props.custom ? this.props.custom.call(this) : null}
						</div>
					</div>
				</nav>
			);
		}
	});
	$pt.Components.NPageHeader = NPageHeader;
}(window, jQuery, React, ReactDOM, $pt));
