/**
 * Created by brad.wu on 8/16/2015.
 */
(function () {
    var model = $pt.createModel({
        name: null
    });
    var plainText = $pt.createCellLayout('name', {
        label: 'Plain Text',
        comp: {
            type: $pt.ComponentConstants.Search,
            searchTriggerDigits: 6,
            searchUrl: '/test',
            advancedUrl: '/test/query'
        },
        pos: {row: 1, col: 1}
    });

    var disabled = $pt.createCellLayout('name', {
        label: 'Plain Text',
        comp: {
            type: $pt.ComponentConstants.Search,
            searchTriggerDigits: 6,
            searchUrl: '/test',
            advancedUrl: '/test/query',
            enabled: false
        },
        pos: {row: 1, col: 1}
    });

    var panel = (<div className='row'>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <span>Plain Text</span>
            <NSearchText model={model} layout={plainText}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3 has-error'>
            <span>Has Error</span>
            <NSearchText model={model} layout={plainText}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <span>Disabled</span>
            <NSearchText model={model} layout={disabled}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3 has-error'>
            <span>Disabled &amp; Has Error</span>
            <NSearchText model={model} layout={disabled}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <span>View Mode</span>
            <NSearchText model={model} layout={plainText} view={true}/>
        </div>
    </div>);
    ReactDOM.render(panel, document.getElementById('main'));


    $.mockjax({
        url: "/test",
        response: function (settings) {
            var request = settings.data;
            var code = request.code;
            this.responseText = {
                code: code,
                name: code.replace("code", "name")
            }
        }
    });
    $.mockjax({
        url: "/test/query",
        response: function (settings) {
            var items = [];
            var request = settings.data;
            if (request.pageIndex) {
                for (var index = 0; index < 10; index++) {
                    var suffix = (request.countPerPage * (request.pageIndex - 1) + index + 1);
                    if (suffix < 10) {
                        suffix = '0' + suffix;
                    }
                    items.push({
                        code: "code" + suffix,
                        name: "name" + suffix
                    });
                }
            } else {
                items = [{code: "code01", name: "name01"},
                    {code: "code02", name: "name02"},
                    {code: "code03", name: "name03"},
                    {code: "code04", name: "name04"},
                    {code: "code05", name: "name05"},
                    {code: "code06", name: "name06"},
                    {code: "code07", name: "name07"},
                    {code: "code08", name: "name08"},
                    {code: "code09", name: "name09"},
                    {code: "code10", name: "name10"}
                ];
            }
            this.responseText = {
                items: items,
                criteria: {
                    pageIndex: request.pageIndex ? request.pageIndex : 1,
                    pageCount: 5,
                    countPerPage: 10,
                    name: "abcde"
                }
            };
        }
    });
})();
