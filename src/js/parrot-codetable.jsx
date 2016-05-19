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
		isInitialized: function() {
			return this._initialized === true;
		},
		isRemote: function() {
			return this._local === false;
		},
		isRemoteButNotInitialized: function() {
			return this.isRemote() && !this.isInitialized();
		},
		initializeRemote: function() {
			if (this.isRemoteButNotInitialized()) {
				// return a promise to load remote codes
				// since there might be more than one components using the same codetable
				// log the first loading promise and returns to all others
				if (!this._loading) {
					this._loading = this.__loadRemoteCodes(true).always(function() {
						delete this._loading;
						this._allLoaded = true;
					}.bind(this));
				}
				return this._loading;
			} else {
				// already initialized, or is local
				// return an immediately resolved promise
				return $.Deferred(function(deferred) {
					deferred.resolve();
				}).promise();
			}
		},
		setAsRemoteInitialized: function() {
			this._codes = this._codes ? this._codes : [];
			this._map = this._map ? this._map : {};
			this._initialized = true;
			return this;
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
			}).fail(function(jqXHR, textStatus, errorThrown) {
				// error to console, quiet backend
				_this.__initCodesArray(null, _this._renderer, _this._sorter);
				window.console.error('Status:' + textStatus + ', error:' + errorThrown);
			}).always(function() {
				_this._initialized = true;
			});
		},
		__getSendProxy: function() {
			return this._sendProxy || $pt.ComponentConstants.CODETABLE_SENDER_PROXY || $pt.ComponentConstants.CODETABLE_REMOTE_PROXY;
		},
		__getReceiveProxy: function() {
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
		isSegmentLoaded: function(parentValue) {
			return !this.__needLoadFromRemote(parentValue);
		},
		loadRemoteCodeSegment: function(parentValue) {
			if (this.__needLoadFromRemote(parentValue)) {
				// no local data, and loaded keys don't contain current value
				// reset post data
				this.__rebuildPostData(parentValue);
				// store current local data
				var existedData = this.__holdExistedCodes();
				// get data from server
				return this.__loadRemoteCodes(true).done(function() {
					this.__setParentValueAsLoaded(parentValue);
				}.bind(this)).always(function() {
					this.__mergeAll(existedData);
				}.bind(this));
			} else {
				// local or already loaded
				// return an immediately resolved promise
				return $.Deferred(function(deferred) {
					deferred.resolve();
				}).promise();
			}
		},
		__needLoadFromRemote: function(parentValue) {
			return !this._local && !this._allLoaded
				&& (!this._loadedKeys || this._loadedKeys[parentValue + ''] !== true);
		},
		__rebuildPostData: function(parentValue) {
			var values = {};
			values[this.parentValueKey()] = parentValue;
			if (this._postData) {
				this._postData = $.extend({}, this._postData, values);
			} else {
				this._postData = values;
			}
			return this;
		},
		__holdExistedCodes: function() {
			return {
				codes: this._codes != null ? this._codes : [],
				map: this._map != null ? this._map : {}
			};
		},
		__mergeAll: function(existedData) {
			// merge server data and local data
			this._codes.push.apply(this._codes, existedData.codes);
			this._map = $.extend(existedData.map, this._map);
			return this;
		},
		__setParentValueAsLoaded: function(parentValue) {
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
		__loadRemoteCodeSegment: function(parentValue) {
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
				return this;
			} else {
				return this.__name;
			}
		},
		parentValueKey: function(key) {
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
