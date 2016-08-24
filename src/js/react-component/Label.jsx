/**
 * Created by brad.wu on 8/21/2015.
 */
(function (window, $, React, ReactDOM, $pt) {
	var NLabel = React.createClass($pt.defineCellComponent({
		displayName: 'NLabel',
		getDefaultProps: function () {
			return {
				defaultOptions: {
					textFromModel: true
				}
			};
		},
		render: function () {
			var texts = this.getText();
			if (!Array.isArray(texts)) {
				var convertor = this.getComponentOption('convertor');
				if (convertor && typeof convertor === 'function') {
					texts = [convertor.call(this, texts)];
				} else if (convertor && convertor.view) {
					// for NText compatibility
					texts = [convertor.view.call(this, texts)];
				} else {
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
				{texts.map(function (text, textIndex) {
					return <span key={textIndex}>{text}</span>;
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
	$pt.Components.NLabel = NLabel;
	$pt.LayoutHelper.registerComponentRenderer($pt.ComponentConstants.Label, function (model, layout, direction, viewMode) {
		return <$pt.Components.NLabel {...$pt.LayoutHelper.transformParameters(model, layout, direction, viewMode)}/>;
	});
}(window, jQuery, React, ReactDOM, $pt));
