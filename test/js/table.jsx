/**
 * Created by brad.wu on 8/16/2015.
 */
(function() {
    var Gender = $pt.createCodeTable([{
        id: '1',
        text: 'Male'
    }, {
        id: '2',
        text: 'Female'
    }]);
    var model = $pt.createModel({
        items: [
            {
                name: 'Michael',
                code: 'CodeA',
                gender: '1',
                object: {
                    age: 10
                }
            },
            {
                name: 'Sally',
                code: 'CodeB',
                gender: '2',
                object: {
                    age: 20
                }
            },
            {
                name: 'Sabrina',
                code: 'CodeC',
                gender: '2',
                object: {
                    age: 30
                }
            }
        ]
    });
    var layoutTemplate = {
        label: 'Table',
        dataId: 'items',
        comp: {
            type: $pt.ComponentConstants.Table,
            columns: [{
                title: 'Name',
                data: 'name'
            }, {
                title: 'Code',
                data: 'code',
                sort: false // close single sort
            }, {
                title: 'Gender',
                render: function(row) {
                    return Gender.getText(row.gender);
                },
                sort: true // enable single sort
            }, {
                title: 'Age',
                data: 'object_age'
            }],
            editLayout: {
                name: {
                    label: 'Name',
                    pos: {
                        row: 1,
                        col: 1,
                        width: 6
                    }
                },
                code: {
                    label: 'Code',
                    pos: {
                        row: 1,
                        col: 2,
                        width: 6
                    }
                },
                gender: {
                    label: 'Gender',
                    comp: {
                        type: $pt.ComponentConstants.Select,
                        data: Gender
                    },
                    pos: {
                        row: 2,
                        col: 1,
                        width: 6
                    }
                },
                'object_age': {
                    label: 'Age',
                    pos: {
                        row: 2,
                        col: 2,
                        width: 6
                    }
                }
            }
        },
        pos: {
            row: 1,
            col: 1,
            width: 12
        }
    };

    var normal = $pt.createCellLayout('table', $.extend(true, {
        comp: {
            header: false
        }
    }, layoutTemplate));
    var index = $pt.createCellLayout('table', $.extend(true, {
        comp: {
            indexable: true,
            sortable: false, // close all sort
            style: 'primary'
        }
    }, layoutTemplate));
    var remove = $pt.createCellLayout('table', $.extend(true, {
        comp: {
            indexable: true,
            sortable: false, // close all sort
            removable: true,
            style: 'danger'
        }
    }, layoutTemplate));
    var edit = $pt.createCellLayout('table', $.extend(true, {
        comp: {
            indexable: true,
            sortable: false, // close all sort
            removable: true,
            editable: true,
            style: 'success'
        }
    }, layoutTemplate));
    var add = $pt.createCellLayout('table', $.extend(true, {
        comp: {
            indexable: true,
            sortable: false, // close all sort
            removable: true,
            editable: true,
            addable: true,
            style: 'warning'
        }
    }, layoutTemplate));
    var defaultAdd = $pt.createCellLayout('table', $.extend(true, {
        comp: {
            indexable: true,
            sortable: false, // close all sort
            removable: true,
            editable: true,
            addable: true
        }
    }, layoutTemplate));
    var page = $pt.createCellLayout('table', $.extend(true, {
        comp: {
            indexable: true,
            sortable: false, // close all sort
            removable: true,
            editable: true,
            addable: true,
            pageable: true,
            countPerPage: 2,
            style: 'info'
        }
    }, layoutTemplate));
    var customOperation = $pt.createCellLayout('table', $.extend(true, {
        comp: {
            rowOperations: [{
                icon: 'cart-plus',
                click: function(row) {
                    alert('Row Clicked, add [' + row.name + '] to cart.');
                }
            }, {
                icon: 'hand-paper-o',
                click: function(row) {
                    alert('Row Clicked, [' + row.name + '] by hand.');
                }
            }]
        }
    }, layoutTemplate));
    var rowSelectable = $pt.createCellLayout('table', $.extend(true, {
        comp: {
            rowSelectable: 'selected'
        }
    }, layoutTemplate));
    var indexAndRowSelectable = $pt.createCellLayout('table', $.extend(true, {
        comp: {
            rowSelectable: 'selected',
            indexable: true
        }
    }, layoutTemplate));
    var pageAndRowSelectable = $pt.createCellLayout('table', $.extend(true, {
        comp: {
            sortable: false, // close all sort
            rowSelectable: 'selected',
            pageable: true,
            countPerPage: 2,
            style: 'info'
        }
    }, layoutTemplate));

    var newColumns = [{
        width: 200
    }, {
        width: 200
    }, {
        width: 200
    }, {
        width: 200
    }];

    var fixLeft = $pt.createCellLayout('table', $.extend(true, {}, layoutTemplate, {
        comp: {
            columns: newColumns,
            fixedLeftColumns: 1,
            scrollX: true
        }
    }));
    var fixIndex = $pt.createCellLayout('table', $.extend(true, {}, layoutTemplate, {
        comp: {
            columns: newColumns,
            scrollX: true,
            indexFixed: true,
            indexable: true
        }
    }));
    var fixIndexAndFirst = $pt.createCellLayout('table', $.extend(true, {}, layoutTemplate, {
        comp: {
            columns: newColumns,
            fixedLeftColumns: 1,
            scrollX: true,
            indexable: true
        }
    }));
    var fixRight = $pt.createCellLayout('table', $.extend(true, {}, layoutTemplate, {
        comp: {
            columns: newColumns,
            fixedRightColumns: 1,
            scrollX: true
        }
    }));
    var fixOperation = $pt.createCellLayout('table', $.extend(true, {}, layoutTemplate, {
        comp: {
            columns: newColumns,
            scrollX: true,
            editable: true,
            operationFixed: true
        }
    }));
    var fixOperationAndLast = $pt.createCellLayout('table', $.extend(true, {}, layoutTemplate, {
        comp: {
            columns: newColumns,
            fixedRightColumns: 1,
            scrollX: true,
            editable: true,
            operationFixed: true
        }
    }));
    var scrollXY = $pt.createCellLayout('table', $.extend(true, {}, layoutTemplate, {
        comp: {
            columns: newColumns,
            scrollY: 50
        }
    }));
    var fixSelectable = $pt.createCellLayout('table', $.extend(true, {}, layoutTemplate, {
        comp: {
            columns: newColumns,
            scrollX: true,
            rowSelectFixed: true,
            rowSelectable: 'selected'
        }
    }));
    var fixIndexAndSelectable = $pt.createCellLayout('table', $.extend(true, {}, layoutTemplate, {
        comp: {
            columns: newColumns,
            scrollX: true,
            rowSelectFixed: true,
            rowSelectable: 'selected',
            indexable: true
        }
    }));
    var replaceDefaultRowOperation = $pt.createCellLayout('table', $.extend(true, {}, layoutTemplate, {
        comp: {
            columns: newColumns,
            addable: true,
            addClick: function(model, row, layout) {
                console.log(arguments);
                alert('I replaced default add clicked.');
            },
            editable: true,
            editClick: function(model, row, layout) {
                console.log(arguments);
                alert('I replaced default edit clicked.');
            }
        }
    }));
    var replaceDefaultSaveOperation = $pt.createCellLayout('table', $.extend(true, {}, layoutTemplate, {
        comp: {
            columns: newColumns,
            addable: true,
            onAddSave: function(model, dialog) {
                alert('I\'m listening the add saving and return false.');
                return false;
            },
            editable: true,
            onEditSave: function(model, dialog) {
                alert('I\'m listening the edit saving and return false.');
                return false;
            },
            removable: true,
            canRemove: function(model, row) {
                alert('I\'m listening the removing and return false.');
                return false;
            }
        }
    }));

    var inlineText = $pt.createCellLayout('table', $.extend(true, {}, layoutTemplate, {
        comp: {
            scrollY: 200,
            columns: [{
                title: 'Name',
                data: 'name',
                inline: 'text',
                width: 150
            }, {
                title: 'Code',
                data: 'code',
                width: 150,
                inline: {
                    inlineType: 'cell',
                    comp: {
                        type: {type: $pt.ComponentConstants.Text, label: false}
                    }
                }
            }, {
                data: 'gender',
                title: 'Gender',
                codes: Gender,
                inline: 'select',
                width: 150
            }, {
                data: 'object_age',
                title: 'Age',
                width: 150
            }, {
                title: 'Selected',
                data: 'selected',
                inline: 'check',
                width: 150
            }, {
                data: 'gender',
                title: 'Radio',
                codes: Gender,
                inline: 'radio',
                width: 300
            }, {
                data: 'birth',
                title: 'Date of Birth',
                inline: 'date',
                width: 200
            }]
        },
        css: {
            comp: 'inline-editor'
        }
    }));
    var dropdown = $pt.createCellLayout('table', $.extend(true, {}, layoutTemplate, {
        comp: {
            maxOperationButtonCount: 1,
            rowOperations: [{
                icon: 'cart-plus',
                tooltip: 'Cart',
                click: function(row) {
                    alert('Row Clicked, add [' + row.name + '] to cart.');
                },
                enabled: {
                    depends: 'name',
                    when: function(row) {
                        return row.get('name') != 'abc';
                    }
                }
            }, {
                // icon: 'hand-paper-o',
                tooltip: 'Hand',
                click: function(row) {
                    alert('Row Clicked, [' + row.name + '] by hand.');
                    var table = $pt.LayoutHelper.getComponent('test');
                    var columns = this.getComponentOption("columns");
                    columns.splice(0, 1);
                    table.clearColumnsDefinition();
                },
                enabled: {
                    depends: 'name',
                    when: function(row) {
                        return row.get('name') != 'abc';
                    }
                }
            }, {
                // icon: 'clone',
                tooltip: 'Clone',
                click: function(row) {
                    alert('Row Clicked, [' + row.name + '] by clone.');
                }
            }],
            centralId: 'test',
            rowListener: {
                id: 'name',
                listener: function(evt) {
                    console.log(evt.new);
                }
            },
            columns: [{
                title: 'Name',
                inline: 'text',
                data: 'name',
                width: 150
            }, {
                title: 'Code',
                data: 'code',
                width: 150
            }, {
                data: 'gender',
                title: 'Gender',
                codes: Gender,
                width: 150
            }, {
                data: 'object_age',
                title: 'Age',
                width: 150
            }, {
                title: 'Selected',
                data: 'selected',
                width: 150
            }, {
                data: 'gender',
                title: 'Radio',
                codes: Gender,
                width: 300
            }, {
                data: 'birth',
                title: 'Date of Birth',
                width: 200
            }]
        },
        css: {
            comp: 'inline-editor'
        }
    }));
    var dialog = NModalForm.createFormModal("Test");
    dialog.show({
        model: model,
        layout: $pt.createFormLayout({
            table: $.extend(true, {}, layoutTemplate, {
                comp: {
                    scrollY: 200,
                    columns: [{
                        title: 'Name',
                        data: 'name',
                        inline: 'text',
                        width: 150
                    }, {
                        title: 'Code',
                        data: 'code',
                        width: 150,
                        inline: {
                            inlineType: 'cell',
                            comp: {
                                type: {type: $pt.ComponentConstants.Text, label: false}
                            }
                        }
                    }, {
                        data: 'gender',
                        title: 'Gender',
                        codes: Gender,
                        inline: 'select',
                        width: 150
                    }, {
                        data: 'object_age',
                        title: 'Age',
                        width: 150
                    }, {
                        title: 'Selected',
                        data: 'selected',
                        inline: 'check',
                        width: 150
                    }, {
                        data: 'gender',
                        title: 'Radio',
                        codes: Gender,
                        inline: 'radio',
                        width: 300
                    }, {
                        data: 'birth',
                        title: 'Date of Birth',
                        inline: 'date',
                        width: 200
                    }]
                },
                css: {
                    comp: 'inline-editor'
                }
            })
        })
    });

    var panel = (<div>
        <div className='row'>
            <div className='col-sm-6 col-md-6 col-lg-6'>
                <span>Default Table</span>
                <NTable model={model} layout={normal}/>
            </div>
            <div className='col-sm-6 col-md-6 col-lg-6'>
                <span>Indexed Table</span>
                <NTable model={model} layout={index}/>
            </div>
            <div className='col-sm-6 col-md-6 col-lg-6'>
                <span>Removable Table</span>
                <NTable model={model} layout={remove}/>
            </div>
            <div className='col-sm-6 col-md-6 col-lg-6'>
                <span>Editable Table</span>
                <NTable model={model} layout={edit}/>
            </div>
            <div className='col-sm-6 col-md-6 col-lg-6'>
                <span>Addable Table</span>
                <NTable model={model} layout={add}/>
            </div>
            <div className='col-sm-6 col-md-6 col-lg-6'>
                <span>Addable Table</span>
                <NTable model={model} layout={defaultAdd}/>
            </div>
            <div className='col-sm-6 col-md-6 col-lg-6'>
                <span>Pagination Table</span>
                <NTable model={model} layout={page}/>
            </div>
            <div className='col-sm-6 col-md-6 col-lg-6'>
                <span>Fix Left Columns Table</span>
                <NTable model={model} layout={fixLeft}/>
            </div>
            <div className='col-sm-6 col-md-6 col-lg-6'>
                <span>Fix Index Column Table</span>
                <NTable model={model} layout={fixIndex}/>
            </div>
            <div className='col-sm-6 col-md-6 col-lg-6'>
                <span>Fix Index And First Column Table</span>
                <NTable model={model} layout={fixIndexAndFirst}/>
            </div>
            <div className='col-sm-6 col-md-6 col-lg-6'>
                <span>Fix Right Columns Table</span>
                <NTable model={model} layout={fixRight}/>
            </div>
            <div className='col-sm-6 col-md-6 col-lg-6'>
                <span>Fix Operation Column Table</span>
                <NTable model={model} layout={fixOperation}/>
            </div>
            <div className='col-sm-6 col-md-6 col-lg-6'>
                <span>Fix Operation And Last Column Table</span>
                <NTable model={model} layout={fixOperationAndLast}/>
            </div>
            <div className='col-sm-6 col-md-6 col-lg-6'>
                <span>Scrollable Table</span>
                <NTable model={model} layout={scrollXY}/>
            </div>
            <div className='col-sm-6 col-md-6 col-lg-6'>
                <span>Custom Operation Table</span>
                <NTable model={model} layout={customOperation}/>
            </div>
            <div className='col-sm-6 col-md-6 col-lg-6'>
                <span>Row Selectable Table</span>
                <NTable model={model} layout={rowSelectable}/>
            </div>
            <div className='col-sm-6 col-md-6 col-lg-6'>
                <span>Indexable and Row Selectable Table</span>
                <NTable model={model} layout={indexAndRowSelectable}/>
            </div>
            <div className='col-sm-6 col-md-6 col-lg-6'>
                <span>Fixed Row Selectable Table</span>
                <NTable model={model} layout={fixSelectable}/>
            </div>
            <div className='col-sm-6 col-md-6 col-lg-6'>
                <span>Fixed Row Selectable Table</span>
                <NTable model={model} layout={fixIndexAndSelectable}/>
            </div>
            <div className='col-sm-6 col-md-6 col-lg-6'>
                <span>Fixed Row Selectable Table</span>
                <NTable model={model} layout={pageAndRowSelectable}/>
            </div>
            <div className='col-sm-6 col-md-6 col-lg-6'>
                <span>Replace Default Add and Edit</span>
                <NTable model={model} layout={replaceDefaultRowOperation}/>
            </div>
            <div className='col-sm-6 col-md-6 col-lg-6'>
                <span>Replace Default Add, Edit and Remove Saving</span>
                <NTable model={model} layout={replaceDefaultSaveOperation}/>
            </div>
            <div className='col-sm-12 col-md-12 col-lg-12'>
                <span>InlineText</span>
                <NTable model={model} layout={inlineText}/>
            </div>
            <div className='col-sm-12 col-md-12 col-lg-12'>
                <span>Dropdown Button</span>
                <NTable model={model} layout={dropdown}/>
            </div>
        </div>
        <div style={{height: "500px"}}/>
    </div>);
    React.render(panel, document.getElementById('main'));
})();
