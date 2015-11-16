(function (context, $) {
	var $demo = $pt.getService(context, '$demo');

	var painter = function () {
		var items = [
			{
				id: 'codetable',
				title: 'Code Table',
				pattern: '$pt.createCodeTable(items: JSON[], renderer: function, sorter: CodeTableSorter) : CodeTable',
				desc: <span>Create a <code>CodeTable</code>.<br/>
				<code>items</code>: JSON array (local data) or JSON (remote data).<br/>
				1. If it is a JSON array, each item of array should be a JSON object likes <code>{'\u007B'}id:
						string|number, text: string{'\u007D'}</code>.
				<code>text</code> is not necessary if <code>renderer</code> is declared. Any other property of JSON is accepted.<br/>
				2. If it is a JSON, pattern as <code>{'\u007B'}url: string, data: JSON{'\u007D'}</code>,
				<code>url</code>is the servcie location, must return a JSON array follow the option one.
				<code>data</code> is optional, will send to server side if exists.<br/>
				<code>renderer</code>: only one parameter, is item of items, a JSON object. Returns string to be text of code.<br/>
				<code>sorter</code>: object which has sort function, pass items array to this function.<br/>
				<code>children</code> of code table item is default recognized,
				<code>renderer</code> and <code>sorter</code> are applied to children automatically.
				See <code>listAllChildren</code> and <code>#listWithHierarchyKeys</code>.</span>,
				children: [
					{
						id: 'codetable-filter',
						title: '#filter',
						pattern: '#filter(param: function|{value: *, name: string}) : JSON[]',
						desc: <span>
						1. If it is a function, same as <code>Array.filter</code>.<br/>
						2. If it is a JSON:<br/>
						2.a Code table is on local, use the <code>name</code> to filter local code array. <br/>
						eg. code item is <code>{'\u007B'}id: '1', from: 'CHN'{'\u007D'}</code>,
						then value of <code>name</code> should be <code>from</code>, value of <code>value</code> should be <code>CHN</code>.<br/>
						2.b Code table is on remote, use the <code>data</code> JSON which accepts by constructor,
						add property <code>value</code>, send to appointed <code>url</code>. return a JSON array.<br/>
						Remote data will be cached on local memory, which means, if for same value of <code>value</code>, get from local.</span>
					},
					{
						id: 'codetable-get',
						title: '#get',
						pattern: '#get(code: string|number) : JSON',
						desc: <span>Get code item by given code.</span>
					},
					{
						id: 'codetable-getText',
						title: '#getText',
						pattern: '#getText(code: string|number) : string',
						desc: <span>Get code display text by given code.</span>
					},
					{
						id: 'codetable-list',
						title: '#list',
						pattern: '#list() : JSON[]',
						desc:
							<span>Get all code items. If code table is on remote, fetch from server by <code>url</code> and <code>data</code>.</span>
					},
					{
						id: 'codetable-listAllChildren',
						title: '#listAllChildren',
						pattern: '#listAllChildren() : {}',
						desc:
							<span>
								Get all code items including children as a map.
								<span className='text-danger'>Note duplicated ids of item and children are not allowed.</span>
							</span>
					},
					{
						id: 'codetable-listWithHierarchyKeys',
						title: '#listWithHierarchyKeys',
						pattern: '#listWithHierarchyKeys({separtor: string, rootId: string}) : {}',
						desc:
							<span>Get all code items with hierarchy keys as a map.</span>
					},
					{
						id: 'codetable-map',
						title: '#map',
						pattern: '#map(func: function) : *[]',
						desc: <span>Get all code items, same as <code>Array.map</code>.
						If code table is on remote, fetch from server by <code>url</code> and <code>data</code>.</span>
					},
					{
						id: 'codetable-name',
						title: '#name',
						pattern: '#name(name: string) : string',
						desc: <span>Get or set name of code table. Get when no parameter.</span>
					},
					{
						id: 'codetable-some',
						title: '#some',
						pattern: '#some(func: function) : boolean',
						desc: <span>Check code items, same as <code>Array.some</code>.
						If code table is on remote, fetch from server by <code>url</code> and <code>data</code>.</span>
					}
				]
			},
			{
				id: 'sorter',
				title: 'Sorter',
				pattern: '$pt.createDefaultCodeTableSorter(otherId: string) : CodeTableSorter',
				desc: <span>Create a <code>CodeTableSorter</code>, which will keep the given <code>otherId</code> at the last of options.</span>,
				children: [
					{
						id: 'sorter-sort',
						title: '#sort',
						pattern: '#sort(codes: JSON[])',
						desc: <span>sort code items, same as <code>Array.sort</code>.
						Actually, any object with sort function can be used as CodeTableSorter, even a plain JSON object.</span>
					}
				]
			}
		];
		return items;
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.codetable = function () {
		React.render(<APIList title='Code Table' items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));
