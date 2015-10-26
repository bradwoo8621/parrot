(function (context, $) {
	var $demo = $pt.getService(context, '$demo');


	var painter = function () {
		var all = {
			defaultOptions: function () {
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NPageHeader',
					brand: '"Github"'
				});
				return {
					id: 'page-header-default',
					title: 'Default',
					desc: 'Simple page header.',
					xml: {width: 12, xml: <div className='no-fix-top'><NPageHeader brand='Github'/></div>},
					code: [compCode],
					index: 10
				};
			},
			url: function () {
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NPageHeader',
					brand: '"Github"',
					brandUrl: '"https://github.com/"'
				});
				return {
					id: 'page-header-url',
					title: 'URL in Brand',
					desc: 'Brand with URL.',
					xml: {
						width: 12,
						xml: <div className='no-fix-top'><NPageHeader brand='Github' brandUrl='https://github.com/'/>
						</div>
					},
					code: [compCode],
					index: 20
				};
			},
			func: function () {
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NPageHeader',
					brand: '"Github"',
					brandFunc: function () {
						alert('Brand Clicked.');
					}
				});
				return {
					id: 'page-header-func',
					title: 'Function in Brand',
					desc: 'Brand with URL.',
					xml: {
						width: 12,
						xml: <div className='no-fix-top'><NPageHeader brand='Github'
						                                              brandFunc={function() {alert('Brand Clicked.');}}/>
						</div>
					},
					code: [compCode],
					index: 30
				};
			},
			search: function () {
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NPageHeader',
					brand: '"Github"',
					search: function (text) {
						alert('Search Clicked, value is [' + text + '].');
					}
				});
				return {
					id: 'page-header-search',
					title: 'Search Box',
					desc: 'Search Box. Note search box is not working in xs media size.',
					xml: {
						width: 12,
						xml: <div className='no-fix-top'><NPageHeader brand='Github'
						                                              search={function(text) {alert('Search Clicked, value is [' + text + '].');}}/>
						</div>
					},
					code: [compCode],
					index: 40
				};
			},
			menus: function () {
				var menus = [
					{
						text: 'Search Engines',
						children: [
							{text: 'Google', url: 'https://www.google.com'},
							{divider: true},
							{
								text: 'Baidu', func: function () {
								window.open('http://www.baidu.com/', 'Baidu');
							}
							}
						]
					}, {
						text: 'About',
						func: function () {
							alert('Sorry, no about implemented.');
						}
					}
				];
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NPageHeader',
					brand: '"Github"',
					menus: 'menus'
				});
				return {
					id: 'page-header-menu',
					title: 'Menu',
					desc: 'Menu in page header.',
					xml: {
						width: 12,
						xml: <div className='no-fix-top'><NPageHeader brand='Github' menus={menus}/></div>
					},
					code: [$demo.convertJSON({variable: 'menus', json: menus}), compCode],
					index: 50
				};
			},
			sideMenu: function () {
				var menus = [
					{
						text: 'Search Engines',
						children: [
							{text: 'Google', url: 'https://www.google.com'},
							{divider: true},
							{
								text: 'Baidu', func: function () {
								window.open('http://www.baidu.com/', 'Baidu');
							}
							}
						]
					}, {
						text: 'About',
						func: function () {
							alert('Sorry, no about implemented.');
						}
					}
				];
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NPageHeader',
					brand: '"Github"',
					menus: 'menus',
					side: 'true'
				});
				var button = $pt.createCellLayout('button', {
					label: 'Show',
					comp: {
						icon: 'play',
						click: function () {
							window.open("page-header-side.html", "Page Header Side Menu Demo");
						}
					}
				});
				return {
					id: 'page-header-side',
					title: 'Side Menu',
					desc: <span>With side menu.<br/>
					Note: On brand: URL {">"} Side {">"} Function.</span>,
					xml: {width: 12, xml: <NFormButton model={$pt.createModel({})} layout={button}/>},
					code: [$demo.convertJSON({variable: 'menus', json: menus}), compCode],
					index: 50
				};
			}
		};
		return $demo.convertToExampleList(all);
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.pageHeader = function () {
		React.render(<ExampleList title='PageHeader'
		                          formType='<NPageHeader />'
		                          items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));