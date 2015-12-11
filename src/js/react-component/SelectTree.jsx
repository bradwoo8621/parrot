/**
 * popover will be closed on
 * 		2.1 mouse down on others in document
 * 		2.2 press escape or tab
 * 		2.3 mouse wheel
 *		2.4 window resize
 */
(function(window, $, React, ReactDOM, $pt) {
	var NSelectTree = React.createClass($pt.defineCellComponent({
		displayName: 'NSelectTree',
		statics: {
		},
		propTypes: {
			// model
			model: React.PropTypes.object,
			// CellLayout
			layout: React.PropTypes.object
		},
		getDefaultProps: function() {
			return {
				defaultOptions: {
					hideChildWhenParentChecked: false
				},
				treeLayout: {
					comp: {
						root: false,
						check: true,
						multiple: true,
						hierarchyCheck: false
					}
				}
			};
		},
		getInitialState: function() {
			return {};
		},
		/**
		 * will update
		 * @param nextProps
		 */
		componentWillUpdate: function (nextProps) {
			// remove post change listener to handle model change
			this.removePostChangeListener(this.__forceUpdate);
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
			// add post change listener to handle model change
			this.addPostChangeListener(this.__forceUpdate);
			this.addEnableDependencyMonitor();
			if (this.hasParent()) {
				// add post change listener into parent model
				this.getParentModel().addListener(this.getParentPropertyId(), "post", "change", this.onParentModelChanged);
			}
			this.registerToComponentCentral();

			if (this.state.popoverDiv && this.state.popoverDiv.is(':visible')) {
				this.showPopover();
			}
		},
		/**
		 * did mount
		 */
		componentDidMount: function () {
			// add post change listener to handle model change
			this.addPostChangeListener(this.__forceUpdate);
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
			this.destroyPopover();
			// remove post change listener to handle model change
			this.removePostChangeListener(this.__forceUpdate);
			this.removeEnableDependencyMonitor();
			if (this.hasParent()) {
				// add post change listener into parent model
				this.getParentModel().removeListener(this.getParentPropertyId(), "post", "change", this.onParentModelChanged);
			}
			this.unregisterFromComponentCentral();
		},
		renderTree: function() {
			var layout = $pt.createCellLayout('values', this.getTreeLayout());
			var model = $pt.createModel({values: this.getValueFromModel()});
			model.addPostChangeListener('values', this.onTreeValueChanged);
			return <$pt.Components.NTree model={model} layout={layout}/>;
		},
		renderSelectionItem: function(codeItem, nodeId) {
			return (<li>
				<span className='fa fa-fw fa-remove' onClick={this.onSelectionItemRemove.bind(this, nodeId)}></span>
				{codeItem.text}
			</li>);
		},
		renderSelectionWhenValueAsArray: function(values) {
			var _this = this;
			var codes = null;
			if (this.isHideChildWhenParentChecked()) {
				// only render parent selections
				codes = this.getAvailableTreeModel().list();
				var isChecked = function(code) {
					return -1 != values.findIndex(function(value) {
						return value == code.id;
					});
				};
				var traverse = function(codes) {
					return codes.map(function(code) {
						if (isChecked(code)) {
							return _this.renderSelectionItem(code, code.id);
						} else if (code.children){
							return traverse(code.children);
						}
					});
				};
				return traverse(codes);
			} else {
				// render all selections
				codes = this.getAvailableTreeModel().listAllChildren();
				return Object.keys(codes).map(function(id) {
					var value = values.find(function(value) {
						return value == id;
					});
					if (value != null) {
						return _this.renderSelectionItem(codes[value], value);
					}
				});
			}
		},
		renderSelectionWhenValueAsJSON: function(values) {
			var _this = this;
			var codes = this.getAvailableTreeModel().listWithHierarchyKeys({separator: NTree.NODE_SEPARATOR, rootId: NTree.ROOT_ID});
			if (this.isHideChildWhenParentChecked()) {
				var paintedNodes = [];
				var isPainted = function(nodeId) {
					// if nodeId starts with paintedNodeId, do not paint again
					return -1 != paintedNodes.findIndex(function(paintedNodeId) {
						return nodeId.startsWith(paintedNodeId);
					});
				};
				return Object.keys(codes).map(function(nodeId) {
					if (!isPainted(nodeId)) {
						var valueId = nodeId.split(NTree.NODE_SEPARATOR).slice(1).join($pt.PROPERTY_SEPARATOR) + $pt.PROPERTY_SEPARATOR + 'selected';
						var checked = $pt.getValueFromJSON(values, valueId);
						if (checked) {
							paintedNodes.push(nodeId + NTree.NODE_SEPARATOR);
							return _this.renderSelectionItem(codes[nodeId], nodeId);
						}
					}
				});
			} else {
				var render = function(node, currentId, parentId) {
					var nodeId = parentId + NTree.NODE_SEPARATOR + currentId;
					var spans = [];
					if (node.selected) {
						spans.push(_this.renderSelectionItem(codes[nodeId], nodeId));
					}
					spans.push.apply(spans, Object.keys(node).filter(function(key) {
						return key != 'selected';
					}).map(function(key) {
						return render(node[key], key, nodeId);
					}));
					return spans;
				};
				return Object.keys(values).filter(function(key) {
					return key != 'selected';
				}).map(function(key) {
					return render(values[key], key, NTree.ROOT_ID);
				});
			}
		},
		renderSelection: function() {
			var values = this.getValueFromModel();
			if (values == null) {
				// no selection
				return null;
			} else if (this.getTreeLayout().comp.valueAsArray) {
				// value as an array
				return this.renderSelectionWhenValueAsArray(values);
			} else {
				// value as a hierarchy json object
				return this.renderSelectionWhenValueAsJSON(values);
			}
		},
		renderText: function() {
			return (<div className='input-group form-control' onClick={this.onComponentClicked} ref='comp'>
				<ul className='selection'>
					{this.renderSelection()}
				</ul>
				<span className='fa fa-fw fa-sort-down pull-right' />
			</div>);
		},
		render: function() {
			var css = {
				'n-disabled': !this.isEnabled(),
				'n-view-mode': this.isViewMode()
			};
			css[this.getComponentCSS('n-select-tree')] = true;
			return (<div className={$pt.LayoutHelper.classSet(css)} tabIndex='0'>
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
		renderPopover: function() {
			var styles = {display: 'block'};
			var component = this.getComponent();
			styles.width = component.outerWidth();
			var offset = component.offset();
			styles.top = -10000; // let it out of screen
			styles.left = 0;
			var popover = (<div role="tooltip" className="n-select-tree-popover popover bottom in" style={styles}>
				<div className="arrow"></div>
				<div className="popover-content">
					{this.renderTree()}
				</div>
			</div>);
			ReactDOM.render(popover, this.state.popoverDiv.get(0), this.onPopoverRenderComplete);
		},
		showPopover: function() {
			this.renderPopoverContainer();
			this.renderPopover();
		},
		onPopoverRenderComplete: function() {
			this.state.popoverDiv.show();

			var popover = this.state.popoverDiv.children('.popover');
			var styles = {};
			var component = this.getComponent();
			styles.width = component.outerWidth();
			var offset = component.offset();
			styles.top = offset.top + component.outerHeight(); // let it out of screen
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
			// if (this.state.popoverDiv && this.state.popoverDiv.is(':visible')) {
			// 	this.state.popoverDiv.hide();
			// 	ReactDOM.render(<noscript/>, this.state.popoverDiv.get(0));
			// }
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
			this.showPopover();
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
		/**
		 * on parent model changed
		 */
		onParentModelChanged: function() {
			var parentChanged = this.getComponentOption('parentChanged');
			if (parentChanged) {
				this.setValueToModel(parentChanged.call(this, this.getModel(), this.getParentPropertyValue()));
			} else {
				// clear values
				this.setValueToModel(null);
			}
			this.forceUpdate();
		},
		/**
		 * on tree value changed
		 */
		onTreeValueChanged: function(evt) {
			var values = evt.new;
			if (values == null) {
				this.setValueToModel(values);
			} else if (Array.isArray(values)) {
				this.setValueToModel(values.slice(0));
			} else {
				this.setValueToModel($.extend(true, {}, values));
			}
		},
		onSelectionItemRemove: function(nodeId) {
			if (!this.isEnabled()) {
				// do nothing
				return;
			}
			var values = this.getValueFromModel();
			var hierarchyCheck = this.getTreeLayout().comp.hierarchyCheck;
			if (values == null) {
				// do nothing
			} else if (this.getTreeLayout().comp.valueAsArray) {
				if (hierarchyCheck) {
					var codes = this.getAvailableTreeModel().listWithHierarchyKeys({separator: NTree.NODE_SEPARATOR, rootId: NTree.ROOT_ID});
					var codeHierarchyIds = Object.keys(codes);
					// find all children
					var childrenIds = codeHierarchyIds.filter(function(key) {
						return key.indexOf(nodeId + NTree.NODE_SEPARATOR) != -1;
					}).map(function(id) {
						return id.split(NTree.NODE_SEPARATOR).pop();
					});
					var hierarchyId = codeHierarchyIds.find(function(id) {
						return id.endsWith(NTree.NODE_SEPARATOR + nodeId);
					});
					// find itself and its ancestor ids
					var ancestorIds = codeHierarchyIds.filter(function(id) {
						return hierarchyId.startsWith(id);
					}).map(function(id) {
						return id.split(NTree.NODE_SEPARATOR).pop();
					});
					// combine
					var ids = childrenIds.concat(ancestorIds);
					// filter found ids
					this.setValueToModel(values.filter(function(id) {
						return -1 == ids.findIndex(function(idNeedRemove) {
							return id == idNeedRemove;
						});
					}));
				} else {
					// remove itself
					this.setValueToModel(values.filter(function(id) {
						return id != nodeId;
					}));
				}
			} else {
				var effectiveNodes = nodeId.split(NTree.NODE_SEPARATOR).slice(1);
				var node = $pt.getValueFromJSON(values, effectiveNodes.join($pt.PROPERTY_SEPARATOR));
				if (hierarchyCheck) {
					// set itself and its children to unselected
					Object.keys(node).forEach(function(key) {
						delete node[key];
					});
					// set its ancestors to unselected
					effectiveNodes.splice(effectiveNodes.length - 1, 1);
					effectiveNodes.forEach(function(id, index, array) {
						$pt.setValueIntoJSON(values, array.slice(0, index + 1).join($pt.PROPERTY_SEPARATOR) + $pt.PROPERTY_SEPARATOR + 'selected', false);
					});
				} else {
					// set itself to unselected
					delete node.selected;
				}
				this.getModel().firePostChangeEvent(this.getDataId(), values, values);
			}
		},
		getComponent: function() {
			return $(ReactDOM.findDOMNode(this.refs.comp));
		},
		/**
		 * get tree model
		 * @returns {CodeTable}
		 */
		getTreeModel: function() {
			return this.getComponentOption('data');
		},
		/**
		 * get available tree model
		 * @returns {CodeTable}
		 */
		getAvailableTreeModel: function() {
			var filter = this.getComponentOption('parentFilter');
			var tree = this.getTreeModel();
			if (filter) {
				return filter.call(this, tree, this.getParentPropertyValue());
			} else {
				return tree;
			}
		},
		getTreeLayout: function() {
			var treeLayout = this.getComponentOption('treeLayout');
			if (treeLayout) {
				treeLayout = $.extend(true, {}, this.props.treeLayout, treeLayout);
			} else {
				treeLayout = $.extend(true, {}, this.props.treeLayout);
			}
			treeLayout.comp.data = this.getAvailableTreeModel();
			treeLayout.comp.valueAsArray = treeLayout.comp.valueAsArray ? treeLayout.comp.valueAsArray : false;
			treeLayout.evt = treeLayout.evt ? treeLayout.evt : {};
			treeLayout.evt.expand = treeLayout.evt.expand ? function(evt) {
				treeLayout.evt.expand.call(this, evt);
				this.onPopoverRenderComplete.call(this);
			} : this.onPopoverRenderComplete;
			treeLayout.evt.collapse = treeLayout.evt.collapse ? function(evt) {
				treeLayout.evt.collapse.call(this, evt);
				this.onPopoverRenderComplete.call(this);
			} : this.onPopoverRenderComplete;
			return treeLayout;
		},
		isHideChildWhenParentChecked: function() {
			var hierarchyCheck = this.getTreeLayout().comp.hierarchyCheck;
			if (hierarchyCheck) {
				return this.getComponentOption('hideChildWhenParentChecked');
			} else {
				return false;
			}
		},
		/**
		 * has parent or not
		 * @returns {boolean}
		 */
		hasParent: function() {
			return this.getParentPropertyId() != null;
		},
		/**
		 * get parent property id
		 * @returns {string}
		 */
		getParentPropertyId: function() {
			return this.getComponentOption("parentPropId");
		},
		/**
		 * get parent model
		 * @returns {ModelInterface}
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
		}
	}));
	$pt.Components.NSelectTree = NSelectTree;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.SelectTree, function (model, layout, direction, viewMode) {
		return <$pt.Components.NSelectTree {...$pt.LayoutHelper.transformParameters(model, layout, direction, viewMode)}/>;
	});
}(window, jQuery, React, ReactDOM, $pt));
