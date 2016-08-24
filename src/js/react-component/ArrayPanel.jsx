(function (window, $, React, ReactDOM, $pt) {
	var NArrayPanel = React.createClass($pt.defineCellComponent({
		displayName: 'NArrayPanel',
		mixins: [$pt.mixins.ArrayComponentMixin],
		statics: {
			UNTITLED: 'Untitled Item'
		},
		getDefaultProps: function () {
			return {
				defaultOptions: {
					collapsible: true,
					expanded: true
				}
			};
		},
		/**
		 * render item
		 * @param item {{}}
		 * @returns {XML}
		 */
		renderItem: function (item, itemIndex) {
			var model = this.createRowModel(item, true);
			this.addRowListener(model);

			var _this = this;
			this.getDependencies('itemTitle').forEach(function (key) {
				model.addListener(key, "post", "change", function () {
					_this.forceUpdate();
				});
			});
			var cellLayout = {
				label: this.getPanelTitle(model, itemIndex),
				comp: {
					type: $pt.ComponentConstants.Panel,
					collapsible: this.getComponentOption('collapsible'),
					expanded: this.getComponentOption('expanded'),
					editLayout: this.getEditLayout(model, itemIndex),
					style: this.getComponentOption('style'),
					checkInTitle: this.getCheckInTitle(model, itemIndex),
					expandedLabel: this.getComponentOption('expandedLabel'),
					collapsedLabel: this.getComponentOption('collapsedLabel'),
					headerButtons: this.getHeaderButtons(model, itemIndex)
				}
			};
			return (<div className='row' key={itemIndex}>
				<div className='col-sm-12 col-md-12 col-lg-12'>
					<$pt.Components.NPanel model={model}
					        layout={$pt.createCellLayout('pseudo-panel', cellLayout)}
					        direction={this.props.direction}
							view={this.isViewMode()}/>
				</div>
			</div>);
		},
		/**
		 * render
		 * @returns {XML}
		 */
		render: function () {
			return (<div className={this.getComponentCSS('n-array-panel')}>
				{this.getValueFromModel().map(this.renderItem)}
			</div>);
		},
		/**
		 * return [] when is null
		 * @returns {[*]}
		 */
		getValueFromModel: function () {
			var data = this.getModel().get(this.getDataId());
			return data == null ? [] : data;
		},
		/**
		 * get edit layout
		 * @param model {ModelInterface} item model
		 * @returns {{}}
		 */
		getEditLayout: function (model, itemIndex) {
			var layout = this.getComponentOption('editLayout');
			if (typeof layout === 'function') {
				return layout.call(this, model, itemIndex);
			} else {
				return layout;
			}
		},
		getHeaderButtons: function(model, itemIndex) {
			var buttons = this.getComponentOption('headerButtons');
			if (typeof buttons === 'function') {
				return buttons.call(this, model, itemIndex);
			} else {
				return buttons;
			}
		},
		/**
		 * get check in title
		 * @param model {ModelInterface} item model
		 * @returns {{}}
		 */
		getCheckInTitle: function (model, itemIndex) {
			var checkInTitle = this.getComponentOption('checkInTitle');
			if (typeof checkInTitle === 'function') {
				return checkInTitle.call(this, model, itemIndex);
			} else {
				return checkInTitle;
			}
		},
		/**
		 * get panel titled
		 * @param model {ModelInterface} item model
		 * @returns {string}
		 */
		getPanelTitle: function (model, itemIndex) {
			var title = this.getComponentOption('itemTitle');
			if (title == null) {
				return NArrayPanel.UNTITLED;
			} else if (typeof title === 'string') {
				return title;
			} else {
				var titleText = title.when.call(this, model, itemIndex);
				return (titleText == null || titleText.isBlank()) ? NArrayPanel.UNTITLED : titleText;
			}
		}
	}));
	$pt.Components.NArrayPanel = NArrayPanel;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.ArrayPanel, function (model, layout, direction, viewMode) {
		return <$pt.Components.NArrayPanel {...$pt.LayoutHelper.transformParameters(model, layout, direction, viewMode)}/>;
	});
}(window, jQuery, React, ReactDOM, $pt));
