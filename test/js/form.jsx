/**
 * Created by brad.wu on 8/16/2015.
 */
(function () {
    var model = $pt.createModel({count: 5});
    var layout = $pt.createFormLayout({
        name: {
            label: 'Name',
            pos: {row: 1, col: 1}
        }
    });
    var sections = $pt.createFormLayout({
        _sections: {
            one: {
                label: 'Normal Panel',
                row: 1,
                width: 12,
                collapsible: true
            },
            two: {
                label: 'Panel Collapsible & Check In Title',
                row: 2,
                col: 1,
                width: 6,
                style: 'primary',
                collapsible: true,
                expanded: false,
                checkInTitle: {
                    data: 'checkInTitle',
                    label: 'Check In Title'
                }
            },
            three: {
                label: 'Panel Collapsible & Check In Title (Collapsible)',
                row: 2,
                col: 2,
                width: 6,
                style: 'danger',
                collapsible: true,
                expanded: true,
                checkInTitle: {
                    data: 'checkInTitle1',
                    label: 'Check In Title',
                    collapsible: 'same'
                }
            }
        },
        name: {
            label: 'Name in Section1',
            pos: {row: 1, col: 1, section: 'one'}
        },
        name2: {
            label: 'Name in Section2',
            dataId: 'name',
            pos: {row: 1, col: 1, section: 'two'}
        },
        name3: {
            label: 'Name in Section3',
            dataId: 'name',
            pos: {row: 1, col: 1, section: 'three'}
        }
    });
    var cardsTemplate = {
        _cards: {
            one: {
                label: 'Card One'
            },
            two: {
                label: 'Card Two',
                badge: 'count'
            },
            three: {
                label: 'Card Three'
            }
        },
        name: {
            label: 'Name in Card1',
            pos: {row: 1, col: 1, card: 'one'}
        },
        name2: {
            label: 'Name in Card2',
            dataId: 'name',
            pos: {row: 1, col: 1, card: 'two'}
        },
        name3: {
            label: 'Name in Card3',
            dataId: 'name',
            pos: {row: 1, col: 1, card: 'three'}
        }
    };
    var cards = $pt.createFormLayout($.extend(true, {_cards: {two: {active: true}}}, cardsTemplate));
    var firstForwardOnlyCards = $pt.createFormLayout($.extend(true, {_cards: {one: {backable: false}}}, cardsTemplate));
    var freeCards = $pt.createFormLayout($.extend(true, {_freeCard: true}, cardsTemplate));
    var freeCardsWithoutWizardButtons = $pt.createFormLayout($.extend(true, {
        _freeCard: true,
        _cardButtonShown: false
    }, cardsTemplate));
    var customButton = $pt.createFormLayout($.extend(true, {
        _cards: {
            one: {
                leftButtons: [{
                    icon: 'pencil',
                    text: 'left 11',
                    style: 'danger',
                    click: function () {
                        alert('I\'m left one button.');
                    }
                }, {
                    icon: 'pencil',
                    text: 'Both In View & Edit',
                    view: 'both',
                    style: 'warning',
                    click: function () {
                        alert('I\'m both in view and edit.');
                    }
                }, {
                    icon: 'pencil',
                    text: 'Only In View',
                    view: 'view',
                    style: 'warning',
                    click: function () {
                        alert('I\'m only in view.');
                    }
                }, {
                    icon: 'pencil',
                    text: 'Only In Edit',
                    view: 'edit',
                    style: 'warning',
                    click: function () {
                        alert('I\'m only in edit.');
                    }
                }],
                rightButtons: {
                    icon: 'pencil',
                    text: 'right 11',
                    style: 'info',
                    click: function () {
                        alert('I\'m right one button.');
                    }
                }
            },
            two: {
                leftButtons: [{
                    icon: 'pencil',
                    text: 'To Previous',
                    style: 'danger',
                    click: function () {
                        alert('Jump to previous.');
                        return true;
                    },
                    successCallback: 'prev'
                }, {
                    icon: 'pencil',
                    text: 'To Card Three',
                    style: 'warning',
                    click: function () {
                        alert('Jump to three');
                        return 'three'
                    },
                    successCallback: 'return'
                }],
                rightButtons: {
                    icon: 'pencil',
                    text: 'To Next',
                    style: 'info',
                    click: function () {
                        alert('Jump to next.');
                        return true;
                    },
                    successCallback: 'next'
                }
            },
            three: {
                finishButton: {
                    icon: 'pencil',
                    text: 'Finish',
                    style: 'success',
                    click: function () {
                        alert('Finish Clicked');
                    }
                }
            }
        }
    }, cardsTemplate));
    var panel = (<div>
        <div className='row'>
            <div className='col-sm-12 col-md-12 col-lg-12'>
                <span>Normal Form </span>
                <NForm model={model} layout={layout}/>
            </div>
            <div className='col-sm-12 col-md-12 col-lg-12'>
                <span>Form With Sections</span>
                <NForm model={model} layout={sections}/>
            </div>
            <div className='col-sm-12 col-md-12 col-lg-12'>
                <span>Form With Given Active Card</span>
                <NForm model={model} layout={cards}/>
            </div>
            <div className='col-sm-12 col-md-12 col-lg-12'>
                <span>Form With Cards and first card forward only</span>
                <NForm model={model} layout={firstForwardOnlyCards}/>
            </div>
            <div className='col-sm-12 col-md-12 col-lg-12'>
                <span>Form With Free Cards</span>
                <NForm model={model} layout={freeCards}/>
            </div>
            <div className='col-sm-12 col-md-12 col-lg-12'>
                <span>Form With Free Cards (No Wizard Buttons)</span>
                <NForm model={model} layout={freeCardsWithoutWizardButtons}/>
            </div>
            <div className='col-sm-12 col-md-12 col-lg-12'>
                <span>Form With Custom Buttons</span>
                <NForm model={model} layout={customButton}/>
            </div>
            <div className='col-sm-12 col-md-12 col-lg-12'>
                <span>View Mode</span>
                <NForm model={model} layout={customButton} view={true}/>
            </div>
        </div>
    </div>
    );
    React.render(panel, document.getElementById('main'));
})();
