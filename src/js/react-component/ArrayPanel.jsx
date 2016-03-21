/**
 * Array Panel, for array property
 * TODO add & remove are not supported yet
 * TODO since no apply action, must reset the whole model if want to reset the items data
 *
 * depends NPanel
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
 *      comp: {
 *          type: $pt.ComponentConstants.ArrayPanel,
 *          itemTitle: string|{when: function, depends: string|string[]},
 *          expanded: boolean,
 *          collapsible: boolean,
 *          style: string,
 *          checkInTitle: {}|function,
 *          editLayout: {}|function, // see form layout
 *          visible: {
 *              when: function,
 *              depends: string|string[]
 *          },
 *      },
 *      css: {
 *          cell: string,
 *          comp: string
 *      }
 * }
 */
(function (window, $, React, ReactDOM, $pt) {
	var NArrayPanel = React.createClass($pt.defineCellComponent({
		displayName: 'NArrayPanel',
		statics: {
			UNTITLED: 'Untitled Item'
		},
		propTypes: {
			// model
			model: React.PropTypes.object,
			// CellLayout
			layout: React.PropTypes.object,
			direction: React.PropTypes.oneOf(['vertical', 'horizontal'])
		},
		getDefaultProps: function () {
			return {
				defaultOptions: {
					collapsible: true,
					expanded: true
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
			this.removePostAddListener(this.onModelChanged);
			this.removePostRemoveListener(this.onModelChanged);
			this.removePostValidateListener(this.onModelValidateChanged);
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
			this.addPostAddListener(this.onModelChanged);
			this.addPostRemoveListener(this.onModelChanged);
			this.addPostValidateListener(this.onModelValidateChanged);
			this.registerToComponentCentral();
		},
		/**
		 * did mount
		 */
		componentDidMount: function () {
			// add post change listener to handle model change
			this.addPostChangeListener(this.onModelChanged);
			this.addPostAddListener(this.onModelChanged);
			this.addPostRemoveListener(this.onModelChanged);
			this.addPostValidateListener(this.onModelValidateChanged);
			this.registerToComponentCentral();
		},
		/**
		 * will unmount
		 */
		componentWillUnmount: function () {
			// remove post change listener to handle model change
			this.removePostChangeListener(this.onModelChanged);
			this.removePostAddListener(this.onModelChanged);
			this.removePostRemoveListener(this.onModelChanged);
			this.removePostValidateListener(this.onModelValidateChanged);
			this.unregisterFromComponentCentral();
		},
		/**
		 * render item
		 * @param item {{}}
		 * @returns {XML}
		 */
		renderItem: function (item, itemIndex) {
			var parentModel = this.getModel();
			var parentValidator = parentModel.getValidator();
			var validator = null;
			if (parentValidator) {
				var parentValidationConfig = parentValidator.getConfig()[this.getDataId()];
				if (parentValidationConfig && parentValidationConfig.table) {
					validator = $pt.createModelValidator(parentValidationConfig.table);
				}
			}
			var model = validator ? $pt.createModel(item, validator) : $pt.createModel(item);
			model.useBaseAsCurrent();
			model.parent(parentModel);
			// synchronized the validation result from parent model
			// get errors about current value
			var errors = this.getModel().getError(this.getDataId());
			if (errors) {
				var itemError = null;
				for (var index = 0, count = errors.length; index < count; index++) {
					if (typeof errors[index] !== "string") {
						itemError = errors[index].getError(item);
						model.mergeError(itemError);
					}
				}
			}

			var listeners = this.getComponentOption('rowListener');
			if (listeners) {
				listeners = Array.isArray(listeners) ? listeners : [listeners];
				listeners.forEach(function (listener) {
					model.addListener(listener.id,
						listener.time ? listener.time : 'post',
						listener.type ? listener.type : 'change',
						listener.listener);
				});
			}

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
		 * on model changed
		 * @param evt
		 */
		onModelChanged: function (evt) {
			this.forceUpdate();
		},
		/**
		 * monitor the parent model validation
		 * @param evt
		 */
		onModelValidateChanged: function (evt) {
			// TODO maybe will introduce performance issue, cannot sure now.
			this.forceUpdate();
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
