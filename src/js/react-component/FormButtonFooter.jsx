/**
 * Created by brad.wu on 9/10/2015.
 */
(function (context, $, $pt) {
	var NFormButtonFooter = React.createClass($pt.defineCellComponent({
		propTypes: {
			// model
			model: React.PropTypes.object,
			// layout, FormLayout
			layout: React.PropTypes.object
		},
		componentWillUpdate: function() {
			this.unregisterFromComponentCentral();
		},
		componentDidUpdate: function() {
			this.registerToComponentCentral();
		},
		componentDidMount: function() {
			this.registerToComponentCentral();
		},
		componentWillUnmount: function() {
			this.unregisterFromComponentCentral();
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
	context.NFormButtonFooter = NFormButtonFooter;
}(this, jQuery, $pt));
