/**
 * Created by brad.wu on 8/16/2015.
 */
(function () {
    var model = $pt.createModel({
        name: null
    });
    var checkbox = $pt.createCellLayout('name', {
        label: 'Plain Text',
        comp: {
            type: $pt.ComponentConstants.Check
        },
        pos: {row: 1, col: 1}
    });
    var labelCheckBox = $pt.createCellLayout('name', {
        label: 'Plain Text',
        comp: {
            type: $pt.ComponentConstants.Check,
            labelAttached: true
        },
        pos: {row: 1, col: 1}
    });
    var labelLeftCheckBox = $pt.createCellLayout('name', {
        label: 'Plain Text',
        comp: {
            type: $pt.ComponentConstants.Check,
            labelAttached: 'left'
        },
        pos: {row: 1, col: 1}
    });
    var disabledCheckbox = $pt.createCellLayout('name', {
        label: 'Plain Text',
        comp: {
            type: $pt.ComponentConstants.Check,
            enabled: {
                when: function () {
                    return false;
                },
                depends: 'name'
            }
        },
        pos: {row: 1, col: 1}
    });
    var disabledLabelCheckbox = $pt.createCellLayout('name', {
        label: 'Plain Text',
        comp: {
            type: $pt.ComponentConstants.Check,
            labelAttached: true,
            enabled: {
                when: function () {
                    return false;
                },
                depends: 'name'
            }
        },
        pos: {row: 1, col: 1}
    });

    var panel = (<div className='row'>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <span>Check Box</span>
            <NCheck model={model} layout={checkbox}/>
            <span>Check Box With Label</span>
            <NCheck model={model} layout={labelCheckBox}/>
            <span>Check Box With Left Label</span>
            <NCheck model={model} layout={labelLeftCheckBox}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3 has-error'>
            <span>Check Box</span>
            <NCheck model={model} layout={checkbox}/>
            <span>Check Box With Label</span>
            <NCheck model={model} layout={labelCheckBox}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <span>Disabled Check Box</span>
            <NCheck model={model} layout={disabledCheckbox}/>
            <span>Disabled Check Box With Label</span>
            <NCheck model={model} layout={disabledLabelCheckbox}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3 has-error'>
            <span>Disabled Check Box</span>
            <NCheck model={model} layout={disabledCheckbox}/>
            <span>Disabled Check Box With Label</span>
            <NCheck model={model} layout={disabledLabelCheckbox}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <span>View Mode</span>
            <NCheck model={model} layout={checkbox} view={true}/>
            <span>View Mode With Label</span>
            <NCheck model={model} layout={labelCheckBox} view={true}/>
        </div>
    </div>);
    React.render(panel, document.getElementById('main'));
})();
