/**
 * Jumbortron
 */
var NJumbortron = React.createClass({
    propTypes: {
        highlightText: React.PropTypes.oneOfType(
            React.PropTypes.string,
            React.PropTypes.arrayOf(React.PropTypes.string)).isRequired
    },
    renderText: function () {
        if (Array.isArray(this.props.highlightText)) {
            return this.props.highlightText.map(function (text) {
                return <h4>{text}</h4>;
            });
        } else {
            return <h4>this.props.highlightText</h4>;
        }
    },
    render: function () {
        return (
            <div className="jumbotron">
                {this.renderText()}
            </div>
        );
    }
});