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
    }, {text: 'Help', url: '#help'}];
    var search = function (text) {
        alert('Search text[' + text + '].');
    };
    var header = (<NPageHeader brand='Test Case' menus={menus} search={search}/>);
    ReactDOM.render(header, document.getElementById('header'));
})();