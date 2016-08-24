(function (window, $, React, ReactDOM, $pt) {
	var NRadio = React.createClass($pt.defineCellComponent({
		displayName: 'NRadio',
		getDefaultProps: function () {
			return {
				defaultOptions: {
					direction: 'horizontal',
					labelAtLeft: false
				}
			};
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
		renderRadio: function (option, optionIndex) {
			var checked = this.getValueFromModel() == option.id;
			var enabled = this.isEnabled();
			var css = {
				disabled: !enabled,
				checked: checked,
				'radio-container': true
			};
			var labelAtLeft = this.isLabelAtLeft();
			return (<div className='n-radio-option' key={optionIndex}>
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
			return (<$pt.Components.NCodeTableWrapper codetable={this.getCodeTable()}
								className={$pt.LayoutHelper.classSet(css)}
								model={this.getModel()}
								layout={this.getLayout()}
								renderer={this.getRealRenderer} />);
		},
		getRealRenderer: function() {
			var css = {
				'n-radio': true,
				vertical: this.getComponentOption('direction') === 'vertical',
				'n-disabled': !this.isEnabled(),
				'n-view-mode': this.isViewMode()
			};
			return (<div className={this.getComponentCSS($pt.LayoutHelper.classSet(css))}>
				{this.getCodeTable().map(this.renderRadio)}
			</div>);
		},
		getCodeTable: function() {
			return this.getComponentOption("data");
		},
		/**
		 * inner span clicked, force focus to outer span
		 * for fix the outer span cannot gain focus in IE11
		 * @param option
		 */
		onInnerClicked: function (option) {
			$(ReactDOM.findDOMNode(this.refs['out-' + option.id])).focus();
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
		isLabelAtLeft: function () {
			return this.getComponentOption('labelAtLeft');
		}
	}));
	$pt.Components.NRadio = NRadio;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.Radio, function (model, layout, direction, viewMode) {
		return <$pt.Components.NRadio {...$pt.LayoutHelper.transformParameters(model, layout, direction, viewMode)}/>;
	});
}(window, jQuery, React, ReactDOM, $pt));
