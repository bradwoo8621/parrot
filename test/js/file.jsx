/**
 * Created by brad.wu on 8/16/2015.
 */
(function() {
    var model = $pt.createModel({
        name: null
    });
    var layoutTemplate = {
        comp: {
            type: $pt.ComponentConstants.File
        }
    };

    var defaultSingle = $pt.createCellLayout('file', layoutTemplate);
    var customButtons = $pt.createCellLayout('file', $.extend(true, {}, layoutTemplate, {
        comp: {
            browseLabel: "Pick",
            browseIcon: "<i class=\"fa fa-check\"></i>",
            removeLabel: "Del",
            removeIcon: "<i class=\"fa fa-trash\"></i>",
            uploadLabel: "Go",
            uploadIcon: "<i class=\"fa fa-upload\"></i>"
        }
    }));
    var noPreview = $pt.createCellLayout('file', $.extend(true, {}, layoutTemplate, {
        comp: {
            showPreview: false
        }
    }));
    var noCaption = $pt.createCellLayout('file', $.extend(true, {}, layoutTemplate, {
        comp: {
            showCaption: false
        }
    }));
    var eventMonitor = $pt.createCellLayout('file', $.extend(true, {}, layoutTemplate, {
        comp: {
            uploadUrl: '/test',
            uploadAsync: false,
            // multiple: false,
            dropZoneEnabled: false
        },
        evt: {
            filebrowse: function(evt) {
                console.log(evt);
            },
            fileuploaded: function(event, data, previewId, index) {
                console.log(arguments);
            },
            filebatchuploadsuccess: function() {
                console.log(arguments);
            }
        }
    }));
    $.mockjax({
        url: "/test",
        response: function (settings) {
            this.responseText = {
                code: 'code',
                name: 'name'
            }
        }
    });

    var panel = (<div className='row'>
        <div className='col-md-6 col-lg-6 col-sm-6'>
            <span>Single File Upload</span>
            <NFile model={model} layout={defaultSingle}/>
            <span>Custom Buttons</span>
            <NFile model={model} layout={customButtons}/>
        </div>
        <div className='col-md-6 col-lg-6 col-sm-6'>
            <span>No Preview File</span>
            <NFile model={model} layout={noPreview}/>
            <span>No Caption</span>
            <NFile model={model} layout={noCaption}/>
        </div>
        <div className='col-md-6 col-lg-6 col-sm-6'>
            <span>Monitor Browse Event</span>
            <NFile model={model} layout={eventMonitor}/>
        </div>
        <div className=''>
            <input type='file' />
        </div>
    </div>);
    ReactDOM.render(panel, document.getElementById('main'));
})();
