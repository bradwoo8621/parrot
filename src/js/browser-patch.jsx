(function ($) {
	var patches = {
		console: function () {
			if ($.browser.msie && $.browser.versionNumber <= 10) {
				var method;
				var noop = function () {
				};
				var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group',
					'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'table', 'time',
					'timeEnd', 'timeStamp', 'trace', 'warn'];
				var length = methods.length;
				var console = (window.console = window.console || {});

				while (length--) {
					method = methods[length];

					// Only stub undefined methods.
					if (!console[method]) {
						console[method] = noop;
					}
				}
			}
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
		},
		number: function () {
			if (Number.prototype.currencyFormat === undefined) {
				Number.prototype.currencyFormat = function (fraction) {
					fraction = fraction ? fraction : 0;
					return value.toFixed(fraction).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
				};
			}
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
})(jQuery);
