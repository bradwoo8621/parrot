# Parrot
A model based web framework base on Bootstrap and ReactJS.  

Parrot is a sub module of NEST.

![](http://bradwoo8621.github.io/parrot/guide/img/nest.png)  
![](http://bradwoo8621.github.io/parrot/guide/img/parrot.png)

### Status
[![Build Status](https://travis-ci.org/bradwoo8621/parrot.svg?branch=master)](https://travis-ci.org/bradwoo8621/parrot) [![Codacy Badge](https://api.codacy.com/project/badge/grade/2c3fa38232a947079918f76282330bd6)](https://www.codacy.com/app/bradwoo8621/parrot)

### Slack
[nest-parrot.slack.com](https://slack.global.ssl.fastly.net/66f9/img/icons/ios-32.png)

# Development Guide
[Guide](http://bradwoo8621.github.io/parrot/guide/index.html)

# Release Log
See wiki for [Version History](https://github.com/bradwoo8621/parrot/wiki/Version-History)  
The new version of Parrot is released, see [Nest Parrot2](https://github.com/bradwoo8621/parrot2)

# In Browser
```html
<link rel="stylesheet" href="path/to/bootswatch.paper.css">
<link rel="stylesheet" href="path/to/font-awesome.min.css">
<link rel="stylesheet" href="path/to/fileinput.min.css">
<link rel="stylesheet" href="path/to/nest-parrot.css">

<script src="path/to/jquery.min.js"></script>
<script src="path/to/jquery.mousewheel.min.js"></script>
<script src="path/to/jquery-deparam.min.js"></script>
<script src="path/to/bootstrap.min.js"></script>
<script src="path/to/ie10-viewport-bug-workaround.js"></script>
<script src="path/to/moment-with-locales.min.js"></script>
<script src="path/to/react-with-addons.min.js"></script>
<script src="path/to/react-dom.min.js"></script>
<script src="path/to/jsface.min.js"></script>
<script src="path/to/jsface.pointcut.min.js"></script>
<script src="path/to/fileinput.min.js"></script>
<script src="path/to/nest-parrot.js"></script>
```

# In NodeJS
```javascript
var jsdom = require('jsdom').jsdom;
global.document = jsdom('<html></html>', {});
global.window = document.defaultView;
propagateToGlobal(window);

function propagateToGlobal (window) {
	for (let key in window) {
		if (!window.hasOwnProperty(key))
			continue;
		if (key in global)
			continue;

		global[key] = window[key];
	}
}

global.jQuery = global.$ = require('jquery');
require('jquery-deparam');
require('jquery-mousewheel')(jQuery);
require('bootstrap');
require('bootstrap-fileinput-npm');
global.moment = require('moment');
global.React = require('react');
global.ReactDOM = require('react-dom');
global.jsface = require('jsface');
var parrot = require('../target/parrot/module/nest-parrot')(window, jQuery, jsface, moment, React, ReactDOM, true);
```

# License
MIT

# Seeking for Cooperator
If you are interested in this project, contact me via bradwoo8621@gmail.com.
