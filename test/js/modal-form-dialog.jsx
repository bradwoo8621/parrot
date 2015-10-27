/**
 * Created by brad.wu on 8/16/2015.
 */
(function () {
    var form = NModalForm.createFormModal('Test Modal Form');
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
                    },
                    draggable: true
                });
            }
        }
    }, buttonTemplate));
    var noFooter = $pt.createCellLayout('button', $.extend(true, {
        label: 'No Footer', comp: {
            click: function () {
                form.show(model, layout, null, null, false);
            }
        }
    }, buttonTemplate));
    var custButtons = $pt.createCellLayout('button', $.extend(true, {
        label: 'Custom Buttons', comp: {
            click: function () {
                form.show(model, layout, {
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
            <NFormButton layout={noFooter}/>
            <NFormButton layout={custButtons}/>
        </div>
    </div>);
    React.render(panel, document.getElementById('main'));
})();
