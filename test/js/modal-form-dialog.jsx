/**
 * Created by brad.wu on 8/16/2015.
 */
(function () {
    var form = NModalForm.createFormModal('Normal Form Modal');
    var floatForm = NModalForm.createFormModal('Floating Form Dialog');
    var collapsibleForm = NModalForm.createFormModal('Collapsible Form Modal');
    var noFooterForm = NModalForm.createFormModal('No Footer Form Modal');
    var noCloseForm = NModalForm.createFormModal('No Dialog Close Button Form Modal');
    var customForm = NModalForm.createFormModal('Custom Form Modal');
    var model = $pt.createModel({name: null});
    var layout = $pt.createFormLayout({
        name: {
            label: 'Name',
            pos: {row: 1, col: 1}
        }
    });

    var buttonTemplate = {comp: {type: $pt.ComponentConstants.Button}};
    var normal = $pt.createCellLayout('button', $.extend(true, {
        label: 'Normal', comp: {
            click: function () {
                form.show({
                    model: model,
                    layout: layout,
                    buttons: {
                        save: function () {
                            alert('Save Clicked');
                        }
                    }
                });
            }
        }
    }, buttonTemplate));
    var floating = $pt.createCellLayout('button', $.extend(true, {
        label: 'Floating', comp: {
            click: function () {
                floatForm.show({
                    model: model,
                    layout: layout,
                    draggable: true
                });
            }
        }
    }, buttonTemplate));
    var floatingWithPos = $pt.createCellLayout('button', $.extend(true, {
        label: 'Floating With Position', comp: {
            click: function () {
                floatForm.show({
                    model: model,
                    layout: layout,
                    draggable: true,
                    modal: true,
                    pos: {
                        right: 20,
                        left: 30,
                        bottom: 0
                    },
                    buttons: {
                        cancel: function(model, hide) {
                            console.log(model);
                            hide.call(this);
                        }
                    }
                });
            }
        }
    }, buttonTemplate));
    var collapsible = $pt.createCellLayout('button', $.extend(true, {
        label: 'Collapsible', comp: {
            click: function () {
                collapsibleForm.show({
                    model: model,
                    layout: layout,
                    collapsible: true
                });
            }
        }
    }, buttonTemplate));
    var collapsed = $pt.createCellLayout('button', $.extend(true, {
        label: 'Collapsed', comp: {
            click: function () {
                collapsibleForm.show({
                    model: model,
                    layout: layout,
                    collapsible: true,
                    expanded: false
                });
            }
        }
    }, buttonTemplate));
    var noFooter = $pt.createCellLayout('button', $.extend(true, {
        label: 'No Footer', comp: {
            click: function () {
                noFooterForm.show(model, layout, null, null, false);
            }
        }
    }, buttonTemplate));
    var noClose = $pt.createCellLayout('button', $.extend(true, {
        label: 'No Close', comp: {
            click: function () {
                noCloseForm.show({
                    model: model,
                    layout: layout,
                    buttons: {
                        dialogCloseShown: false
                    }
                });
            }
        }
    }, buttonTemplate));
    var custButtons = $pt.createCellLayout('button', $.extend(true, {
        label: 'Custom Buttons', comp: {
            click: function () {
                customForm.show(model, layout, {
                    reset: false,
                    validate: false,
                    cancel: false,
                    left: {
                        icon: 'pencil',
                        text: 'Left one',
                        click: function () {
                            alert('Left One Clicked');
                        }
                    },
                    right: [{
                        icon: 'pencil',
                        text: 'Right Two',
                        style: 'primary',
                        click: function () {
                            alert('Right Two Clicked');
                        }
                    }, {
                        icon: 'pencil',
                        text: 'Right one',
                        style: 'danger',
                        click: function () {
                            alert('Right One Clicked');
                        }
                    }]
                }, 'horizontal');
            }
        }
    }, buttonTemplate));
    var panel = (<div className='row'>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <span>Modal Form Dialog</span>
            <NFormButton layout={normal}/>
            <NFormButton layout={floating}/>
            <NFormButton layout={floatingWithPos}/>
            <NFormButton layout={collapsible}/>
            <NFormButton layout={collapsed}/>
            <NFormButton layout={noFooter}/>
            <NFormButton layout={noClose}/>
            <NFormButton layout={custButtons}/>
        </div>
        <div style={{height: 2000}} />
        <NFormButton layout={floatingWithPos}/>
    </div>);
    ReactDOM.render(panel, document.getElementById('main'));
})();
