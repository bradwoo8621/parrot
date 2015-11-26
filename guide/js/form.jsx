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
			tag: 'NForm',
			model: 'model',
			layout: 'layout'
		});

		var sections = {
			grid: function () {
				var layoutTemplate = {
					_sections: {
						one: {
							label: 'Section One',
							row: 10
						},
						two: {
							label: 'Section Two',
							row: 20,
							layout: {
								code: {
									label: 'Code'
								}
							}
						}
					},
					name: {
						label: 'Name',
						pos: {
							section: 'one'
						}
					}
				};
				var layoutCode = $demo.convertFormLayoutCreatorToString({
					variable: 'layout',
					template: layoutTemplate
				});
				return {
					id: 'form-sections-grid',
					title: 'In Grid',
					desc: ['Form with sections in grid.',
						<span>
                        Components in section can be specified by <code>section</code> in <code>pos</code> attribute.
                        Or declared in <code>layout</code> attribute directly,
                        in this situation, <code>section</code> in <code>pos</code> is not necessary.
                    </span>,
						'Refers to Form Cell to understanding how to define a cell component in section.'],
					xml: {width: 12, xml: <NForm model={model} layout={$pt.createFormLayout(layoutTemplate)}/>},
					code: [modelCode, layoutCode, compCode],
					index: 10
				};
			},
			position: function () {
				var layoutTemplate = {
					_sections: {
						one: {
							label: 'Section One',
							row: 10,
							col: 10,
							width: 6
						},
						two: {
							label: 'Section Two',
							row: 20,
							col: 10,
							width: 3
						},
						three: {
							label: 'Section Three',
							row: 10,
							col: 20,
							width: 6
						}
					},
					name: {
						label: 'Name',
						pos: {
							section: 'one'
						}
					},
					code: {
						label: 'Code',
						pos: {
							width: 6,
							section: 'two'
						}
					},
					other: {
						label: 'Other',
						pos: {
							section: 'three'
						}
					}
				};
				var layoutCode = $demo.convertFormLayoutCreatorToString({
					variable: 'layout',
					template: layoutTemplate
				});
				return {
					id: 'form-sections-position',
					title: 'Position',
					desc: [
						<span><code>width</code> is used to control section width, from 1 to 12, default is 12.</span>,
						<span><code>row</code> and <code>col</code> are used to control the section position. Continuous is not necessary.</span>,
						<span className='text-danger'>Note if no <code>row</code> or <code>col</code> set, order of component might be random.</span>],
					xml: {width: 12, xml: <NForm model={model} layout={$pt.createFormLayout(layoutTemplate)}/>},
					code: [modelCode, layoutCode, compCode],
					index: 20
				};
			},
			noBorder: function () {
				var layoutTemplate = {
					_sections: {
						one: {}
					},
					name: {
						label: 'Name',
						pos: {
							section: 'one'
						}
					}
				};
				var layoutCode = $demo.convertFormLayoutCreatorToString({
					variable: 'layout',
					template: layoutTemplate
				});
				return {
					id: 'form-sections-no-border',
					title: 'No Border',
					desc:
						<span>Leave <code>label</code> null or undefined means remove the panel title and border.</span>,
					xml: {width: 12, xml: <NForm model={model} layout={$pt.createFormLayout(layoutTemplate)}/>},
					code: [modelCode, layoutCode, compCode],
					index: 30
				};
			},
			collapsible: function () {
				var layoutTemplate = {
					_sections: {
						one: {
							label: 'Section One',
							collapsible: true,
							expanded: false
						}
					},
					name: {
						label: 'Name',
						pos: {
							section: 'one'
						}
					}
				};
				var layoutCode = $demo.convertFormLayoutCreatorToString({
					variable: 'layout',
					template: layoutTemplate
				});
				return {
					id: 'form-sections-collapsible',
					title: 'Collapsible',
					desc: [<span><code>collapsible</code> makes panel collapsible.</span>,
						<span><code>expanded</code> set the initial expand state of section.</span>],
					xml: {width: 12, xml: <NForm model={model} layout={$pt.createFormLayout(layoutTemplate)}/>},
					code: [modelCode, layoutCode, compCode],
					index: 40
				};
			},
			style: function () {
				var layoutTemplate = {
					_sections: {
						one: {
							label: 'Section One',
							style: 'primary'
						}
					},
					name: {
						label: 'Name',
						pos: {
							section: 'one'
						}
					}
				};
				var layoutCode = $demo.convertFormLayoutCreatorToString({
					variable: 'layout',
					template: layoutTemplate
				});
				return {
					id: 'form-sections-style',
					title: 'Style',
					desc: ['Section with style.',
						<span>Style can be <code>default</code>, <code>primary</code>, <code>success</code>, <code>info</code>, <code>warning</code>, <code>danger</code>.</span>,
						'Or any customized style name, refer to Bootstrap panel styles.'],
					xml: {width: 12, xml: <NForm model={model} layout={$pt.createFormLayout(layoutTemplate)}/>},
					code: [modelCode, layoutCode, compCode],
					index: 50
				};
			},
			other: function () {
				var layoutTemplate = {
					_sections: {
						one: {
							label: 'Section One',
							checkInTitle: {
								data: 'Check',
								label: 'Control the expandable',
								collapsible: 'same'
							},
							expandedLabel: 'I\'m expanded.',
							collapsedLabel: 'I\'m collapsed.'
						}
					},
					name: {
						label: 'Name',
						pos: {
							section: 'one'
						}
					}
				};
				var layoutCode = $demo.convertFormLayoutCreatorToString({
					variable: 'layout',
					template: layoutTemplate
				});
				return {
					id: 'form-sections-other',
					title: 'Other Properties',
					desc: [
						<span><code>checkInTitle</code> add a check box into section title.</span>,
						<span><code>expandedLabel</code> render the section title when it is expanded.</span>,
						<span><code>collapsedLabel</code> render the section title when it is collapsed.</span>
					],
					xml: {width: 12, xml: <NForm model={model} layout={$pt.createFormLayout(layoutTemplate)}/>},
					code: [modelCode, layoutCode, compCode],
					index: 60
				};
			}
		};
		var cards = {
			wizard: function () {
				var layoutTemplate = {
					_cards: {
						one: {
							label: 'One'
						},
						two: {
							label: 'Two'
						}
					},
					name: {
						label: 'Name',
						pos: {
							card: 'one'
						}
					},
					code: {
						label: 'Code',
						pos: {
							card: 'two'
						}
					}
				};
				var layoutCode = $demo.convertFormLayoutCreatorToString({
					variable: 'layout',
					template: layoutTemplate
				});
				return {
					id: 'form-cards-wizard',
					title: 'Wizard',
					desc: 'Form as wizard.',
					xml: {width: 12, xml: <NForm model={model} layout={$pt.createFormLayout(layoutTemplate)}/>},
					code: [modelCode, layoutCode, compCode],
					index: 10
				};
			},
			freeCard: function () {
				var layoutTemplate = {
					_freeCard: true,
					_cardButtonShown: false,
					_cards: {
						one: {
							label: 'One'
						},
						two: {
							label: 'Two'
						}
					},
					name: {
						label: 'Name',
						pos: {
							card: 'one'
						}
					},
					code: {
						label: 'Code',
						pos: {
							card: 'two'
						}
					}
				};
				var layoutCode = $demo.convertFormLayoutCreatorToString({
					variable: 'layout',
					template: layoutTemplate
				});
				return {
					id: 'form-cards-free',
					title: 'Free',
					desc: ['Form with free cards.',
						<span>Set <code>_freeCard</code> to true, change the wizards to free card.</span>,
						<span>Set <code>_cardButtonShown</code> to false, hide the default previous/next buttons.</span>],
					xml: {width: 12, xml: <NForm model={model} layout={$pt.createFormLayout(layoutTemplate)}/>},
					code: [modelCode, layoutCode, compCode],
					index: 20
				};
			},
			active: function () {
				var layoutTemplate = {
					_freeCard: true,
					_cardButtonShown: false,
					_cards: {
						one: {
							label: 'One'
						},
						two: {
							label: 'Two',
							active: true
						}
					},
					name: {
						label: 'Name',
						pos: {
							card: 'one'
						}
					},
					code: {
						label: 'Code',
						pos: {
							card: 'two'
						}
					}
				};
				var layoutCode = $demo.convertFormLayoutCreatorToString({
					variable: 'layout',
					template: layoutTemplate
				});
				return {
					id: 'form-cards-active',
					title: 'Active',
					desc: 'Form with given active card.',
					xml: {width: 12, xml: <NForm model={model} layout={$pt.createFormLayout(layoutTemplate)}/>},
					code: [modelCode, layoutCode, compCode],
					index: 30
				};
			},
			index: function () {
				var layoutTemplate = {
					_freeCard: true,
					_cardButtonShown: false,
					_cards: {
						one: {
							label: 'One',
							index: 20
						},
						two: {
							label: 'Two',
							index: 10
						}
					},
					name: {
						label: 'Name',
						pos: {
							card: 'one'
						}
					},
					code: {
						label: 'Code',
						pos: {
							card: 'two'
						}
					}
				};
				var layoutCode = $demo.convertFormLayoutCreatorToString({
					variable: 'layout',
					template: layoutTemplate
				});
				return {
					id: 'form-cards-index',
					title: 'Index',
					desc: 'Form with indexed cards.',
					xml: {width: 12, xml: <NForm model={model} layout={$pt.createFormLayout(layoutTemplate)}/>},
					code: [modelCode, layoutCode, compCode],
					index: 40
				};
			},
			backable: function () {
				var layoutTemplate = {
					_cards: {
						one: {
							label: 'One',
							backable: false
						},
						two: {
							label: 'Two'
						}
					},
					name: {
						label: 'Name',
						pos: {
							card: 'one'
						}
					},
					code: {
						label: 'Code',
						pos: {
							card: 'two'
						}
					}
				};
				var layoutCode = $demo.convertFormLayoutCreatorToString({
					variable: 'layout',
					template: layoutTemplate
				});
				return {
					id: 'form-cards-backable',
					title: 'Backable',
					desc: ['Form with one-direction cards.',
						<span>Cannot back to previous card if <code>backable</code> is specified as false.</span>],
					xml: {width: 12, xml: <NForm model={model} layout={$pt.createFormLayout(layoutTemplate)}/>},
					code: [modelCode, layoutCode, compCode],
					index: 50
				};
			},
			badge: function () {
				var layoutTemplate = {
					_cards: {
						one: {
							label: 'One',
							badge: 'premium'
						},
						two: {
							label: 'Two',
							badge: 'amount',
							badgeRender: function (value, model) {
								return (value + '').currencyFormat();
							}
						}
					},
					name: {
						label: 'Name',
						pos: {
							card: 'one'
						}
					},
					code: {
						label: 'Code',
						pos: {
							card: 'two'
						}
					}
				};
				var layoutCode = $demo.convertFormLayoutCreatorToString({
					variable: 'layout',
					template: layoutTemplate
				});
				var badgeModel = {
					premium: 1000,
					amount: 2000
				};
				var modelCode = $demo.convertModelCreatorToString({
					variable: 'model',
					template: badgeModel
				});
				return {
					id: 'form-cards-badge',
					title: 'Badge',
					desc: ['Form with badge cards.',
						<span><code>badge</code> is the property name of model.</span>,
						<span>Use <code>badgeRender</code> to render the badge content to deal with the complex situation.</span>],
					xml: {
						width: 12,
						xml: <NForm model={$pt.createModel(badgeModel)} layout={$pt.createFormLayout(layoutTemplate)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 60
				};
			},
			buttons: function () {
				var layoutTemplate = {
					_cards: {
						one: {
							label: 'One',
							leftButtons: {
								text: 'To Last',
								style: 'primary',
								successCallback: 'return',
								click: function (model) {
									return 'three';
								}
							}
						},
						two: {
							label: 'Two',
							rightButtons: [{
								text: 'Custom Previous',
								style: 'danger',
								successCallback: 'previous',
								click: function (model) {
									return true;
								}
							}, {
								text: 'Custom Next',
								successCallback: 'next',
								style: 'success',
								click: function (model) {
									return true;
								}
							}]
						},
						three: {
							label: 'Three',
							leftButtons: {
								icon: 'credit-card',
								style: 'info'
							},
							finishButton: {
								style: 'warning',
								text: 'Finish'
							}
						}
					},
					name: {
						label: 'Name',
						pos: {
							card: 'one'
						}
					},
					code: {
						label: 'Code',
						pos: {
							card: 'two'
						}
					},
					other: {
						label: 'Other',
						pos: {
							card: 'three'
						}
					}
				};
				var layoutCode = $demo.convertFormLayoutCreatorToString({
					variable: 'layout',
					template: layoutTemplate
				});
				return {
					id: 'form-cards-buttons',
					title: 'Buttons',
					desc: ['Form with customized buttons.',
						<span>
                        <code>leftButtons</code> and <code>rightButtons</code> are used to define the customized buttons in card bottom.
                        Both can be defined as JSON or JSON array, detail properties refers to Form Button.
                    </span>,
						<span>
                        There are three options of <code>successCallback</code>: <code>previous</code>, <code>next</code> and <code>return</code>.
                        For <code>previous</code> and <code>next</code>, jump to previous or next card if click function returns true.
                        For <code>return</code>, jump to card which has key is same as return value of click function.
                        Note <code>backable</code> is not effective here.
                    </span>,
						<span>
                        <code>finishButton</code> is effective in last card, if it is defined in other cards, will not be shown.
                        Only one finish button can be defined.
                    </span>],
					xml: {
						width: 12,
						xml: <NForm model={model} layout={$pt.createFormLayout(layoutTemplate)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 70
				};
			},
			sections: function () {
				var layoutTemplate = {
					_cards: {
						one: {
							label: 'One',
							_sections: {
								one: {
									label: 'Section One in Card One'
								}
							}
						},
						two: {
							label: 'Two'
						}
					},
					name: {
						label: 'Name',
						pos: {
							section: 'one',
							card: 'one'
						}
					},
					code: {
						label: 'Code',
						pos: {
							card: 'two'
						}
					}
				};
				var layoutCode = $demo.convertFormLayoutCreatorToString({
					variable: 'layout',
					template: layoutTemplate
				});
				return {
					id: 'form-cards-sections',
					title: 'Sections',
					desc: ['Form with cards and sections.',
						<span>
                        <code>_sections</code> is also can be defined in card, sames as sections only.
                        If there is sections defined, the component which defined in form, must declared the <code>section</code> attribute.
                    </span>,
						<span>Cell component cannot be defined in card directly, via section or specified card in <code>pos</code></span>],
					xml: {
						width: 12,
						xml: <NForm model={model} layout={$pt.createFormLayout(layoutTemplate)}/>
					},
					code: [modelCode, layoutCode, compCode],
					index: 80
				};
			}
		};
		var all = {
			defaultOptions: function () {
				var layoutTemplate = {
					name: {
						label: 'Name'
					}
				};
				var layoutCode = $demo.convertFormLayoutCreatorToString({
					variable: 'layout',
					template: layoutTemplate
				});
				return {
					id: 'form-default',
					title: 'Default',
					desc: ['A simple form which only contains one text component.',
						'Refers to Form Cell to understanding how to define a cell component in form.'],
					xml: {width: 12, xml: <NForm model={model} layout={$pt.createFormLayout(layoutTemplate)}/>},
					code: [modelCode, layoutCode, compCode],
					index: 10
				};
			},
			sections: function () {
				return {
					id: 'form-sections',
					title: 'Sections',
					desc: 'Form with sections defined.',
					index: 20,
					children: $demo.convertToExampleList(sections)
				}
			},
			cards: function () {
				return {
					id: 'form-cards',
					title: 'Cards',
					desc: 'Form with cards defined.',
					index: 30,
					children: $demo.convertToExampleList(cards)
				}
			},
			asCell: function () {
				return {
					id: 'form-as-cell',
					title: 'As Cell',
					desc: ['Form also can be a cell component. It means form can be nested.'],
					code: $demo.convertFormLayoutCreatorToString({
						variable: 'layout',
						template: {
							form: {
								comp: {
									type: $pt.ComponentConstants.Form,
									editLayout: {
										name: {
											label: 'Name'
										}
									}
								}
							}
						}
					})
				};
			},
			direction: function () {
				return {
					id: 'form-direction',
					title: 'Label Direction',
					desc: ['Label direction can be specified when construct form programmatically, actually pass to each Form Cell.',
						<span><code>horizontal</code> and <code>vertical</code>(default value) are acceptable options.<br/>
						Or change the global constants via <code>NForm.LABEL_DIRECTION = 'horizontal';</code>.</span>],
					code: '<NForm model={model} layout={layout} direction="horizontal" />'
				}
			},
			css: function () {
				return {
					id: 'form-class-name',
					title: 'CSS',
					desc: ['Customized CSS class can be specified when construct form programmatically.'],
					code: "<NForm model={model} layout={layout} className='your-class-name' />\n"
				};
			}
		};
		return $demo.convertToExampleList(all);
	};

	var renderer = $pt.getService($demo, 'renderer');
	renderer.form = function () {
		React.render(<ExampleList title='Form'
		                          formType='$pt.ComponentConstants.Form'
		                          items={painter()}/>, document.getElementById('main'));
	};
}(this, jQuery));
