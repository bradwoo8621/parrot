/**
 * Jumbortron
 */
(function (window, $, React, ReactDOM, $pt) {
	var NJumbortron = React.createClass({
		displayName: 'NJumbortron',
		renderText: function () {
			if (Array.isArray(this.props.highlightText)) {
				return this.props.highlightText.map(function (text, textIndex) {
					return <h4 key={textIndex}>{text}</h4>;
				});
			} else {
				return <h4>{this.props.highlightText}</h4>;
			}
		},
		render: function () {
			return (
				<div className="n-jumbotron jumbotron">
					{this.renderText()}
				</div>
			);
		}
	});
	$pt.Components.NJumbortron = NJumbortron;
}(window, jQuery, React, ReactDOM, $pt));
