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
			this.registerToComponentCentral();
			if (this.state.onloading) {
				if (this.hasParent()) {
					// add post change listener into parent model
					this.getParentModel().addListener(this.getParentPropertyId(), "post", "change", this.onParentModelChanged);
					var parentValue = this.getParentPropertyValue();
					if (parentValue == null) {
						// no parent value
						if (this.isAvailableWhenNoParentValue()) {
							this.getCodeTable().initializeRemote().done(function() {
								this.setState({onloading: false});
							}.bind(this));
						} else {
							this.getCodeTable().setAsRemoteInitialized();
							this.setState({onloading: false});
						}
					} else {
						this.getCodeTable().loadRemoteCodeSegment(parentValue).done(function() {
							this.setState({onloading: false});
						}.bind(this));
					}
				} else {
					this.getCodeTable().initializeRemote().done(function() {
						this.setState({onloading: false});
					}.bind(this));
				}
			}
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
			if (this.hasParent() && this.isOnLoadingWhenHasParent() && value != null) {
				this.state.onloading = true;
			} else if (this.isOnLoadingWhenNoParent()) {
				this.state.onloading = true;
			} else if (value != null) {
				var item = this.getAvailableOptions().find(function(item) {
					return item.id == value;
				});
				if (item) {
					itemText = item.text;
				}
			}
			if (itemText == null) {
				itemText = this.state.onloading ? $pt.Components.NCodeTableWrapper.ON_LOADING : (this.isViewMode() ? '' : this.getPlaceholder());
			}
			return (<div className='input-group form-control' 
						 onClick={this.onComponentClicked}>
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
			var css = {
				'n-disabled': !this.isEnabled(),
				'n-view-mode': this.isViewMode()
			};
			css[this.getComponentCSS('n-select')] = true;
			return (<div className={$pt.LayoutHelper.classSet(css)} 
						 tabIndex='0'
						 onKeyUp={this.onComponentKeyUp}
						 aria-readonly='true' 
						 ref='comp'>
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
					return item.text.toLowerCase().indexOf(filterText.toLowerCase()) != -1;
				});
			}
			var _this = this;
			var value = this.getValueFromModel();
			return (<ul className='options'>
				{options.map(function(item, itemIndex) {
					var css = {
						choosen: value == item.id
					};
					return (<li onClick={_this.onOptionClick.bind(_this, item)}
								onMouseEnter={_this.onOptionMouseEnter}
								onMouseLeave={_this.onOptionMouseLeave}
								className={$pt.LayoutHelper.classSet(css)}
								key={itemIndex}
								data-id={item.id}>
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
					},
					evt: {
						keyUp: this.onComponentKeyUp
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
			if (this.state.popoverDiv) {
				// log the last active option
				var activeOption = this.state.popoverDiv.find('ul.options > li.active');
				this.state.lastActiveOptionId = activeOption.attr('data-id');
			} else {
				delete this.state.lastActiveOptionId;
			}
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
				var width = $(document).width();
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

			// if there is no active option, set first as active
			var options = this.state.popoverDiv.find('ul.options > li');
			if (options.length != 0) {
				if (this.state.lastActiveOptionId) {
					// according to react mechanism, must remove the existed active option first
					// since active is not render by react by jquery, react will keep it
					// active the last active option if exists
					options.removeClass('active').filter(function(index, option) {
						return $(option).attr('data-id') == this.state.lastActiveOptionId;
					}.bind(this)).addClass('active');
				}
				if (this.state.popoverDiv.find('ul.options > li.active').length == 0) {
					// active the first if no active option
					this.state.popoverDiv.find('ul.options > li').first().addClass('active');
				}
			}

			var filterText = this.state.popoverDiv.find('div.n-text input[type=text]');
			if (this.state.filteTextCaret != null) {
				filterText.caret(this.state.filteTextCaret);
			} else if (filterText.val() != null) {
				filterText.caret(filterText.val().length)
			}
			filterText.focus();
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
		isOnLoadingWhenHasParent: function() {
			var codetable = this.getCodeTable();
			if (codetable == null || Array.isArray(codetable) || !codetable.isRemote()) {
				return false;
			}
			var parentValue = this.getParentPropertyValue();
			if (parentValue == null) {
				// no parent value
				if (this.isAvailableWhenNoParentValue()) {
					// still need options
					// check code table is remote and not initialized
					// is on loading
					return codetable.isRemoteButNotInitialized();
				} else {
					// otherwise not need load options
					codetable.setAsRemoteInitialized();
					return false;
				}
			} else {
				// has parent value
				// check code table segment is loaded or not
				return !codetable.isSegmentLoaded(parentValue);
			}
		},
		isOnLoadingWhenNoParent: function() {
			// var value = this.getValueFromModel();
			var codetable = this.getCodeTable();
			// remote and not initialized
			// is on loading
			return codetable != null && !Array.isArray(codetable) && codetable.isRemoteButNotInitialized();
		},
		onComponentClicked: function() {
			if (!this.isEnabled() || this.isViewMode()) {
				// do nothing
				return;
			}
			if (!this.state.popoverDiv || !this.state.popoverDiv.is(':visible')) {
				var codetable = this.getCodeTable();
				if (this.hasParent() && this.isOnLoadingWhenHasParent()) {
					this.setState({
						onloading: true
					}, function() {
						codetable.loadRemoteCodeSegment(this.getParentPropertyValue()).done(function() {
							this.showPopover();
						}.bind(this)).always(function() {
							this.setState({onloading: false});
						}.bind(this));
					}.bind(this));
				} else if (this.isOnLoadingWhenNoParent()) {
					this.setState({
						onloading: true
					}, function() {
						codetable.initializeRemote().done(function() {
							this.showPopover();
						}.bind(this)).always(function() {
							this.setState({onloading: false});
						}.bind(this));
					}.bind(this));
				} else {
					this.showPopover();
				}
			}
		},
		onComponentKeyUp: function(evt) {
			if (evt.keyCode === 40) {
				// down arrow 
				this.onComponentDownArrowKeyUp(evt);
			} else if (evt.keyCode === 38) {
				// up arrow
				this.onComponentUpArrowKeyUp(evt);
			} else if (evt.keyCode === 13) {
				// enter
				this.onComponentEnterKeyUp(evt);
			}
		},
		onComponentEnterKeyUp: function(evt) {
			evt.preventDefault();
			evt.stopPropagation();

			if (!this.isEnabled() || this.isViewMode()) {
				// do nothing
				return;
			}
			if (!this.state.popoverDiv || !this.state.popoverDiv.is(':visible')) {
				return;
			} 
			var option = this.state.popoverDiv.find('ul.options > li.active');
			if (option.length > 0) {
				this.setValueToModel(option.attr('data-id'));
				this.hidePopover();
			}
		},
		onComponentDownArrowKeyUp: function(evt) {
			evt.preventDefault();
			evt.stopPropagation();

			if (!this.isEnabled() || this.isViewMode()) {
				// do nothing
				return;
			}
			if (!this.state.popoverDiv || !this.state.popoverDiv.is(':visible')) {
				this.onComponentClicked();
			} else {
				var options = this.state.popoverDiv.find('ul.options > li');
				var keystepOption = options.filter('.active');
				if (keystepOption.length == 0) {
					var first = options.first();
					first.addClass('active');
					first[0].scrollIntoView();
				} else {
					var last = options.last();
					if (!keystepOption.first().is(last)) {
						keystepOption.removeClass('active');
						var next = keystepOption.next();
						next.addClass('active');
						if (!this.checkOptionVisible(next)) {
							next[0].scrollIntoView();
						}
					}
				}
			}
		},
		onComponentUpArrowKeyUp: function(evt) {
			evt.preventDefault();
			evt.stopPropagation();

			if (!this.isEnabled() || this.isViewMode()) {
				// do nothing
				return;
			}
			if (!this.state.popoverDiv || !this.state.popoverDiv.is(':visible')) {
				this.onComponentClicked();
			} else {
				var options = this.state.popoverDiv.find('ul.options > li');
				var keystepOption = options.filter('.active');
				if (keystepOption.length == 0) {
					var last = options.last();
					last.addClass('active');
					last[0].scrollIntoView();
				} else {
					var first = options.first();
					if (!keystepOption.first().is(first)) {
						keystepOption.removeClass('active');
						var previous = keystepOption.prev();
						previous.addClass('active');
						if (!this.checkOptionVisible(previous)) {
							previous[0].scrollIntoView();
						}
					}
				}
			}
		},
		checkOptionVisible: function(option) {
			var parent = option.parent();
			// console.log(parent.offset().top, option.offset().top);
			var top = option.offset().top - parent.offset().top;
			var bottom = top + option.height();
			var viewTop = parent.scrollTop();
			var viewBottom = viewTop + parent.height();
			// console.log(top, bottom, viewTop, viewBottom);
			return (bottom < viewBottom) && (top > viewTop);
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
		onOptionMouseEnter: function(evt) {
			$(evt.target).addClass('active').siblings().removeClass('active');
		},
		onOptionMouseLeave: function(evt) {
			// $(evt.target).removeClass('active');
		},
		onClearClick: function() {
			if (!this.isEnabled() || this.isViewMode()) {
				return;
			}
			this.setValueToModel(null);
			// clear highlight
			var options = this.state.popoverDiv.find('ul.options > li').filter('.choosen').removeClass('choosen');
			// if (this.state.popoverDiv && this.state.popoverDiv.is(':visible')) {
			// 	var filterText = this.state.popoverDiv.find('div.n-text input[type=text]');
			// 	if (filterText.length > 0) {
			// 		this.state.filterTextCaret = filterText.caret();
			// 	}
			// 	this.showPopover(filterText.val());
			// }
		},
		onFilterTextChange: function(evt) {
			if (this.state.popoverDiv.is(':visible')) {
				var filterText = this.state.popoverDiv.find('div.n-text input[type=text]');
				this.state.filteTextCaret = filterText.caret();
			} else {
				this.state.filteTextCaret = null;
			}
			// console.log('caret', this.state.filteTextCaret);
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
			// var options = this.getAvailableOptions();
			// var currentValue = this.getValueFromModel();
			// var index = options.findIndex(function(item) {
			// 	return item.id == currentValue;
			// });
			// if (index == -1) {
			this.setValueToModel(null);
			// }
			// this.forceUpdate();
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
		getPlaceholder: function() {
			return this.getComponentOption('placeholder', NSelect.PLACEHOLDER);
		},
		getCodeTable: function() {
			return this.getComponentOption('data');
		},
		/**
		 * get available options.
		 * if no parent assigned, return all data options
		 * @returns {[*]}
		 */
		getAvailableOptions: function () {
			if (!this.hasParent()) {
				return this.convertDataOptions(this.getCodeTable());
			} else {
				var parentValue = this.getParentPropertyValue();
				if (parentValue == null) {
					return this.isAvailableWhenNoParentValue() ? this.convertDataOptions(this.getCodeTable()) : [];
				} else {
					var filter = this.getComponentOption("parentFilter");
					if (typeof filter === 'object') {
						// call code table filter
						return this.convertDataOptions(this.getCodeTable().filter($.extend({}, filter, {value: parentValue})));
					} else {
						// call local filter
						var data = this.convertDataOptions(this.getCodeTable());
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
		// },
		// getTextInViewMode: function() {
		// 	var value = this.getValueFromModel();
		// 	if (value != null) {
		// 		var data = this.getAvailableOptions().some(function(item) {
		// 			if (item.id == value) {
		// 				value = item.text;
		// 				return true;
		// 			}
		// 			return false;
		// 		});
		// 	}
		// 	return value;
		}
	}));
	$pt.Components.NSelect = NSelect;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.Select, function (model, layout, direction, viewMode) {
		return <$pt.Components.NSelect {...$pt.LayoutHelper.transformParameters(model, layout, direction, viewMode)}/>;
	});
}(window, jQuery, React, ReactDOM, $pt));
