/**
 * Created by brad.wu on 8/16/2015.
 */
(function () {
    var model = $pt.createModel({
        name: null
    });
    var button = $pt.createCellLayout('name', {
        label: 'Click me',
        comp: {
            type: $pt.ComponentConstants.Button
        },
        pos: {row: 1, col: 1}
    });
    var iconButton = $pt.createCellLayout('name', {
        label: 'Click me',
        comp: {
            type: $pt.ComponentConstants.Button,
            icon: 'pencil'
        },
        pos: {row: 1, col: 1}
    });
    var primaryIconButton = $pt.createCellLayout('name', {
        label: 'Click me',
        comp: {
            type: $pt.ComponentConstants.Button,
            icon: 'pencil',
            style: 'primary'
        },
        pos: {row: 1, col: 1}
    });
    var dangerIconButton = $pt.createCellLayout('name', {
        label: 'Click me',
        comp: {
            type: $pt.ComponentConstants.Button,
            icon: 'pencil',
            style: 'danger'
        },
        pos: {row: 1, col: 1}
    });
    var warnIconButton = $pt.createCellLayout('name', {
        label: 'Click me',
        comp: {
            type: $pt.ComponentConstants.Button,
            icon: 'pencil',
            style: 'warning'
        },
        pos: {row: 1, col: 1}
    });
    var infoIconButton = $pt.createCellLayout('name', {
        comp: {
            type: $pt.ComponentConstants.Button,
            icon: 'pencil',
            style: 'info'
        },
        pos: {row: 1, col: 1}
    });
    var successIconButton = $pt.createCellLayout('name', {
        comp: {
            type: $pt.ComponentConstants.Button,
            icon: 'pencil',
            style: 'success',
            more: [
                {icon: 'commenting-o', text: 'commenting', click: function(model) {alert('Commenting');}},
                {divider: true},
                {icon: 'balance-scale', text: 'Balance', click: function(model) {alert('Balance');}}
            ]
        },
        pos: {row: 1, col: 1}
    });
    var disabledButton = $pt.createCellLayout('name', {
        label: 'Click me',
        comp: {
            type: $pt.ComponentConstants.Button,
            enabled: {
                when: function () {
                    return false;
                },
                depends: 'name'
            }
        },
        pos: {row: 1, col: 1}
    });
    var disabledIconButton = $pt.createCellLayout('name', {
        label: 'Click me',
        comp: {
            type: $pt.ComponentConstants.Button,
            enabled: {
                when: function () {
                    return false;
                },
                depends: 'name'
            },
            icon: 'pencil'
        },
        pos: {row: 1, col: 1}
    });
    var disabledPrimaryIconButton = $pt.createCellLayout('name', {
        label: 'Click me',
        comp: {
            type: $pt.ComponentConstants.Button,
            enabled: {
                when: function () {
                    return false;
                },
                depends: 'name'
            },
            icon: 'pencil',
            style: 'primary'
        },
        pos: {row: 1, col: 1}
    });
    var disabledDangerIconButton = $pt.createCellLayout('name', {
        label: 'Click me',
        comp: {
            type: $pt.ComponentConstants.Button,
            enabled: {
                when: function () {
                    return false;
                },
                depends: 'name'
            },
            icon: 'pencil',
            style: 'danger'
        },
        pos: {row: 1, col: 1}
    });
    var disabledWarnIconButton = $pt.createCellLayout('name', {
        label: 'Click me',
        comp: {
            type: $pt.ComponentConstants.Button,
            enabled: {
                when: function () {
                    return false;
                },
                depends: 'name'
            },
            icon: 'pencil',
            style: 'warning'
        },
        pos: {row: 1, col: 1}
    });
    var disabledInfoIconButton = $pt.createCellLayout('name', {
        comp: {
            type: $pt.ComponentConstants.Button,
            enabled: {
                when: function () {
                    return false;
                },
                depends: 'name'
            },
            icon: 'pencil',
            style: 'info'
        },
        pos: {row: 1, col: 1}
    });
    var disabledSuccessIconButton = $pt.createCellLayout('name', {
        comp: {
            type: $pt.ComponentConstants.Button,
            enabled: {
                when: function () {
                    return false;
                },
                depends: 'name'
            },
            icon: 'pencil',
            style: 'success',
            more: [
                {icon: 'commenting-o', text: 'commenting', click: function(model) {alert('Commenting');}},
                {divider: true},
                {icon: 'balance-scale', text: 'Balance', click: function(model) {alert('Balance');}}
            ]
        },
        pos: {row: 1, col: 1}
    });

    var panel = (<div className='row'>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <span>Button</span>
            <NFormButton model={model} layout={button}/>
            <span>Icon Button</span>
            <NFormButton model={model} layout={iconButton}/>
            <span>Primary Icon Button</span>
            <NFormButton model={model} layout={primaryIconButton}/>
            <span>Danger Icon Button</span>
            <NFormButton model={model} layout={dangerIconButton}/>
            <span>Warning Icon Button</span>
            <NFormButton model={model} layout={warnIconButton}/>
            <span>Info Icon Button</span>
            <NFormButton model={model} layout={infoIconButton}/>
            <span>Success Icon Button</span>
            <NFormButton model={model} layout={successIconButton}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <span>Disabled Button</span>
            <NFormButton model={model} layout={disabledButton}/>
            <span>Disabled Icon Button</span>
            <NFormButton model={model} layout={disabledIconButton}/>
            <span>Disabled Primary Icon Button</span>
            <NFormButton model={model} layout={disabledPrimaryIconButton}/>
            <span>Disabled Danger Icon Button</span>
            <NFormButton model={model} layout={disabledDangerIconButton}/>
            <span>Disabled Warning Icon Button</span>
            <NFormButton model={model} layout={disabledWarnIconButton}/>
            <span>Disabled Info Icon Button</span>
            <NFormButton model={model} layout={disabledInfoIconButton}/>
            <span>Disabled Success Icon Button</span>
            <NFormButton model={model} layout={disabledSuccessIconButton}/>
        </div>
    </div>);
    React.render(panel, document.getElementById('main'));
})();
