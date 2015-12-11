/**
 * Created by brad.wu on 8/16/2015.
 */
(function () {
    var toPage = function (pageIndex) {
        this.props.currentPageIndex = pageIndex;
        this.forceUpdate();
    };
    var panel = (<div className='row'>
        <div className='col-sm-6 col-md-6 col-lg-6'>
            <span>Normal Pagination</span>
            <NPagination pageCount={10} currentPageIndex={6} toPage={toPage}/>
        </div>
        <div className='col-sm-6 col-md-6 col-lg-6'>
            <span>No Status Pagination</span>
            <NPagination pageCount={10} currentPageIndex={6} toPage={toPage} showStatus={false}/>
        </div>
    </div>);
    ReactDOM.render(panel, document.getElementById('main'));
})();