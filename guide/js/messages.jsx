(function (context, $) {
	var $demo = $pt.getService(context, '$demo');

	var painter = function () {
		var items = [
			{
				id: 'defineMessage',
				title: 'defineMessage',
				pattern: '$pt.defineMessage(key: string, message: string) : $pt',
				desc: <span><code>defineMessage</code> creates a JSON object <code>$pt.messages</code> to keep the messages.
				Only the latest message will be kept if key duplicated.</span>
			},
			{
				id: 'getMessage',
				title: 'getMessage',
				pattern: '$pt.getMessage(key: string) : string',
				desc: 'Get message by given key, return null if not exists.'
			}
		];
		return items;
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.messages = function () {
		React.render(<APIList title='Message API' items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));