(function (window) {
	var $pt = window.$pt;
	if ($pt == null) {
		$pt = {};
		window.$pt = $pt;
	}

	// exceptions
	/**
	 * component exception
	 * @param code {string} exception code
	 * @param message {string} exception message
	 */
	var ComponentException = function (code, message) {
		this.value = code;
		this.message = message;
		this.toString = function () {
			return this.value + ": " + this.message;
		};
	};

	/**
	 * create component exception
	 * @param code {string} exception code
	 * @param message {string} exception message
	 * @returns {ComponentException}
	 */
	$pt.createComponentException = function (code, message) {
		return new ComponentException(code, message);
	};

	// messages
	var messages = {};
	$pt.messages = messages;
	$pt.defineMessage = function (key, message) {
		// if (messages[key] != null) {
		// 	window.console.debug('Message[' + key + '=' + messages[key] + '] was replaced by [' + message + ']');
		// }
		messages[key] = message;
		return $pt;
	};
	$pt.getMessage = function (key) {
		var message = messages[key];
		return message == null ? null : message;
	};
	$pt.__messagesDomain = {};
	var throwMessageTypeConflictException = function(key, source, target) {
		var exp = $pt.createComponentException($pt.ComponentConstants.Err_Incorrect_Messages_Format,
				'Message [%1] has conflict type in source and target.'.format([key]));
		exp.source = source;
		exp.target = target;
		throw exp;
	};
	var internalInstallMessages = function(source, target, prefix) {
		// console.log('prefix', prefix);
		Object.keys(source).forEach(function(key) {
			var message = source[key];
			var existMessage = target[key];
			if (typeof message === 'object' && !Array.isArray(message)) {
				if (existMessage) {
					if (typeof existMessage === 'object' && !Array.isArray(existMessage)) {
						internalInstallMessages(message, existMessage, prefix ? (prefix + '.' + key) : key);
					} else {
						throwMessageTypeConflictException(prefix ? (prefix + '.' + key) : key, message, existMessage);
					}
				} else {
					// not exists in target, create a JSON to handle
					target[key] = {};
					internalInstallMessages(message, target[key], prefix ? (prefix + '.' + key) : key);
				}
			} else {
				if (typeof existMessage === 'object' && !Array.isArray(existMessage)) {
					throwMessageTypeConflictException(prefix ? (prefix + '.' + key) : key, message, existMessage);
				} else {
					if (existMessage) {
						console.error('Message [%1] exists in target.'.format([prefix ? (prefix + '.' + key) : key]));
						console.log('source message: ', source);
						console.log('target message: ', target);
					}
					target[key] = message;
				}
			}
		});
	};
	$pt.installMessages = function(domain, messagesJSON, messageTarget) {
		if (typeof messagesJSON !== 'object') {
			throw $pt.createComponentException($pt.ComponentConstants.Err_Incorrect_Messages_Format, 'Messages must be an JSON object.');
		}
		if (domain == null || typeof domain !== 'string' || domain.isBlank()) {
			throw $pt.createComponentException($pt.ComponentConstants.Err_Incorrect_Messages_Format, 'Domain of messages must be a string.');
		}
		console.log('Start to install messages on domain [' + domain + '].');
		var target = messageTarget ? messageTarget : $pt.messages;
		internalInstallMessages(messagesJSON, target);
		if (!$pt.__messagesDomain[domain]) {
			$pt.__messagesDomain[domain] = {
				domain: domain,
				messages: []
			};
		}
		$pt.__messagesDomain[domain].messages.push({
			target: target,
			json: messagesJSON,
		});
		console.log('End of install messages on domain [' + domain + '].');
	};
	var internalUninstallMessages = function(source, target, prefix) {
		Object.keys(source).forEach(function(key) {
			var message = source[key];
			var existMessage = target[key];
			if (typeof message === 'object' && !Array.isArray(message)) {
				if (existMessage) {
					if (typeof existMessage === 'object' && !Array.isArray(existMessage)) {
						internalUninstallMessages(message, existMessage, prefix ? (prefix + '.' + key) : key);
						if (Object.keys(existMessage).length == 0) {
							// all content removed, delete from target
							delete target[key];
						}
					} else {
						throwMessageTypeConflictException(prefix ? (prefix + '.' + key) : key, message, existMessage);
					}
				}
			} else {
				if (typeof existMessage === 'object' && !Array.isArray(existMessage)) {
					throwMessageTypeConflictException(prefix ? (prefix + '.' + key) : key, message, existMessage);
				} else {
					delete target[key];
				}
			}
		});
	};
	$pt.uninstallMessages = function(domain, messageTarget) {
		if (domain == null || typeof domain !== 'string' || domain.isBlank()) {
			throw $pt.createComponentException($pt.ComponentConstants.Err_Incorrect_Messages_Format, 'Domain of messages must be a string.');
		}
		console.log('Start to uninstall messages on domain [' + domain + '].');
		var target = messageTarget ? messageTarget : $pt.messages;
		var domainMessages = $pt.__messagesDomain[domain];
		if (domainMessages) {
			domainMessages.messages = domainMessages.messages.map(function(log) {
				if (log.target === target) {
					internalUninstallMessages(log.json, target);
					return null;
				} else {
					return log;
				}
			}).filter(function(log) {
				return log != null;
			});
			if (domainMessages.messages.length == 0) {
				// all messages uninstalled, remove domain
				delete $pt.__messagesDomain[domain];
			}
		}
		console.log('End of uninstall messages on domain [' + domain + '].');
	};
	// components
	$pt.Components = {};
	$pt.exposeComponents = function(context) {
		Object.keys($pt.Components).forEach(function(component) {
			context[component] = $pt.Components[component];
		});
	};
	// component constants
	$pt.ComponentConstants = {
		// component types
		Text: "text",
		TextInJSON: {type: 'text', label: true, popover: true, renderError: true, delay: 1000},
		TextArea: 'textarea',
		Select: "select",
		Check: "check",
		ArrayCheck: 'acheck',
		Toggle: 'toggle',
		Radio: "radio",
		Table: {type: "table", label: false, popover: false, renderError: false},
		Tree: {type: "tree", label: false, popover: false, renderError: false},
		SelectTree: "seltree",
		Date: "date",
		Search: "search",
		Button: {type: "button", label: false, popover: false, renderError: false},
		Tab: {type: 'tab', label: false, popover: false, renderError: false},
		ArrayTab: {type: 'atab', label: false, popover: false, renderError: false},
		Panel: {type: 'panel', label: false, popover: false, renderError: false},
		ArrayPanel: {type: 'apanel', label: false, popover: false, renderError: false},
		Label: {type: 'label', label: false},
		Form: {type: 'form', label: false, popover: false, renderError: false},
		ButtonFooter: {type: 'buttonfooter', label: false, popover: false, renderError: false},
		File: "file",
		Nothing: {type: "nothing", label: false},
		// date format
		Default_Date_Format: "YYYY/MM/DD HH:mm:ss.SSS", // see momentjs
		// code table
		CODETABLE_PARENT_VALUE_KEY: 'value',
		CODETABLE_SENDER_PROXY: null,
		CODETABLE_RECEIVER_PROXY: null,
		CODETABLE_REMOTE_PROXY: null,
		// error display
		ERROR_POPOVER: true,
		// exception codes
		Err_Unsupported_Component: "PT-00001",
		Err_Unuspported_Column_Sort: "PT-00002",
		Err_Search_Text_Trigger_Digits_Not_Defined: "PT-00003",
		Err_Tab_Index_Out_Of_Bound: "PT-00004",
		Err_Incorrect_Messages_Format: 'PT-00005',
		// http status
		Http_Status: {
			"0": "Browser Error",
			"400": "Bad Request",
			"401": "Unauthorized",
			"402": "Payment Required",
			"403": "Forbidden",
			"404": "Not Found",
			"405": "Method Not Allowed",
			"406": "Not Acceptable",
			"407": "Proxy Authentication Required",
			"408": "Request Timeout",
			"409": "Conflict",
			"410": "Gone",
			"411": "Length Required",
			"412": "Precondition Failed",
			"413": "Request Entity Too Large",
			"414": "Request-URI Too Long",
			"415": "Unsupported Media Type",
			"416": "Requested Range Not Satisfiable",
			"417": "Expectation Failed",
			"500": "Internal Server Error",
			"501": "Not Implemented",
			"502": "Bad Gateway",
			"503": "Service Unavailable",
			"504": "Gateway Timeout",
			"505": "HTTP Version Not Supported",
			// customize
			"506": "Application Exception"
		}
	};
	$pt.parseJSON = function(object) {
		if (object == null) {
			return null;
		}
		if (typeof object === 'string') {
			return JSON.parse(object);
		} else {
			return object;
		}
	};

	/*!
	 * jQuery Browser Plugin 0.1.0
	 * https://github.com/gabceb/jquery-browser-plugin
	 *
	 * Original jquery-browser code Copyright 2005, 2015 jQuery Foundation, Inc. and other contributors
	 * http://jquery.org/license
	 *
	 * Modifications Copyright 2015 Gabriel Cebrian
	 * https://github.com/gabceb
	 *
	 * Released under the MIT license
	 *
	 * Date: 05-07-2015
	 */
	/*global window: false */
	(function() {
		"use strict";

		function uaMatch( ua ) {
			// If an UA is not provided, default to the current browser UA.
			if ( ua === undefined ) {
			  	ua = window.navigator.userAgent;
			}
			ua = ua.toLowerCase();

			var match = /(edge)\/([\w.]+)/.exec( ua ) ||
			    /(opr)[\/]([\w.]+)/.exec( ua ) ||
			    /(chrome)[ \/]([\w.]+)/.exec( ua ) ||
			    /(iemobile)[\/]([\w.]+)/.exec( ua ) ||
			    /(version)(applewebkit)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec( ua ) ||
			    /(webkit)[ \/]([\w.]+).*(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec( ua ) ||
			    /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
			    /(opera)(?:.*version|)[ \/]([\w.]+)/.exec( ua ) ||
			    /(msie) ([\w.]+)/.exec( ua ) ||
			    ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec( ua ) ||
			    ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec( ua ) ||
			    [];

			var platform_match = /(ipad)/.exec( ua ) ||
			    /(ipod)/.exec( ua ) ||
			    /(windows phone)/.exec( ua ) ||
			    /(iphone)/.exec( ua ) ||
			    /(kindle)/.exec( ua ) ||
			    /(silk)/.exec( ua ) ||
			    /(android)/.exec( ua ) ||
			    /(win)/.exec( ua ) ||
			    /(mac)/.exec( ua ) ||
			    /(linux)/.exec( ua ) ||
			    /(cros)/.exec( ua ) ||
			    /(playbook)/.exec( ua ) ||
			    /(bb)/.exec( ua ) ||
			    /(blackberry)/.exec( ua ) ||
			    [];

			var browser = {},
			    matched = {
			      browser: match[ 5 ] || match[ 3 ] || match[ 1 ] || "",
			      version: match[ 2 ] || match[ 4 ] || "0",
			      versionNumber: match[ 4 ] || match[ 2 ] || "0",
			      platform: platform_match[ 0 ] || ""
			    };

			if ( matched.browser ) {
				browser[ matched.browser ] = true;
				browser.version = matched.version;
				browser.versionNumber = parseInt(matched.versionNumber, 10);
			}

			if ( matched.platform ) {
				browser[ matched.platform ] = true;
			}

			// These are all considered mobile platforms, meaning they run a mobile browser
			if ( browser.android || browser.bb || browser.blackberry || browser.ipad || browser.iphone ||
			  browser.ipod || browser.kindle || browser.playbook || browser.silk || browser[ "windows phone" ]) {
				browser.mobile = true;
			}

			// These are all considered desktop platforms, meaning they run a desktop browser
			if ( browser.cros || browser.mac || browser.linux || browser.win ) {
				browser.desktop = true;
			}

			// Chrome, Opera 15+ and Safari are webkit based browsers
			if ( browser.chrome || browser.opr || browser.safari ) {
				browser.webkit = true;
			}

			// IE11 has a new token so we will assign it msie to avoid breaking changes
			if ( browser.rv || browser.iemobile) {
				var ie = "msie";

				matched.browser = ie;
				browser[ie] = true;
			}

			// Edge is officially known as Microsoft Edge, so rewrite the key to match
			if ( browser.edge ) {
				delete browser.edge;
				var msedge = "msedge";

				matched.browser = msedge;
				browser[msedge] = true;
			}

			// Blackberry browsers are marked as Safari on BlackBerry
			if ( browser.safari && browser.blackberry ) {
				var blackberry = "blackberry";

				matched.browser = blackberry;
				browser[blackberry] = true;
			}

			// Playbook browsers are marked as Safari on Playbook
			if ( browser.safari && browser.playbook ) {
				var playbook = "playbook";

				matched.browser = playbook;
				browser[playbook] = true;
			}

			// BB10 is a newer OS version of BlackBerry
			if ( browser.bb ) {
				var bb = "blackberry";

				matched.browser = bb;
				browser[bb] = true;
			}

			// Opera 15+ are identified as opr
			if ( browser.opr ) {
				var opera = "opera";

				matched.browser = opera;
				browser[opera] = true;
			}

			// Stock Android browsers are marked as Safari on Android.
			if ( browser.safari && browser.android ) {
				var android = "android";

				matched.browser = android;
				browser[android] = true;
			}

			// Kindle browsers are marked as Safari on Kindle
			if ( browser.safari && browser.kindle ) {
				var kindle = "kindle";

				matched.browser = kindle;
				browser[kindle] = true;
			}

			 // Kindle Silk browsers are marked as Safari on Kindle
			if ( browser.safari && browser.silk ) {
				var silk = "silk";

				matched.browser = silk;
				browser[silk] = true;
			}

			// Assign the name and platform variable
			browser.name = matched.browser;
			browser.platform = matched.platform;
			return browser;
		}

		// Run the matching process, also assign the function to the returned object
		// for manual, jQuery-free use if desired
		window.jQBrowser = uaMatch( window.navigator.userAgent );
		window.jQBrowser.uaMatch = uaMatch;
		$pt.browser = window.jQBrowser;
	})();

	var _context = window;
	$pt.getService = function (context, serviceName) {
		var innerContext = context ? context : _context;
		var innerServiceName = serviceName ? serviceName : '$service';
		if (!innerContext[innerServiceName]) {
			innerContext[innerServiceName] = {};
		}
		return innerContext[innerServiceName];
	};
})(window);
