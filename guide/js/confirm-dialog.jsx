(function (context, $) {
	var $demo = $pt.getService(context, '$demo');


	var painter = function () {
		return [
			{
				id: 'confirm-dialog',
				title: 'NConfirm',
				pattern: '<NConfirm className="your-class-name" />',
				desc: 'A standard confirm modal dialog. Normally operate via APIs.',
				children: [
					{
						id: 'confirm-dialog-getConfirmModal',
						title: '#getConfirmModal',
						pattern: 'NConfirm.getConfirmModal(className: string) : NConfirm',
						desc: <span>Create confirm dialog, global one instance if via this function.
						Or create your own via JSX.<br/>
						Static function.</span>
					},
					{
						id: 'confirm-dialog-hide',
						title: '#hide',
						pattern: '#hide()',
						desc: <span>Hide dialog.</span>
					},
					{
						id: 'confirm-dialog-show',
						title: '#show',
						pattern: '#show(options)',
						desc: <span>Show dialog. Options is a JSON object, properties as below,<br/>
						1. <code>title</code>: string. title of dialog.<br/>
						2. <code>disableButtons</code>: boolean. false to hide buttons.<br/>
						3. <code>disableConfirm</code>: boolean. false to hide confirm button.<br/>
						4. <code>disableClose</code>: boolean. false to hide close button.<br/>
						5. <code>close</code>: boolean. choose the close button text. true is <code>NConfirm.CLOSE_TEXT</code>, false is <code>NConfirm.CANCEL_TEXT</code>.<br/>
						6. <code>messages</code>: string|string[]. messages.<br/>
						7. <code>onConfirm</code>: function. invoke when confirm clicked, no parameter.<br/>
						8. <code>onCancel</code>: function. invoke when cancel clicked, no parameter. Note <code>hide</code> will not invoke this function.<br/>
						9. <code>afterClose</code>: function. invoke when close dialog. Parameter is <code>confirm</code> when confirmed, <code>cancel</code> when canceled.
						</span>
					}
				]
			},
			{
				id: 'confirm-dialog-constants',
				title: 'Constants',
				desc: <span>
						<code>NConfirm.OK_TEXT = {NConfirm.OK_TEXT};</code><br/>
						<code>NConfirm.OK_ICON = {NConfirm.OK_ICON};</code><br/>
						<code>NConfirm.CLOSE_TEXT = {NConfirm.CLOSE_TEXT};</code><br/>
						<code>NConfirm.CLOSE_ICON = {NConfirm.CLOSE_ICON};</code><br/>
						<code>NConfirm.CANCEL_TEXT = {NConfirm.CANCEL_TEXT};</code><br/>
						<code>NConfirm.CANCEL_ICON = {NConfirm.CANCEL_ICON};</code>
				</span>
			}
		]
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.confirmDialog = function () {
		var form = {
			any: {
				label: 'Show',
				comp: {
					type: $pt.ComponentConstants.Button,
					icon: 'play',
					click: function () {
						NConfirm.getConfirmModal().show({
							title: 'A Sample Confirm Dialog',
							messages: ['Enjoy it!', <h1>WOW!</h1>]
						});
					},
					style: 'success'
				}
			}
		};
		var panel = (<div className='row'>
			<div className='col-sm-12 col-md-12 col-lg-12'>
				<APIList title='Confirm Dialog' items={painter()}/>
			</div>
			<div className='col-sm-12 col-md-12 col-lg-12'>
				<NForm model={$pt.createModel({})} layout={$pt.createFormLayout(form)}/>
			</div>
		</div>);
		React.render(panel, document.getElementById('main'));
	};
}(this, jQuery));
