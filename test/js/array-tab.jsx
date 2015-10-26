/**
 * Created by brad.wu on 8/16/2015.
 */
(function () {
    var model = $pt.createModel({
        items: [{name: 'Name A', count: 5}, {name: 'Name B', count: 6}]
    });

    var panelTemplate = {
        label: 'Normal Panel',
        dataId: 'items',
        comp: {
            type: $pt.ComponentConstants.ArrayTab,
            editLayout: {
                name: {
                    label: 'Name',
                    pos: {row: 1, col: 1, width: 6}
                },
                count: {
                    label: 'Count',
                    pos: {row: 1, col: 1, width: 6}
                }
            },
            icon: 'bookmark'
        },
        pos: {row: 1, col: 1}
    };
    var fixedTitle = $pt.createCellLayout('panel', $.extend(true, {}, panelTemplate, {
        comp: {
            itemTitle: 'Panel Title'
        }
    }));
    var fixedTitlePill = $pt.createCellLayout('panel', $.extend(true, {}, panelTemplate, {
        comp: {
            tabType: 'pill',
            justified: true,
            itemTitle: {
                when: function (item) {
                    return item.name;
                },
                depends: 'name'
            },
            itemIcon: {
                when: function (item) {
                    return item.name == 'Name A' ? 'bookmark' : 'coffee';
                },
                depends: 'name'
            }
        }
    }));
    var badge = $pt.createCellLayout('panel', $.extend(true, {}, panelTemplate, {
        comp: {
            badge: 'count'
        }
    }));

    var panel = (<div>
        <div className='row'>
            <div className='col-md-6 col-lg-6 col-sm-6'>
                <span>Normal Array Tab</span>
                <NArrayTab model={model} layout={fixedTitle}/>
            </div>
            <div className='col-md-6 col-lg-6 col-sm-6'>
                <span>Pill/Justified/Title Monitored Array Tab</span>
                <NArrayTab model={model} layout={fixedTitlePill}/>
            </div>
            <div className='col-md-6 col-lg-6 col-sm-6'>
                <span>Badge Array Tab</span>
                <NArrayTab model={model} layout={badge}/>
            </div>
        </div>
    </div>);
    React.render(panel, document.getElementById('main'));
})();