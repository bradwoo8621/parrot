(function (context, $) {
	var $demo = $pt.getService(context, '$demo');

	var painter = function () {
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

		var buttons = [{text: 'show', style: 'primary'}, {text: 'hide', style: 'info'}];
		var all = {
			defaultOptions: function () {
				var compCode = $demo.convertComponentCreatorToString({
					tag: 'NSideMenu',
					menus: 'menus'
				});
				var sideMenu = NSideMenu.getSideMenu(menus);
				buttons[0].click = function () {
					sideMenu.show();
				};
				buttons[1].click = function () {
					sideMenu.hide();
				};
				return {
					id: 'side-menu-default',
					title: 'Default',
					desc: <span>Side menu.<br/>
						Create via <code>NSideMenu.getSideMenu</code>. Keep the instance if render by JSX.</span>,
					xml: {
						width: 12,
						xml: <div>
							<NPanelFooter right={buttons}/>
						</div>
					},
					code: [$demo.convertJSON({variable: 'menus', json: menus}), compCode],
					index: 10
				};
			},
			api: function () {
				return {
					id: 'side-menu-api',
					title: 'API',
					desc: <span><code>NSideMenu.getSideMenu</code> accepts four parameters:<br/>
					1. <code>menus</code>: JSON array. See example,<br/>
					2. <code>containerId</code>: string. Use different container id for different side menu,<br/>
					3. <code>className</code>: string. Additional CSS class name,<br/>
					4. <code>hover</code>: boolean. Hide after 300ms when hover is true. default is false.<br/>
					If side menu with given container id exists, returns it. Or create new one.
					</span>,
					index: 20
				};
			}
		};
		return $demo.convertToExampleList(all);
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.sideMenu = function () {
		React.render(<ExampleList title='NSideMenu'
		                          formType='<NSideMenu />'
		                          items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));