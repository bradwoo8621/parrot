(function (context, $) {
	var $demo = $pt.getService(context, '$demo');


	var painter = function () {
		var all = {
			defaultOptions: function () {
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NNormalLabel',
					text: '"Content of label"',
					style: '"danger"',
					className: '"your-class-name"'
				});
				return {
					id: 'label-default',
					title: 'Default',
					desc: 'Label. Text can be string or string array.',
					xml: {width: 12,
						xml: <div className='no-fix-top'><NNormalLabel text='Content of label' style='danger'
						                                               className='your-class-name'/></div>
					},
					code: [compCode],
					index: 10
				};
			}
		};
		return $demo.convertToExampleList(all);
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.label = function () {
		React.render(<ExampleList title='NNormalLabel'
		                          formType='<NNormalLabel />'
		                          items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));