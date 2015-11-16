var Code = React.createClass({
	propTypes: {
		code: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.arrayOf(React.PropTypes.string)])
	},
	componentDidMount: function () {
		hljs.highlightBlock($(React.findDOMNode(this.refs.code))[0]);
	},
	render: function () {
		return (<pre><code className='javascript xml json' ref='code'>
			{Array.isArray(this.props.code) ? this.props.code.join('\n') : this.props.code}
		</code></pre>);
	}
});

var Example = React.createClass({
	statics: {
		DEFAULT_WIDTH: 3
	},
	propTypes: {
		id: React.PropTypes.string,
		title: React.PropTypes.string,
		desc: React.PropTypes.oneOfType([React.PropTypes.string,
			React.PropTypes.element,
			React.PropTypes.arrayOf(React.PropTypes.oneOfType([
				React.PropTypes.string,
				React.PropTypes.element]))
		]),

		xml: React.PropTypes.oneOfType([
			React.PropTypes.element,
			React.PropTypes.shape({
				width: React.PropTypes.number,
				xml: React.PropTypes.element
			}),
			React.PropTypes.arrayOf(React.PropTypes.oneOfType([
				React.PropTypes.element,
				React.PropTypes.shape({
					width: React.PropTypes.number,
					xml: React.PropTypes.element
				})
			]))
		]),
		code: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.arrayOf(React.PropTypes.string)])
	},
	getInitialState: function () {
		return {
			showCode: false
		}
	},
	componentWillUpdate: function () {
		this.state.showCode = false;
	},
	renderXML: function (xml) {
		if (xml == null) {
			return null;
		}
		if (Array.isArray(xml)) {
			return xml.map(this.renderXML);
		} else {
			var css = {};
			css['col-sm-' + (xml.width ? xml.width : Example.DEFAULT_WIDTH)] = true;
			css['col-md-' + (xml.width ? xml.width : Example.DEFAULT_WIDTH)] = true;
			css['col-lg-' + (xml.width ? xml.width : Example.DEFAULT_WIDTH)] = true;
			return (<div className={$pt.LayoutHelper.classSet(css)}>
				{xml.xml ? xml.xml : xml}
			</div>);
		}
	},
	onCodeLinkClicked: function () {
		$(':focus').blur();
		this.setState({
			showCode: !this.state.showCode
		});
	},
	renderCodeLinkBlock: function () {
		if (!this.props.code) {
			return null;
		}
		return (
			<a href='javascript:void(0);' className='pull-right code-link'
			   onClick={this.onCodeLinkClicked}>Code</a>);
	},
	renderUIBlock: function () {
		return (<div className='row ui-block'>
			<div className='col-sm-12 col-md-12 col-lg-12'>
				<span className='ui-block-title'>Example</span>
				{this.renderCodeLinkBlock()}

				<div className='row'>
					{this.renderXML(this.props.xml)}
				</div>
			</div>
		</div>);
	},
	renderCodeBlock: function () {
		if (!this.props.code || !this.state.showCode) {
			return null;
		}
		return (<div className='row code-block'>
			<div className='col-sm-12 col-md-12 col-lg-12'>
				<Code code={this.props.code}/>
			</div>
		</div>);
	},
	renderExampleBlock: function () {
		if (!this.props.xml && !this.props.code) {
			return null;
		}
		return (<div className='col-sm-12 col-md-12 col-lg-12 example-block'>
			{this.renderUIBlock()}
			{this.renderCodeBlock()}
		</div>);
	},
	render: function () {
		return (<div className='row example'>
			<div className='col-sm-12 col-md-12 col-lg-12'>
				<h6 id={this.props.id} className='example-title'/>
				<h4>
					<a className="fa fa-fw fa-link example-title-link" href={'#' + this.props.id}/>
					{this.props.title}
				</h4>
				{this.props.desc}
			</div>
			{this.renderExampleBlock()}
		</div>);
	}
});

