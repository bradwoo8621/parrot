/**
 * Created by brad.wu on 9/10/2015.
 */
var NFormButtonFooter = React.createClass($pt.defineCellComponent({
	propTypes: {
		// model
		model: React.PropTypes.object,
		// layout, FormLayout
		layout: React.PropTypes.object
	},
	render: function () {
		var buttonLayout = this.getButtonLayout();
		return <NPanelFooter model={this.props.model}
		                     save={buttonLayout.save}
		                     validate={buttonLayout.validate}
		                     cancel={buttonLayout.cancel}
		                     reset={buttonLayout.reset}
		                     left={buttonLayout.left}
		                     right={buttonLayout.right}/>;
	},
	getButtonLayout: function () {
		return this.getComponentOption('buttonLayout');
	}
}));