/**
 * pagination
 */
var NPagination = React.createClass({
    /**
     * @override
     */
    propTypes: {
        // max page buttons
        maxPageButtons: React.PropTypes.number,
        // page count
        pageCount: React.PropTypes.number,
        // current page index, start from 1
        currentPageIndex: React.PropTypes.number,

        // jump to page, will be invoked when page index changed
        toPage: React.PropTypes.func.isRequired,

        className: React.PropTypes.string,

        // show status label
        showStatus: React.PropTypes.bool
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
        var maxPageButtons = this.props.maxPageButtons;
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
        var maxPageButtons = this.getMaxPageButtons();
        // calc the steps from currentPageIndex to maxPageIndex(pageCount)
        var max = 0;
        var availablePageCountFromCurrent = this.props.pageCount - this.props.currentPageIndex;
        var maxButtonCountFromCurrent = Math.floor(maxPageButtons / 2);
        if (availablePageCountFromCurrent >= maxButtonCountFromCurrent) {
            //
            max = parseInt(this.props.currentPageIndex) + maxButtonCountFromCurrent;
        } else {
            max = parseInt(this.props.currentPageIndex) + availablePageCountFromCurrent;
            // move to min buttons, since no enough available pages to display
            maxButtonCountFromCurrent += (maxButtonCountFromCurrent - availablePageCountFromCurrent);
        }
        // calc the steps from currentPageIndex to first page
        var min = 0;
        var availablePageCountBeforeCurrent = this.props.currentPageIndex - 1;
        if (availablePageCountBeforeCurrent >= maxButtonCountFromCurrent) {
            min = parseInt(this.props.currentPageIndex) - maxButtonCountFromCurrent;
        } else {
            min = 1;
        }

        // calc the steps
        if ((max - min) < maxPageButtons) {
            // no enough buttons
            max = min + maxPageButtons - 1;
            max = max > this.props.pageCount ? this.props.pageCount : max;
        }

        return {min: min, max: max};
    },
    /**
     * render button which jump to first page
     * @param buttonsRange
     * @returns {XML}
     */
    renderFirst: function (buttonsRange) {
        var className = "";
        if (this.props.currentPageIndex == 1) {
            className = "disabled";
        }
        return (<li className={className}>
            <a href="javascript:void(0);" aria-label="First" onClick={this.toFirst}>
                <Icon icon="fast-backward"/>
            </a>
        </li>);
    },
    /**
     * render button which jump to previous page section
     * @param buttonsRange
     * @returns {XML}
     */
    renderPreviousSection: function (buttonsRange) {
        var className = "";
        if (this.props.currentPageIndex == 1) {
            className = "disabled";
        }
        return (<li className={className}>
            <a href="javascript:void(0);" aria-label="PreviousSection" onClick={this.toPreviousSection}>
                <Icon icon="backward"/>
            </a>
        </li>);
    },
    /**
     * render button which jump to previous page
     * @param buttonsRange
     * @returns {XML}
     */
    renderPrevious: function (buttonsRange) {
        var className = "";
        if (this.props.currentPageIndex == 1) {
            className = "disabled";
        }
        return (<li className={className}>
            <a href="javascript:void(0);" aria-label="Previous" onClick={this.toPrevious}>
                <Icon icon="chevron-left"/>
            </a>
        </li>);
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
            var style = {};
            if (index == _this.props.currentPageIndex) {
                style.backgroundColor = "#eee";
            }
            return (<li>
                <a href="javascript:void(0);" onClick={_this.toPage} data-index={index} style={style}>{index}</a>
            </li>);
        });
    },
    /**
     * render button which jump to next page
     * @param buttonsRange
     * @returns {XML}
     */
    renderNext: function (buttonsRange) {
        var className = "";
        if (this.props.currentPageIndex == this.props.pageCount) {
            className = "disabled";
        }
        return (<li className={className}>
            <a href="javascript:void(0);" aria-label="Next" onClick={this.toNext}>
                <Icon icon="chevron-right"/>
            </a>
        </li>);
    },
    /**
     * render button which jump to next page section
     * @param buttonsRange
     * @returns {XML}
     */
    renderNextSection: function (buttonsRange) {
        var className = "";
        if (this.props.currentPageIndex == this.props.pageCount) {
            className = "disabled";
        }
        return (<li className={className}>
            <a href="javascript:void(0);" aria-label="NextSection" onClick={this.toNextSection}>
                <Icon icon="forward"/>
            </a>
        </li>);
    },
    /**
     * render button which jump to last page
     * @param buttonsRange
     * @returns {XML}
     */
    renderLast: function (buttonsRange) {
        var className = "";
        if (this.props.currentPageIndex == this.props.pageCount) {
            className = "disabled";
        }
        return (<li className={className}>
            <a href="javascript:void(0);" aria-label="Last" onClick={this.toLast}>
                <Icon icon="fast-forward"/>
            </a>
        </li>);
    },
    /**
     * render status
     * @returns {XML}
     */
    renderStatus: function () {
        if (this.props.showStatus) {
            return (<div className="pagination-status col-sm-2 col-md-2 col-lg-2">
                <div>
                    Page: {this.props.currentPageIndex} / {this.props.pageCount}
                </div>
            </div>);
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
        var className = "row" + (this.props.className ? (" " + this.props.className) : "");
        return (<div className={className}>
            {this.renderStatus()}
            <div className="col-sm-10 col-md-10 col-lg-10 pagination-status-buttons">
                <ul className="pagination">
                    {this.renderFirst(buttonsRange)}
                    {this.renderPreviousSection(buttonsRange)}
                    {this.renderPrevious(buttonsRange)}
                    {this.renderButtons(buttonsRange)}
                    {this.renderNext(buttonsRange)}
                    {this.renderNextSection(buttonsRange)}
                    {this.renderLast(buttonsRange)}
                </ul>
            </div>
        </div>);
    },
    /**
     * get current page index
     * @param button
     * @returns {*|jQuery}
     */
    getCurrentPageIndex: function (button) {
        return $(button).attr("data-index");
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
        var previousIndex = this.props.currentPageIndex - this.getMaxPageButtons();
        previousIndex = previousIndex < 1 ? 1 : previousIndex;
        this.jumpTo(previousIndex);
    },
    /**
     * jump to previous page
     */
    toPrevious: function () {
        var previousIndex = this.props.currentPageIndex - 1;
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
        var nextIndex = this.props.currentPageIndex + 1;
        this.jumpTo(nextIndex > this.props.pageCount ? this.props.pageCount : nextIndex);
    },
    /**
     * jump to next page section
     */
    toNextSection: function () {
        var nextIndex = this.props.currentPageIndex + this.getMaxPageButtons();
        nextIndex = nextIndex > this.props.pageCount ? this.props.pageCount : nextIndex;
        this.jumpTo(nextIndex);
    },
    /**
     * jump to last page
     */
    toLast: function () {
        this.jumpTo(this.props.pageCount);
    },
    /**
     * jump to given page index
     * @param pageIndex
     */
    jumpTo: function (pageIndex) {
        if (this.props.toPage) {
            this.props.toPage(pageIndex);
        }
    }
});