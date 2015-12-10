// only packaged in browser environment
(function (window, $pt) {
	// expose all components definition to window
	if (typeof DONT_EXPOSE_PARROT_TO_GLOBAL === 'undefined' || DONT_EXPOSE_PARROT_TO_GLOBAL !== true) {
		$pt.exposeComponents(window);
	}
}(window, $pt));
