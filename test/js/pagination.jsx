/**
 * Created by brad.wu on 8/16/2015.
 */
(function () {
    var currentPageIndex = 6;
    var toPage = function (pageIndex) {
        currentPageIndex = pageIndex;
        ReactDOM.render(panel(currentPageIndex), document.getElementById('main'));
    };
    var panel = function(currentPageIndex) {
        return (<div className='row'>
            <div className='col-sm-6 col-md-6 col-lg-6'>
                <span>Normal Pagination</span>
                <NPagination pageCount={10} currentPageIndex={currentPageIndex} toPage={toPage}/>
            </div>
            <div className='col-sm-6 col-md-6 col-lg-6'>
                <span>No Status Pagination</span>
                <NPagination pageCount={10} currentPageIndex={currentPageIndex} toPage={toPage} showStatus={false}/>
            </div>
        </div>);
    };
    ReactDOM.render(panel(currentPageIndex), document.getElementById('main'));
})();
