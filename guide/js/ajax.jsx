(function (context, $) {
	var $demo = $pt.getService(context, '$demo');

	var painter = function () {
		var items = [
			{
				id: 'doDelete',
				title: 'doDelete',
				pattern: '$pt.doDelete(url: string, data: JSON, settings: JSON) : $pt',
				desc: <span>Send data to server side by <code>DELETE</code> protocol.<br/>
				Using the following settings:<br/>
				<code>method: "DELETE"</code><br/>
				<code>dataType: "json"</code><br/>
				<code>contentType: "text/plain; charset=UTF-8"</code><br/>
				All settings can be replaced by parameter <code>settings</code>.<br/><br/>
				In <code>settings</code>, keys are same as jQuery ajax, three more keys provided:<br/>
				<code>quiet</code>, default false, show OnRequestDialog automatically.<br/>
				<code>done</code>, function same as jQuery ajax done(<code>function (data, textStatus,
						jqXHR)</code>).<br/>
				<code>fail</code>, function same as jQuery ajax fail(<code>function (jqXHR, textStatus,
						errorThrown)</code>).
				Or a JSON object to deal with the special jqXHR status,
				such as <code>{'\u007B'}fail: {'\u007B'}'404': function() {'\u007B\u007D\u007D\u007D'}</code>.<br/>
				Any fail if no callback defined, show ExceptionDialog automatically.</span>
			},
			{
				id: 'doGet',
				title: 'doGet',
				pattern: '$pt.doGet(url: string, data: JSON, settings: JSON) : $pt',
				desc: <span>Send data to server side by <code>GET</code> protocol.<br/>
				Parameters are same as <code>doDelete</code>.</span>
			}, {
				id: 'doPost',
				title: 'doPost',
				pattern: '$pt.doPost(url: string, data: JSON, settings: JSON) : string',
				desc: <span>Send data to server side by <code>POST</code> protocol.<br/>
				Parameters are same as <code>doDelete</code>.</span>
			}, {
				id: 'doPut',
				title: 'doPut',
				pattern: '$pt.doPut(url: string, data: JSON, settings: JSON)',
				desc: <span>Send data to server side by <code>PUT</code> protocol.<br/>
				Parameters are same as <code>doDelete</code>.</span>
			}, {
				id: 'mock',
				title: 'mock',
				pattern: '$pt.mock()',
				desc: <span>Sames as <code>$.mockjax</code>, accepts any paramters which accepted by Mockjax.<br/>
				Include Mockjax first if call this API, or do nothing.</span>
			}
		];
		return items;
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.ajax = function () {
		React.render(<APIList title='Ajax API' items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));