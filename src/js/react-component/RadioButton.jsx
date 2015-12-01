/**
 * radio button
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
 *          comp: string
 *      },
 *      comp: {
 *          type: $pt.ComponentConstants.Radio,
 *          direction: string,
 *          data: CodeTable,
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
	var NRadio = React.createClass($pt.defineCellComponent({
		displayName: 'NRadio',
		propTypes: {
			// model
			model: React.PropTypes.object,
			// CellLayout
			layout: React.PropTypes.object
		},
		getDefaultProps: function () {
			return {
				defaultOptions: {
					direction: 'horizontal',
					labelAtLeft: false
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
			this.addEnableDependencyMonitor();
			this.registerToComponentCentral();
		},
		/**
		 * did mount
		 */
		componentDidMount: function () {
			// add post change listener to handle model change
			this.addPostChangeListener(this.onModelChanged);
			this.addEnableDependencyMonitor();
			this.registerToComponentCentral();
		},
		/**
		 * will unmount
		 */
		componentWillUnmount: function () {
			// remove post change listener to handle model change
			this.removePostChangeListener(this.onModelChanged);
			this.removeEnableDependencyMonitor();
			this.unregisterFromComponentCentral();
		},
		/**
		 * render label
		 * @param option {{text:string}}
		 * @param labelInLeft {boolean}
		 * @returns {XML}
		 */
		renderLabel: function (option, labelInLeft) {
			var css = {
				'radio-label': true,
				disabled: !this.isEnabled(),
				'radio-label-left': labelInLeft
			};
			return (<span className={$pt.LayoutHelper.classSet(css)}
			             onClick={(this.isEnabled() && !this.isViewMode()) ? this.onButtonClicked.bind(this, option) : null}>
            	{option.text}
        	</span>);
		},
		/**
		 * render radio button, using font awesome instead
		 * @params option radio option
		 * @returns {XML}
		 */
		renderRadio: function (option) {
			var checked = this.getValueFromModel() == option.id;
			var enabled = this.isEnabled();
			var css = {
				disabled: !enabled,
				checked: checked,
				'radio-container': true
			};
			var labelAtLeft = this.isLabelAtLeft();
			return (<div className='n-radio-option'>
				{labelAtLeft ? this.renderLabel(option, true) : null}
				<div className='radio-container'>
                <span className={$pt.LayoutHelper.classSet(css)}
                      onClick={(enabled && !this.isViewMode()) ? this.onButtonClicked.bind(this, option) : null}
                      onKeyUp={(enabled && !this.isViewMode()) ? this.onKeyUp.bind(this, option): null}
                      tabIndex='0'
                      ref={'out-' + option.id}>
                    <span className='check' onClick={this.onInnerClicked.bind(this, option)}/>
                </span>
				</div>
				{labelAtLeft ? null : this.renderLabel(option, false)}
			</div>);
		},
		render: function () {
			var css = {
				'n-radio': true,
				vertical: this.getComponentOption('direction') === 'vertical',
				'n-disabled': !this.isEnabled(),
				'n-view-mode': this.isViewMode()
			};
			return (<div className={this.getComponentCSS($pt.LayoutHelper.classSet(css))}>
				{this.getComponentOption("data").map(this.renderRadio)}
				<input type="hidden" style={{display: "none"}}
				       onChange={this.onComponentChanged} value={this.getValueFromModel()}
				       ref='txt'/>
			</div>);
		},
		/**
		 * inner span clicked, force focus to outer span
		 * for fix the outer span cannot gain focus in IE11
		 * @param option
		 */
		onInnerClicked: function (option) {
			$(React.findDOMNode(this.refs['out-' + option.id])).focus();
		},
		/**
		 * on button clicked
		 * @param option
		 */
		onButtonClicked: function (option) {
			this.setValueToModel(option.id);
		},
		onKeyUp: function (option, evt) {
			if (evt.keyCode == '32') {
				this.onButtonClicked(option);
			}
		},
		/**
		 * on component change
		 * @param evt
		 */
		onComponentChanged: function (evt) {
			// synchronize value to model
			this.setValueToModel(evt.target.checked);
		},
		/**
		 * on model changed
		 * @param evt
		 */
		onModelChanged: function (evt) {
			this.getComponent().val(evt.new);
			this.forceUpdate();
		},
		/**
		 * get component
		 * @returns {jQuery}
		 */
		getComponent: function () {
			return $(React.findDOMNode(this.refs.txt));
		},
		isLabelAtLeft: function () {
			return this.getComponentOption('labelAtLeft');
		}
	}));
	context.NRadio = NRadio;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.Radio, function (model, layout, direction, viewMode) {
		return <NRadio {...$pt.LayoutHelper.transformParameters(model, layout, direction, viewMode)}/>;
	});
}(this, jQuery, $pt));
