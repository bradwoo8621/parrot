/**
 * page footer.<br>
 */
var NPageFooter = React.createClass({
	propTypes: {
		name: React.PropTypes.string.isRequired
	},
	render: function() {
		return (
			<footer className="footer">
				<div className="container">
					<p className="text-muted pull-right">
						Code licensed under <a href="https://www.apache.org/licenses/LICENSE-2.0" target="_blank">Apache License 2.0</a>. {this.props.name} by <a href="https://github.com/bradwoo8621/nest" target="_blank">NEST@Github.</a>
					</p>
				</div>
			</footer>);
	}
});