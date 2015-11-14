(function(context, $, $pt) {
	var NSelectTree = React.createClass($pt.defineCellComponent({
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
				},
				treeLayout: {
					comp: {
						root: false,
						check: 'selected',
						hierarchyCheck: true,
						inactiveSlibing: false,
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
			this.registerToComponentCentral();
		},
		/**
		 * did mount
		 */
		componentDidMount: function () {
			// add post change listener to handle model change
			this.addPostChangeListener(this.__forceUpdate);
			this.addEnableDependencyMonitor();
			this.registerToComponentCentral();
		},
		/**
		 * will unmount
		 */
		componentWillUnmount: function () {
			// remove post change listener to handle model change
			this.removePostChangeListener(this.__forceUpdate);
			this.removeEnableDependencyMonitor();
			this.unregisterFromComponentCentral();
		},
		renderTree: function() {
			var layout = $pt.createCellLayout('tree', this.getTreeLayout());
			var model = $pt.createModel({tree: this.getAvailableTreeModel()});
			return <NTree model={model} layout={layout}/>;
		},
		renderText: function() {
			if (this.isEnabled()) {
				return (<OverlayTrigger trigger='click' rootClose placement='bottom'
					overlay={<Popover className='n-select-tree-popover'>{this.renderTree()}</Popover>}>
					<div className='input-group form-control'>
						<span className='text'>Yes</span>
						<span className='fa fa-fw fa-sort-down pull-right' />
					</div>
				</OverlayTrigger>);
			} else {
				return (<div className='input-group form-control'>
					<span className='text'>Yes</span>
					<span className='fa fa-fw fa-sort-down pull-right' />
				</div>);
			}
		},
		render: function() {
			var css = {
				'n-disabled': !this.isEnabled()
			};
			css[this.getComponentCSS('n-select-tree')] = true;
			return (<div className={$pt.LayoutHelper.classSet(css)} tabIndex='0'>
				{this.renderText()}
				{this.renderNormalLine()}
				{this.renderFocusLine()}
			</div>);
		},
		getTreeModel: function() {
			return this.getComponentOption('data');
		},
		getAvailableTreeModel: function() {
			var filter = this.getComponentOption('parentFilter');
			var tree = this.getTreeModel();
			if (filter) {
				return filter.call(this, tree);
			} else {
				return tree;
			}
		},
		getTreeLayout: function() {
			var treeLayout = this.getComponentOption('treeLayout');
			if (treeLayout) {
				return $.extend(true, this.props.treeLayout, treeLayout);
			} else {
				return this.props.treeLayout;
			}
		}
	}));
	context.NSelectTree = NSelectTree;
}(this, jQuery, $pt));
