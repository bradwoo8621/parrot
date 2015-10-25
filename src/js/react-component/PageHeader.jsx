/**
 * Page Header<br>
 */
var NPageHeader = React.createClass({
    propTypes: {
        // brand string
        brand: React.PropTypes.string.isRequired,
        brandUrl: React.PropTypes.string,
        brandFunc: React.PropTypes.func,
        // menu object
        menus: React.PropTypes.array,
        // search box properties
        search: React.PropTypes.func,
        searchPlaceholder: React.PropTypes.string
    },
    getDefaultProps: function () {
        return {
            searchPlaceholder: "Search..."
        };
    },
    /**
     * render search box
     * @returns {XML}
     */
    renderSearchBox: function () {
        return (<div className="navbar-form navbar-right" role="search">
            <div className="form-group">
                <div className="input-group">
                    <input id="nheader-search-text" type="text" className="form-control"
                           placeholder={this.props.searchPlaceholder}/>
                        <span className="input-group-btn">
                            <button className="btn btn-default" type="button" onClick={this.onSearchClicked}>
                                <Icon icon="search"/>
                            </button>
                        </span>
                </div>
            </div>
        </div>);
    },
    renderMenuItem: function (item, index, menus, onTopLevel) {
        if (item.children !== undefined) {
            // render dropdown menu
            var _this = this;
            return (
                <li className={onTopLevel ? "dropdown" : "dropdown-submenu"}>
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
            return (<li className="divider"></li>);
        } else if (item.func !== undefined) {
            // call javascript function
            return (<li>
                <a href="javascript:void(0);" onClick={this.onMenuClicked.bind(this, item.func)}>{item.text}</a>
            </li>);
        } else {
            // jump to url
            return (<li><a href={item.url}>{item.text}</a></li>);
        }
    },
    /**
     * render menus
     * @returns {XML}
     */
    renderMenus: function () {
        var _this = this;
        return (
            <ul className="nav navbar-nav">
                {this.props.menus.map(function (item, index, menu) {
                    return _this.renderMenuItem(item, index, menu, true);
                })}
            </ul>
        );
    },
    renderBrand: function () {
        if (this.props.brandUrl) {
            return <a href={this.props.brandUrl}><span className="navbar-brand">{this.props.brand}</span></a>;
        } else if (this.props.brandFunc) {
            return (<a href="javascript:void(0);" onClick={this.onBrandClicked}>
                <span className="navbar-brand">{this.props.brand}</span>
            </a>);
        } else {
            return <span className="navbar-brand">{this.props.brand}</span>;
        }
    },
    /**
     * on brand clicked
     * @param func
     */
    onBrandClicked: function () {
        this.props.brandFunc();
    },
    /**
     * on menu clicked
     * @param func
     */
    onMenuClicked: function (func) {
        func();
    },
    /**
     * on search clicked
     */
    onSearchClicked: function () {
        var value = $("#nheader-search-text").val();
        if (value == null || value.length == 0) {
            // do nothing
            return;
        }
        this.props.search(value);
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
                        {this.renderMenus()}
                        {this.props.search ? this.renderSearchBox() : null}
                    </div>
                </div>
            </nav>
        );
    }
});