(function (window, $, React, ReactDOM, $pt) {
	var NPagination = React.createClass({
		displayName: 'NPagination',
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
				maxButtonCountFromCurrent += (maxButtonCountFromCurrent - availablePageCountFromCurrent);
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
			if ((max - min) < maxPageButtons) {
				// no enough buttons
				max = min + maxPageButtons - 1;
				max = max > this.getPageCount() ? this.getPageCount() : max;
			}

			return {min: min, max: max};
		},
		/**
		 * render button which jump to first page
		 * @param buttonsRange
		 * @returns {XML}
		 */
		renderFirst: function (buttonsRange) {
			return (<li>
				<a href="javascript:void(0);" aria-label="First" onClick={this.toFirst}>
					<span className='fa fa-fw fa-fast-backward'/>
				</a>
			</li>);
		},
		/**
		 * render button which jump to previous page section
		 * @param buttonsRange
		 * @returns {XML}
		 */
		renderPreviousSection: function (buttonsRange) {
			return (<li>
				<a href="javascript:void(0);" aria-label="PreviousSection" onClick={this.toPreviousSection}>
					<span className='fa fa-fw fa-backward'/>
				</a>
			</li>);
		},
		/**
		 * render button which jump to previous page
		 * @param buttonsRange
		 * @returns {XML}
		 */
		renderPrevious: function (buttonsRange) {
			return (<li>
				<a href="javascript:void(0);" aria-label="Previous" onClick={this.toPrevious}>
					<span className='fa fa-fw fa-chevron-left'/>
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
				var css = {
					active: index == _this.getCurrentPageIndex()
				};
				return (<li key={index}>
					<a href="javascript:void(0);"
					   onClick={_this.toPage}
					   data-index={index}
					   className={$pt.LayoutHelper.classSet(css)}>{index}</a>
				</li>);
			});
		},
		/**
		 * render button which jump to next page
		 * @param buttonsRange
		 * @returns {XML}
		 */
		renderNext: function (buttonsRange) {
			return (<li>
				<a href="javascript:void(0);" aria-label="Next" onClick={this.toNext}>
					<span className='fa fa-fw fa-chevron-right'/>
				</a>
			</li>);
		},
		/**
		 * render button which jump to next page section
		 * @param buttonsRange
		 * @returns {XML}
		 */
		renderNextSection: function (buttonsRange) {
			return (<li>
				<a href="javascript:void(0);" aria-label="NextSection" onClick={this.toNextSection}>
					<span className='fa fa-fw fa-forward'/>
				</a>
			</li>);
		},
		/**
		 * render button which jump to last page
		 * @param buttonsRange
		 * @returns {XML}
		 */
		renderLast: function (buttonsRange) {
			return (<li>
				<a href="javascript:void(0);" aria-label="Last" onClick={this.toLast}>
					<span className='fa fa-fw fa-fast-forward'/>
				</a>
			</li>);
		},
		/**
		 * render status
		 * @returns {XML}
		 */
		renderStatus: function () {
			if (this.props.showStatus) {
				return (<div className="n-pagination-status col-sm-2 col-md-2 col-lg-2">
					<div>
						Page: {this.getCurrentPageIndex()} / {this.getPageCount()}
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
			return (<div className={$pt.LayoutHelper.classSet(css)}>
				{this.renderStatus()}
				<div className={$pt.LayoutHelper.classSet(buttonCSS)}>
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
}(window, jQuery, React, ReactDOM, $pt));
