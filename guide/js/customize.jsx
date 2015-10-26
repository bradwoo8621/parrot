(function (context, $) {
	var $demo = $pt.getService(context, '$demo');

	var painter = function () {
		var items = [
			{
				id: 'customize',
				title: 'Long Story',
				desc: <h5>It's really a very long story. <br/>
					<br/>Have a nice day!<br/><br/>
					And pull down carefully, to find more information, thanks a lot, <NIcon icon='smile-o'
					                                                                        size='lg'/>.<br/>
					<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>
					<br/><br/><br/><br/><br/><br/><br/>
				<span className='n-label-danger'>Go back! Fix your
				<NIcon icon='bug' size='3x'/><NIcon icon='bug' size='3x'/><NIcon icon='bug' size='3x'/>! Quickly!</span>
				</h5>
			}
		];
		return items;
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.customize = function () {
		React.render(<APIList title='Customize' items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));