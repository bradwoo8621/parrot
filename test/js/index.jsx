/**
 * Created by brad.wu on 9/29/2015.
 */
(function () {
    var menus = [
        {
            text: 'Components',
            children: [
                {text: 'Page Header'},
                {text: 'Page Footer'},
                {text: 'Side Menu'},
                {divider: true},
                {text: 'Jumbotron'},
                {text: 'Icon'},
                {divider: true},
                {text: 'Normal Label'},
                {text: 'Tab'},
                {text: 'Pagination'},
                {text: 'Panel Footer'}
            ]
        },
        {
            text: 'Form',
            children: [
                {text: 'Label'},
                {text: 'Text'},
                {text: 'TextArea'},
                {text: 'CheckBox'},
                {text: 'RadioButton'},
                {text: 'ToggleButton'},
                {text: 'DropDown (Select)'},
                {text: 'DateTimePicker'},
                {text: 'Search'},
                {text: 'File'},
                {text: 'Table'},
                {text: 'Button'},
            ]
        },
        {
            text: 'Form Container',
            children: [
                {text: 'Panel'},
                {text: 'Array Panel'},
                {text: 'Form Tab'},
                {text: 'Array Tab'},
                {text: 'Button Footer'},
                {divider: true},
                {text: 'Form Cell'},
                {text: 'Form'}
            ]
        },
        {
            text: 'Dialog',
            children: [
                {text: 'Exception Dialog'},
                {text: 'On Request Dialog'},
                {text: 'Confirm Dialog'},
                {divider: true},
                {text: 'Form Dialog'}
            ]
        }
    ];

    ReactDOM.render(<NPageHeader brand='Parrot' menus={menus}/>,
        document.getElementById("page-header"));
    // render page footer
    ReactDOM.render(<NPageFooter name='Demo'/>, document.getElementById("page-footer"));
}());