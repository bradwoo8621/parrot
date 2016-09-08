/**
 * Created by brad.wu on 8/21/2015.
 */
(function (window, $, React, ReactDOM, $pt) {
	var NToggle = React.createClass($pt.defineCellComponent({
		displayName: 'NToggle',
		beforeDidUpdate: function (prevProps, prevState) {
			// set model value to component
			this.getComponent().prop("checked", this.getValueFromModel());
		},
		beforeDidMount: function () {
			// set model value to component
			this.getComponent().prop("checked", this.getValueFromModel());
		},
		/**
		 * render label
		 * @returns {XML}
		 */
		renderLabel: function (label, className) {
			var css = {
				'toggle-label': true,
				disabled: !this.isEnabled()
			};
			css[className] = true;
			return (<span className={$pt.LayoutHelper.classSet(css)}>
	            {label}
	        </span>);
		},
		renderLeftLabel: function () {
			var labelAttached = this.getComponentOption('labelAttached');
			if (labelAttached && labelAttached.left) {
				return this.renderLabel(labelAttached.left, 'toggle-label-left');
			}
		},
		renderRightLabel: function () {
			var labelAttached = this.getComponentOption('labelAttached');
			if (labelAttached && labelAttached.right) {
				return this.renderLabel(labelAttached.right, 'toggle-label-right');
			}
		},
		/**
		 * render check box, using font awesome instead
		 * @returns {XML}
		 */
		renderToggleButton: function () {
			var checked = this.isChecked();
			var css = {
				disabled: !this.isEnabled(),
				checked: checked,
				unchecked: !checked,
				'toggle-container': true
			};
			return (<div className={$pt.LayoutHelper.classSet(css)}>
				<span className='n-toggle-line'/>
            <span className='n-toggle-true'
                  tabIndex={this.isEnabled() ? '-1' : null}
                  onClick={this.onButtonClicked.bind(this, true)}/>
            <span className='n-toggle-false'
                  tabIndex={this.isEnabled() ? '-1' : null}
                  onClick={this.onButtonClicked.bind(this, false)}/>
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
			css[this.getComponentCSS('n-toggle')] = true;

			return (<div className={$pt.LayoutHelper.classSet(css)}>
				<input type="checkbox" style={{display: "none"}}
				       onChange={this.onComponentChanged} ref='txt'/>
				{this.renderLeftLabel()}
				{this.renderToggleButton()}
				{this.renderRightLabel()}
			</div>);
		},
		/**
		 * handle button clicked event
		 */
		onButtonClicked: function (value) {
			if (this.isEnabled() && !this.isViewMode()) {
				this.setValueToModel(value);
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
		 * on model change
		 * @param evt
		 */
		onModelChanged: function (evt) {
			this.getComponent().prop("checked", evt.new === true);
			this.forceUpdate();
		},
		/**
		 * is checked or not
		 * @returns {boolean}
		 */
		isChecked: function () {
			return this.getValueFromModel() === true;
		},
		/**
		 * get component
		 * @returns {jQuery}
		 */
		getComponent: function () {
			return $(ReactDOM.findDOMNode(this.refs.txt));
		}
	}));
	$pt.Components.NToggle = NToggle;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.Toggle, function (model, layout, direction, viewMode) {
		return <$pt.Components.NToggle {...$pt.LayoutHelper.transformParameters(model, layout, direction, viewMode)}/>;
	});
}(window, jQuery, React, ReactDOM, $pt));
