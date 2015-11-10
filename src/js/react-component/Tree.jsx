(function(context, $, $pt) {
    var NTree = React.createClass($pt.defineCellComponent({
        statics: {
            ROOT_LABEL: 'Root',
            FOLDER_ICON: 'folder-o',
            FOLDER_OPEN_ICON: 'folder-open-o',
            FILE_ICON: 'file-o',
            OP_FOLDER_LEAF_ICON: 'angle-right',
            OP_FOLDER_ICON: 'angle-double-right',
            OP_FOLDER_OPEN_ICON: 'angle-double-down',
            OP_FILE_ICON: ''
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
                    root: true,
                    inactiveSlibing: true,
                    opIconEnabled: false
                }
            };
        },
        getInitialState: function() {
            return {
                activeNodes: {},
                root: {text: this.getRootLabel(), id: 0}
            };
        },
        /**
    	 * will update
    	 * @param nextProps
    	 */
    	componentWillUpdate: function (nextProps) {
    		// remove post change listener to handle model change
    		this.removePostChangeListener(this.__forceUpdate);
    	},
    	/**
    	 * did update
    	 * @param prevProps
    	 * @param prevState
    	 */
    	componentDidUpdate: function (prevProps, prevState) {
    		// add post change listener to handle model change
    		this.addPostChangeListener(this.__forceUpdate);
    	},
        componentWillMount: function() {
            var expandLevel = this.getComponentOption('expandLevel');
            if (expandLevel == null) {
                // default expand root
                expandLevel = 0;
            }
            if (expandLevel === 'all') {
                expandLevel = 9999;
            }
            var _this = this;
            var expand = function(parentId, node, level) {
                if (level <= expandLevel) {
                    var nodeId = _this.getNodeId(parentId, node);
                    _this.state.activeNodes[nodeId] = node;
                    if (node.children) {
                        node.children.forEach(function(child) {
                            expand(nodeId, child, level + 1);
                        });
                    }
                }
            };
            this.state.root.children = this.getValueFromModel();
            expand(null, this.state.root, 0);
        },
    	/**
    	 * did mount
    	 */
    	componentDidMount: function () {
    		// add post change listener to handle model change
    		this.addPostChangeListener(this.__forceUpdate);
    	},
    	/**
    	 * will unmount
    	 */
    	componentWillUnmount: function () {
    		// remove post change listener to handle model change
    		this.removePostChangeListener(this.__forceUpdate);
    	},
        renderCheck: function(node, nodeId) {
            var checkId = this.getCheckBoxId(node);
            if (!checkId) {
                return null;
            }
            var model = $pt.createModel(node);
            model.useBaseAsCurrent();
            var layout = $pt.createCellLayout(checkId, {
                comp: {
                    type: $pt.ComponentConstants.Check
                }
            });
            if (this.getComponentOption('hierarchyCheck')) {
                model.addPostChangeListener(checkId, this.onHierarchyCheck.bind(this, node, nodeId));
            }
            return <NCheck model={model} layout={layout} />;
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
                    <NIcon {...expandableIconAttrs} />
                </a>);
            }
            var folderIconAttrs = {
                icon: this.getNodeIcon(node, nodeId),
                fixWidth: true,
                iconClassName: 'node-icon'
            };
            var folderIcon = (<a href='javascript:void(0);'
                            onClick={this.onNodeClicked.bind(this, node, nodeId)}>
                <NIcon {...folderIconAttrs}/>
            </a>);

            var active = this.isActive(nodeId) ? 'active' : null;
            return (
                <li className={active} key={nodeId}>
                    {opIcon}
                    {folderIcon}
                    {this.renderCheck(node, nodeId)}
                    <a
                        href='javascript:void(0);'
                        onClick={this.onNodeClicked.bind(this, node, nodeId)}>
                        <span className='node-text'>{this.getNodeText(node)}</span>
                    </a>
                    {this.renderNodes(node, nodeId)}
                </li>
            );
        },
        renderNodes: function(parent, parentNodeId) {
            var children = null;
            if (parent) {
                children = parent.children;
            } else {
                children = this.getValueFromModel();
            }
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
            var root = this.state.root;
            root.children = this.getValueFromModel();
            return this.isRootPaint() ? this.renderRoot() : this.renderNodes(root);
        },
        render: function() {
            return (
                <div className={this.getComponentCSS('n-tree')}>
                    {this.renderTopLevel()}
                </div>
            );
        },
        onNodeClicked: function(node, nodeId) {
            if (this.state.activeNodes[nodeId]) {
                this.inactiveNode(node, nodeId);
            } else {
                this.activeNode(node, nodeId);
            }
        },
        onHierarchyCheck: function(node, nodeId, evt, toChildOnly) {
            var _this = this;

            var value = evt.new;
            // to child
            var checkId = this.getCheckBoxId(node);
            if (checkId) {
                node[checkId] = value;
            }
            if (node.children) {
                node.children.forEach(function(child) {
                    _this.onHierarchyCheck(child, _this.getNodeId(nodeId, child), evt, true);
                });
            }
            // to parent
            if (!toChildOnly) {
                this.hierarchyCheckToAncestors(nodeId);
            }

            this.forceUpdate();
        },
        hierarchyCheckToAncestors: function(nodeId) {
            var _this = this;

            var index = nodeId.lastIndexOf('-');
            if (index > 0) {
                var parentNodeId = nodeId.substring(0, index);
                var parentNode = this.state.activeNodes[parentNodeId];
                var notAllChecked = parentNode.children.some(function(child) {
                    var checkId = _this.getCheckBoxId(child);
                    if (checkId) {
                        return !child[checkId];
                    }
                });
                var checkId = this.getCheckBoxId(parentNode);
                if (checkId) {
                    // if chlidren are not all checked, set as false
                    parentNode[checkId] = !notAllChecked;
                }
                // move to ancestors
                this.hierarchyCheckToAncestors(parentNodeId);
            }
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
        inactiveNode: function(node, nodeId) {
            var regexp = new RegExp(nodeId);
            var activeNodes = this.state.activeNodes;
            Object.keys(activeNodes).forEach(function(key) {
                if (key.match(regexp)) {
                    delete activeNodes[key];
                }
            });
            this.setState({activeNodes: activeNodes});
        },
        activeNode: function(node, nodeId) {
            var activeNodes = this.state.activeNodes;
            if (this.isInactiveSlibingWhenActive() && !this.isLeaf(node)) {
                // remove all slibings and their children from active list
                var lastHyphen = nodeId.lastIndexOf('-');
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
            this.setState({activeNodes: activeNodes});
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
            var render = this.getComponentOption('textRender');
            if (render) {
                return render.call(this, node);
            } else {
                return node.text;
            }
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
        getCheckBoxId: function(node) {
            var check = this.getComponentOption('check');
            if (typeof check === 'function') {
                return check.call(this, node);
            } else if (check) {
                return check;
            } else {
                return null;
            }
        },
        getNodeId: function(parentNodeId, node) {
            var nodeId = null;
            if (parentNodeId) {
                nodeId = parentNodeId + '-' + node.id;
            } else {
                nodeId = '' + node.id;
            }
            return nodeId;
        }
    }));

    // expose to global
    context.NTree = NTree;
}(this, jQuery, $pt));
