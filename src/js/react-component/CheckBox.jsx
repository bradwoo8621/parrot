(function (window, $, React, ReactDOM, $pt) {
	var NCheck = React.createClass($pt.defineCellComponent({
		displayName: 'NCheck',
		/**
		 * render label
		 * @param labelInLeft {boolean}
		 * @returns {XML}
		 */
		renderLabel: function (labelInLeft) {
			if (this.isLabelAttached()) {
				var label = this.getLayout().getLabel();
				if (label == null || label.isEmpty()) {
					return null;
				}
				var enabled = this.isEnabled();
				var css = {
					'check-label': true,
					disabled: !this.isEnabled(),
					'check-label-left': labelInLeft
				};
				return (<span className={$pt.LayoutHelper.classSet(css)}
				             onClick={(enabled && !this.isViewMode()) ? this.onButtonClicked : null}>
                	{this.getLayout().getLabel()}
            	</span>);
			}
			return null;
		},
		/**
		 * render check box, using font awesome instead
		 * @returns {XML}
		 */
		renderCheckbox: function () {
			var checked = this.isChecked();
			var enabled = this.isEnabled();
			var css = {
				disabled: !enabled,
				checked: checked,
				'check-container': true
			};
			return (<div className='check-container'>
	            <span className={$pt.LayoutHelper.classSet(css)}
	                  onClick={(enabled && !this.isViewMode()) ? this.onButtonClicked : null}
	                  onKeyUp={(enabled && !this.isViewMode()) ? this.onKeyUp: null}
	                  tabIndex='0'
	                  ref='out'>
	            	<span className='check' onClick={this.onInnerClicked}/>
	        	</span>
			</div>);
		},
		/**
		 * render
		 * @returns {XML}
		 */
		render: function () {
			var css = {
				'n-disabled': !this.isEnabled(),
				'n-view-mode': this.isViewMode()
			};
			css[this.getComponentCSS('n-checkbox')] = true;
			var isLabelAtLeft = this.isLabelAtLeft();
			// <input type="checkbox" style={{display: "none"}}
			// 	   onChange={this.onComponentChanged} ref='txt'/>
			return (<div className={$pt.LayoutHelper.classSet(css)}>
				{isLabelAtLeft ? this.renderLabel(true) : null}
				{this.renderCheckbox()}
				{!isLabelAtLeft ? this.renderLabel(false) : null}
			</div>);
		},
		/**
		 * inner span clicked, force focus to outer span
		 * for fix the outer span cannot gain focus in IE11
		 */
		onInnerClicked: function () {
			$(ReactDOM.findDOMNode(this.refs.out)).focus();
		},
		/**
		 * handle button clicked event
		 */
		onButtonClicked: function () {
			this.setValueToModel(!this.isChecked());
		},
		onKeyUp: function (evt) {
			if (evt.keyCode == '32') {
				this.onButtonClicked();
			}
		},
		/**
		 * is checked or not
		 * @returns {boolean}
		 */
		isChecked: function () {
			return this.getValueFromModel() === true;
		},
		/**
		 * is label attached
		 * @returns {boolean}
		 */
		isLabelAttached: function () {
			return this.getComponentOption('labelAttached') !== null;
		},
		/**
		 * get component
		 * @returns {jQuery}
		 */
		// getComponent: function () {
		// 	return $(ReactDOM.findDOMNode(this.refs.txt));
		// },
		isLabelAtLeft: function () {
			return this.getComponentOption('labelAttached') === 'left';
		}
	}));
	$pt.Components.NCheck = NCheck;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.Check, function (model, layout, direction, viewMode) {
		return <$pt.Components.NCheck {...$pt.LayoutHelper.transformParameters(model, layout, direction, viewMode)}/>;
	});
}(window, jQuery, React, ReactDOM, $pt));
