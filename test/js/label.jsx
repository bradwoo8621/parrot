/**
 * Created by brad.wu on 8/16/2015.
 */
(function () {
    var panel = (<div>
        <div className='row'>
            <div className='col-sm-3 col-md-3 col-lg-3'>
                <NNormalLabel text={'I\' m a label.'}/>
            </div>
            <div className='col-sm-3 col-md-3 col-lg-3'>
                <NNormalLabel text={['I\' m a label.', 'I\' m a label too.']}/>
            </div>
            <div className='col-sm-3 col-md-3 col-lg-3'>
                <NNormalLabel text={['I\' m a very very very very very very very very very very very very very very very very very long label.']}/>
            </div>
        </div>
    </div>
    );
    ReactDOM.render(panel, document.getElementById('main'));
})();