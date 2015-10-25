(function (context, $) {
	var $demo = $pt.getService(context, '$demo');

	var painter = function () {
		var items = [
			{
				id: 'getService',
				title: 'getService',
				pattern: '$pt.getService(context: object, serviceName: string) : object',
				desc: <span>Get service by given name from given context, create service object if not exists.<br/>
				eg. <br/>
				In a.js<br/>
				<code>var $service = $pt.getService(window, '$service');</code><br/>
				<code>$service.doSomething = function() {'\u007B\u007D'};</code><br/>
				In b.js<br/>
				<code>var $service = $pt.getService(window, '$service');</code><br/>
				<code>$service.doSomething();</code><br/>
				Purpose is keeping services, try not to be overwritten in different js files.</span>
			}
		];
		return items;
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.services = function () {
		React.render(<APIList title='Service API' items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));