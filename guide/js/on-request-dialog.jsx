(function (context, $) {
	var $demo = $pt.getService(context, '$demo');


	var painter = function () {
		return [
			{
				id: 'on-request-dialog',
				title: 'NOnRequestModal',
				pattern: '<NOnRequestModal className="your-class-name" />',
				desc: 'A standard on request modal dialog. Normally operate via APIs.',
				children: [
					{
						id: 'on-request-dialog-getOnRequestModal',
						title: '#getOnRequestModal',
						pattern: 'NOnRequestModal.getOnRequestModal(className: string) : NOnRequestModal',
						desc: <span>Create on request dialog, global one instance if via this function.
						Or create your own via JSX.<br/>
						Static function.</span>
					},
					{
						id: 'on-request-dialog-hide',
						title: '#hide',
						pattern: '#hide()',
						desc: <span>Hide dialog.</span>
					},
					{
						id: 'on-request-dialog-show',
						title: '#show',
						pattern: '#show()',
						desc: <span>Show dialog.</span>
					}
				]
			},
			{
				id: 'confirm-dialog-constants',
				title: 'Constants',
				desc: <span>
						<code>NOnRequestModal.WAITING_MESSAGE = {NOnRequestModal.WAITING_MESSAGE};</code>
				</span>
			}
		]
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.onRequestDialog = function () {
		var form = {
			any: {
				label: 'Show',
				comp: {
					type: $pt.ComponentConstants.Button,
					icon: 'play',
					click: function () {
						NOnRequestModal.WAITING_MESSAGE = 'Sorry, no hide testing since the dialog is modal mode. F5 please.';
						NOnRequestModal.getOnRequestModal().show();
					},
					style: 'success'
				}
			}
		};
		var panel = (<div className='row'>
			<div className='col-sm-12 col-md-12 col-lg-12'>
				<APIList title='On Request Dialog' items={painter()}/>
			</div>
			<div className='col-sm-12 col-md-12 col-lg-12'>
				<NForm model={$pt.createModel({})} layout={$pt.createFormLayout(form)}/>
			</div>
		</div>);
		React.render(panel, document.getElementById('main'));
	};
}(this, jQuery));
