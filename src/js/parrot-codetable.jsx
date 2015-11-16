/**
 * depends on jsface
 * depends on parrot-ajax, parrot-jsface
 */
(function (context, $) {
	var $pt = context.$pt;
	if ($pt == null) {
		$pt = {};
		context.$pt = $pt;
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
				return a.text < b.text ? -1 : (a.text > b.text ? 1 : 0);
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
			if (Array.isArray(data)) {
				// construct with array, local data
				this._local = true;
				this._initArray = data;
			} else {
				// construct with json, remote data
				this._local = false;
				this._url = data.url;
				this._postData = data.data;
			}
			this._renderer = renderer;
			this._sorter = sorter;
		},
		/**
		 * get renderer of code table
		 */
		getRenderer: function() {
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
			var render = function(code) {
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
				var sort = function(codes) {
					sorter.sort(codes);
					codes.forEach(function(code) {
						if (code.children) {
							sort(code.children);
						}
					});
				};
				sort(this._codes);
			}
		},
		/**
		 * load remote code table, quiet and synchronized
		 * @private
		 */
		__loadRemoteCodes: function () {
			var _this = this;
			$pt.doPost(this._url, this._postData, {
				quiet: true,
				async: false,
				done: function (data) {
					// init code table element array after get data from remote
					_this.__initCodesArray(data, _this._renderer, _this._sorter);
					_this._initialized = true;
				},
				fail: function (jqXHR, textStatus, errorThrown) {
					// error to console, quiet backend
					window.console.error('Status:' + textStatus + ', error:' + errorThrown);
				}
			});
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
				if (!this._local && (!this._loadedKeys || this._loadedKeys.indexOf(value) == -1)) {
					// no local data, and loaded keys don't contain current value
					// reset post data
					if (this._postData) {
						this._postData = $.extend({}, this._postData, {value: func.value});
					} else {
						this._postData = {value: func.value};
					}
					// store current local data
					var existedCodes = this._codes != null ? this._codes : [];
					var existedMap = this._map != null ? this._map : {};
					// get data from server
					this.__loadRemoteCodes();
					// init loaded keys
					if (!this._loadedKeys) {
						this._loadedKeys = [];
					}
					// log the loaded keys
					this._loadedKeys.push(value);
					// merge server data and local data
					this._codes.push.apply(this._codes, existedCodes);
					this._map = $.extend(existedMap, this._map);
				}
				// filter
				return this.__getCodes().filter(function (code) {
					return code[func.name] == value;
				});
			}
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
		listAllChildren: function() {
			var items = {};
			var fetchItem = function(item) {
				items[item.id] = item;
				if (item.children) {
					item.children.forEach(function(child) {
						fetchItem(child);
					});
				}
			};
			this.list().forEach(function(item) {
				fetchItem(item);
			});
			return items;
		},
		/**
		 * get code table element array, with hierarchy keys
		 * @param {rootId: string, separtor: string}
		 * @returns {{codeId: codeItem}};
		 */
		listWithHierarchyKeys: function(options) {
			var separator = (options && options.separator) ? options.separator : '|';
			var rootId = (options && options.rootId != null) ? options.rootId : '0';
			var items = {};
			var fetchItem = function(item, parentId) {
				items[parentId + separator + item.id] = item;
				if (item.children) {
					item.children.forEach(function(child) {
						fetchItem(child, parentId + separator + item.id);
					});
				}
			};
			this.list().forEach(function(item) {
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
		name: function(name) {
			if (name) {
				this.__name = name;
			} else {
				return this.__name;
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
})(this, jQuery);
