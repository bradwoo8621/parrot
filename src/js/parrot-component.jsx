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
					cell = $pt.mergeObject({deep: true, target: {}, sources: cell.base.concat(cell)});
				} else {
					cell = $pt.mergeObject({deep: true, target: {}, sources: [cell.base, cell]});
				}
			}

			this.__dataId = cell.dataId ? cell.dataId : this.__id;
			this.__cell = cell;
		},
		unwrapValueWhenIsAFunc: function(value, forceWrap, delegate) {
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
		getDefinition: function() {
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
			type = (type == null ? $pt.ComponentConstants.TextInJSON : type);
			return (typeof type === "string") ? {type: type, label: true, popover: true} : type;
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
				cssList.forEach(function(cssClassName) {
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
						var name = Object.keys(this.__cell.evt).find(function(name) {
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
		getValidationPhase: function() {
			if (this.__cell && this.__cell.validate) {
				return this.transformValidationPhase(this.__cell.validate);
			} else {
				return null;
			}
		},
		transformValidationPhase: function(phase) {
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
		getValidationOption: function(key, defaultValue) {
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
						return (typeof define[key] === 'undefined') ? defaultValue : define[key];
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
				cards[CardLayout.DEFAULT_KEY] = {_sections: {}};
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
		getInitialState: function() {
			return {};
		},
		executePointcutBefore: function(pointcut) {
			if (pointcut && pointcut.before) {
				pointcut.before.apply(this, Array.prototype.slice.call(arguments, 1));
			}
		},
		executePointcutAfter: function(pointcut) {
			if (pointcut && pointcut.after) {
				pointcut.after.apply(this, Array.prototype.slice.call(arguments, 1));
			}
		},
		installBaseMonitors: function() {
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
		uninstallBaseMonitors: function() {
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
		onModelChanged: function() {
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
		isViewMode: function() {
			var isViewMode = this.state ? this.state.isViewMode : null;
			if (isViewMode == null) {
				return this.props.view === true || this.getComponentOption('view') === true;
			} else {
				return isViewMode;
			}
		},
		setViewMode: function(isViewMode) {
			this.setState({isViewMode: isViewMode});
		},
		/**
		 * render in view mode. default render as a label.
		 * @returns {XML}
		 */
		renderInViewMode: function() {
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
			var parameters = $pt.LayoutHelper.transformParameters(
				this.getModel(), labelLayout, this.props.direction, true);
			parameters.ref = 'viewLabel';
			return <$pt.Components.NLabel {...parameters} />;
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
		getComponentCentralId: function() {
			return this.getComponentOption('centralId');
		},
		/**
		 * register to component central
		 */
		registerToComponentCentral: function() {
			var id = this.getComponentCentralId();
			if (id) {
				$pt.LayoutHelper.registerComponent(id, this);
			}
		},
		/**
		 * unregsiter from component central
		 */
		unregisterFromComponentCentral: function() {
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
		notifyEvent: function(evt) {
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
		getRuleValue: function(rule, defaultValue, model) {
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
		getRuleDependencies: function(dependencies) {
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
					visible = (view == 'edit') != true;
				} else if (!this.isViewMode()) {
					visible = (view == 'view') != true;
				}
			}
			return visible;
		},
		isMobile: function() {
			return $pt.browser.mobile === true;
		},
		isMobilePhone: function() {
			return this.isMobile() && $('body').width() < 768;
		},
		/**
		 * is required
		 * @returns {boolean}
		 */
		isRequiredSignNeeded: function() {
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
		addRequiredDependencyMonitor: function() {
			this.addDependencyMonitor(this.getDependencies('required'));
		},
		removeRequiredDependencyMonitor: function() {
			this.removeDependencyMonitor(this.getDependencies('required'));
		},
		addValidateDependencyMonitor: function() {
			this.addDependencyMonitor(this.getDependencies('validation'), this.validate);
		},
		removeValidateDependencyMonitor: function() {
			this.removeDependencyMonitor(this.getDependencies('validation'), this.validate);
		},
		/**
		 * validate current cell by given phase
		 */
		validate: function() {
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
		getValidationOption: function(key, defaultValue) {
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
			return <hr className={$pt.LayoutHelper.classSet(css)} ref='normalLine'/>;
		},
		/**
		 * render focus bottom border
		 * @returns {XML}
		 */
		renderFocusLine: function () {
			return <hr className={this.getAdditionalCSS('focus-line', 'focus-line')} ref='focusLine'/>;
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
				dependencies.forEach(function(key) {
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
			monitor = monitor == null? this.__forceUpdate : monitor;
			var _this = this;
			if (model) {
				dependencies.forEach(function(key) {
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
			isArrayData: function() {
				return true;
			},
			addRowListener: function(rowModel) {
				this.getRowListeners().forEach(function (listener) {
					rowModel.addListener(listener.id,
						listener.time ? listener.time : 'post',
						listener.type ? listener.type : 'change',
						listener.listener);
				});
				rowModel.addPostChangeListener(null, this.onRowModelChanged);
				rowModel.addPostAddListener(null, this.onRowModelChanged);
				rowModel.addPostRemoveListener(null, this.onRowModelChanged);
			},
			onRowModelChanged: function(evt) {
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
			getRowListeners: function() {
				var listeners = this.getComponentOption(this.getRowListenerKey());
				return listeners ? (Array.isArray(listeners) ? listeners : [listeners]) : [];
			},
			getRowListenerKey: function() {
				return 'rowListener';
			},
			createRowModel: function(item, useBaseAsCurrent) {
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
					errors.forEach(function(error) {
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
			renderPopoverContainer: function() {
				if (this.state.popoverDiv == null) {
					this.state.popoverDiv = $('<div>');
					this.state.popoverDiv.appendTo($('body'));
					if (!this.isMobile()) {
						$(document).on('mousedown', this.onDocumentMouseDownWhenPopoverShown)
							.on('keyup', this.onDocumentKeyUpWhenPopoverShown)
							.on('keydown', this.onDocumentKeyDownWhenPopoverShown)
							.on('mousewheel', this.onDocumentMouseWheelWhenPopoverShown);
						$(window).on('resize', this.onWindowResizeWhenPopoverShown);
					} else {
						$('body').on('touchmove mousewheel', this.onDocumentMouseWheelWhenPopoverShown);
					}
				}
			},
			renderPopover: function() {
				if (this.beforeRenderPopover) {
					this.beforeRenderPopover.apply(this, arguments);
				}

				var styles = {display: 'block'};
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
					styles = {display: 'block'};	// reset styles
				}
				var content = this.renderPopoverContent.apply(this, arguments);
				if (!this.hasPopoverContentWrapper || this.hasPopoverContentWrapper() !== false) {
					content = (<div className="popover-content">
						{content}
					</div>);
				}
				var popover = (<div role="tooltip" className={$pt.LayoutHelper.classSet(css)} style={styles}>
					<div className="arrow"></div>
					{content}
				</div>);
				ReactDOM.render(popover, this.state.popoverDiv.get(0), this.onPopoverRenderComplete);
			},
			onPopoverRenderComplete: function() {
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
			recalcPopoverPosition: function(popover, component) {
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
				if ((styles.top + realHeight) > ($(window).height() + $(window).scrollTop())) {
					// cannot show in bottom and in current viewport
					// check it is enough top or not
					if ((offset.top - $(window).scrollTop()) >= realHeight) {
						// enough
						styles.top = offset.top - realHeight;
						onTop = true;
					} else if ((styles.top + realHeight) <= $(document).height()) {
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
					if ((styles.left + realWidth) <= width) {
						// normal from left to right, do nothing
					} else if ((styles.left + styles.width) >= realWidth) {
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
				popover.css({top: styles.top, left: styles.left});
			},
			showPopover: function() {
				if (this.beforeShowPopover) {
					this.beforeShowPopover.apply(this, arguments);
				}
				this.renderPopoverContainer();
				this.renderPopover.apply(this, arguments);
			},
			hidePopover: function() {
				this.destroyPopover();
			},
			destroyPopover: function() {
				if (this.beforeDestoryPopover) {
					this.beforeDestoryPopover.apply(this, arguments);
				}
				$('html').removeClass('on-mobile-popover-shown');
				if (this.state.popoverDiv) {
					$(document).off('mousedown', this.onDocumentMouseDownWhenPopoverShown)
						.off('keyup', this.onDocumentKeyUpWhenPopoverShown)
						.off('keydown', this.onDocumentKeyDownWhenPopoverShown)
						.off('mousewheel', this.onDocumentMouseWheelWhenPopoverShown);
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
			onDocumentMouseDownWhenPopoverShown: function(evt) {
				var target = $(evt.target);
				if (target.closest(this.getComponent()).length == 0 && target.closest(this.state.popoverDiv).length == 0) {
					this.hidePopover();
				}
			},
			onDocumentKeyUpWhenPopoverShown: function(evt) {
				if (evt.keyCode === 27 || evt.keyCode === 9) { // escape and tab
					this.hidePopover();
				}
			},
			onDocumentKeyDownWhenPopoverShown: function(evt)  {
				if (evt.keyCode === 38 || evt.keyCode === 40) {
					evt.preventDefault();
				}
			},
			onDocumentMouseWheelWhenPopoverShown: function(evt) {
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
			onWindowResizeWhenPopoverShown: function() {
				this.hidePopover();
			},
			isPopoverFixOnBottom: function() {
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
				render: function() {
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
		constructor: function() {
			this.__comp = {};
			this.__components = {};
		},
		/**
		 * copy from React.addons.classSet
		 * @param classNames
		 * @returns {string}
		 */
		classSet : function (classNames) {
			if (typeof classNames == 'object') {
				return Object.keys(classNames).filter(function (className) {
					return classNames[className];
				}).join(' ');
			} else {
				return Array.prototype.join.call(arguments, ' ');
			}
		},
		setDefaultCellWidth : function(width) {
			CellLayout.DEFAULT_WIDTH = width * 1;
		},
		setDefaultSectionWidth : function(width) {
			SectionLayout.DEFAULT_WIDTH = width * 1;
		},
		/**
		 * register react component to central
		 */
		registerComponent: function(id, component) {
			if (this.__comp[id]) {
				// already some components use this id
				var exists = this.__comp[id];
				if (Array.isArray(exists)) {
					// push to array if not exists
					var found = exists.find(function(existed) {
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
		unregisterComponent: function(id, component) {
			if (component) {
				// delete key, unregister all components with given id
				delete this.__comp[id];
			} else {
				// find all existed component with given id
				var exists = this.__comp[id];
				if (exists) {
					if (Array.isArray(exists)) {
						var index = exists.findIndex(function(existed) {
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
		getComponent: function(id) {
			return this.__comp[id];
		},
		__forceUpdate: function(component) {
			if (component.forceUpdate) {
				component.forceUpdate();
			}
			return this;
		},
		/**
		 * force update components which has give id
		 */
		forceUpdate: function(id) {
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
		getComponentRenderer: function(type) {
			if (typeof type !== 'string') {
				type = type.type;
			}
			if (this.__components[type]) {
				return this.__components[type];
			} else {
				throw $pt.createComponentException($pt.ComponentConstants.Err_Unsupported_Component,
					"Component type [" + type + "] is not supported yet.");
			}
		},
		registerComponentViewModeRenderer: function(type, func) {
			if (typeof type !== 'string') {
				type = type.type;
			}
			type = type + '@view';
			if (this.__components[type]) {
				window.console.warn('Component [' + type + '] is replaced.');
			}
			this.__components[type] = func;
		},
		getComponentViewModeRenderer: function(type) {
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
		transformParameters: function(model, layout, direction, viewMode) {
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
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.Nothing, function() {
		return null;
	});
})(window, jQuery, jsface, React);
