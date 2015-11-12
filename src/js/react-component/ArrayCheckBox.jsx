(function (context, $, $pt) {
	var NArrayCheck = React.createClass($pt.defineCellComponent({
		statics: {
		},
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
					labelAttached: 'right'
				}
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
		renderItem: function(enabled, item) {
			var model = $pt.createModel({
				id: item.id,
				checked: this.isCodeChecked(item)
			});
			var layout = $pt.createCellLayout('checked', {
				label: item.text,
				comp: {
					labelAttached: this.getComponentOption('labelAttached'),
					enabled: enabled
				}
			});
			model.addPostChangeListener('checked', this.onCodeItemCheckedChanged.bind(this, item));
			return <NCheck model={model} layout={layout} />;
		},
		render: function() {
			var enabled = this.isEnabled();
			var css = {
				'n-disabled': !enabled,
				vertical: this.getComponentOption('direction') === 'vertical'
			};
			css[this.getComponentCSS('n-array-check')] = true;
			return (<div className={$pt.LayoutHelper.classSet(css)}>
				{this.getCodeTable().list().map(this.renderItem.bind(this, enabled))}
			</div>);
		},
		onModelChanged: function() {
			this.forceUpdate();
		},
		onCodeItemCheckedChanged: function(codeTableItem, evt) {
			if (evt.new) {
				// checked
				this.onCodeItemChecked(codeTableItem);
			} else {
				// unchecked
				this.onCodeTableUnchecked(codeTableItem);
			}
		},
		onCodeTableUnchecked: function(codeTableItem) {
			var values = this.getValueFromModel();
			if (values == null) {
				return;
			}
			this.setValueToModel(values.filter(function(value) {
				return value != codeTableItem.id;
			}).slice(0));
		},
		onCodeItemChecked: function(codeTableItem) {
			// checked
			var values = this.getValueFromModel();
			if (values == null) {
				values = [codeTableItem.id];
			} else {
				var index = values.findIndex(function(value) {
					return value == codeTableItem.id;
				});
				if (index == -1) {
					values.push(codeTableItem.id);
				}
			}
			this.setValueToModel(values.slice(0));
		},
		getCodeTable: function() {
			return this.getComponentOption('data');
		},
		isCodeChecked: function(codeTableItem) {
			var values = this.getValueFromModel();
			return values != null && values.some(function(value) {
				return value == codeTableItem.id;
			});
		}
	}));
	context.NArrayCheck = NArrayCheck;
}(this, jQuery, $pt));
