/**
 * Created by brad.wu on 8/16/2015.
 */
(function () {
    var save = function () {
        alert('Save Clicked');
    };
    var validate = function () {
        alert('Validate Clicked');
    };
    var reset = function () {
        alert('Reset Clicked');
    };
    var cancel = function () {
        alert('Cancel Clicked');
    };
    var left = {
        icon: 'pencil',
        text: 'Left',
        click: function () {
            alert('Left Clicked');
        },
        style: 'success',
        labelPosition: 'left'
    };
    var right = [
        {
            icon: 'pencil',
            text: 'Right One',
            click: function () {
                alert('Right One Clicked');
            },
            style: 'info'
        },
        {
            icon: 'pencil',
            text: 'Right Two',
            click: function () {
                alert('Right Two Clicked');
            },
            style: 'info'
        }
    ];

    var panel = (<div>
        <div className='row'>
            <div className='col-md-6 col-lg-6 col-sm-6'>
                <span>4 Default Buttons</span>
                <NPanelFooter save={save} reset={reset} validate={validate} cancel={cancel}/>
            </div>
        </div>
        <div className='row'>
            <div className='col-md-6 col-lg-6 col-sm-6'>
                <span>Hide Reset</span>
                <NPanelFooter save={save} validate={validate} cancel={cancel}/>
            </div>
        </div>
        <div className='row'>
            <div className='col-md-6 col-lg-6 col-sm-6'>
                <span>Hide Reset/Cancel, Add Left</span>
                <NPanelFooter save={save} validate={validate} left={left}/>
            </div>
        </div>
        <div className='row'>
            <div className='col-md-9 col-lg-9 col-sm-9'>
                <span>Hide Reset/Cancel, Add Left</span>
                <NPanelFooter save={save} validate={validate} cancel={cancel} left={left} right={right}/>
            </div>
        </div>
    </div>);
    ReactDOM.render(panel, document.getElementById('main'));
})();