(function (context, $) {
	var $demo = $pt.getService(context, '$demo');


	var painter = function () {
		var tabs = [
			{label: 'Tab A', icon: 'search', value: 'a'},
			{label: 'Tab B', icon: 'ban', value: 'b'}
		];
		var active = {
			canActive: function () {
				var canActive = function (newTabValue, newTabIndex, currentTabValue, currentTableIndex) {
					alert("Current[value=" + currentTabValue + ", index=" + currentTableIndex + "], " +
						"New[value=" + newTabValue + ", index=" + newTabIndex + "]");
					return newTabValue == 'a';
				};
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NTab',
					tabs: 'tabs',
					canActive: 'canActive'
				});
				return {
					id: 'tab-canActive',
					title: 'Can Active',
					desc: 'Returns false if the tab cannot be active.',
					xml: {width: 12, xml: <NTab tabs={tabs} canActive={canActive}/>},
					code: [$demo.convertJSON({variable: 'canActive', json: canActive}),
						$demo.convertJSON({variable: 'tabs', json: tabs}),
						compCode],
					index: 10
				};
			},
			onActive: function () {
				var onActive = function (currentTabValue, currentTableIndex) {
					alert('Tab[value=' + currentTabValue + ', index=' + currentTableIndex + ']');
				};
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NTab',
					tabs: 'tabs',
					onActive: 'onActive'
				});
				return {
					id: 'tab-onActive',
					title: 'On Active',
					desc: 'Handle tab active event.',
					xml: {width: 12, xml: <NTab tabs={tabs} onActive={onActive}/>},
					code: [$demo.convertJSON({variable: 'onActive', json: onActive}),
						$demo.convertJSON({variable: 'tabs', json: tabs}),
						compCode],
					index: 20
				};
			},
			tabActive: function () {
				var tabs = [
					{label: 'Tab A', icon: 'search', value: 'a'},
					{label: 'Tab B', icon: 'ban', value: 'b', active: true}
				];
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NTab',
					tabs: 'tabs',
				});
				return {
					id: 'tab-tabActive',
					title: 'Initial Active',
					desc: 'Set initial active tab.',
					xml: {width: 12, xml: <NTab tabs={tabs}/>},
					code: [$demo.convertJSON({variable: 'tabs', json: tabs}),
						compCode],
					index: 30
				};
			}
		};
		var remove = {
			removable: function () {
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NTab',
					tabs: 'tabs',
					removable: true
				});
				return {
					id: 'tab-removable',
					title: 'Removable',
					desc: 'Removable',
					xml: {width: 12, xml: <NTab tabs={tabs} removable={true}/>},
					code: [$demo.convertJSON({variable: 'tabs', json: tabs}), compCode],
					index: 10
				};
			},
			canRemove: function () {
				var canRemove = function (currentTabValue, currentTableIndex) {
					alert("Current[value=" + currentTabValue + ", index=" + currentTableIndex + "]");
					return currentTabValue == 'a';
				};
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NTab',
					tabs: 'tabs',
					removable: true,
				});
				return {
					id: 'tab-canRemove',
					title: 'Can Remove',
					desc: 'Returns false if tab cannot be removed.',
					xml: {width: 12, xml: <NTab tabs={tabs} removable={true} canRemove={canRemove}/>},
					code: [$demo.convertJSON({variable: 'canRemove', json: canRemove}),
						$demo.convertJSON({variable: 'tabs', json: tabs}),
						compCode],
					index: 20
				};
			},
			onRemove: function () {
				var onRemove = function (currentTabValue, currentTableIndex) {
					alert("Removed[value=" + currentTabValue + ", index=" + currentTableIndex + "]");
				};
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NTab',
					tabs: 'tabs',
					removable: true,
				});
				return {
					id: 'tab-onRemove',
					title: 'On Remove',
					desc: 'Handle tab remove event.',
					xml: {width: 12, xml: <NTab tabs={tabs} removable={true} onRemove={onRemove}/>},
					code: [$demo.convertJSON({variable: 'onRemove', json: onRemove}),
						$demo.convertJSON({variable: 'tabs', json: tabs}),
						compCode],
					index: 30
				};
			},
			tabRemove: function () {
				var tabs = [
					{label: 'Tab A', icon: 'search', value: 'a'},
					{label: 'Tab B', icon: 'ban', value: 'b', removable: true}
				];
				var tabs2 = [
					{label: 'Tab A', icon: 'search', value: 'a'},
					{label: 'Tab B', icon: 'ban', value: 'b', removable: false}
				];
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NTab',
					tabs: 'tabs'
				});
				var compCode2 = $demo.convertComponentCreatorToString({
					tag: 'NTab',
					tabs: 'tabs2',
					removable: true
				});
				return {
					id: 'tab-tabRemove',
					title: 'Tab Remove',
					desc: 'Tab removable can be set separately.',
					xml: [{width: 12, xml: <NTab tabs={tabs}/>},
						{width: 12, xml: <NTab tabs={tabs2} removable={true}/>}],
					code: [$demo.convertJSON({variable: 'tabs', json: tabs}),
						$demo.convertJSON({variable: 'tabs2', json: tabs2}),
						compCode, compCode2],
					index: 40
				};
			}
		};
		var all = {
			defaultOptions: function () {
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NTab',
					tabs: 'tabs'
				});
				return {
					id: 'tab-default',
					title: 'Default',
					desc: <span>Tab. <code>value</code>, <code>label</code>, <code>icon</code> of each tab are not necessary, try it.</span>,
					xml: {width: 12, xml: <NTab tabs={tabs}/>},
					code: [$demo.convertJSON({variable: 'tabs', json: tabs}), compCode],
					index: 10
				};
			},
			pill: function () {
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NTab',
					tabs: 'tabs',
					type: '"pill"'
				});
				return {
					id: 'tab-pill',
					title: 'Pill',
					desc: 'Pill',
					xml: {width: 12, xml: <NTab tabs={tabs} type='pill'/>},
					code: [$demo.convertJSON({variable: 'tabs', json: tabs}), compCode],
					index: 20
				};
			},
			justified: function () {
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NTab',
					tabs: 'tabs',
					justified: true
				});
				return {
					id: 'tab-justified',
					title: 'Justified',
					desc: 'Justified',
					xml: {width: 12, xml: <NTab tabs={tabs} justified={true}/>},
					code: [$demo.convertJSON({variable: 'tabs', json: tabs}), compCode],
					index: 30
				};
			},
			size: function () {
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NTab',
					tabs: 'tabs',
					size: '"lg"'
				});
				return {
					id: 'tab-size',
					title: 'Size',
					desc: 'Size',
					xml: [{width: 12, xml: <NTab tabs={tabs}/>},
						{width: 12, xml: <NTab tabs={tabs} size='lg'/>},
						{width: 12, xml: <NTab tabs={tabs} size='2x'/>},
						{width: 12, xml: <NTab tabs={tabs} size='3x'/>},
						{width: 12, xml: <NTab tabs={tabs} size='4x'/>},
						{width: 12, xml: <NTab tabs={tabs} size='5x'/>}],
					code: [$demo.convertJSON({variable: 'tabs', json: tabs}), compCode],
					index: 40
				};
			},
			removable: function () {
				return {
					id: 'tab-remove',
					title: 'Remove',
					desc: 'Tab can be removed. Note remove is hide only, not really remove DOM.',
					index: 50,
					children: $demo.convertToExampleList(remove)
				};
			},
			active: function () {
				return {
					id: 'tab-active',
					title: 'Active',
					desc: 'Active event can be caught.',
					index: 60,
					children: $demo.convertToExampleList(active)
				}
			},
			style: function () {
				var layout = {
					tabClassName: 'your-class-name',
					tabs: [
						{className: 'another-class-name'},
						{className: 'another-class-name-again'}
					]
				};
				return {
					id: 'tab-style',
					title: 'Style',
					desc: 'Style can set.',
					code: [$demo.convertJSON({variable: 'layout', json: layout})],
					index: 70
				}
			},
			badge: function () {
				var tabs = [
					{label: 'Tab A', icon: 'search', value: 'a'},
					{label: 'Tab B', icon: 'ban', value: 'b', badge: "1,000"}
				];
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NTab',
					tabs: 'tabs'
				});
				return {
					id: 'tab-badge',
					title: 'Badge',
					desc: 'Badge for tab.',
					xml: {width: 12, xml: <NTab tabs={tabs}/>},
					code: [$demo.convertJSON({variable: 'tabs', json: tabs}), compCode],
					index: 80
				};
			},
			link: function () {
				var tabs = [
					{label: 'Tab A', innerId: 'a'},
					{icon: 'ban', innerId: 'b'}
				];
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NTab',
					tabs: 'tabs'
				});
				return {
					id: 'tab-link',
					title: 'Link DOM',
					desc: 'Tab can be linked to other DOMs.',
					xml: [{width: 12, xml: <NTab tabs={tabs}/>},
						<div>
							<span id='a' style={{color: 'orange'}}>You Are Somebody.</span>
							<span id='b' style={{color: 'green'}}>I Am Nobody.</span>
						</div>],
					code: [$demo.convertJSON({variable: 'tabs', json: tabs}), compCode],
					index: 90
				};
			}
		};
		return $demo.convertToExampleList(all);
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.tab = function () {
		React.render(<ExampleList title='NTab'
		                          formType='<NTab />'
		                          items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));