/**
 * Created by brad.wu on 8/16/2015.
 */
(function () {
    var model = $pt.createModel({
        name: null
    });
    var data = $pt.createCodeTable([
        {id: '1', text: 'Radio A'},
        {id: '2', text: 'Radio B'},
        {id: '3', text: 'Radio C'}
    ]);
    var radioButton = $pt.createCellLayout('name', {
        label: 'Plain Text',
        comp: {
            type: $pt.ComponentConstants.Radio,
            data: data
        },
        pos: {row: 1, col: 1}
    });
    var radioButtonLeft = $pt.createCellLayout('name', {
        label: 'Plain Text',
        comp: {
            type: $pt.ComponentConstants.Radio,
            data: data,
            labelAtLeft: true
        },
        pos: {row: 1, col: 1}
    });
    var verticalRadioButton = $pt.createCellLayout('name', {
        label: 'Plain Text',
        comp: {
            type: $pt.ComponentConstants.Radio,
            direction: 'vertical',
            data: data
        },
        pos: {row: 1, col: 1}
    });
    var disabledRadioButton = $pt.createCellLayout('name', {
        label: 'Plain Text',
        comp: {
            type: $pt.ComponentConstants.Radio,
            enabled: {
                when: function () {
                    return false;
                },
                depends: 'name'
            },
            data: data
        },
        pos: {row: 1, col: 1}
    });
    var verticalDisabledRadioButton = $pt.createCellLayout('name', {
        label: 'Plain Text',
        comp: {
            type: $pt.ComponentConstants.Radio,
            enabled: {
                when: function () {
                    return false;
                },
                depends: 'name'
            },
            data: data,
            direction: 'vertical'
        },
        pos: {row: 1, col: 1}
    });

    var panel = (<div className='row'>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <span>Radio Button</span>
            <NRadio model={model} layout={radioButton}/>
            <span>Vertical Radio Button</span>
            <NRadio model={model} layout={verticalRadioButton}/>
            <span>Radio Button With Left Label</span>
            <NRadio model={model} layout={radioButtonLeft}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3 has-error'>
            <span>Error Radio Button</span>
            <NRadio model={model} layout={radioButton}/>
            <span>Error Vertical Radio Button</span>
            <NRadio model={model} layout={verticalRadioButton}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <span>Disabled Radio Button</span>
            <NRadio model={model} layout={disabledRadioButton}/>
            <span>Disabled Vertical Radio Button</span>
            <NRadio model={model} layout={verticalDisabledRadioButton}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3 has-error'>
            <span>Disabled Radio Button</span>
            <NRadio model={model} layout={disabledRadioButton}/>
            <span>Disabled Vertical Radio Button</span>
            <NRadio model={model} layout={verticalDisabledRadioButton}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <span>View Mode</span>
            <NRadio model={model} layout={radioButton} view={true}/>
            <span>View Mode Vertical</span>
            <NRadio model={model} layout={verticalRadioButton} view={true}/>
        </div>
    </div>);
    React.render(panel, document.getElementById('main'));
})();