var ExampleList = React.createClass({
	propTypes: {
		title: React.PropTypes.string,
		formType: React.PropTypes.string,
		items: React.PropTypes.arrayOf(React.PropTypes.shape({
			id: React.PropTypes.string,
			title: React.PropTypes.string,
			desc: React.PropTypes.oneOfType([React.PropTypes.string,
				React.PropTypes.element,
				React.PropTypes.arrayOf(React.PropTypes.oneOfType([
					React.PropTypes.string,
					React.PropTypes.element]))
			]),
			xml: React.PropTypes.oneOfType([
				React.PropTypes.element,
				React.PropTypes.shape({
					width: React.PropTypes.number,
					xml: React.PropTypes.element
				}),
				React.PropTypes.arrayOf(React.PropTypes.oneOfType([
					React.PropTypes.element,
					React.PropTypes.shape({
						width: React.PropTypes.number,
						xml: React.PropTypes.element
					})
				]))
			]),
			code: React.PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.arrayOf(React.PropTypes.string)])
		}))
	},
	getInitialState: function () {
		return {}
	},
	componentDidMount: function () {
		$('body').scrollspy({target: '#scrollspy'})
	},
	renderItem: function (item) {
		if (item.children) {
			return (<div className='row'>
				<div className='col-sm-12 col-md-12 col-lg-12'>
					<h6 id={item.id} className='example-title'/>
					<h4>
						<a className="fa fa-fw fa-link example-title-link" href={'#' + item.id}/>
						{item.title}
					</h4>
					{item.desc}
				</div>
				<div className='col-sm-12 col-md-12 col-lg-12'>
					{item.children.map(this.renderItem)}
				</div>
			</div>);
		} else {
			return (<Example id={item.id}
			                 title={item.title}
			                 desc={item.desc}
			                 xml={item.xml}
			                 code={item.code}/>);
		}
	},
	renderNavItem: function (item) {
		if (item.children) {
			return (<li>
				<a href={'#' + item.id}>{item.title}</a>
				<ul className='nav'>
					{item.children.map(this.renderNavItem)}
				</ul>
			</li>);
		} else {
			return <li><a href={'#' + item.id}>{item.title}</a></li>;
		}
	},
	renderFormType: function () {
		if (this.props.formType) {
			return <h4>type: <code>{this.props.formType}</code></h4>;
		} else {
			return null;
		}
	},
	render: function () {
		return (<div className='row'>
			<div className='col-sm-9 col-md-9 col-lg-9'>
				<div className='row'>
					<div className='col-sm-12 col-md-12 col-lg-12 example-all-title'>
						<h2>{this.props.title}</h2>
						{this.renderFormType()}
						<hr/>
					</div>
					<div className='col-sm-12 col-md-12 col-lg-12'>
						{this.props.items.map(this.renderItem)}
					</div>
				</div>
			</div>
			<div id='scrollspy' className='col-md-3 col-lg-3'>
				<ul className='nav hidden-xs hidden-sm side-nav affix'
				    data-offset-top='64'
				    ref='nav'>
					{this.props.items.map(this.renderNavItem)}
				</ul>
			</div>
		</div>);
	}
});

var APIList = React.createClass({
	getInitialState: function () {
		return {}
	},
	componentDidMount: function () {
		$('body').scrollspy({target: '#scrollspy'})
	},
	renderChildren: function (item) {
		if (item.children) {
			return (<div className='col-sm-12 col-md-12 col-lg-12'>
				{item.children.map(this.renderItem)}
			</div>);
		} else {
			return null;
		}
	},
	renderItem: function (item) {
		return (<div className='row'>
			<div className='col-sm-12 col-md-12 col-lg-12'>
				<h6 id={item.id} className='example-title'/>
				<h4>
					<a className="fa fa-fw fa-link example-title-link" href={'#' + item.id}/>
					{item.title}
				</h4>
				{item.pattern ? (<code className='api-pattern'>{item.pattern}</code>) : null}
			</div>
			<div className='col-sm-12 col-md-12 col-lg-12 api-block'>
				{item.desc}
			</div>
			{this.renderChildren(item)}
		</div>);
	},
	renderNavItem: function (item) {
		if (item.children) {
			return (<li>
				<a href={'#' + item.id}>{item.title}</a>
				<ul className='nav'>
					{item.children.map(this.renderNavItem)}
				</ul>
			</li>);
		} else {
			return <li><a href={'#' + item.id}>{item.title}</a></li>;
		}
	},
	render: function () {
		return (<div className='row'>
			<div className='col-sm-9 col-md-9 col-lg-9'>
				<div className='row'>
					<div className='col-sm-12 col-md-12 col-lg-12 example-all-title'>
						<h2>{this.props.title}</h2>
						<hr/>
					</div>
					<div className='col-sm-12 col-md-12 col-lg-12'>
						{this.props.items.map(this.renderItem)}
					</div>
				</div>
			</div>
			<div id='scrollspy' className='col-md-3 col-lg-3'>
				<ul className='nav hidden-xs hidden-sm side-nav affix'
				    data-offset-top='64'
				    ref='nav'>
					{this.props.items.map(this.renderNavItem)}
				</ul>
			</div>
		</div>);
	}
});

