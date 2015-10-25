(function (context, $) {
	var $demo = $pt.getService(context, '$demo');


	var painter = function () {
		var modelTemplate = {};
		var model = $pt.createModel(modelTemplate);
		var modelCode = $demo.convertModelCreatorToString({
			variable: 'model',
			template: modelTemplate
		});
		var compCode = $demo.convertComponentCreatorToString({
			tag: 'NForm',
			model: 'model',
			layout: 'layout'
		});

		var all = {
			defaultOptions: function () {
				var layoutTemplate = {
					nothing: {
						label: 'Nothing in Component Area',
						comp: {
							type: $pt.ComponentConstants.Nothing
						},
						pos: {
							width: 4
						}
					}
				};
				var layoutCode = $demo.convertFormLayoutCreatorToString({
					variable: 'layout',
					template: layoutTemplate
				});
				return {
					id: 'toggle-default',
					title: 'Default',
					desc: ['Nothing!',
						<span>Don't doubt, Nothing is registered in Form Cell for cell placeholder by <code>pos.width</code>.
				In example, 4 columns placed. Enjoy it.</span>,
						<span>Also can using CSS <code>col-push-sm-x</code>, <code>col-push-md-x</code>,
				<code>col-push-md-x</code> in next cell's <code>css.cell</code> to do the same thing.</span>],
					xml: <NForm model={model} layout={$pt.createFormLayout(layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 10
				};
			}
		};
		return $demo.convertToExampleList(all);
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.formNothing = function () {
		React.render(<ExampleList title='Form Nothing'
		                          formType='$pt.ComponentConstants.Nothing'
		                          items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));