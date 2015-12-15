'use strict';

var jsdom = require('jsdom').jsdom;
global.document = jsdom('<html></html>', {});
global.window = document.defaultView;
propagateToGlobal(window);

function propagateToGlobal (window) {
	for (let key in window) {
		if (!window.hasOwnProperty(key))
			continue;
		if (key in global)
			continue;

		global[key] = window[key];
	}
}

global.jQuery = global.$ = require('jquery');
console.log('jQuery loaded: ' + (global.jQuery != null && global.jQuery === jQuery));

require('jquery-deparam');
console.log('jQuery-deparam loaded: ' + (jQuery.deparam != null));

require('jquery-mousewheel')(jQuery);
console.log('jQuery-mousewheel loaded: ' + (jQuery.fn.mousewheel != null));

require('bootstrap');
console.log('bootstrap loaded: ' + (jQuery.fn.popover != null));

require('bootstrap-fileinput-npm');
console.log('bootstrap-fileinput loaded: ' + (jQuery.fn.fileinput != null));

global.moment = require('moment');
console.log('moment loaded: ' + (global.moment != null));

global.React = require('react');
console.log('react loaded: ' + (global.React != null));

global.ReactDOM = require('react-dom');
console.log('react-dom loaded: ' + (global.ReactDOM != null));

global.jsface = require('jsface');
console.log('jsface loaded: ' + (global.jsface != null));

exports.unit_test = {
	setUp: function(done) {
		done();
	},
	setProperty: function(test) {
		test.expect(1);
		var parrot = require('../target/parrot/module/nest-parrot')(window, jQuery, jsface, moment, React, true);
		var model = parrot.createModel({});
		model.set('name', 'test');
		test.equal(model.get('name'), 'test', "Didn't set property value correctly.");
		test.done();
	}
};