(function (context, $pt) {
	var $demo = $pt.getService(context, '$demo');

	var stringify = function (obj, prop) {
		var placeholder = '____PLACEHOLDER____';
		var codetablePlaceholder = '____CODETABLE____';
		var modelPlaceholder = '____MODEL____';
		var fns = [];
		var codetables = [];
		var models = [];
		var json = JSON.stringify(obj, function (key, value) {
			if (typeof value === 'function') {
				fns.push(value);
				return placeholder;
			} else if (value != null && value.__initCodesArray) {
				codetables.push(value.name());
				return codetablePlaceholder;
			} else if (value != null && value.__base) {
				models.push(value.name());
				return modelPlaceholder;
			}
			return value;
		}, '\t');
		json = json.replace(new RegExp('"' + placeholder + '"', 'g'), function (_) {
			return fns.shift();
		}).replace(new RegExp('"' + codetablePlaceholder + '"', 'g'), function (_) {
			return codetables.shift();
		}).replace(new RegExp('"' + modelPlaceholder + '"', 'g'), function (_) {
			return models.shift();
		});
		return json;
	};
	$demo.convertModelCreatorToString = function (def) {
		var variableName = def.variable;
		var template = def.template;
		if (def.validatorVariable) {
			return "var " + def.validatorVariable + " = $pt.createModelValidator(" + stringify(def.validatorTemplate) + ");\n" +
				"var " + variableName + " = $pt.createModel(" + stringify(template) + ", " + def.validatorVariable + ");\n";
		} else {
			return "var " + variableName + " = $pt.createModel(" + stringify(template) + ");\n";
		}
	};

	$demo.convertCellLayoutCreatorToString = function (def) {
		var variableName = def.variable;
		var cellKey = def.cellKey;
		var template = def.template;
		return "var " + variableName + " = $pt.createCellLayout('" + cellKey + "', " + stringify(template) + ");\n";
	};
	$demo.convertFormLayoutCreatorToString = function (def) {
		var variableName = def.variable;
		var template = def.template;
		return "var " + variableName + " = $pt.createFormLayout(" + stringify(template) + ");\n";
	};

	$demo.convertComponentCreatorToString = function (def) {
		var tagName = def.tag;
		var attrNames = Object.keys(def).filter(function (key) {
			return key != 'tag';
		});
		var attrs = attrNames.map(function (key) {
			return key + "={" + def[key] + "}";
		});
		return "<" + tagName + " " + (attrs.join(' ')) + " />";
	};

	$demo.convertJSON = function (def) {
		return 'var ' + def.variable + ' = ' + stringify(def.json) + ';\n';
	};

	$demo.convertCSSJSONToExample = function (def) {
		return {
			id: def.id,
			title: 'CSS',
			desc: 'Customized CSS.',
			code: "var layout = " + stringify({css: def.css}) + ";\n",
			index: def.index
		};
	};

	$demo.convertMockJSONToExample = function (def) {
		var code = null;
		var mocks = def.mock;
		if (Array.isArray(mocks)) {
			code = mocks.map(function (mock) {
				return "$pt.mock(" + stringify(mock) + ");\n";
			});
		} else {
			code = "$pt.mock(" + stringify(mocks) + ");\n";
		}
		return {
			id: def.id,
			title: 'Mock Data',
			desc: 'Mock data which used in examples.',
			code: code,
			index: def.index
		};
	};

	$demo.convertToExampleList = function (def) {
		var examples = Object.keys(def).map(function (key) {
			return def[key].call(this);
		});
		examples.sort(function (e1, e2) {
			return e1.index - e2.index;
		});
		return examples;
	};

	$demo.convertCodeTableCreatorToString = function (def) {
		var variableName = def.variable;
		var codetable = def.codetable;
		codetable.name(variableName);
		var renderer = codetable.getRenderer();
		if (renderer) {
			return "var " + variableName + " = $pt.createCodeTable(" + stringify(codetable.list()) + ", " + renderer + ");\n"
		}
		return "var " + variableName + " = $pt.createCodeTable(" + stringify(codetable.list()) + ");\n";
	};
}(this, $pt));
