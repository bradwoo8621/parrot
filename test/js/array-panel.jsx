/**
 * Created by brad.wu on 8/16/2015.
 */
(function () {
    var model = $pt.createModel({
        items: [{name: 'Name A', check: false}, {name: 'Name B', check: true}]
    }, $pt.createModelValidator({
        items: {
            table: {
                name: {
                    minlength: 3
                }
            }
        }
    }));
    var panelTemplate = {
        label: 'Normal Panel',
        dataId: 'items',
        comp: {
            type: $pt.ComponentConstants.ArrayPanel,
            editLayout: {
                name: {
                    label: 'Name',
                    pos: {row: 1, col: 1, width: 12}
                }
            }
        },
        pos: {row: 1, col: 1}
    };
    var normal = $pt.createCellLayout('panel', panelTemplate);
    var fixedTitle = $pt.createCellLayout('panel', $.extend(true, {}, panelTemplate, {
        comp: {
            itemTitle: 'Panel Title',
            style: 'primary',
            collapsible: false
        }
    }));
    var monitorTitle = $pt.createCellLayout('panel', $.extend(true, {}, panelTemplate, {
        comp: {
            itemTitle: {
                when: function (item) {
                    return item.get('name');
                },
                depends: 'name'
            },
            style: 'danger',
            expanded: false
        }
    }));
    var monitorTitleAndCheckInTitle = $pt.createCellLayout('panel', $.extend(true, {}, panelTemplate, {
        comp: {
            itemTitle: {
                when: function (item) {
                    return item.get('name');
                },
                depends: 'name'
            },
            checkInTitle: {
                data: 'check',
                label: 'Check In Title',
                collapsible: 'same'
            },
            style: 'danger',
            expanded: false
        }
    }));
    var buttonLayout = $pt.createCellLayout('button', {
        label: 'Set name of first item to be "12", and validate',
        comp: {
            type: $pt.ComponentConstants.Button,
            click: function (model) {
                var items = model.get('items');
                items[0].name = '12';
                model.update('items', items[0], items[0]);
                model.validate();
            }
        }
    });

    var panel = (<div>
        <div className='row'>
            <div className='col-md-3 col-lg-3 col-sm-3'>
                <span>Normal Array Panel</span>
                <NArrayPanel model={model} layout={normal}/>
            </div>
            <div className='col-md-3 col-lg-3 col-sm-3'>
                <span>Fixed Title Array Panel</span>
                <NArrayPanel model={model} layout={fixedTitle}/>
            </div>
            <div className='col-md-3 col-lg-3 col-sm-3'>
                <span>Monitor Title &amp; Collapsed Array Panel</span>
                <NArrayPanel model={model} layout={monitorTitle}/>
            </div>
            <div className='col-md-3 col-lg-3 col-sm-3'>
                <span>Monitor Title &amp; Collapsed &amp; Check In Title Array Panel</span>
                <NArrayPanel model={model} layout={monitorTitleAndCheckInTitle}/>
            </div>
        </div>
        <div className='row'>
            <div className='col-md-3 col-lg-3 col-sm-3'>
                <NFormButton model={model} layout={buttonLayout}/>
            </div>
        </div>
    </div>);
    React.render(panel, document.getElementById('main'));
})();
