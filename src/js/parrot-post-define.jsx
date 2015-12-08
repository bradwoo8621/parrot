// only packaged in browser environment
(function (window) {
	var $pt = window.$pt;
	// expose all components definition to window
	Object.keys($pt.Components).forEach(function(component) {
		window[component] = $pt.Components[component];
	});
}(window));
