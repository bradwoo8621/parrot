var jQuery = require('jquery');
var React = require('react');
var moment = require('moment');
var jsface = require('jsface');
var browser = require('jquery.browser');
var deparam = require('jquery-deparam');
var wheel = require('jquery-mousewheel');
var fileInput = require('bootstrap-fileinput');

var oldPT = window.$pt;

var $pt = {};
window.$pt = $pt;
