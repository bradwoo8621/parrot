/**
 * datetime picker, see datetimepicker from bootstrap
 *
 * layout: {
 *      label: string,
 *      dataId: string,
 *      pos: {
 *          row: number,
 *          col: number,
 *          width: number,
 *          section: string,
 *          card: string
 *      },
 *      css: {
 *          cell: string,
 *          comp: string,
 *          'normal-line': string,
 *          'focus-line': string
 *      },
 *      comp: {
 *          type: $pt.ComponentConstants.Date,
 *          enabled: {
 *              when: function,
 *              depends: string|string[]
 *          },
 *          visible: {
 *              when: function,
 *              depends: string|string[]
 *          },
 *          valueFormat: $pt.ComponentConstants.Default_Date_Format
 *          // other properties see official doc please
 *      }
 * }
 */
(function (context, $, $pt) {
	var NDateTime = React.createClass($pt.defineCellComponent({
		displayName: 'NDateTime',
		statics: {
			FORMAT: 'YYYY/MM/DD',
			DAY_VIEW_HEADER_FORMAT: 'MMMM YYYY',
			HEADER_YEAR_FORMAT: null,
			VALUE_FORMAT: $pt.ComponentConstants.Default_Date_Format,
			LOCALE: 'en',
			DATE_PICKER_VERTICAL_OFFSET: 35 // equals row height according to current testing
		},
		propTypes: {
			// model
			model: React.PropTypes.object,
			// CellLayout
			layout: React.PropTypes.object
		},
		getDefaultProps: function () {
			return {
				defaultOptions: {
					//format: "YYYY/MM/DD",
					//dayViewHeaderFormat: "MMMM YYYY",
					//locale: 'en',
					stepping: 1,
					useCurrent: false,
					minDate: false,
					maxDate: false,
					collapse: true,
					defaultDate: false,
					disabledDates: false,
					enabledDates: false,
					icons: {
						time: 'glyphicon glyphicon-time',
						date: 'glyphicon glyphicon-calendar',
						up: 'glyphicon glyphicon-chevron-up',
						down: 'glyphicon glyphicon-chevron-down',
						previous: 'glyphicon glyphicon-chevron-left',
						next: 'glyphicon glyphicon-chevron-right',
						today: 'glyphicon glyphicon-screenshot',
						clear: 'glyphicon glyphicon-trash'
					},
					useStrict: false,
					sideBySide: true,
					daysOfWeekDisabled: [],
					calendarWeeks: false,
					viewMode: 'days',
					toolbarPlacement: 'default',
					showTodayButton: true,
					showClear: true,
					showClose: true,
					tooltips: {
						today: 'Go to today',
						clear: 'Clear selection',
						close: 'Close the picker',
						selectMonth: 'Select Month',
						prevMonth: 'Previous Month',
						nextMonth: 'Next Month',
						selectYear: 'Select Year',
						prevYear: 'Previous Year',
						nextYear: 'Next Year',
						selectDecade: 'Select Decade',
						prevDecade: 'Previous Decade',
						nextDecade: 'Next Decade',
						prevCentury: 'Previous Century',
						nextCentury: 'Next Century'
					}
					//,
					// value format can be different with display format
					//valueFormat: $pt.ComponentConstants.Default_Date_Format
				}
			};
		},
		/**
		 * will update
		 * @param nextProps
		 */
		componentWillUpdate: function (nextProps) {
			// remove post change listener to handle model change
			this.removePostChangeListener(this.onModelChange);
			this.removeEnableDependencyMonitor();
			this.unregisterFromComponentCentral();
		},
		/**
		 * overrride react method
		 * @param prevProps
		 * @param prevState
		 * @override
		 */
		componentDidUpdate: function (prevProps, prevState) {
			if (!this.isViewMode()) {
				this.getComponent().data("DateTimePicker").date(this.getValueFromModel());
			}
			// add post change listener
			this.addPostChangeListener(this.onModelChange);
			this.addEnableDependencyMonitor();
			this.registerToComponentCentral();
		},
		/**
		 * override react method
		 * @override
		 */
		componentDidMount: function () {
			this.createComponent();
			if (!this.isViewMode()) {
				this.getComponent().data("DateTimePicker").date(this.getValueFromModel());
			}
			// add post change listener
			this.addPostChangeListener(this.onModelChange);
			this.addEnableDependencyMonitor();
			this.registerToComponentCentral();
		},
		/**
		 * override react method
		 * @override
		 */
		componentWillUnmount: function () {
			// remove post change listener
			this.removePostChangeListener(this.onModelChange);
			this.removeEnableDependencyMonitor();
			this.unregisterFromComponentCentral();
		},
		/**
		 * create component
		 */
		createComponent: function () {
			var _this = this;
			var component = this.getComponent().datetimepicker(this.createDisplayOptions({
				format: NDateTime.FORMAT,
				dayViewHeaderFormat: NDateTime.DAY_VIEW_HEADER_FORMAT,
				locale: NDateTime.LOCALE,
				stepping: null,
				useCurrent: null,
				minDate: null,
				maxDate: null,
				collapse: null,
				disabledDates: null,
				enabledDates: null,
				icons: null,
				useStrict: null,
				sideBySide: null,
				daysOfWeekDisabled: null,
				calendarWeeks: null,
				viewMode: null,
				toolbarPlacement: null,
				showTodayButton: null,
				showClear: null,
				showClose: null,
				tooltips: null
			})).on("dp.change", this.onComponentChange);

			var picker = component.data('DateTimePicker');
			component.on('dp.show', function (evt) {
				_this.resetPopupContent.call(_this, picker, evt.target);
			}).on('dp.update', function (evt) {
				_this.resetPopupContent.call(_this, picker, evt.target);
			});
		},
		resetPopupContent: function (picker, target) {
			var widget = $(target).children('div.bootstrap-datetimepicker-widget');
			if (widget.closest('.n-table').length != 0) {
				var tableBodyContainer = $(target).closest('.n-table-body-container');
				// date time picker in table, move the popover to body,
				// Don't know why the popup hasn't place on body in original library, the z-index really sucks.
				var inputOffset = widget.prev().offset();
				var widgetOffset = widget.offset();
				var widgetHeight = widget.outerHeight(true);
				// console.log("Widget height: " + widgetHeight);
				if (widgetOffset.top == null || widgetOffset.top == 'auto' || inputOffset.top > widgetOffset.top) {
					// on top
					widgetOffset.top = inputOffset.top - widgetHeight + NDateTime.DATE_PICKER_VERTICAL_OFFSET;
				} else {
					// on bottom
					widgetOffset.top = inputOffset.top + widget.prev().height();
				}
				// console.log("Input Offset: " + JSON.stringify(inputOffset));
				// console.log("Widget Offset: " + JSON.stringify(widgetOffset));
				var css = {top: widgetOffset.top, left: widgetOffset.left, bottom: "auto", right: "auto", height: 'auto'};
				var modalForm = $(target).closest('.n-modal-form');
				if (modalForm.length != 0) {
					css["z-index"] = modalForm.css("z-index") + 1;
				}
				widget.css(css);
				widget.detach().appendTo($('body'));
				// console.log(widget.css("top") + "," + widget.css("left") + "," + widget.css("bottom") + "," + widget.css("right") + "," + widget.outerHeight(true));
				tableBodyContainer.hide().show(0);
			}

			var headerYearFormat = this.getHeaderYearFormat();
			//var yearsFormat = this.getComponentOption('yearsFormat');
			if (headerYearFormat) {
				var viewDate = picker.viewDate();

				var monthsView = widget.find('.datepicker-months');
				var monthsViewHeader = monthsView.find('th');
				monthsViewHeader.eq(1).text(viewDate.format(headerYearFormat));

				//var startYear = viewDate.clone().subtract(5, 'y');
				//var endYear = viewDate.clone().add(6, 'y');
				//var yearsView = widget.find('.datepicker-years');
				//var yearsViewHeader = yearsView.find('th');
				//yearsViewHeader.eq(1).text(startYear.format(headerYearFormat) + '-' + endYear.format(headerYearFormat));
				//if (yearsFormat) {
				//    yearsView.find('td').children('span.year').each(function () {
				//        var $this = $(this);
				//        $this.text(moment($this.text() * 1, 'YYYY').format(yearsFormat));
				//    });
				//}
			}
			//var startDecade = viewDate.clone().subtract(49, 'y');
			//var endDecade = startDecade.clone().add(100, 'y');
			//var decadesView = widget.find('.datepicker-decades');
			//var decadesViewHeader = decadesView.find('th');
			//var header = headerYearFormat ? (startDecade.format(headerYearFormat) + '-' + endDecade.format(headerYearFormat)) : (startDecade.year() + ' - ' + endDecade.year());
			//decadesViewHeader.eq(1).text(header);
			//yearsFormat = yearsFormat ? yearsFormat : 'YYYY';
			//decadesView.find('td').children('span').each(function (index) {
			//    var $this = $(this);
			//    var text = $this.text();
			//    if (text.isBlank()) {
			//        return;
			//    }
			//    var start = startDecade.clone().add(index * 10, 'y');
			//    var end = start.clone().add(10, 'y');
			//    $this.html(start.format(yearsFormat) + '</br>- ' + end.format(yearsFormat));
			//});
		},
		/**
		 * create display options
		 * @param options
		 */
		createDisplayOptions: function (options) {
			var _this = this;
			Object.keys(options).forEach(function (key) {
				var value = _this.getComponentOption(key);
				if (value !== null) {
					options[key] = value;
				}
			});
			return options;
		},
		/**
		 * render
		 * @returns {XML}
		 */
		render: function () {
			if (this.isViewMode()) {
				return this.renderInViewMode();
			}
			var css = {
				'input-group-addon': true,
				link: true,
				disabled: !this.isEnabled()
			};
			var divCSS = {
				'n-datetime': true,
				'n-disabled': !this.isEnabled()
			};
			return (<div className={$pt.LayoutHelper.classSet(divCSS)}>
				<div className='input-group' ref='div'>
					<input type='text'
					       className='form-control'
					       disabled={!this.isEnabled()}

					       onFocus={this.onComponentFocused}
					       onBlur={this.onComponentBlurred}/>
                <span className={$pt.LayoutHelper.classSet(css)}>
                    <span className='fa fa-fw fa-calendar'/>
                </span>
				</div>
				{this.renderNormalLine()}
				{this.renderFocusLine()}
			</div>);
		},
		onComponentFocused: function () {
			$(React.findDOMNode(this.refs.focusLine)).toggleClass('focus');
			$(React.findDOMNode(this.refs.normalLine)).toggleClass('focus');
		},
		onComponentBlurred: function () {
			$(React.findDOMNode(this.refs.focusLine)).toggleClass('focus');
			$(React.findDOMNode(this.refs.normalLine)).toggleClass('focus');
		},
		/**
		 * on component change
		 * @param evt
		 */
		onComponentChange: function (evt) {
			// synchronize value to model
			if (evt.date !== false) {
				this.setValueToModel(evt.date);
			} else {
				this.setValueToModel(null);
			}
		},
		/**
		 * on model change
		 * @param evt
		 */
		onModelChange: function (evt) {
			// this.getComponent().data('DateTimePicker').date(this.convertValueFromModel(evt.new));
			this.forceUpdate();
		},
		/**
		 * get component
		 * @returns {*|jQuery|HTMLElement}
		 * @override
		 */
		getComponent: function () {
			return $(React.findDOMNode(this.refs.div));
		},
		/**
		 * get value from model
		 * @returns {*}
		 * @override
		 */
		getValueFromModel: function () {
			return this.convertValueFromModel(this.getModel().get(this.getDataId()));
		},
		/**
		 * set value to model
		 * @param value momentjs object
		 * @override
		 */
		setValueToModel: function (value) {
			this.getModel().set(this.getDataId(), value == null ? null : value.format(this.getValueFormat()));
		},
		/**
		 * convert value from model
		 * @param value string date with value format
		 * @returns {*} moment date
		 */
		convertValueFromModel: function (value) {
			return value == null ? null : moment(value, this.getValueFormat());
		},
		/**
		 * get value format
		 * @returns {string}
		 */
		getValueFormat: function () {
			var valueFormat = this.getComponentOption('valueFormat');
			return valueFormat ? valueFormat : NDateTime.VALUE_FORMAT;
		},
		getHeaderYearFormat: function () {
			var format = this.getComponentOption('headerYearFormat');
			return format ? format : NDateTime.HEADER_YEAR_FORMAT;
		},
		getTextInViewMode: function() {
			var value = this.getValueFromModel();
			return value == null ? null : value.format(this.getDisplayFormat());
		},
		getDisplayFormat: function() {
			var format = this.getComponentOption('format');
			return format ? format : NDateTime.FORMAT;
		}
	}));
	context.NDateTime = NDateTime;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.Date, function (model, layout, direction, viewMode) {
		return <NDateTime {...$pt.LayoutHelper.transformParameters(model, layout, direction, viewMode)}/>;
	});
}(this, jQuery, $pt));
