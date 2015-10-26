/**
 * text input
 * onKeyUp listener makes sure the keyboard operation monitored.
 * and change listener makes sure the mouse operation monitored on blur.
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
 *      css: {
 *          cell: string,
 *          comp: string,
 *          'normal-line': string,
 *          'focus-line': string
 *      },
 *      comp: {
 *          type: $pt.ComponentConstants.Text,
 *          pwd: boolean,
 *          placeholder: string,
 *          enabled: {
 *              when: function,
 *              depends: string|string[]
 *          },
 *          visible: {
 *              when: function,
 *              depends: string|string[]
 *          },
 *          leftAddon: {
 *              text: string,
 *              icon: string,
 *              iconFirst: boolean,
 *              click: function
 *          },
 *          rightAddon: {
 *              text: string,
 *              icon: string,
 *              iconFirst: boolean,
 *              click: function
 *          }
 *      }
 * }
 */
var NText = React.createClass($pt.defineCellComponent({
	propTypes: {
		// model
		model: React.PropTypes.object,
		// CellLayout
		layout: React.PropTypes.object
	},
	getDefaultProps: function () {
		return {
			defaultOptions: {}
		};
	},
	getInitialState: function () {
		return {};
	},
	/**
	 * will update
	 * @param nextProps
	 */
	componentWillUpdate: function (nextProps) {
		// remove post change listener to handle model change
		this.removePostChangeListener(this.onModelChanged);
		this.removeEnableDependencyMonitor();
		this.getComponent().off('change', this.onComponentChanged);
	},
	/**
	 * did update
	 * @param prevProps
	 * @param prevState
	 */
	componentDidUpdate: function (prevProps, prevState) {
		if (this.getComponent().val() != this.getValueFromModel()) {
			this.getComponent().val(this.getValueFromModel());
		}
		// add post change listener to handle model change
		this.addPostChangeListener(this.onModelChanged);
		this.addEnableDependencyMonitor();
		this.getComponent().on('change', this.onComponentChanged);
	},
	/**
	 * did mount
	 */
	componentDidMount: function () {
		// set model value to component
		this.getComponent().val(this.getValueFromModel());
		// add post change listener to handle model change
		this.addPostChangeListener(this.onModelChanged);
		this.addEnableDependencyMonitor();
		this.getComponent().on('change', this.onComponentChanged);
	},
	/**
	 * will unmount
	 */
	componentWillUnmount: function () {
		// remove post change listener to handle model change
		this.removePostChangeListener(this.onModelChanged);
		this.removeEnableDependencyMonitor();
		this.getComponent().off('change', this.onComponentChanged);
	},
	/**
	 * render left add-on
	 * @returns {XML}
	 */
	renderLeftAddon: function () {
		return this.renderAddon(this.getComponentOption('leftAddon'));
	},
	/**
	 * render text
	 * @returns {XML}
	 */
	renderText: function () {
		// TODO needs to handle the control keys
		return (<input type={this.getComponentOption('pwd', false) ? 'password' : 'text'}
		               className='form-control'
		               disabled={!this.isEnabled()}
		               placeholder={this.getComponentOption('placeholder')}

		               onKeyPress={this.onComponentChanged}
		               onChange={this.onComponentChanged}
		               onFocus={this.onComponentFocused}
		               onBlur={this.onComponentBlurred}
		               onKeyUp={this.onKeyUp}

		               ref='txt'/>);
	},
	/**
	 * render right add-on
	 * @returns {XML}
	 */
	renderRightAddon: function () {
		return this.renderAddon(this.getComponentOption('rightAddon'));
	},
	/**
	 * render add-on
	 * @param addon {{
	 *              icon: string,
	 *              text: string,
	 *              iconFirst: boolean,
	 *              click: function(model: object, value: object)
	 *              }}
	 * @returns {XML}
	 */
	renderAddon: function (addon) {
		if (addon == null) {
			return null;
		}

		var spanCss = {
			'input-group-addon': true,
			link: addon.click != null,
			disabled: !this.isEnabled()
		};

		var iconCss = {
			fa: true,
			'fa-fw': true
		};
		var icon = addon.icon;
		if (icon != null) {
			iconCss['fa-' + icon] = true;
		}
		var iconPart = icon == null ? null : (<span className={$pt.LayoutHelper.classSet(iconCss)}/>);
		var textPart = addon.text;
		var innerParts = addon.iconFirst === false ? [textPart, iconPart] : [iconPart, textPart];
		return (<span className={$pt.LayoutHelper.classSet(spanCss)}
		              onClick={this.onAddonClicked.bind(this, addon.click)}>
			{innerParts.map(function (part) {
				return part;
			})}
		</span>);
	},
	/**
	 * render
	 * @returns {XML}
	 */
	render: function () {
		var css = {
			'n-disabled': !this.isEnabled()
		};
		css[this.getComponentCSS('n-text')] = true;
		return (<div className={$pt.LayoutHelper.classSet(css)}>
			<div className='input-group'>
				{this.renderLeftAddon()}
				{this.renderText()}
				{this.renderRightAddon()}
			</div>
			{this.renderNormalLine()}
			{this.renderFocusLine()}
		</div>);
	},
	onComponentFocused: function () {
		$(React.findDOMNode(this.refs.focusLine)).toggleClass('focus');
		$(React.findDOMNode(this.refs.normalLine)).toggleClass('focus');
	},
	onComponentBlurred: function (evt) {
		$(React.findDOMNode(this.refs.focusLine)).toggleClass('focus');
		$(React.findDOMNode(this.refs.normalLine)).toggleClass('focus');

		if (this.state.componentChanged) {
			clearTimeout(this.state.componentChanged);
		}
		this.setValueToModel(evt.target.value);
	},
	/**
	 * on component change
	 * @param evt
	 */
	onComponentChanged: function (evt) {
		console.debug('Text component changed[modelValue=' + this.getValueFromModel() + ', compValue=' + evt.target.value + '].');
		this.setValueToModel(evt.target.value);
	},
	/**
	 * on model change
	 * @param evt
	 */
	onModelChanged: function (evt) {
		var value = evt.new;
		if (value == this.getComponent().val()) {
			return;
		}
		console.debug('Text model changed[modelValue=' + evt.new + ', compValue=' + this.getComponent().val() + '].');
		this.getComponent().val(evt.new);
	},
	onKeyUp: function (evt) {
		var monitor = this.getEventMonitor('keyUp');
		if (monitor) {
			monitor.call(evt.target, evt);
		}
	},
	/**
	 * on addon clicked
	 * @param userDefinedClickFunc
	 */
	onAddonClicked: function (userDefinedClickFunc) {
		if (this.isAddonClickable(userDefinedClickFunc)) {
			userDefinedClickFunc.call(this, this.getModel(), this.getValueFromModel());
		}
	},
	/**
	 * get component
	 * @returns {jQuery}
	 * @override
	 */
	getComponent: function () {
		return $(React.findDOMNode(this.refs.txt));
	},
	/**
	 * is add-on clickable
	 * @param userDefinedClickFunc
	 * @returns {*}
	 */
	isAddonClickable: function (userDefinedClickFunc) {
		return this.isEnabled() && userDefinedClickFunc;
	}
}));