/**
 * Created by brad.wu on 8/16/2015.
 */
(function () {
    $.mockjax({
        url: '/app/codetable',
        responseTime: 2000,
        response: function () {
            this.responseText = [
                {id: '1', text: 'Option A'},
                {id: '2', text: 'Option B'},
                {id: '3', text: 'Option C'},
                {id: '4', text: 'Option D'},
                {id: '5', text: 'Option AAAAA BBBBB CCCCCCCCCCCCC DDDDDD EEEE'},
                {id: '6', text: 'Option F'},
                {id: '7', text: 'Option G'},
                {id: '8', text: 'Option H'},
                {id: '9', text: 'Option I'},
                {id: '10', text: 'Option J'},
                {id: '11', text: 'Option K'}
            ];
        }
    });
    $.mockjax({
        url: '/app/codetable2',
        responseTime: 2000,
        response: function (settings) {
            var data = settings.data;
            if (typeof data === 'string') {
                data = JSON.parse(data);
            }
            if (data) {
                if (data.value == '1') {
                    this.responseText = [
                        {id: '1', text: 'Option A', parent: '1'},
                        {id: '2', text: 'Option B', parent: '1'},
                        {id: '3', text: 'Option C', parent: '1'},
                        {id: '4', text: 'Option D', parent: '1'},
                        {id: '5', text: 'Option E', parent: '1'},
                        // if other parent value received, code table automatically store
                        {id: '6', text: 'Option F', parent: '2'},
                        {id: '7', text: 'Option G', parent: '2'},
                        {id: '8', text: 'Option H', parent: '2'},
                        {id: '9', text: 'Option I', parent: '2'},
                        {id: '10', text: 'Option J', parent: '2'},
                        {id: '11', text: 'Option K', parent: '2'}
                    ];
                } else if (data.value == '2') {
                    this.responseText = [
                        {id: '6', text: 'Option F', parent: '2'},
                        {id: '7', text: 'Option G', parent: '2'},
                        {id: '8', text: 'Option H', parent: '2'},
                        {id: '9', text: 'Option I', parent: '2'},
                        {id: '10', text: 'Option J', parent: '2'},
                        {id: '11', text: 'Option K', parent: '2'},

                        {id: '1', text: 'Option A', parent: '1'},
                        {id: '2', text: 'Option B', parent: '1'},
                        {id: '3', text: 'Option C', parent: '1'},
                        {id: '4', text: 'Option D', parent: '1'},
                        {id: '5', text: 'Option E', parent: '1'}
                    ]
                } else {
                    // throw 'error';
                }
            } else {
                this.responseText = [
                    {id: '1', text: 'Option A', parent: '1'},
                    {id: '2', text: 'Option B', parent: '1'},
                    {id: '3', text: 'Option C', parent: '1'},
                    {id: '4', text: 'Option D', parent: '1'},
                    {id: '5', text: 'Option E', parent: '1'},
                    {id: '6', text: 'Option F', parent: '2'},
                    {id: '7', text: 'Option G', parent: '2'},
                    {id: '8', text: 'Option H', parent: '2'},
                    {id: '9', text: 'Option I', parent: '2'},
                    {id: '10', text: 'Option J', parent: '2'},
                    {id: '11', text: 'Option K', parent: '2'}
                ];
            }
        }
    });
    var model = $pt.createModel({
        name: '7',
        parentValue: '1',
        childValue: '2'
    });
    var data = $pt.createCodeTable([
        {id: '1', text: 'Option 1 A'},
        {id: '2', text: 'Option 2 B'},
        {id: '3', text: 'Option 3 C'},
        {id: '4', text: 'Option 4 D'},
        {id: '5', text: 'Option 5 AAAAA BBBBB CCCCCCCCCCCCC DDDDDD EEEE'},
        {id: '6', text: 'Option 6 F'},
        {id: '7', text: 'Option 7 G'},
        {id: '8', text: 'Option 8 H'},
        {id: '9', text: 'Option 9 I'},
        {id: '10', text: 'Option 10 J'},
        {id: '11', text: 'Option 11 K'},
        {id: '12', text: 'Option 12 F'},
        {id: '13', text: 'Option 13 G'},
        {id: '14', text: 'Option 14 H'},
        {id: '15', text: 'Option 15 I'},
        {id: '16', text: 'Option 16 J'},
        {id: '17', text: 'Option 17 F'},
        {id: '18', text: 'Option 18 G'},
        {id: '19', text: 'Option 19 H'},
        {id: '20', text: 'Option 20 I'},
        {id: '21', text: 'Option 21 J'},
        {id: '22', text: 'Option 22 F'},
        {id: '23', text: 'Option 23 G'},
        {id: '24', text: 'Option 24 H'},
        {id: '25', text: 'Option 25 I'},
        {id: '26', text: 'Option 26 J'},
        {id: '27', text: 'Option 27 F'},
        {id: '28', text: 'Option 28 G'},
        {id: '29', text: 'Option 29 H'},
        {id: '30', text: 'Option 30 I'},
        {id: '31', text: 'Option 31 J'},
        {id: '32', text: 'Option 32 F'},
        {id: '33', text: 'Option 33 G'},
        {id: '34', text: 'Option 34 H'},
        {id: '35', text: 'Option 35 I'},
        {id: '36', text: 'Option 36 J'},
        {id: '37', text: 'Option 37 F'},
        {id: '38', text: 'Option 38 G'},
        {id: '39', text: 'Option 39 H'},
        {id: '40', text: 'Option 40 I'},
        {id: '41', text: 'Option 41 J'},
        {id: '42', text: 'Option 42 F'},
        {id: '43', text: 'Option 43 G'},
        {id: '44', text: 'Option 44 H'},
        {id: '45', text: 'Option 45 I'},
        {id: '46', text: 'Option 46 J'},
        {id: '47', text: 'Option 47 F'},
        {id: '48', text: 'Option 48 G'},
        {id: '49', text: 'Option 49 H'},
        {id: '50', text: 'Option 50 I'},
        {id: '51', text: 'Option 51 J'},
        {id: '52', text: 'Option 52 F'},
        {id: '53', text: 'Option 53 G'},
        {id: '54', text: 'Option 54 H'},
        {id: '55', text: 'Option 55 I'},
        {id: '56', text: 'Option 56 J'},
        {id: '57', text: 'Option 57 F'},
        {id: '58', text: 'Option 58 G'},
        {id: '59', text: 'Option 59 H'},
        {id: '60', text: 'Option 60 I'},
        {id: '61', text: 'Option 61 J'},
        {id: '62', text: 'Option 62 F'},
        {id: '63', text: 'Option 63 G'},
        {id: '64', text: 'Option 64 H'},
        {id: '65', text: 'Option 65 I'},
        {id: '66', text: 'Option 66 J'},
        {id: '67', text: 'Option 67 F'},
        {id: '68', text: 'Option 68 G'},
        {id: '69', text: 'Option 69 H'},
        {id: '70', text: 'Option 70 I'},
        {id: '71', text: 'Option 71 J'},
    ]);
    var normal = $pt.createCellLayout('name', {
        label: 'Click me',
        comp: {
            type: $pt.ComponentConstants.Select,
            data: data,
            minimumResultsForSearch: Infinity,
            allowClear: false
        },
        pos: {row: 1, col: 1}
    });
    var filter = $pt.createCellLayout('name', {
        label: 'Click me',
        comp: {
            type: $pt.ComponentConstants.Select,
            data: data,
            minimumResultsForSearch: 1
        },
        pos: {row: 1, col: 1}
    });
    var disabledNormal = $pt.createCellLayout('name', {
        label: 'Click me',
        comp: {
            type: $pt.ComponentConstants.Select,
            data: data,
            enabled: {
                when: function () {
                    return false;
                },
                depends: 'name'
            },
            allowClear: false
        },
        pos: {row: 1, col: 1}
    });
    var remote = $pt.createCellLayout('name', {
        comp: {
            type: $pt.ComponentConstants.Select,
            data: $pt.createCodeTable({url: '/app/codetable'}),
            allowClear: false
        },
        pos: {row: 1, col: 1}
    });

    var panel = (<div className='row'>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <span>Select2</span>
            <NSelect model={model} layout={normal}/>
            <span>Option Filter Select2</span>
            <NSelect model={model} layout={filter}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3 has-error'>
            <span>Error Select2</span>
            <NSelect model={model} layout={normal}/>
            <span>Error Option Filter Select2</span>
            <NSelect model={model} layout={filter}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <span>Disabled Select2</span>
            <NSelect model={model} layout={disabledNormal}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3 has-error'>
            <span>Error Disabled Select2</span>
            <NSelect model={model} layout={disabledNormal}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <span>View Mode</span>
            <NSelect model={model} layout={normal} view={true}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3'>
            <span>Remote</span>
            <NSelect model={model} layout={remote} />
            <span>Remote View Mode</span>
            <NSelect model={model} layout={remote} view={true}/>
        </div>
        <div className='col-md-3 col-lg-3 col-sm-3' style={{border: '1px solid #e0e0e0'}}>
            <span>Hierarchy Parent</span>
            <NText model={model} layout={$pt.createCellLayout('parentValue', {})} />

            <span>Hierarchy Child Only Load When Parent Has Value</span>
            <NSelect model={model} layout={$pt.createCellLayout('childValue', {
                comp: {
                    data: $pt.createCodeTable({url: '/app/codetable2'}),
                    parentPropId: 'parentValue',
                    parentFilter: {name: 'parent'}
                }
            })} />
        </div>
    </div>);
    ReactDOM.render(panel, document.getElementById('main'));
})();
