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
					throw $pt.createComponentException($pt.ComponentConstants.Err_Unsupported_Component,
						"Inline component type[" + type + "] is not supported yet.");
				}
				return editor;
			},
			__inlineEditors: {},
			__text: {
				comp: {
					type: {type: $pt.ComponentConstants.Text, label: false}
				}
			},
			__check: {
				comp: {
					type: {type: $pt.ComponentConstants.Check, label: false}
				}
			},
			__date: {
				comp: {
					type: {type: $pt.ComponentConstants.Date, label: false}
				}
			},
			__select: {
				comp: {
					type: {type: $pt.ComponentConstants.Select, label: false}
				}
			},
			__radio: {
				comp: {
					type: {type: $pt.ComponentConstants.Radio, label: false}
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
				return (<$pt.Components.NText model={this.state.searchModel} layout={this.state.searchLayout}/>);
			} else {
				return null;
			}
		},
		/**
		 * render heading buttons
		 * @returns {*}
		 */
		renderHeadingButtons: function () {
			var style = {display: this.state.expanded ? 'block' : 'none'};
			var buttons = [];
			if (this.isAddable()) {
				buttons.push(<a href="javascript:void(0);"
				                onClick={this.onAddClicked}
				                className="n-table-heading-buttons pull-right"
				                ref='add-button'
				                style={style}
								key='add-button'>
					<$pt.Components.NIcon icon={NTable.ADD_BUTTON_ICON}/>
					{NTable.ADD_BUTTON_TEXT}
				</a>);
			}
			if (this.isDownloadable()) {
				buttons.push(<a href="javascript:void(0);"
				                     onClick={this.onDownloadClicked}
				                     className="n-table-heading-buttons pull-right"
				                     ref='download-button'
				                     style={style}
									 key='download-button'>
					<$pt.Components.NIcon icon={NTable.DOWNLOAD_BUTTON_ICON}/>
					{NTable.DOWNLOAD_BUTTON_TEXT}
				</a>);
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
			return (<div className={css}>
				<span className={this.getAdditionalCSS("headingLabel", $pt.LayoutHelper.classSet(spanCSS))}
				      ref={this.getHeaderLabelId()} onClick={this.isCollapsible() ? this.onTitleClicked : null}>
					{this.getLayout().getLabel()}
				</span>
			</div>);
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
						return "<span style='display:block'>" + msg.format([_this.getLayout().getLabel()]) + "</span>";
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
			return (<div className={this.getAdditionalCSS("heading", "panel-heading n-table-heading")}>
				<div className="row">
					{this.renderPanelHeadingLabel()}
					<div className="col-sm-9 col-md-9 col-lg-9">
						{this.renderHeadingButtons()}
						{this.renderSearchBox()}
					</div>
				</div>
			</div>);
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
				return (<a href="javascript:void(0);" className={sortClass}
				           onClick={this.onSortClicked.bind(this, column)}>
					<$pt.Components.NIcon icon={icon}/>
				</a>);
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
			return <$pt.Components.NCheck model={model} layout={layout}/>;
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
			return (<thead>
			<tr>
				{this.state.columns.map(function (column) {
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
							return (<td style={style} key={columnIndex}>
								{_this.renderTableHeaderCheckBox(column)}
							</td>);
						} else {
							return (<td style={style} key={columnIndex}>
								{column.title}
								{_this.renderTableHeaderSortButton(column)}
							</td>);
						}
					} else {
						columnIndex++;
					}
				})}
			</tr>
			</thead>);
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
			return <$pt.Components.NFormButton model={rowModel} layout={layout}/>;
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
			return <$pt.Components.NFormButton model={rowModel} layout={layout}/>;
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
				comp: {
					style: 'link',
					icon: operation.icon,
					enabled: operation.enabled,
					visible: operation.visible,
					click: this.onRowOperationClicked.bind(this, operation.click, rowModel),
					tooltip: operation.tooltip
				},
				css: {
					comp: 'n-table-op-btn'
				}
			});
			return <$pt.Components.NFormButton model={rowModel} layout={layout} key={operationIndex}/>;
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
			return (<div className="btn-group n-table-op-btn-group" role='group'>
				{rowOperations.map(function (operation, operationIndex) {
					return _this.renderRowOperationButton(operation, rowModel, operationIndex);
				})}
				{editButton}
				{removeButton}
			</div>);
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
						icon: hasIcon ? (operation.icon ? operation.icon : 'placeholder') : null,
						enabled: operation.enabled,
						click: _this.onRowOperationClicked.bind(_this, operation.click, rowModel)
					},
					css: {
						comp: 'n-table-op-btn'
					}
				});
				return (<li key={operationIndex}>
					<$pt.Components.NFormButton model={rowModel} layout={layout}/>
				</li>);
			};
			return (<ul className='nav'>{moreOperations.map(renderOperation)}</ul>);
		},
		renderPopoverAsIcon: function (moreOperations, rowModel) {
			var _this = this;
			return moreOperations.map(function (operation, operationIndex) {
				return _this.renderRowOperationButton(operation, rowModel, operationIndex);
			});
		},
		renderPopover: function (moreOperations, rowModel, eventTarget) {
			var styles = {display: 'block'};
			var target = $(eventTarget).closest('a');
			var offset = target.offset();
			styles.top = offset.top + target.outerHeight() - 5;
			styles.left = offset.left;

			//var _this = this;
			ReactDOM.render((<div role="tooltip" className="n-table-op-btn-popover popover bottom in" style={styles}>
				<div className="arrow"></div>
				<div className="popover-content">
					{this.isRenderMoreOperationButtonsAsIcon(moreOperations) ?
						this.renderPopoverAsIcon(moreOperations, rowModel) :
						this.renderPopoverAsMenu(moreOperations, rowModel)}
				</div>
			</div>), this.state.popoverDiv.get(0));
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
				ReactDOM.render(<noscript/>, this.state.popoverDiv.get(0));
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
			return <$pt.Components.NFormButton model={rowModel} layout={layout} key='more-op'/>;
		},
		/**
		 * render dropdown operation cell, only buttons which before maxButtonCount are renderred as a line,
		 * a dropdown button is renderred in last, other buttons are renderred in popover of dropdown button.
		 */
		renderDropDownOperationCell: function (column, rowModel, maxButtonCount) {
			var _this = this;
			var rowOperations = this.getRowOperations(column);
			if (column.editable) {
				rowOperations.push({editButton: true});
			}
			if (column.removable) {
				rowOperations.push({removeButton: true});
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
			var hasDropdown = (rowOperations.length - used) > 1;
			var dropdown = null;
			if (hasDropdown) {
				buttons.push(this.renderRowOperationMoreButton(rowOperations.slice(used + 1), rowModel));
			}

			return (<div className="btn-group n-table-op-btn-group" role='group'>
				{buttons}
				{dropdown}
			</div>);
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
			return (<$pt.Components.NCheck model={model} layout={layout}/>);
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
			return (<tr className={className} key={rowIndex}>{
				this.state.columns.map(function (column) {
					if (columnIndex >= indexToRender.min && columnIndex <= indexToRender.max) {
						// column is fixed.
						columnIndex++;
						var style = {
							width: column.width
						};
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
								layout.pos = {width: 12};
								if (layout.css) {
									layout.css.cell = 'inline-editor' + (layout.css.cell) ? (' ' + layout.css.cell) : '';
								} else {
									layout.css = {cell: 'inline-editor'};
								}
								layout.label = column.title;
								if (column.inline === 'select' || column.inline === 'radio') {
									// set code table
									// if (column.codes) {
									layout = $.extend(true, {}, {comp: {data: column.codes}}, layout);
									// }
								} else {
									layout = $.extend(true, {}, layout);
								}
								// pre-defined, use with data together
								data = <$pt.Components.NFormCell model={inlineModel}
								                                 layout={$pt.createCellLayout(column.data, layout)}
								                                 direction='horizontal'
								                                 view={_this.isViewMode()}/>;
							} else if (column.inline.inlineType == 'cell') {
								column.inline.pos = {width: 12};
								if (column.inline.css) {
									column.inline.css.cell = 'inline-editor' + (column.inline.css.cell) ? (' ' + column.inline.css.cell) : '';
								} else {
									column.inline.css = {cell: 'inline-editor'};
								}
								column.inline.label = column.inline.label ? column.inline.label : column.title;
								data = <$pt.Components.NFormCell model={inlineModel}
								                                 layout={$pt.createCellLayout(column.data, column.inline)}
								                                 direction='horizontal'
								                                 view={_this.isViewMode()}
								                                 className={column.inline.__className}/>;
							} else {
								// any other, treat as form layout
								// column.data is not necessary
								data = <$pt.Components.NForm model={inlineModel}
								                             layout={$pt.createFormLayout(column.inline)}
								                             direction='horizontal'
								                             view={_this.isViewMode()}/>;
							}
						} else {
							// data is property name
							data = _this.getDisplayTextOfColumn(column, row);
						}
						return (<td style={style} key={columnIndex} className={column.css}>{data}</td>);
					} else {
						columnIndex++;
					}
				})
			}</tr>);
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
			return (<tbody>
			{data.map(function (element) {
				if (rowIndex >= range.min && rowIndex <= range.max) {
					return _this.renderTableBodyRow(element, rowIndex++, all, leftFixed, rightFixed);
				} else {
					rowIndex++;
					return null;
				}
			})}
			</tbody>);
		},
		/**
		 * render table with no scroll Y
		 * @returns {XML}
		 */
		renderTableNoScrollY: function () {
			return (<div className={this.getAdditionalCSS("panelBody", "n-table-panel-body")}>
				<table cellSpacing="0" className={this.getAdditionalCSS("table", "n-table cell-border")}
				       style={this.computeTableStyle()}
				       ref='table'>
					{this.renderTableHeading(true)}
					{this.renderTableBody(true)}
				</table>
			</div>);
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
			return (<div className={this.getAdditionalCSS("panelBody", "n-table-panel-body")}>
				<div className="n-table-scroll-head" ref={this.getScrolledHeaderDivId()} style={scrolledHeaderDivStyle}>
					<div className="n-table-scroll-head-inner" style={style}>
						<table cellSpacing="0" className={this.getAdditionalCSS("table", "n-table cell-border")}
						       style={style}>
							{this.renderTableHeading(true)}
						</table>
					</div>
				</div>
				<div className="n-table-scroll-body" style={scrolledBodyDivStyle} ref={this.getScrolledBodyDivId()}>
					<table cellSpacing="0" className={this.getAdditionalCSS("table", "n-table cell-border")}
					       style={style}
					       ref='table'>
						{this.renderTableBody(true)}
					</table>
				</div>
			</div>);
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
				bodyDivStyle.maxHeight = this.getComponentOption("scrollY") - ((this.isIE8()) ? 0 : 18);
			}
			var tableStyle = {
				width: "100%"
			};
			return (
				<div className="n-table-fix-left" style={divStyle}>
					<table cellSpacing="0" style={tableStyle}
					       className={this.getAdditionalCSS("table", "n-table cell-border")}>
						{this.renderTableHeading(false, true)}
					</table>
					<div ref={this.getFixedLeftBodyDivId()} style={bodyDivStyle}>
						<table cellSpacing="0" className={this.getAdditionalCSS("table", "n-table cell-border")}
						       style={tableStyle}>
							{this.renderTableBody(false, true)}
						</table>
					</div>
				</div>
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
			return (<div className="n-table-fix-left" style={divStyle}>
				<table cellSpacing="0" className={this.getAdditionalCSS("table", "n-table cell-border")}
				       style={tableStyle}>
					{this.renderTableHeading(false, true)}
					{this.renderTableBody(false, true)}
				</table>
			</div>);
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
			return (<div className="n-table-fix-right" style={divStyle}>
				<table cellSpacing="0" className={this.getAdditionalCSS("table", "n-table cell-border")}
				       style={tableStyle}>
					{this.renderTableHeading(false, false, true)}
					{this.renderTableBody(false, false, true)}
				</table>
			</div>);
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
				bodyDivStyle.maxHeight = this.getComponentOption("scrollY") - ((this.isIE8()) ? 0 : 18);
			}
			var tableStyle = {
				width: "100%"
			};
			return (
				<div className="n-table-fix-right" style={divStyle}>
					<div className="n-table-fix-right-head-wrapper">
						<div className="n-table-fix-right-top-corner"/>
						<table cellSpacing="0" style={tableStyle}
						       className={this.getAdditionalCSS("table", "n-table cell-border")}>
							{this.renderTableHeading(false, false, true)}
						</table>
					</div>
					<div ref={this.getFixedRightBodyDivId()} style={bodyDivStyle}>
						<table cellSpacing="0" className={this.getAdditionalCSS("table", "n-table cell-border")}>
							{this.renderTableBody(false, false, true)}
						</table>
					</div>
				</div>
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
				return (<div className="n-table-no-data"><span>{NTable.NO_DATA_LABEL}</span></div>);
			}
		},
		/**
		 * render pagination
		 * @returns {XML}
		 */
		renderPagination: function () {
			if (this.isPageable() && this.hasDataToDisplay()) {
				// only show when pageable and has data to display
				return (<$pt.Components.NPagination className="n-table-pagination" pageCount={this.state.pageCount}
				                                    currentPageIndex={this.state.currentPageIndex}
				                                    toPage={this.toPage}/>);
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
					bodyDivStyle.maxHeight = this.getComponentOption("scrollY") - ((this.isIE8()) ? 0 : 18);
				}
				rightCorner = (<div className="n-table-fix-right" style={divStyle}>
					<div className="n-table-fix-right-head-wrapper">
						<div className="n-table-fix-right-top-corner"/>
					</div>
				</div>);
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
			return (<div className={this.getComponentCSS($pt.LayoutHelper.classSet(css))} ref='div'>
				{this.renderPanelHeading()}
				<div ref='table-panel-body' style={expandedStyle}>
					<div className={this.getAdditionalCSS("body", "n-table-body-container panel-body")}>
						{this.renderTable()}
						{this.renderFixedLeftColumns()}
						{this.renderFixedRightColumns()}
						{this.renderRightTopCorner()}
					</div>
					{this.renderNoDataReminder()}
					{this.renderPagination()}
				</div>
			</div>);
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
						width += (column.width ? (column.width * 1) : 0);
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
					width += element.width ? (element.width * 1) : 0;
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
					this.state.pageCount = (Math.floor(pageCount) == pageCount) ? pageCount : (Math.floor(pageCount) + 1);
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
			return data == null ? false : (!data.some(function (row) {
				if (rowIndex >= range.min && rowIndex <= range.max) {
					rowIndex++;
					return row[column.rowSelectable] !== true;
				} else {
					rowIndex++;
					return false;
				}
			}));
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
		onCheckAllChanged: function(selected) {
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
			$pt.Components.NConfirm.getConfirmModal().show(NTable.REMOVE_CONFIRM_TITLE,
				NTable.REMOVE_CONFIRM_MESSAGE,
				removeRow.bind(this, data));
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
		exposeDownloading: function(data) {
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
		tableToExcel: function(data) {
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
		generateTableExcelHeader: function() {
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
		generateTableExcelBodyRow: function(row) {
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
					throw $pt.createComponentException($pt.ComponentConstants.Err_Unuspported_Column_Sort,
						"Column sort [" + column.sort + "] is not supported yet.");
				}
			}
			var _this = this;
			// if no sorter specific in column
			sorter = sorter == null ? (function (a, b) {
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
			}) : sorter;

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
				this.state.editDialog = $pt.Components.NModalForm.createFormModal(this.getLayout().getLabel());
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
		return <$pt.Components.NTable {...$pt.LayoutHelper.transformParameters(model, layout, direction, viewMode)}/>;
	});
}(window, jQuery, React, ReactDOM, $pt));
