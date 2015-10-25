/**
 * table
 */
var NTable = React.createClass($pt.defineComponentConfig({
    propTypes: {
        // model
        model: React.PropTypes.object,
        // CellLayout
        layout: React.PropTypes.object
    },
    getDefaultProps: function () {
        return {
            defaultOptions: {
                scrollY: false,
                scrollX: false,
                fixedRightColumns: 0,
                fixedLeftColumns: 0,

                addable: true,
                addButtonIcon: "plus-square-o",
                addButtonText: "Add",
                searchable: true,
                searchPlaceholder: "Search...",

                operationFixed: true,
                editable: false,
                rowEditButtonIcon: "pencil-square-o",
                removable: false,
                rowRemoveButtonIcon: "trash-o",
                editDialogSaveButtonText: "Save",
                editDialogSaveButtonIcon: "floppy-o",

                indexable: false,
                indexFixed: true,

                sortable: true,
                sortIcon: "sort",
                sortAscIcon: "sort-amount-asc",
                sortDescIcon: "sort-amount-desc",

                pageable: false,
                countPerPage: 20,

                noDataLabel: "No Data",
                detailErrorMessage: "Detail error please open item and do validate."
            }
        }
    },
    /**
     * get initial state
     * @returns {*}
     */
    getInitialState: function () {
        return {
            sortColumn: null,
            sortWay: null, // asc|desc

            countPerPage: 20,
            pageCount: 1,
            currentPageIndex: 1,

            searchText: null
        };
    },
    /**
     * will update
     * @param nextProps
     */
    componentWillUpdate: function (nextProps) {
        $("#" + this.getHeaderLabelId()).popover("destroy");
        this.removePostChangeListener(this.onModelChange);
        this.removePostRemoveListener(this.onModelChange);
        this.removePostAddListener(this.onModelChange);
        this.removePostValidateListener(this.onModelValidateChange);
    },
    /**
     * did update
     * @param prevProps
     * @param prevState
     */
    componentDidUpdate: function (prevProps, prevState) {
        this.renderIfIE8();
        this.renderHeaderPopover();
        this.addPostChangeListener(this.onModelChange);
        this.addPostRemoveListener(this.onModelChange);
        this.addPostAddListener(this.onModelChange);
        this.addPostValidateListener(this.onModelValidateChange);
    },
    /**
     * did mount
     */
    componentDidMount: function () {
        this.createComponent();
        this.renderHeaderPopover();
        this.addPostChangeListener(this.onModelChange);
        this.addPostRemoveListener(this.onModelChange);
        this.addPostAddListener(this.onModelChange);
        this.addPostValidateListener(this.onModelValidateChange);
    },
    /**
     * will unmount
     */
    componentWillUnmount: function () {
        $("#" + this.getHeaderLabelId()).popover("destroy");
        this.removePostChangeListener(this.onModelChange);
        this.removePostRemoveListener(this.onModelChange);
        this.removePostAddListener(this.onModelChange);
        this.removePostValidateListener(this.onModelValidateChange);
    },
    /**
     * create component
     */
    createComponent: function () {
        var _this = this;
        this.renderIfIE8();
        $("#" + this.getScrolledBodyDivId()).scroll(function (e) {
            var $this = $(this);
            $("#" + _this.getScrolledHeaderDivId()).scrollLeft($this.scrollLeft());
            $("#" + _this.getFixedLeftBodyDivId()).scrollTop($this.scrollTop());
            $("#" + _this.getFixedRightBodyDivId()).scrollTop($this.scrollTop());
        });
    },
    /**
     * render when IE8, fixed the height of table since IE8 doesn't support max-height
     */
    renderIfIE8: function () {
        if (!this.isIE8() || !this.hasVerticalScrollBar()) {
            return;
        }
        var mainTable = this.getComponent();
        var leftFixedDiv = $("#" + this.getFixedLeftBodyDivId());
        var rightFixedDiv = $("#" + this.getFixedRightBodyDivId());
        var trs = mainTable.find("tr");
        var rowCount = trs.length;
        var height = rowCount * 32; // 32 is defined in css, if value in css is changed, it must be changed together
        if (height > this.getComponentOption("scrollY")) {
            height = this.getComponentOption("scrollY");
        }
        // calculate height of body if ie8 and scrollY
        mainTable.closest("div").css({height: height + 17});
        leftFixedDiv.css({height: height});
        rightFixedDiv.css({height: height});
    },
    /**
     * check browser is IE8 or not
     * @returns {boolean}
     */
    isIE8: function () {
        return $.browser.msie && $.browser.versionNumber == 8;
    },
    /**
     * prepare display options
     */
    prepareDisplayOptions: function () {
        // if scrollY is set, force set scrollX to true, since the table will be
        // splitted to head table and body table.
        // for make sure the cell is aligned, width of columns must be set.
        if (this.hasVerticalScrollBar()) {
            this.getLayout().setComponentOption("scrollX", true);
        }
        // copy from this.props.columns
        this.columns = this.getComponentOption("columns").clone();
        this.fixedRightColumns = this.getComponentOption("fixedRightColumns");
        this.fixedLeftColumns = this.getComponentOption("fixedLeftColumns");

        // if editable or removable, auto add last column to render the buttons
        var editable = this.isEditable();
        var removable = this.isRemovable();
        if (editable || removable) {
            var config = {
                editable: editable,
                removable: removable,
                title: ""
            };
            config.width = (config.editable ? 30 : 0) + (config.removable ? 30 : 0);
            this.columns.push(config);
            if (this.fixedRightColumns > 0 || this.getComponentOption("operationFixed") === true) {
                this.fixedRightColumns++;
            }
        }
        // if indexable, auto add first column to render the row index
        var indexable = this.isIndexable();
        if (indexable) {
            var config = {
                indexable: true,
                width: 40,
                title: ""
            };
            this.columns.splice(0, 0, config);
            if (this.fixedLeftColumns > 0 || this.getComponentOption("indexFixed") === true) {
                this.fixedLeftColumns++;
            }
        }
    },
    /**
     * render search  box
     * @returns {XML}
     */
    renderSearchBox: function () {
        if (this.isSearchable()) {
            return (
                <input id={"ntable-search-" + this.getId()} className="form-control n-table-search-box pull-right"
                       placeholder={this.getComponentOption("searchPlaceholder")}
                       onChange={this.onSearchBoxChanged}/>
            );
        } else {
            return null;
        }
    },
    /**
     * render heading buttons
     * @returns {XML}
     */
    renderHeadingButtons: function () {
        if (this.isAddable()) {
            return (
                <ul className="n-table-heading-buttons pagination pull-right">
                    <li>
                        <a href="javascript:void(0);" onClick={this.onAddClicked}>
                            <Icon
                                icon={this.getComponentOption("addButtonIcon")}/> {this.getComponentOption("addButtonText")}
                        </a>
                    </li>
                </ul>
            );
        } else {
            return null;
        }
    },
    /**
     * render panel heading label
     * @returns {XML}
     */
    renderPanelHeadingLabel: function () {
        var css = "col-sm-3 col-md-3 col-lg-3";
        if (this.getModel().hasError(this.getId())) {
            css += " has-error";
        }
        return <div className={css}>
            <label className={this.getCombineCSS("n-table-heading-label","headingLabel")}
                   id={this.getHeaderLabelId()}>
                {this.getLayout().getLabel()}
            </label>
        </div>;
    },
    /**
     * render header popover
     */
    renderHeaderPopover: function () {
        if (this.getModel().hasError(this.getId())) {
            var messages = this.getModel().getError(this.getId());
            var _this = this;
            var content = messages.map(function (msg) {
                if (typeof msg === "string") {
                    return "<span style='display:block'>" + msg.format([_this.getLayout().getLabel()]) + "</span>";
                } else {
                    return "<span style='display:block'>" + _this.getComponentOption("detailErrorMessage") + "</span>";
                }
            });
            $("#" + this.getHeaderLabelId()).popover({
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
        return (<div className={this.getCombineCSS("panel-heading n-table-heading","heading")}>
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
            var icon = this.getComponentOption("sortIcon");
            var sortClass = this.getCombineCSS("pull-right n-table-sort", "sort");
            if (this.state.sortColumn == column) {
                sortClass += " " + this.getCombineCSS("n-table-sorted", "sorted");
                if (this.state.sortWay == "asc") {
                    icon = this.getComponentOption("sortAscIcon");
                } else {
                    icon = this.getComponentOption("sortDescIcon");
                }
            }
            return (<a href="javascript:void(0);" className={sortClass}
                       onClick={this.onSortClicked.bind(this, column)}>
                <Icon icon={icon}/>
            </a>);
        }
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
        {this.columns.map(function (column) {
            if (columnIndex >= indexToRender.min && columnIndex <= indexToRender.max) {
                // column is fixed.
                columnIndex++;
                var style = {};
                style.width = column.width;
                if (!(column.visible === undefined || column.visible === true)) {
                    style.display = "none";
                }
                return (<td style={style}>
                    {column.title}
                    {_this.renderTableHeaderSortButton(column)}
                </td>);
            } else {
                columnIndex++;
            }
        })}
        </thead>);
    },
    /**
     * render operation cell
     * @param column
     * @param data
     * @returns {XML}
     */
    renderOperationCell: function (column, data) {
        var editButton = column.editable ?
            (<Button bsSize="xsmall" bsStyle="link" onClick={this.onEditClicked.bind(this, data)}
                     className="n-table-op-btn">
                <Icon icon={this.getComponentOption("rowEditButtonIcon")} size="lg"/>
            </Button>) : null;
        var removeButton = column.removable ?
            (<Button bsSize="xsmall" bsStyle="link" onClick={this.onRemoveClicked.bind(this, data)}
                     className="n-table-op-btn">
                <Icon icon={this.getComponentOption("rowRemoveButtonIcon")} size="lg" iconClassName="fa-middle"/>
            </Button>) : null;
        return (<ButtonGroup className="n-table-op-btn-group">
            {editButton}
            {removeButton}
        </ButtonGroup>);
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
        if (this.getModel().hasError(this.getId())) {
            var rowError = null;
            var errors = this.getModel().getError(this.getId());
            for (var index = 0, count = errors.length; index < count; index++) {
                if (typeof errors[index] !== "string") {
                    rowError = errors[index].getError(row);
                }
            }
            if (rowError != null) {
                className += " has-error";
            }
        }
        return (<tr className={className}>{
            this.columns.map(function (column) {
                if (columnIndex >= indexToRender.min && columnIndex <= indexToRender.max) {
                    // column is fixed.
                    columnIndex++;
                    var style = {width: column.width};
                    if (!(column.visible === undefined || column.visible === true)) {
                        style.display = "none";
                    }
                    var data;
                    if (column.editable || column.removable) {
                        // operation column
                        data = _this.renderOperationCell(column, row);
                    } else if (column.indexable) {
                        // index column
                        data = rowIndex;
                    } else {
                        // data is property name
                        data = _this.getDisplayTextOfColumn(column, row);
                    }
                    return (<td style={style}>{data}</td>);
                } else {
                    columnIndex++;
                }
            })
        }</tr>)
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
        return (<div className={this.getCombineCSS("n-table-panel-body", "panelBody")}>
            <table cellSpacing="0" className={this.getCombineCSS("n-table cell-border", "table")}
                   style={this.computeTableStyle()}
                   id={this.getId()}>
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
        return (<div className={this.getCombineCSS("n-table-panel-body", "panelBody")}>
            <div className="n-table-scroll-head" id={this.getScrolledHeaderDivId()}>
                <div className="n-table-scroll-head-inner" style={style}>
                    <table cellSpacing="0" className={this.getCombineCSS("n-table cell-border", "table")} style={style}>
                        {this.renderTableHeading(true)}
                    </table>
                </div>
            </div>
            <div className="n-table-scroll-body"
                 style={{maxHeight: this.getComponentOption("scrollY"), overflowY: "scroll"}}
                 id={this.getScrolledBodyDivId()}>
                <table cellSpacing="0" className={this.getCombineCSS("n-table cell-border", "table")} style={style}
                       id={this.getId()}>
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
        if (this.hasVerticalScrollBar()) {
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
        var divStyle = {width: this.computeFixedLeftColumnsWidth() + 1};
        var bodyDivStyle = {width: "100%", overflow: "hidden"};
        if (this.hasHorizontalScrollBar()) {
            // for IE8 box model
            bodyDivStyle.maxHeight = this.getComponentOption("scrollY") - ((this.isIE8()) ? 0 : 18);
        }
        return (
            <div className="n-table-fix-left" style={divStyle}>
                <table cellSpacing="0" style={{width: "100%"}}
                       className={this.getCombineCSS("n-table cell-border", "table")}>
                    {this.renderTableHeading(false, true)}
                </table>
                <div id={this.getFixedLeftBodyDivId()} style={bodyDivStyle}>
                    <table cellSpacing="0" className={this.getCombineCSS("n-table cell-border", "table")}>
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
        var divStyle = {width: this.computeFixedLeftColumnsWidth()};
        return (<div className="n-table-fix-left" style={divStyle}>
            <table cellSpacing="0" className={this.getCombineCSS("n-table cell-border", "table")}
                   style={{width: "100%"}}>
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
        if (!this.hasFixedLeftColumns()) {
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
        var divStyle = {width: this.computeFixedRightColumnsWidth() + 1};
        return (<div className="n-table-fix-right" style={divStyle}>
            <table cellSpacing="0" className={this.getCombineCSS("n-table cell-border", "table")}
                   style={{width: "100%"}}>
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
        var divStyle = {width: this.computeFixedRightColumnsWidth() + 1, right: "16px"};
        var bodyDivStyle = {width: "100%", overflow: "hidden"};
        if (this.hasHorizontalScrollBar()) {
            // ie8 box mode, scrollbar is not in height.
            // ie>8 or chrome, scrollbar is in height.
            bodyDivStyle.maxHeight = this.getComponentOption("scrollY") - ((this.isIE8()) ? 0 : 18);
        }
        return (
            <div className="n-table-fix-right" style={divStyle}>
                <div className="n-table-fix-right-head-wrapper">
                    <div className="n-table-fix-right-top-corner"/>
                    <table cellSpacing="0" style={{width: "100%"}}
                           className={this.getCombineCSS("n-table cell-border", "table")}>
                        {this.renderTableHeading(false, false, true)}
                    </table>
                </div>
                <div id={this.getFixedRightBodyDivId()} style={bodyDivStyle}>
                    <table cellSpacing="0" className={this.getCombineCSS("n-table cell-border", "table")}>
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
        if (!this.hasFixedRightColumns()) {
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
            return (<div className="n-table-no-data"><span>{this.getComponentOption("noDataLabel")}</span></div>);
        }
    },
    /**
     * render pagination
     * @returns {XML}
     */
    renderPagination: function () {
        if (this.isPageable() && this.hasDataToDisplay()) {
            // only show when pageable and has data to display
            return (<NPagination className="n-table-pagination" pageCount={this.state.pageCount}
                                 currentPageIndex={this.state.currentPageIndex} toPage={this.toPage}/>);
        } else {
            return null;
        }
    },
    /**
     * render
     * @returns {XML}
     */
    render: function () {
        this.prepareDisplayOptions();
        return (
            <div className={this.getCombineCSS("n-table-container panel panel-default", "div")} id={this.getDivId()}>
                {this.renderPanelHeading()}
                <div className={this.getCombineCSS("n-table-body-container panel-body", "body")}>
                    {this.renderTable()}
                    {this.renderFixedLeftColumns()}
                    {this.renderFixedRightColumns()}
                    {this.renderNoDataReminder()}
                </div>
                {this.renderPagination()}
                <NModalForm ref="editDialog" title={this.getLayout().getLabel()} css="n-table-edit-dialog"/>
                <NConfirm zIndex={9000} ref="confirmDialog"/>
            </div>
        );
    },
    /**
     * has vertical scroll bar
     * @returns {boolean}
     */
    hasVerticalScrollBar: function () {
        var scrollY = this.getComponentOption("scrollY");
        return scrollY === false ? false : true;
    },
    /**
     * has horizontal scroll bar
     * @returns {boolean}
     */
    hasHorizontalScrollBar: function () {
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
            this.columns.forEach(function (column) {
                if (column.visible === undefined || column.visible === true) {
                    width += column.width;
                }
            });
        } else {
            width = "100%";
        }
        return {width: width, maxWidth: width};
    },
    /**
     * compute fixed left columns width
     * @returns {number}
     */
    computeFixedLeftColumnsWidth: function () {
        var width = 0;
        var fixedLeftColumns = this.getMaxFixedLeftColumnIndex();
        var columnIndex = 0;
        this.columns.forEach(function (element) {
            if (columnIndex <= fixedLeftColumns && (element.visible === undefined || element.visible === true)) {
                // column is fixed.
                width += element.width;
            }
            columnIndex++;
        });
        return width;
    },
    /**
     * compute fixed right columns width
     * @returns {number}
     */
    computeFixedRightColumnsWidth: function () {
        var width = 0;
        var fixedRightColumns = this.getMinFixedRightColumnIndex();
        var columnIndex = 0;
        this.columns.forEach(function (element) {
            if (columnIndex >= fixedRightColumns && (element.visible === undefined || element.visible === true)) {
                // column is fixed
                width += element.width;
            }
            columnIndex++;
        });
        return width;
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
        return this.columns.length() - this.fixedRightColumns;
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
            this.state.countPerPage = this.getComponentOption("countPerPage");
            this.state.pageCount = this.computePageCount(data, this.state.countPerPage);
            this.state.currentPageIndex = this.state.currentPageIndex > this.state.pageCount ? this.state.pageCount : this.state.currentPageIndex;
            this.state.currentPageIndex = this.state.currentPageIndex <= 0 ? 1 : this.state.currentPageIndex;
            minRowIndex = (this.state.currentPageIndex - 1) * this.state.countPerPage + 1;
            maxRowIndex = minRowIndex + this.state.countPerPage - 1;
        }
        return {min: minRowIndex, max: maxRowIndex};
    },
    /**
     * compute page count
     * @param data {[*]}
     * @param countPerPage {number}
     * @returns {number}
     */
    computePageCount: function (data, countPerPage) {
        var pageCount = data.length == 0 ? 1 : data.length / countPerPage;
        return (Math.floor(pageCount) == pageCount) ? pageCount : (Math.floor(pageCount) + 1);
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
        return this.getComponentOption("addable");
    },
    /**
     * check the table is editable or not
     * @returns {boolean}
     */
    isEditable: function () {
        return this.getComponentOption("editable");
    },
    /**
     * check the table is removable or not
     * @returns {boolean}
     */
    isRemovable: function () {
        return this.getComponentOption("removable");
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
     * check the table is pageable or not
     * @returns {boolean}
     */
    isPageable: function () {
        return this.getComponentOption("pageable");
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
            } else if (column.editable || column.removable || column.indexable) {
                // operation and index column cannot sort
                return false;
            } else {
                return true;
            }
        } else {
            // even table is not sortable, the special column can be sortable
            return column.sort !== undefined && column.sort != null;
        }
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
        } else {
            text = data[column.data];
        }
        if (typeof text === "boolean") {
            if (text === true) {
                return "Y";
            } else if (text === false) {
                return "N";
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
            if (data.toString().toUpperCase().indexOf(text) != -1) {
                return true;
            }
            return false;
        });
    },
    /**
     * get data to display
     * @returns {[*]}
     */
    getDataToDisplay: function () {
        var data = this.getValueFromModel();
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
     * on add button clicked
     */
    onAddClicked: function () {
        var data = $pt.cloneJSON(this.getComponentOption("modelTemplate"));
        this.refs.editDialog.show(this.createEditingModel(data),
            $pt.createFormLayout(this.getComponentOption("editLayout")), {
                right: [{
                    icon: this.getComponentOption("editDialogSaveButtonIcon"),
                    text: this.getComponentOption("editDialogSaveButtonText"),
                    style: "primary",
                    onClick: this.onAddCompleted.bind(this)
                }]
            });
    },
    /**
     * on add completed
     */
    onAddCompleted: function () {
        var data = this.refs.editDialog.hide();
        this.getModel().add(this.getId(), data.getCurrentModel());
    },
    /**
     * on edit button clicked
     * @param data {*} data of row
     */
    onEditClicked: function (data) {
        this.refs.editDialog.show(this.createEditingModel(data),
            $pt.createFormLayout(this.getComponentOption("editLayout")), {
                right: [{
                    icon: this.getComponentOption("editDialogSaveButtonIcon"),
                    text: this.getComponentOption("editDialogSaveButtonText"),
                    style: "primary",
                    onClick: this.onEditCompleted.bind(this)
                }]
            });
    },
    /**
     * on edit completed
     */
    onEditCompleted: function () {
        var data = this.refs.editDialog.hide();
        var original = data.getOriginalModel();
        var current = data.getCurrentModel();
        this.getModel().update(this.getId(), original, current);
    },
    /**
     * on remove button clicked
     * @param data {*} data of row
     */
    onRemoveClicked: function (data) {
        var removeRow = function (data) {
            this.getModel().remove(this.getId(), data);
            this.refs.confirmDialog.hide();
        };
        this.refs.confirmDialog.show("Delete data?",
            ["Are you sure you want to delete data?", "Deleted data cannot be recovered."],
            removeRow.bind(this, data));
    },
    /**
     * on search box changed
     */
    onSearchBoxChanged: function (evt) {
        var value = evt.target.value;
        if (value == "") {
            this.setState({searchText: null});
        } else {
            this.setState({searchText: value});
        }
    },
    /**
     * on sort icon clicked
     * @param column
     */
    onSortClicked: function (column) {
        var sortWay = "asc";
        if (this.state.sortColumn == column) {
            // the column is sorted, so set sortWay as another
            sortWay = this.state.sortWay == "asc" ? "desc" : "asc";
        }
        var sorter = null;
        var isNumberValue = false;
        // specific sort
        if (column.sort !== undefined && column.sort != null) {
            if (typeof column.sort === "function") {
                sorter = column.sort;
            } else if (column.sort === "number") {
                isNumberValue = true;
            } else {
                throw $pt.createComponentException($pt.ComponentConstants.Err_Unuspported_Column_Sort,
                    "Column sort [" + column.sort + "] is not supported yet.");
            }
        }
        var _this = this;
        // if no sorter specific in column
        var sorter = sorter == null ? (function (a, b) {
            var v1 = _this.getDisplayTextOfColumn(column, a),
                v2 = _this.getDisplayTextOfColumn(column, b);
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
            this.getValueFromModel().sort(sorter);
        } else {
            this.getValueFromModel().sort(function (a, b) {
                return 0 - sorter(a, b);
            });
        }
        this.setState({sortColumn: column, sortWay: sortWay});
    },
    /**
     * create editing model
     * @param item
     */
    createEditingModel: function (item) {
        var modelValidator = this.getModel().getValidator();
        var tableValidator = modelValidator ? modelValidator.getConfig()[this.getId()] : null;
        var itemValidator = tableValidator ? $pt.createModelValidator(tableValidator["table"]) : null;
        return $pt.createModel(item, itemValidator);
    },
    /**
     * on model change
     * @param evt
     */
    onModelChange: function (evt) {
        if (evt.type == "add") {
            this.computePagination(this.getDataToDisplay());
            this.state.currentPageIndex = this.state.pageCount;
        } else if (evt.type == "remove") {
            // do nothing
        } else if (evt.type == "change") {
            // do nothing
        }

        if (this.getModel().getValidator() != null) {
            this.getModel().validate(this.getId());
        } else {
            this.forceUpdate();
        }
    },
    /**
     * on model validate change
     * @param evt
     */
    onModelValidateChange: function (evt) {
        // maybe will introduce performance issue, cannot sure now.
        this.forceUpdate();
    },
    /**
     * jump to page by given page index
     * @param pageIndex
     */
    toPage: function (pageIndex) {
        this.setState({currentPageIndex: pageIndex});
    },
    /**
     * get div id
     * @returns {string}
     */
    getDivId: function () {
        return "ntable-" + this.getId();
    },
    /**
     * get header label id
     * @returns {string}
     */
    getHeaderLabelId: function () {
        return "ntable-header-label-" + this.getId();
    },
    /**
     * get scrolled header div id
     * @returns {string}
     */
    getScrolledHeaderDivId: function () {
        return "ntable-scrolled-head-" + this.getId();
    },
    /**
     * get scrolled body div id
     * @returns {string}
     */
    getScrolledBodyDivId: function () {
        return "ntable-scrolled-body-" + this.getId();
    },
    /**
     * get scrolled fixed left body div id
     * @returns {string}
     */
    getFixedLeftBodyDivId: function () {
        return "ntable-scrolled-left-body-" + this.getId();
    },
    /**
     * get scrolled fixed right body div id
     * @returns {string}
     */
    getFixedRightBodyDivId: function () {
        return "ntable-scrolled-right-body-" + this.getId();
    }
}));
