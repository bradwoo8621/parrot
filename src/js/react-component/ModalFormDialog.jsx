/**
 * modal form dialog
 *
 * depends NPanelFooter, NForm, NConfirm
 */
(function (window, $, React, ReactDOM, $pt) {
	var NModalForm = React.createClass({
		displayName: 'NModalForm',
		statics: {
			/**
			 * create form modal dialog
			 * @param title
			 * @param className
			 * @returns {object}
			 */
			createFormModal: function (title, className) {
				if ($pt.formModalIndex === undefined || $pt.formModalIndex === null) {
					$pt.formModalIndex = 1500;
				} else {
					$pt.formModalIndex += 1;
				}
				var containerId = "form_modal_container_" + $pt.formModalIndex;
				var container = $("#" + containerId);
				if (container.length == 0) {
					$("<div id='" + containerId + "' />").appendTo($(document.body));
				}
				var css = {
					"n-modal-form": true
				};
				if (className) {
					css[className] = true;
				}
				return ReactDOM.render(<$pt.Components.NModalForm title={title} className={$pt.LayoutHelper.classSet(css)}
				                                zIndex={$pt.formModalIndex}/>,
					document.getElementById(containerId));
			},
			RESET_CONFIRM_TITLE: "Reset Data",
			RESET_CONFIRM_MESSAGE: ["Are you sure to reset data?", "All data will be lost and cannot be recovered."],
			CANCEL_CONFIRM_TITLE: "Cancel Editing",
			CANCEL_CONFIRM_MESSAGE: ["Are you sure to cancel current operating?", "All data will be lost and cannot be recovered."]
		},
		getInitialState: function () {
			return {
				visible: false,
				expanded: true,
				collapsible: false,
				draggable: true
			};
		},
		/**
		 * set z-index
		 */
		fixDocumentPadding: function () {
			document.body.style.paddingRight = 0;
		},
		setDraggable: function() {
			if (!this.isDraggable() || !this.refs.top) {
				return;
			}
			var top = $(ReactDOM.findDOMNode(this.refs.top));
			var modal = top.children('.modal');
			modal.drags({handle: '.modal-header'});
			modal.css({
				overflow: 'visible',
				height: 0
			});
			var dialog = modal.children('.modal-dialog');
			dialog.css({
				height: 0
			});

			if (!this.state.modal) {
				top.find('.modal-backdrop').hide();
			}

			// the initial position
			if (this.state.pos) {
				// dialog content position is relative to dialog.
				// dialog has margin.
				var dialogPosition = {
					top: parseInt(dialog.css('margin-top')),
					left: parseInt(dialog.css('margin-left')),
					bottom: parseInt(dialog.css('margin-bottom')),
					right: parseInt(dialog.css('margin-right'))
				};
				var content = dialog.children('.modal-content');
				var contentPosition = {};
				var currentContentTop = parseInt(content.css('top'));
				if (isNaN(currentContentTop)) {
					if (this.state.pos.bottom != null) {
						contentPosition.bottom = dialogPosition.bottom + content.height() - $(window).height();
					} else if (this.state.pos.top != null) {
						contentPosition.top = this.state.pos.top - dialogPosition.top;
					}
				} else {
					contentPosition.top = currentContentTop;
				}
				var currentContentLeft = parseInt(content.css('left'));
				if (isNaN(currentContentLeft)) {
					if (this.state.pos.right != null) {
						contentPosition.right = this.state.pos.right - dialogPosition.right;
					} else if (this.state.pos.left != null) {
						contentPosition.left = this.state.pos.left - dialogPosition.left;
					}
				} else {
					contentPosition.left = currentContentLeft;
				}
				if (Object.keys(contentPosition).length > 0) {
					content.css(contentPosition);
				}
			}
		},
		stopDraggable: function() {
			if (this.refs.top) {
				var top = $(ReactDOM.findDOMNode(this.refs.top));
				var modal = top.children('.modal');
				modal.stopDrags({handle: '.modal-header'});
			}
		},
		/**
		 * did update
		 * @param prevProps
		 * @param prevState
		 */
		componentDidUpdate: function (prevProps, prevState) {
			this.fixDocumentPadding();
			this.setDraggable();
			if (this.isDialogCloseShown()) {
				$(document).on('keyup', this.onDocumentKeyUp);
			}
			if (this.state.visible) {
				$(document).on('keydown', this.onDocumentKeyDown);
			} else {
				$(document).off('keydown', this.onDocumentKeyDown);
			}
		},
		componentWillUpdate: function() {
			this.stopDraggable();
			if (this.isDialogCloseShown()) {
				$(document).off('keyup', this.onDocumentKeyUp);
			}
			$(document).off('keydown', this.onDocumentKeyDown);
		},
		/**
		 * did mount
		 */
		componentDidMount: function () {
			this.fixDocumentPadding();
			this.setDraggable();
			if (this.isDialogCloseShown()) {
				$(document).on('keyup', this.onDocumentKeyUp);
			}
			if (this.state.visible) {
				$(document).on('keydown', this.onDocumentKeyDown);
			} else {
				$(document).off('keydown', this.onDocumentKeyDown);
			}
		},
		componentWillUnmount: function() {
			this.stopDraggable();
			if (this.isDialogCloseShown()) {
				$(document).off('keyup', this.onDocumentKeyUp);
			}
			$(document).off('keydown', this.onDocumentKeyDown);
		},
		/**
		 * render footer
		 * @returns {XML}
		 */
		renderFooter: function () {
			if (this.state.footer === false || !this.state.expanded) {
				return <div ref='footer'/>;
			} else {
				return (<div className="n-modal-form-footer modal-footer" ref='footer'>
					<$pt.Components.NPanelFooter reset={this.getResetButton()}
					              validate={this.getValidationButton()}
					              save={this.getSaveButton()}
					              cancel={this.getCancelButton()}
					              left={this.getLeftButton()}
					              right={this.getRightButton()}
					              model={this.getModel()}
								  view={this.isViewMode()}/>
				</div>);
			}
		},
		renderBody: function() {
			var css = {
				'modal-body': true,
				hide: !this.state.expanded
			};
			return (<div className={$pt.LayoutHelper.classSet(css)}>
				<$pt.Components.NForm model={this.getModel()}
					   layout={this.getLayout()}
					   direction={this.getDirection()}
					   view={this.isViewMode()}
				       ref="form"/>
			</div>);
		},
		renderCloseButton: function() {
			if (this.isDialogCloseShown()) {
				return (<button className="close"
						onClick={this.hide}
						aria-label="Close"
						style={{marginTop: '-2px'}}>
					<span aria-hidden="true">×</span>
				</button>);
			}
			return null;
		},
		/**
		 * render
		 * @returns {*}
		 */
		render: function () {
			if (!this.state.visible) {
				return null;
			}
			var title = this.state.title ? this.state.title : this.props.title;
			if (this.isCollapsible()) {
				title = (<a href='javascript:void(0);' onClick={this.onTitleClicked}>{title}</a>);
			}
			var css = {
				'n-confirm': true,
				modal: true,
				fade: true,
				in: true
			};
			if (this.props.className) {
				css[this.props.className] = true;
			}
			// tabindex="0"
			return (<div ref='top'>
				<div className="modal-backdrop fade in" style={{zIndex: this.props.zIndex * 1}}></div>
				<div className={$pt.LayoutHelper.classSet(css)}
					 role="dialog"
					 ref="container"
					 tabIndex="0"
					 style={{display: 'block', zIndex: this.props.zIndex * 1 + 1}}>
					<div className="modal-dialog">
						<div className="modal-content" role="document">
							<div className="modal-header">
								{this.renderCloseButton()}
								<h4 className="modal-title">{title}</h4>
							</div>
							{this.renderBody()}
							{this.renderFooter()}
						</div>
					</div>
				</div>
			</div>);
		},
		onDocumentKeyUp: function(evt) {
			if (evt.keyCode === 27) { // escape
				this.hide();
			}
		},
		onDocumentKeyDown: function(evt) {
			// console.log(evt);
			if (evt.keyCode === 9) { // tab
				// evt.preventDefault();
				var target = $(evt.target);
				var container = $(this.refs.container);
				console.log(target.closest(container).length == 0);
				if (target.closest(container).length == 0) {
					container.focus();
				}
			}
		},
		/**
		 * on title clicked
		 */
		onTitleClicked: function() {
			// TODO no animotion, tried, weird.
			this.setState({expanded: !this.state.expanded});
		},
		/**
		 * on reset clicked
		 */
		onResetClicked: function () {
			var reset = function () {
				this.getModel().reset();
				this.refs.form.forceUpdate();
			};
			$pt.Components.NConfirm.getConfirmModal().show(NModalForm.RESET_CONFIRM_TITLE,
				NModalForm.RESET_CONFIRM_MESSAGE,
				reset.bind(this));
		},
		/**
		 * on validate clicked
		 */
		onValidateClicked: function () {
			this.getModel().validate();
			this.forceUpdate();
		},
		/**
		 * on cancel clicked
		 */
		onCancelClicked: function () {
			if (this.state.buttons && (typeof this.state.buttons.cancel === 'function')) {
				this.hide();
			} else {
				$pt.Components.NConfirm.getConfirmModal().show(NModalForm.CANCEL_CONFIRM_TITLE,
					NModalForm.CANCEL_CONFIRM_MESSAGE,
					this.hide);
			}
		},
		/**
		 * get model
		 * @returns {ModelInterface}
		 */
		getModel: function () {
			return this.state.model;
		},
		/**
		 * get layout
		 * @returns {FormLayout}
		 */
		getLayout: function () {
			return this.state.layout;
		},
		/**
		 * get direction
		 * @returns {string}
		 */
		getDirection: function () {
			return this.state.direction;
		},
		/**
		 * get left button configuration
		 * @returns {{}|{}[]}
		 */
		getLeftButton: function () {
			return this.state.buttons ? this.state.buttons.left : null;
		},
		/**
		 * get right button configuration
		 * @returns {{}|{}[]}
		 */
		getRightButton: function () {
			return this.state.buttons ? this.state.buttons.right : null;
		},
		/**
		 * get validation button
		 * @returns {function}
		 */
		getValidationButton: function () {
			if (this.state.buttons && this.state.buttons.validate === false) {
				return null;
			} else if (this.isViewMode()) {
				return null;
			} else {
				return this.onValidateClicked;
			}
		},
		/**
		 * get cancel button
		 * @returns {function}
		 */
		getCancelButton: function () {
			if (this.state.buttons && this.state.buttons.cancel === false) {
				return null;
			} else {
				return this.onCancelClicked;
			}
		},
		/**
		 * get reset button
		 * @returns {function}
		 */
		getResetButton: function () {
			if (this.state.buttons && this.state.buttons.reset === false) {
				return null;
			} else if (this.isViewMode()) {
				return null;
			} else {
				return this.onResetClicked;
			}
		},
		/**
		 * get save button configuration
		 * @returns {{}}
		 */
		getSaveButton: function () {
			return this.state.buttons ? this.state.buttons.save : null;
		},
		/**
		 * is dialog close button shown
		 * @returns boolean
		 */
		isDialogCloseShown: function() {
			return this.state.buttons ? this.state.buttons.dialogCloseShown !== false : true;
		},
		/**
		 * is draggable
		 * @returns boolean
		 */
		isDraggable: function() {
			return this.state.draggable || !this.state.modal;
		},
		/**
		 * is collapsible
		 * @returns boolean
		 */
		isCollapsible: function() {
			return this.state.collapsible;
		},
		/**
		 * is expanded
		 * @returns boolean
		 */
		isExpanded: function() {
			return this.state.expanded;
		},
		/**
		 * is view mode
		 * @returns boolean
		 */
		isViewMode: function() {
			return this.state.view;
		},
		/**
		 * validate
		 * @returns {boolean}
		 */
		validate: function () {
			this.getModel().validate();
			this.forceUpdate();
			return this.getModel().hasError();
		},
		/**
		 * hide dialog
		 * @return model
		 */
		hide: function () {
			var model = this.state.model;
			if (this.state.buttons && (typeof this.state.buttons.cancel === 'function')) {
				this.state.buttons.cancel.call(this, model, function() {
					this.setState({
						visible: false,
						model: null,
						layout: null,
						buttons: null
					});
				}.bind(this));
			} else {
				this.setState({
					visible: false,
					model: null,
					layout: null,
					buttons: null
				});
			}
			return model;
		},
		/**
		 * show dialog
		 *
		 * from 0.0.3, all parameters can be defined in first as a JSON.
		 * @param model
		 * @param layout
		 * @param buttons
		 * @param direction vertical or horizontal
		 * @param footer {boolean}
		 * @param title {string}
		 */
		show: function (model, layout, buttons, direction, footer, title) {
			if (!model.getCurrentModel) {
				// test the model is ModelInterface or not
				this.setState({
					visible: true,
					model: model.model,
					layout: model.layout,
					buttons: model.buttons,
					direction: model.direction,
					footer: model.footer,
					title: model.title,
					draggable: model.draggable,
					modal: model.modal == null ? (model.draggable ? false : true) : true,
					collapsible: model.collapsible,
					expanded: model.expanded == null ? true : model.expanded,
					pos: model.pos,
					view: model.view === true
				});
			} else {
				window.console.warn("Properties [draggable, expanded, collapsible, pos] are not supported in parameters, use JSON parameter instead.");
				this.setState({
					visible: true,
					model: model,
					layout: layout,
					buttons: buttons,
					direction: direction,
					footer: footer,
					title: title,
					draggable: false,
					modal: true,
					expanded: true,
					collapsible: false,
					view: false
				});
			}
		}
	});
	$pt.Components.NModalForm = NModalForm;

	$.fn.drags = function(opt) {
		opt = $.extend({handle:"",cursor:"move"}, opt);
		var $el = null;
		if(opt.handle === "") {
			$el = this;
		} else {
			$el = this.find(opt.handle);
		}

		return $el.css('cursor', opt.cursor).on("mousedown", function(e) {
			var $drag = null;
			if(opt.handle === "") {
				$drag = $(this).addClass('draggable');
			} else {
				$drag = $(this).addClass('active-handle').parent().addClass('draggable');
			}
			var z_idx = $drag.css('z-index'),
			drg_h = $drag.outerHeight(),
			drg_w = $drag.outerWidth(),
			pos_y = $drag.offset().top + drg_h - e.pageY,
			pos_x = $drag.offset().left + drg_w - e.pageX;

			//          $drag.css('z-index', 1000).parents().on("mousemove", function(e) {
			$drag.parents().on("mousemove", function(e) {
				$('.draggable').offset({
					top:e.pageY + pos_y - drg_h,
					left:e.pageX + pos_x - drg_w
				}).on("mouseup", function() {
					$(this).removeClass('draggable').css('z-index', z_idx);
				});
			});
			e.preventDefault(); // disable selection
		}).on("mouseup", function() {
			if(opt.handle === "") {
				$(this).removeClass('draggable');
			} else {
				$(this).removeClass('active-handle').parent().removeClass('draggable');
			}
		});
	};
	$.fn.stopDrags = function(opt) {
		opt = $.extend({handle:"",cursor:"move"}, opt);
		var $el = null;
		if(opt.handle === "") {
			$el = this;
		} else {
			$el = this.find(opt.handle);
		}

		var $drag = null;
		if(opt.handle === "") {
			$drag = $($el);
		} else {
			$drag = $($el).parent();
		}
		$drag.parents().off("mousemove");

		return $el.off('mousedown mouseup');
	};
}(window, jQuery, React, ReactDOM, $pt));
