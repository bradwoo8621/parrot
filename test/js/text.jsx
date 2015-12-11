/**
 * Created by brad.wu on 8/16/2015.
 */
(function () {
    var model = $pt.createModel({
        name: 'Name'
    });
    var plainText = $pt.createCellLayout('name', {
        label: 'Plain Text',
        pos: {row: 1, col: 1}
    });
    var placeholder = $pt.createCellLayout('name', {
        label: 'Plain Text',
        comp: {placeholder: 'Placeholder...'},
        pos: {row: 1, col: 1}
    });
    var password = $pt.createCellLayout('name1', {
        label: 'Password',
        dataId: 'name',
        comp: {pwd: true},
        pos: {row: 2, col: 1}
    });
    var css = $pt.createCellLayout('name1', {
        label: 'Password',
        dataId: 'name',
        comp: {pwd: true},
        css: {
            comp: 'custom-text',
            'normal-line': 'custom-normal-line',
            'focus-line': 'custom-focus-line'
        },
        pos: {row: 2, col: 1}
    });
    var disabled = $pt.createCellLayout('name1', {
        label: 'Password',
        dataId: 'name',
        comp: {
            pwd: true,
            enabled: {
                when: function () {
                    return false;
                },
                depends: 'name'
            }
        },
        pos: {row: 2, col: 1}
    });
    var leftAddonText = $pt.createCellLayout('name2', {
        label: 'Left Add-on Text',
        dataId: 'name',
        comp: {
            leftAddon: {
                text: '$'
            }
        },
        pos: {row: 2, col: 1}
    });
    var leftAddonIcon = $pt.createCellLayout('name3', {
        label: 'Left Add-on Icon',
        dataId: 'name',
        comp: {
            leftAddon: {
                icon: 'money'
            }
        },
        pos: {row: 2, col: 1}
    });
    var leftAddonIconText = $pt.createCellLayout('name4', {
        label: 'Left Add-on Icon Text',
        dataId: 'name',
        comp: {
            leftAddon: {
                icon: 'money',
                text: ' $'
            }
        },
        pos: {row: 2, col: 1}
    });
    var rightAddonText = $pt.createCellLayout('name5', {
        label: 'Left Add-on Text',
        dataId: 'name',
        comp: {
            rightAddon: {
                text: '$'
            }
        },
        pos: {row: 2, col: 1}
    });
    var rightAddonIcon = $pt.createCellLayout('name6', {
        label: 'Left Add-on Icon',
        dataId: 'name',
        comp: {
            rightAddon: {
                icon: 'money'
            }
        },
        pos: {row: 2, col: 1}
    });
    var rightAddonIconText = $pt.createCellLayout('name7', {
        label: 'Left Add-on Icon Text',
        dataId: 'name',
        comp: {
            rightAddon: {
                icon: 'money',
                text: '$ ',
                iconFirst: false
            }
        },
        pos: {row: 2, col: 1}
    });
    var lrAddonText = $pt.createCellLayout('name8', {
        label: 'Left Add-on Text',
        dataId: 'name',
        comp: {
            leftAddon: {
                text: '$'
            },
            rightAddon: {
                icon: 'money'
            }
        },
        pos: {row: 2, col: 1}
    });
    var lrAddonDisabledText = $pt.createCellLayout('name8', {
        label: 'Left Add-on Text',
        dataId: 'name',
        comp: {
            leftAddon: {
                text: '$'
            },
            rightAddon: {
                icon: 'money'
            },
            enabled: {
                when: function () {
                    return false;
                },
                depends: 'name'
            }
        },
        pos: {row: 2, col: 1}
    });
    var lrAddonTextClick = $pt.createCellLayout('name8', {
        label: 'Left Add-on Text',
        dataId: 'name',
        comp: {
            leftAddon: {
                text: '$',
                click: function (model, value) {
                    alert('left add-on clicked: current value is [' + value + ']');
                }
            },
            rightAddon: {
                icon: 'money',
                click: function (model, value) {
                    alert('right add-on clicked: current value is [' + value + ']');
                }
            }
        },
        pos: {row: 2, col: 1}
    });
    var lrAddonTextClickDisabled = $pt.createCellLayout('name8', {
        label: 'Left Add-on Text',
        dataId: 'name',
        comp: {
            leftAddon: {
                text: '$',
                click: function (model, value) {
                    alert('left add-on clicked: current value is [' + value + ']');
                }
            },
            rightAddon: {
                icon: 'money',
                click: function (model, value) {
                    alert('right add-on clicked: current value is [' + value + ']');
                }
            },
            enabled: {
                when: function () {
                    return false;
                },
                depends: 'name'
            }
        },
        pos: {row: 2, col: 1}
    });
    var numberText = $pt.createCellLayout('numeric', {
        label: 'Number Text',
        comp: {
            format: NText.NUMBER_FORMAT,
            convertor: NText.PERCENTAGE
        },
        pos: {row: 1, col: 1}
    });
    var button = $pt.createCellLayout('button', {
        label: 'Numeric Value',
        comp: {
            click: function(model) {
                var value = model.get('numeric');
                console.log('numeric value: [' + value + ']');
                if (value) {
                    model.set('numeric', value * 2);
                    console.log(model.get('numeric'));
                } else {
                    model.set('numeric', '1234567890.001');
                }
            }
        }
    });

    model.set('numeric', -0.65);
    var panel = (<div className='row'>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <span>Plain Text</span>
            <NText model={model} layout={plainText}/>
            <span>Placeholder</span>
            <NText model={model} layout={placeholder}/>
            <span>Password</span>
            <NText model={model} layout={password}/>
            <span>Numeric</span>
            <NText model={model} layout={numberText}/>
            <NFormButton model={model} layout={button}/>
            <span>Custom CSS</span>
            <NText model={model} layout={css}/>
            <span>Left Add-on Text</span>
            <NText model={model} layout={leftAddonText}/>
            <span>Left Add-on Icon</span>
            <NText model={model} layout={leftAddonIcon}/>
            <span>Left Add-on Icon Text</span>
            <NText model={model} layout={leftAddonIconText}/>
            <span>Right Add-on Text</span>
            <NText model={model} layout={rightAddonText}/>
            <span>Right Add-on Icon</span>
            <NText model={model} layout={rightAddonIcon}/>
            <span>Right Add-on Icon Text</span>
            <NText model={model} layout={rightAddonIconText}/>
            <span>Left and Right Add-ons</span>
            <NText model={model} layout={lrAddonText}/>
            <span>Left and Right Add-ons Clickable</span>
            <NText model={model} layout={lrAddonTextClick}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3 has-error'>
            <span>Error Text</span>
            <NText model={model} layout={plainText}/>
            <span>Error Left and Right Add-ons</span>
            <NText model={model} layout={lrAddonText}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <span>Disabled</span>
            <NText model={model} layout={disabled}/>
            <span>Disabled Left and Right Add-ons Clickable</span>
            <NText model={model} layout={lrAddonTextClickDisabled}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3 has-error'>
            <span>Disabled Error Left and Right Add-ons</span>
            <NText model={model} layout={lrAddonDisabledText}/>
            <span>Disabled Left and Right Add-ons Clickable</span>
            <NText model={model} layout={lrAddonTextClickDisabled}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <span>View Mode</span>
            <NText model={model} layout={plainText} view={true}/>
        </div>
    </div>);
    ReactDOM.render(panel, document.getElementById('main'));
})();
