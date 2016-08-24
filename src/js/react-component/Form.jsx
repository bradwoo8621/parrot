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
			return <$pt.Components.NPanel model={this.getModel()}
			               layout={$pt.createCellLayout(sections[0].getParentCard().getId() + '-body', sectionLayout)}
			               direction={this.getLabelDirection()}
						   view={this.isViewMode()}/>;
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
				footer = (<$pt.Components.NPanelFooter right={right} left={left} model={this.getModel()} view={this.isViewMode()}/>);
			}
			return (<div className={$pt.LayoutHelper.classSet(css)} key={index}>
				{this.renderSections(card.getSections())}
				{footer}
			</div>);
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
				return (<span className='badge'> {badge}</span>);
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
			return (<ul className={css} key='wizards'>
				{this.getLayout().getCards().map(function (card, cardIndex) {
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
						icon = <span className={$pt.LayoutHelper.classSet(iconCSS)}/>;
					}
					return (<li className={$pt.LayoutHelper.classSet(css)} key={cardIndex}>
						<a href='javascript:void(0);' onClick={click}>
							{icon} {card.getLabel()}
							{_this.renderBadge(card)}
						</a>
					</li>);
				})}
			</ul>);
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
			return (<div className={$pt.LayoutHelper.classSet(css)}>{this.renderCards()}</div>);
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
		isViewMode: function() {
			var isViewMode = this.state ? this.state.isViewMode : null;
			if (isViewMode == null) {
				return this.props.view === true;
			} else {
				return isViewMode;
			}
		},
		isFreeCard: function() {
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
		getLabelDirection: function() {
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
		return <$pt.Components.NForm {...$pt.LayoutHelper.transformParameters(model, formLayout, direction, viewMode)}/>;
	});
}(window, jQuery, React, ReactDOM, $pt));
