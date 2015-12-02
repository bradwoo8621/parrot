/**
 * Created by brad.wu on 8/16/2015.
 */
(function () {
	var tree = $pt.createCodeTable([
		{
			id: 1,
			text: 'Languages',
			children: [
				{id: 2, text:'Java'},
				{id: 3, text:'C#'}
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
	</div>);
	React.render(panel, document.getElementById('main'));
})();
