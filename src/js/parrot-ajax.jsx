/**
 * depends on jquery, jquery-mockjax(optional), jquery-deparam(optional)
 * depends on NExceptionModal, NOnRequestModal
 */
(function (context, $) {
	var $pt = context.$pt;
	if ($pt == null) {
		$pt = {};
		context.$pt = $pt;
	}

	/**
	 * submit to server
	 * @param options {*} same as jquery ajax options, three more properties
	 *          url: string
	 *          done: same as jquery ajax done callback function
	 *          fail: function or json object
	 *              function: same as jquery ajax fail callback function
	 *              json: key is return status, value is function which is same as jquery ajax fail callback function
	 * @returns {jqXHR}
	 */
	var submit = function (options) {
		var url = options.url;
		var done = options.done;
		var fail = options.fail;
		var quiet = options.quiet;

		delete options.url;
		delete options.done;
		delete options.fail;

		// build on request dialog
		// show
		if (quiet === true) {
		} else {
			NOnRequestModal.getOnRequestModal().show();
		}

		return $.ajax(url, options)
			.done(function (data, textStatus, jqXHR) {
				if (done !== undefined && done !== null) {
					done(data, textStatus, jqXHR);
				}
			})
			.fail(function (jqXHR, textStatus, errorThrown) {
				if (fail !== undefined && fail !== null) {
					var callback = null;
					if (typeof fail === 'function') {
						callback = fail;
					} else {
						callback = fail["" + jqXHR.status];
					}
					if (callback != null) {
						callback(jqXHR, textStatus, errorThrown);
					} else {
						NExceptionModal.getExceptionModal().show("" + jqXHR.status, jqXHR.responseText);
					}
				} else {
					NExceptionModal.getExceptionModal().show("" + jqXHR.status, jqXHR.responseText);
				}
			})
			.always(function () {
				// hide
				if (quiet === true) {
				} else {
					NOnRequestModal.getOnRequestModal().hide();
				}
			});
	};

	/**
	 * http post
	 * @param url {string}
	 * @param data {*}
	 * @param settings {*} optional jquery ajax settings
	 * @returns {jqXHR}
	 */
	$pt.doPost = function (url, data, settings) {
		return submit($.extend({
			method: "POST",
			dataType: "json",
			contentType: "application/json; charset=UTF-8"
		}, settings, {
			url: url,
			data: JSON.stringify(data)
		}));
	};
	/**
	 * http put
	 * @param url {string}
	 * @param data {*}
	 * @param settings {*} optional jquery ajax settings
	 * @returns {jqXHR}
	 */
	$pt.doPut = function (url, data, settings) {
		return submit($.extend({
			method: "PUT",
			dataType: "json",
			contentType: "application/json; charset=UTF-8"
		}, settings, {
			url: url,
			data: JSON.stringify(data)
		}));
	};
	/**
	 * http get
	 * @param url {string}
	 * @param data {*}
	 * @param settings {*} optional jquery ajax settings
	 * @returns {jqXHR}
	 */
	$pt.doGet = function (url, data, settings) {
		return submit($.extend({
			method: "GET",
			dataType: "json",
			contentType: "text/plain; charset=UTF-8"
		}, settings, {
			url: url,
			data: data
		}));
	};
	/**
	 * http delete
	 * @param url {string}
	 * @param data {*}
	 * @param settings {*} optional jquery ajax settings
	 * @returns {jqXHR}
	 */
	$pt.doDelete = function (url, data, settings) {
		return submit($.extend({
			method: "DELETE",
			dataType: "json",
			contentType: "text/plain; charset=UTF-8"
		}, settings, {
			url: url,
			data: data
		}));
	};
	/**
	 * relocate page, use window.location
	 * @param url {string}
	 * @param data {*}
	 */
	$pt.relocatePage = function (url, data) {
		var finalURL = url;
		if (data) {
			if (finalURL.indexOf('?') != -1) {
				finalURL += '&' + $.param(data);
			} else {
				finalURL += '?' + $.param(data);
			}
		}
		window.location = finalURL;
	};
	/**
	 * get data from url parameters
	 * include jquery-deparam when call this method
	 * @returns {*}
	 */
	$pt.getUrlData = function (params) {
		var paramsString = '';
		if (params !== undefined) {
			if (params == null || params.isBlank()) {
				return {};
			} else {
				paramsString = params;
			}
		} else {
			paramsString = window.location.search;
			if (paramsString != null && !paramsString.isBlank() && paramsString.trim() != '?') {
				paramsString = paramsString.substring(1);
			} else {
				return {};
			}
		}
		return $.deparam(paramsString);
	};
	/**
	 * mock ajax
	 * include jquery-mockjax when call this method, or do nothing
	 * parameters are same as mockjax
	 */
	$pt.mock = function () {
		if (!$.mockjax) {
			return;
		}

		$.mockjax.apply($, arguments);
	};

	// routes
	var routes = {
		context: '',
		urls: {}
	};
	$pt.routes = routes;
	/**
	 * define web context
	 * @param webContext {string}
	 */
	$pt.defineWebContext = function (webContext) {
		routes.context = webContext;
		return $pt;
	};
	/**
	 * define url with given key
	 * @param key {string} key of url
	 * @param urlRelateToWebContext {string} related url with no web context
	 */
	$pt.defineURL = function (key, urlRelateToWebContext) {
		if (routes.urls[key] != null) {
			console.warn('URL[' + key + '=' + routes.urls[key] + '] was replaced by [' + routes.context + urlRelateToWebContext + ']');
		}
		routes.urls[key] = urlRelateToWebContext;
		return $pt;
	};
	/**
	 * get url by given key
	 * @param key {string} key of url
	 * @returns {string} return null when not found, or url with web context
	 */
	$pt.getURL = function (key) {
		var url = routes.urls[key];
		return url == null ? null : (routes.context + url);
	};
})(this, jQuery);