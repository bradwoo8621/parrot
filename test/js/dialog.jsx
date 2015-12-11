/**
 * Created by brad.wu on 8/16/2015.
 */
(function () {
    var confirm = NConfirm.getConfirmModal();
    var exception = NExceptionModal.getExceptionModal();
    var onRequest = NOnRequestModal.getOnRequestModal();

    var buttonTemplate = {comp: {type: $pt.ComponentConstants.Button}};
    var normal = $pt.createCellLayout('button', $.extend(true, {
        label: 'Normal', comp: {
            click: function () {
                confirm.show('Normal', 'Alert Message', function () {
                    alert('OK Clicked')
                });
            }
        }
    }, buttonTemplate));
    var closeButton = $pt.createCellLayout('button', $.extend(true, {
        label: 'Close Button',
        comp: {
            click: function () {
                confirm.show('Close Button', {
                    close: true,
                    messages: ['Alert Message Line 1', 'Alert Message Line 2']
                });
            }
        }
    }, buttonTemplate));
    var noOKButton = $pt.createCellLayout('button', $.extend(true, {
        label: 'No OK Button',
        comp: {
            click: function () {
                confirm.show('No OK Button', {
                    disableConfirm: true,
                    messages: ['Alert Message Line 1', 'Alert Message Line 2']
                });
            }
        }
    }, buttonTemplate));
    var noCancelButton = $pt.createCellLayout('button', $.extend(true, {
        label: 'No Cancel Button',
        comp: {
            click: function () {
                confirm.show('No Cancel Button', {
                    disableClose: true,
                    messages: ['Alert Message Line 1', 'Alert Message Line 2']
                });
            }
        }
    }, buttonTemplate));
    var noButtons = $pt.createCellLayout('button', $.extend(true, {
        label: 'No Buttons',
        comp: {
            click: function () {
                confirm.show('No Buttons', {
                    disableButtons: true,
                    messages: ['Alert Message Line 1', 'Alert Message Line 2']
                });
            }
        }
    }, buttonTemplate));
    var expButton = $pt.createCellLayout('button', $.extend(true, {
        label: 'Exception',
        comp: {
            click: function () {
                exception.show('506', 'Here is the exception trace from server side.');
            }
        }
    }, buttonTemplate));
    var onReqButton = $pt.createCellLayout('button', $.extend(true, {
        label: 'On Request & No Way To Cancel',
        comp: {
            click: function () {
                onRequest.show();
            }
        }
    }, buttonTemplate));
    var panel = (<div className='row'>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <span>Confirm Dialog</span>
            <NFormButton layout={normal}/>
            <NFormButton layout={closeButton}/>
            <NFormButton layout={noOKButton}/>
            <NFormButton layout={noCancelButton}/>
            <NFormButton layout={noButtons}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <span>Exception Dialog</span>
            <NFormButton layout={expButton}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <span>On Request Dialog</span>
            <NFormButton layout={onReqButton}/>
        </div>
    </div>);
    ReactDOM.render(panel, document.getElementById('main'));
})();