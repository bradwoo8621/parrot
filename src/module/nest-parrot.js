(function( global, factory ) {
	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// CMD
		// all dependencies need to passed as parameters manually,
		// will not require here.
		module.exports = factory;
	} else if ( typeof define === 'function' && define.amd ) {
        // AMD. Register as parrot
		// TODO how to define the jquery plugin here?
        define('parrot', ['jquery', 'jsface', 'moment', 'react', 'react-dom'], factory);
	} else {
		// in browser, global is window.
		// all dependencies were loaded already.
		// bootstrap and jquery's plugin are all attached to jquery,
		// expose $pt and all components to window.
		factory(global, jQuery, jsface, moment, React, ReactDOM);
	}
}(typeof window !== "undefined" ? window : this, function(window, jQuery, jsface, moment, React, ReactDOM, DONT_EXPOSE_PARROT_TO_GLOBAL) {
	var _pt = window.$pt;
	var $pt = {};
	window.$pt = $pt;

	var browser = jQuery.browser;
	var deparam = jQuery.deparam;

	$pt.noConflict = function() {
		window.$pt = _pt;
		return $pt;
	};

	// insert all source code here
	// parrot body here

	// reset to old $pt
	if (typeof DONT_EXPOSE_PARROT_TO_GLOBAL != 'undefined' && DONT_EXPOSE_PARROT_TO_GLOBAL === true) {
		window.$pt = _pt;
	}
	return $pt;
}));
