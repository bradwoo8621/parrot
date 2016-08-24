/**
 * search text
 */
(function (window, $, React, ReactDOM, $pt) {
	var NSearchText = React.createClass($pt.defineCellComponent({
		displayName: 'NSearchText',
		statics: {
			ADVANCED_SEARCH_BUTTON_ICON: 'search',
			ADVANCED_SEARCH_DIALOG_NAME_LABEL: 'Name',
			ADVANCED_SEARCH_DIALOG_BUTTON_TEXT: 'Search',
			ADVANCED_SEARCH_DIALOG_CODE_LABEL: 'Code',
			ADVANCED_SEARCH_DIALOG_RESULT_TITLE: 'Search Result',
			NOT_FOUND: 'Not Found',
			SEARCH_PROXY: null,
			SEARCH_PROXY_CALLBACK: null,
			ADVANCED_SEARCH_PROXY: null,
			ADVANCED_SEARCH_PROXY_CALLBACK: null,
		},
		getDefaultProps: function () {
			return {
				defaultOptions: {}
			};
		},
		getInitialState: function () {
			return {
				stopRetrieveLabelFromRemote: false
			};
		},
		beforeDidUpdate: function (prevProps, prevState) {
			this.initSetValues();
		},
		beforeDidMount: function () {
			// set model value to component
			this.initSetValues();
		},
		/**
		 * render
		 * @returns {XML}
		 */
		render: function () {
			if (this.isViewMode()) {
				return this.renderInViewMode();
			}
			var enabled = this.isEnabled();
			var css = {
				'n-search-text': true
			};
			if (!enabled) {
				css['n-disabled'] = true;
			}
			var middleSpanStyle = {
				width: '0'
			};
			return (<div className={this.getComponentCSS($pt.LayoutHelper.classSet(css))}>
				<div className="input-group">
					<input type="text" className="form-control search-code" onKeyUp={this.onComponentChange} ref="code"
					       disabled={!enabled} onFocus={this.onComponentFocused} onBlur={this.onComponentBlurred}/>
					<span className="input-group-btn" style={middleSpanStyle}/>
					<input type="text" className="form-control search-label" onFocus={this.onLabelFocused} ref="label"
					       disabled={!enabled} tabIndex={-1}/>
				<span className="input-group-addon advanced-search-btn"
				      onClick={enabled ? this.showAdvancedSearchDialog : null}>
					<span className={'fa fa-fw fa-' + NSearchText.ADVANCED_SEARCH_BUTTON_ICON}/>
				</span>
					{this.renderNormalLine()}
					{this.renderFocusLine()}
				</div>
			</div>);
		},
		/**
		 * transfer focus to first text input
		 */
		onLabelFocused: function () {
			this.getComponent().focus();
		},
		onComponentFocused: function () {
			$(ReactDOM.findDOMNode(this.refs.focusLine)).toggleClass('focus');
			$(ReactDOM.findDOMNode(this.refs.normalLine)).toggleClass('focus');
		},
		onComponentBlurred: function () {
			$(ReactDOM.findDOMNode(this.refs.focusLine)).toggleClass('focus');
			$(ReactDOM.findDOMNode(this.refs.normalLine)).toggleClass('focus');
		},
		/**
		 * on component changed
		 */
		onComponentChange: function (evt) {
			var value = evt.target.value;
			this.setValueToModel(evt.target.value);
		},
		/**
		 * on model change
		 * @param evt
		 */
		onModelChanged: function (evt) {
			var value = evt.new;
			this.getComponent().val(value);
			this.retrieveAndSetLabelTextFromRemote(value);
		},
		/**
		 * show advanced search dialog
		 */
		showAdvancedSearchDialog: function () {
			if (!this.state.searchDialog) {
				this.state.searchDialog = $pt.Components.NModalForm.createFormModal(this.getLayout().getLabel(), 'advanced-search-dialog');
			}
			this.state.searchDialog.show({
				model: this.getAdvancedSearchDialogModel(),
				layout: this.getAdvancedSearchDialogLayout(),
				buttons: {
					reset: false,
					validate: false,
					cancel: false
				}
			});
		},
		/**
		 * pickup advanced result item
		 * @param item
		 */
		pickupAdvancedResultItem: function (item) {
			this.state.stopRetrieveLabelFromRemote = true;
			this.getModel().set(this.getDataId(), item.code);
			this.setLabelText(item.name);
			this.state.stopRetrieveLabelFromRemote = false;
		},
		initSetValues: function() {
			var value = this.getValueFromModel();
			if (!this.isViewMode()) {
				this.getComponent().val(value);
			}
			var labelPropertyId = this.getComponentOption('labelPropId');
			if (labelPropertyId) {
				this.setLabelText(this.getModel().get(labelPropertyId));
			} else {
				// send ajax request
				this.retrieveAndSetLabelTextFromRemote(value);
			}
		},
		setLabelText: function (text) {
			if (this.isViewMode()) {
				var value = this.getValueFromModel();
				if (value == null) {
					// $(ReactDOM.findDOMNode(this.refs.viewLabel)).text('');
				} else {
					var label = value;
					if (text == null) {
						label += ' - ' + NSearchText.NOT_FOUND;
					} else {
						label += ' - ' + text;
					}
					// $(ReactDOM.findDOMNode(this.refs.viewLabel)).text(label);
					var def = this.refs.viewLabel.getLayout().getDefinition();
					def.label = label;
					this.refs.viewLabel.forceUpdate();
					// this.refs.viewLabel.getLayout()
					// this.setState({viewLabel: label})
				}
			} else {
				$(ReactDOM.findDOMNode(this.refs.label)).val(text);
			}
			// if label property id defined, and value changed, set to model
			var labelPropertyId = this.getComponentOption('labelPropId');
			if (labelPropertyId) {
				var name = this.getModel().get(labelPropertyId);
				if (name != text) {
					this.getModel().set(labelPropertyId, name);
				}
			}
		},
		/**
		 * get label text from remote
		 */
		retrieveAndSetLabelTextFromRemote: function(value) {
			if (this.state.search != null) {
				clearTimeout(this.state.search);
			}

			if (this.state.stopRetrieveLabelFromRemote) {
				return;
			}

			var triggerDigits = this.getSearchTriggerDigits();
			if (triggerDigits == null) {
				throw new $pt.createComponentException(
					$pt.ComponentConstants.Err_Search_Text_Trigger_Digits_Not_Defined,
					"Trigger digits cannot be null in search text.");
			}

			if (value == null) {
				value = '';
			}
			if (typeof value !== 'string') {
				value = value + '';
			}
			if (value.isBlank() || (value.length != triggerDigits && triggerDigits != -1)) {
				this.setLabelText(null);
				return;
			}

			var _this = this;
			this.state.search = setTimeout(function() {
				var postData = {
					code: value
				};
				if (NSearchText.SEARCH_PROXY) {
					postData = NSearchText.SEARCH_PROXY.call(_this, postData);
				}
				$pt.internalDoPost(_this.getSearchUrl(), postData, {
					quiet: true
				}).done(function (data) {
					if (typeof data === 'string') {
						data = JSON.parse(data);
					}
					var name = data.name;
					if (NSearchText.SEARCH_PROXY_CALLBACK) {
						name = NSearchText.SEARCH_PROXY_CALLBACK.call(_this, data);
					}
					_this.setLabelText(name);
				}).fail(function() {
					window.console.error('Error occured when retrieve label from remote in NSearch.');
					// arguments.slice(0).forEach(function(argu) {
					// 	window.console.error(argu);
					// });
				});
			}, 300);
		},
		/**
		 * get search url
		 * @returns {string}
		 */
		getSearchUrl: function () {
			return this.getComponentOption("searchUrl");
		},
		/**
		 * get advanced search url
		 * @returns {string}
		 */
		getAdvancedSearchUrl: function () {
			return this.getComponentOption("advancedUrl");
		},
		/**
		 * get minimum digits to trigger search
		 * @returns {number}
		 */
		getSearchTriggerDigits: function () {
			return this.getComponentOption("searchTriggerDigits");
		},
		getComponent: function () {
			return $(ReactDOM.findDOMNode(this.refs.code));
		},
		// search dialog
		getAdvancedSearchDialogModel: function () {
			var model = this.getComponentOption('searchDialogModel');
			if (model == null) {
				model = {
					name: null,
					countPerPage: 10,
					pageIndex: 1,

					items: null,
					criteria: {
						pageIndex: 1,
						pageCount: 1,
						countPerPage: 10
					}
				};
			}
			return $pt.createModel(model);
		},
		getAdvancedSearchDialogLayout: function () {
			var _this = this;
			var layout = this.getComponentOption('searchDialogLayout');
			if (layout == null) {
				var direction = this.props.direction;
				if (!direction) {
					direction = NForm.LABEL_DIRECTION;
				}
				var buttonCSS = {
					'pull-right': true,
					'pull-down': direction == 'vertical'
				};

				layout = {
					name: {
						label: NSearchText.ADVANCED_SEARCH_DIALOG_NAME_LABEL,
						comp: {
							type: $pt.ComponentConstants.Text
						},
						pos: {
							row: 10,
							col: 10,
							width: 6
						}
					},
					button: {
						label: NSearchText.ADVANCED_SEARCH_DIALOG_BUTTON_TEXT,
						comp: {
							type: $pt.ComponentConstants.Button,
							style: 'primary',
							click: function (model) {
								var currentModel = $.extend({}, model.getCurrentModel());
								// remove query result and pagination criteria JSON, only remain the criteria data.
								delete currentModel.items;
								delete currentModel.criteria;

								if (NSearchText.ADVANCED_SEARCH_PROXY) {
									currentModel = NSearchText.ADVANCED_SEARCH_PROXY.call(this, currentModel);
								}

								$pt.internalDoPost(_this.getAdvancedSearchUrl(), currentModel, {
									done: function (data) {
										if (typeof data === 'string') {
											data = JSON.parse(data);
										}
										if (NSearchText.ADVANCED_SEARCH_PROXY_CALLBACK) {
											data = NSearchText.ADVANCED_SEARCH_PROXY_CALLBACK.call(this, data, this.getDataId());
										}
										model.mergeCurrentModel(data);
										model.set('criteria' + $pt.PROPERTY_SEPARATOR + 'url', this.getAdvancedSearchUrl());
										window.console.debug(model.getCurrentModel());
										this.state.searchDialog.forceUpdate();
									}.bind(_this)
								});
							}
						},
						css: {
							comp: $pt.LayoutHelper.classSet(buttonCSS)
						},
						pos: {
							row: 10,
							col: 20,
							width: 6
						}
					},
					items: {
						label: NSearchText.ADVANCED_SEARCH_DIALOG_RESULT_TITLE,
						comp: {
							type: $pt.ComponentConstants.Table,
							indexable: true,
							searchable: false,
							rowOperations: {
								icon: "check",
								click: function (row) {
									_this.pickupAdvancedResultItem(row);
									_this.state.searchDialog.hide();
								}
							},
							pageable: true,
							criteria: "criteria",
							columns: [{
								title: NSearchText.ADVANCED_SEARCH_DIALOG_CODE_LABEL,
								width: 200,
								data: "code"
							}, {
								title: NSearchText.ADVANCED_SEARCH_DIALOG_NAME_LABEL,
								width: 400,
								data: "name"
							}]
						},
						pos: {
							row: 20,
							col: 10,
							width: 12
						}
					}
				};
			} else {
				layout = layout.call(this);
			}
			return $pt.createFormLayout(layout);
		},
		getTextInViewMode: function() {
			var value = this.getValueFromModel();
			if (value != null) {
				// if (this.state.viewLabel) {
				// 	return this.state.viewLabel;
				// }
			}
			return value;
		}
	}));
	$pt.Components.NSearchText = NSearchText;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.Search, function (model, layout, direction, viewMode) {
		return <$pt.Components.NSearchText {...$pt.LayoutHelper.transformParameters(model, layout, direction, viewMode)}/>;
	});
}(window, jQuery, React, ReactDOM, $pt));
