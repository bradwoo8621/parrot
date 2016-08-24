/**
 * Created by brad.wu on 9/10/2015.
 */
(function (window, $, React, ReactDOM, $pt) {
	var NFormButtonFooter = React.createClass($pt.defineCellComponent({
		displayName: 'NFormButtonFooter',
		render: function () {
			var buttonLayout = this.getButtonLayout();
			return <$pt.Components.NPanelFooter model={this.props.model}
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
	$pt.Components.NFormButtonFooter = NFormButtonFooter;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.ButtonFooter, function (model, layout, direction, viewMode) {
		return <$pt.Components.NFormButtonFooter {...$pt.LayoutHelper.transformParameters(model, layout, direction, viewMode)}/>;
	});
}(window, jQuery, React, ReactDOM, $pt));
