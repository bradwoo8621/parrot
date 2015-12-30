/**
 * Created by brad.wu on 8/16/2015.
 */
(function () {
    var model = $pt.createModel({
        name: '7'
    });
    var data = $pt.createCodeTable([
        {id: '1', text: 'Option A'},
        {id: '2', text: 'Option B'},
        {id: '3', text: 'Option C'},
        {id: '4', text: 'Option D'},
        {id: '5', text: 'Option AAAAA BBBBB CCCCCCCCCCCCC DDDDDD EEEE'},
        {id: '6', text: 'Option F'},
        {id: '7', text: 'Option G'},
        {id: '8', text: 'Option H'},
        {id: '9', text: 'Option I'},
        {id: '10', text: 'Option J'},
        {id: '11', text: 'Option K'}
    ]);
    var normal = $pt.createCellLayout('name', {
        label: 'Click me',
        comp: {
            type: $pt.ComponentConstants.Select,
            data: data,
            minimumResultsForSearch: Infinity
        },
        pos: {row: 1, col: 1}
    });
    var filter = $pt.createCellLayout('name', {
        label: 'Click me',
        comp: {
            type: $pt.ComponentConstants.Select,
            data: data,
            minimumResultsForSearch: 1
        },
        pos: {row: 1, col: 1}
    });
    var disabledNormal = $pt.createCellLayout('name', {
        label: 'Click me',
        comp: {
            type: $pt.ComponentConstants.Select,
            data: data,
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
            <span>Select2</span>
            <NSelect model={model} layout={normal}/>
            <span>Option Filter Select2</span>
            <NSelect model={model} layout={filter}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3 has-error'>
            <span>Error Select2</span>
            <NSelect model={model} layout={normal}/>
            <span>Error Option Filter Select2</span>
            <NSelect model={model} layout={filter}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <span>Disabled Select2</span>
            <NSelect model={model} layout={disabledNormal}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3 has-error'>
            <span>Error Disabled Select2</span>
            <NSelect model={model} layout={disabledNormal}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <span>View Mode</span>
            <NSelect model={model} layout={normal} view={true}/>
        </div>
    </div>);
    ReactDOM.render(panel, document.getElementById('main'));
})();
