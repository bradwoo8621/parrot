(function (context, $) {
	var $demo = $pt.getService(context, '$demo');

	var painter = function () {
		var items = [
			{
				id: 'defineWebContext',
				title: 'defineWebContext',
				pattern: '$pt.defineWebContext(webContext: string) : $pt',
				desc: <span>Define web context, such as <code>/context</code>.</span>
			},
			{
				id: 'defineURL',
				title: 'defineURL',
				pattern: '$pt.defineURL(key: string, urlRelateToWebContext: string) : $pt',
				desc: <span>Define url by given key, url is related to web context, such as <code>/path</code>.</span>
			}, {
				id: 'getURL',
				title: 'getURL',
				pattern: '$pt.getURL(key: string) : string',
				desc: <span>Get url by given key, returns url with web context.</span>
			}, {
				id: 'getUrlData',
				title: 'getUrlData',
				pattern: '$pt.getUrlData(params: string) : JSON',
				desc:
					<span>Transform given string parameter or URL search string to JSON. Parameter can be skipped.<br/>
				<span className='required'>Include jQuery deparam first.</span></span>
			}, {
				id: 'relocatePage',
				title: 'relocatePage',
				pattern: '$pt.relocatePage(url: string, data: JSON)',
				desc: <span>Jump to the given url and transform data to url parameters.</span>
			}
		];
		return items;
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.urls = function () {
		React.render(<APIList title='URL API' items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));