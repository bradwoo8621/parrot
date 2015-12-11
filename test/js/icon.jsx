/**
 * Created by brad.wu on 8/16/2015.
 */
(function () {
    var panel = (<div>
        <div className='row'>
            <div className='col-sm-12 col-md-12 col-lg-12'>
                <span>Normal Icon and Fix Width</span>
                <br/>
                <NIcon icon='pencil'/>
                <NIcon icon='pencil' fixWidth={true}/>
                <NIcon icon='pencil' backIcon='circle-o-notch'/>
            </div>
        </div>
        <div className='row'>
            <div className='col-sm-12 col-md-12 col-lg-12'>
                <span>Icon Size</span>
                <br/>
                <NIcon icon='pencil' size='lg'/>
                <NIcon icon='pencil' size='2x'/>
                <NIcon icon='pencil' size='3x'/>
                <NIcon icon='pencil' size='4x'/>
                <NIcon icon='pencil' size='5x'/>
                <NIcon icon='pencil' size='6x'/>
                <NIcon icon='pencil' size='lg' backIcon='circle-o-notch'/>
                <NIcon icon='pencil' size='2x' backIcon='circle-o-notch'/>
                <NIcon icon='pencil' size='3x' backIcon='circle-o-notch'/>
                <NIcon icon='pencil' size='4x' backIcon='circle-o-notch'/>
                <NIcon icon='pencil' size='5x' backIcon='circle-o-notch'/>
                <NIcon icon='pencil' size='6x' backIcon='circle-o-notch'/>
            </div>
        </div>
        <div className='row'>
            <div className='col-sm-12 col-md-12 col-lg-12'>
                <span>Effects(Spin/Pulse/Rotate-90/Rotate-180/Rotate-270/Flip-Horizontal/Flip-Vertical)</span>
                <br/>
                <NIcon icon='pencil' size='2x' spin={true}/>
                <NIcon icon='pencil' size='2x' pulse={true}/>
                <NIcon icon='pencil' size='2x' rotate={90}/>
                <NIcon icon='pencil' size='2x' rotate={180}/>
                <NIcon icon='pencil' size='2x' rotate={270}/>
                <NIcon icon='pencil' size='2x' flip='h'/>
                <NIcon icon='pencil' size='2x' flip='v'/>
                <NIcon icon='pencil' size='2x' spin={true} backIcon='circle-o-notch' backSpin={true}/>
                <NIcon icon='pencil' size='2x' pulse={true} backIcon='circle-o-notch' backPulse={true}/>
                <NIcon icon='pencil' size='2x' rotate={90} backIcon='circle-o-notch' backRotate={90}/>
                <NIcon icon='pencil' size='2x' rotate={180} backIcon='circle-o-notch' backRotate={180}/>
                <NIcon icon='pencil' size='2x' rotate={270} backIcon='circle-o-notch' backRotate={270}/>
                <NIcon icon='pencil' size='2x' flip='h' backIcon='circle-o-notch' backFlip='h'/>
                <NIcon icon='pencil' size='2x' flip='v' backIcon='circle-o-notch' backFlip='v'/>
            </div>
        </div>
        <div className='row'>
            <div className='col-sm-12 col-md-12 col-lg-12'>
                <span>Custom Icon CSS</span>
                <br/>
                <NIcon icon='pencil' size='2x' iconClassName='custom-icon'/>
                <NIcon icon='pencil' size='2x' iconClassName='custom-icon' backIcon='circle-o-notch'
                       backClassName='custom-icon-black'/>
            </div>
        </div>
        <div className='row'>
            <div className='col-sm-12 col-md-12 col-lg-12'>
                <span>Tooltip</span>
                <br/>
                <NIcon icon='pencil' size='2x' tooltip='No Back'/>
                <NIcon icon='pencil' size='2x' backIcon='circle-o-notch' tooltip='Has Back'/>
            </div>
        </div>
    </div>);
    ReactDOM.render(panel, document.getElementById('main'));
})();