/**
 * Created by brad.wu on 8/21/2015.
 */
(function (context, $, $pt) {
	var NLabel = React.createClass($pt.defineCellComponent({
		propTypes: {
			// model
			model: React.PropTypes.object,
			// CellLayout
			layout: React.PropTypes.object
		},
		getDefaultProps: function () {
			return {
				defaultOptions: {
					textFromModel: true
				}
			};
		},
		/**
		 * will update
		 * @param nextProps
		 */
		componentWillUpdate: function (nextProps) {
			// remove post change listener to handle model change
			this.removePostChangeListener(this.__forceUpdate);
			this.removeEnableDependencyMonitor();
			this.unregisterFromComponentCentral();
		},
		/**
		 * did update
		 * @param prevProps
		 * @param prevState
		 */
		componentDidUpdate: function (prevProps, prevState) {
			// add post change listener to handle model change
			this.addPostChangeListener(this.__forceUpdate);
			this.addEnableDependencyMonitor();
			this.registerToComponentCentral();
		},
		/**
		 * did mount
		 */
		componentDidMount: function () {
			// add post change listener to handle model change
			this.addPostChangeListener(this.__forceUpdate);
			this.addEnableDependencyMonitor();
			this.registerToComponentCentral();
		},
		/**
		 * will unmount
		 */
		componentWillUnmount: function () {
			// remove post change listener to handle model change
			this.removePostChangeListener(this.onModelChanged);
			this.removeEnableDependencyMonitor();
			this.unregisterFromComponentCentral();
		},
		render: function () {
			var texts = this.getText();
			if (!Array.isArray(texts)) {
				var currency = this.getComponentOption('currency');
				if (currency && texts != null && !(texts + '').isBlank()) {
					var fraction = this.getComponentOption('fraction');
					fraction = fraction ? fraction * 1 : 0;
					texts = (texts + '').currencyFormat(fraction);
				}
				if (texts == null || (texts + '').isBlank()) {
					texts = this.getComponentOption('replaceBlank') || this.getComponentOption('placeholder');
				}

				var left = this.getComponentOption('left');
				var right = this.getComponentOption('right');
				texts = left ? (left + texts) : texts;
				texts = right ? (texts + right) : texts;
				texts = [texts];
			}
			var css = {
				'n-disabled': !this.isEnabled()
			};
			css[this.getComponentCSS('n-label')] = true;
			var style = this.getComponentOption('style');
			if (style) {
				css['n-label-' + style] = true;
			}
			return (<div className={$pt.LayoutHelper.classSet(css)}>
				{texts.map(function (text) {
					return <span>{text}</span>;
				})}
			</div>);
		},
		getText: function () {
			if (this.isTextFromModel()) {
				return this.getValueFromModel();
			} else {
				return this.getLayout().getLabel();
			}
		},
		isTextFromModel: function () {
			return this.getComponentOption('textFromModel') !== false;
		}
	}));
	context.NLabel = NLabel;
}(this, jQuery, $pt));
