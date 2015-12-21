(function (context, $) {
	var $demo = $pt.getService(context, '$demo');

	var painter = function () {
		var parties = [
			{name: 'JQuery', url: 'https://jquery.com/'},
			{name: 'JQuery MouseWheel', url: 'https://github.com/jquery/jquery-mousewheel'},
			{name: 'JQuery Browser (Not Used Now)', url: 'https://github.com/gabceb/jquery-browser-plugin'},
			{name: 'JQuery Mockjax (Optional)', url: 'https://github.com/jakerella/jquery-mockjax'},
			{name: 'JQuery Deparam (Only in URL API)', url: 'https://github.com/AceMetrix/jquery-deparam'},
			{name: 'JQuery Storage API (Not Used Now)', url: 'https://github.com/julien-maurel/jQuery-Storage-API'},
			{name: 'Bootstrap', url: 'http://getbootstrap.com/'},
			{name: 'Bootwatch', url: 'https://bootswatch.com/'},
			{name: 'Bootstrap DatetimePicker (Optional)', url: 'https://eonasdan.github.io/bootstrap-datetimepicker/'},
			{name: 'Bootstrap FileInput', url: 'https://github.com/kartik-v/bootstrap-fileinput'},
			{name: 'ES5-Shim (IE8)', url: 'https://github.com/es-shims/es5-shim'},
			{name: 'Font Awesome', url: 'http://fortawesome.github.io/Font-Awesome/'},
			{name: 'HTML5-Shiv (IE8)', url: 'https://github.com/afarkas/html5shiv'},
			{name: 'JSface', url: 'https://github.com/tnhu/jsface'},
			{name: 'JSCookie (Not Used Now)', url: 'https://github.com/js-cookie/js-cookie'},
			{name: 'MomentJS', url: 'http://momentjs.com/'},
			{name: 'Moment Taiwan (Optional)', url: 'https://github.com/bradwoo8621/moment-taiwan'},
			{name: 'ReactJS', url: 'http://facebook.github.io/react/'},
			{name: 'React-Bootstrap (Not Used Now)', url: 'http://react-bootstrap.github.io/'},
			{name: 'Respond (IE8)', url: 'https://github.com/scottjehl/Respond'},
			{name: 'Select2 (Optional)', url: 'https://select2.github.io/'}
		];
		var renderParty = function (party) {
			return (<div className='col-sm-12 col-md-12 col-lg-12'>
				<a href={party.url} target='_blank'>{party.name}</a>
			</div>);
		}
		return (<div className='row'>
			<div className='col-sm-9 col-md-9 col-lg-9'>
				<div className='row'>
					<div className='col-sm-12 col-md-12 col-lg-12 example-all-title'>
						<h2>Third Parties</h2>
						<hr/>
					</div>
					{parties.map(renderParty)}
				</div>
			</div>
		</div>);
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.thirdParty = function () {
		React.render(painter(), document.getElementById('main'));
	};
}(this, jQuery));
