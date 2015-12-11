/**
 * Created by brad.wu on 8/16/2015.
 */
(function () {
    var tabs = [
        {label: 'Tab A', icon: 'bookmark'}, {label: 'Tab B'}, {label: 'Tab C'}
    ];
    var iconTabs = [
        {label: 'Tab A', icon: 'bookmark'}, {label: 'Tab B', icon: 'dashboard'}, {label: 'Tab C', icon: 'cutlery'}
    ];
    var tabs1 = [
        {label: 'Tab A', icon: 'bookmark', removable: false}, {label: 'Tab B'}, {label: 'Tab C'}
    ];
    var tabs2 = [
        {label: 'Tab A', icon: 'bookmark', removable: true}, {label: 'Tab B'}, {label: 'Tab C'}
    ];
    var tabs4 = [
        {label: 'Tab A', icon: 'bookmark'}, {label: 'Tab B', active: true}, {label: 'Tab C'}
    ];
    var tabs5 = [
        {label: 'Tab A', value: 'A'}, {label: 'Tab B', value: 'B'}, {label: 'Tab C', value: 'C'}
    ];
    var tabs6 = [
        {label: 'Tab A', innerId: 'A'}, {label: 'Tab B', innerId: 'B'}, {label: 'Tab C', innerId: 'C'}
    ];
    var tabs7 = [
        {icon: 'bookmark'}, {icon: 'dashboard'}, {icon: 'cutlery'}
    ];
    var tabs8 = [
        {icon: 'bookmark', badge: '4'}, {icon: 'dashboard', badge: '5'}, {icon: 'cutlery'}
    ];

    var panel = (<div>
        <div className='row'>
            <div className='col-md-4 col-lg-4 col-sm-4'>
                <span>Normal Tab</span>
                <NTab type='tab' tabs={tabs}/>
            </div>
            <div className='col-md-4 col-lg-4 col-sm-4'>
                <span>Normal Tab</span>
                <NTab type='pill' tabs={tabs}/>
            </div>
        </div>
        <div className='row'>
            <div className='col-md-4 col-lg-4 col-sm-4'>
                <span>Justified Tab</span>
                <NTab type='tab' justified={true} tabs={tabs} size='lg'/>
            </div>
            <div className='col-md-4 col-lg-4 col-sm-4'>
                <span>Justified Tab</span>
                <NTab type='pill' justified={true} tabs={tabs} size='lg'/>
            </div>
        </div>
        <div className='row'>
            <div className='col-md-4 col-lg-4 col-sm-4'>
                <span>2 Times Icon Size Justified Tab</span>
                <NTab type='tab' justified={true} tabs={tabs} size='2x'/>
            </div>
            <div className='col-md-4 col-lg-4 col-sm-4'>
                <span>2 Times Icon Size Justified Tab (MUST icon in each tab)</span>
                <NTab type='pill' justified={true} tabs={iconTabs} size='2x'/>
            </div>
        </div>
        <div className='row'>
            <div className='col-md-4 col-lg-4 col-sm-4'>
                <span>2 Times Icon Size Tab (MUST icon in each tab)</span>
                <NTab type='tab' tabs={iconTabs} size='2x'/>
            </div>
            <div className='col-md-4 col-lg-4 col-sm-4'>
                <span>2 Times Icon Size Tab (MUST icon in each tab)</span>
                <NTab type='pill' tabs={iconTabs} size='2x'/>
            </div>
        </div>
        <div className='row'>
            <div className='col-md-4 col-lg-4 col-sm-4'>
                <span>3 Times Icon Size On Top Tab (MUST icon in each tab)</span>
                <NTab type='tab' tabs={iconTabs} size='3x' direction='vertical'/>
            </div>
            <div className='col-md-4 col-lg-4 col-sm-4'>
                <span>3 Times Icon Size On Top Tab (MUST icon in each tab)</span>
                <NTab type='pill' tabs={iconTabs} size='3x' direction='vertical'/>
            </div>
        </div>
        <div className='row'>
            <div className='col-md-4 col-lg-4 col-sm-4'>
                <span>Removable Tab</span>
                <NTab type='tab' tabs={tabs} removable={true}/>
            </div>
            <div className='col-md-4 col-lg-4 col-sm-4'>
                <span>Removable Tab</span>
                <NTab type='pill' tabs={tabs} removable={true}/>
            </div>
        </div>
        <div className='row'>
            <div className='col-md-4 col-lg-4 col-sm-4'>
                <span>Control Individually Removable Tab</span>
                <NTab type='tab' tabs={tabs1} removable={true}/>
            </div>
            <div className='col-md-4 col-lg-4 col-sm-4'>
                <span>Control Individually Removable Tab</span>
                <NTab type='pill' tabs={tabs1} removable={true}/>
            </div>
        </div>
        <div className='row'>
            <div className='col-md-4 col-lg-4 col-sm-4'>
                <span>Control Individually Removable Tab</span>
                <NTab type='tab' tabs={tabs2}/>
            </div>
            <div className='col-md-4 col-lg-4 col-sm-4'>
                <span>Control Individually Removable Tab</span>
                <NTab type='pill' tabs={tabs2}/>
            </div>
        </div>
        <div className='row'>
            <div className='col-md-4 col-lg-4 col-sm-4'>
                <span>Active Tab</span>
                <NTab type='tab' tabs={tabs4} removable={true}/>
            </div>
            <div className='col-md-4 col-lg-4 col-sm-4'>
                <span>Active Tab</span>
                <NTab type='pill' tabs={tabs4} removable={true}/>
            </div>
        </div>
        <div className='row'>
            <div className='col-md-4 col-lg-4 col-sm-4'>
                <span>Tab Event Monitor</span>
                <NTab type='tab' tabs={tabs5} removable={true}
                      canActive={function(value, index) {
                        alert('Tab[value=' + value + ',index=' + index + '] will be deactive.');
                      }}
                      onActive={function(value, index) {
                        alert('Tab[value=' + value +',index=' + index+'] was active.');
                      }}
                      canRemove={function(value, index) {
                        alert('Tab[value=' + value +',index=' + index+'] will be removed.');
                        return value == 'A';
                      }}
                      onRemove={function(value, index){
                        alert('Tab[value=' + value +',index=' + index+'] was removed.');
                      }}/>
            </div>
        </div>
        <div className='row'>
            <div className='col-md-4 col-lg-4 col-sm-4'>
                <span>Tab Relate with other component</span>
                <NTab type='tab' tabs={tabs6}/>
                <br/>

                <div id='A' style={{border:'solid 1px red'}}>A</div>
                <div id='B' style={{border:'solid 1px blue'}}>B</div>
                <div id='C' style={{border:'solid 1px green'}}>C</div>
            </div>
        </div>
        <div className='row'>
            <div className='col-md-4 col-lg-4 col-sm-4'>
                <span>Icon Only Tab</span>
                <NTab type='tab' tabs={tabs7}/>
            </div>
            <div className='col-md-4 col-lg-4 col-sm-4'>
                <span>Badge Tab</span>
                <NTab type='tab' tabs={tabs8}/>
            </div>
            <div className='col-md-4 col-lg-4 col-sm-4'>
                <span>Icon Only Tab</span>
                <NTab type='pill' tabs={tabs7}/>
            </div>
            <div className='col-md-4 col-lg-4 col-sm-4'>
                <span>Badge Tab</span>
                <NTab type='pill' tabs={tabs8}/>
            </div>
        </div>
    </div>);
    ReactDOM.render(panel, document.getElementById('main'));
})();