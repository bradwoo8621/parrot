(function(window, $, moment, React, ReactDOM, $pt) {
	var NDateTime = React.createClass($pt.defineCellComponent({
		displayName: 'NDateTime',
		mixins: [$pt.mixins.PopoverMixin],
		statics: {
			POP_FIX_ON_BOTTOM: false,
			FORMAT: 'YYYY/MM/DD',
			HEADER_MONTH_FORMAT: 'MMMM',
			HEADER_YEAR_FORMAT: 'YYYY',
			VALUE_FORMAT: $pt.ComponentConstants.Default_Date_Format,
			FORMAT_TYPES: {
				// use binary
				ALL: 64 + 32 + 16 + 8 + 4 + 2,
				YMD: 64 + 32 + 16,
				YM: 64 + 32,
				HM: 8 + 4,
				HMS: 8 + 4 + 2,

				YEAR: 64,
				MONTH: 32,
				DAY: 16,
				HOUR: 8,
				MINUTE: 4,
				SECOND: 2,
				MILLSECOND: 1
			},
			CLOCK_RADIUS: 100,
			CLOCK_HOUR_PERCENTAGE: 0.6,
			CLOCK_BIG_ENGRAVE_LENGTH: 8,
			CLOCK_SMALL_ENGRAVE_LENGTH: 4,
			CLOCK_CHAR_POS: {
				TOP: {X: 100, Y: -2},
				LEFT: {X: -1, Y: 99},
				RIGHT: {X: 201, Y: 99},
				BOTTOM: {X: 100, Y: 203}
			},
			CLOCK_HAND_OFFSET: 10,
			CLOSE_TEXT: 'Close',
			TODAY_TEXT: 'Now',
			CLEAR_TEXT: 'Clear',
			DATE_SWITCH_TEXT: 'Date',
			TIME_SWITCH_TEXT: 'Time'
		},
		getDefaultProps: function() {
			return {
				defaultOptions: {
					locale: 'en',
					headerMonthFirst: true,
					bodyYearFormat: 'YYYY',
					icons: {
						calendar: 'calendar',
						today: 'crosshairs',
						clear: 'trash-o',
						close: 'close'
					}
				}
			};
		},
		beforeDidUpdate: function() {
			this.setValueToTextInput(this.getValueFromModel());
		},
		beforeDidMount: function() {
			this.setValueToTextInput(this.getValueFromModel());
		},
		beforeWillUnmount: function() {
			this.destroyPopover();
		},
		renderIcon: function(options) {
			var css = {
				fa: true,
				'fa-fw': true
			};
			css['fa-' + options.icon] = true;
			if (options.className) {
				css[options.className] = true;
			}
			return <span className={$pt.LayoutHelper.classSet(css)} onClick={options.click}/>;
		},
		renderInputArea: function() {
			// desktop
			var css = {
				'input-group-addon': true,
				link: true,
				disabled: !this.isEnabled()
			};
			return (<div className='input-group' 
						 onClick={this.onCalendarButtonClicked}
						 ref='comp'>
				<input type='text'
					   className='form-control'
					   disabled={!this.isEnabled()}
					   onChange={this.onTextInputChange}
					   onFocus={this.onTextInputFocused}
					   onBlur={this.onTextInputBlurred}
					   aria-readonly={this.isMobile() ? true : false}
					   readOnly={this.isMobile() ? true : false}
					   ref='text'/>
				<span className={$pt.LayoutHelper.classSet(css)}>
					{this.renderIcon({icon: this.getIcon('calendar'), click: this.onCalendarButtonClicked})}
				</span>
			</div>)
		},
		render: function() {
			if (this.isViewMode()) {
				return this.renderInViewMode();
			}
			var divCSS = {
				'n-disabled': !this.isEnabled()
			};
			divCSS[this.getComponentCSS('n-datetime')] = true;
			return (<div className={$pt.LayoutHelper.classSet(divCSS)}>
				{this.renderInputArea()}
				{this.renderNormalLine()}
				{this.renderFocusLine()}
			</div>);
		},
		renderHeaderMonth: function(date) {
			return (<span onClick={this.renderPopover.bind(this, {date: date, type: NDateTime.FORMAT_TYPES.MONTH})}
						  className='header-date-btn'
						  key='header-month'>
				{this.convertValueToString(date, this.getHeaderMonthFormat())}
			</span>);
		},
		renderHeaderYear: function(date) {
			return (<span onClick={this.renderPopover.bind(this, {date: date, type: NDateTime.FORMAT_TYPES.YEAR})}
						  className='header-date-btn'
						  key='header-year'>
				{this.convertValueToString(date, this.getHeaderYearFormat())}
			</span>);
		},
		renderDayHeader: function(date) {
			var mainHeader = [this.renderHeaderMonth(date), ' ', this.renderHeaderYear(date)];
			var monthFirst = this.getComponentOption('headerMonthFirst');
			return (<div className='calendar-header day-view'>
				{this.renderIcon({
					icon: 'angle-double-left',
					className: 'header-btn left',
					click: this.renderPopover.bind(this, {date: date.clone().subtract(1, 'y'), type: NDateTime.FORMAT_TYPES.DAY})
				})}
				{this.renderIcon({
					icon: 'angle-left',
					className: 'header-btn left',
					click: this.renderPopover.bind(this, {date: date.clone().subtract(1, 'M'), type: NDateTime.FORMAT_TYPES.DAY})
				})}
				{monthFirst ? mainHeader : mainHeader.reverse()}
				{this.renderIcon({
					icon: 'angle-double-right',
					className: 'header-btn right',
					click: this.renderPopover.bind(this, {date: date.clone().add(1, 'y'), type: NDateTime.FORMAT_TYPES.DAY})
				})}
				{this.renderIcon({
					icon: 'angle-right',
					className: 'header-btn right',
					click: this.renderPopover.bind(this, {date: date.clone().add(1, 'M'), type: NDateTime.FORMAT_TYPES.DAY})
				})}
			</div>);
		},
		getWeekdayHeader: function(date) {
			var orgLocale = moment.locale();
			moment.locale(this.getLocale());
			var header = moment.weekdaysMin();
			moment.locale(orgLocale);
			var firstDayOfWeek = this.getFirstDayOfWeek();
			// move how many to last
			var removed = header.splice(0, firstDayOfWeek);
			header = header.concat.apply(header, removed);
			return header;
		},
		getDaysOfDayBody: function(date) {
			var days = this.getDaysOfMonth(date);
			var firstDay = date.clone();
			firstDay.date(1); // set to the first day of month
			var dayOfWeekOfFirstDay = this.getDayOfWeek(firstDay);
			var firstDayOfWeek = this.getFirstDayOfWeek();
			var gapDaysOfPrevMonth = 0;
			if (dayOfWeekOfFirstDay >= firstDayOfWeek) {
				gapDaysOfPrevMonth = dayOfWeekOfFirstDay - firstDayOfWeek;
			} else {
				gapDaysOfPrevMonth = dayOfWeekOfFirstDay + 7 - firstDayOfWeek;
			}
			// calculate
			var index = 0;
			var viewDays = [];
			var viewDay = null;
			// gap days by previous month
			for (index = 1; index <= gapDaysOfPrevMonth; index++) {
				viewDay = firstDay.clone();
				viewDay.subtract(index, 'd');
				viewDays.splice(0, 0, viewDay);
			}
			// this month
			for (index = 0; index < days; index++) {
				viewDay = firstDay.clone();
				viewDay.add(index, 'd');
				viewDays.push(viewDay);
			}
			// gap days by next month
			var gapDaysOfNextMonth = 7 - viewDays.length % 7;
			gapDaysOfNextMonth = (gapDaysOfNextMonth == 7) ? 0 : gapDaysOfNextMonth;
			var lastDay = viewDays[viewDays.length - 1];
			for (index = 1; index <= gapDaysOfNextMonth; index++) {
				viewDay = lastDay.clone();
				viewDay.add(index, 'd');
				viewDays.push(viewDay);
			}
			return viewDays;
		},
		renderDayBody: function(date) {
			var _this = this;
			var header = this.getWeekdayHeader();
			var days = this.getDaysOfDayBody(date);
			var currentMonth = date.month();
			var value = this.getValueFromModel();
			var today = this.getToday();
			return (<div className='calendar-body day-view'>
				<div className='day-view-body-header row'>
					{header.map(function(weekday, weekdayIndex) {
						return <div className='cell-7-1' key={'weekday-' + weekdayIndex}>{weekday}</div>;
					})}
				</div>
				<div className='day-view-body-body row'>
					{days.map(function(day, dayIndex) {
						var css = {
							'cell-7-1': true,
							'gap-day': (day.month() != currentMonth),
							today: day.isSame(today, 'day'),
							'current-value': value != null && day.isSame(value, 'day')
						};
						return (<div className={$pt.LayoutHelper.classSet(css)}
									 onClick={_this.onDaySelected.bind(_this, day)}
									 key={'day-' + dayIndex}>
							<span>{day.date()}</span>
						</div>);
					})}
				</div>
			</div>);
		},
		renderMonthHeader: function(date) {
			return (<div className='calendar-header month-view'>
				{this.renderIcon({
					icon: 'angle-double-left',
					className: 'header-btn left',
					click: this.renderPopover.bind(this, {date: date.clone().subtract(10, 'y'), type: NDateTime.FORMAT_TYPES.MONTH})
				})}
				{this.renderIcon({
					icon: 'angle-left',
					className: 'header-btn left',
					click: this.renderPopover.bind(this, {date: date.clone().subtract(1, 'y'), type: NDateTime.FORMAT_TYPES.MONTH})
				})}
				{this.renderHeaderYear(date)}
				{this.renderIcon({
					icon: 'angle-double-right',
					className: 'header-btn right',
					click: this.renderPopover.bind(this, {date: date.clone().add(10, 'y'), type: NDateTime.FORMAT_TYPES.MONTH})
				})}
				{this.renderIcon({
					icon: 'angle-right',
					className: 'header-btn right',
					click: this.renderPopover.bind(this, {date: date.clone().add(1, 'y'), type: NDateTime.FORMAT_TYPES.MONTH})
				})}
			</div>);
		},
		renderMonthBody: function(date) {
			var _this = this;
			var orgLocale = moment.locale();
			moment.locale(this.getLocale());
			var months = moment.monthsShort('-MMM-');
			moment.locale(orgLocale);
			var day = this.getValueFromModel();
			if (day == null) {
				day = this.getToday();
			}
			var value = this.getValueFromModel();
			var today = this.getToday();
			return (<div className='calendar-body month-view'>
				<div className='month-view-body-body row'>
					{months.map(function(month, index) {
						var selectedDay = day.clone();
						selectedDay.year(date.year());
						selectedDay.month(index);
						var css = {
							'cell-4-1': true,
							today: index == today.month(),
							'current-value': value != null && index == value.month()
						};
						return (<div className={$pt.LayoutHelper.classSet(css)}
									 onClick={_this.onMonthSelected.bind(_this, selectedDay)}
									 key={index}>
							{month}
						</div>);
					})}
				</div>
			</div>);
		},
		renderYearHeader: function(date) {
			var yearHeader = [
				this.convertValueToString(date.clone().subtract(10, 'y'), this.getHeaderYearFormat()),
				' - ',
				this.convertValueToString(date.clone().add(9, 'y'), this.getHeaderYearFormat())
			];
			return (<div className='calendar-header year-view'>
				{this.renderIcon({
					icon: 'angle-double-left',
					className: 'header-btn left',
					click: this.renderPopover.bind(this, {date: date.clone().subtract(40, 'y'), type: NDateTime.FORMAT_TYPES.YEAR})
				})}
				{this.renderIcon({
					icon: 'angle-left',
					className: 'header-btn left',
					click: this.renderPopover.bind(this, {date: date.clone().subtract(20, 'y'), type: NDateTime.FORMAT_TYPES.YEAR})
				})}
				{yearHeader}
				{this.renderIcon({
					icon: 'angle-double-right',
					className: 'header-btn right',
					click: this.renderPopover.bind(this, {date: date.clone().add(40, 'y'), type: NDateTime.FORMAT_TYPES.YEAR})
				})}
				{this.renderIcon({
					icon: 'angle-right',
					className: 'header-btn right',
					click: this.renderPopover.bind(this, {date: date.clone().add(20, 'y'), type: NDateTime.FORMAT_TYPES.YEAR})
				})}
			</div>);
		},
		renderYearBody: function(date) {
			var _this = this;
			var day = this.getValueFromModel();
			if (day == null) {
				day = this.getToday();
			}
			var value = this.getValueFromModel();
			var today = this.getToday();
			var years = [];
			for (var index = -10; index <= 9; index++) {
				var year = date.clone().set({month: day.month(), date: day.date(), hour: day.hour(), minute: day.minute(), second: day.second(), millisecond: day.millisecond()});
				year.add(index, 'y');
				years.push(year);
			}
			return (<div className='calendar-body month-view'>
				<div className='year-view-body-body row'>
					{years.map(function(year, yearIndex) {
						var css = {
							'cell-4-1': true,
							today: year.year() == today.year(),
							'current-value': value != null && year.year() == value.year()
						};
						return (<div className={$pt.LayoutHelper.classSet(css)}
									 onClick={_this.onYearSelected.bind(_this, year)}
									 key={yearIndex}>
							{year.format(_this.getBodyYearFormat())}
						</div>);
					})}
				</div>
			</div>);
		},
		renderPopoverContentFooterButton: function(options) {
			return (<div className='cell-3-1' onClick={options.click}>
				{this.renderIcon({icon: this.getIcon(options.icon)})}
			</div>);
		},
		renderPopoverContentFooterForMobile: function(today, type) {
			var viewSwitch = null;
			if (this.hasDateToDisplay() && this.hasTimeToDisplay()) {
				viewSwitch = [];
				// is date view, show time switch
				viewSwitch.push(<a href='javascript:void(0);' 
								   onClick={this.switchToTimeViewOnMobile} 
								   className={'time-switch' + (this.state.dateViewWhenMobilePhone ? '' : ' hidden')}
								   key='date'>
					<span>{NDateTime.TIME_SWITCH_TEXT}</span>
				</a>);
				// not date view, show date switch
				viewSwitch.push(<a href='javascript:void(0);' 
								   onClick={this.switchToDateViewOnMobile} 
								   className={'date-switch' + (this.state.dateViewWhenMobilePhone ? ' hidden' : '')}
								   key='time'>
					<span>{NDateTime.DATE_SWITCH_TEXT}</span>
				</a>);
			}
			return (<div className='calendar-footer row'>
				<div>
					<a href='javascript:void(0);' onClick={this.hidePopover}>
						<span>{NDateTime.CLOSE_TEXT}</span>
					</a>
					<a href='javascript:void(0);' onClick={this.renderPopover.bind(this, {
						date: null,
						type: type,
						set: true
					})}>
						<span>{NDateTime.CLEAR_TEXT}</span>
					</a>
					<a href='javascript:void(0);' onClick={this.renderPopover.bind(this, {
						date: today,
						type: type,
						set: true
					})}>
						<span>{NDateTime.TODAY_TEXT}</span>
					</a>
					{viewSwitch}
				</div>
			</div>);
		},
		renderPopoverContentFooterForDesk: function(today, type) {
			return (<div className='calendar-footer row'>
				{this.renderPopoverContentFooterButton({
					icon: 'today',
					click: this.renderPopover.bind(this, {
						date: today,
						type: type,
						set: true
					})
				})}
				{this.renderPopoverContentFooterButton({
					icon: 'clear',
					click: this.renderPopover.bind(this, {
						date: null,
						type: type,
						set: true
					})
				})}
				{this.renderPopoverContentFooterButton({
					icon: 'close',
					click: this.hidePopover
				})}
			</div>);
		},
		renderPopoverContentFooter: function(today, type) {
			if (this.isMobilePhone()) {
				return this.renderPopoverContentFooterForMobile(today, type);
			} else {
				return this.renderPopoverContentFooterForDesk(today, type);
			}
		},
		renderEngrave: function(degree, radius, length, className, offset) {
			var startLength = radius - length;
			return (<line className={className}
						  x1={startLength * Math.cos(Math.PI * 2 * degree / 360) + offset}
						  y1={offset - startLength * Math.sin(Math.PI * 2 * degree / 360)}
						  x2={radius * Math.cos(Math.PI * 2 * degree / 360) + offset}
						  y2={offset - radius * Math.sin(Math.PI * 2 * degree / 360)}
						  key={degree}/>);
		},
		render12HourDial: function(date, popoverType) {
			var _this = this;
			var am = date.hour() <= 11; // 0-23
			var hourRadius = this.getHourRadius();
			return (<g key='hour-12-dial'>
				<text className={'text hour-12 am' + (am ? ' yes' : '')}
					  onClick={this.onAMPMSelected.bind(this, true, popoverType)}
					  x={0}
					  y={0}>AM</text>
				<text className={'text hour-12 pm' + (am ? '' : ' yes')}
					  onClick={this.onAMPMSelected.bind(this, false, popoverType)}
					  x={NDateTime.CLOCK_RADIUS * 2}
					  y={0}>PM</text>
				<text className='text hour-12 top-num'
					  x={NDateTime.CLOCK_CHAR_POS.TOP.X}
					  y={NDateTime.CLOCK_CHAR_POS.TOP.Y + NDateTime.CLOCK_RADIUS - hourRadius}>0</text>
				<text className='text hour-12 left-num'
					  x={NDateTime.CLOCK_CHAR_POS.LEFT.X + NDateTime.CLOCK_RADIUS - hourRadius}
					  y={NDateTime.CLOCK_CHAR_POS.LEFT.Y}>9</text>
				<text className='text hour-12 right-num'
					  x={NDateTime.CLOCK_CHAR_POS.RIGHT.X - NDateTime.CLOCK_RADIUS + hourRadius}
					  y={NDateTime.CLOCK_CHAR_POS.RIGHT.Y}>3</text>
				<text className='text hour-12 bottom-num'
					  x={NDateTime.CLOCK_CHAR_POS.BOTTOM.X}
					  y={NDateTime.CLOCK_CHAR_POS.BOTTOM.Y - NDateTime.CLOCK_RADIUS + hourRadius}>6</text>
				{[30, 60, 120, 150, 210, 240, 300, 330].map(function(degree) {
					return _this.renderEngrave(degree,
						hourRadius,
						NDateTime.CLOCK_SMALL_ENGRAVE_LENGTH,
						'big',
						NDateTime.CLOCK_RADIUS);
				})}
			</g>);
		},
		render24HourDial: function() {
			var _this = this;
			var hourRadius = this.getHourRadius();
			return (<g key='hour-24-dial'>
				<text className='text hour-24 top-num'
					  x={NDateTime.CLOCK_CHAR_POS.TOP.X}
					  y={NDateTime.CLOCK_CHAR_POS.TOP.Y + NDateTime.CLOCK_RADIUS - hourRadius}>0</text>
				<text className='text hour-24 left-num'
					  x={NDateTime.CLOCK_CHAR_POS.LEFT.X + NDateTime.CLOCK_RADIUS - hourRadius}
					  y={NDateTime.CLOCK_CHAR_POS.LEFT.Y}>18</text>
				<text className='text hour-24 right-num'
					  x={NDateTime.CLOCK_CHAR_POS.RIGHT.X - NDateTime.CLOCK_RADIUS + hourRadius}
					  y={NDateTime.CLOCK_CHAR_POS.RIGHT.Y}>6</text>
				<text className='text hour-24 bottom-num'
					  x={NDateTime.CLOCK_CHAR_POS.BOTTOM.X}
					  y={NDateTime.CLOCK_CHAR_POS.BOTTOM.Y - NDateTime.CLOCK_RADIUS + hourRadius}>12</text>
				{[45, 135, 225, 315].map(function(degree) {
					return _this.renderEngrave(degree,
						hourRadius,
						NDateTime.CLOCK_BIG_ENGRAVE_LENGTH,
						'big',
						NDateTime.CLOCK_RADIUS);
				})}
				{[15, 30, 60, 75, 105, 120, 150, 165, 195, 210, 240, 255, 285, 300, 330, 345].map(function(degree) {
					return _this.renderEngrave(degree,
						hourRadius,
						NDateTime.CLOCK_SMALL_ENGRAVE_LENGTH,
						'small',
						NDateTime.CLOCK_RADIUS);
				})}
			</g>);
		},
		renderMinuteDial: function() {
			if (!this.hasMinute()) {
				// no minute need to display
				return null;
			}
			var _this = this;
			return (<g key='minute-dial'>
				<text className='text minute top-num'
					  x={NDateTime.CLOCK_CHAR_POS.TOP.X}
					  y={NDateTime.CLOCK_CHAR_POS.TOP.Y}>0</text>
				<text className='text minute left-num'
					  x={NDateTime.CLOCK_CHAR_POS.LEFT.X}
					  y={NDateTime.CLOCK_CHAR_POS.LEFT.Y}>45</text>
				<text className='text minute right-num'
					  x={NDateTime.CLOCK_CHAR_POS.RIGHT.X}
					  y={NDateTime.CLOCK_CHAR_POS.RIGHT.Y}>15</text>
				<text className='text minute bottom-num'
					  x={NDateTime.CLOCK_CHAR_POS.BOTTOM.X}
					  y={NDateTime.CLOCK_CHAR_POS.BOTTOM.Y}>30</text>
				{[30, 60, 120, 150, 210, 240, 300, 330].map(function(degree) {
					return _this.renderEngrave(degree,
						NDateTime.CLOCK_RADIUS,
						NDateTime.CLOCK_BIG_ENGRAVE_LENGTH,
						'big',
						NDateTime.CLOCK_RADIUS);
				})}
				{[6, 12, 18, 24, 36, 42, 48, 54, 66, 72, 78, 84,
					96, 102, 108, 114, 126, 132, 138, 144, 156, 162, 168, 174,
					186, 192, 198, 204, 216, 222, 228, 234, 246, 252, 258, 264,
					276, 282, 288, 294, 306, 312, 318, 324, 336, 342, 348, 354].map(function(degree) {
					return _this.renderEngrave(degree,
						NDateTime.CLOCK_RADIUS,
						NDateTime.CLOCK_SMALL_ENGRAVE_LENGTH,
						'small',
						NDateTime.CLOCK_RADIUS);
				})}
			</g>);
		},
		renderHourHand: function(date, offset) {
			var hour = date.hour();
			var degree = null;
			if (this.is12Hour()) {
				degree = 450 - hour * 30;
			} else {
				degree = 450 - hour * 15;
			}
			var hourRadius = this.getHourRadius();
			return (<line x1={offset + NDateTime.CLOCK_HAND_OFFSET * Math.cos(Math.PI * 2 * (degree - 180) / 360)}
						  y1={offset - NDateTime.CLOCK_HAND_OFFSET * Math.sin(Math.PI * 2 * (degree - 180) / 360)}
						  x2={offset + (hourRadius - NDateTime.CLOCK_HAND_OFFSET) * Math.cos(Math.PI * 2 * (degree) / 360)}
						  y2={offset - (hourRadius - NDateTime.CLOCK_HAND_OFFSET) * Math.sin(Math.PI * 2 * (degree) / 360)}
						  className='hour-hand' />);
		},
		renderMinuteHand: function(date, radius, offset) {
			if (!this.hasMinute()) {
				// no minute need to display
				return null;
			}
			var minute = date.minute();
			var degree = 450 - minute * 6;
			return (<line x1={offset + NDateTime.CLOCK_HAND_OFFSET * Math.cos(Math.PI * 2 * (degree - 180) / 360)}
						  y1={offset - NDateTime.CLOCK_HAND_OFFSET * Math.sin(Math.PI * 2 * (degree - 180) / 360)}
						  x2={offset + (radius - NDateTime.CLOCK_HAND_OFFSET) * Math.cos(Math.PI * 2 * (degree) / 360)}
						  y2={offset - (radius - NDateTime.CLOCK_HAND_OFFSET) * Math.sin(Math.PI * 2 * (degree) / 360)}
						  className='minute-hand' />);
		},
		renderSecondHand: function(date, radius, offset) {
			var popoverType = this.guessDisplayFormatType();
			if (!this.hasSecond()) {
				// no minute need to display
				return null;
			}
			var _this = this;
			var second = date.second();
			var degree = 450 - second * 6;
			return (<line x1={offset + NDateTime.CLOCK_HAND_OFFSET * Math.cos(Math.PI * 2 * (degree - 180) / 360)}
						  y1={offset - NDateTime.CLOCK_HAND_OFFSET * Math.sin(Math.PI * 2 * (degree - 180) / 360)}
						  x2={offset + (radius) * Math.cos(Math.PI * 2 * (degree) / 360)}
						  y2={offset - (radius) * Math.sin(Math.PI * 2 * (degree) / 360)}
						  className='second-hand' />);
		},
		renderTime: function(date, popoverType) {
			var _this = this;
			var allPopoverType = this.guessDisplayFormatType();
			if (!this.hasTimeToDisplay(allPopoverType)) {
				return null;
			}
			var styles = {
				float: 'left',
				width: this.hasDateToDisplay(allPopoverType) ? '50%' : '100%'
			};
			var titleFormat = 'HH';
			if (this.hasSecond()) {
				titleFormat = 'HH:mm:ss';
			} else if (this.hasMinute()) {
				titleFormat = 'HH:mm';
			}
			var hiddenWhenMobile = this.state.dateViewWhenMobilePhone ? ' hidden' : '';
			return (<div className={'time-view' + hiddenWhenMobile} style={styles}>
				<div className='calendar-header'>
					{date.format(titleFormat)}
				</div>
				<div className='calendar-body'>
					<div className='time-view-body-body'>
						<div style={{height: NDateTime.CLOCK_RADIUS * 2, width: NDateTime.CLOCK_RADIUS * 2, position: 'relative'}}>
							<svg className='clock'
								 height={NDateTime.CLOCK_RADIUS * 2}
								 width={NDateTime.CLOCK_RADIUS * 2}>
								{this.renderMinuteDial()}
								{this.is12Hour() ? this.render12HourDial(date, popoverType) : this.render24HourDial()}
								{this.renderHourHand(date, NDateTime.CLOCK_RADIUS)}
								{this.renderMinuteHand(date, NDateTime.CLOCK_RADIUS, NDateTime.CLOCK_RADIUS)}
								{this.renderSecondHand(date, NDateTime.CLOCK_RADIUS, NDateTime.CLOCK_RADIUS)}
							</svg>
							<div style={{position: 'absolute',
										 backgroundColor: 'transparent',
										 top: 0,
										 left: 0,
										 height: NDateTime.CLOCK_RADIUS * 2,
										 width: NDateTime.CLOCK_RADIUS * 2}}
								 onClick={this.onClockClicked.bind(this, popoverType)}/>
						</div>
					</div>
				</div>
			</div>);
		},
		renderPopoverContent: function(options) {
			var date = options ? options.date : null;
			var popoverType = options ? options.type : null;
			date = date ? date : this.getValueFromModel();
			date = date ? date : this.getToday();
			if (popoverType == null) {
				popoverType = this.getInitialPopoverType() || this.guessDisplayFormatType();
				if (this.isMobilePhone() && this.hasDateToDisplay(popoverType)) {
					// first time show in mobile phone
					this.state.dateViewWhenMobilePhone = true;
				}
			}
			var styles = {
				float: 'left',
				width: this.hasTimeToDisplay(this.guessDisplayFormatType()) ? '50%' : '100%'
			};
			if ((popoverType & NDateTime.FORMAT_TYPES.DAY) != 0) {
				// has day, YMD
				this.startClockInterval(NDateTime.FORMAT_TYPES.DAY, date);
				return (<div className="popover-content row">
					<div className='date-view' style={styles}>
						{this.renderDayHeader(date)}
						{this.renderDayBody(date)}
					</div>
					{this.renderTime(date, NDateTime.FORMAT_TYPES.DAY)}
					{this.renderPopoverContentFooter(this.getToday(), NDateTime.FORMAT_TYPES.DAY)}
				</div>);
			} else if ((popoverType & NDateTime.FORMAT_TYPES.MONTH) != 0) {
				// has month, YM
				this.startClockInterval(NDateTime.FORMAT_TYPES.MONTH, date);
				return (<div className="popover-content row">
					<div className='date-view' style={styles}>
						{this.renderMonthHeader(date)}
						{this.renderMonthBody(date)}
					</div>
					{this.renderTime(date, NDateTime.FORMAT_TYPES.MONTH)}
					{this.renderPopoverContentFooter(this.getToday(), NDateTime.FORMAT_TYPES.MONTH)}
				</div>);
			} else if ((popoverType & NDateTime.FORMAT_TYPES.YEAR) != 0) {
				// has year, YEAR
				this.startClockInterval(NDateTime.FORMAT_TYPES.YEAR, date);
				return (<div className="popover-content row">
					<div className='date-view' style={styles}>
						{this.renderYearHeader(date)}
						{this.renderYearBody(date)}
					</div>
					{this.renderTime(date, NDateTime.FORMAT_TYPES.YEAR)}
					{this.renderPopoverContentFooter(this.getToday(), NDateTime.FORMAT_TYPES.YEAR)}
				</div>);
			} else {
				this.startClockInterval(popoverType, date);
				// only time
				return (<div className="popover-content row">
					{this.renderTime(date, this.guessDisplayFormatType())}
					{this.renderPopoverContentFooter(this.getToday(), popoverType)}
				</div>);
			}
		},
		isPopoverMatchComponentWidth: function() {
			return false;
		},
		hasPopoverContentWrapper: function() {
			return false;
		},
		getPopoverContainerCSS: function() {
			var displayFormatType = this.guessDisplayFormatType();
			return $pt.LayoutHelper.classSet({
				'n-datetime': true,
				'time-only': !this.hasDateToDisplay(displayFormatType) && this.hasTimeToDisplay(displayFormatType),
				'date-only': this.hasDateToDisplay(displayFormatType) && !this.hasTimeToDisplay(displayFormatType),
				'date-and-time': this.hasDateToDisplay(displayFormatType) && this.hasTimeToDisplay(displayFormatType)
			});
		},
		beforeRenderPopover: function(options) {
			if (!options) {
				options = {};
			}
			if (options.set) {
				this.setValueToModel(options.date);
			}
		},
		beforeDestoryPopover: function() {
			this.stopClockInterval();
		},
		stopClockInterval: function() {
			if (this.state.clockInterval) {
				clearTimeout(this.state.clockInterval.handler);
				this.state.clockInterval = null;
			}
		},
		startClockInterval: function(popoverType, currentTime) {
			if (!this.getComponentOption('runClock', true)) {
				return;
			}
			var value = this.getValueFromModel();
			if (value == null) {
				this.stopClockInterval();
				this.state.clockInterval = {
					handler: setTimeout(function() {
						this.renderPopover({date: currentTime.add(1, 's'), type: popoverType});
					}.bind(this), 1000),
					type: popoverType
				};
			} else {
				this.stopClockInterval();
			}
		},
		/**
		 * check display type has time or not
		 * @returns {boolean}
		 */
		hasTimeToDisplay: function(type) {
			if (typeof type === 'undefined') {
				type = this.guessDisplayFormatType();
			}
			return (type &
				(NDateTime.FORMAT_TYPES.HOUR | NDateTime.FORMAT_TYPES.MINUTE |
					NDateTime.FORMAT_TYPES.SECOND | NDateTime.FORMAT_TYPES.MILLSECOND)) != 0;
		},
		/**
		 * check display type has date or not
		 * @returns {boolean}
		 */
		hasDateToDisplay: function(type) {
			if (typeof type === 'undefined') {
				type = this.guessDisplayFormatType();
			}
			return (type & NDateTime.FORMAT_TYPES.YMD) != 0;
		},
		/**
		 * guess display format type
		 * @returns {number} format type
		 * @see NDateTime.FORMAT_TYPES
		 */
		guessDisplayFormatType: function() {
			var format = this.getPrimaryDisplayFormat();
			var hasYear = format.indexOf('Y') != -1;
			var hasMonth = format.indexOf('M') != -1;
			var hasDay = format.indexOf('D') != -1;

			var hasHour = format.indexOf('H') != -1;
			var hasMinute = format.indexOf('m') != -1;
			var hasSecond = format.indexOf('s') != -1;
			var hasMillsecond = format.indexOf('S') != -1;

			return (hasYear ? NDateTime.FORMAT_TYPES.YEAR : 0) +
				(hasMonth ? NDateTime.FORMAT_TYPES.MONTH : 0) +
				(hasDay ? NDateTime.FORMAT_TYPES.DAY : 0) +
				(hasHour ? NDateTime.FORMAT_TYPES.HOUR : 0) +
				(hasMinute ? NDateTime.FORMAT_TYPES.MINUTE : 0) +
				(hasSecond ? NDateTime.FORMAT_TYPES.SECOND : 0) +
				(hasMillsecond ? NDateTime.FORMAT_TYPES.MILLSECOND : 0);
		},
		onCalendarButtonClicked: function() {
			if (!this.isEnabled() || this.isViewMode()) {
				// do nothing
				return;
			}
			this.showPopover();
			if (!this.isMobilePhone()) {
				this.getTextInput().focus();
			} else {
				this.getTextInput().blur();
			}
		},
		onTextInputFocused: function () {
			$(ReactDOM.findDOMNode(this.refs.focusLine)).toggleClass('focus');
			$(ReactDOM.findDOMNode(this.refs.normalLine)).toggleClass('focus');
		},
		onTextInputBlurred: function () {
			$(ReactDOM.findDOMNode(this.refs.focusLine)).toggleClass('focus');
			$(ReactDOM.findDOMNode(this.refs.normalLine)).toggleClass('focus');

			var text = this.getTextInput().val();
			if (text.length == 0 || text.isBlank())  {
				this.setValueToModel(null);
			} else {
				var date = this.convertValueFromString(text, this.getDisplayFormat());
				if (date == null && text.length != 0) {
					// invalid date
					this.setValueToModel(null);
					this.setValueToTextInput(null);
				} else {
					this.setValueToModel(date);
					this.setValueToTextInput(this.getValueFromModel());
				}
			}
		},
		onYearSelected: function(date) {
			this.setValueToModel(date);
			var type = this.guessDisplayFormatType();
			// no time display and only year display, hide
			if (!this.hasTimeToDisplay(type) && ((type & NDateTime.FORMAT_TYPES.MONTH) == 0)) {
				this.hidePopover();
			} else {
				this.renderPopover({date: date, type: NDateTime.FORMAT_TYPES.MONTH});
			}
		},
		onMonthSelected: function(date) {
			this.setValueToModel(date);
			var type = this.guessDisplayFormatType();
			// no time display and no day display, hide
			if (!this.hasTimeToDisplay(type) && ((type & NDateTime.FORMAT_TYPES.DAY) == 0)) {
				this.hidePopover();
			} else {
				this.renderPopover({date: date, type: NDateTime.FORMAT_TYPES.DAY});
			}
		},
		onDaySelected: function(date) {
			this.setValueToModel(date);
			var type = this.guessDisplayFormatType();
			// no time display, hide
			if (!this.hasTimeToDisplay(type)) {
				this.hidePopover();
			} else {
				this.renderPopover({date: date, type: NDateTime.FORMAT_TYPES.DAY});
			}
		},
		onClockClicked: function(popoverType, evt) {
			var offset = $(evt.target).offset();
			// be careful of the quadrant
			var point = {
				x: (evt.pageX - offset.left) - NDateTime.CLOCK_RADIUS,
				y: NDateTime.CLOCK_RADIUS - (evt.pageY - offset.top)
			};
			// window.console.log('Mouse Point: ' + point.x + ',' + point.y);
			// calculate the radius length of point
			var length = Math.sqrt(Math.pow(point.x, 2) + Math.pow(point.y, 2));
			// window.console.log('Point radius: ' + length);

			// calculate it is what
			if (length > 101) {
				// do nothing
				return;
			}
			var eventType = NDateTime.FORMAT_TYPES.SECOND;
			if (length > (NDateTime.CLOCK_RADIUS - NDateTime.CLOCK_HAND_OFFSET)) {
				// change second or minute or hour
				if (this.hasSecond()) {
					eventType = NDateTime.FORMAT_TYPES.SECOND;
				} else if (this.hasMinute()) {
					eventType = NDateTime.FORMAT_TYPES.MINUTE;
				} else {
					eventType = NDateTime.FORMAT_TYPES.HOUR;
				}
			} else if (length > (NDateTime.CLOCK_RADIUS * NDateTime.CLOCK_HOUR_PERCENTAGE)) {
				// change minute or hour
				if (this.hasMinute()) {
					eventType = NDateTime.FORMAT_TYPES.MINUTE;
				} else {
					eventType = NDateTime.FORMAT_TYPES.HOUR;
				}
			} else {
				// change hour
				eventType = NDateTime.FORMAT_TYPES.HOUR;
			}
			// window.console.log('Event Type: ' + eventType);

			// calculate degree in coordinate system
			var degree = 0;
			if (point.x == 0) {
				degree = point.y >= 0 ? 90 : 270;
			} else {
				// atan is from -Math.PI/2 to Math.PI/2
				degree = Math.atan(point.y / point.x) * 180 / Math.PI;
				// transform to coordinate system degree
				if (point.x > 0 && point.y >= 0) {
					// do nothing
				} else if (point.x < 0) {
					degree += 180;
				} else {
					degree += 360;
				}
			}
			// transform to real clock coordinate system
			if (degree <= 90) {
				degree = 90 - degree;
			} else {
				degree = 450 - degree;
			}
			// window.console.log('Degree: ' + degree);

			var currentHour, hour, minute, second;
			var date = this.getValueFromModel();
			date = date == null ? this.getToday() : date;
			currentHour = date.hour();
			if (eventType == NDateTime.FORMAT_TYPES.SECOND) {
				second = Math.floor(degree / 6) + (degree % 6 < 3 ? 0 : 1);
				date.second(second);
			} else if (eventType == NDateTime.FORMAT_TYPES.MINUTE) {
				minute = Math.floor(degree / 6) + (degree % 6 < 3 ? 0 : 1);
				date.minute(minute);
			} else if (this.is12Hour()) {
				hour = Math.floor(degree / 30) + (degree % 30 < 15 ? 0 : 1);
				date.hour(currentHour <= 11 ? hour : (hour + 12));
			} else {
				hour = Math.floor(degree / 15) + (degree % 15 < 7.5 ? 0 : 1);
				date.hour(hour);
			}
			// window.console.log('Hour: [' + hour + '], Minute: [' + minute + '], Second: [' + second + ']');
			this.renderPopover({date: date, type: popoverType, set: true});
		},
		onAMPMSelected: function(isAM, type) {
			var value = this.getValueFromModel();
			value = value == null ? this.getToday() : value;
			var hour = value.hour();
			if (isAM) {
				hour = hour > 11 ? (hour - 12) : hour;
			} else {
				hour = hour <= 11 ? (hour + 12) : hour;
			}
			value.hour(hour);
			this.setValueToModel(value);

			this.renderPopover({date: value, type: type});
		},
		switchToTimeViewOnMobile: function(evt) {
			var target = $(evt.target);
			if (target[0].tagName === 'SPAN') {
				target = target.closest('a');
			}
			target.addClass('hidden').siblings('.date-switch').removeClass('hidden');
			this.state.dateViewWhenMobilePhone = false;
			var parent = target.closest('.popover-content');
			parent.children('.time-view').removeClass('hidden');
			parent.children('.date-view').addClass('hidden');
		},
		switchToDateViewOnMobile: function(evt) {
			var target = $(evt.target);
			if (target[0].tagName === 'SPAN') {
				target = target.closest('a');
			}
			target.addClass('hidden').siblings('.time-switch').removeClass('hidden');
			this.state.dateViewWhenMobilePhone = true;
			var parent = target.closest('.popover-content');
			parent.children('.time-view').addClass('hidden');
			parent.children('.date-view').removeClass('hidden');
		},
		onTextInputChange: function() {
			// since the text input might be incorrect date format,
			// or use un-strict mode to format
			// cannot know the result of moment format
			// move process to changing at blur event
			var text = this.getTextInput().val();
			if (text.length == 0 || text.isBlank())  {
				this.setValueToModel(null);
			} else {
				var date = this.convertValueFromString(text, this.getDisplayFormat(), true);
				if (date == null && text.length != 0) {
					// TODO invalid date, do nothing now. donot know how to deal with it...
				} else {
					this.setValueToModel(date);
				}
			}
		},
		onModelChanged: function (evt) {
			var newValue = evt.new;
			var text = this.getTextInput().val();
			if (newValue == null || (newValue + '').isBlank()) {
				if (text == null || text.isBlank()) {
					// do nothing
				} else {
					this.forceUpdate();
				}
			} else {
				var valueDate = this.getValueFromModel();
				var textDate = this.convertValueFromString(text, this.getDisplayFormat(), true);
				if (valueDate.isSame(textDate)) {
					// do nothing
				} else {
					this.forceUpdate();
				}
			}
		},
		getValueFromModel: function () {
			return this.convertValueFromString(this.getModel().get(this.getDataId()));
		},
		setValueToModel: function (value) {
			var formattedValue = value;
			if (value != null) {
				if (typeof value === 'string') {
					if (value.isBlank()) {
						formattedValue = null;
					} else {
						formattedValue = moment(value, this.getPrimaryDisplayFormat())
							.format(this.getValueFormat());
					}
				} else {
					formattedValue = value.format(this.getPrimaryDisplayFormat());
					formattedValue = moment(formattedValue, this.getPrimaryDisplayFormat()).format(this.getValueFormat());
				}
			}
			this.getModel().set(this.getDataId(), formattedValue);
		},
		setValueToTextInput: function(value) {
			this.getTextInput().val(this.convertValueToString(value, this.getPrimaryDisplayFormat()));
		},
		/**
		 * convert value from string
		 * @param value {string}
		 * @param format {string} optional, use value format if not passed
		 * @returns {moment}
		 */
		convertValueFromString: function (value, format, useStrict) {
			var date = (value == null || value.isBlank()) ? null : moment(value, format ? format : this.getValueFormat(), this.getLocale(), useStrict === true ? true : undefined);
			return (date == null || !date.isValid()) ? null : date;
		},
		/**
		 * convert value to string
		 * @param value {moment}
		 * @param format {string} optional, use value format if not passed
		 * @returns {string}
		 */
		convertValueToString: function(value, format) {
			return value == null ? null : value.format(format ? format : this.getValueFormat());
		},
		/**
		 * get first day of week
		 * returns {number} 0-6, sunday to saturday
		 */
		getFirstDayOfWeek: function() {
			return this.getMomentLocaleData().firstDayOfWeek();
		},
		/**
		 * get day of week.
		 * returns {number} 0-6, sunday to saturday
		 */
		getDayOfWeek: function(date) {
			return date.day();
		},
		/**
		 * get days count of month
		 * @returns {number}
		 */
		getDaysOfMonth: function(date) {
			var month = date.month() + 1;
			switch(month) {
				case 1: case 3: case 5: case 7: case 8: case 10: case 12:
					return 31;
				case 4: case 6: case 9: case 11:
					return 30;
				case 2:
					return date.isLeapYear() ? 29 : 28;
				default:
					// never run to here
					window.console.warn('Something wrong with momentjs.');
					window.console.warn(date);
					return 31;
			}
		},
		getComponent: function() {
			return $(ReactDOM.findDOMNode(this.refs.comp));
		},
		getTextInput: function() {
			return $(ReactDOM.findDOMNode(this.refs.text));
		},
		/**
		 * get display format
		 * @returns {string}
		 */
		getDisplayFormat: function() {
			var format = this.getComponentOption('format');
			return format ? format : NDateTime.FORMAT;
		},
		getPrimaryDisplayFormat: function() {
			var format = this.getDisplayFormat();
			if (Array.isArray(format)) {
				return format[0];
			} else {
				return format;
			}
		},
		getHeaderMonthFormat: function() {
			var format = this.getComponentOption('headerMonthFormat');
			return format ? format : NDateTime.HEADER_MONTH_FORMAT;
		},
		getHeaderYearFormat: function() {
			var format = this.getComponentOption('headerYearFormat');
			return format ? format : NDateTime.HEADER_YEAR_FORMAT;
		},
		getBodyYearFormat: function() {
			return this.getComponentOption('bodyYearFormat');
		},
		/**
		 * get value format
		 * @returns {string}
		 */
		getValueFormat: function() {
			var valueFormat = this.getComponentOption('valueFormat');
			return valueFormat ? valueFormat : NDateTime.VALUE_FORMAT;
		},
		is12Hour: function() {
			// seems mobile doesn't support event on svg and its inner nodes
			// so doesn't support 12 hours format in mobile equipments
			return this.getComponentOption('hour') == 12 && !this.isMobile();
		},
		getHourRadius: function() {
			var hourRadius = NDateTime.CLOCK_RADIUS;
			if (this.hasMinute()) {
				// with minute and second
				hourRadius *= NDateTime.CLOCK_HOUR_PERCENTAGE;
			}
			return hourRadius;
		},
		hasYear: function() {
			return (this.guessDisplayFormatType() & NDateTime.FORMAT_TYPES.YEAR) != 0;
		},
		hasMonth: function() {
			return (this.guessDisplayFormatType() & NDateTime.FORMAT_TYPES.MONTH) != 0;
		},
		hasDay: function() {
			return (this.guessDisplayFormatType() & NDateTime.FORMAT_TYPES.DAY) != 0;
		},
		hasHour: function() {
			return (this.guessDisplayFormatType() & NDateTime.FORMAT_TYPES.HOUR) != 0;
		},
		hasMinute: function() {
			return (this.guessDisplayFormatType() & NDateTime.FORMAT_TYPES.MINUTE) != 0;
		},
		hasSecond: function() {
			return (this.guessDisplayFormatType() & NDateTime.FORMAT_TYPES.SECOND) != 0;
		},
		/**
		 * get icon definition by given icon key
		 * @returns {string}
		 */
		getIcon: function(key) {
			return this.getComponentOption('icons')[key];
		},
		getTextInViewMode: function() {
			return this.convertValueToString(this.getValueFromModel(), this.getPrimaryDisplayFormat());
		},
		getLocale: function() {
			return this.getComponentOption('locale');
		},
		getMomentLocaleData: function() {
			return moment.localeData(this.getLocale());
		},
		getToday: function() {
			var today = moment().locale(this.getLocale());
			var defaultTime = this.getComponentOption('defaultTime');
			if (defaultTime) {
				if (typeof defaultTime === 'function') {
					today = defaultTime.call(this, today);
				} else {
					today = defaultTime;
				}
			} 
			return today;
		},
		getInitialPopoverType: function() {
			return this.getComponentOption('popoverType');
		}
	}));

	$pt.Components.NDateTime = NDateTime;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.Date, function (model, layout, direction, viewMode) {
		return <$pt.Components.NDateTime {...$pt.LayoutHelper.transformParameters(model, layout, direction, viewMode)}/>;
	});
}(window, jQuery, moment, React, ReactDOM, $pt));
