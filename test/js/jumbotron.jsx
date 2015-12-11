/**
 * Created by brad.wu on 8/16/2015.
 */
(function () {
    var panel = (<div className='row'>
        <div className='col-sm-6 col-md-6 col-lg-6'>
            <span>Jumbotron</span>
            <NJumbortron highlightText='Hello, World'/>
            <span>Multiple Lines Jumbotron</span>
            <NJumbortron highlightText={['Hello, World','Goodbye, World']}/>
        </div>
    </div>);
    ReactDOM.render(panel, document.getElementById('main'));
})();