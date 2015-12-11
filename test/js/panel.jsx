/**
 * Created by brad.wu on 8/16/2015.
 */
(function () {
    var model = $pt.createModel({
        name: null
    });
    var panelTemplate = {
        label: 'Normal Panel',
        comp: {
            type: $pt.ComponentConstants.Panel,
            editLayout: {
                name: {
                    label: 'Name',
                    pos: {row: 1, col: 1, width: 6}
                }
            }
        },
        pos: {row: 1, col: 1}
    };
    var normal = $pt.createCellLayout('name', panelTemplate);
    var primary = $pt.createCellLayout('name', $.extend(true, {}, panelTemplate, {
        label: 'Primary Panel',
        comp: {style: 'primary'}
    }));
    var danger = $pt.createCellLayout('name', $.extend(true, {}, panelTemplate, {
        label: 'Danger Panel',
        comp: {style: 'danger'}
    }));
    var warning = $pt.createCellLayout('name', $.extend(true, {}, panelTemplate, {
        label: 'Warning Panel',
        comp: {style: 'warning'}
    }));
    var info = $pt.createCellLayout('name', $.extend(true, {}, panelTemplate, {
        label: 'Info Panel',
        comp: {style: 'info'}
    }));
    var success = $pt.createCellLayout('name', $.extend(true, {}, panelTemplate, {
        label: 'Success Panel',
        comp: {style: 'success'}
    }));
    var collapsible = $pt.createCellLayout('name', $.extend(true, {}, panelTemplate, {
        label: 'Collapsible Panel',
        comp: {collapsible: true}
    }));
    var collapsibleAndClose = $pt.createCellLayout('name', $.extend(true, {}, panelTemplate, {
        label: 'Collapsible and Closed Panel',
        comp: {
            collapsible: true,
            expanded: false
        }
    }));
    var checkInTitle = $pt.createCellLayout('name', $.extend(true, {}, panelTemplate, {
        label: 'Check In Title',
        comp: {
            checkInTitle: {
                data: 'check',
                label: 'Check In title'
            }
        }
    }));
    var checkInTitleSame = $pt.createCellLayout('name', $.extend(true, {}, panelTemplate, {
        label: 'Check In Title, Same as Collapsible',
        comp: {
            checkInTitle: {
                data: 'check',
                label: 'Check In title',
                collapsible: 'same'
            },
            style: 'primary'
        }
    }));
    var checkInTitleReverse = $pt.createCellLayout('name', $.extend(true, {}, panelTemplate, {
        label: 'Check In Title, Reverse Collapsible',
        comp: {
            checkInTitle: {
                data: 'check',
                label: 'Check In title',
                collapsible: 'reverse'
            },
            style: 'danger'
        }
    }));
    var checkInTitleCollapsible = $pt.createCellLayout('name', $.extend(true, {}, panelTemplate, {
        label: 'Check In Title, Same as Collapsible',
        comp: {
            checkInTitle: {
                data: 'check',
                label: 'Check In title',
                collapsible: 'same'
            },
            collapsible: true,
            style: 'info'
        }
    }));
    var checkInTitleSameClosed = $pt.createCellLayout('name', $.extend(true, {}, panelTemplate, {
        label: 'Check In Title, Same as Collapsible',
        comp: {
            checkInTitle: {
                data: 'check',
                label: 'Check In title',
                collapsible: 'same'
            },
            collapsible: true,
            expanded: false,
            style: 'warning'
        }
    }));
    var checkInTitleReverseClosed = $pt.createCellLayout('name', $.extend(true, {}, panelTemplate, {
        label: 'Check In Title, Same as Collapsible',
        comp: {
            checkInTitle: {
                data: 'check',
                label: 'Check In title',
                collapsible: 'reverse'
            },
            collapsible: true,
            expanded: false,
            style: 'success'
        }
    }));
    var checkInTitleDepends = $pt.createCellLayout('name', $.extend(true, {}, panelTemplate, {
        label: 'Check In Title, Depends On Name Property',
        comp: {
            checkInTitle: {
                data: 'check',
                label: 'Check In title',
                enabled: {
                    when: function (model) {
                        return model.get('name') != null && !model.get('name').isBlank();
                    },
                    depends: 'name'
                },
                labelAttached: 'right'
            },
            collapsible: true,
            expanded: false,
            style: 'success'
        }
    }));
    var titleChanging = $pt.createCellLayout('name', $.extend(true, {}, panelTemplate, {
        label: 'Title changing when expanded and collapsed',
        comp: {
            collapsible: true,
            expandedLabel: 'I\'m expanded',
            collapsedLabel: 'I\'m collapsed'
        }
    }));
    var titleChangingFunc = $pt.createCellLayout('name', $.extend(true, {}, panelTemplate, {
        label: 'Title changing when expanded and collapsed',
        comp: {
            collapsible: true,
            expandedLabel: {
                when: function (model) {
                    return 'I\'m expanded, and name=' + model.get('name') + '.';
                }, depends: 'name'
            },
            collapsedLabel: {
                when: function (model) {
                    return 'I\'m collapsed, and name=' + model.get('name') + '.';
                }, depends: 'name'
            }
        }
    }));

    var panel = (<div className='row'>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <NPanel model={model} layout={normal}/>
            <NPanel model={model} layout={primary}/>
            <NPanel model={model} layout={danger}/>
            <NPanel model={model} layout={warning}/>
            <NPanel model={model} layout={info}/>
            <NPanel model={model} layout={success}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <NPanel model={model} layout={collapsible}/>
            <NPanel model={model} layout={collapsibleAndClose}/>
            <NPanel model={model} layout={titleChanging}/>
            <NPanel model={model} layout={titleChangingFunc}/>
        </div>
        <div className='col-md-6 col-lg-6 col-sm-6'>
            <NPanel model={model} layout={checkInTitle}/>
            <NPanel model={model} layout={checkInTitleSame}/>
            <NPanel model={model} layout={checkInTitleReverse}/>
            <NPanel model={model} layout={checkInTitleCollapsible}/>
            <NPanel model={model} layout={checkInTitleSameClosed}/>
            <NPanel model={model} layout={checkInTitleReverseClosed}/>
            <NPanel model={model} layout={checkInTitleDepends}/>
        </div>
        <div className='col-md-6 col-lg-6 col-sm-6'>
            <NPanel model={model} layout={checkInTitle} view={true}/>
            <NPanel model={model} layout={checkInTitleSame} view={true}/>
            <NPanel model={model} layout={checkInTitleReverse} view={true}/>
            <NPanel model={model} layout={checkInTitleCollapsible} view={true}/>
            <NPanel model={model} layout={checkInTitleSameClosed} view={true}/>
            <NPanel model={model} layout={checkInTitleReverseClosed} view={true}/>
            <NPanel model={model} layout={checkInTitleDepends} view={true}/>
        </div>
    </div>);
    ReactDOM.render(panel, document.getElementById('main'));
})();
