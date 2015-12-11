/**
 * page footer.<br>
 */
(function (window, $, React, ReactDOM, $pt) {
	var NPageFooter = React.createClass({
		displayName: 'NPageFooter',
		statics: {
			TECH_BASE: 'Parrot',
			TECH_URL: 'https://github.com/bradwoo8621/parrot',
			COMPANY: 'NEST',
			COMPANY_URL: 'https://github.com/bradwoo8621/nest',
			LEFT_TEXT: 'For best viewing, we recommend using the latest Chrome version.'
		},
		propTypes: {
			name: React.PropTypes.string.isRequired
		},
		getDefaultProps: function () {
			return {};
		},
		renderTech: function () {
			if (NPageFooter.TECH_BASE != null && !NPageFooter.TECH_BASE.isBlank()) {
				return (
					<span>, on <a href={NPageFooter.TECH_URL} target='_blank' tabIndex='-1'>{NPageFooter.TECH_BASE}</a></span>);
			}
			return null;
		},
		renderCompany: function () {
			if (NPageFooter.COMPANY != null && !NPageFooter.COMPANY.isBlank()) {
				return (
					<span>, by <a href={NPageFooter.COMPANY_URL} target="_blank" tabIndex='-1'>{NPageFooter.COMPANY}</a></span>);
			}
			return null;
		},
		render: function () {
			return (
				<footer className="footer">
					<div className="container">
						<p className='text-muted' style={{display: 'inline-block'}}>
							<span>{NPageFooter.LEFT_TEXT}</span>
						</p>

						<p className="text-muted pull-right" style={{display: 'inline-block'}}>
							{this.props.name}
							{this.renderTech()}
							{this.renderCompany()}.
						</p>
					</div>
				</footer>);
		}
	});
	$pt.Components.NPageFooter = NPageFooter;
}(window, jQuery, React, ReactDOM, $pt));
