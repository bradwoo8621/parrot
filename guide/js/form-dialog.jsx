(function (context, $) {
	var $demo = $pt.getService(context, '$demo');


	var painter = function () {
		return [
			{
				id: 'form-dialog',
				title: 'NModalForm',
				pattern: '<NModalForm title="your-title" className="your-class-name" zIndex={number}/>',
				desc: 'Form modal dialog. Normally operate via APIs.',
				children: [
					{
						id: 'form-dialog-createFormModal',
						title: '#createFormModal',
						pattern: 'NModalForm.createFormModal(title: string, className: string) : NModalForm',
						desc: <span>Create modal form dialog. Z-Index starts from 1500.<br/>
						Static function.</span>
					},
					{
						id: 'form-dialog-hide',
						title: '#hide',
						pattern: '#hide()',
						desc: <span>Hide dialog.</span>
					},
					{
						id: 'form-dialog-validate',
						title: '#validate',
						pattern: '#validate() : boolean',
						desc: <span>Validate form data by data model API.</span>
					},
					{
						id: 'form-dialog-show',
						title: '#show',
						pattern: '#show()',
						desc: <span>Show dialog. Options as below,
						1. <code>model</code>: Model Interface. data model.<br/>
						2. <code>layout</code>: Form Layout. create by <code>$pt.createFormLayout()</code>.<br/>
						3. <code>buttons</code>: JSON. properties as below,
						3.a <code>cancel</code>: boolean. false to hide cancel button.<br/>
						3.b <code>validate</code>: boolean. false to hide validate button.<br/>
						3.c <code>reset</code>: boolean. false to hide reset button.<br/>
						3.d <code>save</code>: function. invoke when save clicked, parameter is data model. Hide save button if not defined.<br/>
						3.e <code>left</code>: JSON|JSON[]. left buttons. Refers to Panel Footer. All click function will be passed data model as parameter.<br/>
						3.f <code>right</code>: JSON|JSON[]. right buttons. Refers to Panel Footer. All click function will be passed data model as parameter.<br/>
						4. <code>direction</code>: label direction. <code>vertical</code> or <code>horizontal</code>.<br/>
						5. <code>footer</code>: boolean. false to hide button footer.<br/>
						6. <code>title</code>: string. title of dialog.<br/>
						</span>
					}
				]
			},
			{
				id: 'confirm-dialog-constants',
				title: 'Constants',
				desc: <span>
						<code>NModalForm.RESET_CONFIRM_TITLE: "Reset Data";</code><br/>
						<code>NModalForm.RESET_CONFIRM_MESSAGE: ["Are you sure to reset data?", "All data will be lost
							and cannot be recovered."];</code><br/>
						<code>NModalForm.CANCEL_CONFIRM_TITLE: "Cancel Editing";</code><br/>
						<code>NModalForm.CANCEL_CONFIRM_MESSAGE: ["Are you sure to cancel current operating?", "All data
							will be lost and cannot be recovered."];</code>
				</span>
			}
		]
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.formDialog = function () {
		var dialog = NModalForm.createFormModal();
		var form = {
			any: {
				label: 'Show',
				comp: {
					type: $pt.ComponentConstants.Button,
					icon: 'play',
					click: function () {
						dialog.show({
							title: 'A Sample Form Dialog',
							model: $pt.createModel({}),
							layout: $pt.createFormLayout({
								any: {
									label: 'A Text'
								}
							}),
							buttons: {
								save: function () {
								},
								left: {
									icon: 'search'
								},
								right: [{
									icon: 'play'
								}, {
									icon: 'stop'
								}]
							}
						});
					},
					style: 'success'
				}
			}
		};
		var panel = (<div className='row'>
			<div className='col-sm-12 col-md-12 col-lg-12'>
				<APIList title='Form Dialog' items={painter()}/>
			</div>
			<div className='col-sm-12 col-md-12 col-lg-12'>
				<NForm model={$pt.createModel({})} layout={$pt.createFormLayout(form)}/>
			</div>
		</div>);
		React.render(panel, document.getElementById('main'));
	};
}(this, jQuery));