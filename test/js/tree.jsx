/**
 * Created by brad.wu on 8/16/2015.
 */
(function () {
	var data = [
		{
			id: 1,
			text: 'Languages',
			children: [
				{
					id: 2,
					text:'Java',
					children: [
						{id: 8, text: 'OracleJDK'},
						{id: 9, text: 'OpenJDK'}
					]
				},
				{
					id: 3,
					text:'C#',
					children: [
						{id: 10, text: '5.0'},
						{id: 11, text: '6.0'}
					]
				}
			]
		}, {
			id: 4,
			text: 'Costing',
			children: [
				{id: 5, text: '1,000'},
				{id: 6, text: '2,000'}
			]
		}, {
			id: 7,
			text: 'Others',
			folder: true
		}
	];
	var nodes = $pt.createCodeTable(data);
	$.mockjax({
        url: '/app/codetable',
        responseTime: 5000,
        response: function () {
            this.responseText = data;
        }
    });
	console.log(nodes.listWithHierarchyKeys({separtor: NTree.NODE_SEPARATOR, rootId: NTree.ROOT_ID}));
	console.log(nodes.listAllChildren());
	var model = $pt.createModel({nodes: null});
	var tree = $pt.createCellLayout('nodes', {
		label: 'Plain Text',
		comp: {
			type: $pt.ComponentConstants.Tree,
			data: nodes,
			root: false,
			check: true,
			valueAsArray: true,
			hierarchyCheck: true,
			// multiple: false,
			expandLevel: 2,
			inactiveSlibing: true,
			border: true
		},
		pos: {row: 1, col: 1}
	});
	var remote = $pt.createCellLayout('nodes', {
		label: 'Plain Text',
		comp: {
			type: $pt.ComponentConstants.Tree,
			data: $pt.createCodeTable({url: '/app/codetable'}),
			root: false,
			check: true,
			valueAsArray: true,
			hierarchyCheck: true,
			// multiple: false,
			expandLevel: 'all',
			inactiveSlibing: true,
			border: true
		},
		pos: {row: 1, col: 1}
	});
	var button = $pt.createCellLayout('button', {
		label: 'Click',
		comp: {
			click: function(model) {
				model.set('nodes', null);
			}
		}
	});
	var panel = (<div className='row'>
		<div className='col-md-3 col-lg-3 col-sm-3'>
			<span>Tree</span>
			<NTree model={model} layout={tree}/>
		</div>
		<div className='col-md-3 col-lg-3 col-sm-3'>
			<span>View Mode</span>
			<NTree model={model} layout={tree} view={true}/>
		</div>
		<div className='col-md-3 col-lg-3 col-sm-3'>
			<span>Remote</span>
			<NTree model={model} layout={remote}/>
		</div>
		<div className='col-md-3 col-lg-3 col-sm-3'>
			<NFormButton model={model} layout={button} />
		</div>
	</div>);
	ReactDOM.render(panel, document.getElementById('main'));
})();
