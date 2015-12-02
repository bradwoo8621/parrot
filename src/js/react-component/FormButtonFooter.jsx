/**
 * Created by brad.wu on 9/10/2015.
 */
(function (context, $, $pt) {
	var NFormButtonFooter = React.createClass($pt.defineCellComponent({
		displayName: 'NFormButtonFooter',
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
								 view={this.isViewMode()}
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
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.ButtonFooter, function (model, layout, direction, viewMode) {
		return <NFormButtonFooter {...$pt.LayoutHelper.transformParameters(model, layout, direction, viewMode)}/>;
	});
}(this, jQuery, $pt));
