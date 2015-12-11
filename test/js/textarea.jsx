/**
 * Created by brad.wu on 8/16/2015.
 */
(function () {
    var model = $pt.createModel({
        name: null
    });
    var plainText = $pt.createCellLayout('name', {
        label: 'Plain Text',
        comp: {type: $pt.ComponentConstants.TextArea},
        pos: {row: 1, col: 1}
    });
    var placeholder = $pt.createCellLayout('name', {
        label: 'Plain Text',
        comp: {type: $pt.ComponentConstants.TextArea, placeholder: 'Placeholder...'},
        pos: {row: 1, col: 1}
    });
    var l2PlainText = $pt.createCellLayout('name', {
        label: 'Plain Text',
        comp: {type: $pt.ComponentConstants.TextArea, lines: 2},
        pos: {row: 1, col: 1}
    });
    var l3PlainTextDisabled = $pt.createCellLayout('name', {
        label: 'Plain Text',
        comp: {
            type: $pt.ComponentConstants.TextArea,
            lines: 3,
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
            <span>Plain Text</span>
            <NTextArea model={model} layout={plainText}/>
            <span>Placeholder</span>
            <NTextArea model={model} layout={placeholder}/>
            <span>2 Lines Plain Text</span>
            <NTextArea model={model} layout={l2PlainText}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3 has-error'>
            <span>Error 2 Lines Plain Text</span>
            <NTextArea model={model} layout={l2PlainText}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <span>Disabled 3 Lines Plain Text</span>
            <NTextArea model={model} layout={l3PlainTextDisabled}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3 has-error'>
            <span>Error Disabled 3 Lines Plain Text</span>
            <NTextArea model={model} layout={l3PlainTextDisabled}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <span>View Mode</span>
            <NTextArea model={model} layout={l2PlainText} view={true}/>
        </div>
    </div>);
    ReactDOM.render(panel, document.getElementById('main'));
})();
