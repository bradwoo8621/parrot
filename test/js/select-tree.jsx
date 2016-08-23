/**
 * Created by brad.wu on 8/16/2015.
 */
(function () {
	$.mockjax({
        url: '/app/codetable',
        responseTime: 2000,
        response: function () {
            this.responseText = [
				{
					id: 1,
					text: 'Languages',
					children: [
						{id: 2, text:'Java'},
						{id: 3, text:'C#'},
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
        }
    });
	var tree = $pt.createCodeTable([
		{
			id: 1,
			text: 'Languages',
			children: [
				{id: 2, text:'Java'},
				{id: 3, text:'C#'},
				{id: 10, text:'Java 2222222222222222222222222222222222222222222222222224'},
				{id: 11, text:'Java 3'},
				{id: 12, text:'Java 4'},
				{id: 13, text:'Java 5'},
				{id: 14, text:'Java 6'},
				{id: 15, text:'Java 7'},
				{id: 16, text:'Java 8'},
				{id: 17, text:'Java 9'},
				{id: 18, text:'Java 10'},
				{id: 19, text:'Java 11'},
				{id: 20, text:'Java 12'},
				{id: 21, text:'Java 13'},
				{id: 22, text:'Java 14'},
				{id: 23, text:'Java 15'},
				{id: 24, text:'Java 16'},
				{id: 25, text:'Java 17'},
				{id: 26, text:'Java 18'},
				{id: 27, text:'Java 19'},
				{id: 28, text:'Java 20'},
				{id: 29, text:'Java 21'},
				{id: 30, text:'Java 22'},
				{id: 31, text:'Java 23'},
				{id: 32, text:'Java 24'},
				{id: 33, text:'Java 25'},
				{id: 34, text:'Java 26'},
				{id: 35, text:'Java 27'},
				{id: 36, text:'Java 28'},
				{id: 37, text:'Java 29'},
				{id: 38, text:'Java 30'},
				{id: 39, text:'Java 31'},
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
	]);
	var model = $pt.createModel({});
	var selectTree = $pt.createCellLayout('value', {
		comp: {
			type: $pt.ComponentConstants.SelectTree,
			data: tree,
			hideChildWhenParentChecked: true,
			treeLayout: {
				comp: {
					hierarchyCheck: true,
					// valueAsArray: true
				}
			}
		},
		pos: {row: 1, col: 1}
	});
	var disabledSelectTree = $pt.createCellLayout('value', {
		comp: {
			type: $pt.ComponentConstants.SelectTree,
			data: tree,
			enabled: false,
			treeLayout: {
				comp: {
					hierarchyCheck: true,
					// valueAsArray: true
				}
			}
		},
		pos: {row: 1, col: 1}
	});
	var remote = $pt.createCellLayout('value', {
		comp: {
			type: $pt.ComponentConstants.SelectTree,
			data: $pt.createCodeTable({url: '/app/codetable'})
		},
		pos: {row: 1, col: 1}
	});

	var dialog = NModalForm.createFormModal("Test");
	dialog.show({
		model: model,
		layout: $pt.createFormLayout({
			treeValue: {
				label: 'Select Tree In Dialog',
				comp: {
					type: $pt.ComponentConstants.SelectTree,
					data: tree,
					treeLayout: {
						comp: {
							hierarchyCheck: true,
							valueAsArray: true
						}
					}
				},
				pos: {row: 1, col: 1, width: 12}
			}
		})
	});

	var panel = (<div className='row'>
		<div style={{height: "100px"}}/>
		<div className='col-md-3 col-lg-3 col-sm-3'>
			<span>Select Tree</span>
			<NSelectTree model={model} layout={selectTree}/>
		</div>
		<div className='col-md-3 col-lg-3 col-sm-3'>
			<span>Disabled Select Tree</span>
			<NSelectTree model={model} layout={disabledSelectTree}/>
		</div>
		<div className='col-md-3 col-lg-3 col-sm-3 has-error'>
			<span>Error Select Tree</span>
			<NSelectTree model={model} layout={selectTree}/>
		</div>
		<div className='col-md-3 col-lg-3 col-sm-3 has-error'>
			<span>Error and Disabled Select Tree</span>
			<NSelectTree model={model} layout={disabledSelectTree}/>
		</div>
		<div className='col-md-3 col-lg-3 col-sm-3'>
			<span>View Mode</span>
			<NSelectTree model={model} layout={selectTree} view={true}/>
			<NSelectTree model={model} layout={disabledSelectTree} view={true}/>
		</div>
		<div className='col-md-3 col-lg-3 col-sm-3'>
			<span>Remote</span>
			<NSelectTree model={model} layout={remote} />
		</div>
		<div style={{height: "1000px"}}/>
	</div>);
	ReactDOM.render(panel, document.getElementById('main'));
})();
