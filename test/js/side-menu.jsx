/**
 * Created by brad.wu on 8/16/2015.
 */
(function () {
    var menus = [{
        text: "Tasks",
        children: [{text: "Work List", url: '#watchlist'},
            {text: "Watch List", url: '#worklist'},
            {text: 'Test', children: [{text: 'Test Menu #1', url: '#test-menu-1'}]}]
    }, {
        text: "Policy",
        children: [{text: "Quotation", url: '#quotation'},
            {text: "Renewal", url: '#renewal'},
            {text: 'Endorsement', url: '#endo'},
            {text: 'Query', url: '#query'}]
    }];
    var menu = NSideMenu.getSideMenu(menus, 'side-menu');
    menu.show();

    var show = $pt.createCellLayout('name', {
        label: 'Show Side Menu',
        comp: {
            type: $pt.ComponentConstants.Button,
            click: function () {
                menu.show();
            },
            style: 'primary'
        },
        pos: {row: 1, col: 1}
    });
    var hide = $pt.createCellLayout('name', {
        label: 'Hide Side Menu',
        comp: {
            type: $pt.ComponentConstants.Button,
            click: function () {
                menu.hide();
            },
            style: 'danger'
        },
        pos: {row: 1, col: 1}
    });
    var panel = (<div className='row'>
        <div className='col-sm-4 col-md-4 col-lg-4'></div>
        <div className='col-sm-4 col-md-4 col-lg-4'>
            <NFormButton layout={show}/>
            <NFormButton layout={hide}/>
        </div>
    </div>);
    ReactDOM.render(panel, document.getElementById('main'));
})();