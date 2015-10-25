(function (context, $) {
	var $demo = $pt.getService(context, '$demo');


	var painter = function () {
		var modelTemplate = {};
		var model = $pt.createModel(modelTemplate);
		var modelCode = $demo.convertModelCreatorToString({
			variable: 'model',
			template: modelTemplate
		});
		var compCode = $demo.convertComponentCreatorToString({
			tag: 'NDateTime',
			model: 'model',
			layout: 'layout'
		});

		var format = {
			year: function () {
				var layoutTemplate = {comp: {format: 'YYYY'}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'datetime-format-year',
					title: 'Year',
					desc: '',
					xml: <NDateTime model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 10
				};
			},
			yearMonth: function () {
				var layoutTemplate = {comp: {format: 'YYYY/MM'}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'datetime-format-yearmonth',
					title: 'Year & month',
					desc: '',
					xml: <NDateTime model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 20
				};
			},
			month: function () {
				var layoutTemplate = {comp: {format: 'MM'}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'datetime-format-month',
					title: 'Month',
					desc: '',
					xml: <NDateTime model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 30
				};
			},
			day: function () {
				var layoutTemplate = {comp: {format: 'DD'}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'datetime-format-day',
					title: 'Day',
					desc: '',
					xml: <NDateTime model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 40
				};
			},
			time: function () {
				var layoutTemplate = {comp: {format: 'HH:mm:ss'}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'datetime-format-time',
					title: 'Time',
					desc: '',
					xml: <NDateTime model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 50
				};
			},
			other: function () {
				return {
					id: 'datetime-format-other',
					title: 'Other',
					desc: 'Other format support refers to MomentJS and Bootstrap DateTimePicker.',
					index: 60
				};
			}
		};

		var all = {
			defaultOptions: function () {
				var layoutTemplate = {};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'datetime-default',
					title: 'Default',
					desc: 'A simple date time picker.',
					xml: <NDateTime model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 10
				};
			},
			valueFormat: function () {
				var layoutTemplate = {comp: {valueFormat: 'YYYY/MM/DD'}};
				var layoutCode = $demo.convertCellLayoutCreatorToString({
					variable: 'layout',
					cellKey: 'value',
					template: layoutTemplate
				});
				return {
					id: 'datetime-value-format',
					title: 'Value Format',
					desc: ['Date time picker with given value format.',
						<span>Default value format is <code>YYYY/MM/DD</code>, format pattern refers to MomentJS.</span>,
						'Value format only effects the value string in data model.'],
					xml: <NDateTime model={model} layout={$pt.createCellLayout('value', layoutTemplate)}/>,
					code: [modelCode, layoutCode, compCode],
					index: 20
				};
			},
			format: function () {
				return {
					id: 'datetime-format',
					title: 'Format',
					desc: ['Date time picker automatically switch the display mode by given format.'],
					index: 30,
					children: $demo.convertToExampleList(format)
				};
			},
			properties: function () {
				return {
					id: 'datetime-properties',
					title: 'Properties',
					desc: ['Available properties.', 'Refers to Bootstrap 3 DateTimePicker'],
					index: 50,
					code: $demo.convertJSON({
						variable: 'layout',
						json: {
							comp: {
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
							}
						}
					})
				}
			},
			constants: function () {
				var statics = {
					FORMAT: 'YYYY/MM/DD',
					DAY_VIEW_HEADER_FORMAT: 'MMMM YYYY',
					VALUE_FORMAT: $pt.ComponentConstants.Default_Date_Format,
					LOCALE: 'en'
				};
				return {
					id: 'datetime-constants',
					title: 'Constants',
					desc: 'Available constants. Constants must be change before construct component.',
					index: 60,
					code: $demo.convertJSON({
						variable: 'NDateTime',
						json: {
							statics: statics
						}
					})
				};
			},
			css: function () {
				return $demo.convertCSSJSONToExample({
					id: 'datetime-css',
					index: 70,
					css: {
						comp: 'your-class-name',
						'normal-line': 'your-class-name',
						'focus-line': 'your-class-name'
					}
				});
			},
			i18n: function () {
				return {
					id: 'datetime-i18n',
					title: 'I18N',
					desc: 'I18N & L10N',
					index: 80,
					children: [
						{
							id: 'taiwan',
							title: 'Taiwan',
							desc: 'Include moment-taiwan to support Taiwan format.',
							index: 10
						}
					]
				}
			}
		};
		return $demo.convertToExampleList(all);
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.formDateTime = function () {
		React.render(<ExampleList title='Form Date Time Picker'
		                          formType='$pt.ComponentConstants.Date'
		                          items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));