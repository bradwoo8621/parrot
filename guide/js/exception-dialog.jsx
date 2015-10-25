(function (context, $) {
	var $demo = $pt.getService(context, '$demo');


	var painter = function () {
		return [
			{
				id: 'exception-dialog',
				title: 'NExceptionModal',
				pattern: '<NExceptionModal className="your-class-name" />',
				desc: 'A standard exception modal dialog. Normally operate via APIs.',
				children: [
					{
						id: 'exception-dialog-getExceptionModal',
						title: '#getExceptionModal',
						pattern: 'NExceptionModal.getExceptionModal(className: string) : NExceptionModal',
						desc: <span>Create exception dialog, global one instance if via this function.
						Or create your own via JSX.<br/>
						Static function.</span>
					},
					{
						id: 'exception-dialog-hide',
						title: '#hide',
						pattern: '#hide()',
						desc: <span>Hide dialog.</span>
					},
					{
						id: 'exception-dialog-show',
						title: '#show',
						pattern: '#show(status: string, message: string)',
						desc: <span>Show dialog.<br/>
						1. <code>status</code>: normally means http status, messages are pre-defined in <code>$pt.ComponentConstants.Http_Status</code>.<br/>
						2. <code>message</code>: string, render in pre tag.</span>
					}
				]
			},
			{
				id: 'exception-dialog-constants',
				title: 'Constants',
				desc: <span><code>NExceptionModal.TITLE = 'Exception Raised...';</code></span>
			}
		]
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.exceptionDialog = function () {
		var form = {
			any: {
				label: 'Show',
				comp: {
					type: $pt.ComponentConstants.Button,
					icon: 'play',
					click: function () {
						NExceptionModal.getExceptionModal().show('404', <h1>Something Wrong</h1>);
					},
					style: 'success'
				}
			}
		};
		var panel = (<div className='row'>
			<div className='col-sm-12 col-md-12 col-lg-12'>
				<APIList title='Exception Dialog' items={painter()}/>
			</div>
			<div className='col-sm-12 col-md-12 col-lg-12'>
				<NForm model={$pt.createModel({})} layout={$pt.createFormLayout(form)}/>
			</div>
		</div>);
		React.render(panel, document.getElementById('main'));
	};
}(this, jQuery));