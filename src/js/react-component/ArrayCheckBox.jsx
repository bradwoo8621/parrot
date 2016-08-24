(function (window, $, React, ReactDOM, $pt) {
	var NArrayCheck = React.createClass($pt.defineCellComponent({
		displayName: 'NArrayCheck',
		getDefaultProps: function () {
			return {
				defaultOptions: {
					direction: 'horizontal',
					labelAttached: 'right'
				}
			};
		},
		renderItem: function(enabled, item, itemIndex) {
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
			return <$pt.Components.NCheck model={model} layout={layout} key={itemIndex} view={this.isViewMode()}/>;
		},
		render: function() {
			var enabled = this.isEnabled();
			var css = {
				'n-disabled': !enabled,
				vertical: this.getComponentOption('direction') === 'vertical'
			};
			css[this.getComponentCSS('n-array-check')] = true;
			return (<$pt.Components.NCodeTableWrapper codetable={this.getCodeTable()}
								className={$pt.LayoutHelper.classSet(css)}
								model={this.getModel()}
								layout={this.getLayout()}
								renderer={this.getRealRenderer} />);
		},
		getRealRenderer: function() {
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
	$pt.Components.NArrayCheck = NArrayCheck;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.ArrayCheck, function (model, layout, direction, viewMode) {
		return <$pt.Components.NArrayCheck {...$pt.LayoutHelper.transformParameters(model, layout, direction, viewMode)}/>;
	});
}(window, jQuery, React, ReactDOM, $pt));
