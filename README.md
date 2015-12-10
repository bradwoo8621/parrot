# Parrot
A model based web framework base on Bootstrap and ReactJS.  

Parrot is part of [NEST](https://github.com/bradwoo8621/nest), and separate repository from [NEST](https://github.com/bradwoo8621/nest) since 2015/10/25.

![](http://bradwoo8621.github.io/parrot/guide/img/nest-transparent.png)  
![](http://bradwoo8621.github.io/parrot/guide/img/parrot-transparent.png)

### Status
[![Build Status](https://travis-ci.org/bradwoo8621/parrot.svg?branch=master)](https://travis-ci.org/bradwoo8621/parrot)

# Development Guide
[Guide](http://bradwoo8621.github.io/parrot/guide/index.html)

# Release Log
See wiki for [Version History](https://github.com/bradwoo8621/parrot/wiki/Version-History)

# In Browser
`<script src="../target/parrot/module/nest-parrot.js"></script>`

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
require('jquery.browser');
require('jquery-deparam');
require('jquery-mousewheel')(jQuery);
require('bootstrap');
require('bootstrap-fileinput-npm');
global.moment = require('moment');
global.React = require('react');
global.jsface = require('jsface');
var parrot = require('../target/parrot/module/nest-parrot')(window, jQuery, jsface, moment, React, true);
```

# License
MIT
