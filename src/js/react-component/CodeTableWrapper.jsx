(function (window, $, React, ReactDOM, $pt) {
	var NCodeTableWrapper = React.createClass($pt.defineCellComponent({
		displayName: 'CodeTableWrapper',
		statics: {
			ON_LOADING_ICON: 'fa fa-fw fa-spinner fa-spin',
			ON_LOADING: 'On Loading...'
		},
		getDefaultProps: function () {
			return {};
		},
		componentWillUpdate: function() {
		},
		componentDidUpdate: function() {
		},
		/**
		 * did mount
		 */
		componentDidMount: function () {
			var codetable = this.getCodeTable();
			if (this.state.paintWrapper) {
				if (this.hasParent()) {
					var parentValue = this.getParentValue();
					if (parentValue == null) {
						if (this.loadWhenNoParentValue()) {
							// load all when no parent value
							codetable.initializeRemote().done(this.repaint);
						} else {
							codetable.setAsRemoteInitialized();
							this.repaint();
						}
					} else {
						// only load segments according to parent value
						codetable.loadRemoteCodeSegment(parentValue).done(this.repaint);
					}
				} else {
					// no parent, load all
					codetable.initializeRemote().done(this.repaint);
				}
			} else {
				var onMounted = this.props.onMounted;
				if (onMounted) {
					onMounted.call(this);
				}
			}
		},
		componentWillUnmount: function() {
		},
		repaint: function() {
			var onMounted = this.props.onMounted;
			this.setState({
				paintWrapper: false
			}, onMounted ? onMounted : undefined);
		},
		needWrapper: function() {
			var codetable= this.getCodeTable();
			var need = true;
			if (Array.isArray(codetable)) {
				// is an array, not code table instance
				need = false;
			} else if (this.hasParent() && this.getParentValue() == null && !this.loadWhenNoParentValue()) {
				// has parent, no parent value, no options when no parent value
				need = false;
			} else if (!codetable.isRemoteButNotInitialized()) {
				// initialized remote data
				need = false;
			}
			return need;
		},
		render: function() {
			if (this.needWrapper()) {
				this.state.paintWrapper = true;
				var className = this.props.className ? (this.props.className + ' n-codetable-wrapper form-control') : 'n-codetable-wrapper form-control';
				return (<div className={className}>
					<span className={'n-ctol-icon ' + NCodeTableWrapper.ON_LOADING_ICON} />
					<span className='n-ctol-label'>{NCodeTableWrapper.ON_LOADING}</span>
				</div>);
			} else {
				this.state.paintWrapper = false;
				return this.getWrappedRenderer().call(this);
			}
		},
		getCodeTable: function() {
			return this.props.codetable;
		},
		getWrappedRenderer: function() {
			return this.props.renderer;
		},
		hasParent: function() {
			return this.props.hasParent;
		},
		loadWhenNoParentValue: function() {
			return this.props.hasParent ? this.props.loadWhenNoParentValue : true;
		},
		getParentValue: function() {
			return this.props.parentValue;
		}
	}));
	$pt.Components.NCodeTableWrapper = NCodeTableWrapper;
}(window, jQuery, React, ReactDOM, $pt));
