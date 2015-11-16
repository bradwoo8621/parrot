(function (context, $) {
	var $demo = $pt.getService(context, '$demo');

	var painter = function () {
		var cell = [
			{
				id: 'layout-cell-component',
				title: 'Component',
				desc: 'Cell has options to describe the inner component.',
				children: [
					{
						id: 'layout-cell-getComponentOption',
						title: '#getComponentOption',
						pattern: '#getComponentOption(key, defaultValue) : *',
						desc: <span>Get component option by given key.<br/>
						eg. Definition as <code>{"{comp: {'option-a': some-value}}"}</code>,<br/>
						call <code>cell.getComponentOption('option-a');</code>, returns <code>some-value</code>.<br/>
						Returns <code>defaultValue</code> if given option key is not defined or null.<br/>
						Returns whole <code>comp</code> JSON if no parameter passed.</span>
					}, {
						id: 'layout-cell-getComponentType',
						title: '#getComponentType',
						pattern: '#getComponentType() : JSON',
						desc: <span>Get componen type of cell.<br/>
						eg. Definition as <code>{"{comp: {type: 'text'}}"}</code>,<br/>
						call <code>cell.getComponentType();</code>, returns <code>{"{type: 'text', popover: true, label: true}"}</code>.<br/>
						<code>popover: true</code> and <code>label: true</code> will be appended if definition is string type.
						Or define as JSON, then returns JSON directly.<br/>
						Returns <code>{"{type: $pt.ComponentConstants.Text, popover: true, label: true}"}</code> if no type defined.</span>
					}, {
						id: 'layout-cell-getId',
						title: '#getId',
						pattern: '#getId() : string',
						desc: <span>Get id of cell. The parameter id in constructor.</span>
					}, {
						id: 'layout-cell-getLabel',
						title: '#getLabel',
						pattern: '#getLabel() : string',
						desc: <span>Get label of cell.<br/>
						eg. Definition as <code>{"{label: 'some-label'}"}</code>,<br/>
						call <code>cell.getLabel();</code>, returns <code>some-label</code>.</span>
					}
				]
			}, {
				id: 'layout-cell-data',
				title: 'Data',
				desc: 'Cell has options to describe how to bind with data model.',
				children: [
					{
						id: 'layout-cell-getDataId',
						title: '#getDataId',
						pattern: '#getDataId() : string',
						desc: <span>Get data id of cell.<br/>
						eg. Definition as <code>{"{dataId: some-id}"}</code>,<br/>
						call <code>cell.getDataId();</code>, returns <code>some-id</code>.<br/>
						Returns <code>id</code> if no data id defined in cell.</span>
					}
				]
			}, {
				id: 'layout-cell-position',
				title: 'Position',
				desc: 'Cell has a position to render it in its parent.',
				children: [
					{
						id: 'layout-cell-getCard',
						title: '#getCard',
						pattern: '#getCard() : string',
						desc: <span>Get card id of cell.<br/>
						eg. Definition as <code>{"{pos: {card: 'your-card-id'}}"}</code>,<br/>
						call <code>cell.getCard();</code>, returns <code>your-card-id</code>.<br/>
						Returns <code>CardLayout.DEFAULT_KEY</code> if no card defined in cell.</span>
					}, {
						id: 'layout-cell-getColumnIndex',
						title: '#getColumnIndex',
						pattern: '#getColumnIndex() : number',
						desc: <span>Get column index of cell.<br/>
						eg. Definition as <code>{"{pos: {col: column-index}}"}</code>,<br/>
						call <code>cell.getColumnIndex();</code>, returns <code>column-index</code>.<br/>
						Returns <code>CellLayout.DEFAULT_COLUMN</code> if no column index defined in cell.</span>
					}, {
						id: 'layout-cell-getRowIndex',
						title: '#getRowIndex',
						pattern: '#getRowIndex() : number',
						desc: <span>Get row index of cell.<br/>
						eg. Definition as <code>{"{pos: {row: row-index}}"}</code>,<br/>
						call <code>cell.getRowIndex();</code>, returns <code>row-index</code>.<br/>
						Returns <code>CellLayout.DEFAULT_ROW</code> if no row index defined in cell.</span>
					}, {
						id: 'layout-cell-getSection',
						title: '#getSection',
						pattern: '#getSection() : string',
						desc: <span>Get section id of cell.<br/>
						eg. Definition as <code>{"{pos: {section: 'your-section-id'}}"}</code>,<br/>
						call <code>cell.getSection();</code>, returns <code>your-section-id</code>.<br/>
						Returns <code>SectionLayout.DEFAULT_KEY</code> if no section defined in cell.</span>
					}, {
						id: 'layout-cell-getWidth',
						title: '#getWidth',
						pattern: '#getWidth() : number',
						desc: <span>Get wdith of cell.<br/>
						eg. Definition as <code>{"{pos: {width: some-width}}"}</code>,<br/>
						call <code>cell.getWidth();</code>, returns <code>some-width</code>.<br/>
						Returns <code>CellLayout.DEFAULT_WIDTH</code> if no width defined in cell.</span>
					}
				]
			}, {
				id: 'layout-cell-css',
				title: 'Style',
				desc: 'Cell has its additional CSS styles.',
				children: [
					{
						id: 'layout-cell-getAdditionalCSS',
						title: '#getAdditionalCSS',
						pattern: '#getAdditionalCSS(key: string, originalCSS: string) : string',
						desc: <span>Get additional CSS class.<br/>
						eg. Definition as <code>{"{css: {line: 'your-class-name'}}"}</code>,<br/>
						call <code>cell.getAdditionalCSS('line');</code>, returns <code>your-class-name</code>,<br/>
						or call <code>cell.getAdditionalCSS('line', 'org-class-name');</code>, returns <code>your-class-name
								org-class-name</code>.</span>
					}, {
						id: 'layout-cell-getCellCSS',
						title: '#getCellCSS',
						pattern: '#getCellCSS(originalCSS) : string',
						desc: <span>Shortcut to get CSS class of <code>cell</code>.<br/>
						eg. Definition as <code>{"{css: {cell: 'your-class-name'}}"}</code>,<br/>
						see <code>#getAdditionalCSS</code>.</span>
					}, {
						id: 'layout-cell-getComponentCSS',
						title: '#getComponentCSS',
						pattern: '#getComponentCSS(originalCSS) : string',
						desc: <span>Shortcut to get CSS class of <code>comp</code>.<br/>
						eg. Definition as <code>{"{css: {comp: 'your-class-name'}}"}</code>,<br/>
						see <code>#getAdditionalCSS</code>.</span>
					}, {
						id: 'layout-cell-getLabelCSS',
						title: '#getLabelCSS',
						pattern: '#getLabelCSS(originalCSS) : string',
						desc: <span>Shortcut to get CSS class of <code>label</code>.<br/>
						eg. Definition as <code>{"{css: {label: 'your-class-name'}}"}</code>,<br/>
						see <code>#getAdditionalCSS</code>.</span>
					}, , {
						id: 'layout-cell-isAdditionalCSSDefined',
						title: '#isAdditionalCSSDefined',
						pattern: '#isAdditionalCSSDefined(key: string) : boolean',
						desc: <span>Check if there is additional CSS defined for given key. Or check any additional CSS defined if no key passed.</span>
					}
				]
			}, {
				id: 'layout-cell-event',
				title: 'Event',
				desc: 'Cell has its event monitors.',
				children: [
					{
						id: 'layout-cell-getEventMonitor',
						title: '#getEventMonitor',
						pattern: '#getEventMonitor(key) : function|JSON',
						desc: <span>Get event mointor of cell.<br/>
						eg. Definition as <code>{"{evt: {keyUp: function() {}}}"}</code>,<br/>
						call <code>cell.getEventMonitor('keyUp');</code>, returns function.<br/>
						Returns whole event JSON if no key passed.</span>
					}
				]
			}, {
				id: 'layout-cell-constants',
				title: 'Constants',
				desc: <span><code>
					CellLayout.DEFAULT_ROW = 9999;<br/>
					CellLayout.DEFAULT_COLUMN = 9999;<br/>
					CellLayout.DEFAULT_WIDTH = 3;<br/>
				</code></span>
			}
		];
		var row = [
			{
				id: 'layout-row-addCell',
				title: '#addCell',
				pattern: '#addCell(cell: CellLayout) : RowLayout',
				desc: <span>Add cell into row. Returns row layout itself.</span>
			}, {
				id: 'layout-row-getCells',
				title: '#getCells',
				pattern: '#getCells() : CellLayout[]',
				desc: <span>Get all cells, sorted.</span>
			}, {
				id: 'layout-row-getRowIndex',
				title: '#getRowIndex',
				pattern: '#getRowIndex() : number',
				desc: <span>Get row index.</span>
			}
		];

		var section = [
			{
				id: 'layout-section-section',
				title: 'Section',
				desc: 'Section has options to describe itself.',
				children: [
					{
						id: 'layout-section-getId',
						title: '#getId',
						pattern: '#getId() : string',
						desc: <span>Get id of section. The parameter id in constructor.</span>
					}, {
						id: 'layout-section-getLabel',
						title: '#getLabel',
						pattern: '#getLabel() : string',
						desc: <span>Get label of section title.<br/>
						eg. Definition as <code>{"{label: 'some-label'}"}</code>,<br/>
						call <code>section.getLabel();</code>, returns <code>some-label</code>.</span>
					}, {
						id: 'layout-section-getParentCard',
						title: '#getParentCard',
						pattern: '#getParentCard() : CardLayout',
						desc: <span>Get parent card layout. section always in a card.</span>
					}, {
						id: 'layout-section-getVisible',
						title: '#getVisible',
						pattern: '#getVisible() : boolean|JSON',
						desc: <span>Get visible defition of section. see Form Cell for more information.</span>
					}
				]
			}, {
				id: 'layout-section-cells',
				title: 'Cell',
				desc: 'Section contains a set of cells.',
				children: [
					{
						id: 'layout-section-addCell',
						title: '#addCell',
						pattern: '#addCell(cell: CellLayout) : SectionLayout',
						desc: <span>Add cell into section. Returns section layout itself.<br/>
						Section will use the row index of cell to put cell into row, or create a RowLayout if not found.</span>
					}, {
						id: 'layout-section-getCell',
						title: '#getCell',
						pattern: '#getCell(id: string) : CellLayout',
						desc: <span>Get cell by given id.</span>
					}, {
						id: 'layout-section-getCells',
						title: '#getCells',
						pattern: '#getCells() : JSON',
						desc: <span>Get all cells.</span>
					}, {
						id: 'layout-section-getRows',
						title: '#getRows',
						pattern: '#getRows() : RowLayout[]',
						desc: <span>Get all rows. Sorted.</span>
					}, {
						id: 'layout-section-hasCell',
						title: '#hasCell',
						pattern: '#hasCell() : boolean',
						desc: <span>Check there is cell or not in current section.</span>
					}
				]
			}, {
				id: 'layout-section-checkInTitle',
				title: 'Check Box in Title',
				desc: 'Section allows an additional check box in title, see Form Panel for more explaination.',
				children: [
					{
						id: 'layout-section-getCheckInTitleCollapsible',
						title: '#getCheckInTitleCollapsible',
						pattern: '#getCheckInTitleCollapsible() : string',
						desc: <span>Get the check box in section title is related to collapsible or not, and its relation mode.
						eg. Definition as <code>{"{checkInTitle: {collapsible: 'your-mode'}}"}</code></span>
					}, {
						id: 'layout-section-getCheckInTitleDataId',
						title: '#getCheckInTitleDataId',
						pattern: '#getCheckInTitleDataId() : string',
						desc: <span>Get data id of the check box in section title.
						eg. Definition as <code>{"{checkInTitle: {data: 'data-id'}}"}</code></span>
					}, {
						id: 'layout-section-getCheckInTitleLabel',
						title: '#getCheckInTitleLabel',
						pattern: '#getCheckInTitleLabel() : string',
						desc: <span>Get label of the check box in section title.
						eg. Definition as <code>{"{checkInTitle: {label: 'some-label'}}"}</code></span>
					}, {
						id: 'layout-section-getCheckInTitleOption',
						title: '#getCheckInTitleOption',
						pattern: '#getCheckInTitleOption() : JSON',
						desc: <span>Get other options of the check box in section title.
						eg. Definition as <code>{"{checkInTitle: {collapsible: 'your-mode', data: 'data-id', 'other-option': 'other-value'}}"}</code>, <br/>
						call this method, return a JSON which already removed <code>collapsible</code>, <code>data</code> and <code>label</code>, other properties are kept.</span>
					}, {
						id: 'layout-section-getCheckInTitleValue',
						title: '#getCheckInTitleValue',
						pattern: '#getCheckInTitleValue() : string',
						desc: <span>Get value of the check box in section title by data id defined.</span>
					}, {
						id: 'layout-section-hasCheckInTitle',
						title: '#hasCheckInTitle',
						pattern: '#hasCheckInTitle() : boolean',
						desc: <span>Check there is check box in section title or not.</span>
					}
				]
			}, {
				id: 'layout-section-style',
				title: 'Style',
				desc: 'Style and CSS of section, see Form Panel for more explaination.',
				children: [
					{
						id: 'layout-section-getCollapsedLabel',
						title: '#getCollapsedLabel',
						pattern: '#getCollapsedLabel() : boolean',
						desc: <span>Get label when section is collapsed in section title.
						eg. Definition as <code>{"{collapsedLabel: something}"}</code></span>
					}, {
						id: 'layout-section-getExpandedLabel',
						title: '#getExpandedLabel',
						pattern: '#getExpandedLabel() : boolean',
						desc: <span>Get label when section is expanded in section title.
						eg. Definition as <code>{"{getExpandedLabel: something}"}</code></span>
					}, {
						id: 'layout-section-getStyle',
						title: '#getStyle',
						pattern: '#getStyle() : boolean',
						desc: <span>Get style of section.
						eg. Definition as <code>{"{style: 'some-style'}"}</code></span>
					}, {
						id: 'layout-section-isCollapsible',
						title: '#isCollapsible',
						pattern: '#isCollapsible() : boolean',
						desc: <span>Check the section is collapsible or not.
						eg. Definition as <code>{"{isCollapsible: boolean}"}</code></span>
					}, {
						id: 'layout-section-isExpanded',
						title: '#isExpanded',
						pattern: '#isExpanded() : boolean',
						desc: <span>Check the section is initial expanded or not.
						eg. Definition as <code>{"{isExpanded: boolean}"}</code></span>
					}
				]
			}, {
				id: 'layout-section-position',
				title: 'Position',
				desc: 'Section also can be a cell in its parent.',
				children: [
					{
						id: 'layout-section-getColumnIndex',
						title: '#getColumnIndex',
						pattern: '#getColumnIndex() : number',
						desc: <span>Get column index of section.
						eg. Definition as <code>{"{col: column-index}"}</code>, <br/>
						call <code>section.getColumnIndex();</code>, returns <code>column-index</code>.<br/>
						Returns <code>SectionLayout.DEFAULT_COLUMN_INDEX</code> if no column index defined in section.</span>
					}, {
						id: 'layout-section-getRowIndex',
						title: '#getRowIndex',
						pattern: '#getRowIndex() : number',
						desc: <span>Get row index of section.
						eg. Definition as <code>{"{row: row-index}"}</code>, <br/>
						call <code>section.getRowIndex();</code>, returns <code>row-index</code>.<br/>
						Returns <code>SectionLayout.DEFAULT_ROW_INDEX</code> if no row index defined in section.</span>
					}, {
						id: 'layout-section-getWidth',
						title: '#getWidth',
						pattern: '#getWidth() : number',
						desc: <span>Get width of section.
						eg. Definition as <code>{"{width: some-width}"}</code>, <br/>
						call <code>section.getWidth();</code>, returns <code>some-width</code>.<br/>
						Returns <code>SectionLayout.DEFAULT_WIDTH</code> if no width defined in section.</span>
					}
				]
			}, {
				id: 'layout-section-constants',
				title: 'Constants',
				desc: <span><code>
					SectionLayout.DEFAULT_ROW_INDEX = 9999;<br/>
					SectionLayout.DEFAULT_COLUMN_INDEX = 9999;<br/>
					SectionLayout.DEFAULT_WIDTH = 12;<br/>
					SectionLayout.DEFAULT_KEY = '_defaultSection';<br/>
				</code></span>
			}
		];

		var card = [
			{
				id: 'layout-card-card',
				title: 'Card',
				desc: 'Card has options to describe itself. see Form Tab and Form Button for more information.',
				children: [
					{
						id: 'layout-card-getBadgeId',
						title: '#getBadgeId',
						pattern: '#getBadgeId() : string',
						desc: <span>Get badge id of card.
						eg. Definition as <code>{"{badge: 'badge-id'}"}</code>.</span>
					}, {
						id: 'layout-card-getBadgeRender',
						title: '#getBadgeRender',
						pattern: '#getBadgeRender() : string',
						desc: <span>Get badge renderer of card.
						eg. Definition as <code>{"{badgeRender: function}"}</code>.</span>
					}, {
						id: 'layout-card-getFinishButton',
						title: '#getFinishButton',
						pattern: '#getFinishButton() : JSON',
						desc: <span>Get finish button of card.
						eg. Definition as <code>{"{finishButton: a-button}"}</code>.</span>
					}, {
						id: 'layout-card-getIcon',
						title: '#getIcon',
						pattern: '#getIcon() : string',
						desc: <span>Get icon of card.
						eg. Definition as <code>{"{icon: 'icon-name'}"}</code>.</span>
					}, {
						id: 'layout-card-getId',
						title: '#getId',
						pattern: '#getId() : string',
						desc: <span>Get id of card. The parameter id in constructor.</span>
					}, {
						id: 'layout-card-getIndex',
						title: '#getIndex',
						pattern: '#getIndex() : string',
						desc: <span>Get index of card.
						eg. Definition as <code>{"{index: some-index}"}</code>.<br/>
						Index is the card order of a set of cards. Returns <code>CardLayout.DEFAULT_CARD_INDEX</code> if not defined.</span>
					}, {
						id: 'layout-card-getLabel',
						title: '#getLabel',
						pattern: '#getLabel() : string',
						desc: <span>Get label of card title.
						eg. Definition as <code>{"{label: 'some-label'}"}</code>.</span>
					}, {
						id: 'layout-card-getLeftButtons',
						title: '#getLeftButtons',
						pattern: '#getLeftButtons() : JSON|JSON[]',
						desc: <span>Get left buttons of card.
						eg. Definition as <code>{"{leftButtons: some-buttons}"}</code>.</span>
					}, {
						id: 'layout-card-getRightButtons',
						title: '#getRightButtons',
						pattern: '#getRightButtons() : JSON|JSON[]',
						desc: <span>Get right buttons of card.
						eg. Definition as <code>{"{rightButtons: some-buttons}"}</code>.</span>
					}, {
						id: 'layout-card-hasBadge',
						title: '#hasBadge',
						pattern: '#hasBadge() : boolean',
						desc: <span>Check there is badge defined for card or not.</span>
					}, {
						id: 'layout-card-isActive',
						title: '#isActive',
						pattern: '#isActive() : boolean',
						desc: <span>Check the card is initial active or not.</span>
					}, {
						id: 'layout-card-isBackable',
						title: '#isBackable',
						pattern: '#isBackable() : boolean',
						desc: <span>Check the card is backable or not. false means can be back via previous button when already forwarded.</span>
					}, {
						id: 'layout-card-setActive',
						title: '#setActive',
						pattern: '#setActive(active: boolean) : CardLayout',
						desc: <span>Set card as initial active. Returns card layout itself.</span>
					}
				]
			}, {
				id: 'layout-card-sections',
				title: 'Section',
				desc: 'Card contains a set of sections.',
				children: [
					{
						id: 'layout-card-addCell',
						title: '#addCell',
						pattern: '#addCell(cell: CellLayout) : CardLayout',
						desc: <span>Add cell into card. Returns card layout itself.<br/>
						Card will use the section of cell to put cell into section, or create a SectionLayout if not found.</span>
					}, {
						id: 'layout-card-getCell',
						title: '#getCell',
						pattern: '#getCell(id: string) : CellLayout',
						desc: <span>Get cell by given id.</span>
					}, {
						id: 'layout-card-getCells',
						title: '#getCells',
						pattern: '#getCells() : JSON',
						desc: <span>Get all cells.</span>
					}, {
						id: 'layout-card-getSections',
						title: '#getSections',
						pattern: '#getSections() : SectionLayout[]',
						desc: <span>Get all setions. Sorted.</span>
					}, {
						id: 'layout-card-hasCell',
						title: '#hasCell',
						pattern: '#hasCell() : boolean',
						desc: <span>Check there is cell defined for card or not.</span>
					}
				]
			}, {
				id: 'layout-card-constants',
				title: 'Constants',
				desc: <span><code>
					CardLayout.DEFAULT_CARD_INDEX = 9999;<br/>
					CardLayout.DEFAULT_KEY = '_defaultCard';<br/>
				</code></span>
			}
		];

		var form = [
			{
				id: 'layout-form-getCards',
				title: '#getCards',
				pattern: '#getCards() : CardLayout[]',
				desc: <span>Get all cards. Sorted.</span>
			}, {
				id: 'layout-form-getCell',
				title: '#getCell',
				pattern: '#getCell(id: string) : CellLayout',
				desc: <span>Get cell by given id.</span>
			}, {
				id: 'layout-form-getCells',
				title: '#getCells',
				pattern: '#getCells() : JSON',
				desc: <span>Get all cells.</span>
			}, {
				id: 'layout-form-isCardButtonShown',
				title: '#isCardButtonShown',
				pattern: '#isCardButtonShown() : boolean',
				desc: <span>Check if show card buttons or not. <br/>
				eg. Definition as <code>{"{_cardButtonShown: boolean}"}</code>.<br/>
				Note it only controls the next and previous button which provided by Form component, the customized buttons always be shown.</span>
			}, {
				id: 'layout-form-isFreeCard',
				title: '#isFreeCard',
				pattern: '#isFreeCard() : boolean',
				desc: <span>Check if is a free card or not. <br/>
				eg. Definition as <code>{"{_freeCard: boolean}"}</code>.<br/>
				Cancel the wizard card mode if set to true, default is false.</span>
			}
		];

		var helper = [
			{
				id: 'layout-helper-classSet',
				title: '#classSet',
				pattern: '#classSet(JSON|string[]) : string',
				desc: <span>Copy from <code>React.addons.classSet</code> since it will be deprecated.<br/>
				Transform JSON or string array to CSS class string. For JSON, keys which has true value will be transformed.</span>
			}, {
				id: 'layout-helper-setDefaultCellWidth',
				title: '#setDefaultCellWidth',
				pattern: '#setDefaultCellWidth(width: number) : string',
				desc:
					<span>Set default cell width. Default is 3, width must be 1 to 12, will not check the parameter.</span>
			}, {
				id: 'layout-helper-setDefaultSectionWidth',
				title: '#setDefaultSectionWidth',
				pattern: '#setDefaultSectionWidth(width: number) : string',
				desc: <span>Set default section width. Default is 3, width must be 1 to 12, will not check the parameter.</span>
			}, {
				id: 'layout-helper-registerComponent',
				title: '#registerComponent',
				pattern: '#registerComponent(id: string, component: *) : LayoutHelper',
				desc: <span>Register component to component central. If meet the duplicated <code>id</code>, register into an array.</span>
			}, {
				id: 'layout-helper-unregisterComponent',
				title: '#unregisterComponent',
				pattern: '#unregisterComponent(id: string, component: *) : LayoutHelper',
				desc: <span>Unregister component from component central. If no <code>component</code> passed, unregister all components with give id.</span>
			}, {
				id: 'layout-helper-getComponent',
				title: '#getComponent',
				pattern: '#getComponent(id: string) : ReactComponent|ReactComponent[]',
				desc: <span>Get component which was registered in central. Return array or single component.</span>
			}, {
				id: 'layout-helper-forceUpdate',
				title: '#forceUpdate',
				pattern: '#forceUpdate(id: string) : LayoutHelper',
				desc: <span>Force update component which was registered in central if it has #forceUpdate() method.</span>
			}
		];

		var items = [
			{
				id: 'layout-cell',
				title: 'CellLayout',
				pattern: '$pt.createCellLayout(id: string, cell: JSON) : CellLayout',
				desc: <span>Create a cell layout by given id and cell definition.</span>,
				children: cell
			}, {
				id: 'layout-row',
				title: 'RowLayout',
				pattern: '$pt.createCellLayout(rowIndex: number, cells: JSON|JSON[]) : RowLayout',
				desc: <span>Create a row layout by given rows index and cells definition. Cells is optional.</span>,
				children: row
			}, {
				id: 'layout-section',
				title: 'SectionLayout',
				pattern: '$pt.createSectionLayout(section: JSON, id: string, parentCard: CardLayout) : SectionLayout',
				desc: <span>Create a section layout by given id, parent card id and section definition.
				Cells in section is defined in <code>{'{layout: {}}'}</code> of parameter <code>section</code>.<br/>
				Note section always in a card.</span>,
				children: section
			}, {
				id: 'layout-card',
				title: 'CardLayout',
				pattern: '$pt.createCardLayout(card: JSON, id: string) : CardLayout',
				desc: <span>Create a card layout by given id and card definition.
				Sections in card is defined in <code>{'{_sections: {}}'}</code> of parameter <code>card</code>.<br/>
				Note component cannot be defined in card directly, always under hierarchy Card/Section/Component.</span>,
				children: card
			}, {
				id: 'layout-form',
				title: 'FormLayout',
				pattern: '$pt.createFormLayout(layout: JSON[, layout: JSON...]) : FormLayout',
				desc: <span>Create a form layout by given form definition.
				Cards in form is defined in <code>{'{_cards: {}}'}</code> of parameter <code>layout</code>.<br/>
				Sections in form is defined in <code>{'{_sections: {}}'}</code> of parameter <code>layout</code>.<br/>
				Cells in form is defined in <code>{'{some-key: {}}'}</code> of parameter <code>layout</code>.<br/>
				Note:<br/>
				1. If <code>_cards</code> defined, <code>_sections</code> will be skipped automatically.<br/>
				2. Default card will be created only if no <code>_cards</code> defined.<br/>
				3. Default section will be created only if no <code>_sections</code> defined. This rule is for each card.<br/>
				4. Cells can be defined in <code>{'{_sections: {some-section-key: {layout: {some-cell-key: {}}}}}'}</code>, or
				define in form JSON directly by define <code>{'{pos: {card: some-card-key, section: some-section-key}}'}</code>.
				<code>card</code> and <code>section</code> in <code>pos</code> are not required,
				if not defined, will be assigned to default card or default section.</span>,
				children: form
			}, {
				id: 'layout-helper',
				title: 'Helper',
				pattern: '$pt.LayoutHelper',
				desc: <span>A set of helper functions.</span>,
				children: helper
			},
			{
				id: 'layout-component-constants',
				title: 'Component Constants',
				desc: <Code
					code={$demo.convertJSON({variable: '$pt.ComponentConstants', json: $pt.ComponentConstants})}/>
			}
		];
		return items;
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.layout = function () {
		React.render(<APIList title='Layout' items={painter()}/>, document.getElementById('main'));

	};
}(this, jQuery));
