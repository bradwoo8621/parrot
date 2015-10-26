(function(context, $, $pt) {
    var NTree = React.createClass($pt.defineCellComponent({
        propTypes: {
            // model
            model: React.PropTypes.object,
            // CellLayout
            layout: React.PropTypes.object
        },
        getDefaultProps: function() {
            return {
                defaultOptions: {
                    root: 'Root'
                }
            };
        },
        getInitialState: function() {
            return {};
        },
        render: function() {
            return (<div className={this.getComponentCSS('n-tree')}>
                <ul className='nav'>
                </ul>
            </div>);
        }
    }));
} (this, jQuery, $pt));
