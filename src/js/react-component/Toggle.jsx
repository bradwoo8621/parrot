/**
 * Created by brad.wu on 8/21/2015.
 */
(function (context, $, $pt) {
	var NToggle = React.createClass($pt.defineCellComponent({
		propTypes: {
			// model
			model: React.PropTypes.object,
			// CellLayout
			layout: React.PropTypes.object
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
			// set model value to component
			this.getComponent().prop("checked", this.getValueFromModel());
			// add post change listener to handle model change
			this.addPostChangeListener(this.onModelChanged);
			this.addEnableDependencyMonitor();
			this.registerToComponentCentral();
		},
		/**
		 * did mount
		 */
		componentDidMount: function () {
			// set model value to component
			this.getComponent().prop("checked", this.getValueFromModel());
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
		 * @returns {XML}
		 */
		renderLabel: function (label, className) {
			var css = {
				'toggle-label': true,
				disabled: !this.isEnabled()
			};
			css[className] = true;
			return <span className={$pt.LayoutHelper.classSet(css)}>
            {label}
        </span>;
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
                  tabIndex='-1'
                  onClick={this.onButtonClicked.bind(this, true)}/>
            <span className='n-toggle-false'
                  tabIndex='-1'
                  onClick={this.onButtonClicked.bind(this, false)}/>
			</div>);
		},
		/**
		 * render
		 * @returns {XML}
		 */
		render: function () {
			var css = {
				'n-disabled': !this.isEnabled()
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
			if (this.isEnabled()) {
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
			return $(React.findDOMNode(this.refs.txt));
		}
	}));
	context.NToggle = NToggle;
}(this, jQuery, $pt));
