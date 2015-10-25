(function (context, $) {
	var $demo = $pt.getService(context, '$demo');


	var painter = function () {
		var all = {
			defaultOptions: function () {
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NJumbortron',
					highlightText: '"Hello world!"'
				});
				return {
					id: 'jumborton-default',
					title: 'Default',
					desc: 'Jumborton. Text can be string or string array.',
					xml: {
						width: 12,
						xml: <div className='no-fix-top'><NJumbortron highlightText='Hello world!'/></div>
					},
					code: [compCode],
					index: 10
				};
			}
		};
		return $demo.convertToExampleList(all);
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.jumborton = function () {
		React.render(<ExampleList title='NJumbortron'
		                          formType='<NJumbortron />'
		                          items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));