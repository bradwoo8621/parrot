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
						pattern: '#show(options)',
						desc: <span>Show dialog. Parameter is a JSON object, and properties as below,<br/>
						1. <code>model</code>: Model Interface. data model.<br/>
						2. <code>layout</code>: Form Layout. create by <code>$pt.createFormLayout()</code>.<br/>
						3. <code>buttons</code>: JSON. properties as below,
						3.a <code>cancel</code>: boolean. false to hide cancel button.<br/>
						3.b <code>validate</code>: boolean. false to hide validate button.<br/>
						3.c <code>reset</code>: boolean. false to hide reset button.<br/>
						3.d <code>save</code>: function. invoke when save clicked, parameter is data model. Hide save button if not defined.<br/>
						3.e <code>left</code>: JSON|JSON[]. left buttons. Refers to Panel Footer. All click function will be passed data model as parameter.<br/>
						3.f <code>right</code>: JSON|JSON[]. right buttons. Refers to Panel Footer. All click function will be passed data model as parameter.<br/>
						3.g <code>dialogCloseShown</code> boolean. Show the dialog close button or not.<br/>
						4. <code>direction</code>: label direction. <code>vertical</code> or <code>horizontal</code>.<br/>
						5. <code>footer</code>: boolean. false to hide button footer.<br/>
						6. <code>title</code>: string. title of dialog.<br/>
						7. <code>draggable</code>: boolean. true to let the dialog floating and draggable.<br/>
						8. <code>collapsible</code>: boolean. true to let the dialog collapsible.<br/>
						9. <code>expanded</code>: boolean. false to collapse the dialog body and footer when first show.<br/>
						10. <code>pos</code>: JSON. has <code>top</code>, <code>right</code>, <code>bottom</code> and <code>left</code>, all are numeric.
						</span>
					}
				]
			},
			{
				id: 'confirm-dialog-constants',
				title: 'Constants',
				desc: <span>
						<code>NModalForm.RESET_CONFIRM_TITLE: {NModalForm.RESET_CONFIRM_TITLE};</code><br/>
						<code>NModalForm.RESET_CONFIRM_MESSAGE: {NModalForm.RESET_CONFIRM_MESSAGE};</code><br/>
						<code>NModalForm.CANCEL_CONFIRM_TITLE: {NModalForm.CANCEL_CONFIRM_TITLE};</code><br/>
						<code>NModalForm.CANCEL_CONFIRM_MESSAGE: {NModalForm.CANCEL_CONFIRM_MESSAGE};</code>
				</span>
			}
		]
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.formDialog = function () {
		var floatDialog = NModalForm.createFormModal();
		var dialog = NModalForm.createFormModal();
		var model = $pt.createModel({});
		var layout = $pt.createFormLayout({
			any: {
				label: 'A Text'
			}
		});
		var buttons = {
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
		};
		var form = {
			normal: {
				label: 'Normal',
				comp: {
					type: $pt.ComponentConstants.Button,
					icon: 'play',
					click: function () {
						dialog.show({
							title: 'A Sample Form Dialog',
							model: model,
							layout: layout,
							buttons: buttons
						});
					},
					style: 'success'
				}
			},
			floating: {
				label: 'Floating',
				comp: {
					type: $pt.ComponentConstants.Button,
					icon: 'play',
					click: function () {
						floatDialog.show({
							title: 'A Floating Form Dialog',
							model: model,
							layout: layout,
							buttons: buttons,
							draggable: true,
							collapsible: true,
							expanded: false,
							pos: {
								top: 50,
								right: 0
							}
						});
					},
					style: 'primary'
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
