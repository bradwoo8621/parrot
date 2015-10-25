(function (context, $) {
	var $demo = $pt.getService(context, '$demo');


	var painter = function () {
		var toPage = function (pageIndex) {
			alert("Jump to page: " + pageIndex);
		};

		var all = {
			defaultOptions: function () {
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NPagination'
				});
				return {
					id: 'pagination-default',
					title: 'Default',
					desc: 'Pagination.',
					xml: {width: 12, xml: <NPagination />},
					code: [compCode],
					index: 10
				};
			},
			pageCount: function () {
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NPagination',
					pagaCount: 10
				});
				return {
					id: 'pagination-pageCount',
					title: 'Page Count',
					desc: 'Pagination.',
					xml: {width: 12, xml: <NPagination pageCount={10}/>},
					code: [compCode],
					index: 20
				};
			},
			currentPageIndex: function () {
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NPagination',
					pagaCount: 10,
					currentPageIndex: 5
				});
				return {
					id: 'pagination-pageIndex',
					title: 'Page Index',
					desc: 'Pagination.',
					xml: {width: 12, xml: <NPagination pageCount={10} currentPageIndex={5}/>},
					code: [compCode],
					index: 30
				};
			},
			maxPageButtons: function () {
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NPagination',
					pagaCount: 10,
					maxPageButtons: 3
				});
				return {
					id: 'pagination-pageIndex',
					title: 'Max Page Buttons',
					desc: 'Pagination.',
					xml: {width: 12, xml: <NPagination pageCount={10} maxPageButtons={3}/>},
					code: [compCode],
					index: 40
				};
			},
			showStatus: function () {
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NPagination',
					pagaCount: 10,
					showStatus: false
				});
				return {
					id: 'pagination-status',
					title: 'Status',
					desc: 'Pagination.',
					xml: {width: 12, xml: <NPagination pageCount={10} showStatus={false}/>},
					code: [compCode],
					index: 50
				};
			},
			toPage: function () {
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NPagination',
					pagaCount: 10,
					toPage: 'toPage'
				});
				return {
					id: 'pagination-event',
					title: 'Event',
					desc: 'Pagination.',
					xml: {width: 12, xml: <NPagination pageCount={10} toPage={toPage}/>},
					code: [$demo.convertJSON({variable: 'toPage', json: toPage}), compCode],
					index: 60
				};
			}
		};
		return $demo.convertToExampleList(all);
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.pagination = function () {
		React.render(<ExampleList title='NPagination'
		                          formType='<NPagination />'
		                          items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));