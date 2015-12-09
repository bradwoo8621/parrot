'use strict';

// var jQuery = require('jquery');
// var jsface = require('jsface');
// var moment = require('moment');
// var browser = require('jquery.browser');
// var deparam = require('jquery-deparam');
// var wheel = require('jquery-mousewheel');
// var React = require('react');
// var fileInput = require('bootstrap-fileinput');

exports.unit_test = {
	setUp: function(done) {
		done();
	},
	defaultOptions: function(test) {
		test.expect(1);

		test.equal(true, true, 'Never occurs.');
		test.done();
	}
};
