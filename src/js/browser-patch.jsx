(function (window) {
	var patches = {
		console: function () {
			var noop = function () {
			};
			var methods = ['assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error', 'exception', 'group',
				'groupCollapsed', 'groupEnd', 'info', 'log', 'markTimeline', 'profile', 'profileEnd', 'table', 'time',
				'timeEnd', 'timeStamp', 'trace', 'warn'];
			var length = methods.length;
			var console = (window.console = window.console || {});

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
				String.prototype.padLeft = function(nSize, ch){
				    var len = 0;
				    var s = this ? this : "";
				    ch = ch ? ch : '0';// default add 0
				    len = s.length;
				    while(len < nSize){
				        s = ch + s;
				        len++;
				    }
				    return s;
				};
			}
			if (String.prototype.padRight === undefined) {
				String.prototype.padRight = function(nSize, ch){
				    var len = 0 ;
				    var s = this ? this : "";
				    ch = ch ? ch : '0'; // default add 0
				    len = s.length;
				    while(len<nSize){
				        s = s + ch;
				        len++;
				    }
				    return s;
				};
			}
			if (String.prototype.movePointLeft === undefined) {
				String.prototype.movePointLeft = function(scale){
				    var s,s1,s2,ch,ps,sign;
				    ch = ".";
				    sign = '';
				    s = this ? this : "";
				    if(scale <= 0){
				        return s;
				    }
				    ps = s.split('.');
				    s1 = ps[0] ? ps[0] : "";
				    s2 = ps[1] ? ps[1] : "";
				    if(s1.slice(0, 1) == '-') {
				        s1 = s1.slice(1);
				        sign = '-';
				    }
				    if(s1.length <= scale) {
				        ch = "0.";
				        s1 = s1.padLeft(scale);
				    }
				    return sign + s1.slice(0, -scale) + ch + s1.slice(-scale) + s2;
				};
			}
			if (String.prototype.movePointRight === undefined) {
				String.prototype.movePointRight = function(scale){
				    var s,s1,s2,ch,ps,sign;
				    ch = '.';
				    s = this ? this : "";
				    if(scale <= 0){
				        return s;
				    }
				    ps = s.split('.');
				    s1 = ps[0] ? ps[0] : "";
				    s2 = ps[1] ? ps[1] : "";
				    if(s2.length <= scale) {
				        ch = '';
				        s2 = s2.padRight(scale);
				    }
					if(s1.slice(0, 1) == '-') {
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
(function($, window) {
	function focus(target) {
		if (!document.activeElement || document.activeElement !== target) {
			target.focus();
		}
	}

  	$.fn.caret = function(pos) {
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
      		pos = this[isContentEditable? 'text' : 'val']().length;
      	}
    		//HTML5
		if (window.getSelection) {
  			//contenteditable
  			if (isContentEditable) {
    			focus(target);
    			window.getSelection().collapse(target.firstChild, pos);
  			}
  			//textarea
  			else
    			target.setSelectionRange(pos, pos);
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
