(function () {
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
	React.render(<NPageHeader brand="Github" menus={menus} side={true}/>, document.getElementById("page-header"));
}());