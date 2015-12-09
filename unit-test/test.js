'use strict';

// var jQuery = require('jquery');
// var jsface = require('jsface');
// var moment = require('moment');
// var browser = require('jquery.browser');
// var deparam = require('jquery-deparam');
// var wheel = require('jquery-mousewheel');
// var React = require('react');
// var fileInput = require('bootstrap-fileinput');
var jsdom = require('jsdom').jsdom;
var document = jsdom('<html></html>', {});
var window = document.defaultView;

require('jquery')(window);

global.window = window;
propagateToGlobal(window);
global.document = document;

require('jquery.browser');
console.log(jQuery.browser);

function propagateToGlobal(window) {
    for (let key in window) {
        if (!window.hasOwnProperty(key)) {
            // console.log('!window.hasOwnProperty(' + key + ')');
            continue;
        }
        if (key in global) {
            // console.log(key + ' in global');
            continue;
        }
        // console.log('Assign [' + key + '] to global.');
        global[key] = window[key];
    }
}

exports.unit_test = {
	setUp: function(done) {
		done();
	},
	defaultOptions: function(test) {
		test.expect(1);

        // var jQuery = require('jquery')(window);
        // var React = require('react');
        // var moment = require('moment');
        // var jsface = require('jsface');
        // var browser = require('jquery.browser');
        // var deparam = require('jquery-deparam');
        // var wheel = require('jquery-mousewheel');
        // var fileInput = require('bootstrap-fileinput');
        // var bootstrap = require('bootstrap');

		test.equal(true, true, 'Never occurs.');
		test.done();
	}
};
