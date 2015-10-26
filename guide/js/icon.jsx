(function (context, $) {
	var $demo = $pt.getService(context, '$demo');


	var painter = function () {
		var all = {
			defaultOptions: function () {
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NIcon',
					icon: 'search'
				});
				return {
					id: 'icon-default',
					title: 'Default',
					desc: 'Icon. Use Font Awesome icon font.',
					xml: {
						width: 12,
						xml: <NIcon icon='search'/>
					},
					code: [compCode],
					index: 10
				};
			},
			size: function () {
				var compCode = [$demo.convertComponentCreatorToString({
					tag: 'NIcon',
					icon: '"search"'
				})];
				compCode.push.apply(compCode, ['lg', '2x', '3x', '4x', '5x'].map(function (size) {
					return $demo.convertComponentCreatorToString({
						tag: 'NIcon',
						icon: '"search"',
						size: '"' + size + '"'
					});
				}));
				return {
					id: 'icon-size',
					title: 'Size',
					desc: <span>Size can be <code>lg</code> to <code>5x</code>,
						or define your own CSS <code>{".fa-6x {font-size: '6em'}"}</code>, then <code>6x</code> can be defined.</span>,
					xml: {
						width: 12,
						xml: [<NIcon icon='search'/>,
							<NIcon icon='search' size='lg'/>,
							<NIcon icon='search' size='2x'/>,
							<NIcon icon='search' size='3x'/>,
							<NIcon icon='search' size='4x'/>,
							<NIcon icon='search' size='5x'/>]
					},
					code: compCode,
					index: 20
				};
			},
			fixWidth: function () {
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NIcon',
					icon: '"search"',
					fixWidth: 'true'
				});
				return {
					id: 'icon-fixWidth',
					title: 'Fix Width',
					desc: <span>From font awesome CSS.</span>,
					xml: {
						width: 12,
						xml: [<NIcon icon='search' fixWidth={true}/>]
					},
					code: compCode,
					index: 30
				};
			},
			spin: function () {
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NIcon',
					icon: '"circle-notch-o"',
					spin: 'true'
				});
				return {
					id: 'icon-spin',
					title: 'Spin',
					desc: <span>From font awesome CSS.</span>,
					xml: {
						width: 12,
						xml: [<NIcon icon='circle-o-notch' spin={true}/>]
					},
					code: compCode,
					index: 40
				};
			},
			pulse: function () {
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NIcon',
					icon: '"circle-notch-o"',
					pulse: 'true'
				});
				return {
					id: 'icon-pulse',
					title: 'Pulse',
					desc: <span>From font awesome CSS.</span>,
					xml: {
						width: 12,
						xml: [<NIcon icon='circle-o-notch' pulse={true}/>]
					},
					code: compCode,
					index: 50
				};
			},
			rotate: function () {
				var compCode = [$demo.convertComponentCreatorToString({
					tag: 'NIcon',
					icon: '"circle-notch-o"'
				}), $demo.convertComponentCreatorToString({
					tag: 'NIcon',
					icon: '"circle-notch-o"',
					rotate: '90'
				}), $demo.convertComponentCreatorToString({
					tag: 'NIcon',
					icon: '"circle-notch-o"',
					rotate: '180'
				}), $demo.convertComponentCreatorToString({
					tag: 'NIcon',
					icon: '"circle-notch-o"',
					rotate: '270'
				})];
				return {
					id: 'icon-rotate',
					title: 'Rotate',
					desc: <span>From font awesome CSS.</span>,
					xml: {
						width: 12,
						xml: [<div><NIcon icon='circle-o-notch'/><br/>
							<NIcon icon='circle-o-notch' rotate={90}/><br/>
							<NIcon icon='circle-o-notch' rotate={180}/><br/>
							<NIcon icon='circle-o-notch' rotate={270}/></div>]
					},
					code: compCode,
					index: 60
				};
			},
			flip: function () {
				var compCode = [$demo.convertComponentCreatorToString({
					tag: 'NIcon',
					icon: '"circle-notch-o"'
				}), $demo.convertComponentCreatorToString({
					tag: 'NIcon',
					icon: '"circle-notch-o"',
					flip: '"h"'
				}), $demo.convertComponentCreatorToString({
					tag: 'NIcon',
					icon: '"circle-notch-o"',
					flip: '"v"'
				})];
				return {
					id: 'icon-flip',
					title: 'Flip',
					desc: <span>From font awesome CSS.</span>,
					xml: {
						width: 12,
						xml: [<div><NIcon icon='circle-o-notch'/><br/>
							<NIcon icon='circle-o-notch' flip='h'/><br/>
							<NIcon icon='circle-o-notch' flip='v'/></div>]
					},
					code: compCode,
					index: 70
				};
			},
			backIcon: function () {
				var compCode = [$demo.convertComponentCreatorToString({
					tag: 'NIcon',
					icon: '"camera"',
					backIcon: '"ban"'
				})];
				return {
					id: 'icon-back',
					title: 'Back Icon',
					desc: <span>From font awesome CSS.<br/>
					<code>backSpin</code>, <code>backPulse</code>, <code>backRotate</code>, <code>backFlip</code> also available.</span>,
					xml: {
						width: 12,
						xml: [<NIcon icon='camera' backIcon='ban' backClassName='text-danger'/>]
					},
					code: compCode,
					index: 80
				};
			},
			tooltip: function () {
				var compCode = [$demo.convertComponentCreatorToString({
					tag: 'NIcon',
					icon: '"search"',
					tootip: '"Here\'s a tootip"'
				})];
				return {
					id: 'icon-tooltip',
					title: 'Tooltip',
					desc: <span>Tooltip.</span>,
					xml: {
						width: 12,
						xml: [<NIcon icon='search' tooltip="Here's a tootip"/>]
					},
					code: compCode,
					index: 90
				};
			}
		};
		return $demo.convertToExampleList(all);
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.icon = function () {
		React.render(<ExampleList title='NIcon'
		                          formType='<NIcon />'
		                          items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));