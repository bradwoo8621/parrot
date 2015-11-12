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
 *          type: $pt.ComponentConstants.TextArea,
 *          placeholder: string,
 *          lines: number,
 *          enabled: {
 *              when: function,
 *              depends: string|string[]
 *          },
 *          visible: {
 *              when: function,
 *              depends: string|string[]
 *          }
 *      }
 * }
 */
(function (context, $, $pt) {
	var NTextArea = React.createClass($pt.defineCellComponent({
		propTypes: {
			// model
			model: React.PropTypes.object,
			// CellLayout
			layout: React.PropTypes.object
		},
		getDefaultProps: function () {
			return {
				defaultOptions: {
					lines: 1
				}
			};
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
			this.unregisterFromComponentCentral();
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
			this.registerToComponentCentral();
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
			this.registerToComponentCentral();
		},
		/**
		 * will unmount
		 */
		componentWillUnmount: function () {
			// remove post change listener to handle model change
			this.removePostChangeListener(this.onModelChanged);
			this.removeEnableDependencyMonitor();
			this.getComponent().off('change', this.onComponentChanged);
			this.unregisterFromComponentCentral();
		},
		/**
		 * render text
		 * @returns {XML}
		 */
		renderText: function () {
			var css = {
				'form-control': true
			};
			css['l' + this.getComponentOption('lines')] = true;
			return (<textarea className={$pt.LayoutHelper.classSet(css)}
			                  disabled={!this.isEnabled()}
			                  placeholder={this.getComponentOption('placeholder')}

			                  onKeyPress={this.onComponentChanged}
			                  onChange={this.onComponentChanged}
			                  onFocus={this.onComponentFocused}
			                  onBlur={this.onComponentBlurred}

			                  ref='txt'/>);
		},
		/**
		 * render
		 * @returns {XML}
		 */
		render: function () {
			var css = {
				'n-disabled': !this.isEnabled()
			};
			css[this.getComponentCSS('n-textarea')] = true;
			return (<div className={$pt.LayoutHelper.classSet(css)}>
				{this.renderText()}
				{this.renderNormalLine()}
				{this.renderFocusLine()}
			</div>);
		},
		onComponentFocused: function () {
			$(React.findDOMNode(this.refs.focusLine)).toggleClass('focus');
			$(React.findDOMNode(this.refs.normalLine)).toggleClass('focus');
		},
		onComponentBlurred: function () {
			$(React.findDOMNode(this.refs.focusLine)).toggleClass('focus');
			$(React.findDOMNode(this.refs.normalLine)).toggleClass('focus');
		},
		/**
		 * on component change
		 * @param evt
		 */
		onComponentChanged: function (evt) {
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
			this.getComponent().val(evt.new);
		},
		/**
		 * on addon clicked
		 * @param userDefinedClickFunc
		 */
		onAddonClicked: function (userDefinedClickFunc) {
			if (userDefinedClickFunc) {
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
		}
	}));
	context.NTextArea = NTextArea;
}(this, jQuery, $pt));
