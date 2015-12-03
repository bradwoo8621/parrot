(function (context) {
	hljs.configure({
		tabReplace: '    '
	});
	var $demo = $pt.getService(context, '$demo');
	var onDev = function () {
		var onDev = (<div className='docs-head'>
			<div className='row'>
				<div className='col-sm-12 col-md-12 col-lg-12'>
					<img src='img/page-on-dev.png'/>
				</div>
			</div>
		</div>);
		React.render(onDev, document.getElementById('main'));
	};
	$demo.onDev = onDev;

	var menus = [
		{
			text: 'Models & APIs',
			children: [
				{text: 'Data', func: $demo.renderer.data},
				{text: 'Layout', func: $demo.renderer.layout},
				{text: 'Validator', func: $demo.renderer.validator},
				{divider: true},
				{text: 'Code Table', func: $demo.renderer.codetable},
				{divider: true},
				{text: 'Services', func: $demo.renderer.services},
				{text: 'Ajax Proxy', func: $demo.renderer.ajax},
				{text: 'URLs', func: $demo.renderer.urls},
				{text: 'Messages', func: $demo.renderer.messages},
				{divider: true},
				{text: '3rd Party', func: $demo.renderer.thirdParty}
			]
		},
		{
			text: 'Component',
			children: [
				{text: 'Page Header', func: $demo.renderer.pageHeader},
				{text: 'Jumbotron', func: $demo.renderer.jumborton},
				{text: 'Panel Footer', func: $demo.renderer.panelFooter},
				{text: 'Page Footer', func: $demo.renderer.pageFooter},
				{text: 'Tab', func: $demo.renderer.tab},
				{divider: true},
				{text: 'Label', func: $demo.renderer.label},
				{text: 'Icon', func: $demo.renderer.icon},
				{text: 'Pagination', func: $demo.renderer.pagination},
				{divider: true},
				{text: 'Side Menu', func: $demo.renderer.sideMenu}
			]
		},
		{
			text: 'Form Component (Simple)',
			children: [
				{text: 'Label', func: $demo.renderer.formLabel},
				{text: 'Text', func: $demo.renderer.formText},
				{text: 'TextArea', func: $demo.renderer.formTextArea},
				{text: 'Button', func: $demo.renderer.formButton},
				{divider: true},
				{text: 'CheckBox', func: $demo.renderer.formCheck},
				{text: 'Array CheckBox', func: $demo.renderer.formArrayCheck},
				{text: 'Radio Button', func: $demo.renderer.formRadio},
				{text: 'Toggle', func: $demo.renderer.formToggle},
				{divider: true},
				{text: 'Nothing', func: $demo.renderer.formNothing},
				{text: 'View Mode', func: $demo.renderer.viewMode},
			]
		},
		{
			text: 'Form Component (Complex)',
			children: [
				{text: 'DateTime Picker', func: $demo.renderer.formDateTime},
				{text: 'Select', func: $demo.renderer.formSelect},
				{text: 'Tree Select', func: $demo.renderer.formSelectTree},
				{text: 'Code Search', func: $demo.renderer.formCodeSearch},
				{divider: true},
				{text: 'Table', func: $demo.renderer.formTable},
				{text: 'Tree', func: $demo.renderer.formTree},
				{divider: true},
				{text: 'File', func: $demo.renderer.formFile}
			]
		},
		{
			text: 'Form Container',
			children: [
				{text: 'Form', func: $demo.renderer.form},
				{text: 'Form Cell', func: $demo.renderer.formCell},
				{text: 'Form Button Footer', func: $demo.renderer.formButtonFooter},
				{divider: true},
				{text: 'Tab', func: $demo.renderer.formTab},
				{text: 'Tab for Array', func: $demo.renderer.formArrayTab},
				{divider: true},
				{text: 'Panel', func: $demo.renderer.formPanel},
				{text: 'Panel for Array', func: $demo.renderer.formArrayPanel}
			]
		},
		{
			text: 'Dialog',
			children: [
				{text: 'Exception Dialog', func: $demo.renderer.exceptionDialog},
				{text: 'Confirm Dialog', func: $demo.renderer.confirmDialog},
				{text: 'Form Dialog', func: $demo.renderer.formDialog},
				{text: 'On Request Dialog', func: $demo.renderer.onRequestDialog}
			]
		},
		{
			text: 'Customize', func: $demo.renderer.customize
		},
		{
			text: 'Random Gate', func: function () {
			var gates = Object.keys($demo.renderer);
			var gateKey = Math.floor((Math.random() * gates.length) + 1);
			$demo.renderer[gates[gateKey]]();
		}
		}
	];

	var home = function () {
		var index = (<div className='docs-head'>
			<div className='row'>
				<div className='col-sm-1 col-md-1 col-lg-1'/>
				<div className='col-sm-5 col-md-5 col-lg-5'>
					<img src='img/nest-transparent.png'/>
				</div>
				<div className='col-sm-5 col-md-5 col-lg-5'>
					<img src='img/parrot-transparent.png'/>
				</div>
			</div>
			<p className='lead'/>

			<p className='lead'>
				Parrot is a model based framework for developing responsive projects on the web, base on Bootstrap 3
				and
				ReactJS.
			</p>

			<p className="lead">
				<a href="https://github.com/bradwoo8621/parrot" className="btn btn-outline-inverse btn-lg">Download
					Parrot</a>
			</p>

			<p className='version'>Currently v0.0.5 Released. v0.0.6 under development.</p>
		</div>);

		React.render(index, document.getElementById('main'));
	};
	$demo.home = home;

	React.render(<NPageHeader brand='Parrot' brandFunc={$demo.home} menus={menus}/>,
		document.getElementById('page-header'));
	$demo.home();
}(this));
