/**
 * Created by brad.wu on 8/16/2015.
 */
(function () {
    var model = $pt.createModel({
        name: null
    });
    var defaultFormat = $pt.createCellLayout('name', {
        label: 'Plain Text',
        comp: {
            type: $pt.ComponentConstants.Date
        },
        pos: {row: 1, col: 1}
    });
    var yearMonth = $pt.createCellLayout('name', {
        label: 'Plain Text',
        comp: {
            type: $pt.ComponentConstants.Date,
            format: 'YYYY/MM'
        },
        pos: {row: 1, col: 1}
    });
    var year = $pt.createCellLayout('name', {
        label: 'Plain Text',
        comp: {
            type: $pt.ComponentConstants.Date,
            format: 'YYYY'
        },
        pos: {row: 1, col: 1}
    });
    var datetime = $pt.createCellLayout('name', {
        label: 'Plain Text',
        comp: {
            type: $pt.ComponentConstants.Date,
            format: 'YYYY/MM/DD HH:mm:ss'
        },
        pos: {row: 1, col: 1}
    });
    var datetime12 = $pt.createCellLayout('name', {
        label: 'Plain Text',
        comp: {
            type: $pt.ComponentConstants.Date,
            format: 'YYYY/MM/DD HH:mm:ss',
            hour: 12
        },
        pos: {row: 1, col: 1}
    });
    var time = $pt.createCellLayout('name', {
        label: 'Plain Text',
        comp: {
            type: $pt.ComponentConstants.Date,
            format: 'HH:mm:ss'
        },
        pos: {row: 1, col: 1}
    });
    var time12 = $pt.createCellLayout('name', {
        label: 'Plain Text',
        comp: {
            type: $pt.ComponentConstants.Date,
            format: 'HH:mm:ss',
            hour: 12
        },
        pos: {row: 1, col: 1}
    });
    var hm = $pt.createCellLayout('name', {
        label: 'Plain Text',
        comp: {
            type: $pt.ComponentConstants.Date,
            format: 'HH:mm'
        },
        pos: {row: 1, col: 1}
    });
    var hm12 = $pt.createCellLayout('name', {
        label: 'Plain Text',
        comp: {
            type: $pt.ComponentConstants.Date,
            format: 'HH:mm',
            hour: 12
        },
        pos: {row: 1, col: 1}
    });
    var h = $pt.createCellLayout('name', {
        label: 'Plain Text',
        comp: {
            type: $pt.ComponentConstants.Date,
            format: 'HH'
        },
        pos: {row: 1, col: 1}
    });
    var h12 = $pt.createCellLayout('name', {
        label: 'Plain Text',
        comp: {
            type: $pt.ComponentConstants.Date,
            format: 'HH',
            hour: 12
        },
        pos: {row: 1, col: 1}
    });
    var disabledDefaultFormat = $pt.createCellLayout('name', {
        label: 'Plain Text',
        comp: {
            type: $pt.ComponentConstants.Date,
            enabled: {
                when: function () {
                    return false;
                },
                depends: 'name'
            }
        },
        pos: {row: 1, col: 1}
    });

    var taiwan = $pt.createCellLayout('name', {
        label: 'Plain Text',
        comp: {
            type: $pt.ComponentConstants.Date,
            format: 'tYY/MM/DD',
            headerYearFormat: '民國tYY年',
            headerMonthFormat: 'MM月',
            bodyYearFormat: 'tYY',
            headerMonthFirst: false,
            locale: 'zh-TW',
            valueFormat: $pt.ComponentConstants.Default_Date_Format
        },
        pos: {row: 1, col: 1}
    });

    var panel = (<div className='row'>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <span>Default Format</span>
            <NDateTime model={model} layout={defaultFormat}/>
            <span>YYYY/MM</span>
            <NDateTime model={model} layout={yearMonth}/>
            <span>YYYY</span>
            <NDateTime model={model} layout={year}/>
            <span>Data Time</span>
            <NDateTime model={model} layout={datetime}/>
            <span>Data Time 12 hour</span>
            <NDateTime model={model} layout={datetime12}/>
            <span>Taiwan Format</span>
            <NDateTime model={model} layout={taiwan}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3 has-error'>
            <span>Error Default Format</span>
            <NDateTime model={model} layout={defaultFormat}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <span>Disabled Default Format</span>
            <NDateTime model={model} layout={disabledDefaultFormat}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3 has-error'>
            <span>Error Disabled Default Format</span>
            <NDateTime model={model} layout={disabledDefaultFormat}/>
            <span>Data Time Popover Right to Left</span>
            <NDateTime model={model} layout={datetime}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <span>Time</span>
            <NDateTime model={model} layout={time}/>
            <span>Time 12 Hour</span>
            <NDateTime model={model} layout={time12}/>
            <span>Time No Second</span>
            <NDateTime model={model} layout={hm}/>
            <span>Time Only Hour</span>
            <NDateTime model={model} layout={h}/>
            <span>Time No Second 12</span>
            <NDateTime model={model} layout={hm12}/>
            <span>Time Only Hour 12</span>
            <NDateTime model={model} layout={h12}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <span>View Mode</span>
            <NDateTime model={model} layout={defaultFormat} view={true}/>
        </div>
    </div>);
    ReactDOM.render(panel, document.getElementById('main'));
})();
