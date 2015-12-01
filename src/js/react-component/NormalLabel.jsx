/**
 * Created by brad.wu on 9/2/2015.
 */
(function (context, $, $pt) {
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
            {texts.map(function (text) {
	            return <span>{text}</span>;
            })}
        </span>);
		},
		getText: function () {
			return this.props.text;
		}
	});
	context.NNormalLabel = NNormalLabel;
}(this, jQuery, $pt));
