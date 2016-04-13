(function (window, $, React, ReactDOM, $pt) {
	var NCodeTableWrapper = React.createClass($pt.defineCellComponent({
		displayName: 'CodeTableWrapper',
		statics: {
			ON_LOADING_ICON: 'fa fa-fw fa-spinner fa-spin',
			ON_LOADING: 'On Loading...'
		},
		propTypes: {
		},
		getDefaultProps: function () {
			return {};
		},
		getInitialState: function () {
			return {};
		},
		/**
		 * did mount
		 */
		componentDidMount: function () {
			var codetable = this.getCodeTable();
			if (this.state.paintWrapper) {
				codetable.initializeRemote().done(function() {
					this.setState({
						paintWrapper: false
					});
				}.bind(this));
			}
		},
		render: function() {
			var className = this.props.className ? (this.props.className + ' n-codetable-wrapper') : 'n-codetable-wrapper';
			var codetable= this.getCodeTable();
			if (!Array.isArray(codetable) && codetable.isRemoteButNotInitialized()) {
				this.state.paintWrapper = true;
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
		}
	}));
	$pt.Components.NCodeTableWrapper = NCodeTableWrapper;
}(window, jQuery, React, ReactDOM, $pt));
