(function (context, $) {
	var $demo = $pt.getService(context, '$demo');


	var painter = function () {
		var all = {
			defaultOptions: function () {
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NPageFooter',
					name: '"Github"'
				});
				return {
					id: 'page-footer-default',
					title: 'Default',
					desc: 'Page footer.',
					xml: {width: 12, xml: <div className='no-fix-bottom'><NPageFooter name='Github'/></div>},
					code: [compCode],
					index: 10
				};
			},
			constants: function () {
				var statics = {
					TECH_BASE: NPageFooter.TECH_BASE,
					TECH_URL: NPageFooter.TECH_URL,
					COMPANY: NPageFooter.COMPANY,
					COMPANY_URL: NPageFooter.COMPANY_URL,
					LEFT_TEXT: NPageFooter.LEFT_TEXT
				};
				return {
					id: 'page-footer-constants',
					title: 'Constants',
					desc: 'Available constants. Constants must be change before construct component.',
					index: 20,
					code: $demo.convertJSON({
						variable: 'NPageFooter',
						json: {
							statics: statics
						}
					})
				};
			}
		};
		return $demo.convertToExampleList(all);
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.pageFooter = function () {
		React.render(<ExampleList title='NPageFooter'
		                          formType='<NPageFooter />'
		                          items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));