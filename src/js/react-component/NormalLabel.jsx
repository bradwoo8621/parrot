/**
 * Created by brad.wu on 9/2/2015.
 */
(function (window, $, React, ReactDOM, $pt) {
	var NNormalLabel = React.createClass({
		displayName: 'NNormalLabel',
		propTypes: {
			text: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.arrayOf(React.PropTypes.string)]),
			style: React.PropTypes.string,
			className: React.PropTypes.string
		},
		getDefaultProps: function () {
			return {};
		},
		render: function () {
			var texts = this.getText();
			if (!Array.isArray(texts)) {
				texts = [texts];
			}
			var css = {
				'n-normal-label': true
			};
			if (this.props.className) {
				css[this.props.className] = true;
			}
			if (this.props.style) {
				css['n-label-' + this.props.style] = true;
			}
			if (this.props.size) {
				css['n-label-' + this.props.size] = true;
			}
			return (<span className={$pt.LayoutHelper.classSet(css)}>
            {texts.map(function (text, textIndex) {
	            return <span key={textIndex}>{text}</span>;
            })}
        </span>);
		},
		getText: function () {
			return this.props.text;
		}
	});
	$pt.Components.NNormalLabel = NNormalLabel;
}(window, jQuery, React, ReactDOM, $pt));
