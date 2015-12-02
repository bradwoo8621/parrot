/**
 * Created by brad.wu on 8/16/2015.
 */
(function () {
	var model = $pt.createModel({
		checked: null
	});
	var toggle = $pt.createCellLayout('checked', {
		label: 'Plain Text',
		comp: {
			type: $pt.ComponentConstants.Toggle,
			labelAttached: {
				left: 'Yes',
				right: 'No'
			}
		},
		pos: {row: 1, col: 1}
	});
	var disabledCheckbox = $pt.createCellLayout('checked', {
		label: 'Plain Text',
		comp: {
			type: $pt.ComponentConstants.Toggle,
			enabled: false
		},
		pos: {row: 1, col: 1}
	});

	var panel = (<div className='row'>
		<div className='col-md-3 col-lg-3 col-sm-3'>
			<span>Toggle Button</span>
			<NToggle model={model} layout={toggle}/>
		</div>
		<div className='col-md-3 col-lg-3 col-sm-3 has-error'>
			<span>Toggle Button</span>
			<NToggle model={model} layout={toggle}/>
		</div>
		<div className='col-md-3 col-lg-3 col-sm-3'>
			<span>Disabled Toggle Button</span>
			<NToggle model={model} layout={disabledCheckbox}/>
		</div>
		<div className='col-md-3 col-lg-3 col-sm-3 has-error'>
			<span>Disabled Toggle Button</span>
			<NToggle model={model} layout={disabledCheckbox}/>
		</div>
		<div className='col-md-3 col-lg-3 col-sm-3'>
			<span>View Mode</span>
			<NToggle model={model} layout={toggle} view={true}/>
		</div>
	</div>);
	React.render(panel, document.getElementById('main'));
})();
