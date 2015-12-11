/**
 * Created by brad.wu on 8/16/2015.
 */
(function() {
    var model = $pt.createModel({
        count: 5
    });
    var layoutTemplate = {
        _freeCard: true,
        _cardButtonShown: false,
        _cards: {
            one: {
                label: 'Card A',
                _sections: {
                    a: {
                        label: 'Section A in Card A',
                        layout: {
                            xyz: {
                                label: 'XYZ'
                            }
                        }
                    },
                    b: {
                        label: 'Section B in Card A',
                        layout: {
                            xyz: {
                                label: 'XYZ'
                            }
                        }
                    }
                }
            },
            two: {
                label: 'Card B',
                _sections: {
                    a: {
                        label: 'Section A in Card B',
                        layout: {
                            abc: {
                                label: 'ABC'
                            }
                        }
                    }
                }
            }
        }
    };
    var formLayout1 = $pt.createFormLayout(layoutTemplate);

    var abcReplacement = {
        label: 'Replace ABC with Password',
        comp: {
            pwd: true
        }
    };
    var formLayout2 = $pt.createFormLayout(layoutTemplate, {
        abc: {
            label: 'Replace pre-defined label',
            base: abcReplacement,
            pos: {
                card: 'two',
                section: 'a'
            }
        }
    });
    var panel = (<div>
        <div className='row'>
            <div className='col-sm-12 col-md-12 col-lg-12'>
                <span>Cell Define In Sections</span>
                <NForm model={model} layout={formLayout1}/>
            </div>
            <div className='col-sm-12 col-md-12 col-lg-12'>
                <span>Cell Define In Sections</span>
                <NForm model={model} layout={formLayout2}/>
            </div>
        </div>
    </div>
    );
    ReactDOM.render(panel, document.getElementById('main'));
})();
