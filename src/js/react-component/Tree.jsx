(function(window, $, React, ReactDOM, $pt) {
    var NTree = React.createClass($pt.defineCellComponent({
        displayName: 'NTree',
        statics: {
            ROOT_LABEL: 'Root',
            FOLDER_ICON: 'folder-o',
            FOLDER_OPEN_ICON: 'folder-open-o',
            FILE_ICON: 'file-o',
            OP_FOLDER_LEAF_ICON: 'angle-right',
            OP_FOLDER_ICON: 'angle-double-right',
            OP_FOLDER_OPEN_ICON: 'angle-double-down',
            OP_FILE_ICON: '',
            NODE_SEPARATOR : ';',
            ROOT_ID : '0',
            convertValueTreeToArray: function(nodeValues, id) {
                var array = [];
                var push = function(node, id) {
                    Object.keys(node).forEach(function(key) {
                        if (key == 'selected' && node[key]) {
                            if (id != NTree.ROOT_ID) {
                                array.push(id);
                            } else {
                                array.selected = node.selected ? true : undefined;
                            }
                        } else {
                            push(node[key], key);
                        }
                    });
                };
                push(nodeValues, id);
                return array;
            }
        },
        getDefaultProps: function() {
            return {
                defaultOptions: {
                    root: true,
                    check: false,
                    inactiveSlibing: true,
                    opIconEnabled: false,
                    multiple: true,
                    valueAsArray: false,
                    hierarchyCheck: false,
                    expandLevel: 1,
                    border: false,
                    expandButton: {
                        comp: {
                            icon: 'plus-square-o',
                            style: 'link'
                        }
                    },
                    collapseButton: {
                        comp: {
                            icon: 'minus-square-o',
                            style: 'link'
                        }
                    }
                }
            };
        },
        getInitialState: function() {
            var expandBtn = $.extend(true, {}, this.getComponentOption('expandButton'));
            if (expandBtn) {
                if (!expandBtn.comp.click) {
                    expandBtn.comp.click = this.expandAll;
                }
                expandBtn = $pt.createCellLayout('expand', expandBtn);
            }
            var collapseBtn = $.extend(true, {}, this.getComponentOption('collapseButton'));
            if (collapseBtn) {
                if (!collapseBtn.comp.click) {
                    collapseBtn.comp.click = this.collapseAll;
                }
                collapseBtn = $pt.createCellLayout('collapse', collapseBtn);
            }
            return {
                activeNodes: {},
                root: {text: this.getRootLabel(), id: NTree.ROOT_ID},
                expandButton: expandBtn,
                collapseButton: collapseBtn,
            };
        },
        renderCheck: function(node, nodeId) {
            var canSelected = this.isNodeCanSelect(node);
            if (!canSelected) {
                return null;
            }
            var modelValue = this.getValueFromModel();
            modelValue = modelValue ? modelValue : {};
            var model = $pt.createModel({selected: this.isNodeChecked(nodeId)});
            model.useBaseAsCurrent();
            var layoutJSON = {
                comp: {
                    type: $pt.ComponentConstants.Check
                }
            };
            var valueCanChange = this.isNodeCheckCanChange(node);
            if (valueCanChange != null) {
                layoutJSON.comp.enabled = valueCanChange;
            }
            var layout = $pt.createCellLayout('selected', layoutJSON);
            model.addPostChangeListener('selected', this.onNodeCheckChanged.bind(this, node, nodeId));
            return <$pt.Components.NCheck model={model} layout={layout} view={this.isViewMode()}/>;
        },
        renderNode: function(parentNodeId, node) {
            var nodeId = this.getNodeId(parentNodeId, node);

            var opIcon = null;
            if (this.getComponentOption('opIconEnabled')) {
                var expandableIconAttrs = {
                    iconClassName: 'node-op-icon',
                    fixWidth: true,
                    icon: this.getNodeOperationIcon(node, nodeId)
                };
                opIcon = (<a href='javascript:void(0);'
                            onClick={this.onNodeClicked.bind(this, node, nodeId)}>
                    <$pt.Components.NIcon {...expandableIconAttrs} />
                </a>);
            }
            var folderIconAttrs = {
                icon: this.getNodeIcon(node, nodeId),
                fixWidth: true,
                iconClassName: 'node-icon'
            };
            var folderIcon = (<a href='javascript:void(0);'
                            onClick={this.onNodeClicked.bind(this, node, nodeId)}>
                <$pt.Components.NIcon {...folderIconAttrs}/>
            </a>);

            var _this = this;
            var buttons = this.getComponentOption('nodeOperations');
            buttons = buttons ? (Array.isArray(buttons) ? buttons : [buttons]) : [];
            buttons = buttons.map(function(button, buttonIndex) {
                var visible = true;
                if (typeof button.visible === 'boolean') {
                    visible = button.visible;
                } else if (typeof button.visible === 'function') {
                    visible = button.visible.call(_this, node);
                }
                if (!visible) {
                    return null;
                }
                var icon = {
                    icon: button.icon,
                    fixWidth: true,
                };
                return (<a href='javascript:void(0);'
                            onClick={_this.onNodeOperationClicked.bind(_this, node, button.click)}
                            className='node-button'
                            key={buttonIndex}
                            title={button.text}>
                    <$pt.Components.NIcon {...icon}/>
                </a>)
            }).filter(function(button) {
                return button != null;
            });

            var active = this.isActive(nodeId) ? 'active' : null;
            return (
                <li className={active} key={nodeId}>
                    <div className='node-content'>
                        {opIcon}
                        {folderIcon}
                        {this.renderCheck(node, nodeId)}
                        <a className={'node-text-link-' + buttons.length}
                            href='javascript:void(0);'
                            onClick={this.onNodeLabelClicked.bind(this, node, nodeId)}>
                            <span className='node-text'>{this.getNodeText(node)}</span>
                        </a>
                        {buttons}
                    </div>
                    {this.renderNodes(node, nodeId)}
                </li>
            );
        },
        renderNodes: function(parent, parentNodeId) {
            var children =  parent.children;
            if (children && children.length > 0) {
                return (
                    <ul className='nav'>
                        {children.map(this.renderNode.bind(this, parentNodeId))}
                    </ul>
                );
            } else {
                return null;
            }
        },
        renderRoot: function() {
            return (<ul className='nav'>
                {this.renderNode(null, this.state.root)}
            </ul>);
        },
        renderTopLevel: function() {
            return (<$pt.Components.NCodeTableWrapper codetable={this.getCodeTable()}
                                renderer={this.getRealTopLevelRenderer} 
                                model={this.getModel()}
                                layout={this.getLayout()}
                                onMounted={this.initExpand}/>);
        },
        getRealTopLevelRenderer: function() {
            var root = this.state.root;
            root.children = this.getTopLevelNodes();
            return this.isRootPaint() ? this.renderRoot() : this.renderNodes(root, this.getNodeId(null, root));
        },
        renderButtons: function() {
            var expand = this.state.expandButton ? <$pt.Components.NFormButton model={this.getModel()} layout={this.state.expandButton}/> : null;
            var collapse = this.state.collapseButton ? <$pt.Components.NFormButton model={this.getModel()} layout={this.state.collapseButton}/> : null;
            if (expand || collapse) {
                return (<span className='buttons'>
                    {expand}{collapse}
                </span>);
            } else {
                return null;
            }
        },
        initExpand: function() {
            var expandLevel = this.getComponentOption('expandLevel');
            if (expandLevel == null) {
                // default expand root
                expandLevel = 0;
            }
            if (expandLevel === 'all') {
                expandLevel = 9999;
            }
            if (this.state.root.children) {
                // this.state.root.children = this.getTopLevelNodes();
                this.expandTo(expandLevel);
            }
        },
        render: function() {
            var styles = {};
            if (this.getComponentOption('height')) {
                styles.height = this.getComponentOption('height');
            }
            if (this.getComponentOption('maxHeight')) {
                styles.maxHeight = this.getComponentOption('maxHeight');
            }
            var css = this.getComponentCSS('n-tree');
            if (this.getComponentOption('border')) {
                css += ' border';
            }
            return (
                <div className={css} style={styles}>
                    {this.renderTopLevel()}
                    {this.renderButtons()}
                </div>
            );
        },
        onNodeClicked: function(node, nodeId) {
            if (!this.isLeaf(node)) {
                if (this.state.activeNodes[nodeId]) {
                    this.collapseNode(node, nodeId);
                } else {
                    this.expandNode(node, nodeId);
                }
            }
        },
        onNodeLabelClicked: function(node, nodeId) {
            var nodeClick = this.getComponentOption('nodeClick');
            if (nodeClick) {
                nodeClick.call(this, node);
            } else {
                this.onNodeClicked(node, nodeId);
            }
        },
        onNodeOperationClicked: function(node, click) {
            if (click) {
                click.call(this, node);
            }
        },
        onNodeCheckChanged: function(node, nodeId, evt, toChildOnly) {
            var hierarchyCheck = this.isHierarchyCheck();
            var modelValue = this.getValueFromModel();
            if (this.isValueAsArray()) {
                modelValue = modelValue ? modelValue : [];
                if (hierarchyCheck) {
                    this.checkNodeHierarchy(node, nodeId, evt.new, modelValue);
                    this.hierarchyCheckToAncestors(nodeId, modelValue);
                } else {
                    this.checkNode(nodeId, evt.new, modelValue);
                }
                if (this.getValueFromModel() != modelValue) {
                    // simply set to model
                    this.setValueToModel(modelValue);
                } else {
                    // fire event manually
                    this.getModel().firePostChangeEvent(this.getDataId(), modelValue, modelValue);
                }
            } else {
                if (!modelValue) {
                    modelValue = {};
                }

                if (hierarchyCheck) {
                    this.checkNodeHierarchy(node, nodeId, evt.new, modelValue);
                    this.hierarchyCheckToAncestors(nodeId, modelValue);
                } else {
                    this.checkNode(nodeId, evt.new, modelValue);
                }

                if (this.getValueFromModel() != modelValue) {
                    // simply set to model
                    this.setValueToModel(modelValue);
                } else {
                    // fire event manually
                    this.getModel().firePostChangeEvent(this.getDataId(), modelValue, modelValue);
                }
            }
        },
        isValueAsArray: function() {
            return this.getComponentOption('valueAsArray');
        },
        /**
         * check or uncheck node. will not fire post change event.
         */
        checkNode: function(nodeId, value, modelValue) {
            if (this.isValueAsArray()) {
                if (!this.isMultipleSelection()) {
                    // no multiple selection
                    modelValue.length = 0;
                }
                if (nodeId == this.state.root.id) {
                    modelValue.selected = value;
                } else {
                    var ids = nodeId.split(NTree.NODE_SEPARATOR);
                    var id = ids[ids.length - 1];
                    var index = modelValue.findIndex(function(value) {
                        return value == id;
                    });
                    if (value && index == -1) {
                        modelValue.push(id);
                    } else if (!value && index != -1) {
                        modelValue.splice(index, 1);
                    }
                }
            } else {
                if (!this.isMultipleSelection()) {
                    // no multiple selection
                    Object.keys(modelValue).forEach(function(key) {
                        delete modelValue[key];
                    });
                }
                if (nodeId == this.state.root.id) {
                    $pt.setValueIntoJSON(modelValue, 'selected', value);
                } else {
                    var segments = nodeId.split(NTree.NODE_SEPARATOR);
                    $pt.setValueIntoJSON(modelValue, segments.slice(1).join($pt.PROPERTY_SEPARATOR) + $pt.PROPERTY_SEPARATOR + 'selected', value);
                }
            }
            return modelValue;
        },
        /**
         * check or uncheck node hierarchy. will not fire post change event.
         */
        checkNodeHierarchy: function(node, nodeId, value, modelValue) {
            modelValue = this.checkNode(nodeId, value, modelValue);
            if (node.children) {
                var _this = this;
                node.children.forEach(function(child) {
                    var childId = _this.getNodeId(nodeId, child);
                    _this.checkNodeHierarchy(child, childId, value, modelValue);
                });
            }
            return modelValue;
        },
        isNodeChecked: function(nodeId, modelValue) {
            modelValue = modelValue ? modelValue : this.getValueFromModel();
            modelValue = modelValue ? modelValue : {};
            if (Array.isArray(modelValue)) {
                if (nodeId == this.state.root.id) {
                    return modelValue.selected;
                } else {
                    var ids = nodeId.split(NTree.NODE_SEPARATOR);
                    var id = ids[ids.length - 1];
                    return -1 != modelValue.findIndex(function(value) {
                        return value == id;
                    });
                }
            } else {
                if (nodeId == this.state.root.id) {
                    return $pt.getValueFromJSON(modelValue, 'selected');
                } else {
                    return $pt.getValueFromJSON(modelValue, nodeId.split(NTree.NODE_SEPARATOR).slice(1).join($pt.PROPERTY_SEPARATOR) + $pt.PROPERTY_SEPARATOR + 'selected');
                }
            }
        },
        hierarchyCheckToAncestors: function(nodeId, modelValue) {
            var _this = this;
            var checkNodeOnChildren = function(node, nodeId) {
                if (node.children) {
                    var hasUncheckedChild = false;
                    node.children.forEach(function(child) {
                        var checked = checkNodeOnChildren(child, _this.getNodeId(nodeId, child));
                        if (!checked) {
                            hasUncheckedChild = true;
                        }
                    });
                    // window.console.log(nodeId);
                    _this.checkNode(nodeId, !hasUncheckedChild, modelValue);
                    return !hasUncheckedChild;
                } else {
                    // no children, return checked of myself
                    // window.console.log(nodeId);
                    return _this.isNodeChecked(nodeId, modelValue);
                }
            };
            checkNodeOnChildren(this.state.root, this.getNodeId(null, this.state.root));
            // window.console.log(modelValue);
        },
        expandTo: function(expandLevel) {
            var activeNodes = $.extend({}, this.state.activeNodes);
            var _this = this;
            var expand = function(parentId, node, level) {
                if (level < expandLevel) {
                    var nodeId = _this.getNodeId(parentId, node);
                    activeNodes[nodeId] = node;
                    if (node.children) {
                        node.children.forEach(function(child) {
                            expand(nodeId, child, level + 1);
                        });
                    }
                }
            };
            expand(null, this.state.root, 0);

            var previousActiveNodes = null;
            this.setState(function(previousState, currentProps) {
                previousActiveNodes = previousState.activeNodes;
                return {activeNodes: activeNodes};
            }, function() {
                _this.notifyEvent({
                    type: 'expand',
                    before: previousActiveNodes,
                    after: activeNodes
                });
            });
        },
        expandAll: function() {
            var activeNodes = $.extend({}, this.state.activeNodes);
            var root = this.state.root;
            var expand = function(node, parentNodeId) {
                if (!this.isLeaf(node)) {
                    var nodeId = this.getNodeId(parentNodeId, node);
                    activeNodes[nodeId] = node;
                    var _this = this;
                    node.children.forEach(function(child) {
                        expand.call(_this, child, nodeId);
                    });
                }
            };
            expand.call(this, root, null);
            // this.setState({activeNodes: activeNodes});
            var _this = this;
            var previousActiveNodes = null;
            this.setState(function(previousState, currentProps) {
                previousActiveNodes = previousState.activeNodes;
                return {activeNodes: activeNodes};
            }, function() {
                _this.notifyEvent({
                    type: 'expand',
                    before: previousActiveNodes,
                    after: activeNodes
                });
            });
        },
        collapseAll: function() {
            var _this = this;
            // var root = this.state.root;
            // var nodeIds = null;
            // if (this.isRootPaint()) {
            //     // this.collapseNode(root, this.getNodeId(null, root));
            //     nodeIds = [this.getNodeId(null, root)];
            // } else {
            //     var rootNodeId = this.getNodeId(null, root);
            //     if (root.children) {
            //         // root.children.forEach(function(node) {
            //         //     this.collapseNode(node, this.getNodeId(rootNodeId, node));
            //         // }.bind(this));
            //         nodeIds = root.children.map(function(node) {
            //             return _this.getNodeId(rootNodeId, node);
            //         });
            //     }
            // }
            // var regexp = new RegExp(nodeIds.map(function(nodeId) {
            //     return '(' + nodeId + ')';
            // }).join(NTree.NODE_SEPARATOR));
            // var activeNodes = $.extend({}, this.state.activeNodes);
            var activeNodes = {};
            Object.keys(activeNodes).forEach(function(key) {
                if (key.match(regexp)) {
                    delete activeNodes[key];
                }
            });
            var previousActiveNodes = null;
            this.setState(function(previousState, currentProps) {
                previousActiveNodes = previousState.activeNodes;
                return {activeNodes: activeNodes};
            }, function() {
                _this.notifyEvent({
                    type: 'collapse',
                    before: previousActiveNodes,
                    after: activeNodes
                });
            });
        },
        isRootPaint: function() {
            return this.getComponentOption('root');
        },
        getRootLabel: function() {
            var root = this.getComponentOption('root');
            if (typeof root === 'string') {
                return root;
            } else {
                return NTree.ROOT_LABEL;
            }
        },
        isActive: function(nodeId) {
            return this.state.activeNodes[nodeId];
        },
        isLeaf: function(node) {
            return !node.children || node.children.length == 0;
        },
        isInactiveSlibingWhenActive: function() {
            return this.getComponentOption('inactiveSlibing');
        },
        collapseNode: function(node, nodeId) {
            var regexp = new RegExp(nodeId);
            var activeNodes = $.extend({}, this.state.activeNodes);
            Object.keys(activeNodes).forEach(function(key) {
                if (key.match(regexp)) {
                    delete activeNodes[key];
                }
            });
            // this.setState({activeNodes: activeNodes});
            var _this = this;
            var previousActiveNodes = null;
            this.setState(function(previousState, currentProps) {
                previousActiveNodes = previousState.activeNodes;
                return {activeNodes: activeNodes};
            }, function() {
                _this.notifyEvent({
                    type: 'collapse',
                    before: previousActiveNodes,
                    after: activeNodes
                });
            });
        },
        expandNode: function(node, nodeId) {
            var activeNodes = $.extend({}, this.state.activeNodes);
            if (this.isInactiveSlibingWhenActive() && !this.isLeaf(node)) {
                // remove all slibings and their children from active list
                var lastHyphen = nodeId.lastIndexOf(NTree.NODE_SEPARATOR);
                if (lastHyphen > 0) {
                    var regexp = new RegExp(nodeId.substring(0, lastHyphen + 1));
                    Object.keys(activeNodes).forEach(function(key) {
                        if (key.match(regexp)) {
                            delete activeNodes[key];
                        }
                    });
                } else if (!this.isRootPaint()) {
                    // no root painted, current is top level node, and need inactive slibings
                    // clear all
                    activeNodes = {};
                }
            }
            activeNodes[nodeId] = node;
            // this.setState({activeNodes: activeNodes});
            var _this = this;
            var previousActiveNodes = null;
            this.setState(function(previousState, currentProps) {
                previousActiveNodes = previousState.activeNodes;
                return {activeNodes: activeNodes};
            }, function() {
                _this.notifyEvent({
                    type: 'expand',
                    before: previousActiveNodes,
                    after: activeNodes
                });
            });
        },
        /**
         * get top level nodes
         * @returns {{}[]}
         */
        getTopLevelNodes: function() {
            return this.getCodeTable().list();
        },
        /**
         * get avaiable top level nodes
         * @returns {CodeTable}
         */
        getCodeTable: function() {
            return this.getComponentOption('data');
        },
        getNodeIcon: function(node, nodeId) {
            var isLeaf = this.isLeaf(node);
            // not leaf, must be a folder, or node is defined as folder
            var isFolder = !isLeaf || node.folder;
            var active = this.isActive(nodeId);
            if (isFolder)  {
                if (isLeaf) {
                    return this.getCustomNodeIcon({
                        node: node,
                        active: active,
                        folder: true,
                        leaf: true
                    }, NTree.FOLDER_ICON);
                } else if (active) {
                    return this.getCustomNodeIcon({
                        node: node,
                        active: true,
                        folder: true,
                        leaf: false
                    }, NTree.FOLDER_OPEN_ICON);
                } else {
                    return this.getCustomNodeIcon({
                        node: node,
                        active: false,
                        folder: true,
                        leaf: false
                    }, NTree.FOLDER_ICON);
                }
            } else {
                return this.getCustomNodeIcon({
                    node: node,
                    active: active,
                    folder: false,
                    leaf: true
                }, NTree.FILE_ICON);
            }
        },
        getNodeText: function(node) {
            return node.text;
        },
        /**
         * get customized node icon
         * @param options {node: JSON, active: boolean, folder: boolean, leaf: boolean}
         */
        getCustomNodeIcon: function(options, defaultIcon) {
            var icon = this.getComponentOption('nodeIcon');
            if (typeof icon === 'function') {
                return icon.call(this, options);
            } else if (icon) {
                return icon;
            } else {
                return defaultIcon;
            }
        },
        getNodeOperationIcon: function(node, nodeId) {
            var isLeaf = this.isLeaf(node);
            // not leaf, must be a folder, or node is defined as folder
            var isFolder = !isLeaf || node.folder;
            var active = this.isActive(nodeId);
            if (isFolder) {
                if (isLeaf) {
                    return this.getCustomNodeOperationIcon({
                        node: node,
                        active: active,
                        folder: true,
                        leaf: true
                    }, NTree.OP_FOLDER_LEAF_ICON);
                } else {
                    if (active) {
                        return this.getCustomNodeOperationIcon({
                            node: node,
                            active: true,
                            folder: true,
                            leaf: false
                        }, NTree.OP_FOLDER_OPEN_ICON);
                    } else {
                        return this.getCustomNodeOperationIcon({
                            node: node,
                            active: false,
                            folder: true,
                            leaf: false
                        }, NTree.OP_FOLDER_ICON);
                    }
                }
            } else {
                return this.getCustomNodeOperationIcon({
                    node: node,
                    active: active,
                    folder: false,
                    leaf: true
                }, NTree.OP_FILE_ICON);
            }
        },
        /**
         * get customized node operation icon
         * @param options {node: JSON, active: boolean, folder: boolean, leaf: boolean}
         */
        getCustomNodeOperationIcon: function(options, defaultIcon) {
            var icon = this.getComponentOption('opNodeIcon');
            if (typeof icon === 'function') {
                return icon.call(this, options);
            } else if (icon) {
                return icon;
            } else {
                return defaultIcon;
            }
        },
        isNodeCanSelect: function(node) {
            var check = this.getComponentOption('check');
            if (typeof check === 'function') {
                return check.call(this, node);
            } else if (check) {
                return check;
            } else {
                return false;
            }
        },
        isNodeCheckCanChange: function(node) {
            var change = this.getComponentOption('valueCanCheck');
            if (typeof change === 'function') {
                return change.call(this, node);
            } else if (change != null) {
                return change;
            } else {
                return true;
            }
        },
        /**
         * is multiple selection allowed
         * @returns {boolean}
         */
        isMultipleSelection: function() {
            return this.getComponentOption('multiple');
        },
        /**
         * is hierarchy check, effective only when multiple is true
         * @returns {boolean}
         */
        isHierarchyCheck: function() {
            return this.getComponentOption('hierarchyCheck') && this.isMultipleSelection();
        },
        getNodeId: function(parentNodeId, node) {
            var nodeId = null;
            if (parentNodeId) {
                nodeId = parentNodeId + NTree.NODE_SEPARATOR + node.id;
            } else {
                nodeId = '' + node.id;
            }
            return nodeId;
        }
    }));

    // expose to global
    $pt.Components.NTree = NTree;
    $pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.Tree, function (model, layout, direction, viewMode) {
		return <$pt.Components.NTree {...$pt.LayoutHelper.transformParameters(model, layout, direction, viewMode)}/>;
	});
}(window, jQuery, React, ReactDOM, $pt));
