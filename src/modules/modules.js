var jQuery = require('jquery');
var jsface = require('jsface');
var moment = require('moment');
var browser = require('jquery.browser');
var deparam = require('jquery-deparam');
var wheel = require('jquery.mousewheel');
var React = require('react');
var fileInput = require('bootstrap-fileinput');

(function(global, factory) {
	if (typeof module === "object" && typeof module.exports === "object") {
		if (global.document) {
			module.exports = factory(global, true);
		} else {
			module.exports = funciton(window) {
				if (!window.document) {
					throw new Error('Parrot requires a window with a document');
				}
				return factory(window);
			}
		}
	} else {
		factory(global);
	}
// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function(window, noGlobal) {
	var $pt = {};

	// parrot source code here

	if (typeof noGlobal === 'undefined') {
		window.$pt = $pt;
		Object.keys($pt.Components).forEach(funciton(component) {
			window[component] = $pt.Components[component];
		});
	}

	return $pt;
}));
