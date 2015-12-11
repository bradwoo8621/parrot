/**
 * Created by brad.wu on 8/16/2015.
 */
(function () {
    var codes = $pt.createCodeTable([
        {id: '1', text: 'One'},
        {id: '2', text: 'Two'},
        {id: '3', text: 'Three'}
    ]);
    var model = $pt.createModel({
        values: ['1', '2']
    });
    var normal = $pt.createCellLayout('values', {
        comp: {
            data: codes
        },
        pos: {row: 1, col: 1}
    });
    var labelInLeft = $pt.createCellLayout('values', {
        comp: {
            data: codes,
            labelAttached: 'left'
        },
        pos: {row: 1, col: 1}
    });
    var vertical = $pt.createCellLayout('values', {
        comp: {
            data: codes,
            direction: 'vertical'
        },
        pos: {row: 1, col: 1}
    });
    var disabled = $pt.createCellLayout('values', {
        comp: {
            data: codes,
            enabled: false
        },
        pos: {row: 1, col: 1}
    });
    var disabledLabelInLeft = $pt.createCellLayout('values', {
        comp: {
            data: codes,
            labelAttached: 'left',
            enabled: false
        },
        pos: {row: 1, col: 1}
    });

    var panel = (<div className='row'>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <span>All Default</span>
            <NArrayCheck model={model} layout={normal}/>
            <span>Label in left</span>
            <NArrayCheck model={model} layout={labelInLeft}/>
            <span>Vertical</span>
            <NArrayCheck model={model} layout={vertical}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3 has-error'>
            <span>All Default</span>
            <NArrayCheck model={model} layout={normal}/>
            <span>Label in left</span>
            <NArrayCheck model={model} layout={labelInLeft}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <span>Disabled</span>
            <NArrayCheck model={model} layout={disabled}/>
            <span>Disabled, label in left</span>
            <NArrayCheck model={model} layout={disabledLabelInLeft}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3 has-error'>
            <span>Disabled</span>
            <NArrayCheck model={model} layout={disabled}/>
            <span>Disabled, label in left</span>
            <NArrayCheck model={model} layout={disabledLabelInLeft}/>
        </div>
    </div>);
    ReactDOM.render(panel, document.getElementById('main'));
})();
