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
	/** nest-parrot.V0.6.24 2019-03-25 */
(function (window) {
	var patches = {
		console: function () {
			var noop = function () {};
			var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd', 'timeStamp', 'trace', 'warn'];
			var length = methods.length;
			var console = window.console = window.console || {};

			while (length--) {
				var method = methods[length];

				// Only stub undefined methods.
				if (!console[method]) {
					console[method] = noop;
				}
			}
			window.console = window.console ? window.console : console;
		},
		string: function () {
			if (String.prototype.upperFirst === undefined) {
				String.prototype.upperFirst = function () {
					if (this.length == 1) {
						return this.toUpperCase();
					} else {
						return this.substring(0, 1).toUpperCase() + this.substring(1);
					}
				};
			}
			if (!String.prototype.endsWith) {
				String.prototype.endsWith = function (searchString, position) {
					var subjectString = this.toString();
					if (position === undefined || position > subjectString.length) {
						position = subjectString.length;
					}
					position -= searchString.length;
					var lastIndex = subjectString.indexOf(searchString, position);
					return lastIndex !== -1 && lastIndex === position;
				};
			}
			if (!String.prototype.startsWith) {
				String.prototype.startsWith = function (prefix) {
					return this.slice(0, prefix.length) === prefix;
				};
			}
			if (!String.prototype.trim) {
				String.prototype.trim = function () {
					return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
				};
			}
			if (String.prototype.isEmpty === undefined) {
				String.prototype.isEmpty = function () {
					return this.length === 0;
				};
			}
			if (String.prototype.isBlank === undefined) {
				String.prototype.isBlank = function () {
					return this.trim().length === 0;
				};
			}
			/**
    * replace place holders %1, %2, etc with given string array
    *
    * @param strArray
    * @returns
    */
			if (String.prototype.format === undefined) {
				String.prototype.format = function (strArray) {
					return this.replace(/%(\d+)/g, function (_, m) {
						return strArray[--m];
					});
				};
			}
			if (String.prototype.currencyFormat === undefined) {
				String.prototype.currencyFormat = function (fraction) {
					fraction = fraction ? fraction : 0;
					var value = this * 1;
					return value.toFixed(fraction).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
				};
			}
			if (String.prototype.padLeft === undefined) {
				String.prototype.padLeft = function (nSize, ch) {
					var len = 0;
					var s = this ? this : "";
					ch = ch ? ch : '0'; // default add 0
					len = s.length;
					while (len < nSize) {
						s = ch + s;
						len++;
					}
					return s;
				};
			}
			if (String.prototype.padRight === undefined) {
				String.prototype.padRight = function (nSize, ch) {
					var len = 0;
					var s = this ? this : "";
					ch = ch ? ch : '0'; // default add 0
					len = s.length;
					while (len < nSize) {
						s = s + ch;
						len++;
					}
					return s;
				};
			}
			if (String.prototype.movePointLeft === undefined) {
				String.prototype.movePointLeft = function (scale) {
					var s, s1, s2, ch, ps, sign;
					ch = ".";
					sign = '';
					s = this ? this : "";
					if (scale <= 0) {
						return s;
					}
					ps = s.split('.');
					s1 = ps[0] ? ps[0] : "";
					s2 = ps[1] ? ps[1] : "";
					if (s1.slice(0, 1) == '-') {
						s1 = s1.slice(1);
						sign = '-';
					}
					if (s1.length <= scale) {
						ch = "0.";
						s1 = s1.padLeft(scale);
					}
					return sign + s1.slice(0, -scale) + ch + s1.slice(-scale) + s2;
				};
			}
			if (String.prototype.movePointRight === undefined) {
				String.prototype.movePointRight = function (scale) {
					var s, s1, s2, ch, ps, sign;
					ch = '.';
					s = this ? this : "";
					if (scale <= 0) {
						return s;
					}
					ps = s.split('.');
					s1 = ps[0] ? ps[0] : "";
					s2 = ps[1] ? ps[1] : "";
					if (s2.length <= scale) {
						ch = '';
						s2 = s2.padRight(scale);
					}
					if (s1.slice(0, 1) == '-') {
						s1 = s1.slice(1);
						sign = '-';
					} else {
						sign = '';
					}
					if (s1 == 0) {
						s1 = '';
					}
					// window.console.log('Return[sign=' + sign + ', s1=' + s1 + ', s2-1=' + s2.slice(0, scale) + ', ch=' + ch + ', s2-2=' + s2.slice(scale, s2.length) + ']');
					var integral = (s1 + s2.slice(0, scale)).replace(/^0+/, '');
					if (integral.isEmpty()) {
						integral = '0';
					}
					return sign + integral + ch + s2.slice(scale, s2.length);
				};
			}
		},
		number: function () {
			// if (Number.prototype.currencyFormat === undefined) {
			// 	Number.prototype.currencyFormat = function (fraction) {
			// 		fraction = fraction ? fraction : 0;
			// 		return value.toFixed(fraction).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
			// 	};
			// }
		},
		array: function () {
			if (!Array.prototype.find) {
				Array.prototype.find = function (predicate) {
					if (this === null) {
						throw new TypeError('Array.prototype.find called on null or undefined');
					}
					if (typeof predicate !== 'function') {
						throw new TypeError('predicate must be a function');
					}
					var list = Object(this);
					var length = list.length >>> 0;
					var thisArg = arguments[1];
					var value;

					for (var i = 0; i < length; i++) {
						value = list[i];
						if (predicate.call(thisArg, value, i, list)) {
							return value;
						}
					}
					return undefined;
				};
			}
			if (!Array.prototype.findIndex) {
				Array.prototype.findIndex = function (predicate) {
					if (this === null) {
						throw new TypeError('Array.prototype.findIndex called on null or undefined');
					}
					if (typeof predicate !== 'function') {
						throw new TypeError('predicate must be a function');
					}
					var list = Object(this);
					var length = list.length >>> 0;
					var thisArg = arguments[1];
					var value;

					for (var i = 0; i < length; i++) {
						value = list[i];
						if (predicate.call(thisArg, value, i, list)) {
							return i;
						}
					}
					return -1;
				};
			}
		}
	};

	patches.console();
	patches.string();
	patches.number();
	patches.array();
})(window);

// copy from https://github.com/princed/caret
(function ($, window) {
	function focus(target) {
		if (!document.activeElement || document.activeElement !== target) {
			target.focus();
		}
	}

	$.fn.caret = function (pos) {
		var target = this[0];
		var range, range1, range2, bookmark;
		var isContentEditable = target.contentEditable === 'true';
		//get
		if (arguments.length == 0) {
			//HTML5
			if (window.getSelection) {
				//contenteditable
				if (isContentEditable) {
					focus(target);
					var selection = window.getSelection();
					// Opera 12 check
					if (!selection.rangeCount) {
						return 0;
					}
					range1 = selection.getRangeAt(0);
					range2 = range1.cloneRange();
					range2.selectNodeContents(target);
					range2.setEnd(range1.endContainer, range1.endOffset);
					return range2.toString().length;
				}
				//textarea
				return target.selectionStart;
			}
			//IE<9
			if (document.selection) {
				focus(target);
				//contenteditable
				if (isContentEditable) {
					range1 = document.selection.createRange();
					range2 = document.body.createTextRange();
					range2.moveToElementText(target);
					range2.setEndPoint('EndToEnd', range1);
					return range2.text.length;
				}
				//textarea
				pos = 0;
				range = target.createTextRange();
				range2 = document.selection.createRange().duplicate();
				bookmark = range2.getBookmark();
				range.moveToBookmark(bookmark);
				while (range.moveStart('character', -1) !== 0) {
					pos++;
				}
				return pos;
			}
			//not supported
			return 0;
		}
		//set
		if (pos == -1) {
			pos = this[isContentEditable ? 'text' : 'val']().length;
		}
		//HTML5
		if (window.getSelection) {
			//contenteditable
			if (isContentEditable) {
				focus(target);
				window.getSelection().collapse(target.firstChild, pos);
			}
			//textarea
			else target.setSelectionRange(pos, pos);
		}
		//IE<9
		else if (document.body.createTextRange) {
				range = document.body.createTextRange();
				range.moveToElementText(target);
				range.moveStart('character', pos);
				range.collapse(true);
				range.select();
			}
		if (!isContentEditable) {
			focus(target);
		}
		return pos;
	};
})(jQuery, window);

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
	var throwMessageTypeConflictException = function (key, source, target) {
		var exp = $pt.createComponentException($pt.ComponentConstants.Err_Incorrect_Messages_Format, 'Message [%1] has conflict type in source and target.'.format([key]));
		exp.source = source;
		exp.target = target;
		throw exp;
	};
	var internalInstallMessages = function (source, target, prefix) {
		// console.log('prefix', prefix);
		Object.keys(source).forEach(function (key) {
			var message = source[key];
			var existMessage = target[key];
			if (typeof message === 'object' && !Array.isArray(message)) {
				if (existMessage) {
					if (typeof existMessage === 'object' && !Array.isArray(existMessage)) {
						internalInstallMessages(message, existMessage, prefix ? prefix + '.' + key : key);
					} else {
						throwMessageTypeConflictException(prefix ? prefix + '.' + key : key, message, existMessage);
					}
				} else {
					// not exists in target, create a JSON to handle
					target[key] = {};
					internalInstallMessages(message, target[key], prefix ? prefix + '.' + key : key);
				}
			} else {
				if (typeof existMessage === 'object' && !Array.isArray(existMessage)) {
					throwMessageTypeConflictException(prefix ? prefix + '.' + key : key, message, existMessage);
				} else {
					if (existMessage) {
						console.error('Message [%1] exists in target.'.format([prefix ? prefix + '.' + key : key]));
						console.log('source message: ', source);
						console.log('target message: ', target);
					}
					target[key] = message;
				}
			}
		});
	};
	$pt.installMessages = function (domain, messagesJSON, messageTarget) {
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
			json: messagesJSON
		});
		console.log('End of install messages on domain [' + domain + '].');
	};
	var internalUninstallMessages = function (source, target, prefix) {
		Object.keys(source).forEach(function (key) {
			var message = source[key];
			var existMessage = target[key];
			if (typeof message === 'object' && !Array.isArray(message)) {
				if (existMessage) {
					if (typeof existMessage === 'object' && !Array.isArray(existMessage)) {
						internalUninstallMessages(message, existMessage, prefix ? prefix + '.' + key : key);
						if (Object.keys(existMessage).length == 0) {
							// all content removed, delete from target
							delete target[key];
						}
					} else {
						throwMessageTypeConflictException(prefix ? prefix + '.' + key : key, message, existMessage);
					}
				}
			} else {
				if (typeof existMessage === 'object' && !Array.isArray(existMessage)) {
					throwMessageTypeConflictException(prefix ? prefix + '.' + key : key, message, existMessage);
				} else {
					delete target[key];
				}
			}
		});
	};
	$pt.uninstallMessages = function (domain, messageTarget) {
		if (domain == null || typeof domain !== 'string' || domain.isBlank()) {
			throw $pt.createComponentException($pt.ComponentConstants.Err_Incorrect_Messages_Format, 'Domain of messages must be a string.');
		}
		console.log('Start to uninstall messages on domain [' + domain + '].');
		var target = messageTarget ? messageTarget : $pt.messages;
		var domainMessages = $pt.__messagesDomain[domain];
		if (domainMessages) {
			domainMessages.messages = domainMessages.messages.map(function (log) {
				if (log.target === target) {
					internalUninstallMessages(log.json, target);
					return null;
				} else {
					return log;
				}
			}).filter(function (log) {
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
	$pt.exposeComponents = function (context) {
		Object.keys($pt.Components).forEach(function (component) {
			context[component] = $pt.Components[component];
		});
	};
	// component constants
	$pt.ComponentConstants = {
		// component types
		Text: "text",
		TextInJSON: { type: 'text', label: true, popover: true, renderError: true, delay: 1000 },
		TextArea: 'textarea',
		Select: "select",
		Check: "check",
		ArrayCheck: 'acheck',
		Toggle: 'toggle',
		Radio: "radio",
		Table: { type: "table", label: false, popover: false, renderError: false },
		Tree: { type: "tree", label: false, popover: false, renderError: false },
		SelectTree: "seltree",
		Date: "date",
		Search: "search",
		Button: { type: "button", label: false, popover: false, renderError: false },
		Tab: { type: 'tab', label: false, popover: false, renderError: false },
		ArrayTab: { type: 'atab', label: false, popover: false, renderError: false },
		Panel: { type: 'panel', label: false, popover: false, renderError: false },
		ArrayPanel: { type: 'apanel', label: false, popover: false, renderError: false },
		Label: { type: 'label', label: false },
		Form: { type: 'form', label: false, popover: false, renderError: false },
		ButtonFooter: { type: 'buttonfooter', label: false, popover: false, renderError: false },
		File: "file",
		Nothing: { type: "nothing", label: false },
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
	$pt.parseJSON = function (object) {
		if (object == null) {
			return null;
		}
		if (typeof object === 'string') {
			return JSON.parse(object);
		} else {
			return object;
		}
	};
	$pt.isVisibleOnAuth = function (component) {
		return true;
	};
	$pt.markFuncAsWrap = function (func) {
		if (func) {
			func.wrap = true;
		}
		return func;
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
	(function () {
		"use strict";

		function uaMatch(ua) {
			// If an UA is not provided, default to the current browser UA.
			if (ua === undefined) {
				ua = window.navigator.userAgent;
			}
			ua = ua.toLowerCase();

			var match = /(edge)\/([\w.]+)/.exec(ua) || /(opr)[\/]([\w.]+)/.exec(ua) || /(chrome)[ \/]([\w.]+)/.exec(ua) || /(iemobile)[\/]([\w.]+)/.exec(ua) || /(version)(applewebkit)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+).*(version)[ \/]([\w.]+).*(safari)[ \/]([\w.]+)/.exec(ua) || /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) || ua.indexOf("trident") >= 0 && /(rv)(?::| )([\w.]+)/.exec(ua) || ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];

			var platform_match = /(ipad)/.exec(ua) || /(ipod)/.exec(ua) || /(windows phone)/.exec(ua) || /(iphone)/.exec(ua) || /(kindle)/.exec(ua) || /(silk)/.exec(ua) || /(android)/.exec(ua) || /(win)/.exec(ua) || /(mac)/.exec(ua) || /(linux)/.exec(ua) || /(cros)/.exec(ua) || /(playbook)/.exec(ua) || /(bb)/.exec(ua) || /(blackberry)/.exec(ua) || [];

			var browser = {},
			    matched = {
				browser: match[5] || match[3] || match[1] || "",
				version: match[2] || match[4] || "0",
				versionNumber: match[4] || match[2] || "0",
				platform: platform_match[0] || ""
			};

			if (matched.browser) {
				browser[matched.browser] = true;
				browser.version = matched.version;
				browser.versionNumber = parseInt(matched.versionNumber, 10);
			}

			if (matched.platform) {
				browser[matched.platform] = true;
			}

			// These are all considered mobile platforms, meaning they run a mobile browser
			if (browser.android || browser.bb || browser.blackberry || browser.ipad || browser.iphone || browser.ipod || browser.kindle || browser.playbook || browser.silk || browser["windows phone"]) {
				browser.mobile = true;
			}

			// These are all considered desktop platforms, meaning they run a desktop browser
			if (browser.cros || browser.mac || browser.linux || browser.win) {
				browser.desktop = true;
			}

			// Chrome, Opera 15+ and Safari are webkit based browsers
			if (browser.chrome || browser.opr || browser.safari) {
				browser.webkit = true;
			}

			// IE11 has a new token so we will assign it msie to avoid breaking changes
			if (browser.rv || browser.iemobile) {
				var ie = "msie";

				matched.browser = ie;
				browser[ie] = true;
			}

			// Edge is officially known as Microsoft Edge, so rewrite the key to match
			if (browser.edge) {
				delete browser.edge;
				var msedge = "msedge";

				matched.browser = msedge;
				browser[msedge] = true;
			}

			// Blackberry browsers are marked as Safari on BlackBerry
			if (browser.safari && browser.blackberry) {
				var blackberry = "blackberry";

				matched.browser = blackberry;
				browser[blackberry] = true;
			}

			// Playbook browsers are marked as Safari on Playbook
			if (browser.safari && browser.playbook) {
				var playbook = "playbook";

				matched.browser = playbook;
				browser[playbook] = true;
			}

			// BB10 is a newer OS version of BlackBerry
			if (browser.bb) {
				var bb = "blackberry";

				matched.browser = bb;
				browser[bb] = true;
			}

			// Opera 15+ are identified as opr
			if (browser.opr) {
				var opera = "opera";

				matched.browser = opera;
				browser[opera] = true;
			}

			// Stock Android browsers are marked as Safari on Android.
			if (browser.safari && browser.android) {
				var android = "android";

				matched.browser = android;
				browser[android] = true;
			}

			// Kindle browsers are marked as Safari on Kindle
			if (browser.safari && browser.kindle) {
				var kindle = "kindle";

				matched.browser = kindle;
				browser[kindle] = true;
			}

			// Kindle Silk browsers are marked as Safari on Kindle
			if (browser.safari && browser.silk) {
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
		window.jQBrowser = uaMatch(window.navigator.userAgent);
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

(function (window, $, deparam) {
	var $pt = window.$pt;
	if ($pt == null) {
		$pt = {};
		window.$pt = $pt;
	}

	$pt.AjaxConstants = {
		ContentType: {
			POST: "application/json; charset=UTF-8",
			GET: "application/json; charset=UTF-8",
			DELETE: "application/json; charset=UTF-8",
			PUT: "application/json; charset=UTF-8"
		},
		Stringify: {
			POST: true,
			GET: false,
			DELETE: false,
			PUT: true
		}
	};

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
		if (quiet === true) {} else {
			$pt.Components.NOnRequestModal.getOnRequestModal().show();
		}
		var hideOnRequest = function () {
			if (quiet === true) {} else {
				$pt.Components.NOnRequestModal.getOnRequestModal().hide();
			}
		};

		return $.ajax(url, options).done(function (data, textStatus, jqXHR) {
			if (done !== undefined && done !== null) {
				try {
					done(data, textStatus, jqXHR);
				} catch (err) {
					console.error(err);
					console.error(data);
					console.error(textStatus);
					console.error(jqXHR);
					var message = 'Unknown error occurred, see console for more information.';
					message = err ? err.stack ? err.stack : err.toString ? err.toString() : message : message;
					$pt.Components.NExceptionModal.getExceptionModal().show('Javascript Error', message);
				}
			}
		}).fail(function (jqXHR, textStatus, errorThrown) {
			if (fail !== undefined && fail !== null) {
				var callback = null;
				if (typeof fail === 'function') {
					callback = fail;
				} else {
					callback = fail["" + jqXHR.status];
				}
				if (callback != null) {
					try {
						callback(jqXHR, textStatus, errorThrown);
					} catch (err) {
						console.error(err);
						console.error(data);
						console.error(textStatus);
						console.error(jqXHR);
						var message = 'Unknown error occurred, see console for more information.';
						message = err ? err.stack ? err.stack : err.toString ? err.toString() : message : message;
						$pt.Components.NExceptionModal.getExceptionModal().show('Javascript Error', message);
					}
				} else {
					$pt.Components.NExceptionModal.getExceptionModal().show("" + jqXHR.status, jqXHR.responseText);
				}
			} else {
				$pt.Components.NExceptionModal.getExceptionModal().show("" + jqXHR.status, jqXHR.responseText);
			}
		}).always(function () {
			// hide
			hideOnRequest();
		});
	};

	var needStringify = function (predefine, specific) {
		if (specific === true) {
			return true;
		} else if (specific === false) {
			return false;
		} else if (predefine === true) {
			return true;
		} else {
			return false;
		}
	};
	/**
  * http post
  * @param url {string}
  * @param data {*}
  * @param settings {*} optional jquery ajax settings
  * @returns {jqXHR}
  */
	$pt.internalDoPost = $pt.doPost = function (url, data, settings) {
		settings = settings ? settings : {};
		if (needStringify($pt.AjaxConstants.Stringify.POST, settings.stringify)) {
			data = typeof data === 'string' ? data : JSON.stringify(data);
		}
		return submit($.extend({
			method: "POST",
			dataType: "json",
			contentType: $pt.AjaxConstants.ContentType.POST
		}, settings, {
			url: url,
			// always send string to server side
			data: data
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
		settings = settings ? settings : {};
		if (needStringify($pt.AjaxConstants.Stringify.PUT, settings.stringify)) {
			data = typeof data === 'string' ? data : JSON.stringify(data);
		}
		return submit($.extend({
			method: "PUT",
			dataType: "json",
			contentType: $pt.AjaxConstants.ContentType.PUT
		}, settings, {
			url: url,
			data: data
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
		settings = settings ? settings : {};
		if (needStringify($pt.AjaxConstants.Stringify.GET, settings.stringify)) {
			data = typeof data === 'string' ? data : JSON.stringify(data);
		}
		return submit($.extend({
			method: "GET",
			dataType: "json",
			contentType: $pt.AjaxConstants.ContentType.GET
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
		settings = settings ? settings : {};
		if (needStringify($pt.AjaxConstants.Stringify.DELETE, settings.stringify)) {
			data = typeof data === 'string' ? data : JSON.stringify(data);
		}
		return submit($.extend({
			method: "DELETE",
			dataType: "json",
			contentType: $pt.AjaxConstants.ContentType.DELETE
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
			window.console.warn('URL[' + key + '=' + routes.urls[key] + '] was replaced by [' + routes.context + urlRelateToWebContext + ']');
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
		return url == null ? null : routes.context + url;
	};
})(window, jQuery, jQuery.deparam);

(function (window, $, jsface) {
	var $pt = window.$pt;
	if ($pt == null) {
		$pt = {};
		window.$pt = $pt;
	}

	/**
  * code table sorter
  * @type {class}
  */
	var CodeTableSorter = jsface.Class({
		constructor: function (otherId) {
			this._otherId = otherId;
		},
		/**
   * sort code table element array
   * @param codes
   */
		sort: function (codes) {
			var _this = this;
			codes.sort(function (a, b) {
				if (_this._otherId) {
					if (a.id == _this._otherId) {
						return 1;
					} else if (b.id == _this._otherId) {
						return -1;
					}
				}
				return a.text < b.text ? -1 : a.text > b.text ? 1 : 0;
			});
		}
	});

	/**
  * code table
  * @type {class}
  */
	var CodeTable = jsface.Class({
		/**
   * construct code table
   * @param data {{id:string, text:string}[]|{url:string, data:*}}
   *          array of json object, eg: {id:"1", text:"text"}.
   *          id is required,
   *          text is optional when renderer is defined.
   * @param renderer {function} optional
   *          param: element of code table,
   *          returns: string, put as text property into code table element
   * @param sorter {CodeTableSorter} optional
   */
		constructor: function (data, renderer, sorter) {
			if (data == null || Array.isArray(data)) {
				// construct with array, local data
				this._local = true;
				this._initArray = data;
			} else {
				// construct with json, remote data
				this._local = false;
				this._url = data.url;
				this._postData = data.data;
				this._sendProxy = data.proxy;
				this._receiveProxy = data.receiver;
			}
			this._renderer = renderer;
			this._sorter = sorter;
		},
		isInitialized: function () {
			return this._initialized === true;
		},
		isRemote: function () {
			return this._local === false;
		},
		isRemoteButNotInitialized: function () {
			return this.isRemote() && !this.isInitialized();
		},
		initializeRemote: function () {
			if (this.isRemoteButNotInitialized()) {
				// return a promise to load remote codes
				// since there might be more than one components using the same codetable
				// log the first loading promise and returns to all others
				if (!this._loading) {
					this._loading = this.__loadRemoteCodes(true).always(function () {
						delete this._loading;
						this._allLoaded = true;
					}.bind(this));
				}
				return this._loading;
			} else {
				// already initialized, or is local
				// return an immediately resolved promise
				return $.Deferred(function (deferred) {
					deferred.resolve();
				}).promise();
			}
		},
		setAsRemoteInitialized: function () {
			this._codes = this._codes ? this._codes : [];
			this._map = this._map ? this._map : {};
			this._initialized = true;
			return this;
		},
		/**
   * get renderer of code table
   */
		getRenderer: function () {
			return this._renderer;
		},
		/**
   * initialize code table element array
   * @param codeTableArray {{id:string, text:string}[]}
   *          array of json object, eg: {id:"1", text:"text"}.
   *          id is required,
   *          text is optional when renderer is defined.
   * @param renderer {function} optional
   *          param: element of code table,
   *          returns: string, put as text property into code table element
   * @param sorter {CodeTableSorter} optional
   * @private
   */
		__initCodesArray: function (codeTableArray, renderer, sorter) {
			this._codes = codeTableArray;
			if (this._codes == null) {
				this._codes = [];
			}
			var map = {};
			// render element
			var render = function (code) {
				if (renderer) {
					code.text = renderer(code);
					if (code.children) {
						code.children.forEach(render);
					}
				}
			};
			this._codes.forEach(function (code) {
				map[code.id] = code;
				render(code);
			});
			this._map = map;
			// sort elements
			if (sorter) {
				var sort = function (codes) {
					sorter.sort(codes);
					codes.forEach(function (code) {
						if (code.children) {
							sort(code.children);
						}
					});
				};
				sort(this._codes);
			}
			return this;
		},
		/**
   * load remote code table, quiet and synchronized
   * @private
   */
		__loadRemoteCodes: function (async) {
			var _this = this;
			var remoteProxy = this.__getSendProxy();
			var remoteVisit = remoteProxy ? remoteProxy.call(this, {
				url: this._url,
				data: this._postData,
				quiet: true,
				async: async != null ? async : false
			}) : $pt.doPost(this._url, this._postData, {
				quiet: true,
				async: async != null ? async : false
			});
			return remoteVisit.done(function (data) {
				var receiveData = data;
				var receiverProxy = _this.__getReceiveProxy();
				if (receiverProxy) {
					receiveData = receiverProxy.call(_this, receiveData);
				}
				// init code table element array after get data from remote
				_this.__initCodesArray(receiveData, _this._renderer, _this._sorter);
			}).fail(function (jqXHR, textStatus, errorThrown) {
				// error to console, quiet backend
				_this.__initCodesArray(null, _this._renderer, _this._sorter);
				window.console.error('Status:' + textStatus + ', error:' + errorThrown);
			}).always(function () {
				_this._initialized = true;
			});
		},
		__getSendProxy: function () {
			return this._sendProxy || $pt.ComponentConstants.CODETABLE_SENDER_PROXY || $pt.ComponentConstants.CODETABLE_REMOTE_PROXY;
		},
		__getReceiveProxy: function () {
			return this._receiveProxy || $pt.ComponentConstants.CODETABLE_RECEIVER_PROXY;
		},
		/**
   * get code table element array
   * @returns {{id: string, text: string}[]}
   * @private
   */
		__getCodes: function () {
			if (this._codes === undefined || this._initialized !== true) {
				if (this._local) {
					// initialize local data
					this.__initCodesArray(this._initArray, this._renderer, this._sorter);
					// delete the reference
					delete this._initArray;
					this._initialized = true;
				} else {
					// initialize remote data
					this.__loadRemoteCodes();
				}
			}
			return this._codes;
		},
		/**
   * get code table element map, key is id of element, value is element
   * @returns {*}
   * @private
   */
		__getMap: function () {
			this.__getCodes();
			return this._map;
		},
		/**
   * filter code table elements by given function or json object.
   * when parameter is a json object and data is from remote, check the given value was loaded or not,
   * if not loaded, loaded the code table elements by given parameter first and merge into the client elements.
   * @param func {function|{value:string, name:string}}
   *      function: same as function definition Array.filter()
   *      json:
   *          value: value to filter code table elements
   *          name: property name to match the given value
   *          eg. code table element is
   *              {id: '1', text: 'Text', parentId: '1'}
   *              {id: '2', text: 'Text', parentId: '1'}
   *              {id: '3', text: 'Text', parentId: '2'}
   *              when the json object is {value: '1', name: 'parentId'},
   *              then the first and second items returned, third item filtered
   * @returns {{id: string, text: string}[]} maybe contain other properties, depends on initial data.
   *      return empty array when no data
   */
		filter: function (func) {
			if (typeof func === 'function') {
				// parameter is function
				return this.__getCodes().filter(func);
			} else {
				var value = func.value;
				this.__loadRemoteCodeSegment(value);
				// filter
				return this.__getCodes().filter(function (code) {
					this.__setParentValueAsLoaded(code[func.name]);
					return code[func.name] == value;
				}.bind(this));
			}
		},
		isSegmentLoaded: function (parentValue) {
			return !this.__needLoadFromRemote(parentValue);
		},
		loadRemoteCodeSegment: function (parentValue) {
			if (this.__needLoadFromRemote(parentValue)) {
				// no local data, and loaded keys don't contain current value
				// reset post data
				this.__rebuildPostData(parentValue);
				// store current local data
				var existedData = this.__holdExistedCodes();
				// get data from server
				return this.__loadRemoteCodes(true).done(function () {
					this.__setParentValueAsLoaded(parentValue);
				}.bind(this)).always(function () {
					this.__mergeAll(existedData);
				}.bind(this));
			} else {
				// local or already loaded
				// return an immediately resolved promise
				return $.Deferred(function (deferred) {
					deferred.resolve();
				}).promise();
			}
		},
		__needLoadFromRemote: function (parentValue) {
			return !this._local && !this._allLoaded && (!this._loadedKeys || this._loadedKeys[parentValue + ''] !== true);
		},
		__rebuildPostData: function (parentValue) {
			var values = {};
			values[this.parentValueKey()] = parentValue;
			if (this._postData) {
				this._postData = $.extend({}, this._postData, values);
			} else {
				this._postData = values;
			}
			return this;
		},
		__holdExistedCodes: function () {
			return {
				codes: this._codes != null ? this._codes : [],
				map: this._map != null ? this._map : {}
			};
		},
		__mergeAll: function (existedData) {
			// merge server data and local data
			this._codes.push.apply(this._codes, existedData.codes);
			this._map = $.extend(existedData.map, this._map);
			return this;
		},
		__setParentValueAsLoaded: function (parentValue) {
			// init loaded keys
			if (!this._loadedKeys) {
				// this._loadedKeys = [];
				this._loadedKeys = {};
			}
			// log the loaded keys
			// this._loadedKeys.push(parentValue);
			this._loadedKeys[parentValue + ''] = true;
			return this;
		},
		__loadRemoteCodeSegment: function (parentValue) {
			if (this.__needLoadFromRemote(parentValue)) {
				// no local data, and loaded keys don't contain current value
				// reset post data
				this.__rebuildPostData(parentValue);
				// store current local data
				var existedData = this.__holdExistedCodes();
				// get data from server
				this.__loadRemoteCodes();
				this.__setParentValueAsLoaded(parentValue);
				this.__mergeAll(existedData);
			}
			return this;
		},
		/**
   * get element by given code
   * @param code {string} code
   * @returns {{id:string, text:string}} maybe contain other properties, depends on initial data.
   *          return null when not found
   */
		get: function (code) {
			var item = this.__getMap()[code];
			return item == null ? null : item;
		},
		/**
   * get element text by given code
   * @param code {string} code
   * @returns {string} element text, return null when not found
   */
		getText: function (code) {
			var item = this.get(code);
			return item == null ? null : item.text;
		},
		/**
   * get code table element array
   * @returns {{id: string, text: string}[]} maybe contain other properties, depends on initial data.
   *      return empty array when no data
   */
		list: function () {
			return this.__getCodes();
		},
		/**
   * get code table element array, with hierarchy keys.
   * no duplicate id allowed when call this method.
   * @returns {{codeId: codeItem}};
   */
		listAllChildren: function () {
			var items = {};
			var fetchItem = function (item) {
				items[item.id] = item;
				if (item.children) {
					item.children.forEach(function (child) {
						fetchItem(child);
					});
				}
			};
			this.list().forEach(function (item) {
				fetchItem(item);
			});
			return items;
		},
		/**
   * get code table element array, with hierarchy keys
   * @param {rootId: string, separtor: string}
   * @returns {{codeId: codeItem}};
   */
		listWithHierarchyKeys: function (options) {
			var separator = options && options.separator ? options.separator : '|';
			var rootId = options && options.rootId != null ? options.rootId : '0';
			var items = {};
			var fetchItem = function (item, parentId) {
				items[parentId + separator + item.id] = item;
				if (item.children) {
					item.children.forEach(function (child) {
						fetchItem(child, parentId + separator + item.id);
					});
				}
			};
			this.list().forEach(function (item) {
				fetchItem(item, rootId);
			});
			return items;
		},
		/**
   * check code table element by given function
   * @param func {function} same as function definition Array.some()
   * @returns {boolean}
   */
		some: function (func) {
			return this.__getCodes().some(func);
		},
		/**
   * run each code table element by given function
   * @param func {function} same as function definition Array.map()
   * @returns {[]} element of array depends on the parameter
   */
		map: function (func) {
			return this.__getCodes().map(func);
		},
		name: function (name) {
			if (name) {
				this.__name = name;
				return this;
			} else {
				return this.__name;
			}
		},
		parentValueKey: function (key) {
			if (key) {
				this.__parentValueKey = key;
				return this;
			} else {
				return this.__parentValueKey ? this.__parentValueKey : $pt.ComponentConstants.CODETABLE_PARENT_VALUE_KEY;
			}
		}
	});

	/**
  * create default code table sorter by given other id
  * @param otherId {string} optional. item with this id will be last one when given
  * @returns {CodeTableSorter}
  */
	$pt.createDefaultCodeTableSorter = function (otherId) {
		return new CodeTableSorter(otherId);
	};
	/**
  * construct code table
  * @param items {{id:string, text:string}[]|{url:string, data:*}}
  *          array of json object, eg: {id:"1", text:"text"}.
  *          id is required,
  *          text is optional when renderer is defined.
  * @param renderer {function} optional
  *          param: element of code table,
  *          returns: string, put as text property into code table element
  * @param sorter {CodeTableSorter} optional
  */
	$pt.createCodeTable = function (items, renderer, sorter) {
		return new CodeTable(items, renderer, sorter);
	};
	/**
  * extend code table
  * @param  {JSON} extendCodeTable extend class definition
  * @return {jsface.Class} extend code table class
  */
	$pt.extendCodeTable = function (extendCodeTable) {
		return jsface.Class(CodeTable, extendCodeTable);
	};
})(window, jQuery, jsface);

/**
 * depends on jquery, jsface
 * depends on parrot-pre-define
 */
(function (window, $, moment, jsface) {
	var $pt = window.$pt;
	if ($pt == null) {
		$pt = {};
		window.$pt = $pt;
	}

	$pt.BUILD_PROPERTY_VISITOR = true;
	$pt.PROPERTY_SEPARATOR = '_';

	/**
  * clone json object
  * @param jsonObject {{}}
  */
	$pt.cloneJSON = function (jsonObject) {
		return $.extend(true, {}, jsonObject);
	};

	$pt.mergeObject = function (params) {
		var deep = params.deep;
		var target = params.target ? params.target : {};
		var sources = Array.isArray(params.sources) ? params.sources : [params.sources];
		// console.log(target);
		// console.log(sources);

		var source,
		    propName,
		    sourceIndex = 0,
		    sourceCount = sources.length,
		    targetPropValue,
		    sourcePropValue,
		    sourcePropValueIsArray,
		    destPropValue;

		// Handle case when target is a string or something (possible in deep copy)
		if (typeof target !== "object" && !$.isFunction(target)) {
			target = {};
		}

		for (; sourceIndex < sourceCount; sourceIndex++) {
			// Only deal with non-null/undefined values
			if ((source = sources[sourceIndex]) != null) {
				// Extend the base object
				// console.log(source);
				for (propName in source) {
					// console.log(propName);
					targetPropValue = target[propName];
					sourcePropValue = source[propName];

					// Prevent never-ending loop
					if (target === sourcePropValue) {
						continue;
					}

					// Recurse if we're merging plain objects or arrays
					if (deep && sourcePropValue && ($.isPlainObject(sourcePropValue) || (sourcePropValueIsArray = $.isArray(sourcePropValue)))) {
						if (sourcePropValueIsArray) {
							sourcePropValueIsArray = false;
							// always create new array, change from jQuery
							destPropValue = [];
						} else {
							destPropValue = targetPropValue && $.isPlainObject(targetPropValue) ? targetPropValue : {};
						}

						// Never move original objects, clone them
						target[propName] = $pt.mergeObject({ deep: deep, target: destPropValue, sources: [sourcePropValue] });
						// Don't bring in undefined values
					} else if (sourcePropValue !== undefined) {
						target[propName] = sourcePropValue;
					}
				}
			}
		}
		// Return the modified object
		return target;
	};

	/**
  * get value from json object
  * @param jsonObject {{}}
  * @param id {string} key of property, can be linked by underline
  * @returns {*}
  */
	$pt.getValueFromJSON = function (jsonObject, id) {
		if (id.indexOf($pt.PROPERTY_SEPARATOR) != -1) {
			// hierarchy id
			var ids = id.split($pt.PROPERTY_SEPARATOR);
			var parent = jsonObject;
			var value = null;
			var values = ids.map(function (id) {
				if (parent == null) {
					return null;
				} else {
					value = parent[id];
					parent = value;
					return value;
				}
			});
			return values[values.length - 1];
		} else {
			return jsonObject[id];
		}
	};
	$pt.setValueIntoJSON = function (jsonObject, id, value) {
		if (id.indexOf($pt.PROPERTY_SEPARATOR) == -1) {
			jsonObject[id] = value;
		} else {
			var ids = id.split($pt.PROPERTY_SEPARATOR);
			var parent = jsonObject;
			for (var index = 0, count = ids.length - 1; index < count; index++) {
				if (parent[ids[index]] == null) {
					// new object
					parent[ids[index]] = {};
				}
				parent = parent[ids[index]];
			}
			parent[ids[ids.length - 1]] = value;
		}
		return $pt;
	};

	/**
  * table validation result
  * @type {class}
  */
	var TableValidationResult = jsface.Class({
		constructor: function () {
			this.__errors = {};
			this.__models = {};
			this.__startKeyIndex = 1;
		},
		/**
   * push error
   * @param model {{}} element of array
   * @param error {{}} error messages
   */
		push: function (model, error) {
			this.__errors[this.__startKeyIndex] = error;
			this.__models[this.__startKeyIndex] = model;
			this.__startKeyIndex++;
			return this;
		},
		/**
   * remove error
   * @param model {{}} element of array
   */
		remove: function (model) {
			var _this = this;
			Object.keys(this.__models).forEach(function (key) {
				var item = _this.__models[key];
				if (item == model) {
					delete _this.__models[key];
					delete _this.__errors[key];
				}
			});
			return this;
		},
		/**
   * has error
   * @returns {boolean}
   */
		hasError: function () {
			return Object.keys(this.__models).length !== 0;
		},
		/**
   * get error
   * @param model {{}} element of array
   * @returns {{}}
   */
		getError: function (model) {
			// var keys = Object.keys(this.__models);
			// for (var index = 0, count = keys.length; index < count; index++) {
			// 	var item = this.__models[keys[index]];
			// 	if (item == model) {
			// 		return this.__errors[keys[index]];
			// 	}
			// }
			// return null;
			var errors = Object.keys(this.__models).map(function (key) {
				return this.__models[key] == model ? this.__errors[key] : null;
			}.bind(this)).filter(function (error) {
				return error != null;
			});
			return errors.length === 0 ? null : errors[0];
		}
	});
	/**
  * create table validation result
  * @returns {TableValidationResult}
  */
	$pt.createTableValidationResult = function () {
		return new TableValidationResult();
	};

	$pt.defineMessage('validate.required', '"%1" is Required.');
	$pt.defineMessage('validate.length', 'Length of "%1" should be %2.');
	$pt.defineMessage('validate.length.max', 'Length of "%1" cannot be more than %2.');
	$pt.defineMessage('validate.length.min', 'Length of "%1" cannot be less than %2.');
	$pt.defineMessage('validate.size.max', 'Size of "%1" cannot be more than %2.');
	$pt.defineMessage('validate.size.min', 'Size of "%1" cannot be less than %2.');
	$pt.defineMessage('validate.date.before', 'Value of "%1" must be before than %2.');
	$pt.defineMessage('validate.date.after', 'Value of "%1" must be after than %2.');
	/**
  * validate rules
  * @type {class}
  */
	$pt.ValidateRules = {
		/**
   * check null or empty string
   * @param model model itself
   * @param value {*} property value
   * @param settings {{}}
   * @returns {string|boolean} return true when pass the validation
   */
		required: function (model, value, settings) {
			if (settings === false) {
				// close the required check
				return true;
			}
			if (value == null || (value + '').toString().isEmpty()) {
				return $pt.getMessage('validate.required');
			} else {
				return true;
			}
		},
		/**
   * length check
   * @param model model itself
   * @param value {string} property value
   * @param length {number}
   * @returns {string|boolean} return true when pass the validation
   */
		length: function (model, value, length) {
			if (value == null || (value + '').length == 0) {
				return true;
			} else if ((value + '').length != length) {
				return $pt.getMessage('validate.length').format(['%1', '' + length]);
			}
		},
		/**
   * max length check
   * @param model model itself
   * @param value {string} property value
   * @param length {number}
   * @returns {string|boolean} return true when pass the validation
   */
		maxlength: function (model, value, length) {
			if (value == null || (value + '').length == 0) {
				return true;
			} else if ((value + '').length > length) {
				return $pt.getMessage('validate.length.max').format(['%1', '' + length]);
			}
		},
		/**
   * min length check
   * @param model model itself
   * @param value {string} property value
   * @param length {number}
   * @returns {string|boolean} return true when pass the validation
   */
		minlength: function (model, value, length) {
			if (value == null || (value + '').length == 0) {
				return true;
			} else if ((value + '').length < length) {
				return $pt.getMessage('validate.length.min').format(['%1', '' + length]);
			}
		},
		/**
   * max size check
   * @param model model itself
   * @param value {{}[]} property value, should be an array
   * @param size {number}
   * @returns {string|boolean} return true when pass the validation
   */
		maxsize: function (model, value, size) {
			if (value == null || value.length == 0) {
				return true;
			} else if (value.length > size) {
				return $pt.getMessage('validate.size.max').format(['%1', '' + size]);
			}
		},
		/**
   * min size check
   * @param model model itself
   * @param value {{}[]} property value, should be an array
   * @param size {number}
   * @returns {string|boolean} return true when pass the validation
   */
		minsize: function (model, value, size) {
			if (value == null || value.length < size) {
				return $pt.getMessage('validate.size.min').format(['%1', '' + size]);
			} else {
				return true;
			}
		},
		/**
   * before special date check
   * @param model model itself
   * @param value {momentjs} date
   * @param settings {{}} check rules
   * @returns {string[]|string|boolean}
   */
		before: function (model, value, settings) {
			return $pt.ValidateRules.__dateCompare(value, model, settings, $pt.ValidateRules.__beforeSpecial);
		},
		/**
   * before or equals special date
   * @param momentValue {momentjs} datetime momentjs
   * @param model {{}} model itself
   * @param check {{}}
   * @param format {string} datetime format, momentjs
   * @param label {string} label in error message
   * @returns {string|string[]|boolean}
   * @private
   */
		__beforeSpecial: function (momentValue, model, check, format, label) {
			var compareValue = $pt.ValidateRules.__convertToMomentValue(check, model, format);
			if (compareValue !== null) {
				if (momentValue.unix() > compareValue.unix()) {
					if (typeof check === "string") {
						return $pt.getMessage('validate.date.before').format(['%1', label ? label : check]);
					}
					return $pt.getMessage('validate.date.before').format(['%1', compareValue.format(format)]);
				}
			}
			return true;
		},
		after: function (model, value, settings) {
			return $pt.ValidateRules.__dateCompare(value, model, settings, $pt.ValidateRules.__afterSpecial);
		},
		/**
   * after or equals special date
   * @param momentValue {momentjs} datetime momentjs
   * @param model {{}} model itself
   * @param check {{}}
   * @param format {string} datetime format, momentjs
   * @param label {string} label in error message
   * @returns {string|string[]|boolean}
   * @private
   */
		__afterSpecial: function (momentValue, model, check, format, label) {
			var compareValue = $pt.ValidateRules.__convertToMomentValue(check, model, format);
			if (compareValue !== null) {
				if (momentValue.unix() < compareValue.unix()) {
					if (typeof check === "string") {
						return $pt.getMessage('validate.date.after').format(['%1', label ? label : check]);
					}
					return $pt.getMessage('validate.date.after').format(['%1', compareValue.format(format)]);
				}
			}
			return true;
		},
		/**
   * convert value to momentjs object
   * @param value {string|momentjs|function}
   * @param model {{}} model itself
   * @param format {string} datetime format, momentjs
   * @returns {momentjs}
   * @private
   */
		__convertToMomentValue: function (value, model, format) {
			var compareValue = null;
			if (value === "now") {
				compareValue = moment();
			} else if (value.unix !== undefined) {
				// value is a moment value
				compareValue = value;
			} else if (typeof value === "function") {
				compareValue = value();
			} else if (model.get(value) !== undefined) {
				// value from another property
				if (model.get(value) !== null) {
					compareValue = moment(model.get(value), format);
				}
			} else {
				// plain date time string
				compareValue = moment(value, format);
			}
			return compareValue;
		},
		/**
   * compare data
   * @param value {momentjs} property value
   * @param model {{}} model itself
   * @param settings {{format: string, rule: string|function|momentjs, label:string}|string|function|momentjs}
   *      can be JSON object
   *          format: momentjs format
   *          rule: check rule, string or function or momentjs or array of three types.
   *                  can be 'now' if it is a string,
   *                  or be property id of model if it is a string.
   *          label: label in error message, optional.
   *              if rule is an array, and label declared, it must be an array which same length with rule property.
   *      can be string or function or momentjs or array of three types.
   *      if check rule is function, return a momentjs object
   * @param checkFunc {function}
   * @returns {string[]|string|boolean}
   * @private
   */
		__dateCompare: function (value, model, settings, checkFunc) {
			if (value == null) {
				return true;
			}
			var format = typeof settings.format === "string" ? settings.format : $pt.ComponentConstants.Default_Date_Format;
			var checks = settings.rule ? settings.rule : settings;
			var labels = settings.rule ? settings.label : null;
			var dateValue = moment(value, format);
			var results = [];
			if (Array.isArray(checks)) {
				for (var index = 0, count = checks.length; index < count; index++) {
					var check = checks[index];
					var label = labels ? labels[index] : null;
					results.push(checkFunc(dateValue, model, check, format, label));
				}
			} else {
				results.push(checkFunc(dateValue, model, checks, format, labels));
			}
			var messages = results.filter(function (result) {
				return result !== true;
			});
			return messages.length === 0 ? true : messages.length == 1 ? messages[0] : messages;
		},
		/**
   * table detail validate method
   * @param model {{}} model itself
   * @param value {{}[]} value of property, must be an array
   * @param config {{}} validate rules config
   * @returns {TableValidationResult|boolean}
   */
		table: function (model, value, config, phase) {
			if (value == null || value.length == 0) {
				// no data
				return true;
			}

			var results = $pt.createTableValidationResult();
			var validator = $pt.createModelValidator(config);
			value.forEach(function (item) {
				var itemModel = $pt.createModel(item, validator);
				itemModel.useBaseAsCurrent();
				itemModel.parent(model);
				if (phase) {
					itemModel.validateByPhase(phase);
				} else {
					itemModel.validate();
				}
				var error = itemModel.getError();
				if (Object.keys(error).length !== 0) {
					results.push(item, error);
				} else {
					results.remove(item);
				}
			});

			return results.hasError() ? results : true;
		}
	};

	/**
  * model validator
  * @type {class}
  */
	var ModelValidator = jsface.Class({
		constructor: function (validatorConfigs, rules) {
			if (Array.isArray(validatorConfigs)) {
				this.__validator = {};
				$.extend.apply($, [true, this.__validator].concat(validatorConfigs));
			} else {
				this.__validator = validatorConfigs;
			}
			this.__rules = rules;
			if (this.__rules === undefined) {
				this.__rules = $pt.ValidateRules;
			} else {
				this.__rules = $.extend(true, $pt.ValidateRules, rules);
			}
		},
		/**
   * get configuration
   * @param id {string} optional
   * @returns {*}
   */
		getConfig: function (id) {
			if (id) {
				return this.__validator[id];
			}
			return this.__validator;
		},
		/**
   * get rule
   * @param ruleName
   * @returns {*}
   */
		getRule: function (ruleName) {
			return this.__rules[ruleName];
		},
		/**
   * validate by phase
   * @param model {ModelInterface}
   * @param value {*}
   * @param ruleKey {string}
   * @param phase {string}
   * @param ruleBody {function|{_phase:string|string[], _when: function, rule: *}|{}[]}
   * @returns {*}
   * @private
   */
		_validateByPhase: function (model, value, ruleKey, phase, ruleBody, dataId) {
			var ret = null;
			if (typeof ruleBody === "function") {
				// a simple function, call it, gather the return value
				ret = ruleBody.call(this, model, value, phase, dataId);
			} else if (Array.isArray(ruleBody)) {
				// rule body is an array
				var _this = this;
				var result = ruleBody.map(function (body) {
					return _this._validateByPhase(model, value, ruleKey, phase, body, dataId);
				});
				var finalResult = [];
				result.forEach(function (item) {
					if (item == null) {
						return;
					}
					if (Array.isArray(item)) {
						// array of plain string
						item.forEach(function (i) {
							finalResult.push(i);
						});
					} else {
						// plain string
						finalResult.push(item);
					}
				});
				return finalResult;
			} else {
				var realRuleBody = ruleBody;
				var runRule = true;
				if (phase != null && ruleBody._phase) {
					realRuleBody = ruleBody.rule;
					// phase is null, run all phase, pass this block
					// no phase definition, pass this block
					if (Array.isArray(ruleBody._phase)) {
						var phaseMatched = ruleBody._phase.some(function (p) {
							return p == phase;
						});
						if (!phaseMatched) {
							runRule = false;
						}
					} else if (ruleBody._phase != phase) {
						runRule = false;
					}
				} else if (ruleBody._phase) {
					// no phase given, but there is phase on rule
					realRuleBody = ruleBody.rule;
				}
				// a simple json
				if (runRule && ruleBody._when) {
					realRuleBody = ruleBody.rule;
					var when = ruleBody._when.call(this, model);
					if (!when) {
						// only validate when '_when' returns true
						runRule = false;
					}
				}
				if (runRule) {
					if (typeof realRuleBody === 'function') {
						ret = realRuleBody.call(this, model, value, phase, dataId);
					} else {
						// console.log(model, value, realRuleBody);
						ret = this.getRule(ruleKey).call(this, model, value, realRuleBody, phase, dataId);
					}
				}
			}
			return ret;
		},
		/**
   * validate by phase
   * @param model
   * @param phase
   * @param id
   */
		validateByPhase: function (model, phase, id) {
			var _this = this;
			var result = null;
			if (id) {
				var config = this.getConfig(id);
				if (config == null) {
					// no rule defined
					return true;
				} else {
					result = Object.keys(config).map(function (rule) {
						var ruleBody = config[rule];
						var value = model.get(id);
						var ret = _this._validateByPhase(model, value, rule, phase, ruleBody, id);
						return ret != null && ret !== true ? ret : null;
					});
					var finalResult = [];
					result.forEach(function (item) {
						if (item == null) {
							return;
						}
						if (Array.isArray(item)) {
							// array of plain string
							item.forEach(function (i) {
								finalResult.push(i);
							});
						} else {
							// plain string
							finalResult.push(item);
						}
					});
					return finalResult.length === 0 ? true : finalResult;
				}
			} else {
				result = {};
				Object.keys(this.getConfig()).forEach(function (id) {
					var ret = _this.validateByPhase(model, phase, id);
					if (ret !== true) {
						result[id] = ret;
					}
				});
				return result;
			}
		},
		/**
   * validate
   * @param model
   * @param id
   * @returns {*}
   */
		validate: function (model, id) {
			// validate by phase, all phases
			return this.validateByPhase(model, null, id);
		},
		/**
   * check property is required or not
   * @param id
   * @param phase can be array or plain text
   */
		isRequired: function (id, phase) {
			var config = this.getConfig(id);
			if (config == null || config.required == null) {
				// no required declared
				return false;
			} else if (config.required === true) {
				// all phase required
				return true;
			} else if (phase == null) {
				// no phase appointed
				return false;
			} else {
				// phase appointed
				var phases = Array.isArray(phase) ? phase : [phase];
				var defines = Array.isArray(config.required) ? config.required : [config.required];
				// console.log(phases, defines);
				// return true when at least one definition which match the given phases and rule is true
				return phases.some(function (phase) {
					return defines.some(function (define) {
						var definedPhase = Array.isArray(define._phase) ? define._phase : [define._phase];
						return definedPhase.indexOf(phase) != -1 && define.rule === true;
					});
				});
			}
		}
	});

	/**
  * create model validator
  * @param config {{}|{}[]} validator configuration
  * @param rules {{}} rules
  * @returns {ModelValidator}
  */
	$pt.createModelValidator = function (config, rules) {
		return new ModelValidator(config, rules);
	};

	/**
  * model interface
  */
	var ModelInterface = {
		/**
   * constructor model class
   * @param model {*}
   * @param validator {ModelValidator}
   */
		constructor: function (model, validator) {
			this.__base = model;
			this.__model = $pt.mergeObject({ deep: true, sources: model });
			this.__validator = validator;
			this.__validateResults = {};
			this.__changed = false;
		},
		name: function (name) {
			if (name) {
				this.__name = name;
				return this;
			} else {
				return this.__name;
			}
		},
		/**
   * get/set parent model
   * @param parent {*} optional
   * @returns {*}
   */
		parent: function (parent) {
			if (parent !== undefined) {
				this.__parent = parent;
				return this;
			} else {
				return this.__parent;
			}
		},
		/**
   * check the model is changed or not
   * @returns {boolean}
   */
		isChanged: function () {
			return this.__changed;
		},
		/**
   * get original model
   * @returns {*}
   */
		getOriginalModel: function () {
			return this.__base;
		},
		/**
   * get current model
   * @returns {*}
   */
		getCurrentModel: function () {
			return this.__model;
		},
		/**
   * use base model as current model
   */
		useBaseAsCurrent: function () {
			this.__model = this.__base;
			return this;
		},
		/**
   * merge data into current model.
   * Attention: this is deep copy. if don't want do deep copy, use getCurrentModel, and merge manually.
   * @param newModel {{}}
   */
		mergeCurrentModel: function (newModel) {
			this.__model = $pt.mergeObject({ deep: true, target: this.__model, sources: newModel });
			return this;
		},
		/**
   * apply current data to base model.
   */
		applyCurrentToBase: function () {
			this.__base = $pt.mergeObject({ deep: true, target: {}, sources: this.__model });
			this.__changed = false;
			return this;
		},
		/**
   * get validator
   * @returns {ModelValidator}
   */
		getValidator: function () {
			return this.__validator;
		},
		setValidator: function (validator, clearError) {
			this.__validator = validator;
			if (clearError) {
				this.__validateResults = {};
			}
			return this;
		},
		/**
   * get value by given id
   * @param id {string} property id
   * @returns {*}
   */
		get: function (id) {
			return $pt.getValueFromJSON(this.__model, id);
		},
		/**
   * set value by given id and value
   * @param id {string} property id
   * @param value {*}
   */
		set: function (id, value) {
			var oldValue = this.get(id);
			if (typeof oldValue === typeof value && oldValue == value) {
				// value is same as old value
				return;
			}
			$pt.setValueIntoJSON(this.__model, id, value);
			this.__changed = true;
			this.fireEvent({
				model: this,
				id: id,
				old: oldValue,
				"new": value,
				time: "post",
				type: "change"
			});
			return this;
		},
		/**
   * add listener
   * @param id {string} id of property
   * @param time {string} post|pre
   * @param type {string} change|add|remove
   * @param listener {function} function with parameter event
   */
		addListener: function (id, time, type, listener) {
			if (!id) {
				// monitor all
				id = '--all';
			}
			if (id instanceof RegExp) {
				return this.__addRegExpListener(id, time, type, listener);
			} else {
				return this.__addListener(id, time, type, listener);
			}
		},
		__addRegExpListener: function (id, time, type, listener) {
			if (this.__regExpListeners === undefined) {
				this.__regExpListeners = {};
			}
			var key = time + "-" + type;
			var listeners = this.__regExpListeners[key];
			if (listeners === undefined) {
				listeners = [];
				this.__regExpListeners[key] = listeners;
			}
			var index = listeners.findIndex(function (item) {
				return item.listener === listener && item.regexp.toString() == id.toString();
			});
			if (index == -1) {
				listeners.push({
					regexp: id,
					listener: listener
				});
			}
			return this;
		},
		__addListener: function (id, time, type, listener) {
			if (this.__listeners === undefined) {
				this.__listeners = {};
			}
			var key = id + '-' + time + "-" + type;
			var listeners = this.__listeners[key];
			if (listeners === undefined) {
				listeners = [];
				this.__listeners[key] = listeners;
			}
			var index = listeners.findIndex(function (item) {
				return item === listener;
			});
			if (index == -1) {
				listeners.push(listener);
			}
			return this;
		},
		addPostChangeListener: function (id, listener) {
			return this.addListener(id, 'post', 'change', listener);
		},
		addPostAddListener: function (id, listener) {
			return this.addListener(id, 'post', 'add', listener);
		},
		addPostRemoveListener: function (id, listener) {
			return this.addListener(id, 'post', 'remove', listener);
		},
		addPostValidateListener: function (id, listener) {
			return this.addListener(id, 'post', 'validate', listener);
		},
		/**
   * remove listener
   * @param id {string} id of property
   * @param time {string} post|pre
   * @param type {string} change|add|remove
   * @param listener {function} function which added
   */
		removeListener: function (id, time, type, listener) {
			if (!id) {
				id = '--all';
			}
			if (id instanceof RegExp) {
				return this.__removeRegExpListener(id, time, type, listener);
			} else {
				return this.__removeListener(id, time, type, listener);
			}
		},
		__removeRegExpListener: function (id, time, type, listener) {
			if (this.__regExpListeners !== undefined) {
				var listeners = this.__regExpListeners[time + "-" + type];
				if (listeners != null) {
					var index = listeners.findIndex(function (item) {
						// 正则和监听器都相同
						return item.listener === listener && item.regexp.toString() == id.toString();
					});
					if (index != -1) {
						listeners.splice(index, 1);
					}
				}
			}
			return this;
		},
		__removeListener: function (id, time, type, listener) {
			if (this.__listeners !== undefined) {
				var listeners = this.__listeners[id + "-" + time + "-" + type];
				if (listeners != null) {
					// listeners is an array
					var index = listeners.findIndex(function (item) {
						return item === listener;
					});
					if (index != -1) {
						listeners.splice(index, 1);
					}
				}
			}
			return this;
		},
		removePostChangeListener: function (id, listener) {
			return this.removeListener(id, 'post', 'change', listener);
		},
		removePostAddListener: function (id, listener) {
			return this.removeListener(id, 'post', 'add', listener);
		},
		removePostRemoveListener: function (id, listener) {
			return this.removeListener(id, 'post', 'remove', listener);
		},
		removePostValidateListener: function (id, listener) {
			return this.removeListener(id, 'post', 'validate', listener);
		},
		/**
   * fire event
   * @param evt {{type:string, time:string, id:string}} and more properties depend on event type
   */
		fireEvent: function (evt) {
			// copy listeners array is very important.
			// since change will invoke validate by FormCell,
			// then validate will invoke forceUpdate,
			// then forceUpdate will invoke remove listener,
			// finally the original listeners are changed,
			// so maybe some listener will not be invoked.
			// this bug was found the relationship of 2 select2 component.
			var listenersCopy = [];

			// find listeners which defined on property
			var key = evt.id + "-" + evt.time + "-" + evt.type;
			var listeners = this.__listeners ? this.__listeners[key] : null;
			if (listeners != null && listeners.length != 0) {
				listenersCopy.push.apply(listenersCopy, listeners);
			}
			// find listeners which monitor all
			key = '--all-' + evt.time + "-" + evt.type;
			listeners = this.__listeners ? this.__listeners[key] : null;
			if (listeners != null && listeners.length != 0) {
				listenersCopy.push.apply(listenersCopy, listeners);
			}
			// find listeners which defined as regexp
			key = evt.time + '-' + evt.type;
			listeners = this.__regExpListeners ? this.__regExpListeners[key] : null;
			if (listeners != null && listeners.length != 0) {
				listeners.forEach(function (item) {
					if (evt.id.match(item.regexp)) {
						listenersCopy.push.apply(listenersCopy, [item.listener]);
					}
				});
			}

			var _this = this;
			listenersCopy.forEach(function (listener) {
				listener.call(_this, evt);
			});
			return this;
		},
		firePostChangeEvent: function (id, _old, _new) {
			return this.fireEvent({
				model: this,
				id: id,
				old: _old,
				"new": _new ? _new : this.get(id),
				time: "post",
				type: "change"
			});
		},
		firePostAddEvent: function (id, index) {
			var array = this.get(id);
			return this.fireEvent({
				model: this,
				id: id,
				array: array,
				index: index,
				old: null,
				"new": array[index],
				type: "add",
				time: "post"
			});
		},
		firePostRemoveEvent: function (id, _old, index) {
			return this.fireEvent({
				model: this,
				id: id,
				array: this.get(id),
				index: index,
				old: _old,
				"new": null,
				type: "remove",
				time: "post"
			});
		},
		firePostValidateEvent: function (id) {
			return this.fireEvent({
				model: this,
				id: id,
				time: 'post',
				type: 'validate'
			});
		},
		/**
   * reset model
   */
		reset: function () {
			this.__model = $pt.mergeObject({ deep: true, sources: this.__base }); //$pt.cloneJSON(this.__base);
			this.__validateResults = {};
			this.__changed = false;
			return this;
		},
		/**
   * clear validate results
   * @param id {string} property id
   */
		clearValidateResults: function (id) {
			if (id) {
				delete this.__validateResults[id];
			} else {
				this.__validateResults = {};
			}
			return this;
		},
		/**
   * validate by phase
   * @param phase
   * @param id
   */
		validateByPhase: function (phase, id) {
			var validator = this.getValidator();
			if (validator === undefined || validator === null) {
				// do nothing
				return this;
			}
			if (id) {
				var ret = validator.validateByPhase(this, phase, id);
				if (ret !== true) {
					this.__validateResults[id] = ret;
				} else {
					delete this.__validateResults[id];
				}
				this.__mergeErrorToParent().fireEvent({
					model: this,
					id: id,
					time: "post",
					type: "validate"
				});
			} else {
				this.__validateResults = validator.validateByPhase(this, phase);
				this.__mergeErrorToParent();
				var _this = this;
				Object.keys(this.__validateResults ? this.__validateResults : {}).forEach(function (id) {
					_this.fireEvent({
						model: _this,
						id: id,
						time: "post",
						type: "validate"
					});
				});
			}
			return this;
		},
		__mergeErrorToParent: function () {
			if (this.__parent == null) {
				return this;
			}
			var parentModel = this.__parent.getCurrentModel();
			Object.keys(parentModel).forEach(function (key) {
				var value = parentModel[key];
				if (value == this.__model) {
					// console.log('Regular Value');
					this.__parent.mergeError(this.hasError() ? this.getError() : null, key);
				} else if (Array.isArray(value)) {
					// console.log('Array Value');
					value.forEach(function (elm) {
						// console.log(elm, this.__model, elm == this.__model);
						if (elm == this.__model) {
							var errors = this.__parent.getError(key);
							var tableErrorIndex = errors ? errors.findIndex(function (error) {
								return typeof error != 'string';
							}) : -1;
							if (this.hasError()) {
								// has error
								var tableError = null;
								if (tableErrorIndex == -1) {
									tableError = $pt.createTableValidationResult();
									if (!errors) {
										errors = [];
									}
									errors.push(tableError);
								} else {
									tableError = errors[tableErrorIndex];
									tableError.remove(elm);
								}
								tableError.push(elm, this.__validateResults);
								this.__parent.mergeError(errors, key);
								// console.log(this.__parent.getError());
							} else {
								// no error
								if (tableErrorIndex != -1) {
									// remove the exists error
									errors[tableErrorIndex].remove(elm);
								}
							}
						}
					}.bind(this));
				}
			}.bind(this));
			this.__parent.__mergeErrorToParent();
			return this;
		},
		/**
   * validate value of give property id, or whole model if no parameter passed.
   * will fire post-validate event for each property after validation
   * @param id {string} property id
   */
		validate: function (id) {
			return this.validateByPhase(null, id);
		},
		/**
   * check the property is required or not
   * @param id {string} property id
   * @returns {boolean}
   */
		isRequired: function (id, phase) {
			var validator = this.getValidator();
			return validator != null && validator.isRequired(id, phase);
		},
		/**
   * get error of given id, or return all error when no parameter passed
   * @param id {string} property id
   * @returns {*}
   */
		getError: function (id) {
			if (id) {
				// property level
				return this.__validateResults[id];
			} else {
				return this.__validateResults;
			}
		},
		/**
   * check the model is has error or not, check property only when id appointed,
   * or check whole model when no parameter passed.
   * @returns {boolean}
   */
		hasError: function (id) {
			if (id) {
				// property level
				return this.__validateResults[id] != null;
			} else {
				return Object.keys(this.__validateResults).length != 0;
			}
		},
		mergeError: function (error, id) {
			if (id) {
				if (error) {
					this.__validateResults[id] = error;
				} else {
					delete this.__validateResults[id];
				}
			} else {
				this.__validateResults = error ? error : {};
			}
			return this;
		},
		/**
   * remove row from given id
   * @param id {string} property id
   * @param row {{}} row data
   */
		remove: function (id, row) {
			var data = this.get(id);
			if (data == null || data.length == 0) {
				return this;
			}
			var index = data.findIndex(function (item) {
				return item === row;
			});
			if (index != -1) {
				data.splice(index, 1);
				this.__changed = true;
				this.fireEvent({
					model: this,
					id: id,
					array: data, // after remove
					index: index,
					old: row,
					"new": null,
					type: "remove",
					time: "post"
				});
			}
			return this;
		},
		/**
   * add row into array by given id
   * @param id {string} property id
   * @param row {{}} row data
   */
		add: function (id, row, index) {
			var data = this.get(id);
			if (data == null) {
				data = [];
				// do not call #set, since #set will invoke event
				this.__model[id] = data;
			}
			var findIndex = data.findIndex(function (item) {
				return item === row;
			});
			if (findIndex == -1) {
				if (index == null) {
					data.push(row);
					index = data.length - 1;
				} else {
					if (index >= data.length) {
						index = data.length;
					}
					data.splice(index, 0, row);
				}
				this.__changed = true;
				this.fireEvent({
					model: this,
					id: id,
					array: data, // after add
					index: index,
					old: null,
					"new": row,
					type: "add",
					time: "post"
				});
			}
			return this;
		},
		/**
   * update new item instead of old item
   * @param id {string} property id
   * @param _old {{}} old row data
   * @param _new {{}} new row data
   */
		update: function (id, _old, _new) {
			var data = this.get(id);
			if (data == null) {
				return this;
			}
			var index = data.findIndex(function (item) {
				return item === _old;
			});
			if (index != -1) {
				data.splice(index, 1, _new);
				this.__changed = true;
				this.fireEvent({
					model: this,
					id: id,
					array: data, // after update
					index: index,
					old: _old,
					"new": _new,
					type: "change",
					time: "post"
				});
			}
			return this;
		}
	};

	/**
  * create model
  * @param jsonObjects {*|*[]}
  * @param validator {ModelValidator}
  */
	$pt.createModel = function (jsonObjects, validator) {
		// create model

		var inputModel = null;
		if (Array.isArray(jsonObjects)) {
			// merge all json objects into one
			inputModel = {};
			$.extend.apply($, [true, inputModel].concat(jsonObjects));
		} else {
			inputModel = jsonObjects == null ? {} : jsonObjects;
		}

		var model = {};

		if ($pt.BUILD_PROPERTY_VISITOR) {
			// create getter and setter
			Object.keys(inputModel).forEach(function (key) {
				var name = key.upperFirst();
				model['get' + name] = function () {
					return this.get(key);
				};
				model['set' + name] = function (value) {
					this.set(key, value);
				};
			});
		}
		var ModelClass = jsface.Class($.extend(model, ModelInterface));
		return new ModelClass(inputModel, validator);
	};
})(window, jQuery, moment, jsface);

(function (window, $, jsface, React) {
	var $pt = window.$pt;
	if ($pt == null) {
		$pt = {};
		window.$pt = $pt;
	}

	/**
  * cell layout
  * @type {class}
  */
	var CellLayout = jsface.Class({
		$static: {
			DEFAULT_POSITION: {},
			DEFAULT_ROW: 9999,
			DEFAULT_COLUMN: 9999,
			DEFAULT_WIDTH: 3,

			DEFAULT_COMPONENT: {
				type: $pt.ComponentConstants.Text
			}
		},
		/**
   * construct cell layout
   * @param id {string} property id or fake id
   * @param cell {{label: string,
         *              dataId: string,
         *              comp:{
         *                  type: string|{type: string, label: boolean, popover: boolean}
         *                  relatedDataId: string|string[]
         *              },
         *              css:{
         *                  cell: string,
         *                  comp: string
         *              },
         *              pos:{row: number, col: number, width: number, section: string, card: string}
         *              }}
   */
		constructor: function (id, cell) {
			this.__id = id;

			// check if the cell definition is referenced by pre-definition
			if (cell.base) {
				if (Array.isArray(cell.base)) {
					cell = $pt.mergeObject({ deep: true, target: {}, sources: cell.base.concat(cell) });
				} else {
					cell = $pt.mergeObject({ deep: true, target: {}, sources: [cell.base, cell] });
				}
			}

			this.__dataId = cell.dataId ? cell.dataId : this.__id;
			this.__cell = cell;
		},
		unwrapValueWhenIsAFunc: function (value, forceWrap, delegate) {
			if (typeof value === 'function') {
				if (forceWrap || value.wrap === true) {
					return value.call(delegate ? delegate : this);
				} else {
					return value;
				}
			} else {
				return value;
			}
		},
		/**
   * get definition json
   * @returns {*}
   */
		getDefinition: function () {
			return this.__cell;
		},
		/**
   * get id
   * @returns {string}
   */
		getId: function () {
			return this.__id;
		},
		/**
   * get data id.
   * data id can be given by 'dataId' key
   * @returns {string}
   */
		getDataId: function () {
			return this.__dataId;
		},
		/**
   * get position
   * @returns {*}
   * @private
   */
		getPosition: function () {
			return this.__cell.pos ? this.__cell.pos : CellLayout.DEFAULT_POSITION;
		},
		/**
   * get row index
   * @returns {string}
   */
		getRowIndex: function () {
			var row = this.getPosition().row;
			return row == null ? CellLayout.DEFAULT_ROW : row;
		},
		/**
   * get column index
   * @returns {Array|string|boolean|*}
   */
		getColumnIndex: function () {
			var col = this.getPosition().col;
			return col == null ? CellLayout.DEFAULT_COLUMN : col;
		},
		/**
   * get width of cell, default is 3
   * @returns {number}
   */
		getWidth: function () {
			var width = this.getPosition().width;
			return width == null ? CellLayout.DEFAULT_WIDTH : width;
		},
		/**
   * get section
   * @returns {string}
   */
		getSection: function () {
			var section = this.getPosition().section;
			return section != null ? section : SectionLayout.DEFAULT_KEY;
		},
		/**
   * get card
   * @returns {string}
   */
		getCard: function () {
			var card = this.getPosition().card;
			return card != null ? card : CardLayout.DEFAULT_KEY;
		},
		/**
   * get component type
   * @returns {string}
   */
		getComponentType: function () {
			var type = this.getComponentOption("type");
			type = type == null ? $pt.ComponentConstants.TextInJSON : type;
			return typeof type === "string" ? { type: type, label: true, popover: true } : type;
		},
		/**
   * get component option by given key, return null when not defined
   * @param key optional, return all options if parameter not passed
   * @param defaultValue optional, only effective when key passed
   * @returns {*}
   */
		getComponentOption: function (key, defaultValue, delegate) {
			if (key) {
				// key passed
				// set default value as null if not passed
				if (defaultValue === undefined) {
					defaultValue = null;
				}
				if (this.__cell.comp) {
					// comp defined
					var option = this.__cell.comp[key];
					// not defined with given key, use default value instead
					option = this.unwrapValueWhenIsAFunc(option, false, delegate);
					return option === undefined ? defaultValue : option;
				} else {
					// comp not defined, use default value instead
					return defaultValue;
				}
			}

			// no parameter passed, return comp definition
			return !this.__cell.comp ? {} : this.__cell.comp;
		},
		/**
   * get label
   * @returns {string}
   */
		getLabel: function (delegate) {
			return this.unwrapValueWhenIsAFunc(this.__cell.label, true, delegate);
		},
		/**
   * get label CSS, if not defined, return original CSS
   * @param originalCSS optional
   * @returns {string}
   */
		getLabelCSS: function (originalCSS) {
			return this.getAdditionalCSS("label", originalCSS);
		},
		/**
   * get cell CSS, if not defined, return original CSS
   * @param originalCSS optional
   * @returns {string}
   */
		getCellCSS: function (originalCSS) {
			return this.getAdditionalCSS("cell", originalCSS);
		},
		/**
   * get component css, if not defined, return original CSS
   * @param originalCSS
   * @returns {string}
   */
		getComponentCSS: function (originalCSS) {
			return this.getAdditionalCSS('comp', originalCSS);
		},
		/**
   * is additional css defined
   * @param key optional
   * @returns {boolean}
   */
		isAdditionalCSSDefined: function (key) {
			if (key) {
				return this.__cell.css != null && this.__cell.css[key] != null;
			}
			return this.__cell.css != null;
		},
		/**
   * get additional css object, return {} when not defined
   * @param key optional, return string or empty string(not defined) when passed this parameter
   * @param originalCSS optional, combine with additional CSS if exists
   * @returns {*|string}
   */
		getAdditionalCSS: function (key, originalCSS) {
			if (key) {
				var additionalCSS = this.isAdditionalCSSDefined(key) ? this.__cell.css[key] : '';
				var cssList = additionalCSS ? additionalCSS.split(' ') : [];
				var css = {};
				cssList.forEach(function (cssClassName) {
					if (cssClassName && !cssClassName.isBlank()) {
						css[cssClassName.trim()] = true;
					}
				});

				if (originalCSS != null && !originalCSS.isBlank()) {
					css[originalCSS.trim()] = true;
				}
				return $pt.LayoutHelper.classSet(css);
			}
			return this.isAdditionalCSSDefined() ? this.__cell.css : {};
		},
		/**
   * get event monitor
   * @param key optional, return event function or null (not defined) when passed this parameter.
   * @returns {function|*}
   */
		getEventMonitor: function (key) {
			if (key) {
				if (this.__cell && this.__cell.evt) {
					var monitor = this.__cell.evt[key];
					if (monitor) {
						return monitor;
					} else {
						var name = Object.keys(this.__cell.evt).find(function (name) {
							return name.toLowerCase() === key.toLowerCase();
						});
						if (name) {
							return this.__cell.evt[name];
						}
					}
				} else {
					return null;
				}
			} else {
				return !this.__cell.evt ? {} : this.__cell.evt;
			}
		},
		/**
   * get validate phase
   */
		getValidationPhase: function () {
			if (this.__cell && this.__cell.validate) {
				return this.transformValidationPhase(this.__cell.validate);
			} else {
				return null;
			}
		},
		transformValidationPhase: function (phase) {
			if (phase == null || typeof phase === 'string' || typeof phase === 'function') {
				return phase;
			} else if (phase.phase) {
				// it must be a json object
				return this.transformValidationPhase(phase.phase);
			} else {
				// no phase defined
				return null;
			}
		},
		getValidationOption: function (key, defaultValue) {
			if (key === 'phase') {
				return this.getValidationPhase();
			} else {
				if (this.__cell && this.__cell.validate) {
					var define = this.__cell.validate;
					if (typeof define === 'string' || typeof define === 'function') {
						// only define the phase, see method transformValidationPhase
						return defaultValue;
					} else {
						// definition must be a JSON object, and returns the delay property
						return typeof define[key] === 'undefined' ? defaultValue : define[key];
					}
				} else {
					// no validate part defined
					return defaultValue;
				}
			}
		}
	});

	/**
  * create cell layout
  * @param id {string} property id
  * @param cell {{}} cell definition
  * @returns {CellLayout}
  */
	$pt.createCellLayout = function (id, cell) {
		return new CellLayout(id, cell);
	};

	/**
  * row layout
  * @type {class}
  */
	var RowLayout = jsface.Class({
		constructor: function (rowIndex) {
			this.__rowIndex = rowIndex;
		},
		/**
   * get row index
   * @returns {number}
   */
		getRowIndex: function () {
			return this.__rowIndex;
		},
		/**
   * add cell
   */
		addCell: function (cell) {
			if (this.__cells === undefined) {
				this.__cells = [];
			}
			var index = this.__cells.findIndex(function (element) {
				return element.getId() == cell.getId();
			});
			if (index == -1) {
				// not found, simply push into array
				this.__cells.push(cell);
			} else {
				// found, remove the original one, replace with new one
				this.__cells.splice(index, 1, cell);
			}
			this.__cells.sort(function (c1, c2) {
				return c1.getColumnIndex() - c2.getColumnIndex();
			});
			return this;
		},
		/**
   * get cells
   * @returns {[CellLayout]}
   */
		getCells: function () {
			return this.__cells;
		}
	});

	/**
  * create row layout
  * @param rowIndex {number} row index
  * @param cells {CellLayout|CellLayout[]} optional, cells of this row
  * @returns {class}
  */
	$pt.createRowLayout = function (rowIndex, cells) {
		var layout = new RowLayout(rowIndex);
		if (cells) {
			if (Array.isArray(cells)) {
				cells.forEach(function (cell) {
					layout.addCell(cell);
				});
			} else {
				layout.addCell(cells);
			}
		}
		return layout;
	};

	/**
  * section layout
  * @type {class}
  */
	var SectionLayout = jsface.Class({
		$static: {
			DEFAULT_KEY: '_defaultSection',
			DEFAULT_ROW_INDEX: 9999,
			DEFAULT_COLUMN_INDEX: 9999,
			DEFAULT_WIDTH: 12
		},
		/**
   * construct section layout.
   * @param section {{label:string,
         *                  collapsible: boolean,
         *                  expanded: boolean,
         *                  row: number,
         *                  col: number,
         *                  width: number,
         *                  layout: {}}}
   * @param key {string} id of section layout
   * @param parentCard {CardLayout} card where section located
   */
		constructor: function (section, key, parentCard) {
			// layout definition
			this.__layout = {};
			var _this = this;
			if (section == null) {
				section = {};
			}
			Object.keys(section).forEach(function (key) {
				if (key != 'layout') {
					_this.__layout[key] = section[key];
				}
			});
			this.__id = key;
			this.__parent = parentCard;
			// all cells map
			this.__all = {};

			this.__rows = {};

			var sectionLayouts = section.layout;
			if (sectionLayouts) {
				Object.keys(sectionLayouts).forEach(function (key) {
					if (sectionLayouts[key].getCellCSS) {
						// already be CellLayout
						_this.addCell(sectionLayouts[key]);
					} else {
						_this.addCell(new CellLayout(key, sectionLayouts[key]));
					}
				});
			}
		},
		hasCell: function () {
			return Object.keys(this.__all).length != 0;
		},
		/**
   * push cell into section.
   * auto create RowLayout
   * @param cell {CellLayout}
   */
		addCell: function (cell) {
			this.__all[cell.getId()] = cell;

			var rowIndex = cell.getRowIndex();
			var rowLayout = this.__rows[rowIndex];
			if (rowLayout === undefined) {
				// initialize row layout
				rowLayout = $pt.createRowLayout(rowIndex);
				this.__rows[rowIndex] = rowLayout;
			}
			rowLayout.addCell(cell);

			this.__sortRows();
			return this;
		},
		/**
   * sort rows in section
   * @private
   */
		__sortRows: function () {
			this.__rowsArray = [];
			var rowsArray = this.__rowsArray;
			var rows = this.__rows;
			Object.keys(rows).forEach(function (key) {
				rowsArray.push(rows[key]);
			});
			// sort
			rowsArray.sort(function (r1, r2) {
				return r1.getRowIndex() - r2.getRowIndex();
			});
		},
		/**
   * get row index of section, default 9999
   * @return {number}
   */
		getRowIndex: function () {
			if (this.__layout == null || this.__layout.row == null) {
				return SectionLayout.DEFAULT_ROW_INDEX;
			} else {
				return this.__layout.row;
			}
		},
		/**
   * get column index of section, default 9999
   * @return {number}
   */
		getColumnIndex: function () {
			if (this.__layout == null || this.__layout.col == null) {
				return SectionLayout.DEFAULT_COLUMN_INDEX;
			} else {
				return this.__layout.col;
			}
		},
		/**
   * get width of section, default 12
   * @return {number}
   */
		getWidth: function () {
			if (this.__layout == null || this.__layout.width == null) {
				return SectionLayout.DEFAULT_WIDTH;
			} else {
				return this.__layout.width;
			}
		},
		/**
   * get style of section
   * @returns {*}
   */
		getStyle: function () {
			if (this.__layout == null || this.__layout.style == null) {
				return 'default';
			} else {
				return this.__layout.style;
			}
		},
		getCSS: function () {
			if (this.__layout == null || this.__layout.css == null) {
				return null;
			} else {
				return this.__layout.css;
			}
		},
		/**
   * get label of section
   * @returns {*}
   */
		getLabel: function () {
			if (this.__layout == null || this.__layout.label == null) {
				return null;
			} else {
				return this.__layout.label;
			}
		},
		/**
   * check the section is collapsible or not
   * @returns {boolean}
   */
		isCollapsible: function () {
			if (this.__layout == null || this.__layout.collapsible == null) {
				return false;
			} else {
				return this.__layout.collapsible === true;
			}
		},
		getCollapsedLabel: function () {
			if (this.__layout == null || this.__layout.collapsedLabel == null) {
				return false;
			} else {
				return this.__layout.collapsedLabel;
			}
		},
		/**
   * check section is default expanded or not
   * @returns {boolean}
   */
		isExpanded: function () {
			if (this.__layout == null || this.__layout.expanded == null) {
				return true;
			} else {
				return this.__layout.expanded !== false;
			}
		},
		getExpandedLabel: function () {
			if (this.__layout == null || this.__layout.expandedLabel == null) {
				return null;
			} else {
				return this.__layout.expandedLabel;
			}
		},
		/**
   * get check box in title definition
   * @returns {{}}
   */
		hasCheckInTitle: function () {
			return this.__layout && this.__layout.checkInTitle != null;
		},
		getCheckInTitleValue: function (model) {
			var id = this.getCheckInTitleDataId();
			return id ? model.get(id) : null;
		},
		getCheckInTitleDataId: function () {
			if (!this.hasCheckInTitle()) {
				return null;
			}
			var checkInTitle = this.__layout.checkInTitle;
			return checkInTitle ? checkInTitle.data : null;
		},
		getCheckInTitleLabel: function () {
			if (!this.hasCheckInTitle()) {
				return null;
			}
			var checkInTitle = this.__layout.checkInTitle;
			return checkInTitle ? checkInTitle.label : null;
		},
		getCheckInTitleCollapsible: function () {
			if (!this.hasCheckInTitle()) {
				return null;
			}
			var checkInTitle = this.__layout.checkInTitle;
			return checkInTitle ? checkInTitle.collapsible : null;
		},
		getCheckInTitleOption: function () {
			if (!this.hasCheckInTitle()) {
				return null;
			}
			var options = $.extend({}, this.__layout.checkInTitle);
			delete options.collapsible;
			delete options.label;
			delete options.data;
			return options;
		},
		getVisible: function () {
			return this.__layout.visible;
		},
		/**
   * get id of section
   * @returns {string}
   */
		getId: function () {
			return this.__id;
		},
		/**
   * get all rows
   * @returns {RowLayout[]}
   */
		getRows: function () {
			return this.__rowsArray;
		},
		/**
   * get cell layout by given id
   * @param id {string} id of cell layout
   * @returns {CellLayout}
   */
		getCell: function (id) {
			return this.__all[id];
		},
		/**
   * get all cells
   * @returns {{}}
   */
		getCells: function () {
			return this.__all;
		},
		/**
   * get parent card
   * @returns {CardLayout}
   */
		getParentCard: function () {
			return this.__parent;
		}
	});

	/**
  * create section layout
  * @param settings
  * @param key
  * @param parentCard
  * @returns {SectionLayout}
  */
	$pt.createSectionLayout = function (settings, key, parentCard) {
		return new SectionLayout(settings, key, parentCard);
	};

	/**
  * card layout
  * @type {class}
  */
	var CardLayout = jsface.Class({
		$static: {
			DEFAULT_KEY: '_defaultCard',
			DEFAULT_CARD_INDEX: 9999
		},
		/**
   * construct card layout
   * @param card {{
         *              _sections: {},
         *              index: number,
         *              label: string,
         *              icon: string,
         *              badge: string,
         *              badgeRender: function,
         *              active: boolean,
         *              backable: boolean,
         *              finishButton: {}
         *              rightButtons: {}|{}[],
         *              leftButtons: {}|{}[]}}
   * @param key {string} id of card
   */
		constructor: function (card, key) {
			var _this = this;
			// layout definition
			this.__layout = $.extend({}, card);
			this.__id = key;

			// all cells map
			this.__all = {};
			// all sections
			this.__sections = {};
			if (this.__layout._sections) {
				Object.keys(this.__layout._sections).forEach(function (sectionKey) {
					var section = $pt.createSectionLayout(_this.__layout._sections[sectionKey], sectionKey, _this);
					if (section.hasCell()) {
						_this.__sections[sectionKey] = section;
						$.extend(_this.__all, section.getCells());
						_this.__sortSections();
					}
				});
			}
		},
		hasCell: function () {
			return Object.keys(this.__all).length != 0;
		},
		/**
   * push cell to card
   * @param cell {CellLayout}
   */
		addCell: function (cell) {
			this.__all[cell.getId()] = cell;

			// find section and push cell into section
			var sectionKey = cell.getSection();
			var sectionLayout = this.__sections[sectionKey];
			if (sectionLayout == null) {
				var sectionDefine = this.__layout._sections ? this.__layout._sections[sectionKey] : null;
				sectionLayout = $pt.createSectionLayout(sectionDefine, sectionKey, this);
				this.__sections[sectionKey] = sectionLayout;
			}
			sectionLayout.addCell(cell);

			this.__sortSections();
			return this;
		},
		/**
   * sort sections
   * @private
   */
		__sortSections: function () {
			this.__sectionsArray = [];
			var sectionsArray = this.__sectionsArray;
			var sections = this.__sections;
			Object.keys(sections).forEach(function (key) {
				sectionsArray.push(sections[key]);
			});
			// sort
			sectionsArray.sort(function (s1, s2) {
				var r1 = s1.getRowIndex();
				var r2 = s2.getRowIndex();
				if (r1 == r2) {
					return s1.getColumnIndex() - s2.getColumnIndex();
				} else {
					return r1 - r2;
				}
			});
		},
		/**
   * get card index
   * @returns {number}
   */
		getIndex: function () {
			if (this.__layout.index == null) {
				return CardLayout.DEFAULT_CARD_INDEX;
			} else {
				return this.__layout.index;
			}
		},
		/**
   * get label of card
   * @returns {string}
   */
		getLabel: function () {
			return this.__layout.label;
		},
		/**
   * get icon of card
   * @returns {string}
   */
		getIcon: function () {
			return this.__layout.icon;
		},
		/**
   * has badge icon or not
   * @returns {boolean}
   */
		hasBadge: function () {
			return this.__layout.badge != null;
		},
		/**
   * get badge icon dependency id
   * @returns {string}
   */
		getBadgeId: function () {
			return this.__layout.badge;
		},
		getBadgeRender: function () {
			return this.__layout.badgeRender;
		},
		/**
   * get id of card
   * @returns {*}
   */
		getId: function () {
			return this.__id;
		},
		/**
   * check card is default active or not
   * @returns {boolean}
   */
		isActive: function () {
			return this.__layout.active === true;
		},
		/**
   * set card to be active
   * @param active
   */
		setActive: function (active) {
			this.__layout.active = active;
			return this;
		},
		/**
   * check the card can be backable or not
   * @returns {boolean}
   */
		isBackable: function () {
			return this.__layout.backable !== false;
		},
		/**
   * get right buttons
   * @returns {{}|{}[]}
   */
		getRightButtons: function () {
			return this.__layout.rightButtons ? this.__layout.rightButtons : [];
		},
		/**
   * get left buttons
   * @returns {{}|{}[]}
   */
		getLeftButtons: function () {
			return this.__layout.leftButtons ? this.__layout.leftButtons : [];
		},
		/**
   * get finish button definition
   * @returns {{}}
   */
		getFinishButton: function () {
			return this.__layout.finishButton;
		},
		/**
   * get sections
   * @return {SectionLayout[]}
   */
		getSections: function () {
			return this.__sectionsArray;
		},
		/**
   * get all cells
   * @returns {{}}
   */
		getCells: function () {
			return this.__all;
		},
		/**
   * get cell by given cell id
   * @param cellId
   * @returns {CellLayout}
   */
		getCell: function (cellId) {
			return this.__all[cellId];
		}
	});

	/**
  * create card layout
  * @param card {{}}
  * @param key {string} id of card
  * @returns {CardLayout}
  */
	$pt.createCardLayout = function (card, key) {
		return new CardLayout(card, key);
	};

	/**
  * form layout
  * @type {class}
  */
	var FormLayout = jsface.Class({
		/**
   * constructor of FormLayout, accepts one or more json object
   * @param layouts {{_freeCard: boolean,
         *                 _cardButtonShown: boolean}|{}[]}
   */
		constructor: function (layouts) {
			// all cells map
			this.__all = {};

			var layout = this.__mergeLayouts(layouts);
			var cards = this.__createDefaultCard(layout);
			delete layout._cards;
			delete layout._freeCard;
			delete layout._cardButtonShown;
			delete layout._sections;

			var cardLayouts = this.__readCells(layout, cards, this.__all);
			this.__sortCards(cardLayouts);
		},
		/**
   * merge layouts to one
   * @param layouts {{}[]}
   * @return {{}}
   * @private
   */
		__mergeLayouts: function (layouts) {
			if (layouts.length == 1) {
				return $.extend(true, {}, layouts[0]);
			} else {
				return $.extend.apply($, [].concat(true, {}, layouts));
			}
		},
		/**
   * create default card and default section
   * @param layout {{}}
   * @return {{}}
   * @private
   */
		__createDefaultCard: function (layout) {
			var cards = layout._cards;
			this.__freeCard = layout._freeCard;
			this.__cardButtonShown = layout._cardButtonShown;
			if (cards == null) {
				cards = {};
				// create default card
				cards[CardLayout.DEFAULT_KEY] = { _sections: {} };
				// all sections in default card
				if (layout._sections == null) {
					// no section defined, create default
					cards[CardLayout.DEFAULT_KEY]._sections[SectionLayout.DEFAULT_KEY] = {};
				} else {
					// use defined
					cards[CardLayout.DEFAULT_KEY]._sections = layout._sections;
				}
			}
			return cards;
		},
		/**
   * read cells
   * @param layout {{}} layout definition
   * @param cards {{}} cards definition
   * @param all {{}} all cells
   * @returns {{}}
   * @private
   */
		__readCells: function (layout, cards, all) {
			// all cards
			var cardLayouts = {};
			// go through the cards definitions
			Object.keys(cards).forEach(function (key) {
				var card = new CardLayout(cards[key], key);
				if (card.hasCell()) {
					cardLayouts[key] = card;
					$.extend(all, card.getCells());
				}
			});
			// go through the cell definitions
			Object.keys(layout).forEach(function (key) {
				var cell = new CellLayout(key, layout[key]);
				all[cell.getId()] = cell;

				// find card and push cell into card
				var cardKey = cell.getCard();
				var cardLayout = cardLayouts[cardKey];
				if (cardLayout == null) {
					var cardDefine = cards[cardKey];
					cardLayout = new CardLayout(cardDefine, cardKey);
					cardLayouts[cardKey] = cardLayout;
				}
				cardLayout.addCell(cell);
			});
			return cardLayouts;
		},
		/**
   * sort cards
   * @param cards
   * @private
   */
		__sortCards: function (cards) {
			// sort cards
			this.__cardsArray = [];
			var cardsArray = this.__cardsArray;
			Object.keys(cards).forEach(function (key) {
				cardsArray.push(cards[key]);
			});
			this.__cardsArray.sort(function (c1, c2) {
				return c1.getIndex() - c2.getIndex();
			});
		},
		/**
   * get all cards
   * @returns {CardLayout[]}
   */
		getCards: function () {
			return this.__cardsArray;
		},
		/**
   * is free card or not
   * @returns {boolean}
   */
		isFreeCard: function () {
			return this.__freeCard === true;
		},
		/**
   * is card button shown or not
   * @returns {boolean}
   */
		isCardButtonShown: function () {
			return this.__cardButtonShown !== false;
		},
		/**
   * get cell layout by given id
   * @param id {string} id of cell
   * @returns {CellLayout}
   */
		getCell: function (id) {
			return this.__all[id];
		},
		/**
   * get all cells
   * @returns {{}}
   */
		getCells: function () {
			return this.__all;
		}
	});

	/**
  * create form layout
  * @param layouts {{}|{}[]}
  * @returns {FormLayout}
  */
	$pt.createFormLayout = function (layouts) {
		return new FormLayout(Array.prototype.slice.call(arguments));
	};

	/**
  * table column layout, an array like object
  * @type {class}
  */
	var TableColumnLayout = jsface.Class({
		/**
   *
   * @param columns {{
         *                  title: string,
         *                  width: number,
         *                  data: string,
         *                  codes: CodeTable,
         *                  render: function,
         *                  sort: boolean|string|function}[]}
   */
		constructor: function (columns) {
			this.__columns = columns.slice(0);
		},
		/**
   * get all columns
   * @returns {{}[]}
   */
		columns: function () {
			return this.__columns;
		},
		/**
   * get column definition of given column index
   * @param index {number}
   * @returns {{}}
   */
		get: function (index) {
			return this.__columns[index];
		},
		/**
   * push new column definition to columns
   * @param column {{}}
   */
		push: function (column) {
			this.__columns.push(column);
		},
		/**
   * splice, same as array
   * @param index {number}
   * @param removeCount {number} remove column count
   * @param newItem {{}} new column definition
   */
		splice: function (index, removeCount, newItem) {
			this.__columns.splice(index, removeCount, newItem);
		},
		/**
   * same as array
   * @param func {function} same as Array.map
   * @returns {[]}
   */
		map: function (func) {
			return this.__columns.map(func);
		},
		/**
   * same as array
   * @param func {function} same as Array.forEach
   */
		forEach: function (func) {
			this.__columns.forEach(func);
		},
		/**
   * get column count
   * @returns {number}
   */
		length: function () {
			return this.__columns.length;
		},
		/**
   * same as array
   * @param func {function} same as Array.some
   * @returns {boolean}
   */
		some: function (func) {
			return this.__columns.some(func);
		}
	});

	/**
  * create table column layout
  * @param columns {{}[]}
  * @returns {TableColumnLayout}
  */
	$pt.createTableColumnLayout = function (columns) {
		return new TableColumnLayout(columns);
	};

	// component
	/**
  * Component Base
  * @type {*}
  */
	var ComponentBase = {
		// react methods
		getInitialState: function () {
			return {};
		},
		executePointcutBefore: function (pointcut) {
			if (pointcut && pointcut.before) {
				pointcut.before.apply(this, Array.prototype.slice.call(arguments, 1));
			}
		},
		executePointcutAfter: function (pointcut) {
			if (pointcut && pointcut.after) {
				pointcut.after.apply(this, Array.prototype.slice.call(arguments, 1));
			}
		},
		installBaseMonitors: function () {
			this.executePointcutBefore.apply(this, arguments);
			// add post change listener to handle model change
			this.addPostChangeListener(this.onModelChanged);
			if (this.isArrayData && this.isArrayData()) {
				this.addPostAddListener(this.onModelChanged);
				this.addPostRemoveListener(this.onModelChanged);
			}
			this.addPostValidateListener(this.onModelValidateChanged);
			if (this.getDependencyOptions) {
				var options = this.getDependencyOptions();
				if (options) {
					this.addDependencyMonitor(this.getDependencies(options));
				}
			}
			this.addEnableDependencyMonitor();
			this.addVisibleDependencyMonitor();
			this.registerToComponentCentral();
			this.executePointcutAfter.apply(this, arguments);
		},
		uninstallBaseMonitors: function () {
			this.executePointcutBefore.apply(this, arguments);
			// remove post change listener to handle model change
			this.removePostChangeListener(this.onModelChanged);
			if (this.isArrayData && this.isArrayData()) {
				this.removePostAddListener(this.onModelChanged);
				this.removePostRemoveListener(this.onModelChanged);
			}
			this.removePostValidateListener(this.onModelValidateChanged);
			if (this.getDependencyOptions) {
				var options = this.getDependencyOptions();
				if (options) {
					this.removeDependencyMonitor(this.getDependencies(options));
				}
			}
			this.removeEnableDependencyMonitor();
			this.removeVisibleDependencyMonitor();
			this.unregisterFromComponentCentral();
			this.executePointcutAfter.apply(this, arguments);
		},
		componentWillUpdate: function (nextProps, nextState) {
			this.uninstallBaseMonitors({
				before: this.beforeWillUpdate,
				after: this.afterWillUpdate
			}, nextProps, nextState);
		},
		componentDidUpdate: function (prevProps, prevState) {
			this.installBaseMonitors({
				before: this.beforeDidUpdate,
				after: this.afterDidUpdate
			}, prevProps, prevState);
		},
		componentDidMount: function () {
			this.installBaseMonitors({
				before: this.beforeDidMount,
				after: this.afterDidMount
			});
		},
		componentWillUnmount: function () {
			this.uninstallBaseMonitors({
				before: this.beforeWillUnmount,
				after: this.afterWillUnmount
			});
		},
		onModelChanged: function () {
			this.forceUpdate();
		},
		onModelValidateChanged: function (evt) {
			this.forceUpdate();
		},

		// customized methods
		/**
   * get model
   * @returns {ModelInterface}
   */
		getModel: function () {
			if (this.useFormModel()) {
				return this.getFormModel();
			} else {
				return this.getInnerModel();
			}
		},
		/**
   * use form model when the component inner data model is given
   * @returns {boolean}
   */
		useFormModel: function () {
			return this.getComponentOption('useFormModel') === true;
		},
		/**
   * get form model
   * @returns {ModelInterface}
   */
		getFormModel: function () {
			return this.props.model;
		},
		/**
   * get inner data model, return form model if not defined
   * @returns {ModelInterface}
   */
		getInnerModel: function () {
			var model = this.getComponentOption('model');
			return model ? model : this.getFormModel();
		},
		/**
   * get value from model
   * @returns {*}
   */
		getValueFromModel: function () {
			return this.getModel().get(this.getDataId());
		},
		/**
   * set value to model
   * @param value
   */
		setValueToModel: function (value) {
			this.getModel().set(this.getDataId(), value);
		},
		/**
   * get layout
   * @returns {CellLayout}
   */
		getLayout: function () {
			return this.props.layout;
		},
		/**
   * component is view mode or not
   * first check "state.isViewMode"
   * second check "props.view"
   * last check the componen opion "view"
   * returns value of "state.isViewMode" has value.
   * otherwise returns true when one of "props.view" and component option "view" is true
   * @returns {boolean}
   */
		isViewMode: function () {
			var isViewMode = this.state ? this.state.isViewMode : null;
			if (isViewMode == null) {
				return this.props.view === true || this.getComponentOption('view') === true;
			} else {
				return isViewMode;
			}
		},
		setViewMode: function (isViewMode) {
			this.setState({ isViewMode: isViewMode });
		},
		/**
   * render in view mode. default render as a label.
   * @returns {XML}
   */
		renderInViewMode: function () {
			var externalViewModeRenderer = $pt.LayoutHelper.getComponentViewModeRenderer(this.getLayout().getComponentType());
			if (externalViewModeRenderer) {
				return externalViewModeRenderer.call(this, this.getModel(), this.getLayout(), this.props.direction, true);
			}

			var label = null;
			if (this.getTextInViewMode) {
				label = this.getTextInViewMode();
			} else {
				label = this.getValueFromModel();
			}
			var labelLayout = $pt.createCellLayout(this.getId(), $.extend(true, {}, {
				comp: this.getComponentOption(),
				// view css
				css: this.getAdditionalCSS('view')
				// pos, dataId, evt are all not necessary, since label will not use.
			}, {
				label: label,
				dataId: this.getDataId(),
				comp: {
					type: $pt.ComponentConstants.Label,
					textFromModel: false
				}
			}));
			var parameters = $pt.LayoutHelper.transformParameters(this.getModel(), labelLayout, this.props.direction, true);
			parameters.ref = 'viewLabel';
			return React.createElement($pt.Components.NLabel, parameters);
		},
		/**
   * get id of component
   * @returns {string}
   */
		getId: function () {
			return this.getLayout().getId();
		},
		/**
   * get data id of component
   * @returns {*}
   */
		getDataId: function () {
			return this.getLayout().getDataId();
		},
		/**
   * get component css
   * @param originalCSS original CSS
   * @returns {string}
   */
		getComponentCSS: function (originalCSS) {
			return this.getLayout().getComponentCSS(originalCSS);
		},
		/**
   * get combine css
   * @param originalCSS css class names
   * @param additionalKey key of additional css in layout
   * @returns {string}
   */
		getAdditionalCSS: function (additionalKey, originalCSS) {
			return this.getLayout().getAdditionalCSS(additionalKey, originalCSS);
		},
		/**
   * get option
   * @param key
   * @param defaultValue
   */
		getComponentOption: function (key, defaultValue) {
			// pass delegate to CellLayout#getComponentOption
			var option = this.getLayout().getComponentOption(key, defaultValue, this);
			if (option == null && this.props.defaultOptions != null) {
				option = this.props.defaultOptions[key];
			}
			return option === undefined ? null : option;
		},
		/**
   * get id of component central.
   */
		getComponentCentralId: function () {
			return this.getComponentOption('centralId');
		},
		/**
   * register to component central
   */
		registerToComponentCentral: function () {
			var id = this.getComponentCentralId();
			if (id) {
				$pt.LayoutHelper.registerComponent(id, this);
			}
		},
		/**
   * unregsiter from component central
   */
		unregisterFromComponentCentral: function () {
			var id = this.getComponentCentralId();
			if (id) {
				$pt.LayoutHelper.unregisterComponent(id, this);
			}
		},
		/**
   * get event monitor
   * @param key {string} event name, if not passed, return whole event definition
   * @returns {*}
   */
		getEventMonitor: function (key) {
			return this.getLayout().getEventMonitor(key);
		},
		notifyEvent: function (evt) {
			var type = evt.type;
			var monitor = this.getEventMonitor(type);
			if (monitor) {
				monitor.call(this, evt);
			}
		},
		/**
   * get component rule value.
   * get component option by given key. return default value if not defined.
   * otherwise call when function and return.
   * rule must be defined as {when: func, depends: props}
   * @param key
   * @param defaultValue
   * @returns {*}
   */
		getComponentRuleValue: function (key, defaultValue) {
			return this.getRuleValue(this.getComponentOption(key), defaultValue);
		},
		/**
   * get rule value. return default value if not defined.
   * otherwise call when function and return.
   * rule must be defined as {when: func, depends: props}
   * @param rule {{when: func, depends: props}}
   * @param defaultValue {*}
   * @param model {ModelInterface} given model, optional
   * @returns {*}
   */
		getRuleValue: function (rule, defaultValue, model) {
			if (rule === null) {
				return defaultValue;
			} else if (rule === true || rule === false) {
				return rule;
			} else {
				return rule.when.call(this, model ? model : this.getModel(), this.getValueFromModel());
			}
		},
		/**
   * get component rule dependencies.
   * rule must be defined as {when: func, depends: props}
   * @param key
   * @returns {[*]} always return an array, never return null or undefined.
   */
		getComponentRuleDependencies: function (key) {
			return this.getRuleDependencies(this.getComponentOption(key));
		},
		/**
   * get rule dependencies. rule must be defined as {when: func, depends: props}
   * @param dependencies {{when: func, depends: props}}
   * @returns {[*]} always return an array, never return null or undefined.
   */
		getRuleDependencies: function (dependencies) {
			if (dependencies === null || dependencies.depends === undefined || dependencies.depends === null) {
				return [];
			} else {
				if (Array.isArray(dependencies.depends)) {
					return dependencies.depends;
				} else {
					return [dependencies.depends];
				}
			}
		},
		/**
   * is enabled
   * @returns {boolean}
   */
		isEnabled: function () {
			if (this.isViewMode()) {
				// always enabled when in view mode
				return true;
			}
			return this.getComponentRuleValue("enabled", true);
		},
		/**
   * is visible
   * @returns {boolean}
   */
		isVisible: function () {
			var visible = $pt.isVisibleOnAuth(this);
			if (visible === false) {
				return false;
			}
			// when the component is not visible
			// or declared only view in edit mode
			// hide it
			visible = this.getComponentRuleValue("visible", true);
			if (visible) {
				var view = this.getComponentOption('view');
				if (this.isViewMode()) {
					visible = view == 'edit' != true;
				} else if (!this.isViewMode()) {
					visible = view == 'view' != true;
				}
			}
			return visible;
		},
		isMobile: function () {
			return $pt.browser.mobile === true;
		},
		isMobilePhone: function () {
			return this.isMobile() && $('body').width() < 768;
		},
		/**
   * is required
   * @returns {boolean}
   */
		isRequiredSignNeeded: function () {
			return this.getComponentRuleValue('required', false);
		},
		/**
   * get dependencies
   * @returns {Array|string}
   */
		getDependencies: function (attrs) {
			var dependencies = [];
			if (!Array.isArray(attrs)) {
				attrs = [attrs];
			}
			var _this = this;
			attrs.forEach(function (key) {
				dependencies.push.apply(dependencies, _this.getComponentRuleDependencies(key));
			});
			return dependencies;
		},
		// monitor
		addVisibleDependencyMonitor: function () {
			this.addDependencyMonitor(this.getDependencies("visible"));
		},
		addEnableDependencyMonitor: function () {
			this.addDependencyMonitor(this.getDependencies("enabled"));
		},
		removeVisibleDependencyMonitor: function () {
			this.removeDependencyMonitor(this.getDependencies("visible"));
		},
		removeEnableDependencyMonitor: function () {
			this.removeDependencyMonitor(this.getDependencies("enabled"));
		},
		addRequiredDependencyMonitor: function () {
			this.addDependencyMonitor(this.getDependencies('required'));
		},
		removeRequiredDependencyMonitor: function () {
			this.removeDependencyMonitor(this.getDependencies('required'));
		},
		addValidateDependencyMonitor: function () {
			this.addDependencyMonitor(this.getDependencies('validation'), this.validate);
		},
		removeValidateDependencyMonitor: function () {
			this.removeDependencyMonitor(this.getDependencies('validation'), this.validate);
		},
		/**
   * validate current cell by given phase
   */
		validate: function () {
			var phase = this.getLayout().getValidationPhase();
			if (typeof phase === 'function') {
				phase = phase.call(this, this.getModel(), this.getDataId());
			}
			if (phase) {
				// only validate the given phase
				this.getModel().validateByPhase(phase, this.getDataId());
			} else {
				// no phase defined, validate all
				this.getModel().validate(this.getDataId());
			}
		},
		getValidationOption: function (key, defaultValue) {
			return this.getLayout().getValidationOption(key, defaultValue);
		},
		/**
   * force update, call react API
   * @private
   */
		__forceUpdate: function () {
			this.forceUpdate();
		},
		/**
   * render normal bottom border
   * @returns {XML}
   */
		renderNormalLine: function () {
			var css = {
				disabled: !this.isEnabled()
			};
			css[this.getAdditionalCSS('normal-line', 'normal-line')] = true;
			return React.createElement("hr", { className: $pt.LayoutHelper.classSet(css), ref: "normalLine" });
		},
		/**
   * render focus bottom border
   * @returns {XML}
   */
		renderFocusLine: function () {
			return React.createElement("hr", { className: this.getAdditionalCSS('focus-line', 'focus-line'), ref: "focusLine" });
		},
		/**
   * add dependencies monitor
   * @param dependencies {[]}
   * @param monitor {function} optional
   * @param model {ModelInterface} monitored model, optional
   */
		addDependencyMonitor: function (dependencies, monitor, model) {
			monitor = monitor == null ? this.__forceUpdate : monitor;
			var _this = this;
			if (model) {
				dependencies.forEach(function (key) {
					model.addPostChangeListener(key, monitor);
				});
			} else {
				dependencies.forEach(function (key) {
					if (typeof key === 'object') {
						var id = key.id;
						if (key.on === 'form') {
							_this.getFormModel().addPostChangeListener(id, monitor);
						} else if (key.on === 'inner') {
							_this.getInnerModel().addPostChangeListener(id, monitor);
						} else {
							_this.getModel().addPostChangeListener(id, monitor);
						}
					} else {
						_this.getModel().addPostChangeListener(key, monitor);
					}
				});
			}
			return this;
		},
		/**
   * remove dependencies monitor
   * @param dependencies {[]}
   * @param monitor {function} optional
   * @param model {ModelInterface} monitored model, optional
   */
		removeDependencyMonitor: function (dependencies, monitor, model) {
			monitor = monitor == null ? this.__forceUpdate : monitor;
			var _this = this;
			if (model) {
				dependencies.forEach(function (key) {
					model.removePostChangeListener(key, monitor);
				});
			} else {
				dependencies.forEach(function (key) {
					if (typeof key === 'object') {
						var id = key.id;
						if (key.on === 'form') {
							_this.getFormModel().removePostChangeListener(id, monitor);
						} else if (key.on === 'inner') {
							_this.getInnerModel().removePostChangeListener(id, monitor);
						} else {
							_this.getModel().removePostChangeListener(id, monitor);
						}
					} else {
						_this.getModel().removePostChangeListener(key, monitor);
					}
				});
			}
			return this;
		},
		// event
		addPostChangeListener: function (listener) {
			this.getModel().addPostChangeListener(this.getDataId(), listener);
		},
		removePostChangeListener: function (listener) {
			this.getModel().removePostChangeListener(this.getDataId(), listener);
		},
		addPostAddListener: function (listener) {
			this.getModel().addPostAddListener(this.getDataId(), listener);
		},
		removePostAddListener: function (listener) {
			this.getModel().removePostAddListener(this.getDataId(), listener);
		},
		addPostRemoveListener: function (listener) {
			this.getModel().addPostRemoveListener(this.getDataId(), listener);
		},
		removePostRemoveListener: function (listener) {
			this.getModel().removePostRemoveListener(this.getDataId(), listener);
		},
		addPostValidateListener: function (listener) {
			this.getModel().addPostValidateListener(this.getDataId(), listener);
		},
		removePostValidateListener: function (listener) {
			this.getModel().removePostValidateListener(this.getDataId(), listener);
		}
	};
	/**
  * Array component mixin
  */
	$pt.mixins = {
		ArrayComponentMixin: {
			isArrayData: function () {
				return true;
			},
			addRowListener: function (rowModel) {
				this.getRowListeners().forEach(function (listener) {
					rowModel.addListener(listener.id, listener.time ? listener.time : 'post', listener.type ? listener.type : 'change', listener.listener);
				});
				rowModel.addPostChangeListener(null, this.onRowModelChanged);
				rowModel.addPostAddListener(null, this.onRowModelChanged);
				rowModel.addPostRemoveListener(null, this.onRowModelChanged);
			},
			onRowModelChanged: function (evt) {
				var hierarchyPublisher = this.getComponentOption('hierarchyPublisher');
				if (hierarchyPublisher) {
					var jsonModel = evt.model.getCurrentModel();
					var array = this.getModel().get(this.getDataId());
					var index = array.indexOf(jsonModel);
					hierarchyPublisher.call(this, this.getModel(), this.getDataId(), evt, index);
				} else if (hierarchyPublisher === false) {
					// do not publish to parent
				} else {
					// default behavior
					// fire a change operation no matter what type of event
					this.getModel().update(this.getDataId(), evt.model.getCurrentModel(), evt.model.getCurrentModel());
				}
			},
			/**
    * get row listeners, return empty array if no row listener defined
    */
			getRowListeners: function () {
				var listeners = this.getComponentOption(this.getRowListenerKey());
				return listeners ? Array.isArray(listeners) ? listeners : [listeners] : [];
			},
			getRowListenerKey: function () {
				return 'rowListener';
			},
			createRowModel: function (item, useBaseAsCurrent) {
				var parentModel = this.getModel();
				var parentValidator = parentModel.getValidator();
				var validator = null;
				if (parentValidator) {
					var parentValidationConfig = parentValidator.getConfig()[this.getDataId()];
					if (parentValidationConfig && parentValidationConfig.table) {
						validator = $pt.createModelValidator(parentValidationConfig.table);
					}
				}
				var model = validator ? $pt.createModel(item, validator) : $pt.createModel(item);
				model.parent(parentModel);
				// synchronized the validation result from parent model
				// get errors about current value
				var errors = this.getModel().getError(this.getDataId());
				if (errors) {
					errors.forEach(function (error) {
						if (typeof error !== 'string') {
							model.mergeError(error.getError(item));
						}
					});
				}
				if (useBaseAsCurrent) {
					model.useBaseAsCurrent();
				}
				return model;
			}
		},
		PopoverMixin: {
			// A) method list should be defined in component scripts:
			// 		1. getComponent, return jQuery object, required
			//		2. getPopoverContainerCSS, return css class name string, optional
			//		3. renderPopoverContent, return JSX DOM object, required
			//		4. beforePopoverRenderComplete, optional
			//		5. afterPopoverRenderComplete, optional
			//		6. isPopoverMatchComponentWidth, return boolean, default true, optional
			//		7. hasPopoverContentWrapper, return boolean, default true, optional
			//		8. beforeDestoryPopover, optional
			//		9. afterDestoryPopover, optional
			// B) state properties list:
			// 		1. this.state.popoverDiv
			renderPopoverContainer: function () {
				if (this.state.popoverDiv == null) {
					this.state.popoverDiv = $('<div>');
					this.state.popoverDiv.appendTo($('body'));
					if (!this.isMobile()) {
						$(document).on('mousedown', this.onDocumentMouseDownWhenPopoverShown).on('keyup', this.onDocumentKeyUpWhenPopoverShown).on('keydown', this.onDocumentKeyDownWhenPopoverShown).on('mousewheel', this.onDocumentMouseWheelWhenPopoverShown);
						$(window).on('resize', this.onWindowResizeWhenPopoverShown);
					} else {
						$('body').on('touchmove mousewheel', this.onDocumentMouseWheelWhenPopoverShown);
					}
				}
			},
			renderPopover: function () {
				if (this.beforeRenderPopover) {
					this.beforeRenderPopover.apply(this, arguments);
				}

				var styles = { display: 'block' };
				if (!this.isPopoverMatchComponentWidth || this.isPopoverMatchComponentWidth() !== false) {
					var component = this.getComponent();
					styles.width = component.outerWidth();
				}
				styles.top = -10000; // let it out of screen
				styles.left = 0;
				var css = {
					'popover bottom in': true
				};
				if (this.getPopoverContainerCSS) {
					css[this.getPopoverContainerCSS()] = true;
				}
				var additionalPopoverContainerCSS = this.getAdditionalCSS('popover');
				if (additionalPopoverContainerCSS) {
					css[additionalPopoverContainerCSS] = true;
				}
				if (this.isMobilePhone()) {
					css['mobile-phone'] = true;
					css['fix-bottom'] = this.isPopoverFixOnBottom();
					// use default display style
					styles = { display: 'block' }; // reset styles
				}
				var content = this.renderPopoverContent.apply(this, arguments);
				if (!this.hasPopoverContentWrapper || this.hasPopoverContentWrapper() !== false) {
					content = React.createElement(
						"div",
						{ className: "popover-content" },
						content
					);
				}
				var popover = React.createElement(
					"div",
					{ role: "tooltip", className: $pt.LayoutHelper.classSet(css), style: styles },
					React.createElement("div", { className: "arrow" }),
					content
				);
				ReactDOM.render(popover, this.state.popoverDiv.get(0), this.onPopoverRenderComplete);
			},
			onPopoverRenderComplete: function () {
				if (this.beforePopoverRenderComplete) {
					this.beforePopoverRenderComplete.apply(this, arguments);
				}

				this.state.popoverDiv.show();
				if (this.isMobilePhone()) {
					$('html').addClass('on-mobile-popover-shown');
				} else {
					var popover = this.state.popoverDiv.children('.popover');
					var component = this.getComponent();
					this.recalcPopoverPosition(popover, component);
				}

				if (this.afterPopoverRenderComplete) {
					this.afterPopoverRenderComplete.apply(this, arguments);
				}
			},
			recalcPopoverPosition: function (popover, component) {
				var styles = {};
				styles.width = component.outerWidth();
				var offset = component.offset();
				styles.top = offset.top + component.outerHeight();
				styles.left = offset.left;

				var onTop = false;
				var rightToLeft = false;
				var realHeight = popover.outerHeight();
				var realWidth = popover.outerWidth();
				// set the real top, assumpt it is on bottom
				styles.top = offset.top + component.outerHeight();
				// check popover in top or bottom
				if (styles.top + realHeight > $(window).height() + $(window).scrollTop()) {
					// cannot show in bottom and in current viewport
					// check it is enough top or not
					if (offset.top - $(window).scrollTop() >= realHeight) {
						// enough
						styles.top = offset.top - realHeight;
						onTop = true;
					} else if (styles.top + realHeight <= $(document).height()) {
						// can show in bottom and in current document
						onTop = false;
					} else if (offset.top < realHeight) {
						// cannot show in top and in current document
						onTop = false;
					} else {
						styles.top = offset.top - realHeight;
						onTop = true;
					}
				} else {
					// can show in bottom and in current viewport
					onTop = false;
				}

				// check popover to left or right
				if (realWidth > styles.width) {
					var width = $(document).width();
					if (styles.left + realWidth <= width) {
						// normal from left to right, do nothing
					} else if (styles.left + styles.width >= realWidth) {
						// from right to left
						styles.left = styles.left + styles.width - realWidth;
						rightToLeft = true;
					} else {
						// still left to right, do nothing
					}
				}

				if (onTop) {
					popover.addClass('top');
					popover.removeClass('bottom');
				} else {
					popover.removeClass('top');
					popover.addClass('bottom');
				}
				if (rightToLeft) {
					popover.addClass('right-to-left');
				}
				popover.css({ top: styles.top, left: styles.left });
			},
			showPopover: function () {
				if (this.beforeShowPopover) {
					this.beforeShowPopover.apply(this, arguments);
				}
				this.renderPopoverContainer();
				this.renderPopover.apply(this, arguments);
			},
			hidePopover: function () {
				this.destroyPopover();
			},
			destroyPopover: function () {
				if (this.beforeDestoryPopover) {
					this.beforeDestoryPopover.apply(this, arguments);
				}
				$('html').removeClass('on-mobile-popover-shown');
				if (this.state.popoverDiv) {
					$(document).off('mousedown', this.onDocumentMouseDownWhenPopoverShown).off('keyup', this.onDocumentKeyUpWhenPopoverShown).off('keydown', this.onDocumentKeyDownWhenPopoverShown).off('mousewheel', this.onDocumentMouseWheelWhenPopoverShown);
					$(window).off('resize', this.onWindowResizeWhenPopoverShown);
					if (this.isMobilePhone()) {
						$('body').off('touchmove mousewheel', this.onDocumentMouseWheelWhenPopoverShown);
					}
					this.state.popoverDiv.remove();
					delete this.state.popoverDiv;
				}

				if (this.afterDestoryPopover) {
					this.afterDestoryPopover.apply(this, arguments);
				}
			},
			onDocumentMouseDownWhenPopoverShown: function (evt) {
				var target = $(evt.target);
				if (target.closest(this.getComponent()).length == 0 && target.closest(this.state.popoverDiv).length == 0) {
					this.hidePopover();
				}
			},
			onDocumentKeyUpWhenPopoverShown: function (evt) {
				if (evt.keyCode === 27 || evt.keyCode === 9) {
					// escape and tab
					this.hidePopover();
				}
			},
			onDocumentKeyDownWhenPopoverShown: function (evt) {
				if (evt.keyCode === 38 || evt.keyCode === 40) {
					evt.preventDefault();
				}
			},
			onDocumentMouseWheelWhenPopoverShown: function (evt) {
				if (this.isMobilePhone()) {
					// when mobile phone, prevent the touch move and mouse wheel event
					evt.preventDefault();
					return;
				}

				var target = $(evt.target);
				if (target.closest(this.state.popoverDiv).length == 0) {
					this.hidePopover();
				}
			},
			onWindowResizeWhenPopoverShown: function () {
				this.hidePopover();
			},
			isPopoverFixOnBottom: function () {
				return this.isMobilePhone() && this.POP_FIX_ON_BOTTOM === true;
			}
		}
	};

	/**
  * define cell component
  * @param config {{}} special component config, will replace the definition from component base if with same name
  */
	$pt.defineCellComponent = function (config) {
		var renderProxy = {};
		if (config.keepRender !== true) {
			renderProxy = {
				render: function () {
					if (!this.isVisible()) {
						return null;
					} else {
						return config.render.call(this);
					}
				}
			};
		}
		return $.extend({}, ComponentBase, config, renderProxy);
	};

	var LayoutHelper = jsface.Class({
		constructor: function () {
			this.__comp = {};
			this.__components = {};
		},
		/**
   * copy from React.addons.classSet
   * @param classNames
   * @returns {string}
   */
		classSet: function (classNames) {
			if (typeof classNames == 'object') {
				return Object.keys(classNames).filter(function (className) {
					return classNames[className];
				}).join(' ');
			} else {
				return Array.prototype.join.call(arguments, ' ');
			}
		},
		setDefaultCellWidth: function (width) {
			CellLayout.DEFAULT_WIDTH = width * 1;
		},
		setDefaultSectionWidth: function (width) {
			SectionLayout.DEFAULT_WIDTH = width * 1;
		},
		/**
   * register react component to central
   */
		registerComponent: function (id, component) {
			if (this.__comp[id]) {
				// already some components use this id
				var exists = this.__comp[id];
				if (Array.isArray(exists)) {
					// push to array if not exists
					var found = exists.find(function (existed) {
						return existed === component;
					});
					if (!found) {
						exists.push(component);
					}
				} else {
					// set as array if not equals
					if (exists !== component) {
						this.__comp[id] = [exists, component];
					}
				}
			} else {
				// set new component
				this.__comp[id] = component;
			}
			return this;
		},
		/**
   * unregister component from central
   */
		unregisterComponent: function (id, component) {
			if (component) {
				// delete key, unregister all components with given id
				delete this.__comp[id];
			} else {
				// find all existed component with given id
				var exists = this.__comp[id];
				if (exists) {
					if (Array.isArray(exists)) {
						var index = exists.findIndex(function (existed) {
							return existed === component;
						});
						if (index != -1) {
							// unregister the found component
							exists.splice(index, 1);
						}
					} else if (exists === component) {
						// only one, equals, delete key
						delete this.__comp[id];
					}
				}
			}
			return this;
		},
		/**
   * get component by given id
   */
		getComponent: function (id) {
			return this.__comp[id];
		},
		__forceUpdate: function (component) {
			if (component.forceUpdate) {
				component.forceUpdate();
			}
			return this;
		},
		/**
   * force update components which has give id
   */
		forceUpdate: function (id) {
			var components = this.getComponent(id);
			if (components) {
				if (Array.isArray(components)) {
					components.forEach(this.__forceUpdate);
				} else {
					this.__forceUpdate(components);
				}
			}
			return this;
		},
		// register components
		registerComponentRenderer: function (type, func) {
			if (typeof type !== 'string') {
				type = type.type;
			}
			if (this.__components[type]) {
				window.console.warn('Component [' + type + '] is replaced.');
			}
			this.__components[type] = func;
		},
		getComponentRenderer: function (type) {
			if (typeof type !== 'string') {
				type = type.type;
			}
			if (this.__components[type]) {
				return this.__components[type];
			} else {
				throw $pt.createComponentException($pt.ComponentConstants.Err_Unsupported_Component, "Component type [" + type + "] is not supported yet.");
			}
		},
		registerComponentViewModeRenderer: function (type, func) {
			if (typeof type !== 'string') {
				type = type.type;
			}
			type = type + '@view';
			if (this.__components[type]) {
				window.console.warn('Component [' + type + '] is replaced.');
			}
			this.__components[type] = func;
		},
		getComponentViewModeRenderer: function (type) {
			if (typeof type !== 'string') {
				type = type.type;
			}
			type = type + '@view';
			if (this.__components[type]) {
				return this.__components[type];
			} else {
				// no view mode renderer registered yet
				return null;
			}
		},
		transformParameters: function (model, layout, direction, viewMode) {
			return {
				model: model,
				layout: layout,
				direction: direction,
				view: viewMode,
				ref: layout.getId()
			};
		}
	});
	$pt.LayoutHelper = new LayoutHelper();
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.Nothing, function () {
		return null;
	});
})(window, jQuery, jsface, React);

(function (window, $, React, ReactDOM, $pt) {
	var NArrayCheck = React.createClass($pt.defineCellComponent({
		displayName: 'NArrayCheck',
		getDefaultProps: function () {
			return {
				defaultOptions: {
					direction: 'horizontal',
					labelAttached: 'right'
				}
			};
		},
		renderItem: function (enabled, item, itemIndex) {
			var model = $pt.createModel({
				id: item.id,
				checked: this.isCodeChecked(item)
			});
			var layout = $pt.createCellLayout('checked', {
				label: item.text,
				comp: {
					labelAttached: this.getComponentOption('labelAttached'),
					enabled: item.enabled != null ? item.enabled : enabled
				}
			});
			model.addPostChangeListener('checked', this.onCodeItemCheckedChanged.bind(this, item));
			return React.createElement($pt.Components.NCheck, { model: model, layout: layout, key: itemIndex, view: this.isViewMode() });
		},
		render: function () {
			var enabled = this.isEnabled();
			var css = {
				'n-disabled': !enabled,
				vertical: this.getComponentOption('direction') === 'vertical'
			};
			css[this.getComponentCSS('n-array-check')] = true;
			return React.createElement($pt.Components.NCodeTableWrapper, { codetable: this.getCodeTable(),
				className: $pt.LayoutHelper.classSet(css),
				model: this.getModel(),
				layout: this.getLayout(),
				renderer: this.getRealRenderer });
		},
		getRealRenderer: function () {
			var enabled = this.isEnabled();
			var css = {
				'n-disabled': !enabled,
				vertical: this.getComponentOption('direction') === 'vertical'
			};
			css[this.getComponentCSS('n-array-check')] = true;
			return React.createElement(
				'div',
				{ className: $pt.LayoutHelper.classSet(css) },
				this.getCodeTable().list().map(this.renderItem.bind(this, enabled))
			);
		},
		onCodeItemCheckedChanged: function (codeTableItem, evt) {
			if (evt.new) {
				// checked
				this.onCodeItemChecked(codeTableItem);
			} else {
				// unchecked
				this.onCodeTableUnchecked(codeTableItem);
			}
		},
		onCodeTableUnchecked: function (codeTableItem) {
			var values = this.getValueFromModel();
			if (values == null) {
				return;
			}
			this.setValueToModel(values.filter(function (value) {
				return value != codeTableItem.id;
			}).slice(0));
		},
		onCodeItemChecked: function (codeTableItem) {
			// checked
			var values = this.getValueFromModel();
			if (values == null) {
				values = [codeTableItem.id];
			} else {
				var index = values.findIndex(function (value) {
					return value == codeTableItem.id;
				});
				if (index == -1) {
					values.push(codeTableItem.id);
				}
			}
			this.setValueToModel(values.slice(0));
		},
		getCodeTable: function () {
			return this.getComponentOption('data');
		},
		isCodeChecked: function (codeTableItem) {
			var values = this.getValueFromModel();
			return values != null && values.some(function (value) {
				return value == codeTableItem.id;
			});
		}
	}));
	$pt.Components.NArrayCheck = NArrayCheck;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.ArrayCheck, function (model, layout, direction, viewMode) {
		return React.createElement($pt.Components.NArrayCheck, $pt.LayoutHelper.transformParameters(model, layout, direction, viewMode));
	});
})(window, jQuery, React, ReactDOM, $pt);

(function (window, $, React, ReactDOM, $pt) {
	var NArrayPanel = React.createClass($pt.defineCellComponent({
		displayName: 'NArrayPanel',
		mixins: [$pt.mixins.ArrayComponentMixin],
		statics: {
			UNTITLED: 'Untitled Item'
		},
		getDefaultProps: function () {
			return {
				defaultOptions: {
					collapsible: true,
					expanded: true
				}
			};
		},
		/**
   * render item
   * @param item {{}}
   * @returns {XML}
   */
		renderItem: function (item, itemIndex) {
			var model = this.createRowModel(item, true);
			this.addRowListener(model);

			var _this = this;
			this.getDependencies('itemTitle').forEach(function (key) {
				model.addListener(key, "post", "change", function () {
					_this.forceUpdate();
				});
			});
			var cellLayout = {
				label: this.getPanelTitle(model, itemIndex),
				comp: {
					type: $pt.ComponentConstants.Panel,
					collapsible: this.getComponentOption('collapsible'),
					expanded: this.getExpanded(model, itemIndex),
					editLayout: this.getEditLayout(model, itemIndex),
					style: this.getComponentOption('style'),
					checkInTitle: this.getCheckInTitle(model, itemIndex),
					expandedLabel: this.getComponentOption('expandedLabel'),
					collapsedLabel: this.getComponentOption('collapsedLabel'),
					headerButtons: this.getHeaderButtons(model, itemIndex),
					customHeader: this.getCustomerHeader(model, itemIndex),
					centralId: this.getComponentCentralId() + '-' + itemIndex
				}
			};
			return React.createElement(
				'div',
				{ className: 'row', key: itemIndex },
				React.createElement(
					'div',
					{ className: 'col-sm-12 col-md-12 col-lg-12' },
					React.createElement($pt.Components.NPanel, { model: model,
						layout: $pt.createCellLayout('pseudo-panel', cellLayout),
						direction: this.props.direction,
						view: this.isViewMode() })
				)
			);
		},
		/**
   * render
   * @returns {XML}
   */
		render: function () {
			return React.createElement(
				'div',
				{ className: this.getComponentCSS('n-array-panel') },
				this.getValueFromModel().map(this.renderItem)
			);
		},
		/**
   * return [] when is null
   * @returns {[*]}
   */
		getValueFromModel: function () {
			var data = this.getModel().get(this.getDataId());
			return data == null ? [] : data;
		},
		/**
   * get edit layout
   * @param model {ModelInterface} item model
   * @returns {{}}
   */
		getEditLayout: function (model, itemIndex) {
			var layout = this.getComponentOption('editLayout');
			if (typeof layout === 'function') {
				return layout.call(this, model, itemIndex);
			} else {
				return layout;
			}
		},
		getHeaderButtons: function (model, itemIndex) {
			var buttons = this.getComponentOption('headerButtons');
			if (typeof buttons === 'function') {
				return buttons.call(this, model, itemIndex);
			} else {
				return buttons;
			}
		},
		getExpanded: function (model, itemIndex) {
			var expanded = this.getComponentOption('expanded');
			if (typeof expanded === 'function') {
				return expanded.call(this, model, itemIndex);
			} else {
				return expanded;
			}
		},
		getCustomerHeader: function (model, itemIndex) {
			var header = this.getComponentOption('customHeader');
			if (typeof header === 'function') {
				return header.call(this, model, itemIndex);
			} else {
				return header;
			}
		},
		/**
   * get check in title
   * @param model {ModelInterface} item model
   * @returns {{}}
   */
		getCheckInTitle: function (model, itemIndex) {
			var checkInTitle = this.getComponentOption('checkInTitle');
			if (typeof checkInTitle === 'function') {
				return checkInTitle.call(this, model, itemIndex);
			} else {
				return checkInTitle;
			}
		},
		/**
   * get panel titled
   * @param model {ModelInterface} item model
   * @returns {string}
   */
		getPanelTitle: function (model, itemIndex) {
			var title = this.getComponentOption('itemTitle');
			if (title == null) {
				return NArrayPanel.UNTITLED;
			} else if (typeof title === 'string') {
				return title;
			} else {
				var titleText = title.when.call(this, model, itemIndex);
				return titleText == null || titleText.isBlank() ? NArrayPanel.UNTITLED : titleText;
			}
		}
	}));
	$pt.Components.NArrayPanel = NArrayPanel;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.ArrayPanel, function (model, layout, direction, viewMode) {
		return React.createElement($pt.Components.NArrayPanel, $pt.LayoutHelper.transformParameters(model, layout, direction, viewMode));
	});
})(window, jQuery, React, ReactDOM, $pt);

(function (window, $, React, ReactDOM, $pt) {
	var NArrayTab = React.createClass($pt.defineCellComponent({
		displayName: 'NArrayTab',
		mixins: [$pt.mixins.ArrayComponentMixin],
		statics: {
			UNTITLED: 'Untitled Item',
			ADD_ICON: 'plus-circle',
			ADD_LABEL: 'Add'
		},
		getDefaultProps: function () {
			return {
				defaultOptions: {
					tabType: 'tab',
					justified: false,
					titleDirection: 'horizontal'
				}
			};
		},
		/**
   * render tab content
   * @param tab
   * @param tabIndex
   * @returns {XML}
   */
		renderTabContent: function (tab, tabIndex) {
			var activeTabIndex = this.getActiveTabIndex();
			var css = {
				'n-array-tab-card': true,
				show: tabIndex == activeTabIndex,
				hide: tabIndex != activeTabIndex
			};

			// no base here. since no apply operation
			var _this = this;
			// add item title and item icon listener
			this.getDependencies(['itemTitle', 'itemIcon']).forEach(function (key) {
				tab.data.addListener(key, "post", "change", function () {
					_this.forceUpdate();
				});
			});
			// add badge listener
			var badge = this.getComponentOption('badge');
			if (badge != null) {
				if (typeof badge === 'string') {
					tab.data.addListener(badge, "post", "change", function () {
						_this.forceUpdate();
					});
				} else {
					this.getDependencies(badge).forEach(function (key) {
						tab.data.addListener(key, "post", "change", function () {
							_this.forceUpdate();
						});
					});
				}
			}
			return React.createElement($pt.Components.NForm, { model: tab.data,
				layout: $pt.createFormLayout(tab.layout),
				direction: this.props.direction,
				view: this.isViewMode(),
				className: $pt.LayoutHelper.classSet(css),
				key: tabIndex });
		},
		/**
   * render
   * @returns {XML}
   */
		render: function () {
			var tabs = this.getTabs();
			var canActiveProxy = function (newTabValue, newTabIndex, activeTabValue, activeTabIndex) {
				if (this.isAddable() && newTabIndex == tabs.length - 1) {
					var onAdd = this.getComponentOption('onAdd');
					onAdd.call(this, this.getModel(), this.getValueFromModel());
					return false;
				} else {
					var canActive = this.getComponentOption('canActive');
					if (canActive) {
						return canActive.call(this, newTabValue, newTabIndex, activeTabValue, activeTabIndex);
					}
				}
			}.bind(this);

			// when state.clear is true, forcily clear the tab title dom
			// and then delete the state
			// see the following code in #onModelChanged
			// this.setState({clear: true}, this.forceUpdate);
			// forceUpdate must be passed as callback to #setState
			// all these are to remove the flicking when remove data from model side
			var tabTitle = null;
			if (this.state.clear !== true) {
				tabTitle = React.createElement($pt.Components.NTab, { type: this.getComponentOption('tabType'),
					justified: this.getComponentOption('justified'),
					direction: this.getComponentOption('titleDirection'),
					size: this.getComponentOption('titleIconSize'),
					tabClassName: this.getAdditionalCSS('tabs'),
					tabs: tabs,
					canActive: canActiveProxy,
					onActive: this.onTabClicked,
					ref: 'tabs' });
			} else {
				delete this.state.clear;
			}

			return React.createElement(
				'div',
				{ className: this.getComponentCSS('n-array-tab') },
				tabTitle,
				React.createElement(
					'div',
					{ className: 'n-array-tab-content', ref: 'content' },
					tabs.map(this.renderTabContent)
				)
			);
		},
		/**
   * get tabs
   * @returns {Array}
   */
		getTabs: function () {
			var activeTabIndex = 0;
			if (this.state.transientActiveTabIndex != null) {
				activeTabIndex = this.state.transientActiveTabIndex;
				delete this.state.transientActiveTabIndex;
			} else {
				activeTabIndex = this.getActiveTabIndex();
			}
			this.state.tabs = this.getValueFromModel().map(function (item, itemIndex) {
				var model = this.createRowModel(item, true);
				this.addRowListener(model);
				return {
					label: this.getTabTitle(model),
					icon: this.getTabIcon(model),
					layout: this.getEditLayout(model),
					badge: this.getTabBadge(model),
					data: model,
					active: itemIndex == activeTabIndex
				};
			}.bind(this));
			if (this.isAddable()) {
				this.state.tabs.push({
					icon: NArrayTab.ADD_ICON,
					label: NArrayTab.ADD_LABEL,
					layout: {
						nothing: {
							comp: {
								type: $pt.ComponentConstants.Nothing
							}
						}
					},
					data: $pt.createModel({}),
					css: 'add-tab'
				});
			}
			return this.state.tabs;
		},
		clearTabs: function (callback) {
			if (callback) {
				this.setState({ tabs: null }, callback.bind(this));
			} else {
				this.setState({ tabs: null });
			}
		},
		/**
   * return [] when is null
   * @returns {[*]}
   */
		getValueFromModel: function () {
			var data = this.getModel().get(this.getDataId());
			return data == null ? [] : data;
		},
		/**
   * on model changed
   * @param evt
   */
		onModelChanged: function (evt) {
			if (evt.type === 'add') {
				this.state.transientActiveTabIndex = evt.index;
				// this.clearTabs(this.setActiveTabIndex.bind(this, evt.index));
			} else if (evt.type === 'remove') {
				var index = evt.index;
				var data = this.getValueFromModel();
				if (index == data.length) {
					index = index - 1;
				}
				this.state.transientActiveTabIndex = index;
				// this.clearTabs(this.setActiveTabIndex.bind(this, index));
			} else {
				// this.forceUpdate();
				this.state.transientActiveTabIndex = evt.index != null ? evt.index : null;
			}
			this.setState({ clear: true }, this.forceUpdate);
			// this.forceUpdate();
		},
		/**
   * get edit layout
   * @param model {ModelInterface} item model
   * @returns {FormLayout}
   */
		getEditLayout: function (model) {
			var layout = this.getComponentOption('editLayout');
			if (typeof layout === 'function') {
				return layout.call(this, model);
			} else {
				return layout;
			}
		},
		/**
   * get item title
   * @param model {ModelInterface} item model
   * @returns {string}
   */
		getTabTitle: function (model) {
			var title = this.getComponentOption('itemTitle');
			if (title == null) {
				return NArrayTab.UNTITLED;
			} else if (typeof title === 'string') {
				return title;
			} else {
				var titleText = title.when.call(this, model);
				return titleText == null || titleText.isBlank() ? NArrayTab.UNTITLED : titleText;
			}
		},
		getTabBadge: function (model) {
			var badge = this.getComponentOption('badge');
			if (badge == null) {
				return null;
			} else if (typeof badge === 'string') {
				var badgeValue = model.get(badge);
				var badgeRender = this.getComponentOption('badgeRender');
				if (badgeRender) {
					badgeValue = badgeRender.call(this, badgeValue, model, this.getModel());
				}
				return badgeValue;
			} else {
				return badge.when.call(this, model);
			}
		},
		/**
   * get item icon
   * @param model {ModelInterface} item model
   * @returns {string}
   */
		getTabIcon: function (model) {
			var icon = this.getComponentOption('itemIcon');
			if (icon == null) {
				return null;
			} else if (typeof icon === 'string') {
				return icon;
			} else {
				return icon.when.call(this, model);
			}
		},
		isAddable: function () {
			return !this.isViewMode() && this.getComponentOption('onAdd') != null;
		},
		/**
   * on tab clicked
   * @param tabValue {string} tab value
   * @param index {number}
   */
		onTabClicked: function (tabValue, index) {
			this.setActiveTabIndex(index);
			var onActive = this.getComponentOption('onActive');
			if (onActive) {
				onActive.call(this, tabValue, index);
			}
		},
		/**
   * get active tab index
   * @returns {number}
   */
		getActiveTabIndex: function () {
			var tabs = this.state.tabs;
			if (tabs == null) {
				return -1;
			}
			// find the active tab
			var activeTabIndex = tabs.findIndex(function (tab, index) {
				return tab.active === true;
			});
			if (activeTabIndex == -1) {
				// find the first visible tab if no active tab found
				activeTabIndex = tabs.findIndex(function (tab, index) {
					var visible = tab.visible !== false;
					if (visible) {
						tab.active = true;
						return true;
					}
				});
			}
			return activeTabIndex;
		},
		/**
   * set active tab index
   * @param {number}
   */
		setActiveTabIndex: function (index) {
			this.refs.tabs.setActiveTabIndex(index);
			this.forceUpdate();
		}
	}));
	$pt.Components.NArrayTab = NArrayTab;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.ArrayTab, function (model, layout, direction, viewMode) {
		return React.createElement($pt.Components.NArrayTab, $pt.LayoutHelper.transformParameters(model, layout, direction, viewMode));
	});
})(window, jQuery, React, ReactDOM, $pt);

(function (window, $, React, ReactDOM, $pt) {
	var NFormButton = React.createClass($pt.defineCellComponent({
		displayName: 'NFormButton',
		getDefaultProps: function () {
			return {
				defaultOptions: {
					style: 'default',
					labelFromModel: false
				}
			};
		},
		renderIcon: function (icon) {
			if (icon == null) {
				return null;
			} else {
				var css = {
					fa: true,
					'fa-fw': true
				};
				css['fa-' + icon] = true;
				return React.createElement('span', { className: $pt.LayoutHelper.classSet(css), key: 'icon' });
			}
		},
		/**
   * render icon
   * @returns {*}
   */
		renderButtonIcon: function () {
			return this.renderIcon(this.getIcon());
		},
		renderMoreButtons: function (css) {
			var more = this.getComponentOption('more');
			if (more) {
				// onClick={this.onClicked}
				var dropdown = React.createElement(
					'a',
					{ href: 'javascript:void(0);',
						className: $pt.LayoutHelper.classSet(css) + ' dropdown-toggle',
						disabled: !this.isEnabled(),
						'data-toggle': 'dropdown',
						'aria-haspopup': 'true',
						'aria-expanded': 'false',
						key: 'a' },
					!this.getComponentOption('click') ? this.getButtonContext() : null,
					React.createElement('span', { className: 'caret' })
				);
				var emptyFunction = function () {};
				var _this = this;
				var menus = React.createElement(
					'ul',
					{ className: 'dropdown-menu', key: 'ul' },
					more.map(function (menu, menuIndex) {
						if (menu.divider) {
							return React.createElement('li', { role: 'separator', className: 'divider', key: menuIndex });
						} else {
							var click = menu.click ? menu.click : emptyFunction;
							var label = menu.text;
							var icon = _this.renderIcon(menu.icon);
							if (label && icon) {
								label = ' ' + label;
							}
							return React.createElement(
								'li',
								{ key: menuIndex },
								React.createElement(
									'a',
									{ href: 'javascript:void(0);', onClick: click.bind(_this, _this.getModel()) },
									icon,
									label
								)
							);
						}
					})
				);
				return [dropdown, menus];
			} else {
				return null;
			}
		},
		getButtonContext: function () {
			var label = this.getLabel();
			var icon = this.renderButtonIcon();
			var buttonContext = null;
			if (this.getLabelPosition() === 'left') {
				// label in left
				if (label && icon) {
					label = React.createElement(
						'span',
						{ key: 'lbl' },
						label + ' '
					);
				}
				buttonContext = [label, icon];
			} else {
				// default label in right
				if (label && icon) {
					label = React.createElement(
						'span',
						{ key: 'lbl' },
						' ' + label
					);
				}
				buttonContext = [icon, label];
			}
			return buttonContext;
		},
		render: function () {
			if (!this.isVisible()) {
				return null;
			}
			var compCSS = {};
			compCSS[this.getComponentCSS('n-button')] = true;
			compCSS['n-disabled'] = !this.isEnabled();
			var css = {
				btn: true,
				disabled: !this.isEnabled()
			};
			css['btn-' + this.getStyle()] = true;
			var defaultClick = this.getComponentOption("click");
			var more = this.getComponentOption('more');
			var defaultButton = null;
			if (defaultClick || !more) {
				defaultButton = React.createElement(
					'a',
					{ href: 'javascript:void(0);',
						className: $pt.LayoutHelper.classSet(css),
						onMouseUp: this.onClicked,
						disabled: !this.isEnabled(),
						title: this.getComponentOption('tooltip'),
						ref: 'a' },
					this.getButtonContext()
				);
			}
			return React.createElement(
				'div',
				{ className: $pt.LayoutHelper.classSet(compCSS) },
				React.createElement(
					'div',
					{ className: 'btn-group' },
					defaultButton,
					this.renderMoreButtons(css)
				)
			);
		},
		onClicked: function (evt) {
			if (evt.button != 0) {
				// not left button
				return;
			}
			// console.log(evt.button);
			if (this.isEnabled()) {
				$(ReactDOM.findDOMNode(this.refs.a)).toggleClass('effect');
				var onclick = this.getComponentOption("click");
				if (onclick) {
					onclick.call(this, this.getModel(), evt.target);
				}
			}
		},
		/**
   * get icon
   * @returns {string}
   */
		getIcon: function () {
			return this.getComponentOption("icon");
		},
		/**
   * get button style
   * @returns {string}
   */
		getStyle: function () {
			var style = this.getComponentOption('style');
			if (typeof style === 'function') {
				return style.call(this);
			} else {
				return style;
			}
		},
		/**
   * get label position
   * @returns {string}
   */
		getLabelPosition: function () {
			return this.getComponentOption("labelPosition");
		},
		getLabel: function () {
			var labelFromModel = this.getComponentOption('labelFromModel');
			if (labelFromModel) {
				return this.getValueFromModel();
			} else {
				return this.getLayout().getLabel(this);
			}
		},
		/**
   * @overrides do nothing
   * @param value
   */
		setValueToModel: function (value) {
			// nothing
		}
	}));
	$pt.Components.NFormButton = NFormButton;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.Button, function (model, layout, direction, viewMode) {
		return React.createElement($pt.Components.NFormButton, $pt.LayoutHelper.transformParameters(model, layout, direction, viewMode));
	});
})(window, jQuery, React, ReactDOM, $pt);

(function (window, $, React, ReactDOM, $pt) {
	var NCheck = React.createClass($pt.defineCellComponent({
		displayName: 'NCheck',
		/**
   * render label
   * @param labelInLeft {boolean}
   * @returns {XML}
   */
		renderLabel: function (labelInLeft) {
			if (this.isLabelAttached()) {
				var label = this.getLayout().getLabel(this);
				if (label == null || label.isEmpty()) {
					return null;
				}
				var enabled = this.isEnabled();
				var css = {
					'check-label': true,
					disabled: !this.isEnabled(),
					'check-label-left': labelInLeft
				};
				return React.createElement(
					'span',
					{ className: $pt.LayoutHelper.classSet(css),
						onClick: enabled && !this.isViewMode() ? this.onButtonClicked : null },
					this.getLayout().getLabel(this)
				);
			}
			return null;
		},
		/**
   * render check box, using font awesome instead
   * @returns {XML}
   */
		renderCheckbox: function () {
			var checked = this.isChecked();
			var enabled = this.isEnabled();
			var css = {
				disabled: !enabled,
				checked: checked,
				'check-container': true
			};
			return React.createElement(
				'div',
				{ className: 'check-container' },
				React.createElement(
					'span',
					{ className: $pt.LayoutHelper.classSet(css),
						onClick: enabled && !this.isViewMode() ? this.onButtonClicked : null,
						onKeyUp: enabled && !this.isViewMode() ? this.onKeyUp : null,
						tabIndex: '0',
						ref: 'out' },
					React.createElement('span', { className: 'check', onClick: this.onInnerClicked })
				)
			);
		},
		/**
   * render
   * @returns {XML}
   */
		render: function () {
			var css = {
				'n-disabled': !this.isEnabled(),
				'n-view-mode': this.isViewMode()
			};
			css[this.getComponentCSS('n-checkbox')] = true;
			var isLabelAtLeft = this.isLabelAtLeft();
			// <input type="checkbox" style={{display: "none"}}
			// 	   onChange={this.onComponentChanged} ref='txt'/>
			return React.createElement(
				'div',
				{ className: $pt.LayoutHelper.classSet(css) },
				isLabelAtLeft ? this.renderLabel(true) : null,
				this.renderCheckbox(),
				!isLabelAtLeft ? this.renderLabel(false) : null
			);
		},
		/**
   * inner span clicked, force focus to outer span
   * for fix the outer span cannot gain focus in IE11
   */
		onInnerClicked: function () {
			$(ReactDOM.findDOMNode(this.refs.out)).focus();
		},
		/**
   * handle button clicked event
   */
		onButtonClicked: function () {
			this.setValueToModel(!this.isChecked());
		},
		onKeyUp: function (evt) {
			if (evt.keyCode == '32') {
				this.onButtonClicked();
			}
		},
		/**
   * is checked or not
   * @returns {boolean}
   */
		isChecked: function () {
			return this.getValueFromModel() === true;
		},
		/**
   * is label attached
   * @returns {boolean}
   */
		isLabelAttached: function () {
			return this.getComponentOption('labelAttached') !== null;
		},
		/**
   * get component
   * @returns {jQuery}
   */
		// getComponent: function () {
		// 	return $(ReactDOM.findDOMNode(this.refs.txt));
		// },
		isLabelAtLeft: function () {
			return this.getComponentOption('labelAttached') === 'left';
		}
	}));
	$pt.Components.NCheck = NCheck;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.Check, function (model, layout, direction, viewMode) {
		return React.createElement($pt.Components.NCheck, $pt.LayoutHelper.transformParameters(model, layout, direction, viewMode));
	});
})(window, jQuery, React, ReactDOM, $pt);

(function (window, $, React, ReactDOM, $pt) {
	var NCodeTableWrapper = React.createClass($pt.defineCellComponent({
		displayName: 'CodeTableWrapper',
		statics: {
			ON_LOADING_ICON: 'fa fa-fw fa-spinner fa-spin',
			ON_LOADING: 'On Loading...'
		},
		getDefaultProps: function () {
			return {};
		},
		componentWillUpdate: function () {},
		componentDidUpdate: function () {},
		/**
   * did mount
   */
		componentDidMount: function () {
			var codetable = this.getCodeTable();
			if (this.state.paintWrapper) {
				if (this.hasParent()) {
					var parentValue = this.getParentValue();
					if (parentValue == null) {
						if (this.loadWhenNoParentValue()) {
							// load all when no parent value
							codetable.initializeRemote().done(this.repaint);
						} else {
							codetable.setAsRemoteInitialized();
							this.repaint();
						}
					} else {
						// only load segments according to parent value
						codetable.loadRemoteCodeSegment(parentValue).done(this.repaint);
					}
				} else {
					// no parent, load all
					codetable.initializeRemote().done(this.repaint);
				}
			} else {
				var onMounted = this.props.onMounted;
				if (onMounted) {
					onMounted.call(this);
				}
			}
		},
		componentWillUnmount: function () {},
		repaint: function () {
			var onMounted = this.props.onMounted;
			this.setState({
				paintWrapper: false
			}, onMounted ? onMounted : undefined);
		},
		needWrapper: function () {
			var codetable = this.getCodeTable();
			var need = true;
			if (Array.isArray(codetable)) {
				// is an array, not code table instance
				need = false;
			} else if (this.hasParent() && this.getParentValue() == null && !this.loadWhenNoParentValue()) {
				// has parent, no parent value, no options when no parent value
				need = false;
			} else if (!codetable.isRemoteButNotInitialized()) {
				// initialized remote data
				need = false;
			}
			return need;
		},
		render: function () {
			if (this.needWrapper()) {
				this.state.paintWrapper = true;
				var className = this.props.className ? this.props.className + ' n-codetable-wrapper form-control' : 'n-codetable-wrapper form-control';
				return React.createElement(
					'div',
					{ className: className },
					React.createElement('span', { className: 'n-ctol-icon ' + NCodeTableWrapper.ON_LOADING_ICON }),
					React.createElement(
						'span',
						{ className: 'n-ctol-label' },
						NCodeTableWrapper.ON_LOADING
					)
				);
			} else {
				this.state.paintWrapper = false;
				return this.getWrappedRenderer().call(this);
			}
		},
		getCodeTable: function () {
			return this.props.codetable;
		},
		getWrappedRenderer: function () {
			return this.props.renderer;
		},
		hasParent: function () {
			return this.props.hasParent;
		},
		loadWhenNoParentValue: function () {
			return this.props.hasParent ? this.props.loadWhenNoParentValue : true;
		},
		getParentValue: function () {
			return this.props.parentValue;
		}
	}));
	$pt.Components.NCodeTableWrapper = NCodeTableWrapper;
})(window, jQuery, React, ReactDOM, $pt);

(function (window, $, moment, React, ReactDOM, $pt) {
	var NDateTime = React.createClass($pt.defineCellComponent({
		displayName: 'NDateTime',
		mixins: [$pt.mixins.PopoverMixin],
		statics: {
			POP_FIX_ON_BOTTOM: false,
			FORMAT: 'YYYY/MM/DD',
			HEADER_MONTH_FORMAT: 'MMMM',
			HEADER_YEAR_FORMAT: 'YYYY',
			VALUE_FORMAT: $pt.ComponentConstants.Default_Date_Format,
			FORMAT_TYPES: {
				// use binary
				ALL: 64 + 32 + 16 + 8 + 4 + 2,
				YMD: 64 + 32 + 16,
				YM: 64 + 32,
				HM: 8 + 4,
				HMS: 8 + 4 + 2,

				YEAR: 64,
				MONTH: 32,
				DAY: 16,
				HOUR: 8,
				MINUTE: 4,
				SECOND: 2,
				MILLSECOND: 1
			},
			CLOCK_RADIUS: 100,
			CLOCK_HOUR_PERCENTAGE: 0.6,
			CLOCK_BIG_ENGRAVE_LENGTH: 8,
			CLOCK_SMALL_ENGRAVE_LENGTH: 4,
			CLOCK_CHAR_POS: {
				TOP: { X: 100, Y: -2 },
				LEFT: { X: -1, Y: 99 },
				RIGHT: { X: 201, Y: 99 },
				BOTTOM: { X: 100, Y: 203 }
			},
			CLOCK_HAND_OFFSET: 10,
			CLOSE_TEXT: 'Close',
			TODAY_TEXT: 'Now',
			CLEAR_TEXT: 'Clear',
			DATE_SWITCH_TEXT: 'Date',
			TIME_SWITCH_TEXT: 'Time',
			FIXED_WEEKDS: false
		},
		getDefaultProps: function () {
			return {
				defaultOptions: {
					locale: 'en',
					headerMonthFirst: true,
					bodyYearFormat: 'YYYY',
					icons: {
						calendar: 'calendar',
						today: 'crosshairs',
						clear: 'trash-o',
						close: 'close'
					}
				}
			};
		},
		beforeDidUpdate: function () {
			this.setValueToTextInput(this.getValueFromModel());
		},
		beforeDidMount: function () {
			this.setValueToTextInput(this.getValueFromModel());
		},
		beforeWillUnmount: function () {
			this.destroyPopover();
		},
		renderIcon: function (options) {
			var css = {
				fa: true,
				'fa-fw': true
			};
			css['fa-' + options.icon] = true;
			if (options.className) {
				css[options.className] = true;
			}
			return React.createElement('span', { className: $pt.LayoutHelper.classSet(css), onClick: options.click });
		},
		renderInputArea: function () {
			// desktop
			var css = {
				'input-group-addon': true,
				link: true,
				disabled: !this.isEnabled()
			};
			return React.createElement(
				'div',
				{ className: 'input-group',
					onClick: this.onCalendarButtonClicked,
					ref: 'comp' },
				React.createElement('input', { type: 'text',
					className: 'form-control',
					disabled: !this.isEnabled(),
					onChange: this.onTextInputChange,
					onFocus: this.onTextInputFocused,
					onBlur: this.onTextInputBlurred,
					'aria-readonly': this.isMobile() ? true : false,
					readOnly: this.isMobile() ? true : false,
					ref: 'text' }),
				React.createElement(
					'span',
					{ className: $pt.LayoutHelper.classSet(css) },
					this.renderIcon({ icon: this.getIcon('calendar'), click: this.onCalendarButtonClicked })
				)
			);
		},
		render: function () {
			if (this.isViewMode()) {
				return this.renderInViewMode();
			}
			var divCSS = {
				'n-disabled': !this.isEnabled()
			};
			divCSS[this.getComponentCSS('n-datetime')] = true;
			return React.createElement(
				'div',
				{ className: $pt.LayoutHelper.classSet(divCSS) },
				this.renderInputArea(),
				this.renderNormalLine(),
				this.renderFocusLine()
			);
		},
		renderHeaderMonth: function (date) {
			return React.createElement(
				'span',
				{ onClick: this.renderPopover.bind(this, { date: date, type: NDateTime.FORMAT_TYPES.MONTH }),
					className: 'header-date-btn',
					key: 'header-month' },
				this.convertValueToString(date, this.getHeaderMonthFormat())
			);
		},
		renderHeaderYear: function (date) {
			return React.createElement(
				'span',
				{ onClick: this.renderPopover.bind(this, { date: date, type: NDateTime.FORMAT_TYPES.YEAR }),
					className: 'header-date-btn',
					key: 'header-year' },
				this.convertValueToString(date, this.getHeaderYearFormat())
			);
		},
		renderDayHeader: function (date) {
			var mainHeader = [this.renderHeaderMonth(date), ' ', this.renderHeaderYear(date)];
			var monthFirst = this.getComponentOption('headerMonthFirst');
			return React.createElement(
				'div',
				{ className: 'calendar-header day-view' },
				this.renderIcon({
					icon: 'angle-double-left',
					className: 'header-btn left',
					click: this.renderPopover.bind(this, { date: date.clone().subtract(1, 'y'), type: NDateTime.FORMAT_TYPES.DAY })
				}),
				this.renderIcon({
					icon: 'angle-left',
					className: 'header-btn left',
					click: this.renderPopover.bind(this, { date: date.clone().subtract(1, 'M'), type: NDateTime.FORMAT_TYPES.DAY })
				}),
				monthFirst ? mainHeader : mainHeader.reverse(),
				this.renderIcon({
					icon: 'angle-double-right',
					className: 'header-btn right',
					click: this.renderPopover.bind(this, { date: date.clone().add(1, 'y'), type: NDateTime.FORMAT_TYPES.DAY })
				}),
				this.renderIcon({
					icon: 'angle-right',
					className: 'header-btn right',
					click: this.renderPopover.bind(this, { date: date.clone().add(1, 'M'), type: NDateTime.FORMAT_TYPES.DAY })
				})
			);
		},
		getWeekdayHeader: function (date) {
			var orgLocale = moment.locale();
			moment.locale(this.getLocale());
			var header = moment.weekdaysMin();
			moment.locale(orgLocale);
			var firstDayOfWeek = this.getFirstDayOfWeek();
			// move how many to last
			var removed = header.splice(0, firstDayOfWeek);
			header = header.concat.apply(header, removed);
			return header;
		},
		getDaysOfDayBody: function (date) {
			var days = this.getDaysOfMonth(date);
			var firstDay = date.clone();
			firstDay.date(1); // set to the first day of month
			var dayOfWeekOfFirstDay = this.getDayOfWeek(firstDay);
			var firstDayOfWeek = this.getFirstDayOfWeek();
			var gapDaysOfPrevMonth = 0;
			if (dayOfWeekOfFirstDay >= firstDayOfWeek) {
				gapDaysOfPrevMonth = dayOfWeekOfFirstDay - firstDayOfWeek;
			} else {
				gapDaysOfPrevMonth = dayOfWeekOfFirstDay + 7 - firstDayOfWeek;
			}
			// calculate
			var index = 0;
			var viewDays = [];
			var viewDay = null;
			// gap days by previous month
			for (index = 1; index <= gapDaysOfPrevMonth; index++) {
				viewDay = firstDay.clone();
				viewDay.subtract(index, 'd');
				viewDays.splice(0, 0, viewDay);
			}
			// this month
			for (index = 0; index < days; index++) {
				viewDay = firstDay.clone();
				viewDay.add(index, 'd');
				viewDays.push(viewDay);
			}
			// gap days by next month
			var gapDaysOfNextMonth = 7 - viewDays.length % 7;
			gapDaysOfNextMonth = gapDaysOfNextMonth == 7 ? 0 : gapDaysOfNextMonth;
			var lastDay = viewDays[viewDays.length - 1];
			for (index = 1; index <= gapDaysOfNextMonth; index++) {
				viewDay = lastDay.clone();
				viewDay.add(index, 'd');
				viewDays.push(viewDay);
			}
			if (NDateTime.FIXED_WEEKDS) {
				lastDay = viewDays[viewDays.length - 1];
				var dayCount = viewDays.length;
				if (dayCount < 42) {
					for (index = 1; index <= 42 - dayCount; index++) {
						viewDay = lastDay.clone();
						viewDay.add(index, 'd');
						viewDays.push(viewDay);
					}
				}
			}

			return viewDays;
		},
		renderDayBody: function (date) {
			var _this = this;
			var header = this.getWeekdayHeader();
			var days = this.getDaysOfDayBody(date);
			var currentMonth = date.month();
			var value = this.getValueFromModel();
			var today = this.getToday();

			var min = this.getMinDate();
			var max = this.getMaxDate();

			return React.createElement(
				'div',
				{ className: 'calendar-body day-view' },
				React.createElement(
					'div',
					{ className: 'day-view-body-header row' },
					header.map(function (weekday, weekdayIndex) {
						return React.createElement(
							'div',
							{ className: 'cell-7-1', key: 'weekday-' + weekdayIndex },
							weekday
						);
					})
				),
				React.createElement(
					'div',
					{ className: 'day-view-body-body row' },
					days.map(function (day, dayIndex) {
						var css = {
							'cell-7-1': true,
							'gap-day': day.month() != currentMonth,
							'disable-day': day.isBefore(min) || day.isAfter(max),
							today: day.isSame(today, 'day'),
							'current-value': value != null && day.isSame(value, 'day')
						};
						var click = _this.onDaySelected.bind(_this, day);
						if (css['disable-day'] === true) {
							click = null;
						}
						return React.createElement(
							'div',
							{ className: $pt.LayoutHelper.classSet(css),
								onClick: click,
								key: 'day-' + dayIndex },
							React.createElement(
								'span',
								null,
								day.date()
							)
						);
					})
				)
			);
		},
		renderMonthHeader: function (date) {
			return React.createElement(
				'div',
				{ className: 'calendar-header month-view' },
				this.renderIcon({
					icon: 'angle-double-left',
					className: 'header-btn left',
					click: this.renderPopover.bind(this, { date: date.clone().subtract(10, 'y'), type: NDateTime.FORMAT_TYPES.MONTH })
				}),
				this.renderIcon({
					icon: 'angle-left',
					className: 'header-btn left',
					click: this.renderPopover.bind(this, { date: date.clone().subtract(1, 'y'), type: NDateTime.FORMAT_TYPES.MONTH })
				}),
				this.renderHeaderYear(date),
				this.renderIcon({
					icon: 'angle-double-right',
					className: 'header-btn right',
					click: this.renderPopover.bind(this, { date: date.clone().add(10, 'y'), type: NDateTime.FORMAT_TYPES.MONTH })
				}),
				this.renderIcon({
					icon: 'angle-right',
					className: 'header-btn right',
					click: this.renderPopover.bind(this, { date: date.clone().add(1, 'y'), type: NDateTime.FORMAT_TYPES.MONTH })
				})
			);
		},
		renderMonthBody: function (date) {
			var _this = this;
			var orgLocale = moment.locale();
			moment.locale(this.getLocale());
			var months = moment.monthsShort('-MMM-');
			moment.locale(orgLocale);
			var day = this.getValueFromModel();
			if (day == null) {
				day = this.getToday();
			}
			var value = this.getValueFromModel();
			var today = this.getToday();
			return React.createElement(
				'div',
				{ className: 'calendar-body month-view' },
				React.createElement(
					'div',
					{ className: 'month-view-body-body row' },
					months.map(function (month, index) {
						var selectedDay = day.clone();
						selectedDay.year(date.year());
						selectedDay.month(index);
						var css = {
							'cell-4-1': true,
							today: index == today.month(),
							'current-value': value != null && index == value.month()
						};
						return React.createElement(
							'div',
							{ className: $pt.LayoutHelper.classSet(css),
								onClick: _this.onMonthSelected.bind(_this, selectedDay),
								key: index },
							month
						);
					})
				)
			);
		},
		renderYearHeader: function (date) {
			var yearHeader = [this.convertValueToString(date.clone().subtract(10, 'y'), this.getHeaderYearFormat()), ' - ', this.convertValueToString(date.clone().add(9, 'y'), this.getHeaderYearFormat())];
			return React.createElement(
				'div',
				{ className: 'calendar-header year-view' },
				this.renderIcon({
					icon: 'angle-double-left',
					className: 'header-btn left',
					click: this.renderPopover.bind(this, { date: date.clone().subtract(40, 'y'), type: NDateTime.FORMAT_TYPES.YEAR })
				}),
				this.renderIcon({
					icon: 'angle-left',
					className: 'header-btn left',
					click: this.renderPopover.bind(this, { date: date.clone().subtract(20, 'y'), type: NDateTime.FORMAT_TYPES.YEAR })
				}),
				yearHeader,
				this.renderIcon({
					icon: 'angle-double-right',
					className: 'header-btn right',
					click: this.renderPopover.bind(this, { date: date.clone().add(40, 'y'), type: NDateTime.FORMAT_TYPES.YEAR })
				}),
				this.renderIcon({
					icon: 'angle-right',
					className: 'header-btn right',
					click: this.renderPopover.bind(this, { date: date.clone().add(20, 'y'), type: NDateTime.FORMAT_TYPES.YEAR })
				})
			);
		},
		renderYearBody: function (date) {
			var _this = this;
			var day = this.getValueFromModel();
			if (day == null) {
				day = this.getToday();
			}
			var value = this.getValueFromModel();
			var today = this.getToday();
			var years = [];
			for (var index = -10; index <= 9; index++) {
				var year = date.clone().set({ month: day.month(), date: day.date(), hour: day.hour(), minute: day.minute(), second: day.second(), millisecond: day.millisecond() });
				year.add(index, 'y');
				years.push(year);
			}
			return React.createElement(
				'div',
				{ className: 'calendar-body month-view' },
				React.createElement(
					'div',
					{ className: 'year-view-body-body row' },
					years.map(function (year, yearIndex) {
						var css = {
							'cell-4-1': true,
							today: year.year() == today.year(),
							'current-value': value != null && year.year() == value.year()
						};
						return React.createElement(
							'div',
							{ className: $pt.LayoutHelper.classSet(css),
								onClick: _this.onYearSelected.bind(_this, year),
								key: yearIndex },
							year.format(_this.getBodyYearFormat())
						);
					})
				)
			);
		},
		renderPopoverContentFooterButton: function (options) {
			return React.createElement(
				'div',
				{ className: 'cell-3-1', onClick: options.click },
				this.renderIcon({ icon: this.getIcon(options.icon) })
			);
		},
		renderPopoverContentFooterForMobile: function (today, type) {
			var viewSwitch = null;
			if (this.hasDateToDisplay() && this.hasTimeToDisplay()) {
				viewSwitch = [];
				// is date view, show time switch
				viewSwitch.push(React.createElement(
					'a',
					{ href: 'javascript:void(0);',
						onClick: this.switchToTimeViewOnMobile,
						className: 'time-switch' + (this.state.dateViewWhenMobilePhone ? '' : ' hidden'),
						key: 'date' },
					React.createElement(
						'span',
						null,
						NDateTime.TIME_SWITCH_TEXT
					)
				));
				// not date view, show date switch
				viewSwitch.push(React.createElement(
					'a',
					{ href: 'javascript:void(0);',
						onClick: this.switchToDateViewOnMobile,
						className: 'date-switch' + (this.state.dateViewWhenMobilePhone ? ' hidden' : ''),
						key: 'time' },
					React.createElement(
						'span',
						null,
						NDateTime.DATE_SWITCH_TEXT
					)
				));
			}
			return React.createElement(
				'div',
				{ className: 'calendar-footer row' },
				React.createElement(
					'div',
					null,
					React.createElement(
						'a',
						{ href: 'javascript:void(0);', onClick: this.hidePopover },
						React.createElement(
							'span',
							null,
							NDateTime.CLOSE_TEXT
						)
					),
					React.createElement(
						'a',
						{ href: 'javascript:void(0);', onClick: this.renderPopover.bind(this, {
								date: null,
								type: type,
								set: true
							}) },
						React.createElement(
							'span',
							null,
							NDateTime.CLEAR_TEXT
						)
					),
					React.createElement(
						'a',
						{ href: 'javascript:void(0);', onClick: this.renderPopover.bind(this, {
								date: today,
								type: type,
								set: true
							}) },
						React.createElement(
							'span',
							null,
							NDateTime.TODAY_TEXT
						)
					),
					viewSwitch
				)
			);
		},
		renderPopoverContentFooterForDesk: function (today, type) {
			return React.createElement(
				'div',
				{ className: 'calendar-footer row' },
				this.renderPopoverContentFooterButton({
					icon: 'today',
					click: this.renderPopover.bind(this, {
						date: today,
						type: type,
						set: true
					})
				}),
				this.renderPopoverContentFooterButton({
					icon: 'clear',
					click: this.renderPopover.bind(this, {
						date: null,
						type: type,
						set: true
					})
				}),
				this.renderPopoverContentFooterButton({
					icon: 'close',
					click: this.hidePopover
				})
			);
		},
		renderPopoverContentFooter: function (today, type) {
			if (this.isMobilePhone()) {
				return this.renderPopoverContentFooterForMobile(today, type);
			} else {
				return this.renderPopoverContentFooterForDesk(today, type);
			}
		},
		renderEngrave: function (degree, radius, length, className, offset) {
			var startLength = radius - length;
			return React.createElement('line', { className: className,
				x1: startLength * Math.cos(Math.PI * 2 * degree / 360) + offset,
				y1: offset - startLength * Math.sin(Math.PI * 2 * degree / 360),
				x2: radius * Math.cos(Math.PI * 2 * degree / 360) + offset,
				y2: offset - radius * Math.sin(Math.PI * 2 * degree / 360),
				key: degree });
		},
		render12HourDial: function (date, popoverType) {
			var _this = this;
			var am = date.hour() <= 11; // 0-23
			var hourRadius = this.getHourRadius();
			return React.createElement(
				'g',
				{ key: 'hour-12-dial' },
				React.createElement(
					'text',
					{ className: 'text hour-12 am' + (am ? ' yes' : ''),
						onClick: this.onAMPMSelected.bind(this, true, popoverType),
						x: 0,
						y: 0 },
					'AM'
				),
				React.createElement(
					'text',
					{ className: 'text hour-12 pm' + (am ? '' : ' yes'),
						onClick: this.onAMPMSelected.bind(this, false, popoverType),
						x: NDateTime.CLOCK_RADIUS * 2,
						y: 0 },
					'PM'
				),
				React.createElement(
					'text',
					{ className: 'text hour-12 top-num',
						x: NDateTime.CLOCK_CHAR_POS.TOP.X,
						y: NDateTime.CLOCK_CHAR_POS.TOP.Y + NDateTime.CLOCK_RADIUS - hourRadius },
					'0'
				),
				React.createElement(
					'text',
					{ className: 'text hour-12 left-num',
						x: NDateTime.CLOCK_CHAR_POS.LEFT.X + NDateTime.CLOCK_RADIUS - hourRadius,
						y: NDateTime.CLOCK_CHAR_POS.LEFT.Y },
					'9'
				),
				React.createElement(
					'text',
					{ className: 'text hour-12 right-num',
						x: NDateTime.CLOCK_CHAR_POS.RIGHT.X - NDateTime.CLOCK_RADIUS + hourRadius,
						y: NDateTime.CLOCK_CHAR_POS.RIGHT.Y },
					'3'
				),
				React.createElement(
					'text',
					{ className: 'text hour-12 bottom-num',
						x: NDateTime.CLOCK_CHAR_POS.BOTTOM.X,
						y: NDateTime.CLOCK_CHAR_POS.BOTTOM.Y - NDateTime.CLOCK_RADIUS + hourRadius },
					'6'
				),
				[30, 60, 120, 150, 210, 240, 300, 330].map(function (degree) {
					return _this.renderEngrave(degree, hourRadius, NDateTime.CLOCK_SMALL_ENGRAVE_LENGTH, 'big', NDateTime.CLOCK_RADIUS);
				})
			);
		},
		render24HourDial: function () {
			var _this = this;
			var hourRadius = this.getHourRadius();
			return React.createElement(
				'g',
				{ key: 'hour-24-dial' },
				React.createElement(
					'text',
					{ className: 'text hour-24 top-num',
						x: NDateTime.CLOCK_CHAR_POS.TOP.X,
						y: NDateTime.CLOCK_CHAR_POS.TOP.Y + NDateTime.CLOCK_RADIUS - hourRadius },
					'0'
				),
				React.createElement(
					'text',
					{ className: 'text hour-24 left-num',
						x: NDateTime.CLOCK_CHAR_POS.LEFT.X + NDateTime.CLOCK_RADIUS - hourRadius,
						y: NDateTime.CLOCK_CHAR_POS.LEFT.Y },
					'18'
				),
				React.createElement(
					'text',
					{ className: 'text hour-24 right-num',
						x: NDateTime.CLOCK_CHAR_POS.RIGHT.X - NDateTime.CLOCK_RADIUS + hourRadius,
						y: NDateTime.CLOCK_CHAR_POS.RIGHT.Y },
					'6'
				),
				React.createElement(
					'text',
					{ className: 'text hour-24 bottom-num',
						x: NDateTime.CLOCK_CHAR_POS.BOTTOM.X,
						y: NDateTime.CLOCK_CHAR_POS.BOTTOM.Y - NDateTime.CLOCK_RADIUS + hourRadius },
					'12'
				),
				[45, 135, 225, 315].map(function (degree) {
					return _this.renderEngrave(degree, hourRadius, NDateTime.CLOCK_BIG_ENGRAVE_LENGTH, 'big', NDateTime.CLOCK_RADIUS);
				}),
				[15, 30, 60, 75, 105, 120, 150, 165, 195, 210, 240, 255, 285, 300, 330, 345].map(function (degree) {
					return _this.renderEngrave(degree, hourRadius, NDateTime.CLOCK_SMALL_ENGRAVE_LENGTH, 'small', NDateTime.CLOCK_RADIUS);
				})
			);
		},
		renderMinuteDial: function () {
			if (!this.hasMinute()) {
				// no minute need to display
				return null;
			}
			var _this = this;
			return React.createElement(
				'g',
				{ key: 'minute-dial' },
				React.createElement(
					'text',
					{ className: 'text minute top-num',
						x: NDateTime.CLOCK_CHAR_POS.TOP.X,
						y: NDateTime.CLOCK_CHAR_POS.TOP.Y },
					'0'
				),
				React.createElement(
					'text',
					{ className: 'text minute left-num',
						x: NDateTime.CLOCK_CHAR_POS.LEFT.X,
						y: NDateTime.CLOCK_CHAR_POS.LEFT.Y },
					'45'
				),
				React.createElement(
					'text',
					{ className: 'text minute right-num',
						x: NDateTime.CLOCK_CHAR_POS.RIGHT.X,
						y: NDateTime.CLOCK_CHAR_POS.RIGHT.Y },
					'15'
				),
				React.createElement(
					'text',
					{ className: 'text minute bottom-num',
						x: NDateTime.CLOCK_CHAR_POS.BOTTOM.X,
						y: NDateTime.CLOCK_CHAR_POS.BOTTOM.Y },
					'30'
				),
				[30, 60, 120, 150, 210, 240, 300, 330].map(function (degree) {
					return _this.renderEngrave(degree, NDateTime.CLOCK_RADIUS, NDateTime.CLOCK_BIG_ENGRAVE_LENGTH, 'big', NDateTime.CLOCK_RADIUS);
				}),
				[6, 12, 18, 24, 36, 42, 48, 54, 66, 72, 78, 84, 96, 102, 108, 114, 126, 132, 138, 144, 156, 162, 168, 174, 186, 192, 198, 204, 216, 222, 228, 234, 246, 252, 258, 264, 276, 282, 288, 294, 306, 312, 318, 324, 336, 342, 348, 354].map(function (degree) {
					return _this.renderEngrave(degree, NDateTime.CLOCK_RADIUS, NDateTime.CLOCK_SMALL_ENGRAVE_LENGTH, 'small', NDateTime.CLOCK_RADIUS);
				})
			);
		},
		renderHourHand: function (date, offset) {
			var hour = date.hour();
			var degree = null;
			if (this.is12Hour()) {
				degree = 450 - hour * 30;
			} else {
				degree = 450 - hour * 15;
			}
			var hourRadius = this.getHourRadius();
			return React.createElement('line', { x1: offset + NDateTime.CLOCK_HAND_OFFSET * Math.cos(Math.PI * 2 * (degree - 180) / 360),
				y1: offset - NDateTime.CLOCK_HAND_OFFSET * Math.sin(Math.PI * 2 * (degree - 180) / 360),
				x2: offset + (hourRadius - NDateTime.CLOCK_HAND_OFFSET) * Math.cos(Math.PI * 2 * degree / 360),
				y2: offset - (hourRadius - NDateTime.CLOCK_HAND_OFFSET) * Math.sin(Math.PI * 2 * degree / 360),
				className: 'hour-hand' });
		},
		renderMinuteHand: function (date, radius, offset) {
			if (!this.hasMinute()) {
				// no minute need to display
				return null;
			}
			var minute = date.minute();
			var degree = 450 - minute * 6;
			return React.createElement('line', { x1: offset + NDateTime.CLOCK_HAND_OFFSET * Math.cos(Math.PI * 2 * (degree - 180) / 360),
				y1: offset - NDateTime.CLOCK_HAND_OFFSET * Math.sin(Math.PI * 2 * (degree - 180) / 360),
				x2: offset + (radius - NDateTime.CLOCK_HAND_OFFSET) * Math.cos(Math.PI * 2 * degree / 360),
				y2: offset - (radius - NDateTime.CLOCK_HAND_OFFSET) * Math.sin(Math.PI * 2 * degree / 360),
				className: 'minute-hand' });
		},
		renderSecondHand: function (date, radius, offset) {
			var popoverType = this.guessDisplayFormatType();
			if (!this.hasSecond()) {
				// no minute need to display
				return null;
			}
			var _this = this;
			var second = date.second();
			var degree = 450 - second * 6;
			return React.createElement('line', { x1: offset + NDateTime.CLOCK_HAND_OFFSET * Math.cos(Math.PI * 2 * (degree - 180) / 360),
				y1: offset - NDateTime.CLOCK_HAND_OFFSET * Math.sin(Math.PI * 2 * (degree - 180) / 360),
				x2: offset + radius * Math.cos(Math.PI * 2 * degree / 360),
				y2: offset - radius * Math.sin(Math.PI * 2 * degree / 360),
				className: 'second-hand' });
		},
		renderTime: function (date, popoverType) {
			var _this = this;
			var allPopoverType = this.guessDisplayFormatType();
			if (!this.hasTimeToDisplay(allPopoverType)) {
				return null;
			}
			var styles = {
				float: 'left',
				width: this.hasDateToDisplay(allPopoverType) ? '50%' : '100%'
			};
			var titleFormat = 'HH';
			if (this.hasSecond()) {
				titleFormat = 'HH:mm:ss';
			} else if (this.hasMinute()) {
				titleFormat = 'HH:mm';
			}
			var hiddenWhenMobile = this.state.dateViewWhenMobilePhone ? ' hidden' : '';
			return React.createElement(
				'div',
				{ className: 'time-view' + hiddenWhenMobile, style: styles },
				React.createElement(
					'div',
					{ className: 'calendar-header' },
					date.format(titleFormat)
				),
				React.createElement(
					'div',
					{ className: 'calendar-body' },
					React.createElement(
						'div',
						{ className: 'time-view-body-body' },
						React.createElement(
							'div',
							{ style: { height: NDateTime.CLOCK_RADIUS * 2, width: NDateTime.CLOCK_RADIUS * 2, position: 'relative' } },
							React.createElement(
								'svg',
								{ className: 'clock',
									height: NDateTime.CLOCK_RADIUS * 2,
									width: NDateTime.CLOCK_RADIUS * 2 },
								this.renderMinuteDial(),
								this.is12Hour() ? this.render12HourDial(date, popoverType) : this.render24HourDial(),
								this.renderHourHand(date, NDateTime.CLOCK_RADIUS),
								this.renderMinuteHand(date, NDateTime.CLOCK_RADIUS, NDateTime.CLOCK_RADIUS),
								this.renderSecondHand(date, NDateTime.CLOCK_RADIUS, NDateTime.CLOCK_RADIUS)
							),
							React.createElement('div', { style: { position: 'absolute',
									backgroundColor: 'transparent',
									top: 0,
									left: 0,
									height: NDateTime.CLOCK_RADIUS * 2,
									width: NDateTime.CLOCK_RADIUS * 2 },
								onClick: this.onClockClicked.bind(this, popoverType) })
						)
					)
				)
			);
		},
		renderPopoverContent: function (options) {
			var date = options ? options.date : null;
			var popoverType = options ? options.type : null;
			date = date ? date : this.getValueFromModel();
			date = date ? date : this.getToday();
			if (popoverType == null) {
				popoverType = this.getInitialPopoverType() || this.guessDisplayFormatType();
				if (this.isMobilePhone() && this.hasDateToDisplay(popoverType)) {
					// first time show in mobile phone
					this.state.dateViewWhenMobilePhone = true;
				}
			}
			var styles = {
				float: 'left',
				width: this.hasTimeToDisplay(this.guessDisplayFormatType()) ? '50%' : '100%'
			};
			if ((popoverType & NDateTime.FORMAT_TYPES.DAY) != 0) {
				// has day, YMD
				this.startClockInterval(NDateTime.FORMAT_TYPES.DAY, date);
				return React.createElement(
					'div',
					{ className: 'popover-content row' },
					React.createElement(
						'div',
						{ className: 'date-view', style: styles },
						this.renderDayHeader(date),
						this.renderDayBody(date)
					),
					this.renderTime(date, NDateTime.FORMAT_TYPES.DAY),
					this.renderPopoverContentFooter(this.getToday(), NDateTime.FORMAT_TYPES.DAY)
				);
			} else if ((popoverType & NDateTime.FORMAT_TYPES.MONTH) != 0) {
				// has month, YM
				this.startClockInterval(NDateTime.FORMAT_TYPES.MONTH, date);
				return React.createElement(
					'div',
					{ className: 'popover-content row' },
					React.createElement(
						'div',
						{ className: 'date-view', style: styles },
						this.renderMonthHeader(date),
						this.renderMonthBody(date)
					),
					this.renderTime(date, NDateTime.FORMAT_TYPES.MONTH),
					this.renderPopoverContentFooter(this.getToday(), NDateTime.FORMAT_TYPES.MONTH)
				);
			} else if ((popoverType & NDateTime.FORMAT_TYPES.YEAR) != 0) {
				// has year, YEAR
				this.startClockInterval(NDateTime.FORMAT_TYPES.YEAR, date);
				return React.createElement(
					'div',
					{ className: 'popover-content row' },
					React.createElement(
						'div',
						{ className: 'date-view', style: styles },
						this.renderYearHeader(date),
						this.renderYearBody(date)
					),
					this.renderTime(date, NDateTime.FORMAT_TYPES.YEAR),
					this.renderPopoverContentFooter(this.getToday(), NDateTime.FORMAT_TYPES.YEAR)
				);
			} else {
				this.startClockInterval(popoverType, date);
				// only time
				return React.createElement(
					'div',
					{ className: 'popover-content row' },
					this.renderTime(date, this.guessDisplayFormatType()),
					this.renderPopoverContentFooter(this.getToday(), popoverType)
				);
			}
		},
		isPopoverMatchComponentWidth: function () {
			return false;
		},
		hasPopoverContentWrapper: function () {
			return false;
		},
		getPopoverContainerCSS: function () {
			var displayFormatType = this.guessDisplayFormatType();
			return $pt.LayoutHelper.classSet({
				'n-datetime': true,
				'time-only': !this.hasDateToDisplay(displayFormatType) && this.hasTimeToDisplay(displayFormatType),
				'date-only': this.hasDateToDisplay(displayFormatType) && !this.hasTimeToDisplay(displayFormatType),
				'date-and-time': this.hasDateToDisplay(displayFormatType) && this.hasTimeToDisplay(displayFormatType)
			});
		},
		beforeRenderPopover: function (options) {
			if (!options) {
				options = {};
			}
			if (options.set) {
				this.setValueToModel(options.date);
			}
		},
		beforeDestoryPopover: function () {
			this.stopClockInterval();
		},
		stopClockInterval: function () {
			if (this.state.clockInterval) {
				clearTimeout(this.state.clockInterval.handler);
				this.state.clockInterval = null;
			}
		},
		startClockInterval: function (popoverType, currentTime) {
			if (!this.getComponentOption('runClock', true)) {
				return;
			}
			var value = this.getValueFromModel();
			if (value == null) {
				this.stopClockInterval();
				this.state.clockInterval = {
					handler: setTimeout(function () {
						this.renderPopover({ date: currentTime.add(1, 's'), type: popoverType });
					}.bind(this), 1000),
					type: popoverType
				};
			} else {
				this.stopClockInterval();
			}
		},
		/**
   * check display type has time or not
   * @returns {boolean}
   */
		hasTimeToDisplay: function (type) {
			if (typeof type === 'undefined') {
				type = this.guessDisplayFormatType();
			}
			return (type & (NDateTime.FORMAT_TYPES.HOUR | NDateTime.FORMAT_TYPES.MINUTE | NDateTime.FORMAT_TYPES.SECOND | NDateTime.FORMAT_TYPES.MILLSECOND)) != 0;
		},
		/**
   * check display type has date or not
   * @returns {boolean}
   */
		hasDateToDisplay: function (type) {
			if (typeof type === 'undefined') {
				type = this.guessDisplayFormatType();
			}
			return (type & NDateTime.FORMAT_TYPES.YMD) != 0;
		},
		/**
   * guess display format type
   * @returns {number} format type
   * @see NDateTime.FORMAT_TYPES
   */
		guessDisplayFormatType: function () {
			var format = this.getPrimaryDisplayFormat();
			var hasYear = format.indexOf('Y') != -1;
			var hasMonth = format.indexOf('M') != -1;
			var hasDay = format.indexOf('D') != -1;

			var hasHour = format.indexOf('H') != -1;
			var hasMinute = format.indexOf('m') != -1;
			var hasSecond = format.indexOf('s') != -1;
			var hasMillsecond = format.indexOf('S') != -1;

			return (hasYear ? NDateTime.FORMAT_TYPES.YEAR : 0) + (hasMonth ? NDateTime.FORMAT_TYPES.MONTH : 0) + (hasDay ? NDateTime.FORMAT_TYPES.DAY : 0) + (hasHour ? NDateTime.FORMAT_TYPES.HOUR : 0) + (hasMinute ? NDateTime.FORMAT_TYPES.MINUTE : 0) + (hasSecond ? NDateTime.FORMAT_TYPES.SECOND : 0) + (hasMillsecond ? NDateTime.FORMAT_TYPES.MILLSECOND : 0);
		},
		onCalendarButtonClicked: function () {
			if (!this.isEnabled() || this.isViewMode()) {
				// do nothing
				return;
			}
			this.showPopover();
			if (!this.isMobilePhone()) {
				this.getTextInput().focus();
			} else {
				this.getTextInput().blur();
			}
		},
		onTextInputFocused: function () {
			$(ReactDOM.findDOMNode(this.refs.focusLine)).toggleClass('focus');
			$(ReactDOM.findDOMNode(this.refs.normalLine)).toggleClass('focus');
		},
		onTextInputBlurred: function () {
			$(ReactDOM.findDOMNode(this.refs.focusLine)).toggleClass('focus');
			$(ReactDOM.findDOMNode(this.refs.normalLine)).toggleClass('focus');

			var text = this.getTextInput().val();
			if (text.length == 0 || text.isBlank()) {
				this.setValueToModel(null);
			} else {
				var date = this.convertValueFromString(text, this.getDisplayFormat());
				if (date == null && text.length != 0) {
					// invalid date
					this.setValueToModel(null);
					this.setValueToTextInput(null);
				} else {
					this.setValueToModel(date);
					this.setValueToTextInput(this.getValueFromModel());
				}
			}
		},
		onYearSelected: function (date) {
			this.setValueToModel(date);
			var type = this.guessDisplayFormatType();
			// no time display and only year display, hide
			if (!this.hasTimeToDisplay(type) && (type & NDateTime.FORMAT_TYPES.MONTH) == 0) {
				this.hidePopover();
			} else {
				this.renderPopover({ date: date, type: NDateTime.FORMAT_TYPES.MONTH });
			}
		},
		onMonthSelected: function (date) {
			this.setValueToModel(date);
			var type = this.guessDisplayFormatType();
			// no time display and no day display, hide
			if (!this.hasTimeToDisplay(type) && (type & NDateTime.FORMAT_TYPES.DAY) == 0) {
				this.hidePopover();
			} else {
				this.renderPopover({ date: date, type: NDateTime.FORMAT_TYPES.DAY });
			}
		},
		onDaySelected: function (date) {
			this.setValueToModel(date);
			var type = this.guessDisplayFormatType();
			// no time display, hide
			if (!this.hasTimeToDisplay(type)) {
				this.hidePopover();
			} else {
				this.renderPopover({ date: date, type: NDateTime.FORMAT_TYPES.DAY });
			}
		},
		onClockClicked: function (popoverType, evt) {
			var offset = $(evt.target).offset();
			// be careful of the quadrant
			var point = {
				x: evt.pageX - offset.left - NDateTime.CLOCK_RADIUS,
				y: NDateTime.CLOCK_RADIUS - (evt.pageY - offset.top)
			};
			// window.console.log('Mouse Point: ' + point.x + ',' + point.y);
			// calculate the radius length of point
			var length = Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2));
			// window.console.log('Point radius: ' + length);

			// calculate it is what
			if (length > 101) {
				// do nothing
				return;
			}
			var eventType = NDateTime.FORMAT_TYPES.SECOND;
			if (length > NDateTime.CLOCK_RADIUS - NDateTime.CLOCK_HAND_OFFSET) {
				// change second or minute or hour
				if (this.hasSecond()) {
					eventType = NDateTime.FORMAT_TYPES.SECOND;
				} else if (this.hasMinute()) {
					eventType = NDateTime.FORMAT_TYPES.MINUTE;
				} else {
					eventType = NDateTime.FORMAT_TYPES.HOUR;
				}
			} else if (length > NDateTime.CLOCK_RADIUS * NDateTime.CLOCK_HOUR_PERCENTAGE) {
				// change minute or hour
				if (this.hasMinute()) {
					eventType = NDateTime.FORMAT_TYPES.MINUTE;
				} else {
					eventType = NDateTime.FORMAT_TYPES.HOUR;
				}
			} else {
				// change hour
				eventType = NDateTime.FORMAT_TYPES.HOUR;
			}
			// window.console.log('Event Type: ' + eventType);

			// calculate degree in coordinate system
			var degree = 0;
			if (point.x == 0) {
				degree = point.y >= 0 ? 90 : 270;
			} else {
				// atan is from -Math.PI/2 to Math.PI/2
				degree = Math.atan(point.y / point.x) * 180 / Math.PI;
				// transform to coordinate system degree
				if (point.x > 0 && point.y >= 0) {
					// do nothing
				} else if (point.x < 0) {
					degree += 180;
				} else {
					degree += 360;
				}
			}
			// transform to real clock coordinate system
			if (degree <= 90) {
				degree = 90 - degree;
			} else {
				degree = 450 - degree;
			}
			// window.console.log('Degree: ' + degree);

			var currentHour, hour, minute, second;
			var date = this.getValueFromModel();
			date = date == null ? this.getToday() : date;
			currentHour = date.hour();
			if (eventType == NDateTime.FORMAT_TYPES.SECOND) {
				second = Math.floor(degree / 6) + (degree % 6 < 3 ? 0 : 1);
				date.second(second);
			} else if (eventType == NDateTime.FORMAT_TYPES.MINUTE) {
				minute = Math.floor(degree / 6) + (degree % 6 < 3 ? 0 : 1);
				date.minute(minute);
			} else if (this.is12Hour()) {
				hour = Math.floor(degree / 30) + (degree % 30 < 15 ? 0 : 1);
				date.hour(currentHour <= 11 ? hour : hour + 12);
			} else {
				hour = Math.floor(degree / 15) + (degree % 15 < 7.5 ? 0 : 1);
				date.hour(hour);
			}
			// window.console.log('Hour: [' + hour + '], Minute: [' + minute + '], Second: [' + second + ']');
			this.renderPopover({ date: date, type: popoverType, set: true });
		},
		onAMPMSelected: function (isAM, type) {
			var value = this.getValueFromModel();
			value = value == null ? this.getToday() : value;
			var hour = value.hour();
			if (isAM) {
				hour = hour > 11 ? hour - 12 : hour;
			} else {
				hour = hour <= 11 ? hour + 12 : hour;
			}
			value.hour(hour);
			this.setValueToModel(value);

			this.renderPopover({ date: value, type: type });
		},
		switchToTimeViewOnMobile: function (evt) {
			var target = $(evt.target);
			if (target[0].tagName === 'SPAN') {
				target = target.closest('a');
			}
			target.addClass('hidden').siblings('.date-switch').removeClass('hidden');
			this.state.dateViewWhenMobilePhone = false;
			var parent = target.closest('.popover-content');
			parent.children('.time-view').removeClass('hidden');
			parent.children('.date-view').addClass('hidden');
		},
		switchToDateViewOnMobile: function (evt) {
			var target = $(evt.target);
			if (target[0].tagName === 'SPAN') {
				target = target.closest('a');
			}
			target.addClass('hidden').siblings('.time-switch').removeClass('hidden');
			this.state.dateViewWhenMobilePhone = true;
			var parent = target.closest('.popover-content');
			parent.children('.time-view').addClass('hidden');
			parent.children('.date-view').removeClass('hidden');
		},
		onTextInputChange: function () {
			// since the text input might be incorrect date format,
			// or use un-strict mode to format
			// cannot know the result of moment format
			// move process to changing at blur event
			var text = this.getTextInput().val();
			if (text.length == 0 || text.isBlank()) {
				this.setValueToModel(null);
			} else {
				var date = this.convertValueFromString(text, this.getDisplayFormat(), true);
				if (date == null && text.length != 0) {
					// TODO invalid date, do nothing now. donot know how to deal with it...
				} else {
					this.setValueToModel(date);
				}
			}
		},
		onModelChanged: function (evt) {
			var newValue = evt.new;
			var text = this.getTextInput().val();
			if (newValue == null || (newValue + '').isBlank()) {
				if (text == null || text.isBlank()) {
					// do nothing
				} else {
					this.forceUpdate();
				}
			} else {
				var valueDate = this.getValueFromModel();
				var textDate = this.convertValueFromString(text, this.getDisplayFormat(), true);
				if (valueDate.isSame(textDate)) {
					// do nothing
				} else {
					this.forceUpdate();
				}
			}
		},
		getValueFromModel: function () {
			return this.convertValueFromString(this.getModel().get(this.getDataId()));
		},
		setValueToModel: function (value) {
			var formattedValue = value;
			if (value != null) {
				if (typeof value === 'string') {
					if (value.isBlank()) {
						formattedValue = null;
					} else {
						formattedValue = moment(value, this.getPrimaryDisplayFormat()).format(this.getValueFormat());
					}
				} else {
					formattedValue = value.format(this.getPrimaryDisplayFormat());
					formattedValue = moment(formattedValue, this.getPrimaryDisplayFormat()).format(this.getValueFormat());
				}
			}
			this.getModel().set(this.getDataId(), formattedValue);
		},
		setValueToTextInput: function (value) {
			this.getTextInput().val(this.convertValueToString(value, this.getPrimaryDisplayFormat()));
		},
		/**
   * convert value from string
   * @param value {string}
   * @param format {string} optional, use value format if not passed
   * @returns {moment}
   */
		convertValueFromString: function (value, format, useStrict) {
			var date = value == null || value.isBlank() ? null : moment(value, format ? format : this.getValueFormat(), this.getLocale(), useStrict === true ? true : undefined);
			return date == null || !date.isValid() ? null : date;
		},
		/**
   * convert value to string
   * @param value {moment}
   * @param format {string} optional, use value format if not passed
   * @returns {string}
   */
		convertValueToString: function (value, format) {
			return value == null ? null : value.format(format ? format : this.getValueFormat());
		},
		/**
   * get first day of week
   * returns {number} 0-6, sunday to saturday
   */
		getFirstDayOfWeek: function () {
			return this.getMomentLocaleData().firstDayOfWeek();
		},
		/**
   * get day of week.
   * returns {number} 0-6, sunday to saturday
   */
		getDayOfWeek: function (date) {
			return date.day();
		},
		/**
   * get days count of month
   * @returns {number}
   */
		getDaysOfMonth: function (date) {
			var month = date.month() + 1;
			switch (month) {
				case 1:case 3:case 5:case 7:case 8:case 10:case 12:
					return 31;
				case 4:case 6:case 9:case 11:
					return 30;
				case 2:
					return date.isLeapYear() ? 29 : 28;
				default:
					// never run to here
					window.console.warn('Something wrong with momentjs.');
					window.console.warn(date);
					return 31;
			}
		},
		getComponent: function () {
			return $(ReactDOM.findDOMNode(this.refs.comp));
		},
		getTextInput: function () {
			return $(ReactDOM.findDOMNode(this.refs.text));
		},
		/**
   * get display format
   * @returns {string}
   */
		getDisplayFormat: function () {
			var format = this.getComponentOption('format');
			return format ? format : NDateTime.FORMAT;
		},
		getPrimaryDisplayFormat: function () {
			var format = this.getDisplayFormat();
			if (Array.isArray(format)) {
				return format[0];
			} else {
				return format;
			}
		},
		getHeaderMonthFormat: function () {
			var format = this.getComponentOption('headerMonthFormat');
			return format ? format : NDateTime.HEADER_MONTH_FORMAT;
		},
		getHeaderYearFormat: function () {
			var format = this.getComponentOption('headerYearFormat');
			return format ? format : NDateTime.HEADER_YEAR_FORMAT;
		},
		getBodyYearFormat: function () {
			return this.getComponentOption('bodyYearFormat');
		},
		getMinDate: function () {
			var min = this.getComponentOption('min');
			if (min == null) {
				min = moment('0001-01-01');
			} else if (typeof min === 'function') {
				min = min.call(this);
			}
			return min;
		},
		getMaxDate: function () {
			var max = this.getComponentOption('max');
			if (max == null) {
				max = moment('9999-12-31');
			} else if (typeof max === 'function') {
				max = max.call(this);
			}
			return max;
		},
		/**
   * get value format
   * @returns {string}
   */
		getValueFormat: function () {
			var valueFormat = this.getComponentOption('valueFormat');
			return valueFormat ? valueFormat : NDateTime.VALUE_FORMAT;
		},
		is12Hour: function () {
			// seems mobile doesn't support event on svg and its inner nodes
			// so doesn't support 12 hours format in mobile equipments
			return this.getComponentOption('hour') == 12 && !this.isMobile();
		},
		getHourRadius: function () {
			var hourRadius = NDateTime.CLOCK_RADIUS;
			if (this.hasMinute()) {
				// with minute and second
				hourRadius *= NDateTime.CLOCK_HOUR_PERCENTAGE;
			}
			return hourRadius;
		},
		hasYear: function () {
			return (this.guessDisplayFormatType() & NDateTime.FORMAT_TYPES.YEAR) != 0;
		},
		hasMonth: function () {
			return (this.guessDisplayFormatType() & NDateTime.FORMAT_TYPES.MONTH) != 0;
		},
		hasDay: function () {
			return (this.guessDisplayFormatType() & NDateTime.FORMAT_TYPES.DAY) != 0;
		},
		hasHour: function () {
			return (this.guessDisplayFormatType() & NDateTime.FORMAT_TYPES.HOUR) != 0;
		},
		hasMinute: function () {
			return (this.guessDisplayFormatType() & NDateTime.FORMAT_TYPES.MINUTE) != 0;
		},
		hasSecond: function () {
			return (this.guessDisplayFormatType() & NDateTime.FORMAT_TYPES.SECOND) != 0;
		},
		/**
   * get icon definition by given icon key
   * @returns {string}
   */
		getIcon: function (key) {
			return this.getComponentOption('icons')[key];
		},
		getTextInViewMode: function () {
			return this.convertValueToString(this.getValueFromModel(), this.getPrimaryDisplayFormat());
		},
		getLocale: function () {
			return this.getComponentOption('locale');
		},
		getMomentLocaleData: function () {
			return moment.localeData(this.getLocale());
		},
		getToday: function () {
			var today = moment().locale(this.getLocale());
			var defaultTime = this.getComponentOption('defaultTime');
			if (defaultTime) {
				if (typeof defaultTime === 'function') {
					today = defaultTime.call(this, today);
				} else {
					today = defaultTime;
				}
			}
			return today;
		},
		getInitialPopoverType: function () {
			return this.getComponentOption('popoverType');
		}
	}));

	$pt.Components.NDateTime = NDateTime;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.Date, function (model, layout, direction, viewMode) {
		return React.createElement($pt.Components.NDateTime, $pt.LayoutHelper.transformParameters(model, layout, direction, viewMode));
	});
})(window, jQuery, moment, React, ReactDOM, $pt);

/**
 * exception modal dialog
 * z-index is 9999 and 9998, the max z-index.
 */
(function (window, $, React, ReactDOM, $pt) {
	var NExceptionModal = React.createClass({
		displayName: 'NExceptionModal',
		statics: {
			getExceptionModal: function (className) {
				if ($pt.exceptionDialog === undefined || $pt.exceptionDialog === null) {
					// must initial here. since the function will execute immediately after load,
					// and NExceptionModal doesn't defined in that time
					var exceptionContainer = $("#exception_modal_container");
					if (exceptionContainer.length == 0) {
						$("<div id='exception_modal_container' />").appendTo($(document.body));
					}
					$pt.exceptionDialog = ReactDOM.render(React.createElement($pt.Components.NExceptionModal, { className: className }), document.getElementById("exception_modal_container"));
				}
				return $pt.exceptionDialog;
			},
			TITLE: 'Exception Raised...',
			Z_INDEX: 9998
		},
		propTypes: {
			className: React.PropTypes.string
		},
		getDefaultProps: function () {
			return {};
		},
		getInitialState: function () {
			return {
				visible: false
			};
		},
		/**
   * set z-index
   */
		fixDocumentPadding: function () {
			document.body.style.paddingRight = 0;
		},
		/**
   * did update
   * @param prevProps
   * @param prevState
   */
		componentDidUpdate: function (prevProps, prevState) {
			this.fixDocumentPadding();
			if (this.state.visible) {
				$(document).on('keyup', this.onDocumentKeyUp);
			} else {
				$(document).off('keyup', this.onDocumentKeyUp);
			}
		},
		/**
   * did mount
   */
		componentDidMount: function () {
			this.fixDocumentPadding();
			if (this.state.visible) {
				$(document).on('keyup', this.onDocumentKeyUp);
			} else {
				$(document).off('keyup', this.onDocumentKeyUp);
			}
		},
		componentWillUpdate: function () {
			$(document).off('keyup', this.onDocumentKeyUp);
		},
		componentWillUnmount: function () {
			$(document).off('keyup', this.onDocumentKeyUp);
		},
		/**
   * render content
   */
		renderContent: function () {
			var status = this.state.status;
			var statusMessage = $pt.ComponentConstants.Http_Status[status];
			var message = this.state.message;
			return React.createElement(
				"div",
				null,
				React.createElement(
					"h6",
					null,
					status,
					": ",
					statusMessage
				),
				message != null ? React.createElement(
					"pre",
					null,
					message
				) : null
			);
		},
		/**
   * render
   * @returns {*}
   */
		render: function () {
			if (!this.state.visible) {
				return null;
			}

			var css = {
				'n-exception-modal': true,
				modal: true,
				fade: true,
				in: true
			};
			if (this.props.className) {
				css[this.props.className] = true;
			}
			return React.createElement(
				"div",
				null,
				React.createElement("div", { className: "modal-backdrop fade in", style: { zIndex: NExceptionModal.Z_INDEX } }),
				React.createElement(
					"div",
					{ className: $pt.LayoutHelper.classSet(css),
						tabIndex: "-1",
						role: "dialog",
						ref: "container",
						style: { display: 'block', zIndex: NExceptionModal.Z_INDEX + 1 } },
					React.createElement(
						"div",
						{ className: "modal-danger modal-dialog", tabIndex: "0" },
						React.createElement(
							"div",
							{ className: "modal-content", role: "document" },
							React.createElement(
								"div",
								{ className: "modal-header" },
								React.createElement(
									"button",
									{ className: "close",
										onClick: this.hide,
										"aria-label": "Close",
										style: { marginTop: '-2px' } },
									React.createElement(
										"span",
										{ "aria-hidden": "true" },
										"\xD7"
									)
								),
								React.createElement(
									"h4",
									{ className: "modal-title" },
									NExceptionModal.TITLE
								)
							),
							React.createElement(
								"div",
								{ className: "modal-body" },
								this.renderContent()
							)
						)
					)
				)
			);
		},
		onDocumentKeyUp: function (evt) {
			if (evt.keyCode === 27) {
				// escape
				this.hide();
			} else if (evt.keyCode === 9) {
				// tab
				// evt.preventDefault();
				var target = $(evt.target);
				var container = $(this.refs.container);
				if (target.closest(container).length == 0) {
					container.focus();
				}
			}
		},
		/**
   * hide dialog
   */
		hide: function () {
			this.setState({ visible: false, status: null, message: null });
		},
		/**
   * show dialog
   * @param status http status
   * @param message error message
   */
		show: function (status, message) {
			$(':focus').blur();
			this.setState({ visible: true, status: status, message: message });
		}
	});
	$pt.Components.NExceptionModal = NExceptionModal;
})(window, jQuery, React, ReactDOM, $pt);

(function (window, $, React, ReactDOM, $pt) {
	var NFile = React.createClass($pt.defineCellComponent({
		displayName: 'NFile',
		statics: {
			// PROPERTY_LIST: {
			// 	ajaxDeleteSettings: null,
			// 	ajaxSettings: null,
			// 	allowedFileExtensions: null,
			// 	allowedFileTypes: null,
			// 	allowedPreviewMimeTypes: null,
			// 	allowedPreviewTypes: null,
			// 	autoReplace: null,
			// 	browseClass: null,
			// 	browseIcon: null,
			// 	browseLabel: null,
			// 	browseOnZoneClick: null,
			// 	buttonLabelClass: null,
			// 	captionClass: null,
			// 	customLayoutTags: null,
			// 	customPreviewTags: null,
			// 	defaultPreviewContent: null,
			// 	deleteExtraData: null,
			// 	deleteUrl: null,
			// 	dropZoneClickTitle: null,
			// 	dropZoneEnabled: null,
			// 	dropZoneTitle: null,
			// 	dropZoneTitleClass: null,
			// 	fileActionSettings: null,
			// 	fileSizeGetter: null,
			// 	fileTypeSettings: null,
			// 	initialCaption: null,
			// 	initialPreview: null,
			// 	initialPreviewAsData: null,
			// 	initialPreviewConfig: null,
			// 	initialPreviewCount: null,
			// 	initialPreviewDelimiter: null,
			// 	initialPreviewFileType: null,
			// 	initialPreviewShowDelete: null,
			// 	initialPreviewThumbTags: null,
			// 	language: null,
			// 	layoutTemplates: null,
			// 	mainClass: null,
			// 	maxFileCount: null,
			// 	maxFileSize: null,
			// 	maxImageHeight: null,
			// 	maxImageWidth: null,
			// 	maxPreviewFileSize: null,
			// 	minFileCount: null,
			// 	minImageHeight: null,
			// 	minImageWidth: null,
			// 	msgCancelled: null,
			// 	msgErrorClass: null,
			// 	msgFileNotFound: null,
			// 	msgFileNotReadable: null,
			// 	msgFilePreviewAborted: null,
			// 	msgFilePreviewError: null,
			// 	msgFileSecured: null,
			// 	msgFilesTooLess: null,
			// 	msgFilesTooMany: null,
			// 	msgFoldersNotAllowed: null,
			// 	msgImageHeightLarge: null,
			// 	msgImageHeightSmall: null,
			// 	msgImageWidthLarge: null,
			// 	msgImageWidthSmall: null,
			// 	msgInvalidFileExtension: null,
			// 	msgInvalidFileType: null,
			// 	msgLoading: null,
			// 	msgNo: null,
			// 	msgProgress: null,
			// 	msgSelected: null,
			// 	msgSizeTooLarge: null,
			// 	msgUploadAborted: null,
			// 	msgValidationError: null,
			// 	msgValidationErrorClass: null,
			// 	msgValidationErrorIcon: null,
			// 	msgZoomModalHeading: null,
			// 	msgZoomTitle: null,
			// 	otherActionButtons: null,
			// 	overwriteInitial: null,
			// 	previewClass: null,
			// 	previewFileExtSettings: null,
			// 	previewFileIcon: null,
			// 	previewFileIconClass: null,
			// 	previewFileIconSettings: null,
			// 	previewFileType: null,
			// 	previewSettings: null,
			// 	previewTemplates: null,
			// 	previewThumbTags: null,
			// 	previewZoomButtonClasses: null,
			// 	previewZoomButtonIcons: null,
			// 	previewZoomButtonTitles: null,
			// 	previewZoomSettings: null,
			// 	progressClass: null,
			// 	progressCompleteClass: null,
			// 	progressErrorClass: null,
			// 	purifyHtml: null,
			// 	removeClass: null,
			// 	resizeDefaultImageType: null,
			// 	removeIcon: null,
			// 	removeLabel: null,
			// 	removeFromPreviewOnError: null,
			// 	removeTitle: null,
			// 	resizeImage: null,
			// 	resizeImageQuality: null,
			// 	resizePreference: null,
			// 	showBrowse: null,
			// 	showAjaxErrorDetails: null,
			// 	showCaption: null,
			// 	showCancel: null,
			// 	showClose: null,
			// 	showPreview: null,
			// 	showRemove: null,
			// 	showUpload: null,
			// 	showUploadedThumbs: null,
			// 	slugCallback: null,
			// 	textEncoding: null,
			// 	theme: null,
			// 	uploadAsync: null,
			// 	uploadClass: null,
			// 	uploadExtraData: null,
			// 	uploadIcon: null,
			// 	uploadLabel: null,
			// 	uploadTitle: null,
			// 	uploadUrl: null,
			// 	validateInitialCount: null,
			// 	zoomIndicator: null
			// },
			DEFAULT_PROPERTY_VALUES: {
				browseLabel: '',
				browseIcon: '<i class="fa fa-fw fa-folder-open-o"></i>',
				browseClass: 'btn btn-link',
				uploadLabel: '',
				uploadIcon: '<i class="fa fa-fw fa-upload"></i>',
				uploadClass: 'btn btn-link',
				removeLabel: '',
				removeIcon: '<i class="fa fa-fw fa-trash-o"></i>',
				removeClass: 'btn btn-link',
				showClose: false,
				showPreview: true
			},
			MOBILE_SETTINGS: {
				previewSettings: {
					image: { width: "80px", height: "80px" },
					html: { width: "80px", height: "80px" },
					text: { width: "80px", height: "80px" },
					video: { width: "80px", height: "80px" },
					audio: { width: "80px", height: "80px" },
					flash: { width: "80px", height: "80px" },
					object: { width: "80px", height: "80px" },
					other: { width: "80px", height: "80px" }
				},
				browseIcon: '<i class="fa fa-fw fa-plus-square"></i>',
				showCaption: true,
				layoutTemplates: {
					caption: '<span />',
					progress: '<span />'
				},
				showCancel: false,
				dropZoneEnabled: false
			}
		},
		getDefaultProps: function () {
			return {
				defaultOptions: {
					mobileEnabled: true,
					multiple: true,
					inputName: 'fileData'
				}
			};
		},
		getInitialState: function () {
			return {
				monitors: {}
			};
		},
		beforeDidMount: function () {
			var input = $(ReactDOM.findDOMNode(this.refs.file));
			input.fileinput(this.createDisplayOptions());
			// event monitor
			var _this = this;
			var monitors = this.getEventMonitor();
			Object.keys(monitors).forEach(function (eventKey) {
				_this.state.monitors[eventKey] = function () {
					var args = Array.prototype.slice.call(arguments);
					// attach this component to event object
					args[0].reactComponent = _this;
					monitors[eventKey].apply(this, args);
				};
				input.on(eventKey, _this.state.monitors[eventKey]);
			});

			var comp = $(ReactDOM.findDOMNode(this.refs.comp));
			comp.find('.kv-fileinput-caption').focus(this.onComponentFocused).blur(this.onComponentBlurred);
			comp.find('.input-group-btn>.btn').focus(this.onComponentFocused).blur(this.onComponentBlurred);
		},
		beforeWillUnmount: function () {
			var input = $(ReactDOM.findDOMNode(this.refs.file));
			// event monitor
			var monitors = this.getEventMonitor();
			Object.keys(this.state.monitors).forEach(function (eventKey) {
				input.off(eventKey, this.state.monitors[eventKey]);
			}.bind(this));
			// destroy the component
			input.fileinput('destroy');
		},
		render: function () {
			var css = {
				'n-disabled': !this.isEnabled()
			};
			css[this.getComponentCSS('n-file')] = true;
			css.mobile = this.isMobileEnabled();
			var inputCSS = {
				file: true
			};
			return React.createElement(
				'div',
				{ className: $pt.LayoutHelper.classSet(css), ref: 'comp' },
				React.createElement('input', { type: 'file',
					className: $pt.LayoutHelper.classSet(inputCSS),
					multiple: this.allowMultipleFiles(),
					disabled: !this.isEnabled(),
					name: this.getComponentOption('inputName'),
					ref: 'file' }),
				this.renderNormalLine(),
				this.renderFocusLine()
			);
		},
		createDisplayOptions: function () {
			var _this = this;
			// get all component options
			var options = this.getLayout().getComponentOption();
			Object.keys(options).filter(function (key) {
				// the component type should be filterred
				return ['type', 'multiple', 'inputName', 'mobileEnabled'].indexOf(key) == -1;
			}).forEach(function (key) {
				options[key] = _this.getComponentOption(key);
				// console.log(key, options[key]);
				if (options[key] == null) {
					var defaultValue = NFile.DEFAULT_PROPERTY_VALUES[key];
					// console.log(defaultValue);
					if (defaultValue) {
						options[key] = defaultValue;
					} else {
						delete options[key];
					}
				}
			});
			Object.keys(NFile.DEFAULT_PROPERTY_VALUES).forEach(function (key) {
				if (options[key] == null) {
					options[key] = NFile.DEFAULT_PROPERTY_VALUES[key];
				}
			});
			if (this.isMobileEnabled()) {
				Object.keys(NFile.MOBILE_SETTINGS).forEach(function (key) {
					var value = NFile.MOBILE_SETTINGS[key];
					if (value) {
						options[key] = value;
					}
				});
			}
			return options;
		},
		allowMultipleFiles: function () {
			return this.getComponentOption('multiple');
		},
		onComponentFocused: function () {
			$(ReactDOM.findDOMNode(this.refs.focusLine)).toggleClass('focus');
			$(ReactDOM.findDOMNode(this.refs.normalLine)).toggleClass('focus');
		},
		onComponentBlurred: function () {
			$(ReactDOM.findDOMNode(this.refs.focusLine)).toggleClass('focus');
			$(ReactDOM.findDOMNode(this.refs.normalLine)).toggleClass('focus');
		},
		isMobileEnabled: function () {
			return this.isMobile() && this.getComponentOption('mobileEnabled');
		}
	}));
	$pt.Components.NFile = NFile;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.File, function (model, layout, direction, viewMode) {
		return React.createElement($pt.Components.NFile, $pt.LayoutHelper.transformParameters(model, layout, direction, viewMode));
	});
})(window, jQuery, React, ReactDOM, $pt);

(function (window, $, React, ReactDOM, $pt) {
	var NForm = React.createClass({
		displayName: 'NForm',
		statics: {
			LABEL_DIRECTION: 'vertical'
		},
		getDefaultProps: function () {
			return {
				next: {
					icon: 'angle-double-right',
					text: 'Next',
					style: 'primary',
					labelPosition: 'left'
				},
				previous: {
					icon: 'angle-double-left',
					text: 'Previous',
					style: 'primary'
				}
			};
		},
		getInitialState: function () {
			return {
				activeCard: null,
				next: $.extend({}, this.props.next, {
					click: this.onNextClicked
				}),
				previous: $.extend({}, this.props.previous, {
					click: this.onPreviousClicked
				}),
				expanded: {}
			};
		},
		/**
   * will update
   * @param nextProps
   */
		componentWillUpdate: function (nextProps) {
			var _this = this;
			this.getLayout().getCards().forEach(function (card) {
				if (card.hasBadge()) {
					_this.getModel().removeListener(card.getBadgeId(), 'post', 'change', _this.onModelChanged);
				}
			});
		},
		/**
   * did update
   * @param prevProps
   * @param prevState
   */
		componentDidUpdate: function (prevProps, prevState) {
			var _this = this;
			this.getLayout().getCards().forEach(function (card) {
				if (card.hasBadge()) {
					_this.getModel().addListener(card.getBadgeId(), 'post', 'change', _this.onModelChanged);
				}
			});
		},
		/**
   * did mount
   */
		componentDidMount: function () {
			var _this = this;
			this.getLayout().getCards().forEach(function (card) {
				if (card.hasBadge()) {
					_this.getModel().addListener(card.getBadgeId(), 'post', 'change', _this.onModelChanged);
				}
			});
		},
		/**
   * will unmount
   */
		componentWillUnmount: function () {
			var _this = this;
			this.getLayout().getCards().forEach(function (card) {
				if (card.hasBadge()) {
					_this.getModel().removeListener(card.getBadgeId(), 'post', 'change', _this.onModelChanged);
				}
			});
		},
		/**
   * render sections
   * @param sections {[SectionLayout]}
   * @returns {XML}
   */
		renderSections: function (sections) {
			var layout = {};
			var _this = this;
			sections.forEach(function (section) {
				var cell = {
					label: section.getLabel(),
					comp: {
						type: $pt.ComponentConstants.Panel,
						style: section.getStyle(),
						expanded: section.isExpanded(),
						collapsible: section.isCollapsible(),
						visible: section.getVisible(),
						expandedLabel: section.getExpandedLabel(),
						collapsedLabel: section.getCollapsedLabel()
					},
					pos: {
						width: section.getWidth(),
						col: section.getColumnIndex(),
						row: section.getRowIndex()
					}
				};
				if (section.hasCheckInTitle()) {
					cell.comp.checkInTitle = {
						data: section.getCheckInTitleDataId(),
						collapsible: section.getCheckInTitleCollapsible(),
						label: section.getCheckInTitleLabel()
					};
					var otherOptions = section.getCheckInTitleOption();
					Object.keys(otherOptions).forEach(function (key) {
						cell.comp.checkInTitle[key] = otherOptions[key];
					});
				}
				cell.comp.editLayout = section.getCells();
				layout[_this.getSectionKey(section)] = cell;
			});
			var sectionLayout = {
				comp: {
					type: $pt.ComponentConstants.Panel,
					editLayout: layout
				},
				pos: {
					width: 12
				}
			};
			return React.createElement($pt.Components.NPanel, { model: this.getModel(),
				layout: $pt.createCellLayout(sections[0].getParentCard().getId() + '-body', sectionLayout),
				direction: this.getLabelDirection(),
				view: this.isViewMode() });
		},
		/**
   * attach previous button
   * @param left
   * @param card
   */
		attachPreviousButton: function (left, card) {
			if (this.getLayout().isCardButtonShown()) {
				// add default previous
				if (this.isPreviousCardBackable(card.getId())) {
					left.splice(0, 0, this.state.previous);
				} else {
					left.splice(0, 0, $.extend({
						enabled: false
					}, this.state.previous));
				}
			}
		},
		/**
   * attach next button
   * @param right {{}[]} right buttons definition
   */
		attachNextButton: function (right) {
			if (this.getLayout().isCardButtonShown()) {
				right.push(this.state.next);
			}
		},
		/**
   * wrap custom button
   * @param button {{successCallback: string, click: function}}
   * @returns {{}}
   */
		wrapCustomButton: function (button) {
			var _this = this;
			var newButton = $.extend({}, button);
			if (button.successCallback === 'next') {
				newButton.click = function (model) {
					if (button.click.call(_this, model)) {
						_this.onNextClicked();
					}
				};
			} else if (button.successCallback === 'prev') {
				newButton.click = function (model) {
					if (button.click.call(_this, model)) {
						_this.onPreviousClicked();
					}
				};
			} else if (button.successCallback === 'return') {
				newButton.click = function (model) {
					var cardId = button.click.call(_this, model);
					if (typeof cardId === 'string') {
						_this.jumpToCard(cardId);
					}
				};
			}
			return newButton;
		},
		/**
   * wrap custom buttons
   * @param buttons
   * @returns {{}[]}
   */
		wrapCustomButtons: function (buttons) {
			if (buttons == null) {
				return null;
			} else if (Array.isArray(buttons)) {
				var _this = this;
				return buttons.map(function (button) {
					return _this.wrapCustomButton(button);
				});
			} else {
				return [this.wrapCustomButton(buttons)];
			}
		},
		/**
   * render card
   * @param card {CardLayout}
   * @param isCards {boolean}
   * @param index {number}
   * @returns {XML}
   */
		renderCard: function (card, isCards, index) {
			var css = {
				'n-card': true
			};
			var right = [];
			right.push.apply(right, this.wrapCustomButtons(card.getRightButtons()));
			var left = [];
			left.push.apply(left, this.wrapCustomButtons(card.getLeftButtons()));
			var footer = null;
			if (isCards) {
				css['n-card-active'] = card.getId() == this.state.activeCard;
				if (index == 0) {
					// first card
					this.attachNextButton(right);
				} else if (index == this.props.layout.getCards().length - 1) {
					// last card
					this.attachPreviousButton(left, card);
					var finishButton = card.getFinishButton();
					if (finishButton) {
						right.push(finishButton);
					}
				} else {
					// middle cards
					this.attachPreviousButton(left, card);
					this.attachNextButton(right);
				}
			} else {
				// no cards, render sections directly
				css['n-card-active'] = true;
			}
			if (right.length != 0 || left.length != 0) {
				right = right.reverse();
				footer = React.createElement($pt.Components.NPanelFooter, { right: right, left: left, model: this.getModel(), view: this.isViewMode() });
			}
			return React.createElement(
				'div',
				{ className: $pt.LayoutHelper.classSet(css), key: index },
				this.renderSections(card.getSections()),
				footer
			);
		},
		/**
   * render badge
   * @param card
   * @returns {XML}
   */
		renderBadge: function (card) {
			if (card.hasBadge()) {
				var badgeRender = card.getBadgeRender();
				var badge = badgeRender ? badgeRender.call(this, this.getModel().get(card.getBadgeId()), this.getModel()) : this.getModel().get(card.getBadgeId());
				return React.createElement(
					'span',
					{ className: 'badge' },
					' ',
					badge
				);
			} else {
				return null;
			}
		},
		/**
   * render card title
   * @returns {XML}
   */
		renderWizards: function () {
			var css = $pt.LayoutHelper.classSet({
				'nav': true,
				'nav-justified': true,
				'nav-pills': true,
				'nav-direction-vertical': false,
				'n-cards-nav': true,
				'n-cards-free': this.isFreeCard()
			});
			var _this = this;
			return React.createElement(
				'ul',
				{ className: css, key: 'wizards' },
				this.getLayout().getCards().map(function (card, cardIndex) {
					var css = {
						active: card.getId() == _this.state.activeCard,
						before: _this.isBeforeActiveCard(card.getId()),
						after: _this.isAfterActiveCard(card.getId())
					};
					var click = null;
					if (_this.isFreeCard()) {
						click = function () {
							_this.jumpToCard(card.getId());
						};
					}
					var icon = null;
					if (card.getIcon() != null) {
						var iconCSS = {
							fa: true,
							'fa-fw': true
						};
						iconCSS['fa-' + card.getIcon()] = true;
						icon = React.createElement('span', { className: $pt.LayoutHelper.classSet(iconCSS) });
					}
					return React.createElement(
						'li',
						{ className: $pt.LayoutHelper.classSet(css), key: cardIndex },
						React.createElement(
							'a',
							{ href: 'javascript:void(0);', onClick: click },
							icon,
							' ',
							card.getLabel(),
							_this.renderBadge(card)
						)
					);
				})
			);
		},
		/**
   * render cards
   * @returns {[XML]}
   */
		renderCards: function () {
			var cards = this.getLayout().getCards();
			if (cards.length == 1) {
				// no card needs
				return this.renderCard(cards[0], false);
			} else {
				// cards need
				var _this = this;
				this.initActiveCard();
				var nodes = [];
				nodes.push(this.renderWizards());
				var index = 0;
				cards.forEach(function (card) {
					nodes.push(_this.renderCard(card, true, index));
					index++;
				});
				return nodes;
			}
		},
		/**
   * initialize active card
   */
		initActiveCard: function () {
			if (this.state.activeCard != null) {
				return;
			}
			var _this = this;
			var cards = this.getLayout().getCards();
			cards.forEach(function (card) {
				if (card.isActive()) {
					_this.state.activeCard = card.getId();
				}
			});
			if (!this.state.activeCard) {
				// no card active, set first card as active
				this.state.activeCard = cards[0].getId();
			}
		},
		/**
   * render
   * @returns {XML}
   */
		render: function () {
			var css = {
				'n-form': true
			};
			if (this.props.className) {
				css[this.props.className] = true;
			}
			return React.createElement(
				'div',
				{ className: $pt.LayoutHelper.classSet(css) },
				this.renderCards()
			);
		},
		/**
   * on model changed
   * @param evt
   */
		onModelChanged: function (evt) {
			this.forceUpdate();
		},
		/**
   * on previous clicked
   */
		onPreviousClicked: function () {
			var activeIndex = this.getActiveCardIndex();
			var prevCard = this.getLayout().getCards()[activeIndex - 1];
			if (this.isFreeCard() || prevCard.isBackable()) {
				this.setState({
					activeCard: prevCard.getId()
				});
			}
		},
		/**
   * on next clicked
   */
		onNextClicked: function () {
			var activeIndex = this.getActiveCardIndex();
			var nextCard = this.getLayout().getCards()[activeIndex + 1];
			this.setState({
				activeCard: nextCard.getId()
			});
		},
		/**
   * jump to card
   * @param cardId
   */
		jumpToCard: function (cardId) {
			this.setState({
				activeCard: cardId
			});
		},
		/**
   * get active card index
   * @param cardId optional, use activeCard if no parameter
   * @return {number}
   */
		getActiveCardIndex: function (cardId) {
			var activeCardId = cardId ? cardId : this.state.activeCard;
			var cards = this.getLayout().getCards();
			var activeIndex = 0;
			for (var index = 0, count = cards.length; index < count; index++) {
				if (cards[index].getId() == activeCardId) {
					activeIndex = index;
					break;
				}
			}
			return activeIndex;
		},
		/**
   * get section key
   * @param section
   * @returns {string}
   */
		getSectionKey: function (section) {
			return section.getParentCard().getId() + '-' + section.getId();
		},
		isViewMode: function () {
			var isViewMode = this.state ? this.state.isViewMode : null;
			if (isViewMode == null) {
				return this.props.view === true;
			} else {
				return isViewMode;
			}
		},
		isFreeCard: function () {
			return this.isViewMode() || this.getLayout().isFreeCard();
		},
		/**
   * is previous card backable
   * @param cardId
   * @return {*}
   */
		isPreviousCardBackable: function (cardId) {
			if (this.isFreeCard()) {
				return true;
			}

			var index = this.getActiveCardIndex(cardId);
			var cards = this.getLayout().getCards();
			return cards[index - 1].isBackable();
		},
		/**
   * check the given card is before active card or not
   * @param cardId
   * @returns {boolean}
   */
		isAfterActiveCard: function (cardId) {
			return this.getActiveCardIndex(cardId) - this.getActiveCardIndex() > 0;
		},
		/**
   * check the given card is after active card or not
   * @param cardId
   * @returns {boolean}
   */
		isBeforeActiveCard: function (cardId) {
			return this.getActiveCardIndex(cardId) - this.getActiveCardIndex() < 0;
		},
		/**
   * get model
   * @returns {*}
   */
		getModel: function () {
			return this.props.model;
		},
		getLabelDirection: function () {
			return this.props.direction ? this.props.direction : NForm.LABEL_DIRECTION;
		},
		/**
   * get layout
   * @returns {*}
   */
		getLayout: function () {
			return this.props.layout;
		},
		/**
   * get cell component, react class instance
   * @param key
   * @return {object}
   */
		getCellComponent: function (key) {
			var cell = this.refs[key];
			if (cell) {
				return cell.refs[key];
			}
			return null;
		}
	});
	$pt.Components.NForm = NForm;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.Form, function (model, layout, direction, viewMode) {
		var formLayout = $pt.createFormLayout(layout.getComponentOption('editLayout'));
		return React.createElement($pt.Components.NForm, $pt.LayoutHelper.transformParameters(model, formLayout, direction, viewMode));
	});
})(window, jQuery, React, ReactDOM, $pt);

/**
 * Created by brad.wu on 9/10/2015.
 */
(function (window, $, React, ReactDOM, $pt) {
	var NFormButtonFooter = React.createClass($pt.defineCellComponent({
		displayName: 'NFormButtonFooter',
		render: function () {
			var buttonLayout = this.getButtonLayout();
			return React.createElement($pt.Components.NPanelFooter, { model: this.props.model,
				view: this.isViewMode(),
				save: buttonLayout.save,
				validate: buttonLayout.validate,
				cancel: buttonLayout.cancel,
				reset: buttonLayout.reset,
				left: buttonLayout.left,
				right: buttonLayout.right });
		},
		getButtonLayout: function () {
			return this.getComponentOption('buttonLayout');
		}
	}));
	$pt.Components.NFormButtonFooter = NFormButtonFooter;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.ButtonFooter, function (model, layout, direction, viewMode) {
		return React.createElement($pt.Components.NFormButtonFooter, $pt.LayoutHelper.transformParameters(model, layout, direction, viewMode));
	});
})(window, jQuery, React, ReactDOM, $pt);

/**
 * Created by brad.wu on 8/18/2015.
 * depends cell components which will be renderred in cell.
 *
 * the following settings are shared with all form cell components
 * layout: {
 *      dataId: string,
 *      comp: {
 *          paintRequired: boolean,
 *          labelDirection: string,
 *          labelWidth: number
 *      },
 *      css: {
 *          cell: string,
 *          label: string
 *      }
 * }
 */
(function (window, $, React, ReactDOM, $pt) {
	var NFormCell = React.createClass($pt.defineCellComponent({
		displayName: 'NFormCell',
		keepRender: true,
		statics: {
			REQUIRED_ICON: 'asterisk',
			TOOLTIP_ICON: 'question-circle',
			LABEL_WIDTH: 4,
			__componentRenderer: {},
			registerComponentRenderer: function (type, func) {
				$pt.LayoutHelper.registerComponentRenderer(type, func);
			},
			getComponentRenderer: function (type) {
				return $pt.LayoutHelper.getComponentRenderer(type);
			}
		},
		getDefaultProps: function () {
			return {
				defaultOptions: {
					// paintRequired: true
				},
				direction: 'vertical'
			};
		},
		beforeWillUpdate: function (nextProps) {
			this.destroyPopover();
			this.removeRequiredDependencyMonitor();
		},
		beforeDidUpdate: function (prevProps, prevState) {
			this.renderPopover();
			this.addRequiredDependencyMonitor();
		},
		beforeDidMount: function () {
			this.renderPopover();
			this.addRequiredDependencyMonitor();
		},
		beforeWillUnmount: function () {
			this.destroyPopover();
			this.removeRequiredDependencyMonitor();
		},
		destroyPopover: function () {
			var comp = this.refs.comp;
			if (comp != null) {
				$(ReactDOM.findDOMNode(comp)).popover("destroy");
			}
			var tooltip = this.refs.tooltip;
			if (tooltip != null) {
				$(ReactDOM.findDOMNode(tooltip)).popover('destroy');
			}
		},
		/**
   * render error popover
   */
		renderPopover: function () {
			var tooltip = this.getComponentOption('tooltip');
			if (tooltip != null) {
				if (typeof tooltip === 'string') {
					tooltip = {
						text: tooltip
					};
				}
				var tooltipPopover = {
					title: tooltip.title,
					content: tooltip.text,
					placement: tooltip.position ? tooltip.position : 'top',
					trigger: 'hover',
					container: 'body',
					html: true,
					animation: false
				};
				$(ReactDOM.findDOMNode(this.refs.tooltip)).popover(tooltipPopover);
			}

			if ($pt.ComponentConstants.ERROR_POPOVER && this.getLayout().getComponentType().popover !== false && this.getModel().hasError(this.getDataId())) {
				var messages = this.getModel().getError(this.getDataId());
				var _this = this;
				var popover = {
					placement: 'top',
					trigger: 'hover',
					html: true,
					content: messages.map(function (msg) {
						return "<span style='display:block'>" + msg.format([_this.getLayout().getLabel(_this)]) + "</span>";
					}),
					container: 'body',
					// false is very import, since when destroy popover,
					// the really destroy will be invoked by some delay,
					// and before really destory invoked,
					// the new popover is bind by componentDidUpdate method.
					// and finally new popover will be destroyed.
					animation: false,
					template: '<div class="popover form-cell-error" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
				};

				var comp = this.refs.comp;
				if (comp != null) {
					var dom = $(ReactDOM.findDOMNode(comp));
					dom.popover(popover);
					if (dom.has($(':focus')).length != 0) {
						dom.popover('show');
					}
				}
			}
		},
		/**
   * render input component
   * @param componentDefinition
   */
		renderInputComponent: function (componentDefinition) {
			// always pass form model to component,
			// since maybe getModel() returns inner model which defined with comp: {model: another}
			var direction = this.props.direction ? this.props.direction : 'vertical';
			if (componentDefinition.render) {
				// user defined component
				return componentDefinition.render.call(this, this.getFormModel(), this.getLayout(), direction, this.isViewMode());
			}

			// pre-defined components
			var type = componentDefinition.type;
			if (!type) {
				type = "text";
			}
			var innerComponent = $pt.LayoutHelper.getComponentRenderer(type).call(this, this.getFormModel(), this.getLayout(), direction, this.isViewMode());
			return React.createElement(
				'div',
				{ ref: 'comp' },
				innerComponent
			);
		},
		isRequiredSignPaint: function () {
			if (this.isViewMode()) {
				return false;
			}
			// calculate the 'paintRequired' attribute
			var requiredPaint = this.getComponentOption("paintRequired");
			if (requiredPaint == null) {
				// not given, calculate 'required' rules
				requiredPaint = this.getModel().isRequired(this.getDataId());
				return requiredPaint ? true : this.isRequiredSignNeeded();
			} else if (typeof requiredPaint === 'boolean') {
				// boolean type, return directly
				return requiredPaint;
			} else if (typeof requiredPaint === 'function') {
				requiredPaint = requiredPaint.call(this);
				if (typeof requiredPaint === 'boolean') {
					// boolean type, return directly
					return requiredPaint;
				}
			}
			// calculate from model validator
			return this.getModel().isRequired(this.getDataId(), requiredPaint);
		},
		/**
   * render label
   * @returns {XML}
   */
		renderLabel: function () {
			var labelIcon = this.getComponentOption('labelIcon');
			var iconLabel = labelIcon ? React.createElement('span', { className: 'label-icon fa fa-fw fa-' + labelIcon }) : null;
			var requireIconCSS = {
				fa: true,
				'fa-fw': true,
				required: true
			};
			requireIconCSS['fa-' + NFormCell.REQUIRED_ICON] = true;
			var requiredLabel = this.isRequiredSignPaint() ? React.createElement('span', { className: $pt.LayoutHelper.classSet(requireIconCSS) }) : null;
			var tooltip = this.getComponentOption('tooltip');
			var tooltipIcon = null;
			var tooltipCSS = {
				fa: true,
				'fa-fw': true,
				'n-form-cell-tooltip': true
			};
			if (tooltip != null) {
				tooltipCSS['fa-' + NFormCell.TOOLTIP_ICON] = true;
				tooltipIcon = React.createElement('span', { className: $pt.LayoutHelper.classSet(tooltipCSS), ref: 'tooltip' });
			}
			return React.createElement(
				'span',
				{ className: this.getLayout().getLabelCSS(),
					onClick: this.onLabelClicked,
					ref: 'label' },
				iconLabel,
				this.getLayout().getLabel(this),
				tooltipIcon,
				requiredLabel,
				this.getComponentOption('customLabelAddon')
			);
		},
		/**
   * render
   * @returns {XML}
   */
		render: function () {
			if (!this.isVisible()) {
				return React.createElement('div', { className: this.getCSSClassName() + ' n-form-cell-invisible' });
			} else {
				var css = this.getCSSClassName();
				if (this.getModel().hasError(this.getDataId()) && this.getLayout().getComponentType().renderError !== false) {
					css += " has-error";
				}
				if (!this.isEnabled()) {
					css += ' n-form-cell-disabled';
				}
				// read component definition
				var type = this.getLayout().getComponentType();
				if (type.label === false) {
					return React.createElement(
						'div',
						{ className: css, ref: 'div' },
						this.renderInputComponent(type)
					);
				} else {
					var labelDirection = this.getComponentOption("labelDirection");
					if (labelDirection == null) {
						labelDirection = this.props.direction ? this.props.direction : 'vertical';
					}
					if (labelDirection != 'vertical') {
						return React.createElement(
							'div',
							{ className: css + ' horizontal-label', ref: 'div' },
							React.createElement(
								'div',
								{ className: 'row' },
								React.createElement(
									'div',
									{ className: this.getHorizontalLabelCSS() },
									this.renderLabel()
								),
								React.createElement(
									'div',
									{ className: this.getHorizontalComponentCSS() },
									this.renderInputComponent(type)
								)
							)
						);
					} else {
						return React.createElement(
							'div',
							{ className: css + ' vertical-label', ref: 'div' },
							this.renderLabel(),
							this.renderInputComponent(type)
						);
					}
				}
			}
		},
		/**
   * on model change
   * @param evt
   */
		onModelChanged: function (evt) {
			var delay = this.getValidationOption('delay', this.getLayout().getComponentType().delay);
			if (delay != null && delay > 0) {
				if (this.state.delayedValidation) {
					window.clearTimeout(this.state.delayedValidation);
				}
				this.state.delayedValidation = window.setTimeout(function () {
					this.validate();
				}.bind(this), delay);
			} else {
				// no delay for validation
				this.validate();
			}
		},
		/**
   * on label clicked
   */
		onLabelClicked: function () {
			$(ReactDOM.findDOMNode(this.refs.comp)).focus();
		},
		/**
   * get css class
   * @returns {string}
   */
		getCSSClassName: function () {
			var width = this.getLayout().getWidth();
			var css = {
				'n-form-cell': true
			};
			if (typeof width === 'number' || typeof width === 'string') {
				css['col-sm-' + width] = true;
				css['col-md-' + width] = true;
				css['col-lg-' + width] = true;
			} else {
				Object.keys(width).forEach(function (key) {
					css['col-' + key + '-' + width[key]] = true;
				});
				if (typeof width.sm === 'undefined') {
					css['col-sm-' + width.width] = true;
				}
				if (typeof width.md === 'undefined') {
					css['col-md-' + width.width] = true;
				}
				if (typeof width.lg === 'undefined') {
					css['col-lg-' + width.width] = true;
				}
				// css['col-sm-' + (width.sm ? width.sm : width.width)] = true;
				// css['col-md-' + (width.md ? width.md : width.width)] = true;
				// css['col-lg-' + (width.lg ? width.lg : width.width)] = true;
			}
			return this.getLayout().getCellCSS($pt.LayoutHelper.classSet(css));
		},
		/**
   * get label css when horizontal direction
   * @returns {string}
   */
		getHorizontalLabelCSS: function () {
			var width = this.getHorizontalLabelWidth();
			return "col-sm-" + width + " col-md-" + width + " col-lg-" + width;
		},
		/**
   * get component css when horizontal direction
   * @returns {string}
   */
		getHorizontalComponentCSS: function () {
			var width = 12 - this.getHorizontalLabelWidth();
			return "col-sm-" + width + " col-md-" + width + " col-lg-" + width;
		},
		getHorizontalLabelWidth: function () {
			var width = this.getComponentOption('labelWidth');
			return width ? width : NFormCell.LABEL_WIDTH;
		},
		/**
   * register to component central
   */
		registerToComponentCentral: function () {
			var id = this.getComponentCentralId();
			if (id) {
				$pt.LayoutHelper.registerComponent(id + '@cell', this);
			}
		},
		/**
   * unregsiter from component central
   */
		unregisterFromComponentCentral: function () {
			var id = this.getComponentCentralId();
			if (id) {
				$pt.LayoutHelper.unregisterComponent(id + '@cell', this);
			}
		}
	}));
	$pt.Components.NFormCell = NFormCell;
})(window, jQuery, React, ReactDOM, $pt);

(function (window, $, React, ReactDOM, $pt) {
	var NFormTab = React.createClass($pt.defineCellComponent({
		displayName: 'NFormTab',
		getDefaultProps: function () {
			return {
				defaultOptions: {
					tabType: 'tab',
					justified: false,
					titleDirection: 'horizontal'
				}
			};
		},
		beforeWillUpdate: function (nextProps) {
			this.uninstallBadgeMonitor();
		},
		beforeDidUpdate: function (prevProps, prevState) {
			this.installBadgeMonitor();
		},
		beforeDidMount: function () {
			this.installBadgeMonitor();
		},
		beforeWillUnmount: function () {
			this.uninstallBadgeMonitor();
		},
		installBadgeMonitor: function () {
			this.getTabs().forEach(function (tab) {
				if (tab.badgeId) {
					this.addDependencyMonitor([tab.badgeId]);
				}
			}.bind(this));
		},
		uninstallBadgeMonitor: function () {
			this.getTabs().forEach(function (tab) {
				if (tab.badgeId) {
					this.removeDependencyMonitor([tab.badgeId]);
				}
			}.bind(this));
		},
		renderTabContent: function (layout, index) {
			var activeIndex = this.getActiveTabIndex();
			var css = {
				'n-form-tab-card': true,
				show: index == activeIndex,
				hide: index != activeIndex
			};
			return React.createElement($pt.Components.NForm, { model: this.getModel(),
				layout: layout,
				direction: this.props.direction,
				view: this.isViewMode(),
				className: $pt.LayoutHelper.classSet(css),
				key: 'form-' + index });
		},
		render: function () {
			var tabs = this.initializeTabs();
			var canActive = this.getComponentOption('canActive');
			if (canActive) {
				canActive.bind(this);
			}
			return React.createElement(
				'div',
				{ className: this.getComponentCSS('n-form-tab') },
				React.createElement($pt.Components.NTab, { type: this.getComponentOption('tabType'),
					justified: this.getComponentOption('justified'),
					direction: this.getComponentOption('titleDirection'),
					size: this.getComponentOption('titleIconSize'),
					tabClassName: this.getAdditionalCSS('tabs'),
					tabs: tabs,
					canActive: canActive,
					onActive: this.onTabClicked,
					ref: 'tabs' }),
				React.createElement(
					'div',
					{ className: 'n-form-tab-content', ref: 'content' },
					this.getTabLayouts().map(this.renderTabContent)
				)
			);
		},
		getTabs: function () {
			return this.getComponentOption('tabs');
		},
		initializeTabs: function () {
			var _this = this;
			var tabs = this.getTabs();
			tabs.forEach(function (tab) {
				if (tab.badgeId) {
					tab.badge = _this.getModel().get(tab.badgeId);
					if (tab.badgeRender) {
						tab.badge = tab.badgeRender.call(_this, tab.badge, _this.getModel());
					}
				}
			});
			return tabs;
		},
		/**
   * get tab layouts
   * @returns {FormLayout[]}
   */
		getTabLayouts: function () {
			return this.getTabs().map(function (tab) {
				return $pt.createFormLayout(tab.layout || tab.editLayout);
			});
		},
		/**
   * on tab clicked
   * @param tabValue {string} tab value
   * @param index {number}
   */
		onTabClicked: function (tabValue, index) {
			this.setActiveTabIndex(index);
			var onActive = this.getComponentOption('onActive');
			if (onActive) {
				onActive.call(this, tabValue, index);
			}
		},
		/**
   * get active tab index
   * @returns {number}
   */
		getActiveTabIndex: function () {
			var tabs = this.getComponentOption('tabs');
			// find the active tab
			var activeTabIndex = tabs.findIndex(function (tab, index) {
				return tab.active === true;
			});
			if (activeTabIndex == -1) {
				// find the first visible tab if no active tab found
				activeTabIndex = tabs.findIndex(function (tab, index) {
					var visible = tab.visible !== false;
					if (visible) {
						tab.active = true;
						return true;
					}
				});
			}
			return activeTabIndex;
		},
		/**
   * set active tab index
   * @param {number}
   */
		setActiveTabIndex: function (index) {
			this.refs.tabs.setActiveTabIndex(index);
			this.forceUpdate();
		}
	}));
	$pt.Components.NFormTab = NFormTab;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.Tab, function (model, layout, direction, viewMode) {
		return React.createElement($pt.Components.NFormTab, $pt.LayoutHelper.transformParameters(model, layout, direction, viewMode));
	});
})(window, jQuery, React, ReactDOM, $pt);

/**
 * icon based on font-awesome
 */
(function (window, $, React, ReactDOM, $pt) {
	var NIcon = React.createClass({
		displayName: 'NIcon',
		getDefaultProps: function () {
			return {
				fixWidth: false,
				spin: false
			};
		},
		/**
   * get size
   * @returns {*}
   */
		getSize: function () {
			var size = {
				"fa-lg": this.props.size === "lg",
				"fa-2x": this.props.size === "2x",
				"fa-3x": this.props.size === "3x",
				"fa-4x": this.props.size === "4x",
				"fa-5x": this.props.size === "5x",
				"fa-fw": this.props.fixWidth
			};
			if (this.props.size) {
				size['fa-' + this.props.size] = true;
			}
			return size;
		},
		/**
   * get icon
   * @returns {*}
   */
		getIcon: function () {
			var c = {
				"fa": true,
				"fa-spin": this.props.spin,
				"fa-pulse": this.props.pulse,
				"fa-rotate-90": this.props.rotate == 90,
				"fa-rotate-180": this.props.rotate == 180,
				"fa-rotate-270": this.props.rotate == 270,
				"fa-flip-horizontal": this.props.flip === "h",
				"fa-flip-vertical": this.props.flip === "v"
			};
			c["fa-" + this.props.icon] = true;
			if (this.props.iconClassName) {
				c[this.props.iconClassName] = true;
			}
			return c;
		},
		/**
   * get background icon
   * @returns {*}
   */
		getBackIcon: function () {
			var c = {
				"fa": true,
				"fa-spin": this.props.backSpin,
				"fa-pulse": this.props.backPulse,
				"fa-rotate-90": this.props.backRotate == 90,
				"fa-rotate-180": this.props.backRotate == 180,
				"fa-rotate-270": this.props.backRotate == 270,
				"fa-flip-horizontal": this.props.backFlip === "h",
				"fa-flip-vertical": this.props.backFlip === "v"
			};
			c["fa-" + this.props.backIcon] = true;
			if (this.props.backClassName) {
				c[this.props.backClassName] = true;
			}
			return c;
		},
		/**
   * render
   * @returns {XML}
   */
		render: function () {
			var size = this.getSize();
			var iconClasses = this.getIcon();
			if (this.props.backIcon) {
				size["fa-stack"] = true;
				iconClasses['fa-stack-1x'] = true;
				var backIconClasses = this.getBackIcon();
				backIconClasses['fa-stack-2x'] = true;
				return React.createElement(
					"span",
					{ className: $pt.LayoutHelper.classSet(size), title: this.props.tooltip },
					React.createElement("i", { className: $pt.LayoutHelper.classSet(iconClasses) }),
					React.createElement("i", { className: $pt.LayoutHelper.classSet(backIconClasses) })
				);
			}
			return React.createElement("span", { className: $pt.LayoutHelper.classSet($.extend(iconClasses, size)),
				title: this.props.tooltip });
		}
	});
	$pt.Components.NIcon = NIcon;
})(window, jQuery, React, ReactDOM, $pt);

/**
 * Jumbortron
 */
(function (window, $, React, ReactDOM, $pt) {
	var NJumbortron = React.createClass({
		displayName: 'NJumbortron',
		renderText: function () {
			if (Array.isArray(this.props.highlightText)) {
				return this.props.highlightText.map(function (text, textIndex) {
					return React.createElement(
						"h4",
						{ key: textIndex },
						text
					);
				});
			} else {
				return React.createElement(
					"h4",
					null,
					this.props.highlightText
				);
			}
		},
		render: function () {
			return React.createElement(
				"div",
				{ className: "n-jumbotron jumbotron" },
				this.renderText()
			);
		}
	});
	$pt.Components.NJumbortron = NJumbortron;
})(window, jQuery, React, ReactDOM, $pt);

/**
 * Created by brad.wu on 8/21/2015.
 */
(function (window, $, React, ReactDOM, $pt) {
	var NLabel = React.createClass($pt.defineCellComponent({
		displayName: 'NLabel',
		getDefaultProps: function () {
			return {
				defaultOptions: {
					textFromModel: true
				}
			};
		},
		render: function () {
			var texts = this.getText();
			if (!Array.isArray(texts)) {
				var convertor = this.getComponentOption('convertor');
				if (convertor && typeof convertor === 'function') {
					texts = [convertor.call(this, texts)];
				} else if (convertor && convertor.view) {
					// for NText compatibility
					texts = [convertor.view.call(this, texts)];
				} else {
					var currency = this.getComponentOption('currency');
					if (currency && texts != null && !(texts + '').isBlank()) {
						var fraction = this.getComponentOption('fraction');
						fraction = fraction ? fraction * 1 : 0;
						texts = (texts + '').currencyFormat(fraction);
					}
					if (texts == null || (texts + '').isBlank()) {
						texts = this.getComponentOption('replaceBlank') || this.getComponentOption('placeholder');
					}

					var left = this.getComponentOption('left');
					var right = this.getComponentOption('right');
					texts = left ? left + texts : texts;
					texts = right ? texts + right : texts;
					texts = [texts];
				}
			}
			var css = {
				'n-disabled': !this.isEnabled()
			};
			css[this.getComponentCSS('n-label')] = true;
			var style = this.getComponentOption('style');
			if (style) {
				css['n-label-' + style] = true;
			}
			return React.createElement(
				'div',
				{ className: $pt.LayoutHelper.classSet(css) },
				texts.map(function (text, textIndex) {
					return React.createElement(
						'span',
						{ key: textIndex },
						text
					);
				})
			);
		},
		getText: function () {
			if (this.isTextFromModel()) {
				return this.getValueFromModel();
			} else {
				return this.getLayout().getLabel(this);
			}
		},
		isTextFromModel: function () {
			return this.getComponentOption('textFromModel') !== false;
		}
	}));
	$pt.Components.NLabel = NLabel;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.Label, function (model, layout, direction, viewMode) {
		return React.createElement($pt.Components.NLabel, $pt.LayoutHelper.transformParameters(model, layout, direction, viewMode));
	});
})(window, jQuery, React, ReactDOM, $pt);

/**
 * modal confirm dialog
 * z-index is 9699 and 9698, less than exception dialog, on request dialog and code search dialog, more than any other.
 *
 * depends NFormButton
 */
(function (window, $, React, ReactDOM, $pt) {
	var NConfirm = React.createClass({
		displayName: 'NConfirm',
		statics: {
			getConfirmModal: function (className) {
				if ($pt.confirmDialog === undefined || $pt.confirmDialog === null) {
					var confirmContainer = $("#confirm_modal_container");
					if (confirmContainer.length == 0) {
						$("<div id='confirm_modal_container' />").appendTo($(document.body));
					}
					$pt.confirmDialog = ReactDOM.render(React.createElement($pt.Components.NConfirm, { className: className }), document.getElementById("confirm_modal_container"));
				}
				return $pt.confirmDialog;
			},
			OK_TEXT: 'OK',
			OK_ICON: 'check',
			CLOSE_TEXT: 'Close',
			CLOSE_ICON: 'ban',
			CANCEL_TEXT: 'Cancel',
			CANCEL_ICON: 'ban',
			Z_INDEX: 9698
		},
		getDefaultProps: function () {
			return {};
		},
		getInitialState: function () {
			return {
				visible: false
			};
		},
		/**
   * set z-index
   */
		fixDocumentPadding: function () {
			document.body.style.paddingRight = 0;
		},
		/**
   * did update
   * @param prevProps
   * @param prevState
   */
		componentDidUpdate: function (prevProps, prevState) {
			this.fixDocumentPadding();
			if (this.state.visible) {
				$(document).on('keyup', this.onDocumentKeyUp);
			} else {
				$(document).off('keyup', this.onDocumentKeyUp);
			}
		},
		/**
   * did mount
   */
		componentDidMount: function () {
			this.fixDocumentPadding();
			if (this.state.visible) {
				$(document).on('keyup', this.onDocumentKeyUp);
			} else {
				$(document).off('keyup', this.onDocumentKeyUp);
			}
		},
		componentWillUpdate: function () {
			$(document).off('keyup', this.onDocumentKeyUp);
		},
		componentWillUnmount: function () {
			$(document).off('keyup', this.onDocumentKeyUp);
		},
		/**
   * render confirm button
   * @returns {XML}
   */
		renderConfirmButton: function () {
			if (this.state.options && this.state.options.disableConfirm) {
				return null;
			}
			var layout = $pt.createCellLayout('pseudo-button', {
				label: this.state.options && this.state.options.confirmText ? this.state.options.confirmText : NConfirm.OK_TEXT,
				comp: {
					type: $pt.ComponentConstants.Button,
					icon: NConfirm.OK_ICON,
					style: 'primary',
					click: this.onConfirmClicked
				}
			});
			return React.createElement($pt.Components.NFormButton, { layout: layout, model: $pt.createModel({}) });
		},
		/**
   * render close button
   * @returns {XML}
   */
		renderCloseButton: function () {
			if (this.state.options && this.state.options.disableClose) {
				return null;
			}
			var layout = $pt.createCellLayout('pseudo-button', {
				label: this.state.options && this.state.options.close ? NConfirm.CLOSE_TEXT : NConfirm.CANCEL_TEXT,
				comp: {
					type: $pt.ComponentConstants.Button,
					icon: this.state.options && this.state.options.close ? NConfirm.CLOSE_ICON : NConfirm.CANCEL_ICON,
					style: 'danger',
					click: this.onCancelClicked
				}
			});
			return React.createElement($pt.Components.NFormButton, { layout: layout, model: $pt.createModel({}) });
		},
		renderDialogCloseButton: function () {
			if (this.isDialogCloseShown()) {
				return React.createElement(
					"button",
					{ className: "close",
						onClick: this.onCancelClicked,
						"aria-label": "Close",
						style: { marginTop: '-2px' } },
					React.createElement(
						"span",
						{ "aria-hidden": "true" },
						"\xD7"
					)
				);
			}
			return null;
		},
		/**
   * render footer
   * @returns {XML}
   */
		renderFooter: function () {
			if (this.state.options && this.state.options.disableButtons) {
				return React.createElement("div", { className: "modal-footer-empty" });
			}
			return React.createElement(
				"div",
				{ className: "modal-footer" },
				this.renderCloseButton(),
				this.renderConfirmButton()
			);
		},
		/**
   * render content
   */
		renderContent: function () {
			var messages = this.state.options;
			if (typeof messages === "string") {
				messages = [messages];
			}
			if (!Array.isArray(messages)) {
				messages = messages.messages;
				if (typeof messages === "string") {
					messages = [messages];
				}
			}
			// string array
			return messages.map(function (element, index) {
				return React.createElement(
					"h6",
					{ key: index },
					element
				);
			});
		},
		/**
   * render
   * @returns {XML}
   */
		render: function () {
			if (!this.state.visible) {
				return null;
			}
			var css = {
				'n-confirm': true,
				modal: true,
				fade: true,
				in: true
			};
			if (this.props.className) {
				css[this.props.className] = true;
			}
			return React.createElement(
				"div",
				null,
				React.createElement("div", { className: "modal-backdrop fade in", style: { zIndex: NConfirm.Z_INDEX } }),
				React.createElement(
					"div",
					{ className: $pt.LayoutHelper.classSet(css),
						tabIndex: "-1",
						role: "dialog",
						ref: "container",
						style: { display: 'block', zIndex: NConfirm.Z_INDEX + 1 } },
					React.createElement(
						"div",
						{ className: "modal-dialog", tabIndex: "0" },
						React.createElement(
							"div",
							{ className: "modal-content", role: "document" },
							React.createElement(
								"div",
								{ className: "modal-header" },
								this.renderDialogCloseButton(),
								React.createElement(
									"h4",
									{ className: "modal-title" },
									this.state.title
								)
							),
							React.createElement(
								"div",
								{ className: "modal-body" },
								this.renderContent()
							),
							this.renderFooter()
						)
					)
				)
			);
		},
		onDocumentKeyUp: function (evt) {
			if (evt.keyCode === 27) {
				// escape
				this.onCancelClicked();
			} else if (evt.keyCode === 9) {
				// tab
				// evt.preventDefault();
				var target = $(evt.target);
				var container = $(this.refs.container);
				if (target.closest(container).length == 0) {
					container.focus();
				}
			}
		},
		/**
   * hide dialog
   */
		hide: function () {
			this.setState({
				visible: false,
				title: null,
				options: null,
				onConfirm: null,
				onCancel: null
			});
		},
		/**
   * on confirm clicked
   */
		onConfirmClicked: function () {
			if (this.state.onConfirm) {
				this.state.onConfirm.call(this);
			}
			this.hide();
			if (this.state.afterClose) {
				this.state.afterClose.call(this, 'confirm');
			}
		},
		/**
   * on cancel clicked
   */
		onCancelClicked: function () {
			if (this.state.onCancel) {
				this.state.onCancel.call(this);
			}
			this.hide();
			if (this.state.afterClose) {
				this.state.afterClose.call(this, 'cancel');
			}
		},
		isDialogCloseShown: function () {
			return this.state && this.state.buttons && this.state.buttons.disableDialogClose === true;
		},
		/**
   * show dialog
   *
   * from 0.0.3
   * all parameters should be pass to #show in first as a JSON object
   *
   * @param title deprecated title of dialog
   * @param options string or string array, or object as below.
   *          {
  	 *              disableButtons: true, // hide button bar
  	 *              disableConfirm: true, // hide confirm button
  	 *              disableClose: true, // hide close button
  	 *              messsages: "", // string or string array,
  	 *              close: true, // show close button text as "close"
  	 *              onConfirm: function,
  	 *              onCancel: function,
  	 *              afterClose: function,
  	 *              title: string
  	 *          }
   * @param onConfirm deprecated callback function when confirm button clicked
   * @param onCancel deprecated callback function when cancel button clicked
   */
		show: function (title, options, onConfirm, onCancel) {
			$(':focus').blur();
			var state;
			if (typeof title === 'string') {
				state = {
					visible: true,
					title: title,
					options: options,
					onConfirm: onConfirm,
					onCancel: onCancel,
					afterClose: options.afterClose
				};
			} else {
				// for new API
				options = title;
				state = {
					visible: true,
					title: options.title,
					options: {
						disableButtons: options.disableButtons,
						disableConfirm: options.disableConfirm,
						disableClose: options.disableClose,
						disableDialogClose: options.disableDialogClose,
						confirmText: options.confirmText,
						close: options.close,
						messages: options.messages
					},
					onConfirm: options.onConfirm,
					onCancel: options.onCancel,
					afterClose: options.afterClose
				};
			}
			this.setState(state);
		}
	});
	$pt.Components.NConfirm = NConfirm;
})(window, jQuery, React, ReactDOM, $pt);

/**
 * modal form dialog
 *
 * depends NPanelFooter, NForm, NConfirm
 */
(function (window, $, React, ReactDOM, $pt) {
	var NModalForm = React.createClass({
		displayName: 'NModalForm',
		statics: {
			/**
    * create form modal dialog
    * @param title
    * @param className
    * @returns {object}
    */
			createFormModal: function (title, className) {
				if ($pt.formModalIndex === undefined || $pt.formModalIndex === null) {
					$pt.formModalIndex = 1500;
				} else {
					$pt.formModalIndex += 1;
				}
				var containerId = "form_modal_container_" + $pt.formModalIndex;
				var container = $("#" + containerId);
				if (container.length == 0) {
					$("<div id='" + containerId + "' />").appendTo($(document.body));
				}
				var css = {
					"n-modal-form": true
				};
				if (className) {
					css[className] = true;
				}
				return ReactDOM.render(React.createElement($pt.Components.NModalForm, { title: title, className: $pt.LayoutHelper.classSet(css),
					zIndex: $pt.formModalIndex }), document.getElementById(containerId));
			},
			RESET_CONFIRM_TITLE: "Reset Data",
			RESET_CONFIRM_MESSAGE: ["Are you sure to reset data?", "All data will be lost and cannot be recovered."],
			CANCEL_CONFIRM_TITLE: "Cancel Editing",
			CANCEL_CONFIRM_MESSAGE: ["Are you sure to cancel current operating?", "All data will be lost and cannot be recovered."]
		},
		getInitialState: function () {
			return {
				visible: false,
				expanded: true,
				collapsible: false,
				draggable: true
			};
		},
		/**
   * set z-index
   */
		fixDocumentPadding: function () {
			document.body.style.paddingRight = 0;
		},
		setDraggable: function () {
			if (!this.isDraggable() || !this.refs.top) {
				return;
			}
			var top = $(ReactDOM.findDOMNode(this.refs.top));
			var modal = top.children('.modal');
			modal.drags({ handle: '.modal-header' });
			modal.css({
				overflow: 'visible',
				height: 0
			});
			var dialog = modal.children('.modal-dialog');
			dialog.css({
				height: 0
			});

			if (!this.state.modal) {
				top.find('.modal-backdrop').hide();
			}

			// the initial position
			if (this.state.pos) {
				// dialog content position is relative to dialog.
				// dialog has margin.
				var dialogPosition = {
					top: parseInt(dialog.css('margin-top')),
					left: parseInt(dialog.css('margin-left')),
					bottom: parseInt(dialog.css('margin-bottom')),
					right: parseInt(dialog.css('margin-right'))
				};
				var content = dialog.children('.modal-content');
				var contentPosition = {};
				var currentContentTop = parseInt(content.css('top'));
				if (isNaN(currentContentTop)) {
					if (this.state.pos.bottom != null) {
						contentPosition.bottom = dialogPosition.bottom + content.height() - $(window).height();
					} else if (this.state.pos.top != null) {
						contentPosition.top = this.state.pos.top - dialogPosition.top;
					}
				} else {
					contentPosition.top = currentContentTop;
				}
				var currentContentLeft = parseInt(content.css('left'));
				if (isNaN(currentContentLeft)) {
					if (this.state.pos.right != null) {
						contentPosition.right = this.state.pos.right - dialogPosition.right;
					} else if (this.state.pos.left != null) {
						contentPosition.left = this.state.pos.left - dialogPosition.left;
					}
				} else {
					contentPosition.left = currentContentLeft;
				}
				if (Object.keys(contentPosition).length > 0) {
					content.css(contentPosition);
				}
			}
		},
		stopDraggable: function () {
			if (this.refs.top) {
				var top = $(ReactDOM.findDOMNode(this.refs.top));
				var modal = top.children('.modal');
				modal.stopDrags({ handle: '.modal-header' });
			}
		},
		/**
   * did update
   * @param prevProps
   * @param prevState
   */
		componentDidUpdate: function (prevProps, prevState) {
			this.fixDocumentPadding();
			this.setDraggable();
			if (this.isDialogCloseShown()) {
				$(document).on('keyup', this.onDocumentKeyUp);
			}
			if (this.state.visible) {
				$(document).on('keydown', this.onDocumentKeyDown);
			} else {
				$(document).off('keydown', this.onDocumentKeyDown);
			}
		},
		componentWillUpdate: function () {
			this.stopDraggable();
			if (this.isDialogCloseShown()) {
				$(document).off('keyup', this.onDocumentKeyUp);
			}
			$(document).off('keydown', this.onDocumentKeyDown);
		},
		/**
   * did mount
   */
		componentDidMount: function () {
			this.fixDocumentPadding();
			this.setDraggable();
			if (this.isDialogCloseShown()) {
				$(document).on('keyup', this.onDocumentKeyUp);
			}
			if (this.state.visible) {
				$(document).on('keydown', this.onDocumentKeyDown);
			} else {
				$(document).off('keydown', this.onDocumentKeyDown);
			}
		},
		componentWillUnmount: function () {
			this.stopDraggable();
			if (this.isDialogCloseShown()) {
				$(document).off('keyup', this.onDocumentKeyUp);
			}
			$(document).off('keydown', this.onDocumentKeyDown);
		},
		/**
   * render footer
   * @returns {XML}
   */
		renderFooter: function () {
			if (this.state.footer === false || !this.state.expanded) {
				return React.createElement("div", { ref: "footer" });
			} else {
				return React.createElement(
					"div",
					{ className: "n-modal-form-footer modal-footer", ref: "footer" },
					React.createElement($pt.Components.NPanelFooter, { reset: this.getResetButton(),
						validate: this.getValidationButton(),
						save: this.getSaveButton(),
						cancel: this.getCancelButton(),
						left: this.getLeftButton(),
						right: this.getRightButton(),
						model: this.getModel(),
						view: this.isViewMode() })
				);
			}
		},
		renderBody: function () {
			var css = {
				'modal-body': true,
				hide: !this.state.expanded
			};
			return React.createElement(
				"div",
				{ className: $pt.LayoutHelper.classSet(css) },
				React.createElement($pt.Components.NForm, { model: this.getModel(),
					layout: this.getLayout(),
					direction: this.getDirection(),
					view: this.isViewMode(),
					ref: "form" })
			);
		},
		renderCloseButton: function () {
			if (this.isDialogCloseShown()) {
				return React.createElement(
					"button",
					{ className: "close",
						onClick: this.hide,
						"aria-label": "Close",
						style: { marginTop: '-2px' } },
					React.createElement(
						"span",
						{ "aria-hidden": "true" },
						"\xD7"
					)
				);
			}
			return null;
		},
		/**
   * render
   * @returns {*}
   */
		render: function () {
			if (!this.state.visible) {
				return null;
			}
			var title = this.state.title ? this.state.title : this.props.title;
			if (this.isCollapsible()) {
				title = React.createElement(
					"a",
					{ href: "javascript:void(0);", onClick: this.onTitleClicked },
					title
				);
			}
			var css = {
				'n-confirm': true,
				modal: true,
				fade: true,
				in: true
			};
			if (this.props.className) {
				css[this.props.className] = true;
			}
			// tabindex="0"
			return React.createElement(
				"div",
				{ ref: "top" },
				React.createElement("div", { className: "modal-backdrop fade in", style: { zIndex: this.props.zIndex * 1 } }),
				React.createElement(
					"div",
					{ className: $pt.LayoutHelper.classSet(css),
						role: "dialog",
						ref: "container",
						tabIndex: "0",
						style: { display: 'block', zIndex: this.props.zIndex * 1 + 1 } },
					React.createElement(
						"div",
						{ className: "modal-dialog" },
						React.createElement(
							"div",
							{ className: "modal-content", role: "document" },
							React.createElement(
								"div",
								{ className: "modal-header" },
								this.renderCloseButton(),
								React.createElement(
									"h4",
									{ className: "modal-title" },
									title
								)
							),
							this.renderBody(),
							this.renderFooter()
						)
					)
				)
			);
		},
		onDocumentKeyUp: function (evt) {
			if (evt.keyCode === 27) {
				// escape
				this.hide();
			}
		},
		onDocumentKeyDown: function (evt) {
			// console.log(evt);
			if (evt.keyCode === 9) {
				// tab
				// evt.preventDefault();
				var target = $(evt.target);
				var container = $(this.refs.container);
				console.log(target.closest(container).length == 0);
				if (target.closest(container).length == 0) {
					container.focus();
				}
			}
		},
		/**
   * on title clicked
   */
		onTitleClicked: function () {
			// TODO no animotion, tried, weird.
			this.setState({ expanded: !this.state.expanded });
		},
		/**
   * on reset clicked
   */
		onResetClicked: function () {
			var reset = function () {
				this.getModel().reset();
				this.refs.form.forceUpdate();
			};
			$pt.Components.NConfirm.getConfirmModal().show(NModalForm.RESET_CONFIRM_TITLE, NModalForm.RESET_CONFIRM_MESSAGE, reset.bind(this));
		},
		/**
   * on validate clicked
   */
		onValidateClicked: function () {
			this.getModel().validate();
			this.forceUpdate();
		},
		/**
   * on cancel clicked
   */
		onCancelClicked: function () {
			if (this.state.buttons && typeof this.state.buttons.cancel === 'function') {
				this.hide();
			} else {
				$pt.Components.NConfirm.getConfirmModal().show(NModalForm.CANCEL_CONFIRM_TITLE, NModalForm.CANCEL_CONFIRM_MESSAGE, this.hide);
			}
		},
		/**
   * get model
   * @returns {ModelInterface}
   */
		getModel: function () {
			return this.state.model;
		},
		/**
   * get layout
   * @returns {FormLayout}
   */
		getLayout: function () {
			return this.state.layout;
		},
		/**
   * get direction
   * @returns {string}
   */
		getDirection: function () {
			return this.state.direction;
		},
		/**
   * get left button configuration
   * @returns {{}|{}[]}
   */
		getLeftButton: function () {
			return this.state.buttons ? this.state.buttons.left : null;
		},
		/**
   * get right button configuration
   * @returns {{}|{}[]}
   */
		getRightButton: function () {
			return this.state.buttons ? this.state.buttons.right : null;
		},
		/**
   * get validation button
   * @returns {function}
   */
		getValidationButton: function () {
			if (this.state.buttons && this.state.buttons.validate === false) {
				return null;
			} else if (this.isViewMode()) {
				return null;
			} else {
				return this.onValidateClicked;
			}
		},
		/**
   * get cancel button
   * @returns {function}
   */
		getCancelButton: function () {
			if (this.state.buttons && this.state.buttons.cancel === false) {
				return null;
			} else {
				return this.onCancelClicked;
			}
		},
		/**
   * get reset button
   * @returns {function}
   */
		getResetButton: function () {
			if (this.state.buttons && this.state.buttons.reset === false) {
				return null;
			} else if (this.isViewMode()) {
				return null;
			} else {
				return this.onResetClicked;
			}
		},
		/**
   * get save button configuration
   * @returns {{}}
   */
		getSaveButton: function () {
			return this.state.buttons ? this.state.buttons.save : null;
		},
		/**
   * is dialog close button shown
   * @returns boolean
   */
		isDialogCloseShown: function () {
			return this.state.buttons ? this.state.buttons.dialogCloseShown !== false : true;
		},
		/**
   * is draggable
   * @returns boolean
   */
		isDraggable: function () {
			return this.state.draggable || !this.state.modal;
		},
		/**
   * is collapsible
   * @returns boolean
   */
		isCollapsible: function () {
			return this.state.collapsible;
		},
		/**
   * is expanded
   * @returns boolean
   */
		isExpanded: function () {
			return this.state.expanded;
		},
		/**
   * is view mode
   * @returns boolean
   */
		isViewMode: function () {
			return this.state.view;
		},
		/**
   * validate
   * @returns {boolean}
   */
		validate: function () {
			this.getModel().validate();
			this.forceUpdate();
			return this.getModel().hasError();
		},
		/**
   * hide dialog
   * @return model
   */
		hide: function () {
			var model = this.state.model;
			if (this.state.buttons && typeof this.state.buttons.cancel === 'function') {
				this.state.buttons.cancel.call(this, model, function () {
					this.setState({
						visible: false,
						model: null,
						layout: null,
						buttons: null
					});
				}.bind(this));
			} else {
				this.setState({
					visible: false,
					model: null,
					layout: null,
					buttons: null
				});
			}
			return model;
		},
		/**
   * show dialog
   *
   * from 0.0.3, all parameters can be defined in first as a JSON.
   * @param model
   * @param layout
   * @param buttons
   * @param direction vertical or horizontal
   * @param footer {boolean}
   * @param title {string}
   */
		show: function (model, layout, buttons, direction, footer, title) {
			if (!model.getCurrentModel) {
				// test the model is ModelInterface or not
				this.setState({
					visible: true,
					model: model.model,
					layout: model.layout,
					buttons: model.buttons,
					direction: model.direction,
					footer: model.footer,
					title: model.title,
					draggable: model.draggable,
					modal: model.modal == null ? model.draggable ? false : true : true,
					collapsible: model.collapsible,
					expanded: model.expanded == null ? true : model.expanded,
					pos: model.pos,
					view: model.view === true
				});
			} else {
				window.console.warn("Properties [draggable, expanded, collapsible, pos] are not supported in parameters, use JSON parameter instead.");
				this.setState({
					visible: true,
					model: model,
					layout: layout,
					buttons: buttons,
					direction: direction,
					footer: footer,
					title: title,
					draggable: false,
					modal: true,
					expanded: true,
					collapsible: false,
					view: false
				});
			}
		}
	});
	$pt.Components.NModalForm = NModalForm;

	$.fn.drags = function (opt) {
		opt = $.extend({ handle: "", cursor: "move" }, opt);
		var $el = null;
		if (opt.handle === "") {
			$el = this;
		} else {
			$el = this.find(opt.handle);
		}

		return $el.css('cursor', opt.cursor).on("mousedown", function (e) {
			var $drag = null;
			if (opt.handle === "") {
				$drag = $(this).addClass('draggable');
			} else {
				$drag = $(this).addClass('active-handle').parent().addClass('draggable');
			}
			var z_idx = $drag.css('z-index'),
			    drg_h = $drag.outerHeight(),
			    drg_w = $drag.outerWidth(),
			    pos_y = $drag.offset().top + drg_h - e.pageY,
			    pos_x = $drag.offset().left + drg_w - e.pageX;

			//          $drag.css('z-index', 1000).parents().on("mousemove", function(e) {
			$drag.parents().on("mousemove", function (e) {
				$('.draggable').offset({
					top: e.pageY + pos_y - drg_h,
					left: e.pageX + pos_x - drg_w
				}).on("mouseup", function () {
					$(this).removeClass('draggable').css('z-index', z_idx);
				});
			});
			e.preventDefault(); // disable selection
		}).on("mouseup", function () {
			if (opt.handle === "") {
				$(this).removeClass('draggable');
			} else {
				$(this).removeClass('active-handle').parent().removeClass('draggable');
			}
		});
	};
	$.fn.stopDrags = function (opt) {
		opt = $.extend({ handle: "", cursor: "move" }, opt);
		var $el = null;
		if (opt.handle === "") {
			$el = this;
		} else {
			$el = this.find(opt.handle);
		}

		var $drag = null;
		if (opt.handle === "") {
			$drag = $($el);
		} else {
			$drag = $($el).parent();
		}
		$drag.parents().off("mousemove");

		return $el.off('mousedown mouseup');
	};
})(window, jQuery, React, ReactDOM, $pt);

/**
 * Created by brad.wu on 9/2/2015.
 */
(function (window, $, React, ReactDOM, $pt) {
	var NNormalLabel = React.createClass({
		displayName: 'NNormalLabel',
		propTypes: {
			text: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.arrayOf(React.PropTypes.string)]),
			style: React.PropTypes.string,
			className: React.PropTypes.string
		},
		getDefaultProps: function () {
			return {};
		},
		render: function () {
			var texts = this.getText();
			if (!Array.isArray(texts)) {
				texts = [texts];
			}
			var css = {
				'n-normal-label': true
			};
			if (this.props.className) {
				css[this.props.className] = true;
			}
			if (this.props.style) {
				css['n-label-' + this.props.style] = true;
			}
			if (this.props.size) {
				css['n-label-' + this.props.size] = true;
			}
			return React.createElement(
				'span',
				{ className: $pt.LayoutHelper.classSet(css) },
				texts.map(function (text, textIndex) {
					return React.createElement(
						'span',
						{ key: textIndex },
						text
					);
				})
			);
		},
		getText: function () {
			return this.props.text;
		}
	});
	$pt.Components.NNormalLabel = NNormalLabel;
})(window, jQuery, React, ReactDOM, $pt);

/**
 * on request modal dialog.
 * z-index is 9899 and 9898, less than exception dialog, more than any other.
 */
(function (window, $, React, ReactDOM, $pt) {
	var NOnRequestModal = React.createClass({
		displayName: 'NOnRequestModal',
		statics: {
			getOnRequestModal: function (className) {
				if ($pt.onRequestDialog === undefined || $pt.onRequestDialog === null) {
					var onRequestContainer = $("#onrequest_modal_container");
					if (onRequestContainer.length == 0) {
						$("<div id='onrequest_modal_container' />").appendTo($(document.body));
					}
					$pt.onRequestDialog = ReactDOM.render(React.createElement($pt.Components.NOnRequestModal, { className: className }), document.getElementById("onrequest_modal_container"));
				}
				return $pt.onRequestDialog;
			},
			WAITING_MESSAGE: 'Send request to server and waiting for response...',
			Z_INDEX: 9898
		},
		getInitialState: function () {
			return {
				visible: false
			};
		},
		/**
   * set z-index
   */
		fixDocumentPadding: function () {
			document.body.style.paddingRight = 0;
		},
		/**
   * did update
   * @param prevProps
   * @param prevState
   */
		componentDidUpdate: function (prevProps, prevState) {
			this.fixDocumentPadding();
			if (this.state.visible) {
				$(document).on('keydown', this.onDocumentKeyDown);
			} else {
				$(document).off('keydown', this.onDocumentKeyDown);
			}
		},
		componentWillUpdate: function () {
			$(document).off('keydown', this.onDocumentKeyDown);
		},
		/**
   * did mount
   */
		componentDidMount: function () {
			this.fixDocumentPadding();
			if (this.state.visible) {
				$(document).on('keydown', this.onDocumentKeyDown);
			} else {
				$(document).off('keydown', this.onDocumentKeyDown);
			}
		},
		componentWillUnmount: function () {
			$(document).off('keydown', this.onDocumentKeyDown);
		},
		render: function () {
			if (!this.state.visible) {
				return null;
			}
			var css = {
				'n-on-request': true,
				modal: true,
				fade: true,
				in: true
			};
			if (this.props.className) {
				css[this.props.className] = true;
			}
			return React.createElement(
				"div",
				null,
				React.createElement("div", { className: "modal-backdrop fade in", style: { zIndex: NOnRequestModal.Z_INDEX } }),
				React.createElement(
					"div",
					{ className: $pt.LayoutHelper.classSet(css),
						tabIndex: "-1",
						role: "dialog",
						ref: "container",
						style: { display: 'block', zIndex: NOnRequestModal.Z_INDEX + 1 } },
					React.createElement(
						"div",
						{ className: "modal-danger modal-dialog", tabIndex: "0" },
						React.createElement(
							"div",
							{ className: "modal-content", role: "document" },
							React.createElement(
								"div",
								{ className: "modal-body", ref: "body" },
								React.createElement("span", { className: "fa fa-fw fa-lg fa-spin fa-spinner" }),
								" ",
								NOnRequestModal.WAITING_MESSAGE
							)
						)
					)
				)
			);
		},
		/**
   * hide dialog
   */
		hide: function () {
			this.setState({ visible: false });
		},
		/**
   * show dialog
   */
		show: function () {
			this.setState({ visible: true });
		},
		onDocumentKeyDown: function (evt) {
			if (evt.keyCode === 9) {
				// tab
				// evt.preventDefault();
				var target = $(evt.target);
				var container = $(this.refs.container);
				if (target.closest(container).length == 0) {
					container.focus();
				}
			}
		}
	});
	$pt.Components.NOnRequestModal = NOnRequestModal;
})(window, jQuery, React, ReactDOM, $pt);

/**
 * page footer.<br>
 */
(function (window, $, React, ReactDOM, $pt) {
	var NPageFooter = React.createClass({
		displayName: 'NPageFooter',
		statics: {
			TECH_BASE: 'Parrot',
			TECH_URL: 'https://github.com/bradwoo8621/parrot',
			COMPANY: 'NEST',
			COMPANY_URL: 'https://github.com/bradwoo8621/nest',
			LEFT_TEXT: 'For best viewing, we recommend using the latest Chrome version.'
		},
		getDefaultProps: function () {
			return {};
		},
		renderTech: function () {
			if (NPageFooter.TECH_BASE != null && !NPageFooter.TECH_BASE.isBlank()) {
				return React.createElement(
					'span',
					null,
					', on ',
					React.createElement(
						'a',
						{ href: NPageFooter.TECH_URL, target: '_blank', tabIndex: '-1' },
						NPageFooter.TECH_BASE
					)
				);
			}
			return null;
		},
		renderCompany: function () {
			if (NPageFooter.COMPANY != null && !NPageFooter.COMPANY.isBlank()) {
				return React.createElement(
					'span',
					null,
					', by ',
					React.createElement(
						'a',
						{ href: NPageFooter.COMPANY_URL, target: '_blank', tabIndex: '-1' },
						NPageFooter.COMPANY
					)
				);
			}
			return null;
		},
		render: function () {
			return React.createElement(
				'footer',
				{ className: 'footer' },
				React.createElement(
					'div',
					{ className: 'container' },
					React.createElement(
						'p',
						{ className: 'text-muted', style: { display: 'inline-block' } },
						React.createElement(
							'span',
							null,
							NPageFooter.LEFT_TEXT
						)
					),
					React.createElement(
						'p',
						{ className: 'text-muted pull-right', style: { display: 'inline-block' } },
						this.props.name,
						this.renderTech(),
						this.renderCompany(),
						'.'
					)
				)
			);
		}
	});
	$pt.Components.NPageFooter = NPageFooter;
})(window, jQuery, React, ReactDOM, $pt);

/**
 * Page Header<br>
 */
(function (window, $, React, ReactDOM, $pt) {
	var NPageHeader = React.createClass({
		displayName: 'NPageHeader',
		statics: {
			SEARCH_PLACEHOLDER: 'Search...'
		},
		getDefaultProps: function () {
			return {
				side: false
			};
		},
		/**
   * get initial state
   * @returns {*}
   */
		getInitialState: function () {
			return {
				model: $pt.createModel({
					text: null
				})
			};
		},
		componentDidMount: function () {
			if (this.props.side && this.props.menus) {
				this.state.sideMenu = NSideMenu.getSideMenu(this.props.menus, null, null, true);
			}
		},
		/**
   * render search box
   * @returns {XML}
   */
		renderSearchBox: function () {
			var layout = $pt.createCellLayout('text', {
				comp: {
					placeholder: NPageHeader.SEARCH_PLACEHOLDER,
					rightAddon: {
						icon: 'search',
						click: this.onSearchClicked
					}
				}
			});

			return React.createElement(
				'div',
				{ className: 'navbar-form navbar-right', role: 'search' },
				React.createElement($pt.Components.NText, { model: this.state.model, layout: layout })
			);
		},
		renderMenuItem: function (item, index, menus, onTopLevel) {
			if (item.children !== undefined) {
				// render dropdown menu
				var _this = this;
				return React.createElement(
					'li',
					{ className: onTopLevel ? "dropdown" : "dropdown-submenu", key: index },
					React.createElement(
						'a',
						{ href: '#', className: 'dropdown-toggle', 'data-toggle': 'dropdown', role: 'button',
							'aria-expanded': 'false' },
						item.text,
						' ',
						onTopLevel ? React.createElement('span', { className: 'caret' }) : null
					),
					React.createElement(
						'ul',
						{ className: 'dropdown-menu', role: 'menu' },
						item.children.map(function (childItem, childIndex, dropdownItems) {
							return _this.renderMenuItem(childItem, childIndex, dropdownItems, false);
						})
					)
				);
			} else if (item.divider === true) {
				// render divider
				return React.createElement('li', { className: 'divider', key: index });
			} else if (item.func !== undefined) {
				// call javascript function
				return React.createElement(
					'li',
					null,
					React.createElement(
						'a',
						{ href: 'javascript:void(0);', onClick: this.onMenuClicked.bind(this, item.func), key: index },
						item.text
					)
				);
			} else {
				// jump to url
				return React.createElement(
					'li',
					{ key: index },
					React.createElement(
						'a',
						{ href: item.url },
						item.text
					)
				);
			}
		},
		/**
   * render menus
   * @returns {XML}
   */
		renderMenus: function () {
			var _this = this;
			var css = {
				'nav navbar-nav': true
			};
			if (this.props.side) {
				css['nav-side'] = true;
			}
			return React.createElement(
				'ul',
				{ className: $pt.LayoutHelper.classSet(css) },
				this.props.menus.map(function (item, index, menu) {
					return _this.renderMenuItem(item, index, menu, true);
				})
			);
		},
		renderBrand: function () {
			if (this.props.brandUrl) {
				return React.createElement(
					'a',
					{ href: this.props.brandUrl },
					React.createElement(
						'span',
						{ className: 'navbar-brand' },
						this.props.brand
					)
				);
			} else if (this.props.brandFunc || this.props.side) {
				return React.createElement(
					'a',
					{ href: 'javascript:void(0);',
						onMouseEnter: this.onBrandMouseEnter,
						onMouseLeave: this.onBrandMouseLeave,
						onClick: this.onBrandClicked },
					React.createElement(
						'span',
						{ className: 'navbar-brand' },
						this.props.brand
					)
				);
			} else {
				return React.createElement(
					'span',
					{ className: 'navbar-brand' },
					this.props.brand
				);
			}
		},
		onBrandMouseEnter: function () {
			if (this.props.side) {
				if (this.state.sideMenu) {
					this.state.sideMenu.show();
				}
			}
		},
		onBrandMouseLeave: function () {
			if (this.props.side) {
				if (this.state.sideMenu) {
					this.state.sideMenu.willHide();
				}
			}
		},
		/**
   * on brand clicked
   */
		onBrandClicked: function () {
			if (this.props.brandFunc) {
				this.props.brandFunc.call(this);
			}
		},
		/**
   * on menu clicked
   * @param func
   */
		onMenuClicked: function (func) {
			func.call(this);
		},
		/**
   * on search clicked
   */
		onSearchClicked: function () {
			this.props.search.call(this, this.state.model.get('text'));
		},
		/**
   * render component
   * @returns {XML}
   */
		render: function () {
			return React.createElement(
				'nav',
				{ className: 'navbar navbar-default navbar-fixed-top' },
				React.createElement(
					'div',
					{ className: 'container-fluid' },
					React.createElement(
						'div',
						{ className: 'navbar-header' },
						React.createElement(
							'button',
							{ type: 'button', className: 'navbar-toggle collapsed', 'data-toggle': 'collapse',
								'data-target': '#navbar-1' },
							React.createElement(
								'span',
								{ className: 'sr-only' },
								'Toggle navigation'
							),
							React.createElement('span', { className: 'icon-bar' }),
							React.createElement('span', { className: 'icon-bar' }),
							React.createElement('span', { className: 'icon-bar' })
						),
						this.renderBrand()
					),
					React.createElement(
						'div',
						{ className: 'collapse navbar-collapse', id: 'navbar-1' },
						this.props.menus ? this.renderMenus() : null,
						this.props.search ? this.renderSearchBox() : null,
						this.props.custom ? this.props.custom.call(this) : null
					)
				)
			);
		}
	});
	$pt.Components.NPageHeader = NPageHeader;
})(window, jQuery, React, ReactDOM, $pt);

(function (window, $, React, ReactDOM, $pt) {
	var NPagination = React.createClass({
		displayName: 'NPagination',
		statics: {
			PAGE_TEXT: 'Page: '
		},
		/**
   * override react method
   * @returns {*}
   * @override
   */
		getDefaultProps: function () {
			return {
				maxPageButtons: 5,
				pageCount: 1, // page count default 1
				currentPageIndex: 1, // page number count from 1
				showStatus: true
			};
		},
		/**
   * make max page buttons is an odd number and at least 3
   */
		getMaxPageButtons: function () {
			var maxPageButtons = this.props.maxPageButtons * 1;
			if (maxPageButtons % 2 == 0) {
				maxPageButtons = maxPageButtons - 1;
			}
			if (maxPageButtons < 3) {
				maxPageButtons = 3;
			}
			return maxPageButtons;
		},
		/**
   * get buttons range
   * @returns {{min: number, max: number}}
   */
		getPageButtonsRange: function () {
			var currentPageIndex = this.getCurrentPageIndex();

			var maxPageButtons = this.getMaxPageButtons();
			// calc the steps from currentPageIndex to maxPageIndex(pageCount)
			var max = 0;
			var availablePageCountFromCurrent = this.getPageCount() - currentPageIndex;
			var maxButtonCountFromCurrent = Math.floor(maxPageButtons / 2);
			if (availablePageCountFromCurrent >= maxButtonCountFromCurrent) {
				//
				max = currentPageIndex + maxButtonCountFromCurrent;
			} else {
				max = currentPageIndex + availablePageCountFromCurrent;
				// move to min buttons, since no enough available pages to display
				maxButtonCountFromCurrent += maxButtonCountFromCurrent - availablePageCountFromCurrent;
			}
			// calc the steps from currentPageIndex to first page
			var min = 0;
			var availablePageCountBeforeCurrent = currentPageIndex - 1;
			if (availablePageCountBeforeCurrent >= maxButtonCountFromCurrent) {
				min = currentPageIndex - maxButtonCountFromCurrent;
			} else {
				min = 1;
			}

			// calc the steps
			if (max - min < maxPageButtons) {
				// no enough buttons
				max = min + maxPageButtons - 1;
				max = max > this.getPageCount() ? this.getPageCount() : max;
			}

			return { min: min, max: max };
		},
		/**
   * render button which jump to first page
   * @param buttonsRange
   * @returns {XML}
   */
		renderFirst: function (buttonsRange) {
			return React.createElement(
				'li',
				null,
				React.createElement(
					'a',
					{ href: 'javascript:void(0);', 'aria-label': 'First', onClick: this.toFirst },
					React.createElement('span', { className: 'fa fa-fw fa-fast-backward' })
				)
			);
		},
		/**
   * render button which jump to previous page section
   * @param buttonsRange
   * @returns {XML}
   */
		renderPreviousSection: function (buttonsRange) {
			return React.createElement(
				'li',
				null,
				React.createElement(
					'a',
					{ href: 'javascript:void(0);', 'aria-label': 'PreviousSection', onClick: this.toPreviousSection },
					React.createElement('span', { className: 'fa fa-fw fa-backward' })
				)
			);
		},
		/**
   * render button which jump to previous page
   * @param buttonsRange
   * @returns {XML}
   */
		renderPrevious: function (buttonsRange) {
			return React.createElement(
				'li',
				null,
				React.createElement(
					'a',
					{ href: 'javascript:void(0);', 'aria-label': 'Previous', onClick: this.toPrevious },
					React.createElement('span', { className: 'fa fa-fw fa-chevron-left' })
				)
			);
		},
		/**
   * render buttons
   * @param buttonsRange
   * @returns {[XML]}
   */
		renderButtons: function (buttonsRange) {
			var buttons = [];
			for (var index = buttonsRange.min; index <= buttonsRange.max; index++) {
				buttons.push(index);
			}
			var _this = this;
			return buttons.map(function (index) {
				var css = {
					active: index == _this.getCurrentPageIndex()
				};
				return React.createElement(
					'li',
					{ key: index },
					React.createElement(
						'a',
						{ href: 'javascript:void(0);',
							onClick: _this.toPage,
							'data-index': index,
							className: $pt.LayoutHelper.classSet(css) },
						index
					)
				);
			});
		},
		/**
   * render button which jump to next page
   * @param buttonsRange
   * @returns {XML}
   */
		renderNext: function (buttonsRange) {
			return React.createElement(
				'li',
				null,
				React.createElement(
					'a',
					{ href: 'javascript:void(0);', 'aria-label': 'Next', onClick: this.toNext },
					React.createElement('span', { className: 'fa fa-fw fa-chevron-right' })
				)
			);
		},
		/**
   * render button which jump to next page section
   * @param buttonsRange
   * @returns {XML}
   */
		renderNextSection: function (buttonsRange) {
			return React.createElement(
				'li',
				null,
				React.createElement(
					'a',
					{ href: 'javascript:void(0);', 'aria-label': 'NextSection', onClick: this.toNextSection },
					React.createElement('span', { className: 'fa fa-fw fa-forward' })
				)
			);
		},
		/**
   * render button which jump to last page
   * @param buttonsRange
   * @returns {XML}
   */
		renderLast: function (buttonsRange) {
			return React.createElement(
				'li',
				null,
				React.createElement(
					'a',
					{ href: 'javascript:void(0);', 'aria-label': 'Last', onClick: this.toLast },
					React.createElement('span', { className: 'fa fa-fw fa-fast-forward' })
				)
			);
		},
		/**
   * render status
   * @returns {XML}
   */
		renderStatus: function () {
			if (this.props.showStatus) {
				return React.createElement(
					'div',
					{ className: 'n-pagination-status col-sm-2 col-md-2 col-lg-2' },
					React.createElement(
						'div',
						null,
						NPagination.PAGE_TEXT,
						this.getCurrentPageIndex(),
						' / ',
						this.getPageCount()
					)
				);
			} else {
				return null;
			}
		},
		/**
   * override react method
   * @returns {XML}
   * @override
   */
		render: function () {
			var buttonsRange = this.getPageButtonsRange();
			var css = {
				row: true,
				'n-pagination': true
			};
			if (this.props.className) {
				css[this.props.className] = true;
			}
			var buttonCSS = {
				'n-pagination-buttons': true,
				'col-sm-10 col-md-10 col-lg-10': this.props.showStatus,
				'col-sm-12 col-md-12 col-lg-12': !this.props.showStatus
			};
			return React.createElement(
				'div',
				{ className: $pt.LayoutHelper.classSet(css) },
				this.renderStatus(),
				React.createElement(
					'div',
					{ className: $pt.LayoutHelper.classSet(buttonCSS) },
					React.createElement(
						'ul',
						{ className: 'pagination' },
						this.renderFirst(buttonsRange),
						this.renderPreviousSection(buttonsRange),
						this.renderPrevious(buttonsRange),
						this.renderButtons(buttonsRange),
						this.renderNext(buttonsRange),
						this.renderNextSection(buttonsRange),
						this.renderLast(buttonsRange)
					)
				)
			);
		},
		/**
   * get current page index
   * @param button
   * @returns {*|jQuery}
   */
		getCurrentPageIndex: function (button) {
			if (button) {
				return $(button).attr("data-index");
			} else {
				return this.props.currentPageIndex * 1;
			}
		},
		getPageCount: function () {
			return this.props.pageCount * 1;
		},
		/**
   * jump to first page
   */
		toFirst: function () {
			this.jumpTo(1);
		},
		/**
   * jump to previous page section
   */
		toPreviousSection: function () {
			var previousIndex = this.getCurrentPageIndex() - this.getMaxPageButtons();
			previousIndex = previousIndex < 1 ? 1 : previousIndex;
			this.jumpTo(previousIndex);
		},
		/**
   * jump to previous page
   */
		toPrevious: function () {
			var previousIndex = this.getCurrentPageIndex() - 1;
			this.jumpTo(previousIndex < 1 ? 1 : previousIndex);
		},
		/**
   * jump to given page according to event
   * @param evt
   */
		toPage: function (evt) {
			this.jumpTo(this.getCurrentPageIndex(evt.target));
		},
		/**
   * jump to next page
   */
		toNext: function () {
			var nextIndex = this.getCurrentPageIndex() + 1;
			this.jumpTo(nextIndex > this.getPageCount() ? this.getPageCount() : nextIndex);
		},
		/**
   * jump to next page section
   */
		toNextSection: function () {
			var nextIndex = this.getCurrentPageIndex() + this.getMaxPageButtons();
			nextIndex = nextIndex > this.getPageCount() ? this.getPageCount() : nextIndex;
			this.jumpTo(nextIndex);
		},
		/**
   * jump to last page
   */
		toLast: function () {
			this.jumpTo(this.getPageCount());
		},
		/**
   * jump to given page index
   * @param pageIndex
   */
		jumpTo: function (pageIndex) {
			pageIndex = pageIndex * 1;
			$(':focus').blur();
			if (pageIndex - this.getCurrentPageIndex() == 0) {
				return;
			}
			// this.props.currentPageIndex = pageIndex;
			// this.forceUpdate();
			if (this.props.toPage) {
				this.props.toPage.call(this, pageIndex);
			}
		}
	});
	$pt.Components.NPagination = NPagination;
})(window, jQuery, React, ReactDOM, $pt);

(function (window, $, React, ReactDOM, $pt) {
	var NPanel = React.createClass($pt.defineCellComponent({
		displayName: 'NPanel',
		getDefaultProps: function () {
			return {
				defaultOptions: {
					collapsible: false,
					expanded: true,
					style: 'default'
				}
			};
		},
		installMonitors: function () {
			if (this.hasCheckInTitle()) {
				this.getModel().addPostChangeListener(this.getCheckInTitleDataId(), this.onTitleCheckChanged);
			}
		},
		uninstallMonitors: function () {
			if (this.hasCheckInTitle()) {
				this.getModel().removePostChangeListener(this.getCheckInTitleDataId(), this.onTitleCheckChanged);
			}
		},
		beforeWillUpdate: function (nextProps) {
			this.uninstallMonitors();
		},
		beforeDidUpdate: function (prevProps, prevState) {
			this.installMonitors();
		},
		beforeDidMount: function () {
			this.installMonitors();
		},
		beforeWillUnmount: function () {
			this.uninstallMonitors();
		},
		getDependencyOptions: function () {
			return ['collapsedLabel', 'expandedLabel'];
		},
		/**
   * render check in title
   * @returns {XML}
   */
		renderCheckInTitle: function () {
			if (!this.hasCheckInTitle()) {
				return null;
			}

			var layout = {
				label: this.getCheckInTitleLabel(),
				dataId: this.getCheckInTitleDataId(),
				comp: $.extend({ labelAttached: 'left' }, this.getCheckInTitleOption(), {
					type: $pt.ComponentConstants.Check,
					labelDirection: 'horizontal'
				})
			};
			return React.createElement(
				'div',
				null,
				'(',
				React.createElement($pt.Components.NCheck, { model: this.getModel(), layout: $pt.createCellLayout('check', layout), view: this.isViewMode() }),
				')'
			);
		},
		renderHeadingButtons: function () {
			var headButtons = this.getComponentOption('headerButtons');
			if (headButtons) {
				headButtons = Array.isArray(headButtons) ? headButtons : [headButtons];
				var _this = this;
				return React.createElement(
					'div',
					{ className: 'btn-toolbar pull-right', role: 'toolbar' },
					headButtons.map(function (button, buttonIndex) {
						if (_this.isViewMode() && button.view == 'edit') {
							return null;
						} else if (!_this.isViewMode() && button.view == 'view') {
							return null;
						}
						var layout = {
							label: button.text,
							comp: button
						};
						// delete layout.comp.label;
						// console.log(layout);
						return React.createElement($pt.Components.NFormButton, { model: _this.getModel(),
							layout: $pt.createCellLayout('pseudo-button', layout),
							key: buttonIndex });
					}).filter(function (button) {
						return button != null;
					})
				);
			} else {
				return null;
			}
		},
		renderCustomHeader: function () {
			var customHeader = this.getComponentOption('customHeader');
			if (typeof customHeader === 'function') {
				return customHeader.call(this);
			} else {
				return customHeader;
			}
		},
		/**
   * render heading
   * @returns {XML}
   */
		renderHeading: function () {
			var label = this.getTitle();
			var css = {
				'panel-title': true
			};
			if (this.isCollapsible()) {
				css['n-collapsible-title-check'] = this.hasCheckInTitle();
				return React.createElement(
					'div',
					{ className: 'panel-heading' },
					React.createElement(
						'h4',
						{ className: $pt.LayoutHelper.classSet(css) },
						React.createElement(
							'a',
							{ href: 'javascript:void(0);', onClick: this.onTitleClicked, ref: 'head' },
							label
						),
						this.renderCheckInTitle()
					),
					this.renderCustomHeader(),
					this.renderHeadingButtons()
				);
			} else if (this.hasCheckInTitle()) {
				css['n-normal-title-check'] = this.hasCheckInTitle();
				return React.createElement(
					'div',
					{ className: 'panel-heading' },
					React.createElement(
						'h4',
						{ className: $pt.LayoutHelper.classSet(css) },
						React.createElement(
							'span',
							{ ref: 'head' },
							label
						),
						this.renderCheckInTitle()
					),
					this.renderCustomHeader(),
					this.renderHeadingButtons()
				);
			} else {
				return React.createElement(
					'div',
					{ className: 'panel-heading', ref: 'head' },
					label,
					this.renderCustomHeader(),
					this.renderHeadingButtons()
				);
			}
		},
		/**
   * render row
   * @param row {RowLayout}
   */
		renderRow: function (row, rowIndex) {
			var _this = this;
			var cells = row.getCells().map(function (cell, cellIndex) {
				return React.createElement($pt.Components.NFormCell, { layout: cell,
					model: _this.getModel(),
					ref: cell.getId(),
					direction: _this.props.direction,
					view: _this.isViewMode(),
					key: '' + rowIndex + '-' + cellIndex });
			});
			return React.createElement(
				'div',
				{ className: 'row', key: rowIndex },
				cells
			);
		},
		/**
   * render
   * @returns {XML}
   */
		render: function () {
			var label = this.getLayout().getLabel(this);
			if (label == null) {
				return React.createElement(
					'div',
					{ ref: 'panel' },
					this.getInnerLayout().getRows().map(this.renderRow)
				);
			}
			var expanded = this.canExpanded() && this.isExpanded();
			var css = {
				panel: true,
				'panel-collapsible': this.isCollapsible(),
				'panel-expanded': expanded
			};
			css['panel-' + this.getStyle()] = true;
			css[this.getComponentCSS('n-panel')] = true;
			var bodyStyle = {
				display: expanded ? 'block' : 'none'
			};
			return React.createElement(
				'div',
				{ className: $pt.LayoutHelper.classSet(css), ref: 'panel' },
				this.renderHeading(),
				React.createElement(
					'div',
					{ className: 'panel-body', style: bodyStyle, ref: 'body' },
					this.getInnerLayout().getRows().map(this.renderRow)
				)
			);
		},
		/**
   * get inner layout
   * @returns {SectionLayout}
   */
		getInnerLayout: function () {
			return $pt.createSectionLayout({ layout: this.getComponentOption('editLayout') });
		},
		/**
   * is collapsible or not
   * @returns {boolean}
   */
		isCollapsible: function () {
			return this.getComponentOption('collapsible');
		},
		/**
   * is expanded
   * @returns {boolean}
   */
		isExpanded: function () {
			if (this.state.expanded == null) {
				// first equals 'expanded' definition
				this.state.expanded = this.getComponentOption('expanded');
				if (this.hasCheckInTitle()) {
					// when there is a check-box in title
					var value = this.getCheckInTitleValue();
					var action = this.getCheckInTitleCollapsible();
					if (action === 'same') {
						// check behavior same as collapsible
						// all expanded, finally expanded
						this.state.expanded = this.state.expanded && value === true;
					} else if (action === 'reverse') {
						// check behavior reversed as collapsible
						// all expanded, finally expanded
						this.state.expanded = this.state.expanded && value !== true;
					}
				}
			}
			return this.state.expanded;
		},
		/**
   * get style
   * @returns {string}
   */
		getStyle: function () {
			return this.getComponentOption('style');
		},
		getTitle: function () {
			var label = this.getLayout().getLabel(this);
			if (this.state.expanded) {
				var expandedLabel = this.getExpandedLabelRenderer();
				if (expandedLabel) {
					if (typeof expandedLabel === 'string') {
						label = expandedLabel;
					} else {
						label = expandedLabel.when.call(this, this.getModel());
					}
				}
			} else {
				var collapsedLabel = this.getCollapsedLabelRenderer();
				if (collapsedLabel) {
					if (typeof collapsedLabel === 'string') {
						label = collapsedLabel;
					} else {
						label = collapsedLabel.when.call(this, this.getModel());
					}
				}
			}
			return label;
		},
		getExpandedLabelRenderer: function () {
			return this.getComponentOption('expandedLabel');
		},
		getCollapsedLabelRenderer: function () {
			return this.getComponentOption('collapsedLabel');
		},
		/**
   * has check box in title or not
   * @returns {boolean}
   */
		hasCheckInTitle: function () {
			return this.getComponentOption('checkInTitle') != null;
		},
		/**
   * get check box value of panel title
   * @returns {boolean}
   */
		getCheckInTitleValue: function () {
			var id = this.getCheckInTitleDataId();
			return id ? this.getModel().get(id) : null;
		},
		/**
   * get check box data id of panel title
   * @returns {string}
   */
		getCheckInTitleDataId: function () {
			var checkInTitle = this.getComponentOption('checkInTitle');
			return checkInTitle ? checkInTitle.data : null;
		},
		/**
   * get check box label of panel title
   * @returns {string}
   */
		getCheckInTitleLabel: function () {
			var checkInTitle = this.getComponentOption('checkInTitle');
			return checkInTitle ? checkInTitle.label : null;
		},
		/**
   * get check box value and collapsible is related or not
   * @returns {same|reverse}
   */
		getCheckInTitleCollapsible: function () {
			var checkInTitle = this.getComponentOption('checkInTitle');
			return checkInTitle ? checkInTitle.collapsible : null;
		},
		/**
   * get other check in title options
   * @returns {null}
   */
		getCheckInTitleOption: function () {
			var checkInTitle = this.getComponentOption('checkInTitle');
			if (checkInTitle) {
				var options = $.extend({}, checkInTitle);
				delete options.data;
				delete options.label;
				delete options.collapsible;
				return options;
			} else {
				return null;
			}
		},
		/**
   * on title clicked
   * @param e
   */
		onTitleClicked: function (e) {
			e.selected = false;
			e.preventDefault();
			this.toggleExpanded(!this.state.expanded);
		},
		/**
   * on title check-box value changed
   * @param evt
   */
		onTitleCheckChanged: function (evt) {
			var value = evt.new;
			var collapsible = this.getCheckInTitleCollapsible();
			if (collapsible === 'same') {
				this.toggleExpanded(value);
			} else if (collapsible === 'reverse') {
				this.toggleExpanded(!value);
			}
		},
		/**
   * toggle panel expanded
   * @param expanded {boolean}
   */
		toggleExpanded: function (expanded) {
			if (expanded) {
				if (this.canExpanded()) {
					// panel can be expanded
					$(ReactDOM.findDOMNode(this.refs.body)).slideDown(300, function () {
						this.setState({ expanded: true });
					}.bind(this));
				}
			} else {
				$(ReactDOM.findDOMNode(this.refs.body)).slideUp(300, function () {
					this.setState({ expanded: false });
				}.bind(this));
			}
		},
		/**
   * check the panel can expanded or not
   * @returns {boolean}
   */
		canExpanded: function () {
			if (this.hasCheckInTitle()) {
				var value = this.getCheckInTitleValue();
				var collapsible = this.getCheckInTitleCollapsible();
				if (collapsible === 'same') {
					// check behavior same as collapsible
					return value === true;
				} else if (collapsible === 'reverse') {
					// check behavior reversed as collapsible
					return value !== true;
				}
			}
			return true;
		}
	}));
	$pt.Components.NPanel = NPanel;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.Panel, function (model, layout, direction, viewMode) {
		return React.createElement($pt.Components.NPanel, $pt.LayoutHelper.transformParameters(model, layout, direction, viewMode));
	});
})(window, jQuery, React, ReactDOM, $pt);

/**
 * panel footer which only contains buttons
 * depends NFormButton
 */
(function (window, $, React, ReactDOM, $pt) {
	var NPanelFooter = React.createClass({
		displayName: 'NPanelFooter',
		statics: {
			RESET_TEXT: "Reset",
			RESET_ICON: "reply-all",
			RESET_STYLE: "warning",

			VALIDATE_TEXT: "Validate",
			VALIDATE_ICON: "bug",
			VALIDATE_STYLE: "default",

			SAVE_TEXT: 'Save',
			SAVE_ICON: 'floppy-o',
			SAVE_STYLE: 'primary',

			CANCEL_TEXT: 'Cancel',
			CANCEL_ICON: 'ban',
			CANCEL_STYLE: 'danger'
		},
		// componentWillUpdate: function (nextProps) {
		// },
		// componentDidUpdate: function (prevProps, prevState) {
		// },
		// componentDidMount: function () {
		// },
		// componentWillUnmount: function () {
		// },
		/**
   * render left buttons
   */
		renderLeftButtons: function () {
			if (this.props.left) {
				if (Array.isArray(this.props.left)) {
					return this.props.left.map(function (button, buttonIndex) {
						return this.renderButton(button, buttonIndex, true);
					}.bind(this));
				} else {
					return this.renderButton(this.props.left, 'left', true);
				}
			} else {
				return null;
			}
		},
		/**
   * render right buttons
   */
		renderRightButtons: function () {
			if (this.props.right) {
				if (Array.isArray(this.props.right)) {
					return this.props.right.map(function (button, buttonIndex) {
						return this.renderButton(button, buttonIndex, false);
					}.bind(this));
				} else {
					return this.renderButton(this.props.right, 'right', false);
				}
			} else {
				return null;
			}
		},
		/**
   * render button
   */
		renderButton: function (option, buttonIndex, onLeft) {
			if (this.isViewMode() && option.view == 'edit') {
				return null;
			} else if (!this.isViewMode() && option.view == 'view') {
				return null;
			}
			var layout = $.extend(true, {
				label: option.text,
				comp: { type: $pt.ComponentConstants.Button },
				css: { comp: onLeft ? 'on-left' : 'on-right' }
			}, {
				comp: option
			});
			delete layout.comp.label;
			var model = this.getModel();
			return React.createElement($pt.Components.NFormButton, { model: this.getModel(),
				layout: $pt.createCellLayout('pseudo-button', layout),
				key: buttonIndex });
			// }
		},
		/**
   * render
   * @returns {XML}
   */
		render: function () {
			return React.createElement(
				"div",
				{ className: "row n-panel-footer" },
				React.createElement(
					"div",
					{ className: "col-sm-12 col-md-12 col-lg-12" },
					React.createElement(
						"div",
						{ className: "btn-toolbar", role: "toolbar" },
						this.props.reset ? this.renderButton({
							icon: NPanelFooter.RESET_ICON,
							text: NPanelFooter.RESET_TEXT,
							style: NPanelFooter.RESET_STYLE,
							click: this.props.reset.click ? this.props.reset.click : this.props.reset,
							enabled: this.props.reset.enabled ? this.props.reset.enabled : true,
							visible: this.props.reset.visible ? this.props.reset.visible : true
						}, 'reset', true) : null,
						this.props.validate ? this.renderButton({
							icon: NPanelFooter.VALIDATE_ICON,
							text: NPanelFooter.VALIDATE_TEXT,
							style: NPanelFooter.VALIDATE_STYLE,
							click: this.props.validate.click ? this.props.validate.click : this.props.validate,
							enabled: this.props.validate.enabled ? this.props.validate.enabled : true,
							visible: this.props.validate.visible ? this.props.validate.visible : true
						}, 'validate', true) : null,
						this.renderLeftButtons(),
						this.props.cancel ? this.renderButton({
							icon: NPanelFooter.CANCEL_ICON,
							text: NPanelFooter.CANCEL_TEXT,
							style: NPanelFooter.CANCEL_STYLE,
							click: this.props.cancel.click ? this.props.cancel.click : this.props.cancel,
							enabled: this.props.cancel.enabled ? this.props.cancel.enabled : true,
							visible: this.props.cancel.visible ? this.props.cancel.visible : true
						}, 'cancel', false) : null,
						this.props.save ? this.renderButton({
							icon: NPanelFooter.SAVE_ICON,
							text: NPanelFooter.SAVE_TEXT,
							style: NPanelFooter.SAVE_STYLE,
							click: this.props.save.click ? this.props.save.click : this.props.save,
							enabled: this.props.save.enabled ? this.props.save.enabled : true,
							visible: this.props.save.visible ? this.props.save.visible : true
						}, 'save', false) : null,
						this.renderRightButtons()
					)
				)
			);
		},
		/**
   * get model
   * @returns {ModelInterface}
   */
		getModel: function () {
			return this.props.model == null ? $pt.createModel({}) : this.props.model;
		},
		isViewMode: function () {
			return this.props.view;
		}
	});
	$pt.Components.NPanelFooter = NPanelFooter;
})(window, jQuery, React, ReactDOM, $pt);

(function (window, $, React, ReactDOM, $pt) {
	var NRadio = React.createClass($pt.defineCellComponent({
		displayName: 'NRadio',
		getDefaultProps: function () {
			return {
				defaultOptions: {
					direction: 'horizontal',
					labelAtLeft: false
				}
			};
		},
		/**
   * render label
   * @param option {{text:string}}
   * @param labelInLeft {boolean}
   * @returns {XML}
   */
		renderLabel: function (option, labelInLeft) {
			var css = {
				'radio-label': true,
				disabled: !this.isEnabled(),
				'radio-label-left': labelInLeft
			};
			return React.createElement(
				'span',
				{ className: $pt.LayoutHelper.classSet(css),
					onClick: this.isEnabled() && !this.isViewMode() ? this.onButtonClicked.bind(this, option) : null },
				option.text
			);
		},
		/**
   * render radio button, using font awesome instead
   * @params option radio option
   * @returns {XML}
   */
		renderRadio: function (option, optionIndex) {
			var checked = this.getValueFromModel() == option.id;
			var enabled = this.isEnabled();
			var css = {
				disabled: !enabled,
				checked: checked,
				'radio-container': true
			};
			var labelAtLeft = this.isLabelAtLeft();
			return React.createElement(
				'div',
				{ className: 'n-radio-option', key: optionIndex },
				labelAtLeft ? this.renderLabel(option, true) : null,
				React.createElement(
					'div',
					{ className: 'radio-container' },
					React.createElement(
						'span',
						{ className: $pt.LayoutHelper.classSet(css),
							onClick: enabled && !this.isViewMode() ? this.onButtonClicked.bind(this, option) : null,
							onKeyUp: enabled && !this.isViewMode() ? this.onKeyUp.bind(this, option) : null,
							tabIndex: '0',
							ref: 'out-' + option.id },
						React.createElement('span', { className: 'check', onClick: this.onInnerClicked.bind(this, option) })
					)
				),
				labelAtLeft ? null : this.renderLabel(option, false)
			);
		},
		render: function () {
			var css = {
				'n-radio': true,
				vertical: this.getComponentOption('direction') === 'vertical',
				'n-disabled': !this.isEnabled(),
				'n-view-mode': this.isViewMode()
			};
			return React.createElement($pt.Components.NCodeTableWrapper, { codetable: this.getCodeTable(),
				className: $pt.LayoutHelper.classSet(css),
				model: this.getModel(),
				layout: this.getLayout(),
				renderer: this.getRealRenderer });
		},
		getRealRenderer: function () {
			var css = {
				'n-radio': true,
				vertical: this.getComponentOption('direction') === 'vertical',
				'n-disabled': !this.isEnabled(),
				'n-view-mode': this.isViewMode()
			};
			return React.createElement(
				'div',
				{ className: this.getComponentCSS($pt.LayoutHelper.classSet(css)) },
				this.getCodeTable().map(this.renderRadio)
			);
		},
		getCodeTable: function () {
			return this.getComponentOption("data");
		},
		/**
   * inner span clicked, force focus to outer span
   * for fix the outer span cannot gain focus in IE11
   * @param option
   */
		onInnerClicked: function (option) {
			$(ReactDOM.findDOMNode(this.refs['out-' + option.id])).focus();
		},
		/**
   * on button clicked
   * @param option
   */
		onButtonClicked: function (option) {
			this.setValueToModel(option.id);
		},
		onKeyUp: function (option, evt) {
			if (evt.keyCode == '32') {
				this.onButtonClicked(option);
			}
		},
		isLabelAtLeft: function () {
			return this.getComponentOption('labelAtLeft');
		}
	}));
	$pt.Components.NRadio = NRadio;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.Radio, function (model, layout, direction, viewMode) {
		return React.createElement($pt.Components.NRadio, $pt.LayoutHelper.transformParameters(model, layout, direction, viewMode));
	});
})(window, jQuery, React, ReactDOM, $pt);

/**
 * search text
 */
(function (window, $, React, ReactDOM, $pt) {
	var NSearchText = React.createClass($pt.defineCellComponent({
		displayName: 'NSearchText',
		statics: {
			ADVANCED_SEARCH_BUTTON_ICON: 'search',
			ADVANCED_SEARCH_DIALOG_NAME_LABEL: 'Name',
			ADVANCED_SEARCH_DIALOG_BUTTON_TEXT: 'Search',
			ADVANCED_SEARCH_DIALOG_CODE_LABEL: 'Code',
			ADVANCED_SEARCH_DIALOG_RESULT_TITLE: 'Search Result',
			NOT_FOUND: 'Not Found',
			SEARCH_PROXY: null,
			SEARCH_PROXY_CALLBACK: null,
			ADVANCED_SEARCH_PROXY: null,
			ADVANCED_SEARCH_PROXY_CALLBACK: null
		},
		getDefaultProps: function () {
			return {
				defaultOptions: {}
			};
		},
		getInitialState: function () {
			return {
				stopRetrieveLabelFromRemote: false
			};
		},
		beforeDidUpdate: function (prevProps, prevState) {
			this.initSetValues();
		},
		beforeDidMount: function () {
			// set model value to component
			this.initSetValues();
		},
		/**
   * render
   * @returns {XML}
   */
		render: function () {
			if (this.isViewMode()) {
				return this.renderInViewMode();
			}
			var enabled = this.isEnabled();
			var css = {
				'n-search-text': true
			};
			if (!enabled) {
				css['n-disabled'] = true;
			}
			var middleSpanStyle = {
				width: '0'
			};
			return React.createElement(
				'div',
				{ className: this.getComponentCSS($pt.LayoutHelper.classSet(css)) },
				React.createElement(
					'div',
					{ className: 'input-group' },
					React.createElement('input', { type: 'text', className: 'form-control search-code', onKeyUp: this.onComponentChange, ref: 'code',
						disabled: !enabled, onFocus: this.onComponentFocused, onBlur: this.onComponentBlurred }),
					React.createElement('span', { className: 'input-group-btn', style: middleSpanStyle }),
					React.createElement('input', { type: 'text', className: 'form-control search-label', onFocus: this.onLabelFocused, ref: 'label',
						disabled: !enabled, tabIndex: -1 }),
					React.createElement(
						'span',
						{ className: 'input-group-addon advanced-search-btn',
							onClick: enabled ? this.showAdvancedSearchDialog : null },
						React.createElement('span', { className: 'fa fa-fw fa-' + NSearchText.ADVANCED_SEARCH_BUTTON_ICON })
					),
					this.renderNormalLine(),
					this.renderFocusLine()
				)
			);
		},
		/**
   * transfer focus to first text input
   */
		onLabelFocused: function () {
			this.getComponent().focus();
		},
		onComponentFocused: function () {
			$(ReactDOM.findDOMNode(this.refs.focusLine)).toggleClass('focus');
			$(ReactDOM.findDOMNode(this.refs.normalLine)).toggleClass('focus');
		},
		onComponentBlurred: function () {
			$(ReactDOM.findDOMNode(this.refs.focusLine)).toggleClass('focus');
			$(ReactDOM.findDOMNode(this.refs.normalLine)).toggleClass('focus');
		},
		/**
   * on component changed
   */
		onComponentChange: function (evt) {
			var value = evt.target.value;
			this.setValueToModel(evt.target.value);
		},
		/**
   * on model change
   * @param evt
   */
		onModelChanged: function (evt) {
			var value = evt.new;
			this.getComponent().val(value);
			this.retrieveAndSetLabelTextFromRemote(value);
		},
		/**
   * show advanced search dialog
   */
		showAdvancedSearchDialog: function () {
			if (!this.state.searchDialog) {
				this.state.searchDialog = $pt.Components.NModalForm.createFormModal(this.getLayout().getLabel(this), 'advanced-search-dialog');
			}
			this.state.searchDialog.show({
				model: this.getAdvancedSearchDialogModel(),
				layout: this.getAdvancedSearchDialogLayout(),
				buttons: {
					reset: false,
					validate: false,
					cancel: false
				}
			});
		},
		/**
   * pickup advanced result item
   * @param item
   */
		pickupAdvancedResultItem: function (item) {
			this.state.stopRetrieveLabelFromRemote = true;
			this.getModel().set(this.getDataId(), item.code);
			this.setLabelText(item.name);
			this.state.stopRetrieveLabelFromRemote = false;
		},
		initSetValues: function () {
			var value = this.getValueFromModel();
			if (!this.isViewMode()) {
				this.getComponent().val(value);
			}
			var labelPropertyId = this.getComponentOption('labelPropId');
			if (labelPropertyId) {
				this.setLabelText(this.getModel().get(labelPropertyId));
			} else {
				// send ajax request
				this.retrieveAndSetLabelTextFromRemote(value);
			}
		},
		setLabelText: function (text) {
			if (this.isViewMode()) {
				var value = this.getValueFromModel();
				if (value == null) {
					// $(ReactDOM.findDOMNode(this.refs.viewLabel)).text('');
				} else {
					var label = value;
					if (text == null) {
						label += ' - ' + NSearchText.NOT_FOUND;
					} else {
						label += ' - ' + text;
					}
					// $(ReactDOM.findDOMNode(this.refs.viewLabel)).text(label);
					var def = this.refs.viewLabel.getLayout().getDefinition();
					def.label = label;
					this.refs.viewLabel.forceUpdate();
					// this.refs.viewLabel.getLayout()
					// this.setState({viewLabel: label})
				}
			} else {
				$(ReactDOM.findDOMNode(this.refs.label)).val(text);
			}
			// if label property id defined, and value changed, set to model
			var labelPropertyId = this.getComponentOption('labelPropId');
			if (labelPropertyId) {
				var name = this.getModel().get(labelPropertyId);
				if (name != text) {
					this.getModel().set(labelPropertyId, name);
				}
			}
		},
		/**
   * get label text from remote
   */
		retrieveAndSetLabelTextFromRemote: function (value) {
			if (this.state.search != null) {
				clearTimeout(this.state.search);
			}

			if (this.state.stopRetrieveLabelFromRemote) {
				return;
			}

			var triggerDigits = this.getSearchTriggerDigits();
			if (triggerDigits == null) {
				throw new $pt.createComponentException($pt.ComponentConstants.Err_Search_Text_Trigger_Digits_Not_Defined, "Trigger digits cannot be null in search text.");
			}

			if (value == null) {
				value = '';
			}
			if (typeof value !== 'string') {
				value = value + '';
			}
			if (value.isBlank() || value.length != triggerDigits && triggerDigits != -1) {
				this.setLabelText(null);
				return;
			}

			var _this = this;
			this.state.search = setTimeout(function () {
				var postData = {
					code: value
				};
				if (NSearchText.SEARCH_PROXY) {
					postData = NSearchText.SEARCH_PROXY.call(_this, postData);
				}
				$pt.internalDoPost(_this.getSearchUrl(), postData, {
					quiet: true
				}).done(function (data) {
					if (typeof data === 'string') {
						data = JSON.parse(data);
					}
					var name = data.name;
					if (NSearchText.SEARCH_PROXY_CALLBACK) {
						name = NSearchText.SEARCH_PROXY_CALLBACK.call(_this, data);
					}
					_this.setLabelText(name);
				}).fail(function () {
					window.console.error('Error occured when retrieve label from remote in NSearch.');
					// arguments.slice(0).forEach(function(argu) {
					// 	window.console.error(argu);
					// });
				});
			}, 300);
		},
		/**
   * get search url
   * @returns {string}
   */
		getSearchUrl: function () {
			return this.getComponentOption("searchUrl");
		},
		/**
   * get advanced search url
   * @returns {string}
   */
		getAdvancedSearchUrl: function () {
			return this.getComponentOption("advancedUrl");
		},
		/**
   * get minimum digits to trigger search
   * @returns {number}
   */
		getSearchTriggerDigits: function () {
			return this.getComponentOption("searchTriggerDigits");
		},
		getComponent: function () {
			return $(ReactDOM.findDOMNode(this.refs.code));
		},
		// search dialog
		getAdvancedSearchDialogModel: function () {
			var model = this.getComponentOption('searchDialogModel');
			if (model == null) {
				model = {
					name: null,
					countPerPage: 10,
					pageIndex: 1,

					items: null,
					criteria: {
						pageIndex: 1,
						pageCount: 1,
						countPerPage: 10
					}
				};
			}
			return $pt.createModel(model);
		},
		getAdvancedSearchDialogLayout: function () {
			var _this = this;
			var layout = this.getComponentOption('searchDialogLayout');
			if (layout == null) {
				var direction = this.props.direction;
				if (!direction) {
					direction = NForm.LABEL_DIRECTION;
				}
				var buttonCSS = {
					'pull-right': true,
					'pull-down': direction == 'vertical'
				};

				layout = {
					name: {
						label: NSearchText.ADVANCED_SEARCH_DIALOG_NAME_LABEL,
						comp: {
							type: $pt.ComponentConstants.Text
						},
						pos: {
							row: 10,
							col: 10,
							width: 6
						}
					},
					button: {
						label: NSearchText.ADVANCED_SEARCH_DIALOG_BUTTON_TEXT,
						comp: {
							type: $pt.ComponentConstants.Button,
							style: 'primary',
							click: function (model) {
								var currentModel = $.extend({}, model.getCurrentModel());
								// remove query result and pagination criteria JSON, only remain the criteria data.
								delete currentModel.items;
								delete currentModel.criteria;

								if (NSearchText.ADVANCED_SEARCH_PROXY) {
									currentModel = NSearchText.ADVANCED_SEARCH_PROXY.call(this, currentModel);
								}

								$pt.internalDoPost(_this.getAdvancedSearchUrl(), currentModel, {
									done: function (data) {
										if (typeof data === 'string') {
											data = JSON.parse(data);
										}
										if (NSearchText.ADVANCED_SEARCH_PROXY_CALLBACK) {
											data = NSearchText.ADVANCED_SEARCH_PROXY_CALLBACK.call(this, data, this.getDataId());
										}
										model.mergeCurrentModel(data);
										model.set('criteria' + $pt.PROPERTY_SEPARATOR + 'url', this.getAdvancedSearchUrl());
										window.console.debug(model.getCurrentModel());
										this.state.searchDialog.forceUpdate();
									}.bind(_this)
								});
							}
						},
						css: {
							comp: $pt.LayoutHelper.classSet(buttonCSS)
						},
						pos: {
							row: 10,
							col: 20,
							width: 6
						}
					},
					items: {
						label: NSearchText.ADVANCED_SEARCH_DIALOG_RESULT_TITLE,
						comp: {
							type: $pt.ComponentConstants.Table,
							indexable: true,
							searchable: false,
							rowOperations: {
								icon: "check",
								click: function (row) {
									_this.pickupAdvancedResultItem(row);
									_this.state.searchDialog.hide();
								}
							},
							pageable: true,
							criteria: "criteria",
							columns: [{
								title: NSearchText.ADVANCED_SEARCH_DIALOG_CODE_LABEL,
								width: 200,
								data: "code"
							}, {
								title: NSearchText.ADVANCED_SEARCH_DIALOG_NAME_LABEL,
								width: 400,
								data: "name"
							}]
						},
						pos: {
							row: 20,
							col: 10,
							width: 12
						}
					}
				};
			} else {
				layout = layout.call(this);
			}
			return $pt.createFormLayout(layout);
		},
		getTextInViewMode: function () {
			var value = this.getValueFromModel();
			if (value != null) {
				// if (this.state.viewLabel) {
				// 	return this.state.viewLabel;
				// }
			}
			return value;
		}
	}));
	$pt.Components.NSearchText = NSearchText;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.Search, function (model, layout, direction, viewMode) {
		return React.createElement($pt.Components.NSearchText, $pt.LayoutHelper.transformParameters(model, layout, direction, viewMode));
	});
})(window, jQuery, React, ReactDOM, $pt);

(function (window, $, React, ReactDOM, $pt) {
	var NSelect = React.createClass($pt.defineCellComponent({
		displayName: 'NSelect',
		mixins: [$pt.mixins.PopoverMixin],
		statics: {
			POP_FIX_ON_BOTTOM: false,
			PLACEHOLDER: "Please Select...",
			NO_OPTION_FOUND: 'No Option Found',
			FILTER_PLACEHOLDER: 'Search...',
			CLOSE_TEXT: 'Close',
			CLEAR_TEXT: 'Clear'
		},
		getDefaultProps: function () {
			return {
				defaultOptions: {
					allowClear: true,
					minimumResultsForSearch: 1,
					data: [],

					availableWhenNoParentValue: false
					// other
					/*
      parentPropId: parent property id
      parentModel: parent model, default is this.props.model is not defined
      parentFilter: filter of options according to parent property value,
      can be property of self options
      or a function with parameters
      1: parent value
      2: self options array
      */
				}
			};
		},
		afterWillUpdate: function (nextProps) {
			if (this.hasParent()) {
				// add post change listener into parent model
				this.getParentModel().removePostChangeListener(this.getParentPropertyId(), this.onParentModelChanged);
			}
		},
		afterDidUpdate: function (prevProps, prevState) {
			this.checkLoadingState();
		},
		afterDidMount: function () {
			this.checkLoadingState();
		},
		checkLoadingState: function () {
			if (this.hasParent()) {
				// remove post change listener from parent model
				this.getParentModel().addPostChangeListener(this.getParentPropertyId(), this.onParentModelChanged);
			}
			if (this.state.onloading && !this.state.alreadySendRequest) {
				if (this.hasParent()) {
					var parentValue = this.getParentPropertyValue();
					if (parentValue == null) {
						// no parent value
						if (this.isAvailableWhenNoParentValue()) {
							this.getCodeTable().initializeRemote().done(function () {
								this.setState({ onloading: false });
							}.bind(this));
						} else {
							this.getCodeTable().setAsRemoteInitialized();
							this.setState({ onloading: false });
						}
					} else {
						this.getCodeTable().loadRemoteCodeSegment(parentValue).done(function () {
							this.setState({ onloading: false });
						}.bind(this));
					}
				} else {
					this.getCodeTable().initializeRemote().done(function () {
						this.setState({ onloading: false });
					}.bind(this));
				}
			}
		},
		afterWillUnmount: function () {
			if (this.hasParent()) {
				// remove post change listener from parent model
				this.getParentModel().removePostChangeListener(this.getParentPropertyId(), this.onParentModelChanged);
			}
		},
		renderClear: function () {
			if (!this.isClearAllowed()) {
				return null;
			}
			return React.createElement('span', { className: 'fa fa-fw fa-close clear',
				onClick: this.onClearClick });
		},
		getCurrentDisplayText: function () {
			var value = this.getValueFromModel();
			var itemText = null;
			if (this.hasParent() && this.isOnLoadingWhenHasParent() && value != null) {
				this.state.onloading = true;
			} else if (this.isOnLoadingWhenNoParent()) {
				this.state.onloading = true;
			} else if (value != null) {
				var item = this.getAvailableOptions().find(function (item) {
					return item.id == value;
				});
				if (item) {
					itemText = item.text;
				}
			}
			if (itemText == null) {
				itemText = this.state.onloading ? $pt.Components.NCodeTableWrapper.ON_LOADING : this.isViewMode() ? '' : this.getPlaceholder();
			}
			return itemText;
		},
		renderText: function () {
			var css = {
				'input-group': true,
				'form-control': true,
				'no-clear': !this.isClearAllowed()
			};
			return React.createElement(
				'div',
				{ className: $pt.LayoutHelper.classSet(css),
					onClick: this.onComponentClicked },
				React.createElement(
					'span',
					{ className: 'text' },
					this.getCurrentDisplayText()
				),
				this.renderClear(),
				React.createElement('span', { className: 'fa fa-fw fa-sort-down drop' })
			);
		},
		/**
   * render
   * @returns {XML}
   */
		render: function () {
			var css = {
				'n-disabled': !this.isEnabled(),
				'n-view-mode': this.isViewMode()
			};
			css[this.getComponentCSS('n-select')] = true;
			return React.createElement(
				'div',
				{ className: $pt.LayoutHelper.classSet(css),
					tabIndex: this.isEnabled() ? '0' : null,
					onKeyUp: this.onComponentKeyUp,
					'aria-readonly': 'true',
					readOnly: 'true',
					ref: 'comp' },
				this.renderText(),
				this.renderNormalLine(),
				this.renderFocusLine()
			);
		},
		renderOptions: function (options, filterText) {
			if (options == null || options.length == 0) {
				return null;
			}
			if (filterText != null && !filterText.isBlank()) {
				options = options == null ? null : options.filter(function (item) {
					return item.text.toLowerCase().indexOf(filterText.toLowerCase()) != -1;
				});
			}
			var _this = this;
			var value = this.getValueFromModel();
			return React.createElement(
				'ul',
				{ className: 'options',
					onTouchStart: this.isMobilePhone() ? this.onOptionTouchStart : null,
					onTouchMove: this.isMobilePhone() ? this.onOptionTouchMove : null,
					onTouchEnd: this.isMobilePhone() ? this.onOptionTouchEnd : null },
				options.map(function (item, itemIndex) {
					var css = {
						chosen: value == item.id
					};
					return React.createElement(
						'li',
						{ onClick: _this.onOptionClick.bind(_this, item),
							onMouseEnter: _this.onOptionMouseEnter,
							onMouseLeave: _this.onOptionMouseLeave,
							onMouseMove: _this.onOptionMouseMove,
							className: $pt.LayoutHelper.classSet(css),
							key: itemIndex,
							'data-id': item.id },
						React.createElement(
							'span',
							null,
							item.text
						)
					);
				})
			);
		},
		renderNoOption: function (options) {
			if (options == null || options.length == 0) {
				return React.createElement(
					'div',
					{ className: 'no-option' },
					React.createElement(
						'span',
						null,
						NSelect.NO_OPTION_FOUND
					)
				);
			}
			return null;
		},
		renderFilterText: function (options, filterText) {
			if (options == null || options.length == 0) {
				return;
			}
			if (this.hasFilterText()) {
				var model = $pt.createModel({
					text: filterText,
					// on mobile phone, set as true to disable the soft keyboard
					// set as false to enable it when popover render completed
					// see #onPopoverRenderComplete
					disabled: this.isMobilePhone() ? true : false
				});
				var layout = $pt.createCellLayout('text', {
					comp: {
						placeholder: NSelect.FILTER_PLACEHOLDER,
						enabled: {
							depends: 'disabled',
							when: function (model) {
								return model.get('disabled') !== true;
							}
						}
					},
					evt: {
						keyUp: this.onComponentKeyUp
					}
				});
				model.addPostChangeListener('text', this.onFilterTextChange);
				this.state.filterModel = model;
				return React.createElement($pt.Components.NText, { model: model, layout: layout });
			} else {
				return null;
			}
		},
		renderPopoverOperations: function () {
			if (!this.isMobilePhone()) {
				return null;
			}
			return React.createElement(
				'div',
				{ className: 'operations row' },
				React.createElement(
					'div',
					null,
					React.createElement(
						'a',
						{ href: 'javascript:void(0);', onClick: this.hidePopover },
						React.createElement(
							'span',
							null,
							NSelect.CLOSE_TEXT
						)
					),
					this.getComponentOption('allowClear') ? React.createElement(
						'a',
						{ href: 'javascript:void(0);', onClick: this.onClearClick },
						React.createElement(
							'span',
							null,
							NSelect.CLEAR_TEXT
						)
					) : null
				)
			);
		},
		renderPopoverContent: function (filterText) {
			var options = this.getAvailableOptions();
			return React.createElement(
				'div',
				{ className: this.hasFilterText() ? 'has-filter' : '' },
				this.renderFilterText(options, filterText),
				this.renderNoOption(options),
				this.renderOptions(options, filterText),
				this.renderPopoverOperations()
			);
		},
		getPopoverContainerCSS: function () {
			return 'n-select-popover';
		},
		beforeShowPopover: function () {
			if (this.state.popoverDiv) {
				// log the last active option
				var activeOption = this.state.popoverDiv.find('ul.options > li.active');
				this.state.lastActiveOptionId = activeOption.attr('data-id');
			} else {
				delete this.state.lastActiveOptionId;
			}
		},
		afterPopoverRenderComplete: function () {
			// only recalculate when not mobile phone
			if (!this.isMobilePhone()) {
				// if there is no active option, set first as active
				var options = this.state.popoverDiv.find('ul.options > li');
				if (options.length != 0) {
					if (this.state.lastActiveOptionId) {
						// according to react mechanism, must remove the existed active option first
						// since active is not render by react by jquery, react will keep it
						// active the last active option if exists
						options.removeClass('active').filter(function (index, option) {
							return $(option).attr('data-id') == this.state.lastActiveOptionId;
						}.bind(this)).addClass('active');
					}
					if (this.state.popoverDiv.find('ul.options > li.active').length == 0) {
						// active the first if no active option
						this.state.popoverDiv.find('ul.options > li').first().addClass('active');
					}
				}
			}
			var filterText = this.state.popoverDiv.find('div.n-text input[type=text]');
			if (filterText.length > 0 && !filterText.is(':focus')) {
				if (this.state.filteTextCaret != null) {
					filterText.caret(this.state.filteTextCaret);
				} else if (filterText.val().length > 0) {
					filterText.caret(filterText.val().length);
				}
				if (!this.isMobile()) {
					filterText.focus();
				} else {
					// filterText.blur();
				}
			}
			// set as false anyway to let search text enabled
			// actually only in mobile phone, it is set as true when renderring
			// see #renderFilterText
			if (this.state.filterModel) {
				this.state.filterModel.set('disabled', false);
			}
		},
		isOnLoadingWhenHasParent: function () {
			var codetable = this.getCodeTable();
			if (codetable == null || Array.isArray(codetable) || !codetable.isRemote()) {
				return false;
			}
			var parentValue = this.getParentPropertyValue();
			if (parentValue == null) {
				// no parent value
				if (this.isAvailableWhenNoParentValue()) {
					// still need options
					// check code table is remote and not initialized
					// is on loading
					return codetable.isRemoteButNotInitialized();
				} else {
					// otherwise not need load options
					codetable.setAsRemoteInitialized();
					return false;
				}
			} else {
				// has parent value
				// check code table segment is loaded or not
				return !codetable.isSegmentLoaded(parentValue);
			}
		},
		isOnLoadingWhenNoParent: function () {
			// var value = this.getValueFromModel();
			var codetable = this.getCodeTable();
			// remote and not initialized
			// is on loading
			return codetable != null && !Array.isArray(codetable) && codetable.isRemoteButNotInitialized();
		},
		onComponentClicked: function () {
			if (!this.isEnabled() || this.isViewMode()) {
				// do nothing
				return;
			}
			if (!this.state.popoverDiv || !this.state.popoverDiv.is(':visible')) {
				var codetable = this.getCodeTable();
				if (this.hasParent() && this.isOnLoadingWhenHasParent()) {
					this.setState({
						onloading: true,
						alreadySendRequest: true
					}, function () {
						codetable.loadRemoteCodeSegment(this.getParentPropertyValue()).done(function () {
							this.showPopover();
						}.bind(this)).always(function () {
							this.setState({
								onloading: false,
								alreadySendRequest: false
							});
						}.bind(this));
					}.bind(this));
				} else if (this.isOnLoadingWhenNoParent()) {
					this.setState({
						onloading: true,
						alreadySendRequest: true
					}, function () {
						codetable.initializeRemote().done(function () {
							this.showPopover();
						}.bind(this)).always(function () {
							this.setState({
								onloading: false,
								alreadySendRequest: false
							});
						}.bind(this));
					}.bind(this));
				} else {
					this.showPopover();
				}
			}
		},
		onComponentKeyUp: function (evt) {
			if (evt.keyCode === 40) {
				// down arrow
				this.onComponentDownArrowKeyUp(evt);
			} else if (evt.keyCode === 38) {
				// up arrow
				this.onComponentUpArrowKeyUp(evt);
			} else if (evt.keyCode === 13) {
				// enter
				this.onComponentEnterKeyUp(evt);
			}
		},
		onComponentEnterKeyUp: function (evt) {
			evt.preventDefault();
			evt.stopPropagation();

			if (!this.isEnabled() || this.isViewMode()) {
				// do nothing
				return;
			}
			if (!this.state.popoverDiv || !this.state.popoverDiv.is(':visible')) {
				return;
			}
			var option = this.state.popoverDiv.find('ul.options > li.active');
			if (option.length > 0) {
				this.setValueToModel(option.attr('data-id'));
				this.hidePopover();
				$(this.refs.comp).focus();
			}
		},
		onComponentDownArrowKeyUp: function (evt) {
			evt.preventDefault();
			evt.stopPropagation();

			if (!this.isEnabled() || this.isViewMode()) {
				// do nothing
				return;
			}
			if (!this.state.popoverDiv || !this.state.popoverDiv.is(':visible')) {
				this.onComponentClicked();
			} else {
				var options = this.state.popoverDiv.find('ul.options > li');
				var keystepOption = options.filter('.active');
				if (keystepOption.length == 0) {
					var first = options.first();
					first.addClass('active');
					this.scrollIntoView(first);
				} else {
					var last = options.last();
					if (!keystepOption.first().is(last)) {
						keystepOption.removeClass('active');
						var next = keystepOption.next();
						next.addClass('active');
						this.scrollIntoView(next);
					}
				}
			}
		},
		onComponentUpArrowKeyUp: function (evt) {
			evt.preventDefault();
			evt.stopPropagation();

			if (!this.isEnabled() || this.isViewMode()) {
				// do nothing
				return;
			}
			if (!this.state.popoverDiv || !this.state.popoverDiv.is(':visible')) {
				this.onComponentClicked();
			} else {
				var options = this.state.popoverDiv.find('ul.options > li');
				var keystepOption = options.filter('.active');
				if (keystepOption.length == 0) {
					var last = options.last();
					last.addClass('active');
					this.scrollIntoView(last);
				} else {
					var first = options.first();
					if (!keystepOption.first().is(first)) {
						keystepOption.removeClass('active');
						var previous = keystepOption.prev();
						previous.addClass('active');
						this.scrollIntoView(previous);
					}
				}
			}
		},
		scrollIntoView: function (option) {
			// for forbid the mouse event
			this.state.onKeyEventProcessed = true;

			var optionOffset = option.offset();
			var optionTop = optionOffset.top;
			var optionHeight = option.outerHeight();
			var optionBottom = optionTop + optionHeight;

			var parent = option.parent();
			var parentOffset = parent.offset();
			var parentTop = parentOffset.top;
			var parentBottom = parentTop + parent.height();
			var allOptions = parent.children();

			var win = $(window);
			var windowTop = win.scrollTop();
			var windowBottom = windowTop + win.height();

			if (optionTop < parentTop || optionBottom > parentBottom) {
				// can not see option in its parent, scroll the parent
				var optionIndex = allOptions.index(option);
				var height = allOptions.toArray().reduce(function (prev, current, index) {
					if (index < optionIndex) {
						prev += $(current).outerHeight();
					}
					return prev;
				}, 0);
				parent.scrollTop(height);
			}
			// get option offset again, since it might be changed
			// but it is seen in its parent
			optionOffset = option.offset();
			optionTop = optionOffset.top;
			optionBottom = optionTop + optionHeight;
			if (optionBottom > windowBottom) {
				win.scrollTop(windowTop + optionBottom - windowBottom);
			}
			// get window scroll top again
			windowTop = win.scrollTop();
			if (optionTop < windowTop) {
				// can not see option in window, even it is seen in its parent
				// option is above the window top,
				// which means parent top is less than window top, since option already been seen in parent
				win.scrollTop(windowTop - (windowTop - optionTop));
			}
		},
		defaultOptionClick: function (item) {
			this.setValueToModel(item.id);
			this.hidePopover();
			$(this.refs.comp).focus();
		},
		onOptionClick: function (item, evt) {
			evt.stopPropagation();
			evt.preventDefault();
			var customOptionClick = this.getComponentOption('optionClick');
			if (customOptionClick) {
				var ret = customOptionClick.call(this, item);
				if (ret && ret.done) {
					// have return value, must be a jquery deferred
					ret.done(function () {
						this.defaultOptionClick(item);
					}.bind(this));
				} else {
					this.defaultOptionClick(item);
				}
			} else {
				this.defaultOptionClick(item);
			}
		},
		onOptionMouseEnter: function (evt) {},
		onOptionMouseLeave: function (evt) {
			// if (this.state.onKeyEventProcessed === true) {
			// }
		},
		onOptionMouseMove: function (evt) {
			// when handled the arrow up/down event, highlight the option
			// in chrome, the mouse event will be triggered after call #scrollIntoView
			// so use state onKeyEventProcessed to flag this operation
			// if the flag is true, ignore the mouse event,
			// and reset the flag, let the following mouse event processed
			// cannot use mouse enter event, since there is no second enter event triggered
			// must use mouse move event to handle, seems no performance issue here.
			if (this.state.onKeyEventProcessed === true) {
				// console.log('onOptionMouseEnter #1', this.state.onKeyEventProcessed);
				delete this.state.onKeyEventProcessed;
			} else {
				// console.log('onOptionMouseEnter #2', this.state.onKeyEventProcessed);
				$(evt.target).addClass('active').siblings().removeClass('active');
			}
		},
		onClearClick: function () {
			if (!this.isEnabled() || this.isViewMode()) {
				return;
			}
			this.setValueToModel(null);
			// clear highlight
			//if (this.state.popoverDiv) {
			//this.state.popoverDiv.find('ul.options > li').filter('.chosen').removeClass('chosen');
			//}
			// for mobile
			this.hidePopover();
		},
		onFilterTextChange: function (evt) {
			if (this.state.popoverDiv.is(':visible')) {
				var filterText = this.state.popoverDiv.find('div.n-text input[type=text]');
				this.state.filteTextCaret = filterText.caret();
			} else {
				this.state.filteTextCaret = null;
			}
			// console.log('caret', this.state.filteTextCaret);
			if (this.isMobilePhone()) {
				var optionContainer = this.state.popoverDiv.find('ul.options');
				if (this.getOptionContainerOffsetY(optionContainer) !== 0) {
					optionContainer.css({
						'transform': '',
						'transition-timing-function': '',
						'transition-duration': ''
					});
				}
			}
			this.showPopover(evt.new);
		},
		getOptionTouchEventContainer: function (evt) {
			var target = $(evt.target);
			if (target[0].tagName != 'UL') {
				target = target.closest('ul');
			}
			return target;
		},
		getOptionContainerOffsetY: function (container) {
			var transform = container.css('transform').split(',');
			if (transform.length > 5) {
				return parseFloat(transform[5]);
			} else {
				return 0;
			}
		},
		calcOptionContainerOffsetY: function (target, offsetY) {
			if (offsetY >= 0) {
				offsetY = 0;
			} else {
				var optionsHeight = target.height();
				var totalHeight = target.parent().height();
				if (optionsHeight <= totalHeight) {
					return 0;
				}
				if (offsetY < totalHeight - optionsHeight) {
					offsetY = totalHeight - optionsHeight;
				}
			}
			return offsetY;
		},
		onOptionTouchStart: function (evt) {
			this.state.touchStartClientY = evt.touches[0].clientY;
			var target = this.getOptionTouchEventContainer(evt);
			this.state.touchStartRelatedY = this.getOptionContainerOffsetY(target);
			this.state.touchStartTime = moment();
		},
		onOptionTouchMove: function (evt) {
			var touches = evt.touches;
			var length = touches.length;
			if (length > 0) {
				var target = this.getOptionTouchEventContainer(evt);
				// calculate the distance of touch moving
				// make sure the first and last option are in viewport
				var distance = touches[length - 1].clientY - this.state.touchStartClientY;
				var offsetY = this.calcOptionContainerOffsetY(target, this.state.touchStartRelatedY + distance);
				target.css('transform', 'translateY(' + offsetY + 'px)');
				this.state.touchLastClientY = touches[length - 1].clientY;
			}
		},
		onOptionTouchEnd: function (evt) {
			// continue scrolling
			// calculate the speed
			var timeUsed = moment().diff(this.state.touchStartTime, 'ms');
			// alert(timeUsed);
			if (timeUsed <= 300 && this.state.touchLastClientY != null) {
				var distance = this.state.touchLastClientY - this.state.touchStartClientY;
				var speed = distance / timeUsed * 10; // pixels per 10 ms
				var target = this.getOptionTouchEventContainer(evt);
				var startOffsetY = this.getOptionContainerOffsetY(target);
				var targetOffsetY = this.calcOptionContainerOffsetY(target, startOffsetY + speed * 100 / 2);
				target.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
					target.css({
						'transition-timing-function': '',
						'transition-duration': ''
					});
				});
				target.css({
					'transition-timing-function': 'cubic-bezier(0.1, 0.57, 0.1, 1)',
					'transition-duration': '500ms',
					'transform': 'translateY(' + targetOffsetY + 'px)'
				});
			}

			delete this.state.touchStartClientY;
			delete this.state.touchStartRelatedY;
			delete this.state.touchStartTime;
			delete this.state.touchLastClientY;
		},
		/**
   * on parent model change
   * @param evt
   */
		onParentModelChanged: function (evt) {
			this.setValueToModel(null);
		},
		/**
   * get parent model
   * @returns {*}
   */
		getParentModel: function () {
			var parentModel = this.getComponentOption("parentModel");
			return parentModel == null ? this.getModel() : parentModel;
		},
		/**
   * get parent property value
   * @returns {*}
   */
		getParentPropertyValue: function () {
			return this.getParentModel().get(this.getParentPropertyId());
		},
		/**
   * get parent property id
   * @returns {string}
   */
		getParentPropertyId: function () {
			return this.getComponentOption("parentPropId");
		},
		/**
   * has parent or not
   * @returns {boolean}
   */
		hasParent: function () {
			return this.getParentPropertyId() != null;
		},
		hasFilterText: function () {
			var minimumResultsForSearch = this.getComponentOption('minimumResultsForSearch');
			return minimumResultsForSearch >= 0 && minimumResultsForSearch != Infinity;
		},
		/**
   * convert data options, options can be CodeTable object or an array
   * @param options
   * @returns {*}
   */
		convertDataOptions: function (options) {
			return Array.isArray(options) ? options : options.list();
		},
		getPlaceholder: function () {
			return this.getComponentOption('placeholder', NSelect.PLACEHOLDER);
		},
		isClearAllowed: function () {
			return this.getComponentOption('allowClear') && !this.isMobilePhone();
		},
		getCodeTable: function () {
			return this.getComponentOption('data');
		},
		/**
   * get available options.
   * if no parent assigned, return all data options
   * @returns {[*]}
   */
		getAvailableOptions: function () {
			if (!this.hasParent()) {
				return this.convertDataOptions(this.getCodeTable());
			} else {
				var parentValue = this.getParentPropertyValue();
				if (parentValue == null) {
					return this.isAvailableWhenNoParentValue() ? this.convertDataOptions(this.getCodeTable()) : [];
				} else {
					var filter = this.getComponentOption("parentFilter");
					if (typeof filter === 'object') {
						// call code table filter
						return this.convertDataOptions(this.getCodeTable().filter($.extend({}, filter, { value: parentValue })));
					} else {
						// call local filter
						var data = this.convertDataOptions(this.getCodeTable());
						if (typeof filter === "function") {
							return filter.call(this, parentValue, data);
						} else {
							return data.filter(function (item) {
								return item[filter] == parentValue;
							});
						}
					}
				}
			}
		},
		/**
   * is available when no parent value.
   * if no parent assigned, always return true.
   * @returns {boolean}
   */
		isAvailableWhenNoParentValue: function () {
			// when has parent, return availableWhenNoParentValue
			// or return true
			return this.hasParent() ? this.getComponentOption("availableWhenNoParentValue") : true;
		},
		getComponent: function () {
			return $(ReactDOM.findDOMNode(this.refs.comp));
		}
	}));
	$pt.Components.NSelect = NSelect;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.Select, function (model, layout, direction, viewMode) {
		return React.createElement($pt.Components.NSelect, $pt.LayoutHelper.transformParameters(model, layout, direction, viewMode));
	});
})(window, jQuery, React, ReactDOM, $pt);

/**
 * popover will be closed on
 * 		2.1 mouse down on others in document
 * 		2.2 press escape or tab
 * 		2.3 mouse wheel
 *		2.4 window resize
 */
(function (window, $, React, ReactDOM, $pt) {
	var NSelectTree = React.createClass($pt.defineCellComponent({
		displayName: 'NSelectTree',
		mixins: [$pt.mixins.PopoverMixin],
		statics: {
			POP_FIX_ON_BOTTOM: false,
			PLACEHOLDER: "Please Select...",
			CLOSE_TEXT: 'Close'
		},
		getDefaultProps: function () {
			return {
				defaultOptions: {
					hideChildWhenParentChecked: false
				},
				treeLayout: {
					comp: {
						root: false,
						check: true,
						multiple: true,
						hierarchyCheck: false
					}
				}
			};
		},
		afterWillUpdate: function (nextProps) {
			if (this.hasParent()) {
				// add post change listener into parent model
				this.getParentModel().removePostChangeListener(this.getParentPropertyId(), this.onParentModelChanged);
			}
		},
		afterDidUpdate: function (prevProps, prevState) {
			if (this.hasParent()) {
				// add post change listener into parent model
				this.getParentModel().addPostChangeListener(this.getParentPropertyId(), this.onParentModelChanged);
			}
			if (this.state.popoverDiv && this.state.popoverDiv.is(':visible')) {
				this.showPopover();
			}
		},
		afterDidMount: function () {
			if (this.hasParent()) {
				// add post change listener into parent model
				this.getParentModel().addPostChangeListener(this.getParentPropertyId(), this.onParentModelChanged);
			}
			if (this.state.onloading) {
				this.getCodeTable().initializeRemote().done(function () {
					this.setState({ onloading: false });
				}.bind(this));
			}
			this.state.mounted = true;
		},
		beforeWillUnmount: function () {
			this.destroyPopover();
		},
		afterWillUnmount: function () {
			if (this.hasParent()) {
				// add post change listener into parent model
				this.getParentModel().removePostChangeListener(this.getParentPropertyId(), this.onParentModelChanged);
			}
		},
		renderTree: function () {
			var layout = $pt.createCellLayout('values', this.getTreeLayout());
			var model = $pt.createModel({ values: this.getValueFromModel() });
			model.addPostChangeListener('values', this.onTreeValueChanged);
			return React.createElement($pt.Components.NTree, { model: model, layout: layout, key: 'tree' });
		},
		renderSelectionItem: function (codeItem, nodeId) {
			if (this.isMobilePhone()) {
				return React.createElement(
					'li',
					{ key: nodeId },
					codeItem.text
				);
			} else {
				return React.createElement(
					'li',
					{ key: nodeId },
					React.createElement('span', { className: 'fa fa-fw fa-remove', onClick: this.onSelectionItemRemove.bind(this, nodeId) }),
					codeItem.text
				);
			}
		},
		renderSelectionWhenValueAsArray: function (values) {
			var _this = this;
			var codes = null;
			if (this.isHideChildWhenParentChecked()) {
				// only render parent selections
				codes = this.getAvailableTreeModel().list();
				var isChecked = function (code) {
					return -1 != values.findIndex(function (value) {
						return value == code.id;
					});
				};
				var traverse = function (codes) {
					return codes.map(function (code) {
						if (isChecked(code)) {
							return _this.renderSelectionItem(code, code.id);
						} else if (code.children) {
							return traverse(code.children);
						}
					});
				};
				return traverse(codes);
			} else {
				// render all selections
				codes = this.getAvailableTreeModel().listAllChildren();
				return Object.keys(codes).map(function (id) {
					var value = values.find(function (value) {
						return value == id;
					});
					if (value != null) {
						return _this.renderSelectionItem(codes[value], value);
					}
				});
			}
		},
		renderSelectionWhenValueAsJSON: function (values) {
			var _this = this;
			var codes = this.getAvailableTreeModel().listWithHierarchyKeys({ separator: NTree.NODE_SEPARATOR, rootId: NTree.ROOT_ID });
			if (this.isHideChildWhenParentChecked()) {
				var paintedNodes = [];
				var isPainted = function (nodeId) {
					// if nodeId starts with paintedNodeId, do not paint again
					return -1 != paintedNodes.findIndex(function (paintedNodeId) {
						return nodeId.startsWith(paintedNodeId);
					});
				};
				return Object.keys(codes).map(function (nodeId) {
					if (!isPainted(nodeId)) {
						var valueId = nodeId.split(NTree.NODE_SEPARATOR).slice(1).join($pt.PROPERTY_SEPARATOR) + $pt.PROPERTY_SEPARATOR + 'selected';
						var checked = $pt.getValueFromJSON(values, valueId);
						if (checked) {
							paintedNodes.push(nodeId + NTree.NODE_SEPARATOR);
							return _this.renderSelectionItem(codes[nodeId], nodeId);
						}
					}
				});
			} else {
				var render = function (node, currentId, parentId) {
					var nodeId = parentId + NTree.NODE_SEPARATOR + currentId;
					var spans = [];
					if (node.selected) {
						spans.push(_this.renderSelectionItem(codes[nodeId], nodeId));
					}
					spans.push.apply(spans, Object.keys(node).filter(function (key) {
						return key != 'selected';
					}).map(function (key) {
						return render(node[key], key, nodeId);
					}));
					return spans;
				};
				return Object.keys(values).filter(function (key) {
					return key != 'selected';
				}).map(function (key) {
					return render(values[key], key, NTree.ROOT_ID);
				});
			}
		},
		renderSelection: function () {
			var values = this.getValueFromModel();
			if (values == null) {
				// no selection
				return null;
			} else if (this.getTreeLayout().comp.valueAsArray) {
				// value as an array
				return this.renderSelectionWhenValueAsArray(values);
			} else {
				// value as a hierarchy json object
				return this.renderSelectionWhenValueAsJSON(values);
			}
		},
		renderText: function () {
			var renderContent = function () {
				if (this.isOnLoading() && !this.state.mounted) {
					this.state.onloading = true;
					return React.createElement(
						'span',
						{ className: 'text' },
						$pt.Components.NCodeTableWrapper.ON_LOADING
					);
				} else {
					this.state.onloading = false;
					var value = this.getValueFromModel();
					if (value == null || Array.isArray(value) && value.length == 0 || typeof value === 'object' && Object.keys(value).length == 0) {
						if (this.isViewMode()) {
							return React.createElement('span', { className: 'text' });
						} else {
							return React.createElement(
								'span',
								{ className: 'text' },
								this.getComponentOption('placeholder', NSelectTree.PLACEHOLDER)
							);
						}
					} else {
						return React.createElement(
							'ul',
							{ className: 'selection' },
							this.renderSelection()
						);
					}
				}
			}.bind(this);
			return React.createElement(
				'div',
				{ className: 'input-group form-control', onClick: this.onComponentClicked, ref: 'comp' },
				renderContent(),
				React.createElement('span', { className: 'fa fa-fw fa-sort-down pull-right' })
			);
		},
		render: function () {
			var css = {
				'n-disabled': !this.isEnabled(),
				'n-view-mode': this.isViewMode()
			};
			css[this.getComponentCSS('n-select-tree')] = true;
			return React.createElement(
				'div',
				{ className: $pt.LayoutHelper.classSet(css),
					'aria-readonly': 'true',
					readOnly: 'true',
					tabIndex: this.isEnabled() ? '0' : null },
				this.renderText(),
				this.renderNormalLine(),
				this.renderFocusLine()
			);
		},
		renderPopoverOperations: function () {
			if (!this.isMobilePhone()) {
				return null;
			}
			return React.createElement(
				'div',
				{ className: 'operations', key: 'operations' },
				React.createElement(
					'div',
					null,
					React.createElement(
						'a',
						{ href: 'javascript:void(0);', onClick: this.hidePopover },
						React.createElement(
							'span',
							null,
							NSelectTree.CLOSE_TEXT
						)
					)
				)
			);
		},
		getPopoverContainerCSS: function () {
			return 'n-select-tree-popover';
		},
		renderPopoverContent: function () {
			return [this.renderTree(), this.renderPopoverOperations()];
		},
		afterPopoverRenderComplete: function () {
			if (this.isMobilePhone()) {
				var tree = this.state.popoverDiv.find('div.n-tree > ul');
				tree.on('touchstart', this.onTreeTouchStart).on('touchmove', this.onTreeTouchMove).on('touchend', this.onTreeTouchEnd);
			}
		},
		afterDestoryPopover: function () {
			if (this.state.popoverDiv) {
				if (this.isMobilePhone()) {
					var tree = this.state.popoverDiv.find('div.n-tree > ul');
					tree.off('touchstart', this.onTreeTouchStart).off('touchmove', this.onTreeTouchMove).off('touchend', this.onTreeTouchEnd);
				}
			}
		},
		isOnLoading: function () {
			// var value = this.getValueFromModel();
			var codetable = this.getCodeTable();
			// remote and not initialized
			// is on loading
			return codetable.isRemoteButNotInitialized();
		},
		onComponentClicked: function () {
			if (!this.isEnabled() || this.isViewMode()) {
				// do nothing
				return;
			}

			if (this.isOnLoading()) {
				this.getCodeTable().initializeRemote().done(function () {
					this.setState({ onloading: false });
					this.showPopover();
				}.bind(this));
			} else {
				this.showPopover();
			}
		},
		/**
   * on parent model changed
   */
		onParentModelChanged: function () {
			var parentChanged = this.getComponentOption('parentChanged');
			if (parentChanged) {
				this.setValueToModel(parentChanged.call(this, this.getModel(), this.getParentPropertyValue()));
			} else {
				// clear values
				this.setValueToModel(null);
			}
			this.forceUpdate();
		},
		/**
   * on tree value changed
   */
		onTreeValueChanged: function (evt) {
			var values = evt.new;
			if (values == null) {
				this.setValueToModel(values);
			} else if (Array.isArray(values)) {
				this.setValueToModel(values.slice(0));
			} else {
				this.setValueToModel($.extend(true, {}, values));
			}
		},
		onSelectionItemRemove: function (nodeId) {
			if (!this.isEnabled()) {
				// do nothing
				return;
			}
			var values = this.getValueFromModel();
			var hierarchyCheck = this.getTreeLayout().comp.hierarchyCheck;
			if (values == null) {
				// do nothing
			} else if (this.getTreeLayout().comp.valueAsArray) {
				if (hierarchyCheck) {
					var codes = this.getAvailableTreeModel().listWithHierarchyKeys({ separator: NTree.NODE_SEPARATOR, rootId: NTree.ROOT_ID });
					var codeHierarchyIds = Object.keys(codes);
					// find all children
					var childrenIds = codeHierarchyIds.filter(function (key) {
						return key.indexOf(nodeId + NTree.NODE_SEPARATOR) != -1;
					}).map(function (id) {
						return id.split(NTree.NODE_SEPARATOR).pop();
					});
					var hierarchyId = codeHierarchyIds.find(function (id) {
						return id.endsWith(NTree.NODE_SEPARATOR + nodeId);
					});
					// find itself and its ancestor ids
					var ancestorIds = codeHierarchyIds.filter(function (id) {
						return hierarchyId.startsWith(id);
					}).map(function (id) {
						return id.split(NTree.NODE_SEPARATOR).pop();
					});
					// combine
					var ids = childrenIds.concat(ancestorIds);
					// filter found ids
					this.setValueToModel(values.filter(function (id) {
						return -1 == ids.findIndex(function (idNeedRemove) {
							return id == idNeedRemove;
						});
					}));
				} else {
					// remove itself
					this.setValueToModel(values.filter(function (id) {
						return id != nodeId;
					}));
				}
			} else {
				var effectiveNodes = nodeId.split(NTree.NODE_SEPARATOR).slice(1);
				var node = $pt.getValueFromJSON(values, effectiveNodes.join($pt.PROPERTY_SEPARATOR));
				if (hierarchyCheck) {
					// set itself and its children to unselected
					Object.keys(node).forEach(function (key) {
						delete node[key];
					});
					// set its ancestors to unselected
					effectiveNodes.splice(effectiveNodes.length - 1, 1);
					effectiveNodes.forEach(function (id, index, array) {
						$pt.setValueIntoJSON(values, array.slice(0, index + 1).join($pt.PROPERTY_SEPARATOR) + $pt.PROPERTY_SEPARATOR + 'selected', false);
					});
				} else {
					// set itself to unselected
					delete node.selected;
				}
				this.getModel().firePostChangeEvent(this.getDataId(), values, values);
			}
		},
		isNodeCheckClicked: function (evt) {
			return $(evt.target).closest('.n-checkbox').length != 0;
		},
		getNodeTouchEventContainer: function (evt) {
			return $(evt.target).closest('.n-tree').children('ul').first();
		},
		getNodeContainerOffsetY: function (container) {
			var transform = container.css('transform').split(',');
			if (transform.length > 5) {
				return parseFloat(transform[5]);
			} else {
				return 0;
			}
		},
		calcNodeContainerOffsetY: function (target, offsetY) {
			if (offsetY >= 0) {
				offsetY = 0;
			} else {
				var treeHeight = target.height();
				var totalHeight = target.parent().height();
				if (treeHeight <= totalHeight) {
					return 0;
				}
				if (offsetY < totalHeight - treeHeight) {
					offsetY = totalHeight - treeHeight;
				}
			}
			return offsetY;
		},
		unwrapTouchEvent: function (evt) {
			return evt.touches ? evt : evt.originalEvent;
		},
		onTreeTouchStart: function (evt) {
			if (this.isNodeCheckClicked(evt)) {
				return;
			}
			this.state.touchStartClientY = this.unwrapTouchEvent(evt).touches[0].clientY;
			var target = this.getNodeTouchEventContainer(evt);
			this.state.touchStartRelatedY = this.getNodeContainerOffsetY(target);
			this.state.touchStartTime = moment();
		},
		onTreeTouchMove: function (evt) {
			if (this.isNodeCheckClicked(evt)) {
				return;
			}
			var touches = this.unwrapTouchEvent(evt).touches;
			var length = touches.length;
			if (length > 0) {
				var target = this.getNodeTouchEventContainer(evt);
				// calculate the distance of touch moving
				// make sure the first and last option are in viewport
				var distance = touches[length - 1].clientY - this.state.touchStartClientY;
				var offsetY = this.calcNodeContainerOffsetY(target, this.state.touchStartRelatedY + distance);
				target.css('transform', 'translateY(' + offsetY + 'px)');
				this.state.touchLastClientY = touches[length - 1].clientY;
			}
		},
		onTreeTouchEnd: function (evt) {
			if (this.isNodeCheckClicked(evt)) {
				return;
			}
			// continue scrolling
			// calculate the speed
			var timeUsed = moment().diff(this.state.touchStartTime, 'ms');
			// alert(timeUsed);
			if (timeUsed <= 300 && this.state.touchLastClientY != null) {
				var distance = this.state.touchLastClientY - this.state.touchStartClientY;
				var speed = distance / timeUsed * 10; // pixels per 10 ms
				var target = this.getNodeTouchEventContainer(evt);
				var startOffsetY = this.getNodeContainerOffsetY(target);
				var targetOffsetY = this.calcNodeContainerOffsetY(target, startOffsetY + speed * 100 / 2);
				target.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function () {
					target.css({
						'transition-timing-function': '',
						'transition-duration': ''
					});
				});
				target.css({
					'transition-timing-function': 'cubic-bezier(0.1, 0.57, 0.1, 1)',
					'transition-duration': '500ms',
					'transform': 'translateY(' + targetOffsetY + 'px)'
				});
			}

			delete this.state.touchStartClientY;
			delete this.state.touchStartRelatedY;
			delete this.state.touchStartTime;
			delete this.state.touchLastClientY;
		},
		getComponent: function () {
			return $(ReactDOM.findDOMNode(this.refs.comp));
		},
		/**
   * get tree model
   * @returns {CodeTable}
   */
		getCodeTable: function () {
			return this.getComponentOption('data');
		},
		/**
   * get available tree model
   * @returns {CodeTable}
   */
		getAvailableTreeModel: function () {
			var filter = this.getComponentOption('parentFilter');
			var tree = this.getCodeTable();
			// fetch data from remote is not supported now
			if (filter) {
				return filter.call(this, tree, this.getParentPropertyValue());
			} else {
				return tree;
			}
		},
		getTreeLayout: function () {
			var treeLayout = this.getComponentOption('treeLayout');
			if (treeLayout) {
				treeLayout = $.extend(true, {}, this.props.treeLayout, treeLayout);
			} else {
				treeLayout = $.extend(true, {}, this.props.treeLayout);
			}
			treeLayout.comp.data = this.getAvailableTreeModel();
			treeLayout.comp.valueAsArray = treeLayout.comp.valueAsArray ? treeLayout.comp.valueAsArray : false;
			treeLayout.evt = treeLayout.evt ? treeLayout.evt : {};
			treeLayout.evt.expand = treeLayout.evt.expand ? function (evt) {
				treeLayout.evt.expand.call(this, evt);
				this.onPopoverRenderComplete.call(this);
			} : this.onPopoverRenderComplete;
			treeLayout.evt.collapse = treeLayout.evt.collapse ? function (evt) {
				treeLayout.evt.collapse.call(this, evt);
				this.onPopoverRenderComplete.call(this);
			} : this.onPopoverRenderComplete;
			return treeLayout;
		},
		isHideChildWhenParentChecked: function () {
			var hierarchyCheck = this.getTreeLayout().comp.hierarchyCheck;
			if (hierarchyCheck) {
				return this.getComponentOption('hideChildWhenParentChecked');
			} else {
				return false;
			}
		},
		/**
   * has parent or not
   * @returns {boolean}
   */
		hasParent: function () {
			return this.getParentPropertyId() != null;
		},
		/**
   * get parent property id
   * @returns {string}
   */
		getParentPropertyId: function () {
			return this.getComponentOption("parentPropId");
		},
		/**
   * get parent model
   * @returns {ModelInterface}
   */
		getParentModel: function () {
			var parentModel = this.getComponentOption("parentModel");
			return parentModel == null ? this.getModel() : parentModel;
		},
		/**
   * get parent property value
   * @returns {*}
   */
		getParentPropertyValue: function () {
			return this.getParentModel().get(this.getParentPropertyId());
		}
	}));
	$pt.Components.NSelectTree = NSelectTree;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.SelectTree, function (model, layout, direction, viewMode) {
		return React.createElement($pt.Components.NSelectTree, $pt.LayoutHelper.transformParameters(model, layout, direction, viewMode));
	});
})(window, jQuery, React, ReactDOM, $pt);

(function (window, $, React, ReactDOM, $pt) {
	var NSideMenu = React.createClass({
		displayName: 'NSideMenu',
		statics: {
			/**
    * get side menu
    * @param menus
    * @param containerId optional, default is 'side_menu_container'
    * @param className
    * @param hover
    * @returns {react element}
    */
			getSideMenu: function (menus, containerId, className, hover) {
				if (!containerId) {
					containerId = "side_menu_container";
				}
				if ($pt.sideMenu == null) {
					$pt.sideMenu = {};
				}
				if ($pt.sideMenu[containerId] == null) {
					// must initial here. since the function will execute immediately after load,
					// and NExceptionModal doesn't defined in that time
					var sideMenuContainer = $("#" + containerId);
					if (sideMenuContainer.length == 0) {
						$("<div id='" + containerId + "' />").appendTo($(document.body));
					}
					$pt.sideMenu[containerId] = ReactDOM.render(React.createElement($pt.Components.NSideMenu, { menus: menus,
						className: className,
						hover: hover ? true : false }), document.getElementById(containerId));
				}
				return $pt.sideMenu[containerId];
			}
		},
		getDefaultProps: function () {
			return {
				hover: false
			};
		},
		getInitialState: function () {
			return {};
		},
		componentDidMount: function () {
			$(ReactDOM.findDOMNode(this.refs.menus)).hide();
		},
		renderMenuItem: function (item, index, menus, onTopLevel) {
			if (item.children !== undefined) {
				// render dropdown menu
				var _this = this;
				var id = 'item_' + index;
				return React.createElement(
					"li",
					{ ref: id, key: index },
					React.createElement(
						"a",
						{ href: "javascript:void(0);",
							onClick: this.onParentMenuClicked.bind(this, id), ref: id + '_link' },
						item.text,
						React.createElement("span", { className: "fa fa-fw fa-angle-double-down n-side-menu-ul", ref: id + '_icon' })
					),
					React.createElement(
						"ul",
						{ ref: id + '_child', style: { display: 'none' } },
						item.children.map(function (childItem, childIndex, dropdownItems) {
							return _this.renderMenuItem(childItem, index + '_' + childIndex, dropdownItems, false);
						})
					)
				);
			} else if (item.func !== undefined) {
				// call javascript function
				return React.createElement(
					"li",
					{ key: index },
					React.createElement(
						"a",
						{ href: "javascript:void(0);",
							onClick: this.onMenuClicked.bind(this, item.func, item.value) },
						item.text
					)
				);
			} else if (item.divider === true) {
				return null;
			} else {
				// jump to url
				return React.createElement(
					"li",
					{ key: index },
					React.createElement(
						"a",
						{ href: item.url },
						item.text
					)
				);
			}
		},
		render: function () {
			var _this = this;
			return React.createElement(
				"div",
				{ className: "n-side-menu", ref: "menus",
					onMouseEnter: this.onMouseEnter, onMouseLeave: this.onMouseLeave },
				React.createElement(
					"ul",
					{ className: "nav navbar-nav" },
					this.props.menus.map(function (item, index, menu) {
						return _this.renderMenuItem(item, index, menu, true);
					}),
					React.createElement(
						"li",
						{ className: "n-side-menu-close" },
						React.createElement(
							"a",
							{ href: "javascript:void(0);", onClick: this.onCloseClicked },
							React.createElement("span", { className: "fa fa-fw fa-arrow-circle-left" })
						)
					)
				)
			);
		},
		onMouseEnter: function () {
			if (this.props.hover) {
				this.show();
			}
		},
		onMouseLeave: function () {
			if (this.props.hover) {
				this.willHide();
			}
		},
		/**
   * on menu clicked
   * @param func
   * @param value
   */
		onMenuClicked: function (func, value) {
			func.call(this, value);
		},
		onParentMenuClicked: function (id) {
			$(ReactDOM.findDOMNode(this.refs[id + '_link'])).blur();
			var ul = $(ReactDOM.findDOMNode(this.refs[id + '_child']));
			ul.toggle('fade', function () {
				// if close, then close all sub menus
				if (ul.not(':visible')) {
					ul.find('ul').hide();
				}
			});
			$(ReactDOM.findDOMNode(this.refs[id + '_icon'])).toggleClass('fa-angle-double-down fa-angle-double-up');

			this.collapseMenus(id);
		},
		/**
   * collapse menus
   * @param id {string} menu id which keep expanding
   */
		collapseMenus: function (id) {
			var _this = this;
			Object.keys(this.refs).forEach(function (key) {
				if (key.endsWith('_link')) {
					var linkId = key.substr(0, key.length - 5);
					if (!id || !id.startsWith(linkId)) {
						var ul = $(ReactDOM.findDOMNode(_this.refs[linkId + '_child']));
						ul.hide('fade', function () {
							ul.find('ul').hide();
						});
					}
				}
			});
			$(ReactDOM.findDOMNode(this.refs[id + '_icon'])).toggleClass('fa-angle-double-down fa-angle-double-up');
		},
		/**
   * on close button clicked
   */
		onCloseClicked: function () {
			this.hide();
		},
		/**
   * show side menu
   */
		show: function () {
			if (this.state.willHide) {
				clearTimeout(this.state.willHide);
				this.state.willHide = null;
			}
			$(ReactDOM.findDOMNode(this.refs.menus)).show('fade');
		},
		/**
   * hide side menu
   */
		hide: function () {
			var _this = this;
			$(ReactDOM.findDOMNode(this.refs.menus)).hide('fade', function () {
				_this.collapseMenus();
			});
		},
		willHide: function () {
			var _this = this;
			this.state.willHide = setTimeout(function () {
				_this.hide();
			}, 300);
		}
	});
	$pt.Components.NSideMenu = NSideMenu;
})(window, jQuery, React, ReactDOM, $pt);

(function (window, $, React, ReactDOM, $pt) {
	var NTab = React.createClass({
		displayName: 'NTab',
		getDefaultProps: function () {
			return {
				type: 'tab',
				justified: false,
				removable: false
			};
		},
		getInitialState: function () {
			return {};
		},
		componentDidUpdate: function () {
			this.renderRelatedDOM();
		},
		componentDidMount: function () {
			this.renderRelatedDOM();
		},
		renderRelatedDOM: function () {
			var activeTabIndex = this.getActiveTabIndex();
			this.props.tabs.forEach(function (tab, index) {
				if (activeTabIndex == index) {
					$('#' + tab.innerId).show();
				} else {
					$('#' + tab.innerId).hide();
				}
			});
		},
		/**
   * render icon
   * @param icon {string|XML}
   * @param size {string}
   * @returns {XML}
   */
		renderIcon: function (icon, size) {
			if (typeof icon === 'string') {
				var css = {
					'fa': true,
					'fa-fw': true
				};
				css['fa-' + icon] = true;
				if (size) {
					css['fa-' + size] = true;
				}
				return React.createElement('span', { className: $pt.LayoutHelper.classSet(css) });
			} else {
				return icon;
			}
		},
		/**
   * render label
   * @param label {string}
   * @returns {XML}
   */
		renderLabel: function (label) {
			if (label) {
				return React.createElement(
					'span',
					null,
					' ' + label
				);
			} else {
				return null;
			}
		},
		renderBadge: function (badge) {
			if (badge) {
				return React.createElement(
					'span',
					{ className: 'badge' },
					badge
				);
			} else {
				return null;
			}
		},
		/**
   * render tab
   * @param tab {{active:boolean, label:string, icon:string, badge:string, removable: boolean, visible:boolean}}
   * @param index
   * @returns {XML}
   */
		renderTab: function (tab, index) {
			var css = {
				active: index == this.getActiveTabIndex(),
				hide: tab.visible === false
			};
			if (tab.css) {
				css[tab.css] = true;
			}
			var removeButton = React.createElement(
				'a',
				{ href: 'javascript:void(0);', className: 'n-tab-delete',
					onClick: this.onRemoveClicked },
				React.createElement('span', { className: 'fa fa-fw fa-times' })
			);
			return React.createElement(
				'li',
				{ role: 'presentation', className: $pt.LayoutHelper.classSet(css), key: index },
				React.createElement(
					'a',
					{ href: 'javascript:void(0);', onClick: this.onClicked },
					this.renderIcon(tab.icon, this.props.size),
					this.renderLabel(tab.label),
					this.renderBadge(tab.badge)
				),
				this.canRemove(tab) ? removeButton : null
			);
		},
		/**
   * render
   * @returns {XML}
   */
		render: function () {
			var css = {
				'nav': true,
				'nav-justified': this.props.justified === true,
				'nav-tabs': this.props.type === 'tab',
				'nav-pills': this.props.type === 'pill',
				'nav-direction-vertical': this.props.direction === 'vertical'
			};
			if (this.props.tabClassName) {
				css[this.props.tabClassName] = true;
			}
			return React.createElement(
				'div',
				{ className: 'n-tab' },
				React.createElement(
					'ul',
					{ className: $pt.LayoutHelper.classSet(css), ref: 'tabs' },
					this.props.tabs.map(this.renderTab)
				)
			);
		},
		/**
   * check the given tab can be removed or not
   * @param tab {{removable: boolean}}
   * @returns {boolean}
   */
		canRemove: function (tab) {
			if (tab.removable != null) {
				return tab.removable === true;
			} else {
				return this.props.removable;
			}
		},
		/**
   * get active tab index
   * @returns {number}
   */
		getActiveTabIndex: function () {
			// find the active tab
			var activeTabIndex = this.props.tabs.findIndex(function (tab, index) {
				return tab.active === true;
			});
			if (activeTabIndex == -1) {
				// find the first visible tab if no active tab found
				activeTabIndex = this.props.tabs.findIndex(function (tab, index) {
					var visible = tab.visible !== false;
					if (visible) {
						tab.active = true;
						return true;
					}
				});
			}
			return activeTabIndex;
		},
		/**
   * set active tab index
   * @param {number}
   */
		setActiveTabIndex: function (index) {
			if (index < 0 || index >= this.props.tabs.length) {
				window.console.warn('Tab index[' + index + '] out of bound.');
			}
			this.props.tabs.forEach(function (tab, tabIndex) {
				tab.active = tabIndex == index;
			});
			this.forceUpdate();
			return this;
		},
		/**
   * on tab clicked
   * @param evt
   */
		onClicked: function (evt) {
			var newTab = $(evt.target).closest('li');
			var newTabIndex = newTab.index();
			var activeTabIndex = this.getActiveTabIndex();

			var canActive = this.props.canActive;
			if (canActive) {
				var activeTab = this.props.tabs[activeTabIndex];
				var ret = canActive.call(this, this.props.tabs[newTabIndex].value, newTabIndex, activeTab.value, activeTabIndex);
				if (ret === false) {
					$(':focus').blur();
					return;
				}
			}

			this.setActiveTabIndex(newTabIndex);

			var onActive = this.props.onActive;
			if (onActive) {
				onActive.call(this, this.props.tabs[newTabIndex].value, newTabIndex);
			}
		},
		/**
   * on tab remove clicked
   * @param evt
   */
		onRemoveClicked: function (evt) {
			var selectedTab = $(evt.target).closest('li');
			selectedTab.addClass('active');
			selectedTab.parent().children('li').not(selectedTab).removeClass('active');

			var activeIndex = selectedTab.index();
			var activeTab = this.props.tabs[activeIndex];
			var activeValue = activeTab.value;

			// trigger can remove event, check it can remove or not
			var canRemove = this.props.canRemove;
			if (canRemove) {
				var ret = canRemove.call(this, activeValue, activeIndex);
				if (ret === false) {
					return;
				}
			}

			// remove tab
			this.props.tabs[activeIndex].visible = false;
			// find the visible tab
			// if tab index more than removed one, stop finding
			// or return the last visible tab which before removed tab
			var activeTabIndex = -1;
			this.props.tabs.some(function (tab, index) {
				if (tab.visible !== false) {
					activeTabIndex = index;
					return index > activeIndex;
				}
			});
			this.setActiveTabIndex(activeTabIndex);

			// trigger on remove event
			var onRemove = this.props.onRemove;
			if (onRemove) {
				onRemove.call(this, activeValue, activeIndex);
			}
		}
	});
	$pt.Components.NTab = NTab;
})(window, jQuery, React, ReactDOM, $pt);

/**
 * table
 *
 * depends NIcon, NText, NModalForm, NConfirm, NPagination
 */
(function (window, $, React, ReactDOM, $pt) {
	var NTable = React.createClass($pt.defineCellComponent({
		displayName: 'NTable',
		mixins: [$pt.mixins.ArrayComponentMixin],
		statics: {
			__operationButtonWidth: 31,
			__minOperationButtonWidth: 40,
			ROW_HEIGHT: 32,
			TOOLTIP_EDIT: null,
			TOOLTIP_REMOVE: null,
			TOOLTIP_MORE: 'More Operations...',
			/**
    * set operation button width
    * @param width {number}
    */
			setOperationButtonWidth: function (width) {
				NTable.__operationButtonWidth = width;
			},
			ADD_BUTTON_ICON: "plus",
			ADD_BUTTON_TEXT: "",
			DOWNLOADABLE: false,
			DOWNLOAD_BUTTON_ICON: "cloud-download",
			DOWNLOAD_BUTTON_TEXT: "",
			NO_DATA_DOWNLOAD_TITLE: 'Downloading...',
			NO_DATA_DOWNLOAD: "No data needs to be downloaded...",
			SEARCH_PLACE_HOLDER: "Search...",
			ROW_EDIT_BUTTON_ICON: "pencil",
			ROW_REMOVE_BUTTON_ICON: "trash-o",
			ROW_MORE_BUTTON_ICON: 'sort-down',
			EDIT_DIALOG_SAVE_BUTTON_TEXT: "Save",
			EDIT_DIALOG_SAVE_BUTTON_ICON: 'floppy-o',
			SORT_ICON: "sort",
			SORT_ASC_ICON: "sort-amount-asc",
			SORT_DESC_ICON: "sort-amount-desc",
			NO_DATA_LABEL: "No Data",
			INDEX_HEADER_TEXT: '#',
			INDEX_HEADER_WIDTH: 40,
			DETAIL_ERROR_MESSAGE: "Detail error please open item and do validate.",
			REMOVE_CONFIRM_TITLE: "Delete data?",
			REMOVE_CONFIRM_MESSAGE: ["Are you sure you want to delete data?", "Deleted data cannot be recovered."],
			BOOLEAN_TRUE_DISPLAY_TEXT: 'Y',
			BOOLEAN_FALSE_DISPLAY_TEXT: 'N',
			PAGE_JUMPING_PROXY: null,
			PAGE_JUMPING_PROXY_CALLBACK: null,
			registerInlineEditor: function (type, definition) {
				if (NTable.__inlineEditors[type] != null) {
					window.console.warn("Inline editor[" + type + "] is repalced.");
					window.console.warn("From:");
					window.console.warn(NTable.__inlineEditors[type]);
					window.console.warn("To:");
					window.console.warn(definition);
				}
				NTable.__inlineEditors[type] = definition;
			},
			getInlineEditor: function (type) {
				var editor = NTable.__inlineEditors[type];
				if (editor == null) {
					editor = NTable['__' + type];
				}
				if (editor == null) {
					throw $pt.createComponentException($pt.ComponentConstants.Err_Unsupported_Component, "Inline component type[" + type + "] is not supported yet.");
				}
				return editor;
			},
			__inlineEditors: {},
			__text: {
				comp: {
					type: { type: $pt.ComponentConstants.Text, label: false }
				}
			},
			__check: {
				comp: {
					type: { type: $pt.ComponentConstants.Check, label: false }
				}
			},
			__date: {
				comp: {
					type: { type: $pt.ComponentConstants.Date, label: false }
				}
			},
			__select: {
				comp: {
					type: { type: $pt.ComponentConstants.Select, label: false }
				}
			},
			__radio: {
				comp: {
					type: { type: $pt.ComponentConstants.Radio, label: false }
				}
			}
		},
		getDefaultProps: function () {
			return {
				defaultOptions: {
					header: true,

					scrollY: false,
					scrollX: false,
					fixedRightColumns: 0,
					fixedLeftColumns: 0,

					addable: false,
					searchable: true,
					// downloadable: false,

					operationFixed: false,
					editable: false,
					removable: false,

					indexable: false,
					indexFixed: false,

					rowSelectFixed: false,

					sortable: true,

					pageable: false,
					countPerPage: 20,

					dialogResetVisible: false,
					dialogValidateVisible: false,

					collapsible: false,
					expanded: true
				}
			};
		},
		/**
   * get initial state
   * @returns {*}
   */
		getInitialState: function () {
			//var _this = this;
			return {
				sortColumn: null,
				sortWay: null, // asc|desc

				countPerPage: 20,
				pageCount: 1,
				currentPageIndex: 1,

				searchText: null,
				searchModel: $pt.createModel({
					text: null
				}),
				searchLayout: $pt.createCellLayout('text', {
					comp: {
						placeholder: NTable.SEARCH_PLACE_HOLDER
					},
					css: {
						comp: 'n-table-search-box'
					}
				})
			};
		},
		/**
   * attach listeners
   */
		attachListeners: function () {
			var _this = this;
			this.getScrollBodyComponent().on("scroll", function (e) {
				var $this = $(this);
				_this.getScrollHeaderComponent().scrollLeft($this.scrollLeft());
				_this.getFixedLeftBodyComponent().scrollTop($this.scrollTop());
				_this.getFixedRightBodyComponent().scrollTop($this.scrollTop());
			});
			this.getDivComponent().on("mouseenter", "tbody tr", function () {
				//$(this).addClass("hover");
				var index = $(this).parent().children().index($(this));
				_this.getDivComponent().find("tbody tr:nth-child(" + (index + 1) + ")").addClass("hover");
			}).on("mouseleave", "tbody tr", function () {
				var index = $(this).parent().children().index($(this));
				_this.getDivComponent().find("tbody tr:nth-child(" + (index + 1) + ")").removeClass("hover");
			});
			// this.renderIfIE8();
			this.renderHeaderPopover();
			this.addPostChangeListener(this.onModelChanged);
			this.state.searchModel.addPostChangeListener('text', this.onSearchBoxChanged);
			this.addPostRemoveListener(this.onModelChanged);
			this.addPostAddListener(this.onModelChanged);
			this.addPostValidateListener(this.onModelValidateChanged);
			this.addVisibleDependencyMonitor();
		},
		/**
   * detach listeners
   */
		detachListeners: function () {
			this.getScrollBodyComponent().off("scroll");
			this.getDivComponent().off("mouseenter", "tbody tr").off("mouseleave", "tbody tr");
			$(ReactDOM.findDOMNode(this.refs[this.getHeaderLabelId()])).popover("destroy");
			this.removePostChangeListener(this.onModelChanged);
			this.state.searchModel.removePostChangeListener('text', this.onSearchBoxChanged);
			this.removePostRemoveListener(this.onModelChanged);
			this.removePostAddListener(this.onModelChanged);
			this.removePostValidateListener(this.onModelValidateChanged);
			this.removeVisibleDependencyMonitor();
		},
		/**
   * will update
   * @param nextProps
   */
		componentWillUpdate: function (nextProps) {
			this.detachListeners();
			if (nextProps != this.props) {
				// clear definition
				this.state.columns = null;
			}
			this.unregisterFromComponentCentral();
		},
		/**
   * did update
   * @param prevProps
   * @param prevState
   */
		componentDidUpdate: function (prevProps, prevState) {
			this.attachListeners();
			this.registerToComponentCentral();
		},
		/**
   * did mount
   */
		componentDidMount: function () {
			this.attachListeners();
			this.registerToComponentCentral();
		},
		/**
   * will unmount
   */
		componentWillUnmount: function () {
			this.detachListeners();
			this.unregisterFromComponentCentral();
			this.destroyPopover();
		},
		/**
   * render when IE8, fixed the height of table since IE8 doesn't support max-height
   */
		// renderIfIE8: function () {
		// 	if (!this.isIE8() || !this.hasVerticalScrollBar()) {
		// 		return;
		// 	}
		// 	var mainTable = this.getComponent();
		// 	var leftFixedDiv = this.getFixedLeftBodyComponent();
		// 	var rightFixedDiv = this.getFixedRightBodyComponent();
		// 	var trs = mainTable.find("tr");
		// 	var rowCount = trs.length;
		// 	var height = rowCount * NTable.ROW_HEIGHT; // 32 is defined in css, if value in css is changed, it must be changed together
		// 	if (height > this.getComponentOption("scrollY")) {
		// 		height = this.getComponentOption("scrollY");
		// 	}
		// 	// calculate height of body if ie8 and scrollY
		// 	mainTable.closest("div").css({
		// 		height: height + 17
		// 	});
		// 	leftFixedDiv.css({
		// 		height: height
		// 	});
		// 	rightFixedDiv.css({
		// 		height: height
		// 	});
		// },
		// isIE: function () {
		// 	return $pt.browser.msie;
		// },
		/**
   * check browser is IE8 or not
   * @returns {boolean}
   */
		isIE8: function () {
			return $pt.browser.msie && $pt.browser.version == 8;
		},
		/**
   * check browser is firefox or not
   * @returns {boolean}
   */
		isFirefox: function () {
			return $pt.browser.mozilla;
		},
		/**
   * prepare display options
   */
		prepareDisplayOptions: function () {
			if (this.state.columns != null) {
				// already initialized, do nothing and return
				return;
			}

			var _this = this;
			// this.state.searchModel.addListener('text', 'post', 'change', this.onSearchBoxChanged);

			// copy from this.props.columns
			this.state.columns = this.getComponentOption("columns");
			// is it is json array, construct to TableColumnLayout object
			if (Array.isArray(this.state.columns)) {
				this.state.columns = $pt.createTableColumnLayout(this.state.columns);
			} else {
				// get original columns definition can create new object
				this.state.columns = $pt.createTableColumnLayout(this.state.columns.columns());
			}
			this.fixedRightColumns = this.getComponentOption("fixedRightColumns");
			this.fixedLeftColumns = this.getComponentOption("fixedLeftColumns");

			var config = null;
			// if editable or removable, auto add last column to render the buttons
			var editable = this.isEditable();
			var removable = this.isRemovable();
			var rowOperations = this.getComponentOption("rowOperations");
			if (rowOperations == null) {
				rowOperations = [];
			} else if (!Array.isArray(rowOperations)) {
				rowOperations = [rowOperations];
			}
			rowOperations = rowOperations.filter(function (operation) {
				if (_this.isViewMode()) {
					// in view mode, filter the buttons only in editing
					return operation.view != 'edit';
				} else if (!_this.isViewMode()) {
					// no in view mode, filter the buttons only in view mode
					return operation.view != 'view';
				}
			});
			if (editable || removable || rowOperations.length != 0) {
				config = {
					editable: editable,
					removable: removable,
					rowOperations: rowOperations,
					title: "",
					width: this.calcOperationColumnWidth(editable, removable, rowOperations)
				};
				this.state.columns.push(config);
				if (this.fixedRightColumns > 0 || this.getComponentOption("operationFixed") === true) {
					this.fixedRightColumns++;
				}
			}
			// if row selectable, auto add first column to render the row select checkbox
			var rowSelectable = this.isRowSelectable();
			if (rowSelectable) {
				config = {
					rowSelectable: rowSelectable,
					width: 40,
					title: ''
				};
				this.state.columns.splice(0, 0, config);
				if (this.fixedLeftColumns > 0 || this.getComponentOption('rowSelectFixed') === true) {
					this.fixedLeftColumns++;
				}
			}
			// if indexable, auto add first column to render the row index
			var indexable = this.isIndexable();
			if (indexable) {
				config = {
					indexable: true,
					width: NTable.INDEX_HEADER_WIDTH,
					title: NTable.INDEX_HEADER_TEXT
				};
				this.state.columns.splice(0, 0, config);
				if (this.fixedLeftColumns > 0 || this.getComponentOption("indexFixed") === true) {
					this.fixedLeftColumns++;
				}
			}
		},
		calcOperationColumnWidth: function (editable, removable, rowOperations) {
			var width = this.getComponentOption('operationColumnWidth');
			if (width != null) {
				return width;
			}

			var maxButtonCount = this.getComponentOption('maxOperationButtonCount');
			if (maxButtonCount) {
				var actualButtonCount = (editable ? 1 : 0) + (removable ? 1 : 0) + rowOperations.length;
				if (maxButtonCount > actualButtonCount) {
					// no button in popover
					width = (editable ? NTable.__operationButtonWidth : 0) + (removable ? NTable.__operationButtonWidth : 0);
					if (rowOperations.length != 0) {
						width += NTable.__operationButtonWidth * rowOperations.length;
					}
				} else {
					// still some buttons in popover
					width = (maxButtonCount + 1) * NTable.__operationButtonWidth;
				}
			} else {
				width = (editable ? NTable.__operationButtonWidth : 0) + (removable ? NTable.__operationButtonWidth : 0);
				if (rowOperations.length != 0) {
					width += NTable.__operationButtonWidth * rowOperations.length;
				}
			}
			return width < NTable.__minOperationButtonWidth ? NTable.__minOperationButtonWidth : width;
		},
		/**
   * render search  box
   * @returns {XML}
   */
		renderSearchBox: function () {
			if (this.isSearchable()) {
				return React.createElement($pt.Components.NText, { model: this.state.searchModel, layout: this.state.searchLayout });
			} else {
				return null;
			}
		},
		/**
   * render heading buttons
   * @returns {*}
   */
		renderHeadingButtons: function () {
			var style = { display: this.state.expanded ? 'block' : 'none' };
			var buttons = [];
			if (this.isAddable()) {
				buttons.push(React.createElement(
					'a',
					{ href: 'javascript:void(0);',
						onClick: this.onAddClicked,
						className: 'n-table-heading-buttons pull-right',
						ref: 'add-button',
						style: style,
						key: 'add-button' },
					React.createElement($pt.Components.NIcon, { icon: NTable.ADD_BUTTON_ICON }),
					NTable.ADD_BUTTON_TEXT
				));
			}
			if (this.isDownloadable()) {
				buttons.push(React.createElement(
					'a',
					{ href: 'javascript:void(0);',
						onClick: this.onDownloadClicked,
						className: 'n-table-heading-buttons pull-right',
						ref: 'download-button',
						style: style,
						key: 'download-button' },
					React.createElement($pt.Components.NIcon, { icon: NTable.DOWNLOAD_BUTTON_ICON }),
					NTable.DOWNLOAD_BUTTON_TEXT
				));
			}
			return buttons;
		},
		/**
   * render panel heading label
   * @returns {XML}
   */
		renderPanelHeadingLabel: function () {
			var css = "col-sm-3 col-md-3 col-lg-3";
			if (this.getModel().hasError(this.getDataId())) {
				css += " has-error";
			}
			var spanCSS = {
				'n-table-heading-label': true
			};

			if (this.isCollapsible()) {
				spanCSS['n-table-heading-label-collapsible'] = true;
			}
			return React.createElement(
				'div',
				{ className: css },
				React.createElement(
					'span',
					{ className: this.getAdditionalCSS("headingLabel", $pt.LayoutHelper.classSet(spanCSS)),
						ref: this.getHeaderLabelId(), onClick: this.isCollapsible() ? this.onTitleClicked : null },
					this.getLayout().getLabel(this)
				)
			);
		},
		/**
   * render header popover
   */
		renderHeaderPopover: function () {
			if ($pt.ComponentConstants.ERROR_POPOVER && this.getModel().hasError(this.getDataId())) {
				var messages = this.getModel().getError(this.getDataId());
				var _this = this;
				var content = messages.map(function (msg) {
					if (typeof msg === "string") {
						return "<span style='display:block'>" + msg.format([_this.getLayout().getLabel(this)]) + "</span>";
					} else {
						return "<span style='display:block'>" + NTable.DETAIL_ERROR_MESSAGE + "</span>";
					}
				});
				$(ReactDOM.findDOMNode(this.refs[this.getHeaderLabelId()])).popover({
					placement: 'top',
					trigger: 'hover',
					html: true,
					content: content,
					// false is very import, since when destroy popover,
					// the really destroy will be invoked by some delay,
					// and before really destory invoked,
					// the new popover is bind by componentDidUpdate method.
					// and finally new popover will be destroyed.
					animation: false
				});
			}
		},
		/**
   * render panel heading
   * @returns {XML}
   */
		renderPanelHeading: function () {
			if (!this.isHeading()) {
				return null;
			}
			return React.createElement(
				'div',
				{ className: this.getAdditionalCSS("heading", "panel-heading n-table-heading") },
				React.createElement(
					'div',
					{ className: 'row' },
					this.renderPanelHeadingLabel(),
					React.createElement(
						'div',
						{ className: 'col-sm-9 col-md-9 col-lg-9' },
						this.renderHeadingButtons(),
						this.renderSearchBox()
					)
				)
			);
		},
		/**
   * render sort button
   * @param column
   * @returns {XML}
   */
		renderTableHeaderSortButton: function (column) {
			if (this.isSortable(column)) {
				var icon = NTable.SORT_ICON;
				var sortClass = this.getAdditionalCSS("sort", "pull-right n-table-sort");
				if (this.state.sortColumn == column) {
					sortClass += " " + this.getAdditionalCSS("sorted", "n-table-sorted");
					if (this.state.sortWay == "asc") {
						icon = NTable.SORT_ASC_ICON;
					} else {
						icon = NTable.SORT_DESC_ICON;
					}
				}
				return React.createElement(
					'a',
					{ href: 'javascript:void(0);', className: sortClass,
						onClick: this.onSortClicked.bind(this, column) },
					React.createElement($pt.Components.NIcon, { icon: icon })
				);
			}
		},
		/**
   * render checkbox
   * @param column
   * @returns {XML}
   */
		renderTableHeaderCheckBox: function (column) {
			var data = this.getDataToDisplay();
			var range = this.computePagination(data);
			var allSelected = this.isCurrentPageAllSelected(column, data, range);
			var model = $pt.createModel({
				allCheck: allSelected
			});
			var layout = $pt.createCellLayout('allCheck', {
				comp: {
					type: $pt.ComponentConstants.Check
				}
			});
			var _this = this;
			model.addListener('allCheck', 'post', 'change', function (evt) {
				var selected = evt.new;
				if (data != null) {
					var rowIndex = 1;
					data.forEach(function (row) {
						if (rowIndex >= range.min && rowIndex <= range.max) {
							$pt.setValueIntoJSON(row, column.rowSelectable, selected);
						}
						rowIndex++;
					});
					_this.forceUpdate(_this.onCheckAllChanged.bind(_this, selected));
				}
			});
			return React.createElement($pt.Components.NCheck, { model: model, layout: layout });
		},
		/**
   * render heading content.
   * at least and only one parameter can be true.
   * if more than one parameter is true, priority as all > leftFixed > rightFixed
   * @param all {boolean} render all columns?
   * @param leftFixed {boolean} render left fixed columns?
   * @param rightFixed {boolean} render right fixed columns?
   * @returns {XML}
   * @see #getRenderColumnIndexRange
   */
		renderTableHeading: function (all, leftFixed, rightFixed) {
			var indexToRender = this.getRenderColumnIndexRange(all, leftFixed, rightFixed);
			var columnIndex = 0;
			var _this = this;
			return React.createElement(
				'thead',
				null,
				React.createElement(
					'tr',
					null,
					this.state.columns.map(function (column) {
						if (columnIndex >= indexToRender.min && columnIndex <= indexToRender.max) {
							// column is fixed.
							columnIndex++;
							var style = {};
							style.width = column.width;
							if (column.headerAlign) {
								style.textAlign = column.headerAlign;
							}
							if (!(column.visible === undefined || column.visible === true)) {
								style.display = "none";
							}
							if (column.rowSelectable) {
								return React.createElement(
									'td',
									{ style: style, key: columnIndex },
									_this.renderTableHeaderCheckBox(column)
								);
							} else {
								return React.createElement(
									'td',
									{ style: style, key: columnIndex },
									column.title,
									_this.renderTableHeaderSortButton(column)
								);
							}
						} else {
							columnIndex++;
						}
					})
				)
			);
		},
		renderRowEditButton: function (rowModel) {
			var layout = $pt.createCellLayout('editButton', {
				comp: {
					style: 'link',
					icon: NTable.ROW_EDIT_BUTTON_ICON,
					enabled: this.getRowEditButtonEnabled(),
					click: this.onEditClicked.bind(this, rowModel.getCurrentModel()),
					tooltip: NTable.TOOLTIP_EDIT
				},
				css: {
					comp: 'n-table-op-btn'
				}
			});
			return React.createElement($pt.Components.NFormButton, { model: rowModel, layout: layout });
		},
		renderRowRemoveButton: function (rowModel) {
			var layout = $pt.createCellLayout('removeButton', {
				comp: {
					style: 'link',
					icon: NTable.ROW_REMOVE_BUTTON_ICON,
					enabled: this.getRowRemoveButtonEnabled(),
					click: this.onRemoveClicked.bind(this, rowModel.getCurrentModel()),
					tooltip: NTable.TOOLTIP_REMOVE
				},
				css: {
					comp: 'n-table-op-btn'
				}
			});
			return React.createElement($pt.Components.NFormButton, { model: rowModel, layout: layout });
		},
		isRowOperationVisible: function (operation, rowModel) {
			var visible = operation.visible;
			if (visible) {
				return this.getRuleValue(visible, true, rowModel);
			} else {
				return true;
			}
		},
		renderRowOperationButton: function (operation, rowModel, operationIndex) {
			var layout = $pt.createCellLayout('rowButton', {
				label: operation.icon ? null : operation.tooltip,
				comp: Object.keys(operation).reduce(function (options, key) {
					if (key != 'click') {
						options[key] = operation[key];
					}
					return options;
				}, {
					style: 'link',
					click: this.onRowOperationClicked.bind(this, operation.click, rowModel)
				}),
				// {
				// 	style: 'link',
				// 	icon: operation.icon,
				// 	enabled: operation.enabled,
				// 	visible: operation.visible,
				// 	click: this.onRowOperationClicked.bind(this, operation.click, rowModel),
				// 	tooltip: operation.tooltip
				// },
				css: {
					comp: 'n-table-op-btn'
				}
			});
			return React.createElement($pt.Components.NFormButton, { model: rowModel, layout: layout, key: operationIndex });
		},
		getRowOperations: function (column) {
			var rowOperations = column.rowOperations;
			if (rowOperations === undefined || rowOperations === null) {
				rowOperations = [];
			}
			return rowOperations;
		},
		/**
   * render flat operation cell, all operation button renderred as a line.
   */
		renderFlatOperationCell: function (column, rowModel) {
			var editButton = column.editable ? this.renderRowEditButton(rowModel) : null;
			var removeButton = column.removable ? this.renderRowRemoveButton(rowModel) : null;
			var rowOperations = this.getRowOperations(column);
			var _this = this;
			// rowOperations = rowOperations.filter(function(rowOperation) {
			// 	return _this.isRowOperationVisible(rowOperation, rowModel);
			// });
			return React.createElement(
				'div',
				{ className: 'btn-group n-table-op-btn-group', role: 'group' },
				rowOperations.map(function (operation, operationIndex) {
					return _this.renderRowOperationButton(operation, rowModel, operationIndex);
				}),
				editButton,
				removeButton
			);
		},
		renderPopoverContainer: function () {
			if (this.state.popoverDiv == null) {
				this.state.popoverDiv = $('<div>');
				this.state.popoverDiv.appendTo($('body'));
				$(document).on('click', this.onDocumentClicked).on('keyup', this.onDocumentKeyUp);
			}
			this.state.popoverDiv.hide();
		},
		/**
   * check all row operation buttons in more popover are renderred as icon and tooltip or menu?
   * if operation with no icon declared, return false (render as menu)
   */
		isRenderMoreOperationButtonsAsIcon: function (moreOperations) {
			if (this.getComponentOption('moreAsMenu')) {
				return true;
			} else {
				return !moreOperations.some(function (operation) {
					return operation.icon == null;
				});
			}
		},
		renderPopoverAsMenu: function (moreOperations, rowModel) {
			var hasIcon = moreOperations.some(function (operation) {
				return operation.icon != null;
			});
			var _this = this;
			var renderOperation = function (operation, operationIndex) {
				var layout = $pt.createCellLayout('rowButton', {
					label: operation.tooltip,
					comp: {
						style: 'link',
						icon: hasIcon ? operation.icon ? operation.icon : 'placeholder' : null,
						enabled: operation.enabled,
						click: _this.onRowOperationClicked.bind(_this, operation.click, rowModel)
					},
					css: {
						comp: 'n-table-op-btn'
					}
				});
				return React.createElement(
					'li',
					{ key: operationIndex },
					React.createElement($pt.Components.NFormButton, { model: rowModel, layout: layout })
				);
			};
			return React.createElement(
				'ul',
				{ className: 'nav' },
				moreOperations.map(renderOperation)
			);
		},
		renderPopoverAsIcon: function (moreOperations, rowModel) {
			var _this = this;
			return moreOperations.map(function (operation, operationIndex) {
				return _this.renderRowOperationButton(operation, rowModel, operationIndex);
			});
		},
		renderPopover: function (moreOperations, rowModel, eventTarget) {
			var styles = { display: 'block' };
			var target = $(eventTarget).closest('a');
			var offset = target.offset();
			styles.top = offset.top + target.outerHeight() - 5;
			styles.left = offset.left;

			//var _this = this;
			ReactDOM.render(React.createElement(
				'div',
				{ role: 'tooltip', className: 'n-table-op-btn-popover popover bottom in', style: styles },
				React.createElement('div', { className: 'arrow' }),
				React.createElement(
					'div',
					{ className: 'popover-content' },
					this.isRenderMoreOperationButtonsAsIcon(moreOperations) ? this.renderPopoverAsIcon(moreOperations, rowModel) : this.renderPopoverAsMenu(moreOperations, rowModel)
				)
			), this.state.popoverDiv.get(0));
		},
		showPopover: function (moreOperations, rowModel, eventTarget) {
			this.renderPopoverContainer();
			this.renderPopover(moreOperations, rowModel, eventTarget);
			this.state.popoverDiv.show();

			// reset position
			var styles = {};
			var target = $(eventTarget).closest('a');
			var offset = target.offset();
			var popover = this.state.popoverDiv.children('.popover');
			var popWidth = popover.outerWidth();
			styles.left = offset.left + target.outerWidth() - popWidth + 10;
			popover.css(styles);
		},
		hidePopover: function () {
			if (this.state.popoverDiv && this.state.popoverDiv.is(':visible')) {
				this.state.popoverDiv.hide();
				ReactDOM.render(React.createElement('noscript', null), this.state.popoverDiv.get(0));
			}
		},
		destroyPopover: function () {
			if (this.state.popoverDiv) {
				$(document).off('click', this.onDocumentClicked).off('keyup', this.onDocumentKeyUp);
				this.state.popoverDiv.remove();
				delete this.state.popoverDiv;
			}
		},
		onDocumentClicked: function (evt) {
			var target = $(evt.target);
			if (target.closest(this.state.popoverDiv).length != 0) {
				// click in popover
			} else if (target.closest($('.n-table-op-btn.more')).length != 0) {
				// click in more button
				if (target.closest($(this.refs.div)).length == 0) {
					// in other table's more button
					this.hidePopover();
				}
			} else {
				// neither popover nor more button
				this.hidePopover();
			}
		},
		onDocumentKeyUp: function (evt) {
			if (evt.keyCode === 27) {
				this.hidePopover();
			}
		},
		onRowOperationMoreClicked: function (moreOperations, rowModel, eventTarget) {
			this.showPopover(moreOperations, rowModel, eventTarget);
		},
		/**
   * render more operations buttons
   */
		renderRowOperationMoreButton: function (moreOperations, rowModel) {
			var layout = $pt.createCellLayout('rowButton', {
				comp: {
					style: 'link',
					icon: NTable.ROW_MORE_BUTTON_ICON,
					click: this.onRowOperationMoreClicked.bind(this, moreOperations),
					tooltip: NTable.TOOLTIP_MORE
				},
				css: {
					comp: 'n-table-op-btn more'
				}
			});
			return React.createElement($pt.Components.NFormButton, { model: rowModel, layout: layout, key: 'more-op' });
		},
		/**
   * render dropdown operation cell, only buttons which before maxButtonCount are renderred as a line,
   * a dropdown button is renderred in last, other buttons are renderred in popover of dropdown button.
   */
		renderDropDownOperationCell: function (column, rowModel, maxButtonCount) {
			var _this = this;
			var rowOperations = this.getRowOperations(column);
			if (column.editable) {
				rowOperations.push({ editButton: true });
			}
			if (column.removable) {
				rowOperations.push({ removeButton: true });
			}
			// filter invisible operations, will not monitor the attributes in depends property
			rowOperations = rowOperations.filter(function (rowOperation) {
				return _this.isRowOperationVisible(rowOperation, rowModel);
			});

			var used = -1;
			var buttons = [];
			rowOperations.some(function (operation, operationIndex) {
				if (operation.editButton) {
					buttons.push(_this.renderRowEditButton(rowModel));
				} else if (operation.removeButton) {
					buttons.push(_this.renderRowRemoveButton(rowModel));
				} else {
					buttons.push(_this.renderRowOperationButton(operation, rowModel, operationIndex));
				}
				used++;
				return maxButtonCount - used == 1;
			});
			var hasDropdown = rowOperations.length - used > 1;
			var dropdown = null;
			if (hasDropdown) {
				buttons.push(this.renderRowOperationMoreButton(rowOperations.slice(used + 1), rowModel));
			}

			return React.createElement(
				'div',
				{ className: 'btn-group n-table-op-btn-group', role: 'group' },
				buttons,
				dropdown
			);
		},
		/**
   * render operation cell
   * @param column
   * @param rowModel {ModelInterface} row model
   * @returns {XML}
   */
		renderOperationCell: function (column, rowModel) {
			var needPopover = false;
			var maxButtonCount = this.getComponentOption('maxOperationButtonCount');
			if (maxButtonCount) {
				var actualButtonCount = (column.editable ? 1 : 0) + (column.removable ? 1 : 0) + column.rowOperations.length;
				if (actualButtonCount > maxButtonCount) {
					needPopover = true;
				}
			}
			if (!needPopover) {
				return this.renderFlatOperationCell(column, rowModel);
			} else {
				return this.renderDropDownOperationCell(column, rowModel, maxButtonCount);
			}
		},
		/**
   * render row select cell
   * @param column
   * @param model
   * @returns {XML}
   */
		renderRowSelectCell: function (column, model) {
			var _this = this;
			model.addListener(column.rowSelectable, 'post', 'change', function (evt) {
				_this.forceUpdate();
			});
			var layout = $pt.createCellLayout(column.rowSelectable, {
				comp: {
					type: $pt.ComponentConstants.Check
				}
			});
			return React.createElement($pt.Components.NCheck, { model: model, layout: layout });
		},
		/**
   * render table body rows
   * @param row {*} data of row, json object
   * @param rowIndex {number}
   * @param all {boolean}
   * @param leftFixed {boolean}
   * @param rightFixed {boolean}
   * @returns {XML}
   */
		renderTableBodyRow: function (row, rowIndex, all, leftFixed, rightFixed) {
			var indexToRender = this.getRenderColumnIndexRange(all, leftFixed, rightFixed);
			var columnIndex = 0;
			var _this = this;
			var className = rowIndex % 2 == 0 ? "even" : "odd";
			if (this.getModel().hasError(this.getDataId())) {
				var rowError = null;
				var errors = this.getModel().getError(this.getDataId());
				for (var index = 0, count = errors.length; index < count; index++) {
					if (typeof errors[index] !== "string") {
						rowError = errors[index].getError(row);
					}
				}
				if (rowError != null) {
					className += " has-error";
				}
			}

			var inlineModel = this.createRowModel(row, true);
			this.addRowListener(inlineModel);
			return React.createElement(
				'tr',
				{ className: className, key: rowIndex },
				this.state.columns.map(function (column) {
					if (columnIndex >= indexToRender.min && columnIndex <= indexToRender.max) {
						// column is fixed.
						columnIndex++;
						var style = {
							width: column.width
						};
						if (column.styles) {
							Object.keys(column.styles).forEach(function (key) {
								style[key] = column.styles[key];
							});
						}
						if (!(column.visible === undefined || column.visible === true)) {
							style.display = "none";
						}
						var data;
						if (column.editable || column.removable || column.rowOperations != null) {
							// operation column
							data = _this.renderOperationCell(column, inlineModel);
							style.textAlign = "left";
						} else if (column.indexable) {
							// index column
							data = rowIndex;
						} else if (column.rowSelectable) {
							data = _this.renderRowSelectCell(column, inlineModel);
						} else if (column.inline) {
							// inline editor or something, can be pre-defined or just declare as be constructed as a form layout
							if (typeof column.inline === 'string') {
								var layout = NTable.getInlineEditor(column.inline);
								layout.pos = { width: 12 };
								if (layout.css) {
									layout.css.cell = 'inline-editor' + layout.css.cell ? ' ' + layout.css.cell : '';
								} else {
									layout.css = { cell: 'inline-editor' };
								}
								layout.label = column.title;
								if (column.inline === 'select' || column.inline === 'radio') {
									// set code table
									// if (column.codes) {
									layout = $.extend(true, {}, { comp: { data: column.codes } }, layout);
									// }
								} else {
									layout = $.extend(true, {}, layout);
								}
								// pre-defined, use with data together
								data = React.createElement($pt.Components.NFormCell, { model: inlineModel,
									layout: $pt.createCellLayout(column.data, layout),
									direction: 'horizontal',
									view: _this.isViewMode() });
							} else if (column.inline.inlineType == 'cell') {
								column.inline.pos = { width: 12 };
								if (column.inline.css) {
									column.inline.css.cell = 'inline-editor' + (column.inline.css.cell ? ' ' + column.inline.css.cell : '');
								} else {
									column.inline.css = { cell: 'inline-editor' };
								}
								column.inline.label = column.inline.label ? column.inline.label : column.title;
								data = React.createElement($pt.Components.NFormCell, { model: inlineModel,
									layout: $pt.createCellLayout(column.data, column.inline),
									direction: 'horizontal',
									view: _this.isViewMode(),
									className: column.inline.__className });
							} else {
								// any other, treat as form layout
								// column.data is not necessary
								data = React.createElement($pt.Components.NForm, { model: inlineModel,
									layout: $pt.createFormLayout(column.inline),
									direction: 'horizontal',
									view: _this.isViewMode() });
							}
						} else {
							// data is property name
							data = _this.getDisplayTextOfColumn(column, row);
						}
						return React.createElement(
							'td',
							{ style: style, key: columnIndex, className: column.css },
							data
						);
					} else {
						columnIndex++;
					}
				})
			);
		},
		/**
   * render table body
   * at least and only one parameter can be true.
   * if more than one parameter is true, priority as all > leftFixed > rightFixed
   * @param all
   * @param leftFixed
   * @param rightFixed
   * @returns {XML}
   */
		renderTableBody: function (all, leftFixed, rightFixed) {
			var data = this.getDataToDisplay();
			if (data == null || data.length == 0) {
				// no data
				return null;
			}
			var rowIndex = 1;
			var _this = this;
			var range = this.computePagination(data);
			return React.createElement(
				'tbody',
				null,
				data.map(function (element) {
					if (rowIndex >= range.min && rowIndex <= range.max) {
						return _this.renderTableBodyRow(element, rowIndex++, all, leftFixed, rightFixed);
					} else {
						rowIndex++;
						return null;
					}
				})
			);
		},
		/**
   * render table with no scroll Y
   * @returns {XML}
   */
		renderTableNoScrollY: function () {
			return React.createElement(
				'div',
				{ className: this.getAdditionalCSS("panelBody", "n-table-panel-body") },
				React.createElement(
					'table',
					{ cellSpacing: '0', className: this.getAdditionalCSS("table", "n-table cell-border"),
						style: this.computeTableStyle(),
						ref: 'table' },
					this.renderTableHeading(true),
					this.renderTableBody(true)
				)
			);
		},
		/**
   * render table with scroll Y
   * @returns {XML}
   */
		renderTableScrollY: function () {
			var style = this.computeTableStyle();
			var scrolledHeaderDivStyle = {
				overflowY: "scroll"
			};
			var scrolledBodyDivStyle = {
				maxHeight: this.getComponentOption("scrollY"),
				overflowY: "scroll"
			};
			return React.createElement(
				'div',
				{ className: this.getAdditionalCSS("panelBody", "n-table-panel-body") },
				React.createElement(
					'div',
					{ className: 'n-table-scroll-head', ref: this.getScrolledHeaderDivId(), style: scrolledHeaderDivStyle },
					React.createElement(
						'div',
						{ className: 'n-table-scroll-head-inner', style: style },
						React.createElement(
							'table',
							{ cellSpacing: '0', className: this.getAdditionalCSS("table", "n-table cell-border"),
								style: style },
							this.renderTableHeading(true)
						)
					)
				),
				React.createElement(
					'div',
					{ className: 'n-table-scroll-body', style: scrolledBodyDivStyle, ref: this.getScrolledBodyDivId() },
					React.createElement(
						'table',
						{ cellSpacing: '0', className: this.getAdditionalCSS("table", "n-table cell-border"),
							style: style,
							ref: 'table' },
						this.renderTableBody(true)
					)
				)
			);
		},
		/**
   * render table
   * @returns {XML}
   */
		renderTable: function () {
			if (this.hasVerticalScrollBar() && this.hasDataToDisplay()) {
				return this.renderTableScrollY();
			} else {
				return this.renderTableNoScrollY();
			}
		},
		/**
   * render fixed left columns with scroll Y
   * @returns {XML}
   */
		renderFixedLeftColumnsScrollY: function () {
			var divStyle = {
				width: this.computeFixedLeftColumnsWidth()
			};
			var bodyDivStyle = {
				width: "100%",
				overflow: "hidden"
			};
			if (this.hasHorizontalScrollBar()) {
				// for IE8 box model
				bodyDivStyle.maxHeight = this.getComponentOption("scrollY") - (this.isIE8() ? 0 : 18);
			}
			var tableStyle = {
				width: "100%"
			};
			return React.createElement(
				'div',
				{ className: 'n-table-fix-left', style: divStyle },
				React.createElement(
					'table',
					{ cellSpacing: '0', style: tableStyle,
						className: this.getAdditionalCSS("table", "n-table cell-border") },
					this.renderTableHeading(false, true)
				),
				React.createElement(
					'div',
					{ ref: this.getFixedLeftBodyDivId(), style: bodyDivStyle },
					React.createElement(
						'table',
						{ cellSpacing: '0', className: this.getAdditionalCSS("table", "n-table cell-border"),
							style: tableStyle },
						this.renderTableBody(false, true)
					)
				)
			);
		},
		/**
   * render fixed left columns with no scroll Y
   * @returns {XML}
   */
		renderFixedLeftColumnsNoScrollY: function () {
			var divStyle = {
				width: this.computeFixedLeftColumnsWidth()
			};
			var tableStyle = {
				width: "100%"
			};
			return React.createElement(
				'div',
				{ className: 'n-table-fix-left', style: divStyle },
				React.createElement(
					'table',
					{ cellSpacing: '0', className: this.getAdditionalCSS("table", "n-table cell-border"),
						style: tableStyle },
					this.renderTableHeading(false, true),
					this.renderTableBody(false, true)
				)
			);
		},
		/**
   * render fixed left columns
   * @returns {XML}
   */
		renderFixedLeftColumns: function () {
			if (!this.hasFixedLeftColumns() && this.hasDataToDisplay()) {
				return null;
			}
			if (this.hasVerticalScrollBar()) {
				return this.renderFixedLeftColumnsScrollY();
			} else {
				return this.renderFixedLeftColumnsNoScrollY();
			}
		},
		/**
   * render fixed right columns with no scroll Y
   * @returns {XML}
   */
		renderFixedRightColumnsNoScrollY: function () {
			var divStyle = {
				width: this.computeFixedRightColumnsWidth()
			};
			var tableStyle = {
				width: "100%"
			};
			return React.createElement(
				'div',
				{ className: 'n-table-fix-right', style: divStyle },
				React.createElement(
					'table',
					{ cellSpacing: '0', className: this.getAdditionalCSS("table", "n-table cell-border"),
						style: tableStyle },
					this.renderTableHeading(false, false, true),
					this.renderTableBody(false, false, true)
				)
			);
		},
		/**
   * render fixed right columns with scroll Y
   * @returns {XML}
   */
		renderFixedRightColumnsScrollY: function () {
			var divStyle = {
				width: this.computeFixedRightColumnsWidth(),
				right: "16px"
			};
			var bodyDivStyle = {
				width: "100%",
				overflow: "hidden"
			};
			if (this.hasHorizontalScrollBar()) {
				// ie8 box mode, scrollbar is not in height.
				// ie>8 or chrome, scrollbar is in height.
				bodyDivStyle.maxHeight = this.getComponentOption("scrollY") - (this.isIE8() ? 0 : 18);
			}
			var tableStyle = {
				width: "100%"
			};
			return React.createElement(
				'div',
				{ className: 'n-table-fix-right', style: divStyle },
				React.createElement(
					'div',
					{ className: 'n-table-fix-right-head-wrapper' },
					React.createElement('div', { className: 'n-table-fix-right-top-corner' }),
					React.createElement(
						'table',
						{ cellSpacing: '0', style: tableStyle,
							className: this.getAdditionalCSS("table", "n-table cell-border") },
						this.renderTableHeading(false, false, true)
					)
				),
				React.createElement(
					'div',
					{ ref: this.getFixedRightBodyDivId(), style: bodyDivStyle },
					React.createElement(
						'table',
						{ cellSpacing: '0', className: this.getAdditionalCSS("table", "n-table cell-border") },
						this.renderTableBody(false, false, true)
					)
				)
			);
		},
		/**
   * render fixed right columns
   * @returns {XML}
   */
		renderFixedRightColumns: function () {
			if (!this.hasFixedRightColumns() && this.hasDataToDisplay()) {
				return null;
			}
			if (this.hasVerticalScrollBar()) {
				return this.renderFixedRightColumnsScrollY();
			} else {
				return this.renderFixedRightColumnsNoScrollY();
			}
		},
		/**
   * render not data reminder label
   * @returns {XML}
   */
		renderNoDataReminder: function () {
			if (this.hasDataToDisplay()) {
				return null;
			} else {
				return React.createElement(
					'div',
					{ className: 'n-table-no-data' },
					React.createElement(
						'span',
						null,
						NTable.NO_DATA_LABEL
					)
				);
			}
		},
		/**
   * render pagination
   * @returns {XML}
   */
		renderPagination: function () {
			if (this.isPageable() && this.hasDataToDisplay()) {
				// only show when pageable and has data to display
				return React.createElement($pt.Components.NPagination, { className: 'n-table-pagination', pageCount: this.state.pageCount,
					currentPageIndex: this.state.currentPageIndex,
					toPage: this.toPage });
			} else {
				return null;
			}
		},
		renderRightTopCorner: function () {
			var rightCorner = null;
			if (this.hasVerticalScrollBar() && !this.hasFixedRightColumns()) {
				var divStyle = {
					width: '16px',
					right: "16px"
				};
				var bodyDivStyle = {
					width: "100%",
					overflow: "hidden"
				};
				if (this.hasHorizontalScrollBar()) {
					// ie8 box mode, scrollbar is not in height.
					// ie>8 or chrome, scrollbar is in height.
					bodyDivStyle.maxHeight = this.getComponentOption("scrollY") - (this.isIE8() ? 0 : 18);
				}
				rightCorner = React.createElement(
					'div',
					{ className: 'n-table-fix-right', style: divStyle },
					React.createElement(
						'div',
						{ className: 'n-table-fix-right-head-wrapper' },
						React.createElement('div', { className: 'n-table-fix-right-top-corner' })
					)
				);
			}
			return rightCorner;
		},
		/**
   * render
   * @returns {XML}
   */
		render: function () {
			this.prepareDisplayOptions();
			var css = {
				'n-table-container panel': true
			};
			var style = this.getComponentOption('style');
			if (style) {
				css['panel-' + style] = true;
			} else {
				css['panel-default'] = true;
			}
			if (!this.isHeading()) {
				css['n-table-no-header'] = true;
			}
			var expandedStyle = {
				display: this.isExpanded() ? 'block' : 'none'
			};
			return React.createElement(
				'div',
				{ className: this.getComponentCSS($pt.LayoutHelper.classSet(css)), ref: 'div' },
				this.renderPanelHeading(),
				React.createElement(
					'div',
					{ ref: 'table-panel-body', style: expandedStyle },
					React.createElement(
						'div',
						{ className: this.getAdditionalCSS("body", "n-table-body-container panel-body") },
						this.renderTable(),
						this.renderFixedLeftColumns(),
						this.renderFixedRightColumns(),
						this.renderRightTopCorner()
					),
					this.renderNoDataReminder(),
					this.renderPagination()
				)
			);
		},
		/**
   * has vertical scroll bar
   * @returns {boolean}
   */
		hasVerticalScrollBar: function () {
			var scrollY = this.getComponentOption("scrollY");
			return scrollY !== false;
		},
		/**
   * has horizontal scroll bar
   * @returns {boolean}
   */
		hasHorizontalScrollBar: function () {
			var hasVerticalBar = this.hasVerticalScrollBar();
			if (hasVerticalBar) {
				// if scrollY is set, force set scrollX to true, since the table will be
				// splitted to head table and body table.
				// for make sure the cell is aligned, width of columns must be set.
				return true;
			}

			var scrollX = this.getComponentOption("scrollX");
			return scrollX === true;
		},
		/**
   * compute table style
   * @returns {{width: number, maxWidth: number}}
   */
		computeTableStyle: function () {
			var width = 0;
			if (this.hasHorizontalScrollBar()) {
				width = 0;
				// calculate width
				this.state.columns.forEach(function (column) {
					if (column.visible === undefined || column.visible === true) {
						width += column.width ? column.width * 1 : 0;
					}
				});
			} else {
				width = "100%";
			}
			return {
				width: width,
				maxWidth: width
			};
		},
		/**
   * compute fixed left columns width
   * @returns {number}
   */
		computeFixedLeftColumnsWidth: function () {
			var width = 0;
			var fixedLeftColumns = this.getMaxFixedLeftColumnIndex();
			var columnIndex = 0;
			this.state.columns.forEach(function (element) {
				if (columnIndex <= fixedLeftColumns && (element.visible === undefined || element.visible === true)) {
					// column is fixed.
					width += element.width ? element.width * 1 : 0;
				}
				columnIndex++;
			});
			return width + 1;
		},
		/**
   * compute fixed right columns width
   * @returns {number}
   */
		computeFixedRightColumnsWidth: function () {
			var width = 0;
			var fixedRightColumns = this.getMinFixedRightColumnIndex();
			var columnIndex = 0;
			this.state.columns.forEach(function (element) {
				if (columnIndex >= fixedRightColumns && (element.visible === undefined || element.visible === true)) {
					// column is fixed
					width += element.width;
				}
				columnIndex++;
			});
			return width + (this.isFirefox() ? 3 : 1);
		},

		/**
   * get column index range for rendering
   * at least and only one parameter can be true.
   * if more than one parameter is true, priority as all > leftFixed > rightFixed
   * @param all
   * @param leftFixed
   * @param rightFixed
   * @returns {{min, max}}
   */
		getRenderColumnIndexRange: function (all, leftFixed, rightFixed) {
			var index = {};
			if (all) {
				index.min = 0;
				index.max = 10000;
			} else if (leftFixed) {
				index.min = 0;
				index.max = this.getMaxFixedLeftColumnIndex();
			} else if (rightFixed) {
				index.min = this.getMinFixedRightColumnIndex();
				index.max = 10000;
			}
			return index;
		},
		/**
   * get max fixed left column index. if no column is fixed in left, return -1
   * @returns {number}
   */
		getMaxFixedLeftColumnIndex: function () {
			return this.fixedLeftColumns - 1;
		},
		/**
   * get min fixed right column index. if no column is fixed in right, return
   * max column index.
   * eg. there are 3 columns in table, if no fixed right column, return 3. if
   * 1 fixed right column, return 2.
   * @returns {number}
   */
		getMinFixedRightColumnIndex: function () {
			return this.state.columns.length() - this.fixedRightColumns;
		},
		/**
   * get query settings
   * @returns {*}
   */
		getQuerySettings: function () {
			return this.getComponentOption("criteria");
		},
		/**
   * compute pagination
   * @param data array of data
   * @returns {{min, max}}
   */
		computePagination: function (data) {
			var minRowIndex = 0;
			var maxRowIndex = 999999;
			if (this.isPageable()) {
				var queryCriteria = this.getQuerySettings();
				if (queryCriteria === null) {
					// no query criteria
					this.state.countPerPage = this.getComponentOption("countPerPage");
					var pageCount = data.length == 0 ? 1 : data.length / this.state.countPerPage;
					this.state.pageCount = Math.floor(pageCount) == pageCount ? pageCount : Math.floor(pageCount) + 1;
					this.state.currentPageIndex = this.state.currentPageIndex > this.state.pageCount ? this.state.pageCount : this.state.currentPageIndex;
					this.state.currentPageIndex = this.state.currentPageIndex <= 0 ? 1 : this.state.currentPageIndex;
					minRowIndex = (this.state.currentPageIndex - 1) * this.state.countPerPage + 1;
					maxRowIndex = minRowIndex + this.state.countPerPage - 1;
				} else {
					var criteria = this.getModel().get(queryCriteria);
					this.state.countPerPage = criteria.countPerPage;
					this.state.pageCount = criteria.pageCount;
					this.state.currentPageIndex = criteria.pageIndex;
					minRowIndex = 1;
					maxRowIndex = this.state.countPerPage;
				}
			}
			return {
				min: minRowIndex,
				max: maxRowIndex
			};
		},
		/**
   * has fixed left columns
   * @returns {boolean}
   */
		hasFixedLeftColumns: function () {
			return this.fixedLeftColumns > 0;
		},
		/**
   * has fixed right columns or not
   * @returns {boolean}
   */
		hasFixedRightColumns: function () {
			return this.fixedRightColumns > 0;
		},
		/**
   * check the table is addable or not
   * @returns {boolean}
   */
		isAddable: function () {
			return this.getComponentOption("addable") && !this.isViewMode();
		},
		/**
   * check the table is editable or not
   * @returns {boolean}
   */
		isEditable: function () {
			return this.getComponentOption("editable");
		},
		getRowEditButtonEnabled: function () {
			return this.getComponentOption('rowEditEnabled');
		},
		/**
   * check the table is removable or not
   * @returns {boolean}
   */
		isRemovable: function () {
			return this.getComponentOption("removable") && !this.isViewMode();
		},
		getRowRemoveButtonEnabled: function () {
			return this.getComponentOption('rowRemoveEnabled');
		},
		isDownloadable: function () {
			var downloadable = this.getComponentOption('downloadable');
			if (downloadable != null) {
				return downloadable;
			} else {
				return NTable.DOWNLOADABLE;
			}
		},
		/**
   * check the table is searchable or not
   * @returns {boolean}
   */
		isSearchable: function () {
			return this.getComponentOption("searchable");
		},
		/**
   * check the table is indexable or not
   * @returns {boolean}
   */
		isIndexable: function () {
			return this.getComponentOption("indexable");
		},
		/**
   * check the row can be selectable or not
   * @returns {boolean}
   */
		isRowSelectable: function () {
			if (this.isViewMode()) {
				return false;
			}
			return this.getComponentOption('rowSelectable');
		},
		/**
   * check the table is pageable or not
   * @returns {boolean}
   */
		isPageable: function () {
			return this.getComponentOption("pageable");
		},
		/**
   * check the table heading is displayed or not
   * @returns {*}
   */
		isHeading: function () {
			return this.getComponentOption('header');
		},
		isCollapsible: function () {
			return this.getComponentOption('collapsible');
		},
		isExpanded: function () {
			if (this.state.expanded === undefined) {
				this.state.expanded = this.getComponentOption('expanded');
			}
			return this.state.expanded;
		},
		/**
   * check the column is sortable or not
   * @param column if no passed, check the table
   * @returns {boolean}
   */
		isSortable: function (column) {
			if (column === undefined) {
				return this.getComponentOption("sortable");
			} else if (this.isSortable()) {
				// check the table option
				if (column.sort === false) {
					// if column is defined as not sortable, return false
					return false;
				} else {
					return !(column.editable || column.removable || column.indexable || column.rowSelectable || column.rowOperations != null);
				}
			} else {
				// even table is not sortable, the special column can be sortable
				return column.sort;
			}
		},
		/**
   * get sorter
   * @returns {function}
   */
		getSorter: function () {
			return this.getComponentOption('sorter');
		},
		/**
   * check has data to display or not
   * @returns {boolean}
   */
		hasDataToDisplay: function () {
			var data = this.getDataToDisplay();
			return data != null && data.length > 0;
		},
		/**
   * get display text of given column configuration
   * @param column column configuration
   * @param data row data
   * @return display text
   */
		getDisplayTextOfColumn: function (column, data) {
			var text = null;
			if (column.render) {
				text = column.render(data);
			} else if (column.codes) {
				text = column.codes.getText($pt.getValueFromJSON(data, column.data));
			} else {
				text = $pt.getValueFromJSON(data, column.data);
			}
			if (typeof text === "boolean") {
				if (text === true) {
					return NTable.BOOLEAN_TRUE_DISPLAY_TEXT;
				} else if (text === false) {
					return NTable.BOOLEAN_FALSE_DISPLAY_TEXT;
				}
			}
			return text == null ? null : text.toString();
		},
		/**
   * filter data to display
   * @param row
   * @param rowIndex
   * @param all
   * @returns {boolean} true means data of row can match the search text
   */
		filterData: function (row, rowIndex, all) {
			var text = this.state.searchText.toUpperCase();
			// do not use this.column, it maybe add index or operation columns
			var columns = this.getComponentOption("columns");
			var _this = this;
			return columns.some(function (column) {
				var data = _this.getDisplayTextOfColumn(column, row);
				if (data == null) {
					return false;
				}
				return data.toString().toUpperCase().indexOf(text) != -1;
			});
		},
		/**
   * get data to display
   * @returns {[*]}
   */
		getDataToDisplay: function () {
			var data = this.getValueFromModel();
			if (data == null) {
				return data;
			}
			return this.isSearching() ? data.filter(this.filterData) : data;
		},
		/**
   * is searching
   * @returns {boolean}
   */
		isSearching: function () {
			return this.isSearchable() && this.state.searchText != null && this.state.searchText.length != 0;
		},
		/**
   * is current page all selected
   * @param column {{rowSelectable: string}}
   * @param data {{}[]}
   * @param range {{min: number, max: number}}
   * @returns {boolean}
   */
		isCurrentPageAllSelected: function (column, data, range) {
			var rowIndex = 1;
			return data == null ? false : !data.some(function (row) {
				if (rowIndex >= range.min && rowIndex <= range.max) {
					rowIndex++;
					return row[column.rowSelectable] !== true;
				} else {
					rowIndex++;
					return false;
				}
			});
		},
		onTitleClicked: function () {
			this.state.expanded = !this.state.expanded;
			if (this.state.expanded) {
				$(ReactDOM.findDOMNode(this.refs['table-panel-body'])).slideDown(300);
				$(ReactDOM.findDOMNode(this.refs['add-button'])).show();
			} else {
				$(ReactDOM.findDOMNode(this.refs['table-panel-body'])).slideUp(300);
				$(ReactDOM.findDOMNode(this.refs['add-button'])).hide();
			}
		},
		onCheckAllChanged: function (selected) {
			var monitor = this.getEventMonitor('checkAll');
			if (monitor) {
				monitor.call(this, selected);
			}
		},
		/**
   * on add button clicked
   */
		onAddClicked: function () {
			var data = $pt.cloneJSON(this.getComponentOption("modelTemplate"));
			var itemModel = this.createEditingModel(data);
			var layout = this.getComponentOption("editLayout");

			var addClick = this.getComponentOption('addClick');
			if (addClick) {
				addClick.call(this, this.getModel(), itemModel, layout);
			} else {
				this.getEditDialog().show({
					model: itemModel,
					layout: $pt.createFormLayout(layout),
					buttons: {
						right: [{
							icon: NTable.EDIT_DIALOG_SAVE_BUTTON_ICON,
							text: NTable.EDIT_DIALOG_SAVE_BUTTON_TEXT,
							style: "primary",
							click: this.onAddCompleted
						}],
						reset: this.getComponentOption('dialogResetVisible'),
						validate: this.getComponentOption('dialogValidateVisible')
					}
				});
			}
		},
		/**
   * on add completed
   */
		onAddCompleted: function () {
			var hasError = false;
			var editDialog = this.getEditDialog();
			if (this.getComponentOption('onAddSave')) {
				hasError = this.getComponentOption('onAddSave').call(this, editDialog.getModel(), editDialog) === false;
			} else {
				hasError = editDialog.validate();
			}
			if (!hasError) {
				var data = editDialog.hide();
				this.getModel().add(this.getDataId(), data.getCurrentModel());
			}
		},
		/**
   * on edit button clicked
   * @param data {*} data of row
   */
		onEditClicked: function (data) {
			var itemModel = this.createEditingModel(data);
			var layout = this.getComponentOption("editLayout");

			var editClick = this.getComponentOption('editClick');
			if (editClick) {
				editClick.call(this, this.getModel(), itemModel, layout);
			} else {
				this.getEditDialog().show({
					model: itemModel,
					layout: $pt.createFormLayout(layout),
					buttons: {
						right: [{
							icon: NTable.EDIT_DIALOG_SAVE_BUTTON_ICON,
							text: NTable.EDIT_DIALOG_SAVE_BUTTON_TEXT,
							style: "primary",
							click: this.onEditCompleted,
							// show save when editing
							view: 'edit'
						}],
						reset: this.getComponentOption('dialogResetVisible'),
						validate: this.getComponentOption('dialogValidateVisible'),
						// use default cancel behavior when editing
						// simply hide dialog when in view mode
						cancel: this.isViewMode() ? function (model, hide) {
							hide();
						} : true
					},
					view: this.isViewMode()
				});
			}
		},
		/**
   * on edit completed
   */
		onEditCompleted: function () {
			var hasError = false;
			var editDialog = this.getEditDialog();
			if (this.getComponentOption('onEditSave')) {
				hasError = this.getComponentOption('onEditSave').call(this, editDialog.getModel(), editDialog) === false;
			} else {
				hasError = editDialog.validate();
			}
			if (!hasError) {
				var data = this.getEditDialog().hide();
				var original = data.getOriginalModel();
				var current = data.getCurrentModel();
				this.getModel().update(this.getDataId(), original, current);
			}
		},
		/**
   * on remove button clicked
   * @param data {*} data of row
   */
		onRemoveClicked: function (data) {
			var removeRow = function (data) {
				var canRemove = this.getComponentOption('canRemove');
				if (!canRemove || canRemove.call(this, this.getModel(), data)) {
					this.getModel().remove(this.getDataId(), data);
				}
				$pt.Components.NConfirm.getConfirmModal().hide();
			};
			$pt.Components.NConfirm.getConfirmModal().show(NTable.REMOVE_CONFIRM_TITLE, NTable.REMOVE_CONFIRM_MESSAGE, removeRow.bind(this, data));
		},
		/**
   * on row user defined operation clicked
   * @param callback
   * @param rowModel
   */
		onRowOperationClicked: function (callback, rowModel) {
			callback.call(this, rowModel.getCurrentModel(), rowModel);
		},
		/**
   * on download clicked
   */
		onDownloadClicked: function () {
			var data = null;
			var queryCriteria = this.getQuerySettings();
			if (queryCriteria === null) {
				// no query criteria, all data is on local
				data = this.getValueFromModel();
				this.exposeDownloading(data);
			} else {
				var model = this.getModel();
				var criteria = model.get(queryCriteria);
				criteria = $.extend({}, criteria);
				var url = criteria.url;
				delete criteria.url;
				delete criteria.pageCount;
				criteria.pageIndex = -1;
				if (NTable.PAGE_JUMPING_PROXY) {
					criteria = NTable.PAGE_JUMPING_PROXY.call(this, criteria);
				}
				var downloadListener = this.getEventMonitor('download');
				if (downloadListener) {
					this.notifyEvent({
						type: 'download',
						criteria: criteria,
						target: this
					});
				} else {
					var _this = this;
					$pt.internalDoPost(url, criteria).done(function (data) {
						if (typeof data === 'string') {
							data = JSON.parse(data);
						}
						if (NTable.PAGE_JUMPING_PROXY_CALLBACK) {
							data = NTable.PAGE_JUMPING_PROXY_CALLBACK.call(_this, data, _this.getDataId());
						}
						var rows = null;
						if (data && data[_this.getDataId()]) {
							rows = data[_this.getDataId()];
						} else {
							rows = [];
						}
						_this.exposeDownloading(rows);
					});
				}
				// todo how to handle failure?
			}
		},
		exposeDownloading: function (data) {
			if (data == null || data.length == 0) {
				NConfirm.getConfirmModal().show({
					title: NTable.NO_DATA_DOWNLOAD_TITLE,
					messages: NTable.NO_DATA_DOWNLOAD,
					disableConfirm: true,
					close: true
				});
			} else {
				this.tableToExcel(data);
			}
		},
		tableToExcel: function (data) {
			//creating a temporary HTML link element (they support setting file names)
			var a = document.createElement('a');
			//getting data from our div that contains the HTML table
			var dataType = 'data:application/vnd.ms-excel';
			var tableHeaderHtml = this.generateTableExcelHeader();
			var tableBodyHtml = '<tbody>' + data.map(this.generateTableExcelBodyRow).join('') + '</tbody>';
			var tableHtml = '<table>' + tableHeaderHtml + tableBodyHtml + '</table>';
			tableHtml = tableHtml.replace(/ /g, '%20');
			a.href = dataType + ', ' + tableHtml;
			//setting the file name
			a.download = 'exported_data.xls';
			//triggering the function
			a.click();
		},
		generateTableExcelHeader: function () {
			var columns = this.state.columns.map(function (column) {
				if (!(column.visible === undefined || column.visible === true)) {
					return '';
				}
				if (column.editable || column.removable || column.rowOperations != null) {
					return '';
				} else if (column.indexable) {
					return '';
				} else if (column.rowSelectable) {
					return '';
				} else {
					return '<td>' + column.title + '</td>';
				}
			});
			return '<thead><tr>' + columns.join('') + '</tr></thead>';
		},
		generateTableExcelBodyRow: function (row) {
			var _this = this;
			var columns = this.state.columns.map(function (column) {
				if (!(column.visible === undefined || column.visible === true)) {
					return '';
				}
				if (column.editable || column.removable || column.rowOperations != null) {
					return '';
				} else if (column.indexable) {
					return '';
				} else if (column.rowSelectable) {
					return '';
				} else {
					// data is property name
					var data = _this.getDisplayTextOfColumn(column, row);
					return '<td>' + (data == null ? '' : data) + '</td>';
				}
			});
			return '<tr>' + columns.join('') + '</tr>';
		},
		/**
   * on search box changed
   */
		onSearchBoxChanged: function () {
			var value = this.state.searchModel.get('text');
			// window.console.debug('Searching [text=' + value + '].');
			if (value == null || value == "") {
				this.setState({
					searchText: null
				});
			} else {
				this.setState({
					searchText: value
				});
			}
		},
		/**
   * on sort icon clicked
   * @param column
   */
		onSortClicked: function (column) {
			var valueArray = this.getValueFromModel();
			if (valueArray == null) {
				return;
			}

			var sortWay = "asc";
			if (this.state.sortColumn == column) {
				// the column is sorted, so set sortWay as another
				sortWay = this.state.sortWay == "asc" ? "desc" : "asc";
			}
			// if global sorter defined
			var sorter = this.getSorter();
			if (sorter) {
				sorter.call(this, {
					mode: sortWay,
					column: column,
					data: valueArray,
					criteria: this.getQuerySettings()
				});
				this.setState({
					sortColumn: column,
					sortWay: sortWay
				});
				return;
			}

			var isNumberValue = false;
			// specific sort
			if (column.sort !== undefined && column.sort != null) {
				if (typeof column.sort === "function") {
					sorter = column.sort;
				} else if (column.sort === "number") {
					isNumberValue = true;
				} else if (typeof column.sort === 'boolean') {
					// do nothing, use default sorter
				} else {
					throw $pt.createComponentException($pt.ComponentConstants.Err_Unuspported_Column_Sort, "Column sort [" + column.sort + "] is not supported yet.");
				}
			}
			var _this = this;
			// if no sorter specific in column
			sorter = sorter == null ? function (a, b) {
				var v1 = _this.getDisplayTextOfColumn(column, a);
				var v2 = _this.getDisplayTextOfColumn(column, b);
				if (v1 == null) {
					return v2 == null ? 0 : -1;
				} else if (v2 == null) {
					return 1;
				} else {
					if (isNumberValue) {
						// parse to number value
						v1 *= 1;
						v2 *= 1;
					}
					if (v1 > v2) {
						return 1;
					} else if (v1 < v2) {
						return -1;
					} else {
						return 0;
					}
				}
			} : sorter;

			if (sortWay == "asc") {
				valueArray.sort(sorter);
			} else {
				valueArray.sort(function (a, b) {
					return 0 - sorter(a, b);
				});
			}
			this.setState({
				sortColumn: column,
				sortWay: sortWay
			});
		},
		/**
   * create edit dialog
   * @returns {*}
   */
		getEditDialog: function () {
			if (this.state.editDialog === undefined || this.state.editDialog === null) {
				this.state.editDialog = $pt.Components.NModalForm.createFormModal(this.getLayout().getLabel(this));
			}
			return this.state.editDialog;
		},
		/**
   * create editing model
   * @param item
   */
		createEditingModel: function (item) {
			// var modelValidator = this.getModel().getValidator();
			// var tableValidator = modelValidator ? modelValidator.getConfig()[this.getDataId()] : null;
			// var itemValidator = tableValidator ? $pt.createModelValidator(tableValidator.table) : null;
			// var editModel = $pt.createModel(item, itemValidator);
			// editModel.parent(this.getModel());
			// return editModel;
			return this.createRowModel(item, false);
		},
		/**
   * on model change
   * @param evt
   */
		onModelChanged: function (evt) {
			if (evt.type == "add") {
				this.computePagination(this.getDataToDisplay());
				this.state.currentPageIndex = this.state.pageCount;
			} else if (evt.type == "remove") {
				// do nothing
			} else if (evt.type == "change") {
				// do nothing
				// window.console.log('Table[' + this.getDataId() + '] data changed.');
			}

			if (this.getModel().getValidator() != null) {
				this.getModel().validate(this.getDataId());
			} else {
				this.forceUpdate();
			}
		},
		/**
   * jump to page by given page index
   * @param pageIndex
   */
		toPage: function (pageIndex) {
			if (this.state.currentPageIndex == pageIndex) {
				// do nothing
				return;
			}
			var queryCriteria = this.getQuerySettings();
			if (queryCriteria === null) {
				// no query criteria
				this.setState({
					currentPageIndex: pageIndex
				});
			} else {
				var _this = this;
				var model = this.getModel();
				var criteria = model.get(queryCriteria);
				criteria = $.extend({}, criteria);
				var url = criteria.url;
				delete criteria.url;
				delete criteria.pageCount;
				criteria.pageIndex = pageIndex;
				if (NTable.PAGE_JUMPING_PROXY) {
					criteria = NTable.PAGE_JUMPING_PROXY.call(this, criteria);
				}
				var pageChangeListener = this.getEventMonitor('pageChange');
				if (pageChangeListener) {
					this.notifyEvent({
						type: 'pageChange',
						criteria: criteria,
						target: this
					});
				} else {
					$pt.internalDoPost(url, criteria).done(function (data) {
						if (typeof data === 'string') {
							data = JSON.parse(data);
						}
						if (NTable.PAGE_JUMPING_PROXY_CALLBACK) {
							data = NTable.PAGE_JUMPING_PROXY_CALLBACK.call(_this, data, _this.getDataId());
						}
						model.mergeCurrentModel(data);
						// refresh
						_this.forceUpdate();
						// _this.setState({
						// 	currentPageIndex: pageIndex
						// });
					});
				}
				// todo how to handle failure?
			}
		},
		getDivComponent: function () {
			return $(ReactDOM.findDOMNode(this.refs.div));
		},
		getComponent: function () {
			return $(ReactDOM.findDOMNode(this.refs.table));
		},
		/**
   * get header label id
   * @returns {string}
   */
		getHeaderLabelId: function () {
			return "n-table-header-label";
		},
		getScrollHeaderComponent: function () {
			if (this.refs[this.getScrolledHeaderDivId()]) {
				return $(ReactDOM.findDOMNode(this.refs[this.getScrolledHeaderDivId()]));
			} else {
				return $("#___");
			}
		},
		/**
   * get scrolled header div id
   * @returns {string}
   */
		getScrolledHeaderDivId: function () {
			return "n-table-scrolled-head";
		},
		getScrollBodyComponent: function () {
			if (this.refs[this.getScrolledBodyDivId()]) {
				return $(ReactDOM.findDOMNode(this.refs[this.getScrolledBodyDivId()]));
			} else {
				return $("#___");
			}
		},
		/**
   * get scrolled body div id
   * @returns {string}
   */
		getScrolledBodyDivId: function () {
			return "n-table-scrolled-body";
		},
		getFixedLeftBodyComponent: function () {
			if (this.refs[this.getFixedLeftBodyDivId()]) {
				return $(ReactDOM.findDOMNode(this.refs[this.getFixedLeftBodyDivId()]));
			} else {
				return $("#___");
			}
		},
		/**
   * get scrolled fixed left body div id
   * @returns {string}
   */
		getFixedLeftBodyDivId: function () {
			return "n-table-scrolled-left-body";
		},
		getFixedRightBodyComponent: function () {
			if (this.refs[this.getFixedRightBodyDivId()]) {
				return $(ReactDOM.findDOMNode(this.refs[this.getFixedRightBodyDivId()]));
			} else {
				return $("#___");
			}
		},
		/**
   * get scrolled fixed right body div id
   * @returns {string}
   */
		getFixedRightBodyDivId: function () {
			return "n-table-scrolled-right-body";
		},
		/**
   * clear columns definition
   */
		clearColumnsDefinition: function () {
			this.state.columns = null;
			this.forceUpdate();
		}
	}));
	$pt.Components.NTable = NTable;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.Table, function (model, layout, direction, viewMode) {
		return React.createElement($pt.Components.NTable, $pt.LayoutHelper.transformParameters(model, layout, direction, viewMode));
	});
})(window, jQuery, React, ReactDOM, $pt);

(function (window, $, React, ReactDOM, $pt) {
	var NText = React.createClass($pt.defineCellComponent({
		displayName: 'NText',
		statics: {
			NUMBER_FORMAT: function (value) {
				var parts = (value + '').split('.');
				var integral = parts[0];
				var fraction = parts.length > 1 ? '.' + parts[1] : '';
				var rgx = /(\d+)(\d{3})/;
				while (rgx.test(integral)) {
					integral = integral.replace(rgx, '$1' + ',' + '$2');
				}
				return integral + fraction;
			},
			PERCENTAGE: {
				model: function (value) {
					return isNaN(value) || (value + '').isBlank() ? value : (value + '').movePointLeft(2);
				},
				view: function (value) {
					return isNaN(value) || (value + '').isBlank() ? value : (value + '').movePointRight(2);
				}
			},
			TRIM: false,
			DELAY: 300
		},
		getDefaultProps: function () {
			return {
				defaultOptions: {}
			};
		},
		afterWillUpdate: function (nextProps) {
			this.getComponent().off('change', this.onChange);
			this.uninstallOtherDOMListeners();
		},
		/**
   * did update
   * @param prevProps
   * @param prevState
   */
		beforeDidUpdate: function (prevProps, prevState) {
			var formattedValue = this.getValueFromModel();
			if (!$(ReactDOM.findDOMNode(this.refs.focusLine)).hasClass('focus')) {
				formattedValue = this.getFormattedValue(formattedValue);
			}
			if (this.getComponent().val() != formattedValue) {
				this.getComponent().val(formattedValue);
			}
		},
		afterDidUpdate: function () {
			this.getComponent().on('change', this.onChange);
			this.installOtherDOMListeners();
		},
		beforeDidMount: function () {
			// set model value to component
			this.getComponent().val(this.getFormattedValue(this.getValueFromModel()));
		},
		afterDidMount: function () {
			this.getComponent().on('change', this.onChange);
			this.installOtherDOMListeners();
		},
		afterWillUnmount: function () {
			this.getComponent().off('change', this.onChange);
			this.uninstallOtherDOMListeners();
		},
		installOtherDOMListeners: function () {
			var listeners = this.getEventMonitor();
			Object.keys(listeners).filter(function (name) {
				return ['change', 'blur', 'focus', 'keyPress', 'keyUp'].indexOf(name) < 0;
			}).forEach(function (name) {
				this.getComponent().on(name, listeners[name].bind(this));
			}.bind(this));
		},
		uninstallOtherDOMListeners: function () {
			var listeners = this.getEventMonitor();
			Object.keys(listeners).filter(function (name) {
				return ['change', 'blur', 'focus', 'keyPress', 'keyUp'].indexOf(name) < 0;
			}).forEach(function (name) {
				this.getComponent().off(name);
			}.bind(this));
		},
		/**
   * render left add-on
   * @returns {XML}
   */
		renderLeftAddon: function () {
			return this.renderAddon(this.getComponentOption('leftAddon'));
		},
		/**
   * render text
   * @returns {XML}
   */
		renderText: function () {
			// TODO needs to handle the control keys
			var css = {
				'form-control': true
			};
			var textType = 'text';
			var isPassword = this.getComponentOption('pwd', false);
			if (isPassword) {
				textType = 'password';
			}
			var specialType = this.getComponentOption('textType');
			if (specialType) {
				textType = specialType;
			}
			return React.createElement('input', { type: textType,
				className: $pt.LayoutHelper.classSet(css),
				disabled: !this.isEnabled(),
				placeholder: this.getComponentOption('placeholder'),
				maxLength: this.getComponentOption('maxlength'),

				onKeyPress: this.onKeyPress,
				onChange: this.onChange,
				onFocus: this.onComponentFocused,
				onBlur: this.onComponentBlurred,
				onKeyUp: this.onKeyUp,

				ref: 'txt' });
		},
		/**
   * render right add-on
   * @returns {XML}
   */
		renderRightAddon: function () {
			return this.renderAddon(this.getComponentOption('rightAddon'));
		},
		/**
   * render add-on
   * @param addon {{
  *              icon: string,
  *              text: string,
  *              iconFirst: boolean,
  *              click: function(model: object, value: object)
  *              }}
   * @returns {XML}
   */
		renderAddon: function (addon) {
			if (addon == null) {
				return null;
			}

			var spanCss = {
				'input-group-addon': true,
				link: addon.click != null,
				disabled: !this.isEnabled()
			};

			var iconCss = {
				fa: true,
				'fa-fw': true
			};
			var icon = addon.icon;
			if (icon != null) {
				iconCss['fa-' + icon] = true;
			}
			var iconPart = icon == null ? null : React.createElement('span', { className: $pt.LayoutHelper.classSet(iconCss), key: 'iconPart' });
			var textPart = addon.text;
			var innerParts = addon.iconFirst === false ? [textPart, iconPart] : [iconPart, textPart];
			return React.createElement(
				'span',
				{ className: $pt.LayoutHelper.classSet(spanCss),
					onClick: this.onAddonClicked.bind(this, addon.click) },
				innerParts.map(function (part) {
					return part;
				})
			);
		},
		/**
   * render
   * @returns {XML}
   */
		render: function () {
			if (this.isViewMode()) {
				return this.renderInViewMode();
			}
			var css = {
				'n-disabled': !this.isEnabled()
			};
			css[this.getComponentCSS('n-text')] = true;
			return React.createElement(
				'div',
				{ className: $pt.LayoutHelper.classSet(css) },
				React.createElement(
					'div',
					{ className: 'input-group' },
					this.renderLeftAddon(),
					this.renderText(),
					this.renderRightAddon()
				),
				this.renderNormalLine(),
				this.renderFocusLine()
			);
		},
		onComponentFocused: function (evt) {
			$(ReactDOM.findDOMNode(this.refs.focusLine)).toggleClass('focus');
			$(ReactDOM.findDOMNode(this.refs.normalLine)).toggleClass('focus');

			var value = this.getValueFromModel();
			if (value == this.getComponent().val()) {} else {
				this.getComponent().val(value);
			}
			// window.console.log("focused: " + this.getValueFromModel());

			this.notifyEvent(evt);
		},
		onComponentBlurred: function (evt) {
			$(ReactDOM.findDOMNode(this.refs.focusLine)).toggleClass('focus');
			$(ReactDOM.findDOMNode(this.refs.normalLine)).toggleClass('focus');

			// if (this.state.componentChanged) {
			// 	clearTimeout(this.state.componentChanged);
			// }
			var value = evt.target.value;
			if (this.getComponentOption('trim', NText.TRIM)) {
				value = value == null ? null : (value + '').trim();
			}
			if (value && !value.isBlank()) {
				var formattedValue = this.getFormattedValue(value);
				if (formattedValue != value) {
					// window.console.debug('Change component display formatted value when onBlur.');
					this.getComponent().val(formattedValue);
				}
			}
			if (!this.textEquals(value, this.getValueFromModel())) {
				this.setValueToModel(value);
			}
			this.notifyEvent(evt);
		},
		hasText: function (value) {
			return value != null && !(value + '').isEmpty();
		},
		textEquals: function (v1, v2) {
			var hasText1 = this.hasText(v1);
			var hasText2 = this.hasText(v2);
			if (hasText1) {
				var strV1 = v1 + '';
				var strV2 = v2 + '';
				return strV1 === strV2;
			} else {
				return !hasText2;
			}
			//return hasText1 ? ((v1 + '') === (v2 + '')) : !hasText2;
		},
		textChanged: function (newValue) {
			var oldValue = this.getValueFromModel();
			if (!this.textEquals(newValue, oldValue)) {
				this.setValueToModel(newValue);
			}
		},
		onChange: function (evt) {
			this.onComponentChanged(evt);
			this.notifyEvent(evt);
		},
		/**
   * on component change
   * @param evt
   */
		onComponentChanged: function (evt) {
			// console.debug('Text component changed[modelValue=' + this.getValueFromModel() + ', compValue=' + evt.target.value + '].');
			if (NText.DELAY === 0) {
				this.textChanged(evt.target.value);
			} else {
				if (this.state.textChangeHandler) {
					clearTimeout(this.state.textChangeHandler);
					delete this.state.textChangeHandler;
				}
				var newValue = evt.target.value;
				this.state.textChangeHandler = setTimeout(function () {
					this.textChanged(newValue);
				}.bind(this), NText.DELAY);
			}
		},
		onKeyPress: function (evt) {
			this.onComponentChanged(evt);
			this.notifyEvent(evt);
		},
		onKeyUp: function (evt) {
			this.notifyEvent(evt);
		},
		/**
   * on addon clicked
   * @param userDefinedClickFunc
   */
		onAddonClicked: function (userDefinedClickFunc) {
			if (this.isAddonClickable(userDefinedClickFunc)) {
				userDefinedClickFunc.call(this, this.getModel(), this.getValueFromModel());
			}
		},
		/**
   * get component
   * @returns {jQuery}
   * @override
   */
		getComponent: function () {
			return $(ReactDOM.findDOMNode(this.refs.txt));
		},
		/**
   * is add-on clickable
   * @param userDefinedClickFunc
   * @returns {*}
   */
		isAddonClickable: function (userDefinedClickFunc) {
			return this.isEnabled() && userDefinedClickFunc;
		},
		getTextFormat: function () {
			return this.getComponentOption('format');
		},
		getFormattedValue: function (value) {
			if (value) {
				if (typeof value === 'number') {
					value = value + '';
				}
				if (!value.isBlank()) {
					var format = this.getTextFormat();
					if (format) {
						var formatValue = value;
						if (format == 'currency') {
							var fraction = this.getComponentOption('fraction');
							fraction = fraction ? fraction * 1 : 0;
							formatValue = value.currencyFormat(fraction);
						} else {
							formatValue = format.call(this, value);
						}
						return formatValue;
					}
				}
			}
			return value;
		},
		getTextConvertor: function () {
			return this.getComponentOption('transformer') || this.getComponentOption('convertor');
		},
		getValueFromModel: function () {
			var value = this.getModel().get(this.getDataId());
			var convertor = this.getTextConvertor();
			if (convertor && convertor.view) {
				return convertor.view.call(this, value);
			} else {
				return value;
			}
		},
		setValueToModel: function (value) {
			var convertor = this.getTextConvertor();
			if (convertor && convertor.model) {
				this.getModel().set(this.getDataId(), convertor.model.call(this, value));
			} else {
				this.getModel().set(this.getDataId(), value);
			}
		},
		getTextInViewMode: function () {
			return this.getModel().get(this.getDataId());
		}
	}));
	$pt.Components.NText = NText;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.Text, function (model, layout, direction, viewMode) {
		return React.createElement($pt.Components.NText, $pt.LayoutHelper.transformParameters(model, layout, direction, viewMode));
	});
})(window, jQuery, React, ReactDOM, $pt);

(function (window, $, React, ReactDOM, $pt) {
	var NTextArea = React.createClass($pt.defineCellComponent({
		displayName: 'NTextArea',
		getDefaultProps: function () {
			return {
				defaultOptions: {
					lines: 1
				}
			};
		},
		afterWillUpdate: function (nextProps) {
			this.getComponent().off('change', this.onComponentChanged);
		},
		beforeDidUpdate: function (prevProps, prevState) {
			if (this.getComponent().val() != this.getValueFromModel()) {
				this.getComponent().val(this.getValueFromModel());
			}
		},
		afterDidUpdate: function () {
			this.getComponent().on('change', this.onComponentChanged);
		},
		/**
   * did mount
   */
		beforeDidMount: function () {
			// set model value to component
			this.getComponent().val(this.getValueFromModel());
		},
		afterDidMount: function () {
			this.getComponent().on('change', this.onComponentChanged);
		},
		/**
   * will unmount
   */
		afterWillUnmount: function () {
			this.getComponent().off('change', this.onComponentChanged);
		},
		/**
   * render text
   * @returns {XML}
   */
		renderText: function () {
			var css = {
				'form-control': true
			};
			css['l' + this.getComponentOption('lines')] = true;
			return React.createElement('textarea', { className: $pt.LayoutHelper.classSet(css),
				disabled: !this.isEnabled(),
				placeholder: this.getComponentOption('placeholder'),

				onKeyPress: this.onComponentChanged,
				onChange: this.onComponentChanged,
				onFocus: this.onComponentFocused,
				onBlur: this.onComponentBlurred,

				ref: 'txt' });
		},
		/**
   * render
   * @returns {XML}
   */
		render: function () {
			if (this.isViewMode()) {
				return this.renderInViewMode();
			}
			var css = {
				'n-disabled': !this.isEnabled()
			};
			css[this.getComponentCSS('n-textarea')] = true;
			return React.createElement(
				'div',
				{ className: $pt.LayoutHelper.classSet(css) },
				this.renderText(),
				this.renderNormalLine(),
				this.renderFocusLine()
			);
		},
		onComponentFocused: function () {
			$(ReactDOM.findDOMNode(this.refs.focusLine)).toggleClass('focus');
			$(ReactDOM.findDOMNode(this.refs.normalLine)).toggleClass('focus');
		},
		onComponentBlurred: function () {
			$(ReactDOM.findDOMNode(this.refs.focusLine)).toggleClass('focus');
			$(ReactDOM.findDOMNode(this.refs.normalLine)).toggleClass('focus');
		},
		/**
   * on component change
   * @param evt
   */
		onComponentChanged: function (evt) {
			this.setValueToModel(evt.target.value);
		},
		/**
   * on addon clicked
   * @param userDefinedClickFunc
   */
		onAddonClicked: function (userDefinedClickFunc) {
			if (userDefinedClickFunc) {
				userDefinedClickFunc.call(this, this.getModel(), this.getValueFromModel());
			}
		},
		/**
   * get component
   * @returns {jQuery}
   * @override
   */
		getComponent: function () {
			return $(ReactDOM.findDOMNode(this.refs.txt));
		},
		getTextInViewMode: function () {
			var value = this.getValueFromModel();
			if (value != null) {
				value = value.split(/\r|\n/);
			}
			return value;
		}
	}));
	$pt.Components.NTextArea = NTextArea;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.TextArea, function (model, layout, direction, viewMode) {
		return React.createElement($pt.Components.NTextArea, $pt.LayoutHelper.transformParameters(model, layout, direction, viewMode));
	});
})(window, jQuery, React, ReactDOM, $pt);

/**
 * Created by brad.wu on 8/21/2015.
 */
(function (window, $, React, ReactDOM, $pt) {
	var NToggle = React.createClass($pt.defineCellComponent({
		displayName: 'NToggle',
		beforeDidUpdate: function (prevProps, prevState) {
			// set model value to component
			this.getComponent().prop("checked", this.getValueFromModel());
		},
		beforeDidMount: function () {
			// set model value to component
			this.getComponent().prop("checked", this.getValueFromModel());
		},
		/**
   * render label
   * @returns {XML}
   */
		renderLabel: function (label, className) {
			var css = {
				'toggle-label': true,
				disabled: !this.isEnabled()
			};
			css[className] = true;
			return React.createElement(
				"span",
				{ className: $pt.LayoutHelper.classSet(css) },
				label
			);
		},
		renderLeftLabel: function () {
			var labelAttached = this.getComponentOption('labelAttached');
			if (labelAttached && labelAttached.left) {
				return this.renderLabel(labelAttached.left, 'toggle-label-left');
			}
		},
		renderRightLabel: function () {
			var labelAttached = this.getComponentOption('labelAttached');
			if (labelAttached && labelAttached.right) {
				return this.renderLabel(labelAttached.right, 'toggle-label-right');
			}
		},
		/**
   * render check box, using font awesome instead
   * @returns {XML}
   */
		renderToggleButton: function () {
			var checked = this.isChecked();
			var css = {
				disabled: !this.isEnabled(),
				checked: checked,
				unchecked: !checked,
				'toggle-container': true
			};
			return React.createElement(
				"div",
				{ className: $pt.LayoutHelper.classSet(css) },
				React.createElement("span", { className: "n-toggle-line" }),
				React.createElement("span", { className: "n-toggle-true",
					tabIndex: this.isEnabled() ? '-1' : null,
					onClick: this.onButtonClicked.bind(this, true) }),
				React.createElement("span", { className: "n-toggle-false",
					tabIndex: this.isEnabled() ? '-1' : null,
					onClick: this.onButtonClicked.bind(this, false) })
			);
		},
		/**
   * render
   * @returns {XML}
   */
		render: function () {
			var css = {
				'n-disabled': !this.isEnabled(),
				'n-view-mode': this.isViewMode()
			};
			css[this.getComponentCSS('n-toggle')] = true;

			return React.createElement(
				"div",
				{ className: $pt.LayoutHelper.classSet(css) },
				React.createElement("input", { type: "checkbox", style: { display: "none" },
					onChange: this.onComponentChanged, ref: "txt" }),
				this.renderLeftLabel(),
				this.renderToggleButton(),
				this.renderRightLabel()
			);
		},
		/**
   * handle button clicked event
   */
		onButtonClicked: function (value) {
			if (this.isEnabled() && !this.isViewMode()) {
				this.setValueToModel(value);
			}
		},
		/**
   * on component change
   * @param evt
   */
		onComponentChanged: function (evt) {
			// synchronize value to model
			this.setValueToModel(evt.target.checked);
		},
		/**
   * on model change
   * @param evt
   */
		onModelChanged: function (evt) {
			this.getComponent().prop("checked", evt.new === true);
			this.forceUpdate();
		},
		/**
   * is checked or not
   * @returns {boolean}
   */
		isChecked: function () {
			return this.getValueFromModel() === true;
		},
		/**
   * get component
   * @returns {jQuery}
   */
		getComponent: function () {
			return $(ReactDOM.findDOMNode(this.refs.txt));
		}
	}));
	$pt.Components.NToggle = NToggle;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.Toggle, function (model, layout, direction, viewMode) {
		return React.createElement($pt.Components.NToggle, $pt.LayoutHelper.transformParameters(model, layout, direction, viewMode));
	});
})(window, jQuery, React, ReactDOM, $pt);

(function (window, $, React, ReactDOM, $pt) {
	var NTree = React.createClass($pt.defineCellComponent({
		displayName: 'NTree',
		statics: {
			ROOT_LABEL: 'Root',
			FOLDER_ICON: 'folder-o',
			FOLDER_OPEN_ICON: 'folder-open-o',
			FILE_ICON: 'file-o',
			OP_FOLDER_LEAF_ICON: 'angle-right',
			OP_FOLDER_ICON: 'angle-double-right',
			OP_FOLDER_OPEN_ICON: 'angle-double-down',
			OP_FILE_ICON: '',
			NODE_SEPARATOR: ';',
			ROOT_ID: '0',
			convertValueTreeToArray: function (nodeValues, id) {
				var array = [];
				var push = function (node, id) {
					Object.keys(node).forEach(function (key) {
						if (key == 'selected' && node[key]) {
							if (id != NTree.ROOT_ID) {
								array.push(id);
							} else {
								array.selected = node.selected ? true : undefined;
							}
						} else {
							push(node[key], key);
						}
					});
				};
				push(nodeValues, id);
				return array;
			}
		},
		getDefaultProps: function () {
			return {
				defaultOptions: {
					root: true,
					check: false,
					inactiveSlibing: true,
					opIconEnabled: false,
					multiple: true,
					valueAsArray: false,
					hierarchyCheck: false,
					expandLevel: 1,
					border: false,
					expandButton: {
						comp: {
							icon: 'plus-square-o',
							style: 'link'
						}
					},
					collapseButton: {
						comp: {
							icon: 'minus-square-o',
							style: 'link'
						}
					}
				}
			};
		},
		getInitialState: function () {
			var expandBtn = $.extend(true, {}, this.getComponentOption('expandButton'));
			if (expandBtn) {
				if (!expandBtn.comp.click) {
					expandBtn.comp.click = this.expandAll;
				}
				expandBtn = $pt.createCellLayout('expand', expandBtn);
			}
			var collapseBtn = $.extend(true, {}, this.getComponentOption('collapseButton'));
			if (collapseBtn) {
				if (!collapseBtn.comp.click) {
					collapseBtn.comp.click = this.collapseAll;
				}
				collapseBtn = $pt.createCellLayout('collapse', collapseBtn);
			}
			return {
				activeNodes: {},
				root: { text: this.getRootLabel(), id: NTree.ROOT_ID },
				expandButton: expandBtn,
				collapseButton: collapseBtn
			};
		},
		renderCheck: function (node, nodeId) {
			var canSelected = this.isNodeCanSelect(node);
			if (!canSelected) {
				return null;
			}
			var modelValue = this.getValueFromModel();
			modelValue = modelValue ? modelValue : {};
			var model = $pt.createModel({ selected: this.isNodeChecked(nodeId) });
			model.useBaseAsCurrent();
			var layoutJSON = {
				comp: {
					type: $pt.ComponentConstants.Check
				}
			};
			var valueCanChange = this.isNodeCheckCanChange(node);
			if (valueCanChange != null) {
				layoutJSON.comp.enabled = valueCanChange;
			}
			var layout = $pt.createCellLayout('selected', layoutJSON);
			model.addPostChangeListener('selected', this.onNodeCheckChanged.bind(this, node, nodeId));
			return React.createElement($pt.Components.NCheck, { model: model, layout: layout, view: this.isViewMode() });
		},
		renderNode: function (parentNodeId, node) {
			var nodeId = this.getNodeId(parentNodeId, node);

			var opIcon = null;
			if (this.getComponentOption('opIconEnabled')) {
				var expandableIconAttrs = {
					iconClassName: 'node-op-icon',
					fixWidth: true,
					icon: this.getNodeOperationIcon(node, nodeId)
				};
				opIcon = React.createElement(
					'a',
					{ href: 'javascript:void(0);',
						onClick: this.onNodeClicked.bind(this, node, nodeId) },
					React.createElement($pt.Components.NIcon, expandableIconAttrs)
				);
			}
			var folderIconAttrs = {
				icon: this.getNodeIcon(node, nodeId),
				fixWidth: true,
				iconClassName: 'node-icon'
			};
			var folderIcon = React.createElement(
				'a',
				{ href: 'javascript:void(0);',
					onClick: this.onNodeClicked.bind(this, node, nodeId) },
				React.createElement($pt.Components.NIcon, folderIconAttrs)
			);

			var _this = this;
			var buttons = this.getComponentOption('nodeOperations');
			buttons = buttons ? Array.isArray(buttons) ? buttons : [buttons] : [];
			buttons = buttons.map(function (button, buttonIndex) {
				var visible = true;
				if (typeof button.visible === 'boolean') {
					visible = button.visible;
				} else if (typeof button.visible === 'function') {
					visible = button.visible.call(_this, node);
				}
				if (!visible) {
					return null;
				}
				var icon = {
					icon: button.icon,
					fixWidth: true
				};
				return React.createElement(
					'a',
					{ href: 'javascript:void(0);',
						onClick: _this.onNodeOperationClicked.bind(_this, node, button.click),
						className: 'node-button',
						key: buttonIndex,
						title: button.text },
					React.createElement($pt.Components.NIcon, icon)
				);
			}).filter(function (button) {
				return button != null;
			});

			var active = this.isActive(nodeId) ? 'active' : null;
			return React.createElement(
				'li',
				{ className: active, key: nodeId, 'data-node-id': nodeId },
				React.createElement(
					'div',
					{ className: 'node-content' },
					opIcon,
					folderIcon,
					this.renderCheck(node, nodeId),
					React.createElement(
						'a',
						{ className: 'node-text-link-' + buttons.length,
							href: 'javascript:void(0);',
							onClick: this.onNodeLabelClicked.bind(this, node, nodeId) },
						React.createElement(
							'span',
							{ className: 'node-text' },
							this.getNodeText(node)
						)
					),
					buttons
				),
				this.getComponentOption('lazyLoad') && !active ? null : this.renderNodes(node, nodeId)
			);
		},
		renderNodes: function (parent, parentNodeId) {
			var children = parent.children;
			if (children && children.length > 0) {
				return React.createElement(
					'ul',
					{ className: 'nav' },
					children.map(this.renderNode.bind(this, parentNodeId))
				);
			} else {
				return null;
			}
		},
		renderRoot: function () {
			return React.createElement(
				'ul',
				{ className: 'nav' },
				this.renderNode(null, this.state.root)
			);
		},
		renderTopLevel: function () {
			return React.createElement($pt.Components.NCodeTableWrapper, { codetable: this.getCodeTable(),
				renderer: this.getRealTopLevelRenderer,
				model: this.getModel(),
				layout: this.getLayout(),
				onMounted: this.initExpand });
		},
		getRealTopLevelRenderer: function () {
			var root = this.state.root;
			root.children = this.getTopLevelNodes();
			return this.isRootPaint() ? this.renderRoot() : this.renderNodes(root, this.getNodeId(null, root));
		},
		renderButtons: function () {
			var expand = this.state.expandButton ? React.createElement($pt.Components.NFormButton, { model: this.getModel(), layout: this.state.expandButton }) : null;
			var collapse = this.state.collapseButton ? React.createElement($pt.Components.NFormButton, { model: this.getModel(), layout: this.state.collapseButton }) : null;
			if (expand || collapse) {
				return React.createElement(
					'span',
					{ className: 'buttons' },
					expand,
					collapse
				);
			} else {
				return null;
			}
		},
		initExpand: function () {
			var expandLevel = this.getComponentOption('expandLevel');
			if (expandLevel == null) {
				// default expand root
				expandLevel = 0;
			}
			if (expandLevel === 'all') {
				expandLevel = 9999;
			}
			if (this.state.root.children) {
				// this.state.root.children = this.getTopLevelNodes();
				this.expandTo(expandLevel);
			}
		},
		render: function () {
			var styles = {};
			if (this.getComponentOption('height')) {
				styles.height = this.getComponentOption('height');
			}
			if (this.getComponentOption('maxHeight')) {
				styles.maxHeight = this.getComponentOption('maxHeight');
			}
			var css = this.getComponentCSS('n-tree');
			if (this.getComponentOption('border')) {
				css += ' border';
			}
			return React.createElement(
				'div',
				{ className: css, style: styles, ref: 'me' },
				this.renderTopLevel(),
				this.renderButtons()
			);
		},
		onNodeClicked: function (node, nodeId) {
			if (!this.isLeaf(node)) {
				if (this.state.activeNodes[nodeId]) {
					this.collapseNode(node, nodeId);
				} else {
					this.expandNode(node, nodeId);
				}
			}
		},
		onNodeLabelClicked: function (node, nodeId, evt) {
			var nodeClick = this.getComponentOption('nodeClick');
			if (nodeClick) {
				var target = $(evt.target);
				var callback = function (keepOtherHighlights) {
					if (!this.isMultipleHighlight() || !keepOtherHighlights) {
						$(ReactDOM.findDOMNode(this.refs.me)).find('div.node-content').removeClass('node-highlight');
					}
					target.closest('div.node-content').addClass('node-highlight');
				}.bind(this);
				var returnValue = nodeClick.call(this, node, callback, evt);
				if (returnValue === true) {
					callback.call(this);
				} else if (returnValue === 'keep') {
					callback.call(this, true);
				} else if (returnValue && returnValue.done) {
					returnValue.done(function (data) {
						callback.call(this, data);
					}.bind(this));
				}
			} else {
				this.onNodeClicked(node, nodeId);
			}
		},
		onNodeOperationClicked: function (node, click) {
			if (click) {
				click.call(this, node);
			}
		},
		onNodeCheckChanged: function (node, nodeId, evt, toChildOnly) {
			var hierarchyCheck = this.isHierarchyCheck();
			var modelValue = this.getValueFromModel();
			if (this.isValueAsArray()) {
				modelValue = modelValue ? modelValue : [];
				if (hierarchyCheck) {
					this.checkNodeHierarchy(node, nodeId, evt.new, modelValue);
					this.hierarchyCheckToAncestors(nodeId, modelValue);
				} else {
					this.checkNode(nodeId, evt.new, modelValue);
				}
				if (this.getValueFromModel() != modelValue) {
					// simply set to model
					this.setValueToModel(modelValue);
				} else {
					// fire event manually
					this.getModel().firePostChangeEvent(this.getDataId(), modelValue, modelValue);
				}
			} else {
				if (!modelValue) {
					modelValue = {};
				}

				if (hierarchyCheck) {
					this.checkNodeHierarchy(node, nodeId, evt.new, modelValue);
					this.hierarchyCheckToAncestors(nodeId, modelValue);
				} else {
					this.checkNode(nodeId, evt.new, modelValue);
				}

				if (this.getValueFromModel() != modelValue) {
					// simply set to model
					this.setValueToModel(modelValue);
				} else {
					// fire event manually
					this.getModel().firePostChangeEvent(this.getDataId(), modelValue, modelValue);
				}
			}
		},
		isValueAsArray: function () {
			return this.getComponentOption('valueAsArray');
		},
		/**
   * check or uncheck node. will not fire post change event.
   */
		checkNode: function (nodeId, value, modelValue) {
			if (this.isValueAsArray()) {
				if (!this.isMultipleSelection()) {
					// no multiple selection
					modelValue.length = 0;
				}
				if (nodeId == this.state.root.id) {
					modelValue.selected = value;
				} else {
					var ids = nodeId.split(NTree.NODE_SEPARATOR);
					var id = ids[ids.length - 1];
					var index = modelValue.findIndex(function (value) {
						return value == id;
					});
					if (value && index == -1) {
						modelValue.push(id);
					} else if (!value && index != -1) {
						modelValue.splice(index, 1);
					}
				}
			} else {
				if (!this.isMultipleSelection()) {
					// no multiple selection
					Object.keys(modelValue).forEach(function (key) {
						delete modelValue[key];
					});
				}
				if (nodeId == this.state.root.id) {
					$pt.setValueIntoJSON(modelValue, 'selected', value);
				} else {
					var segments = nodeId.split(NTree.NODE_SEPARATOR);
					$pt.setValueIntoJSON(modelValue, segments.slice(1).join($pt.PROPERTY_SEPARATOR) + $pt.PROPERTY_SEPARATOR + 'selected', value);
				}
			}
			return modelValue;
		},
		/**
   * check or uncheck node hierarchy. will not fire post change event.
   */
		checkNodeHierarchy: function (node, nodeId, value, modelValue) {
			modelValue = this.checkNode(nodeId, value, modelValue);
			if (node.children) {
				var _this = this;
				node.children.forEach(function (child) {
					var childId = _this.getNodeId(nodeId, child);
					_this.checkNodeHierarchy(child, childId, value, modelValue);
				});
			}
			return modelValue;
		},
		isNodeChecked: function (nodeId, modelValue) {
			modelValue = modelValue ? modelValue : this.getValueFromModel();
			modelValue = modelValue ? modelValue : {};
			if (Array.isArray(modelValue)) {
				if (nodeId == this.state.root.id) {
					return modelValue.selected;
				} else {
					var ids = nodeId.split(NTree.NODE_SEPARATOR);
					var id = ids[ids.length - 1];
					return -1 != modelValue.findIndex(function (value) {
						return value == id;
					});
				}
			} else {
				if (nodeId == this.state.root.id) {
					return $pt.getValueFromJSON(modelValue, 'selected');
				} else {
					return $pt.getValueFromJSON(modelValue, nodeId.split(NTree.NODE_SEPARATOR).slice(1).join($pt.PROPERTY_SEPARATOR) + $pt.PROPERTY_SEPARATOR + 'selected');
				}
			}
		},
		hierarchyCheckToAncestors: function (nodeId, modelValue) {
			var _this = this;
			var checkNodeOnChildren = function (node, nodeId) {
				if (node.children) {
					var hasUncheckedChild = false;
					node.children.forEach(function (child) {
						var checked = checkNodeOnChildren(child, _this.getNodeId(nodeId, child));
						if (!checked) {
							hasUncheckedChild = true;
						}
					});
					// window.console.log(nodeId);
					_this.checkNode(nodeId, !hasUncheckedChild, modelValue);
					return !hasUncheckedChild;
				} else {
					// no children, return checked of myself
					// window.console.log(nodeId);
					return _this.isNodeChecked(nodeId, modelValue);
				}
			};
			checkNodeOnChildren(this.state.root, this.getNodeId(null, this.state.root));
			// window.console.log(modelValue);
		},
		expandTo: function (expandLevel) {
			var activeNodes = $.extend({}, this.state.activeNodes);
			var _this = this;
			var expand = function (parentId, node, level) {
				if (level < expandLevel) {
					var nodeId = _this.getNodeId(parentId, node);
					activeNodes[nodeId] = node;
					if (node.children) {
						node.children.forEach(function (child) {
							expand(nodeId, child, level + 1);
						});
					}
				}
			};
			expand(null, this.state.root, 0);

			var previousActiveNodes = null;
			this.setState(function (previousState, currentProps) {
				previousActiveNodes = previousState.activeNodes;
				return { activeNodes: activeNodes };
			}, function () {
				_this.notifyEvent({
					type: 'expand',
					before: previousActiveNodes,
					after: activeNodes
				});
			});
		},
		expandAll: function () {
			var activeNodes = $.extend({}, this.state.activeNodes);
			var root = this.state.root;
			var expand = function (node, parentNodeId) {
				if (!this.isLeaf(node)) {
					var nodeId = this.getNodeId(parentNodeId, node);
					activeNodes[nodeId] = node;
					var _this = this;
					node.children.forEach(function (child) {
						expand.call(_this, child, nodeId);
					});
				}
			};
			expand.call(this, root, null);
			// this.setState({activeNodes: activeNodes});
			var _this = this;
			var previousActiveNodes = null;
			this.setState(function (previousState, currentProps) {
				previousActiveNodes = previousState.activeNodes;
				return { activeNodes: activeNodes };
			}, function () {
				_this.notifyEvent({
					type: 'expand',
					before: previousActiveNodes,
					after: activeNodes
				});
			});
		},
		collapseAll: function () {
			var _this = this;
			// var root = this.state.root;
			// var nodeIds = null;
			// if (this.isRootPaint()) {
			//     // this.collapseNode(root, this.getNodeId(null, root));
			//     nodeIds = [this.getNodeId(null, root)];
			// } else {
			//     var rootNodeId = this.getNodeId(null, root);
			//     if (root.children) {
			//         // root.children.forEach(function(node) {
			//         //     this.collapseNode(node, this.getNodeId(rootNodeId, node));
			//         // }.bind(this));
			//         nodeIds = root.children.map(function(node) {
			//             return _this.getNodeId(rootNodeId, node);
			//         });
			//     }
			// }
			// var regexp = new RegExp(nodeIds.map(function(nodeId) {
			//     return '(' + nodeId + ')';
			// }).join(NTree.NODE_SEPARATOR));
			// var activeNodes = $.extend({}, this.state.activeNodes);
			var activeNodes = {};
			Object.keys(activeNodes).forEach(function (key) {
				if (key.match(regexp)) {
					delete activeNodes[key];
				}
			});
			var previousActiveNodes = null;
			this.setState(function (previousState, currentProps) {
				previousActiveNodes = previousState.activeNodes;
				return { activeNodes: activeNodes };
			}, function () {
				_this.notifyEvent({
					type: 'collapse',
					before: previousActiveNodes,
					after: activeNodes
				});
			});
		},
		isRootPaint: function () {
			return this.getComponentOption('root');
		},
		getRootLabel: function () {
			var root = this.getComponentOption('root');
			if (typeof root === 'string') {
				return root;
			} else {
				return NTree.ROOT_LABEL;
			}
		},
		isActive: function (nodeId) {
			return this.state.activeNodes[nodeId];
		},
		isLeaf: function (node) {
			return !node.children || node.children.length == 0;
		},
		isInactiveSlibingWhenActive: function () {
			return this.getComponentOption('inactiveSlibing');
		},
		collapseNode: function (node, nodeId) {
			var regexp = new RegExp(nodeId);
			var activeNodes = $.extend({}, this.state.activeNodes);
			Object.keys(activeNodes).forEach(function (key) {
				if (key.match(regexp)) {
					delete activeNodes[key];
				}
			});
			// this.setState({activeNodes: activeNodes});
			var _this = this;
			var previousActiveNodes = null;
			this.setState(function (previousState, currentProps) {
				previousActiveNodes = previousState.activeNodes;
				return { activeNodes: activeNodes };
			}, function () {
				_this.notifyEvent({
					type: 'collapse',
					before: previousActiveNodes,
					after: activeNodes
				});
			});
		},
		expandNode: function (node, nodeId) {
			var activeNodes = $.extend({}, this.state.activeNodes);
			if (this.isInactiveSlibingWhenActive() && !this.isLeaf(node)) {
				// remove all slibings and their children from active list
				var lastHyphen = nodeId.lastIndexOf(NTree.NODE_SEPARATOR);
				if (lastHyphen > 0) {
					var regexp = new RegExp(nodeId.substring(0, lastHyphen + 1));
					Object.keys(activeNodes).forEach(function (key) {
						if (key.match(regexp)) {
							delete activeNodes[key];
						}
					});
				} else if (!this.isRootPaint()) {
					// no root painted, current is top level node, and need inactive slibings
					// clear all
					activeNodes = {};
				}
			}
			activeNodes[nodeId] = node;
			// this.setState({activeNodes: activeNodes});
			var _this = this;
			var previousActiveNodes = null;
			this.setState(function (previousState, currentProps) {
				previousActiveNodes = previousState.activeNodes;
				return { activeNodes: activeNodes };
			}, function () {
				_this.notifyEvent({
					type: 'expand',
					before: previousActiveNodes,
					after: activeNodes
				});
			});
		},
		/**
   * get top level nodes
   * @returns {{}[]}
   */
		getTopLevelNodes: function () {
			return this.getCodeTable().list();
		},
		/**
   * get avaiable top level nodes
   * @returns {CodeTable}
   */
		getCodeTable: function () {
			return this.getComponentOption('data');
		},
		getNodeIcon: function (node, nodeId) {
			var isLeaf = this.isLeaf(node);
			// not leaf, must be a folder, or node is defined as folder
			var isFolder = !isLeaf || node.folder;
			var active = this.isActive(nodeId);
			if (isFolder) {
				if (isLeaf) {
					return this.getCustomNodeIcon({
						node: node,
						active: active,
						folder: true,
						leaf: true
					}, NTree.FOLDER_ICON);
				} else if (active) {
					return this.getCustomNodeIcon({
						node: node,
						active: true,
						folder: true,
						leaf: false
					}, NTree.FOLDER_OPEN_ICON);
				} else {
					return this.getCustomNodeIcon({
						node: node,
						active: false,
						folder: true,
						leaf: false
					}, NTree.FOLDER_ICON);
				}
			} else {
				return this.getCustomNodeIcon({
					node: node,
					active: active,
					folder: false,
					leaf: true
				}, NTree.FILE_ICON);
			}
		},
		getNodeText: function (node) {
			return node.text;
		},
		/**
   * get customized node icon
   * @param options {node: JSON, active: boolean, folder: boolean, leaf: boolean}
   */
		getCustomNodeIcon: function (options, defaultIcon) {
			var icon = this.getComponentOption('nodeIcon');
			if (typeof icon === 'function') {
				return icon.call(this, options);
			} else if (icon) {
				return icon;
			} else {
				return defaultIcon;
			}
		},
		getNodeOperationIcon: function (node, nodeId) {
			var isLeaf = this.isLeaf(node);
			// not leaf, must be a folder, or node is defined as folder
			var isFolder = !isLeaf || node.folder;
			var active = this.isActive(nodeId);
			if (isFolder) {
				if (isLeaf) {
					return this.getCustomNodeOperationIcon({
						node: node,
						active: active,
						folder: true,
						leaf: true
					}, NTree.OP_FOLDER_LEAF_ICON);
				} else {
					if (active) {
						return this.getCustomNodeOperationIcon({
							node: node,
							active: true,
							folder: true,
							leaf: false
						}, NTree.OP_FOLDER_OPEN_ICON);
					} else {
						return this.getCustomNodeOperationIcon({
							node: node,
							active: false,
							folder: true,
							leaf: false
						}, NTree.OP_FOLDER_ICON);
					}
				}
			} else {
				return this.getCustomNodeOperationIcon({
					node: node,
					active: active,
					folder: false,
					leaf: true
				}, NTree.OP_FILE_ICON);
			}
		},
		/**
   * get customized node operation icon
   * @param options {node: JSON, active: boolean, folder: boolean, leaf: boolean}
   */
		getCustomNodeOperationIcon: function (options, defaultIcon) {
			var icon = this.getComponentOption('opNodeIcon');
			if (typeof icon === 'function') {
				return icon.call(this, options);
			} else if (icon) {
				return icon;
			} else {
				return defaultIcon;
			}
		},
		isNodeCanSelect: function (node) {
			var check = this.getComponentOption('check');
			if (typeof check === 'function') {
				return check.call(this, node);
			} else if (check) {
				return check;
			} else {
				return false;
			}
		},
		isNodeCheckCanChange: function (node) {
			var change = this.getComponentOption('valueCanCheck');
			if (typeof change === 'function') {
				return change.call(this, node);
			} else if (change != null) {
				return change;
			} else {
				return true;
			}
		},
		/**
   * is multiple selection allowed
   * @returns {boolean}
   */
		isMultipleSelection: function () {
			return this.getComponentOption('multiple');
		},
		isMultipleHighlight: function () {
			return this.getComponentOption('multipleHightlight', false);
		},
		/**
   * is hierarchy check, effective only when multiple is true
   * @returns {boolean}
   */
		isHierarchyCheck: function () {
			return this.getComponentOption('hierarchyCheck') && this.isMultipleSelection();
		},
		getNodeId: function (parentNodeId, node) {
			var nodeId = null;
			if (parentNodeId) {
				nodeId = parentNodeId + NTree.NODE_SEPARATOR + node.id;
			} else {
				nodeId = '' + node.id;
			}
			return nodeId;
		}
	}));

	// expose to global
	$pt.Components.NTree = NTree;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.Tree, function (model, layout, direction, viewMode) {
		return React.createElement($pt.Components.NTree, $pt.LayoutHelper.transformParameters(model, layout, direction, viewMode));
	});
})(window, jQuery, React, ReactDOM, $pt);

// only packaged in browser environment
(function (window, $pt) {
	// expose all components definition to window
	if (typeof DONT_EXPOSE_PARROT_TO_GLOBAL === 'undefined' || DONT_EXPOSE_PARROT_TO_GLOBAL !== true) {
		$pt.exposeComponents(window);
	}
})(window, $pt);


	// reset to old $pt
	if (typeof DONT_EXPOSE_PARROT_TO_GLOBAL != 'undefined' && DONT_EXPOSE_PARROT_TO_GLOBAL === true) {
		window.$pt = _pt;
	}
	return $pt;
}));
