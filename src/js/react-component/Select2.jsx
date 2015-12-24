(function (window, $, React, ReactDOM, $pt) {
	var NSelect = React.createClass($pt.defineCellComponent({
		displayName: 'NSelect',
		statics: {
			PLACEHOLDER: "Please Select...",
			NO_OPTION_FOUND: 'No Option Found',
			FILTER_PLACEHOLDER: 'Search...'
		},
		propTypes: {
			// model
			model: React.PropTypes.object,
			// CellLayout
			layout: React.PropTypes.object,
			view: React.PropTypes.bool
		},
		getDefaultProps: function () {
			return {
				defaultOptions: {
					allowClear: true,
					minimumResultsForSearch: 1,
					data: [],

					availableWhenNoParentValue: false
					// other
					/*
					 parentPropId: parent property id
					 parentModel: parent model, default is this.props.model is not defined
					 parentFilter: filter of options according to parent property value,
					 can be property of self options
					 or a function with parameters
					 1: parent value
					 2: self options array
					 */
				}
			};
		},
		getInitialState: function() {
			return {};
		},
		/**
		 * will update
		 */
		componentWillUpdate: function (nextProps) {
			this.removePostChangeListener(this.onModelChanged);
			this.removeEnableDependencyMonitor();
			if (this.hasParent()) {
				// add post change listener into parent model
				this.getParentModel().removeListener(this.getParentPropertyId(), "post", "change", this.onParentModelChanged);
			}
			this.unregisterFromComponentCentral();
		},
		/**
		 * did update
		 * @param prevProps
		 * @param prevState
		 */
		componentDidUpdate: function (prevProps, prevState) {
			this.addPostChangeListener(this.onModelChanged);
			this.addEnableDependencyMonitor();
			if (this.hasParent()) {
				// remove post change listener from parent model
				this.getParentModel().addListener(this.getParentPropertyId(), "post", "change", this.onParentModelChanged);
			}

			this.registerToComponentCentral();
		},
		/**
		 * did mount
		 */
		componentDidMount: function () {
			this.addPostChangeListener(this.onModelChanged);
			this.addEnableDependencyMonitor();
			if (this.hasParent()) {
				// add post change listener into parent model
				this.getParentModel().addListener(this.getParentPropertyId(), "post", "change", this.onParentModelChanged);
			}
			this.registerToComponentCentral();
		},
		/**
		 * will unmount
		 */
		componentWillUnmount: function () {
			// remove post change listener
			this.removePostChangeListener(this.onModelChanged);
			this.removeEnableDependencyMonitor();
			if (this.hasParent()) {
				// remove post change listener from parent model
				this.getParentModel().removeListener(this.getParentPropertyId(), "post", "change", this.onParentModelChanged);
			}
			this.unregisterFromComponentCentral();
		},
		renderClear: function() {
			if (!this.getComponentOption('allowClear')) {
				return null;
			}
			return (<span className='fa fa-fw fa-close clear'
						  onClick={this.onClearClick} />);
		},
		renderText: function() {
			var value = this.getValueFromModel();
			var itemText = null;
			if (value != null) {
				var item = this.getAvailableOptions().find(function(item) {
					return item.id == value;
				});
				if (item) {
					itemText = item.text;
				}
			}
			if (itemText == null) {
				itemText = NSelect.PLACEHOLDER;
			}
			return (<div className='input-group form-control' onClick={this.onComponentClicked} ref='comp'>
				<span className='text'>{itemText}</span>
				{this.renderClear()}
				<span className='fa fa-fw fa-sort-down drop' />
			</div>);
		},
		/**
		 * render
		 * @returns {XML}
		 */
		render: function () {
			if (this.isViewMode()) {
				return this.renderInViewMode();
			}
			var css = {
				'n-disabled': !this.isEnabled(),
				'n-view-mode': this.isViewMode()
			};
			css[this.getComponentCSS('n-select')] = true;
			return (<div className={$pt.LayoutHelper.classSet(css)} tabIndex='0' aria-readonly='true'>
				{this.renderText()}
				{this.renderNormalLine()}
				{this.renderFocusLine()}
			</div>);
		},
		renderPopoverContainer: function() {
			if (this.state.popoverDiv == null) {
				this.state.popoverDiv = $('<div>');
				this.state.popoverDiv.appendTo($('body'));
				$(document).on('mousedown', this.onDocumentMouseDown)
					.on('keyup', this.onDocumentKeyUp)
					.on('mousewheel', this.onDocumentMouseWheel);
				$(window).on('resize', this.onWindowResize);
			}
			this.state.popoverDiv.hide();
		},
		renderOptions: function(options, filterText) {
			if (options == null || options.length == 0) {
				return null;
			}
			if (filterText != null && !filterText.isBlank()) {
				options = options == null ? null : options.filter(function(item) {
					return item.text.toLowerCase().indexOf(filterText) != -1;
				});
			}
			var _this = this;
			return (<ul>
				{options.map(function(item, itemIndex) {
					return (<li onClick={_this.onOptionClick.bind(_this, item)} key={itemIndex}>
						<span>{item.text}</span>
					</li>);
				})}
			</ul>);
		},
		renderNoOption: function(options) {
			if (options == null || options.length == 0) {
				return <div className='no-option'><span>{NSelect.NO_OPTION_FOUND}</span></div>;
			}
			return null;
		},
		renderFilterText: function(options, filterText) {
			if (options == null || options.length == 0) {
				return;
			}
			var minimumResultsForSearch = this.getComponentOption('minimumResultsForSearch');
			if (minimumResultsForSearch >=0 && minimumResultsForSearch != Infinity) {
				var model = $pt.createModel({text: filterText});
				var layout = $pt.createCellLayout('text', {
					comp: {
						placeholder: NSelect.FILTER_PLACEHOLDER
					}
				});
				model.addPostChangeListener('text', this.onFilterTextChange);
				return <$pt.Components.NText model={model} layout={layout} />;
			} else {
				return null;
			}
		},
		renderPopoverContent: function(filterText) {
			var options = this.getAvailableOptions();
			return (<div>
				{this.renderFilterText(options, filterText)}
				{this.renderNoOption(options)}
				{this.renderOptions(options, filterText)}
			</div>);
		},
		renderPopover: function(filterText) {
			var styles = {display: 'block'};
			var component = this.getComponent();
			styles.width = component.outerWidth();
			var offset = component.offset();
			styles.top = -10000; // let it out of screen
			styles.left = 0;
			var popover = (<div role="tooltip" className="n-select-popover popover bottom in" style={styles}>
				<div className="arrow"></div>
				<div className="popover-content">
					{this.renderPopoverContent(filterText)}
				</div>
			</div>);
			ReactDOM.render(popover, this.state.popoverDiv.get(0), this.onPopoverRenderComplete);
		},
		showPopover: function(filterText) {
			this.renderPopoverContainer();
			this.renderPopover(filterText);
		},
		onPopoverRenderComplete: function() {
			this.state.popoverDiv.show();
			var popover = this.state.popoverDiv.children('.popover');
			var styles = {};
			var component = this.getComponent();
			styles.width = component.outerWidth();
			var offset = component.offset();
			styles.top = offset.top + component.outerHeight();
			styles.left = offset.left;

			var onTop = false;
			var rightToLeft = false;
			var realHeight = popover.outerHeight();
			var realWidth = popover.outerWidth();
			// set the real top, assumpt it is on bottom
			styles.top = offset.top + component.outerHeight();
			// check popover in top or bottom
			if ((styles.top + realHeight) > ($(window).height() + $(window).scrollTop())) {
				// cannot show in bottom and in current viewport
				// check it is enough top or not
				if ((offset.top - $(window).scrollTop()) >= realHeight) {
					// enough
					styles.top = offset.top - realHeight;
					onTop = true;
				} else if ((styles.top + realHeight) <= $(document).height()) {
					// cannot show in bottom and in current document
					onTop = false;
				} else if (offset.top < realHeight) {
					// cannot show in top and in current document
					onTop = false;
				} else {
					styles.top = offset.top - realHeight;
					onTop = true;
				}
			} else {
				// can show in bottom and in current viewport
				onTop = false;
			}

			// check popover to left or right
			if (realWidth > styles.width) {
				width = $(document).width();
				if ((styles.left + realWidth) <= width) {
					// normal from left to right, do nothing
				} else if ((styles.left + styles.width) >= realWidth) {
					// from right to left
					styles.left = styles.left + styles.width - realWidth;
					rightToLeft = true;
				} else {
					// still left to right, do nothing
				}
			}

			if (onTop) {
				popover.addClass('top');
				popover.removeClass('bottom');
			} else {
				popover.removeClass('top');
				popover.addClass('bottom');
			}
			if (rightToLeft) {
				popover.addClass('right-to-left');
			}
			popover.css({top: styles.top, left: styles.left});
		},
		hidePopover: function() {
			this.destroyPopover();
		},
		destroyPopover: function() {
			if (this.state.popoverDiv) {
				$(document).off('mousedown', this.onDocumentMouseDown)
					.off('keyup', this.onDocumentKeyUp)
					.off('mousewheel', this.onDocumentMouseWheel);
				$(window).off('resize', this.onWindowResize);
				this.state.popoverDiv.remove();
				delete this.state.popoverDiv;
			}
		},
		onComponentClicked: function() {
			if (!this.isEnabled() || this.isViewMode()) {
				// do nothing
				return;
			}
			if (!this.state.popoverDiv || !this.state.popoverDiv.is(':visible')) {
				this.showPopover();
			}
		},
		onDocumentMouseDown: function(evt) {
			var target = $(evt.target);
			if (target.closest(this.getComponent()).length == 0 && target.closest(this.state.popoverDiv).length == 0) {
				this.hidePopover();
			}
		},
		onDocumentMouseWheel: function(evt) {
			var target = $(evt.target);
			if (target.closest(this.state.popoverDiv).length == 0) {
				this.hidePopover();
			}
		},
		onDocumentKeyUp: function(evt) {
			if (evt.keyCode === 27 || evt.keyCode === 9) { // escape and tab
				this.hidePopover();
			}
		},
		onWindowResize: function() {
			this.hidePopover();
		},
		onOptionClick: function(item) {
			this.setValueToModel(item.id);
			this.hidePopover();
		},
		onClearClick: function() {
			if (!this.isEnabled() || this.isViewMode()) {
				return;
			}
			this.setValueToModel(null);
		},
		onFilterTextChange: function(evt) {
			this.showPopover(evt.new);
		},
		/**
		 * on model change
		 * @param evt
		 */
		onModelChanged: function (evt) {
			this.forceUpdate();
		},
		/**
		 * on parent model change
		 * @param evt
		 */
		onParentModelChanged: function (evt) {
			var options = this.getAvailableOptions();
			var currentValue = this.getValueFromModel();
			var index = options.findIndex(function(item) {
				return item.id == currentValue;
			});
			if (index == -1) {
				this.setValueToModel(null);
			}
		},
		/**
		 * get parent model
		 * @returns {*}
		 */
		getParentModel: function () {
			var parentModel = this.getComponentOption("parentModel");
			return parentModel == null ? this.getModel() : parentModel;
		},
		/**
		 * get parent property value
		 * @returns {*}
		 */
		getParentPropertyValue: function () {
			return this.getParentModel().get(this.getParentPropertyId());
		},
		/**
		 * get parent property id
		 * @returns {string}
		 */
		getParentPropertyId: function () {
			return this.getComponentOption("parentPropId");
		},
		/**
		 * has parent or not
		 * @returns {boolean}
		 */
		hasParent: function () {
			return this.getParentPropertyId() != null;
		},
		/**
		 * convert data options, options can be CodeTable object or an array
		 * @param options
		 * @returns {*}
		 */
		convertDataOptions: function (options) {
			return Array.isArray(options) ? options : options.list();
		},
		/**
		 * get available options.
		 * if no parent assigned, return all data options
		 * @returns {[*]}
		 */
		getAvailableOptions: function () {
			if (!this.hasParent()) {
				return this.convertDataOptions(this.getComponentOption('data'));
			} else {
				var parentValue = this.getParentPropertyValue();
				if (parentValue == null) {
					return this.isAvailableWhenNoParentValue() ? this.convertDataOptions(this.getComponentOption("data")) : [];
				} else {
					var filter = this.getComponentOption("parentFilter");
					if (typeof filter === 'object') {
						// call code table filter
						return this.convertDataOptions(this.getComponentOption('data').filter($.extend({}, filter, {value: parentValue})));
					} else {
						// call local filter
						var data = this.convertDataOptions(this.getComponentOption("data"));
						if (typeof filter === "function") {
							return filter.call(this, parentValue, data);
						} else {
							return data.filter(function (item) {
								return item[filter] == parentValue;
							});
						}
					}
				}
			}
		},
		/**
		 * is available when no parent value.
		 * if no parent assigned, always return true.
		 * @returns {boolean}
		 */
		isAvailableWhenNoParentValue: function () {
			// when has parent, return availableWhenNoParentValue
			// or return true
			return this.hasParent() ? this.getComponentOption("availableWhenNoParentValue") : true;
		},
		getComponent: function() {
			return $(ReactDOM.findDOMNode(this.refs.comp));
		},
		getTextInViewMode: function() {
			var value = this.getValueFromModel();
			if (value != null) {
				var data = null;
				if (this.hasParent()) {
					data = this.getAvailableOptions(this.getParentPropertyValue());
				} else {
					data = this.convertDataOptions(this.getComponentOption('data'));
				}
				data.some(function(item) {
					if (item.id == value) {
						value = item.text;
						return true;
					}
					return false;
				});
			}
			return value;
		}
	}));
	$pt.Components.NSelect = NSelect;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.Select, function (model, layout, direction, viewMode) {
		return <$pt.Components.NSelect {...$pt.LayoutHelper.transformParameters(model, layout, direction, viewMode)}/>;
	});
}(window, jQuery, React, ReactDOM, $pt));
