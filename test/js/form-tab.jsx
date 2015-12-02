/**
 * Created by brad.wu on 8/16/2015.
 */
(function () {
    var model = $pt.createModel({
        name: null,
        countA: 5,
        countB: 6
    });

    var layoutTemplate = {
        comp: {
            type: $pt.ComponentConstants.Tab,
            tabType: 'tab',
            justified: false,
            titleDirection: 'horizontal',
            titleIconSize: 'lg',
            tabs: [
                {
                    label: 'Card A',
                    icon: 'car',
                    editLayout: {
                        name: {
                            label: 'Name in Card A',
                            pos: {row: 1, col: 1}
                        }
                    }
                }, {
                    label: 'Card B',
                    icon: 'balance-scale',
                    // active: true,
                    editLayout: {
                        name: {
                            label: 'Name in Card B',
                            pos: {row: 1, col: 1}
                        }
                    }
                }
            ]
        },
        pos: {row: 1, cell: 1}
    };
    var layout = $pt.createCellLayout('name', layoutTemplate);
    var pillLayout = $pt.createCellLayout('name', $.extend(true, {}, layoutTemplate, {
        comp: {
            tabType: 'pill',
            justified: true
        }
    }));
    var badgeLayout = $pt.createCellLayout('name', {
        comp: {
            type: $pt.ComponentConstants.Tab,
            tabType: 'tab',
            justified: false,
            titleDirection: 'horizontal',
            titleIconSize: 'lg',
            tabs: [
                {
                    label: 'Card A',
                    icon: 'car',
                    badgeId: 'countA',
                    editLayout: {
                        name: {
                            label: 'Name in Card A',
                            pos: {row: 1, col: 1}
                        },
                        countA: {
                            label: 'CountA',
                            pos: {row: 1, col: 2}
                        }
                    }
                }, {
                    label: 'Card B',
                    icon: 'balance-scale',
                    badgeId: 'countB',
                    active: true,
                    editLayout: {
                        name: {
                            label: 'Name in Card B',
                            pos: {row: 1, col: 1}
                        },
                        countB: {
                            label: 'CountB',
                            pos: {row: 1, col: 2}
                        }
                    }
                }
            ]
        }
    });

    var panel = (<div>
        <div className='row'>
            <div className='col-md-6 col-lg-6 col-sm-6'>
                <span>Normal Form Tab</span>
                <NFormTab model={model} layout={layout} />
            </div>
        </div>
        <div className='row'>
            <div className='col-md-6 col-lg-6 col-sm-6'>
                <span>Normal Form Pill</span>
                <NFormTab model={model} layout={pillLayout}/>
            </div>
        </div>
        <div className='row'>
            <div className='col-md-6 col-lg-6 col-sm-6'>
                <span>Badge Form Tab</span>
                <NFormTab model={model} layout={badgeLayout}/>
            </div>
        </div>
        <div className='row'>
            <div className='col-md-6 col-lg-6 col-sm-6'>
                <span>View Mode</span>
                <NFormTab model={model} layout={badgeLayout} view={true}/>
            </div>
        </div>
    </div>);
    React.render(panel, document.getElementById('main'));
})();
