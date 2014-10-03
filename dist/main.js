(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $ = window.$,
	template = require("/home/mchevett/code/one-hour-word-cloud/node_modules/vashify/.temp/0_main.vash.js");

$(function(){
	var $body = $('body');
	$body.append(template({}));



});



},{"/home/mchevett/code/one-hour-word-cloud/node_modules/vashify/.temp/0_main.vash.js":5}],2:[function(require,module,exports){

},{}],3:[function(require,module,exports){
(function (process){
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

// resolves . and .. elements in a path array with directory names there
// must be no slashes, empty elements, or device names (c:\) in the array
// (so also no leading and trailing slashes - it does not distinguish
// relative and absolute paths)
function normalizeArray(parts, allowAboveRoot) {
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = parts.length - 1; i >= 0; i--) {
    var last = parts[i];
    if (last === '.') {
      parts.splice(i, 1);
    } else if (last === '..') {
      parts.splice(i, 1);
      up++;
    } else if (up) {
      parts.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (allowAboveRoot) {
    for (; up--; up) {
      parts.unshift('..');
    }
  }

  return parts;
}

// Split a filename into [root, dir, basename, ext], unix version
// 'root' is just a slash, or nothing.
var splitPathRe =
    /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
var splitPath = function(filename) {
  return splitPathRe.exec(filename).slice(1);
};

// path.resolve([from ...], to)
// posix version
exports.resolve = function() {
  var resolvedPath = '',
      resolvedAbsolute = false;

  for (var i = arguments.length - 1; i >= -1 && !resolvedAbsolute; i--) {
    var path = (i >= 0) ? arguments[i] : process.cwd();

    // Skip empty and invalid entries
    if (typeof path !== 'string') {
      throw new TypeError('Arguments to path.resolve must be strings');
    } else if (!path) {
      continue;
    }

    resolvedPath = path + '/' + resolvedPath;
    resolvedAbsolute = path.charAt(0) === '/';
  }

  // At this point the path should be resolved to a full absolute path, but
  // handle relative paths to be safe (might happen when process.cwd() fails)

  // Normalize the path
  resolvedPath = normalizeArray(filter(resolvedPath.split('/'), function(p) {
    return !!p;
  }), !resolvedAbsolute).join('/');

  return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
};

// path.normalize(path)
// posix version
exports.normalize = function(path) {
  var isAbsolute = exports.isAbsolute(path),
      trailingSlash = substr(path, -1) === '/';

  // Normalize the path
  path = normalizeArray(filter(path.split('/'), function(p) {
    return !!p;
  }), !isAbsolute).join('/');

  if (!path && !isAbsolute) {
    path = '.';
  }
  if (path && trailingSlash) {
    path += '/';
  }

  return (isAbsolute ? '/' : '') + path;
};

// posix version
exports.isAbsolute = function(path) {
  return path.charAt(0) === '/';
};

// posix version
exports.join = function() {
  var paths = Array.prototype.slice.call(arguments, 0);
  return exports.normalize(filter(paths, function(p, index) {
    if (typeof p !== 'string') {
      throw new TypeError('Arguments to path.join must be strings');
    }
    return p;
  }).join('/'));
};


// path.relative(from, to)
// posix version
exports.relative = function(from, to) {
  from = exports.resolve(from).substr(1);
  to = exports.resolve(to).substr(1);

  function trim(arr) {
    var start = 0;
    for (; start < arr.length; start++) {
      if (arr[start] !== '') break;
    }

    var end = arr.length - 1;
    for (; end >= 0; end--) {
      if (arr[end] !== '') break;
    }

    if (start > end) return [];
    return arr.slice(start, end - start + 1);
  }

  var fromParts = trim(from.split('/'));
  var toParts = trim(to.split('/'));

  var length = Math.min(fromParts.length, toParts.length);
  var samePartsLength = length;
  for (var i = 0; i < length; i++) {
    if (fromParts[i] !== toParts[i]) {
      samePartsLength = i;
      break;
    }
  }

  var outputParts = [];
  for (var i = samePartsLength; i < fromParts.length; i++) {
    outputParts.push('..');
  }

  outputParts = outputParts.concat(toParts.slice(samePartsLength));

  return outputParts.join('/');
};

exports.sep = '/';
exports.delimiter = ':';

exports.dirname = function(path) {
  var result = splitPath(path),
      root = result[0],
      dir = result[1];

  if (!root && !dir) {
    // No dirname whatsoever
    return '.';
  }

  if (dir) {
    // It has a dirname, strip trailing slash
    dir = dir.substr(0, dir.length - 1);
  }

  return root + dir;
};


exports.basename = function(path, ext) {
  var f = splitPath(path)[2];
  // TODO: make this comparison case-insensitive on windows?
  if (ext && f.substr(-1 * ext.length) === ext) {
    f = f.substr(0, f.length - ext.length);
  }
  return f;
};


exports.extname = function(path) {
  return splitPath(path)[3];
};

function filter (xs, f) {
    if (xs.filter) return xs.filter(f);
    var res = [];
    for (var i = 0; i < xs.length; i++) {
        if (f(xs[i], i, xs)) res.push(xs[i]);
    }
    return res;
}

// String.prototype.substr - negative index don't work in IE8
var substr = 'ab'.substr(-1) === 'b'
    ? function (str, start, len) { return str.substr(start, len) }
    : function (str, start, len) {
        if (start < 0) start = str.length + start;
        return str.substr(start, len);
    }
;

}).call(this,require('_process'))
},{"_process":4}],4:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

process.nextTick = (function () {
    var canSetImmediate = typeof window !== 'undefined'
    && window.setImmediate;
    var canPost = typeof window !== 'undefined'
    && window.postMessage && window.addEventListener
    ;

    if (canSetImmediate) {
        return function (f) { return window.setImmediate(f) };
    }

    if (canPost) {
        var queue = [];
        window.addEventListener('message', function (ev) {
            var source = ev.source;
            if ((source === window || source === null) && ev.data === 'process-tick') {
                ev.stopPropagation();
                if (queue.length > 0) {
                    var fn = queue.shift();
                    fn();
                }
            }
        }, true);

        return function nextTick(fn) {
            queue.push(fn);
            window.postMessage('process-tick', '*');
        };
    }

    return function nextTick(fn) {
        setTimeout(fn, 0);
    };
})();

process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
}

// TODO(shtylman)
process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};

},{}],5:[function(require,module,exports){
var vash = require('/home/mchevett/code/one-hour-word-cloud/node_modules/vashify/node_modules/vash/build/vash-runtime-all.min.js');
module.exports = vash.link(function anonymous(model, html, __vopts, vash) {
    try {
        var __vbuffer = html.buffer;
        html.options = __vopts;
        model = model || {};
        html.vl = 1, html.vc = 0;
        __vbuffer.push('\n');
        html.vl = 2, html.vc = 0;
        __vbuffer.push('<form class="form-horizontal" role="form">');
        html.vl = 2, html.vc = 42;
        __vbuffer.push('\n');
        html.vl = 3, html.vc = 0;
        __vbuffer.push(' ');
        html.vl = 3, html.vc = 1;
        __vbuffer.push(' ');
        html.vl = 3, html.vc = 2;
        __vbuffer.push('<div class="form-group">');
        html.vl = 3, html.vc = 26;
        __vbuffer.push('\n');
        html.vl = 4, html.vc = 0;
        __vbuffer.push(' ');
        html.vl = 4, html.vc = 1;
        __vbuffer.push(' ');
        html.vl = 4, html.vc = 2;
        __vbuffer.push(' ');
        html.vl = 4, html.vc = 3;
        __vbuffer.push(' ');
        html.vl = 4, html.vc = 4;
        __vbuffer.push('<label for="inputEmail3" class="col-sm-2 control-label">');
        html.vl = 4, html.vc = 60;
        __vbuffer.push('Email');
        html.vl = 4, html.vc = 65;
        __vbuffer.push('</label>');
        html.vl = 4, html.vc = 73;
        __vbuffer.push('\n');
        html.vl = 5, html.vc = 0;
        __vbuffer.push(' ');
        html.vl = 5, html.vc = 1;
        __vbuffer.push(' ');
        html.vl = 5, html.vc = 2;
        __vbuffer.push(' ');
        html.vl = 5, html.vc = 3;
        __vbuffer.push(' ');
        html.vl = 5, html.vc = 4;
        __vbuffer.push('<div class="col-sm-10">');
        html.vl = 5, html.vc = 27;
        __vbuffer.push('\n');
        html.vl = 6, html.vc = 0;
        __vbuffer.push(' ');
        html.vl = 6, html.vc = 1;
        __vbuffer.push(' ');
        html.vl = 6, html.vc = 2;
        __vbuffer.push(' ');
        html.vl = 6, html.vc = 3;
        __vbuffer.push(' ');
        html.vl = 6, html.vc = 4;
        __vbuffer.push(' ');
        html.vl = 6, html.vc = 5;
        __vbuffer.push(' ');
        html.vl = 6, html.vc = 6;
        __vbuffer.push('<input type="email" class="form-control" id="inputEmail3" placeholder="Email">');
        html.vl = 6, html.vc = 84;
        __vbuffer.push('\n');
        html.vl = 7, html.vc = 0;
        __vbuffer.push(' ');
        html.vl = 7, html.vc = 1;
        __vbuffer.push(' ');
        html.vl = 7, html.vc = 2;
        __vbuffer.push(' ');
        html.vl = 7, html.vc = 3;
        __vbuffer.push(' ');
        html.vl = 7, html.vc = 4;
        __vbuffer.push('</div>');
        html.vl = 7, html.vc = 10;
        __vbuffer.push('\n');
        html.vl = 8, html.vc = 0;
        __vbuffer.push(' ');
        html.vl = 8, html.vc = 1;
        __vbuffer.push(' ');
        html.vl = 8, html.vc = 2;
        __vbuffer.push('</div>');
        html.vl = 8, html.vc = 8;
        __vbuffer.push('\n');
        html.vl = 9, html.vc = 0;
        __vbuffer.push(' ');
        html.vl = 9, html.vc = 1;
        __vbuffer.push(' ');
        html.vl = 9, html.vc = 2;
        __vbuffer.push('<div class="form-group">');
        html.vl = 9, html.vc = 26;
        __vbuffer.push('\n');
        html.vl = 10, html.vc = 0;
        __vbuffer.push(' ');
        html.vl = 10, html.vc = 1;
        __vbuffer.push(' ');
        html.vl = 10, html.vc = 2;
        __vbuffer.push(' ');
        html.vl = 10, html.vc = 3;
        __vbuffer.push(' ');
        html.vl = 10, html.vc = 4;
        __vbuffer.push('<label for="inputPassword3" class="col-sm-2 control-label">');
        html.vl = 10, html.vc = 63;
        __vbuffer.push('Password');
        html.vl = 10, html.vc = 71;
        __vbuffer.push('</label>');
        html.vl = 10, html.vc = 79;
        __vbuffer.push('\n');
        html.vl = 11, html.vc = 0;
        __vbuffer.push(' ');
        html.vl = 11, html.vc = 1;
        __vbuffer.push(' ');
        html.vl = 11, html.vc = 2;
        __vbuffer.push(' ');
        html.vl = 11, html.vc = 3;
        __vbuffer.push(' ');
        html.vl = 11, html.vc = 4;
        __vbuffer.push('<div class="col-sm-10">');
        html.vl = 11, html.vc = 27;
        __vbuffer.push('\n');
        html.vl = 12, html.vc = 0;
        __vbuffer.push(' ');
        html.vl = 12, html.vc = 1;
        __vbuffer.push(' ');
        html.vl = 12, html.vc = 2;
        __vbuffer.push(' ');
        html.vl = 12, html.vc = 3;
        __vbuffer.push(' ');
        html.vl = 12, html.vc = 4;
        __vbuffer.push(' ');
        html.vl = 12, html.vc = 5;
        __vbuffer.push(' ');
        html.vl = 12, html.vc = 6;
        __vbuffer.push('<input type="password" class="form-control" id="inputPassword3" placeholder="Password">');
        html.vl = 12, html.vc = 93;
        __vbuffer.push('\n');
        html.vl = 13, html.vc = 0;
        __vbuffer.push(' ');
        html.vl = 13, html.vc = 1;
        __vbuffer.push(' ');
        html.vl = 13, html.vc = 2;
        __vbuffer.push(' ');
        html.vl = 13, html.vc = 3;
        __vbuffer.push(' ');
        html.vl = 13, html.vc = 4;
        __vbuffer.push('</div>');
        html.vl = 13, html.vc = 10;
        __vbuffer.push('\n');
        html.vl = 14, html.vc = 0;
        __vbuffer.push(' ');
        html.vl = 14, html.vc = 1;
        __vbuffer.push(' ');
        html.vl = 14, html.vc = 2;
        __vbuffer.push('</div>');
        html.vl = 14, html.vc = 8;
        __vbuffer.push('\n');
        html.vl = 15, html.vc = 0;
        __vbuffer.push(' ');
        html.vl = 15, html.vc = 1;
        __vbuffer.push(' ');
        html.vl = 15, html.vc = 2;
        __vbuffer.push('<div class="form-group">');
        html.vl = 15, html.vc = 26;
        __vbuffer.push('\n');
        html.vl = 16, html.vc = 0;
        __vbuffer.push(' ');
        html.vl = 16, html.vc = 1;
        __vbuffer.push(' ');
        html.vl = 16, html.vc = 2;
        __vbuffer.push(' ');
        html.vl = 16, html.vc = 3;
        __vbuffer.push(' ');
        html.vl = 16, html.vc = 4;
        __vbuffer.push('<div class="col-sm-offset-2 col-sm-10">');
        html.vl = 16, html.vc = 43;
        __vbuffer.push('\n');
        html.vl = 17, html.vc = 0;
        __vbuffer.push(' ');
        html.vl = 17, html.vc = 1;
        __vbuffer.push(' ');
        html.vl = 17, html.vc = 2;
        __vbuffer.push(' ');
        html.vl = 17, html.vc = 3;
        __vbuffer.push(' ');
        html.vl = 17, html.vc = 4;
        __vbuffer.push(' ');
        html.vl = 17, html.vc = 5;
        __vbuffer.push(' ');
        html.vl = 17, html.vc = 6;
        __vbuffer.push('<button type="submit" class="btn btn-default">');
        html.vl = 17, html.vc = 52;
        __vbuffer.push('Sign');
        html.vl = 17, html.vc = 56;
        __vbuffer.push(' ');
        html.vl = 17, html.vc = 57;
        __vbuffer.push('in');
        html.vl = 17, html.vc = 59;
        __vbuffer.push('</button>');
        html.vl = 17, html.vc = 68;
        __vbuffer.push('\n');
        html.vl = 18, html.vc = 0;
        __vbuffer.push(' ');
        html.vl = 18, html.vc = 1;
        __vbuffer.push(' ');
        html.vl = 18, html.vc = 2;
        __vbuffer.push(' ');
        html.vl = 18, html.vc = 3;
        __vbuffer.push(' ');
        html.vl = 18, html.vc = 4;
        __vbuffer.push('</div>');
        html.vl = 18, html.vc = 10;
        __vbuffer.push('\n');
        html.vl = 19, html.vc = 0;
        __vbuffer.push(' ');
        html.vl = 19, html.vc = 1;
        __vbuffer.push(' ');
        html.vl = 19, html.vc = 2;
        __vbuffer.push('</div>');
        html.vl = 19, html.vc = 8;
        __vbuffer.push('\n');
        html.vl = 20, html.vc = 0;
        __vbuffer.push(' ');
        html.vl = 20, html.vc = 1;
        __vbuffer.push(' ');
        html.vl = 20, html.vc = 2;
        __vbuffer.push('<div class="form-group">');
        html.vl = 20, html.vc = 26;
        __vbuffer.push('\n');
        html.vl = 21, html.vc = 0;
        __vbuffer.push(' ');
        html.vl = 21, html.vc = 1;
        __vbuffer.push(' ');
        html.vl = 21, html.vc = 2;
        __vbuffer.push(' ');
        html.vl = 21, html.vc = 3;
        __vbuffer.push(' ');
        html.vl = 21, html.vc = 4;
        __vbuffer.push('<div class="col-sm-offset-2 col-sm-10">');
        html.vl = 21, html.vc = 43;
        __vbuffer.push('\n');
        html.vl = 22, html.vc = 0;
        __vbuffer.push(' ');
        html.vl = 22, html.vc = 1;
        __vbuffer.push(' ');
        html.vl = 22, html.vc = 2;
        __vbuffer.push(' ');
        html.vl = 22, html.vc = 3;
        __vbuffer.push(' ');
        html.vl = 22, html.vc = 4;
        __vbuffer.push(' ');
        html.vl = 22, html.vc = 5;
        __vbuffer.push(' ');
        html.vl = 22, html.vc = 6;
        __vbuffer.push('<div class="checkbox">');
        html.vl = 22, html.vc = 28;
        __vbuffer.push('\n');
        html.vl = 23, html.vc = 0;
        __vbuffer.push('\t');
        html.vl = 23, html.vc = 1;
        __vbuffer.push('\t');
        html.vl = 23, html.vc = 2;
        __vbuffer.push('<textarea class="form-control" rows="50">');
        html.vl = 23, html.vc = 43;
        __vbuffer.push('</textarea>');
        html.vl = 23, html.vc = 54;
        __vbuffer.push('\n');
        html.vl = 24, html.vc = 0;
        __vbuffer.push(' ');
        html.vl = 24, html.vc = 1;
        __vbuffer.push(' ');
        html.vl = 24, html.vc = 2;
        __vbuffer.push(' ');
        html.vl = 24, html.vc = 3;
        __vbuffer.push(' ');
        html.vl = 24, html.vc = 4;
        __vbuffer.push(' ');
        html.vl = 24, html.vc = 5;
        __vbuffer.push(' ');
        html.vl = 24, html.vc = 6;
        __vbuffer.push('</div>');
        html.vl = 24, html.vc = 12;
        __vbuffer.push('\n');
        html.vl = 25, html.vc = 0;
        __vbuffer.push(' ');
        html.vl = 25, html.vc = 1;
        __vbuffer.push(' ');
        html.vl = 25, html.vc = 2;
        __vbuffer.push(' ');
        html.vl = 25, html.vc = 3;
        __vbuffer.push(' ');
        html.vl = 25, html.vc = 4;
        __vbuffer.push('</div>');
        html.vl = 25, html.vc = 10;
        __vbuffer.push('\n');
        html.vl = 26, html.vc = 0;
        __vbuffer.push(' ');
        html.vl = 26, html.vc = 1;
        __vbuffer.push(' ');
        html.vl = 26, html.vc = 2;
        __vbuffer.push('</div>');
        html.vl = 26, html.vc = 8;
        __vbuffer.push('\n');
        html.vl = 27, html.vc = 0;
        __vbuffer.push('</form>');
        html.vl = 27, html.vc = 7;
        __vbuffer.push('\n');
        __vopts && __vopts.onRenderEnd && __vopts.onRenderEnd(null, html);
        return __vopts && __vopts.asContext ? html : html.toString();
    } catch (e) {
        html.reportError(e, html.vl, html.vc, '!LB!<form class="form-horizontal" role="form">!LB!  <div class="form-group">!LB!    <label for="inputEmail3" class="col-sm-2 control-label">Email</label>!LB!    <div class="col-sm-10">!LB!      <input type="email" class="form-control" id="inputEmail3" placeholder="Email">!LB!    </div>!LB!  </div>!LB!  <div class="form-group">!LB!    <label for="inputPassword3" class="col-sm-2 control-label">Password</label>!LB!    <div class="col-sm-10">!LB!      <input type="password" class="form-control" id="inputPassword3" placeholder="Password">!LB!    </div>!LB!  </div>!LB!  <div class="form-group">!LB!    <div class="col-sm-offset-2 col-sm-10">!LB!      <button type="submit" class="btn btn-default">Sign in</button>!LB!    </div>!LB!  </div>!LB!  <div class="form-group">!LB!    <div class="col-sm-offset-2 col-sm-10">!LB!      <div class="checkbox">!LB!\t\t<textarea class="form-control" rows="50"></textarea>!LB!      </div>!LB!    </div>!LB!  </div>!LB!</form>!LB!');
    }
}, {
    'simple': false,
    'modelName': 'model',
    'helpersName': 'html'
});
},{"/home/mchevett/code/one-hour-word-cloud/node_modules/vashify/node_modules/vash/build/vash-runtime-all.min.js":6}],6:[function(require,module,exports){
/**
 * Vash - JavaScript Template Parser, v0.7.12-1
 *
 * https://github.com/kirbysayshi/vash
 *
 * Copyright (c) 2013 Andrew Petersen
 * MIT License (LICENSE)
 */void 0,function(){function i(a,b){typeof b=="function"&&(b={onRenderEnd:b}),a&&a.onRenderEnd&&(b=b||{},b.onRenderEnd||(b.onRenderEnd=a.onRenderEnd),delete a.onRenderEnd),b||(b={});return b}vash=typeof vash=="undefined"?{}:vash,vash.compile||(typeof define=="function"&&define.amd?define(function(){return vash}):typeof module=="object"&&module.exports?module.exports=vash:window.vash=vash);var a=vash.helpers,b=function(a){this.buffer=new f,this.model=a,this.options=null,this.vl=0,this.vc=0};vash.helpers=a=b.prototype={constructor:b,config:{},tplcache:{}},a.toString=a.toHtmlString=function(){return this.buffer._vo.join("")};var c=/[&<>"'`]/g,d=function(a){return e[a]},e={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"};a.raw=function(a){var b=function(){return a};a=a!=null?a:"";return{toHtmlString:b,toString:b}},a.escape=function(a){var b=function(){return a};a=a!=null?a:"";if(typeof a.toHtmlString!="function"){a=a.toString().replace(c,d);return{toHtmlString:b,toString:b}}return a};var f=function(){this._vo=[]};f.prototype.mark=function(a){var b=new g(this,a);b.markedIndex=this._vo.length,this._vo.push(b.uid);return b},f.prototype.fromMark=function(a){var b=a.findInBuffer();if(b>-1){a.destroy();return this._vo.splice(b,this._vo.length)}return[]},f.prototype.spliceMark=function(a,b,c){var d=a.findInBuffer();if(d>-1){a.destroy(),arguments[0]=d;return this._vo.splice.apply(this._vo,arguments)}return[]},f.prototype.empty=function(){return this._vo.splice(0,this._vo.length)},f.prototype.push=function(a){return this._vo.push(a)},f.prototype.pushConcat=function(a){var b;Array.isArray(a)?b=a:arguments.length>1?b=Array.prototype.slice.call(arguments):b=[a];for(var c=0;c<b.length;c++)this._vo.push(b[c]);return this.__vo},f.prototype.indexOf=function(a){for(var b=0;b<this._vo.length;b++)if(a.test&&this._vo[b]&&this._vo[b].search(a)>-1||this._vo[b]==a)return b;return-1},f.prototype.lastIndexOf=function(a){var b=this._vo.length;while(--b>=0)if(a.test&&this._vo[b]&&this._vo[b].search(a)>-1||this._vo[b]==a)return b;return-1},f.prototype.splice=function(){return this._vo.splice.apply(this._vo,arguments)},f.prototype.index=function(a){return this._vo[a]},f.prototype.flush=function(){return this.empty().join("")},f.prototype.toString=f.prototype.toHtmlString=function(){return this._vo.join("")};var g=vash.Mark=function(a,b){this.uid="[VASHMARK-"+~~(Math.random()*1e7)+(b?":"+b:"")+"]",this.markedIndex=0,this.buffer=a,this.destroyed=!1},h=g.re=/\[VASHMARK\-\d{1,8}(?::[\s\S]+?)?]/g;g.uidLike=function(a){return(a||"").search(h)>-1},g.prototype.destroy=function(){var a=this.findInBuffer();a>-1&&(this.buffer.splice(a,1),this.markedIndex=-1),this.destroyed=!0},g.prototype.findInBuffer=function(){if(this.destroyed)return-1;if(this.markedIndex&&this.buffer.index(this.markedIndex)===this.uid)return this.markedIndex;var a=this.uid.replace(/(\[|\])/g,"\\$1"),b=new RegExp(a);return this.markedIndex=this.buffer.indexOf(b)},a.constructor.reportError=function(a,b,c,d,e){e=e||"!LB!";var f=d.split(e),g=b===0&&c===0?f.length-1:3,h=Math.max(0,b-g),i=Math.min(f.length,b+g),j=f.slice(h,i).map(function(a,c,d){var e=c+h+1;return(e===b?"  > ":"    ")+(e<10?" ":"")+e+" | "+a}).join("\n");a.vashlineno=b,a.vashcharno=c,a.message="Problem while rendering template at line "+b+", character "+c+".\nOriginal message: "+a.message+"."+"\nContext: \n\n"+j+"\n\n";throw a},a.reportError=function(){this.constructor.reportError.apply(this,arguments)},vash.link=function(c,d){var e,f;d.args||(d.args=[d.modelName,d.helpersName,"__vopts","vash"]);if(typeof c=="string"){e=c;try{f=d.args.slice(),f.push(c),c=Function.apply(null,f)}catch(g){a.reportError(g,0,0,e,/\n/)}}c.options={simple:d.simple,modelName:d.modelName,helpersName:d.helpersName};var h;d.asHelper?(c.options.args=d.args,c.options.asHelper=d.asHelper,h=function(){return c.apply(this,j.call(arguments))},a[d.asHelper]=h):h=function(a,e){if(d.simple){var f={buffer:[],escape:b.prototype.escape,raw:b.prototype.raw};return c(a,f,e,vash)}e=i(a,e);return c(a,e&&e.context||new b(a),e,vash)},h.toString=function(){return c.toString()},h._toString=function(){return Function.prototype.toString.call(h)},h.toClientString=function(){return"vash.link( "+c.toString()+", "+JSON.stringify(c.options)+" )"};return h};var j=Array.prototype.slice;vash.lookup=function(a,b){var c=vash.helpers.tplcache[a];if(!c)throw new Error("Could not find template: "+a);return b?c(b):c},vash.install=function(a,b){var c=vash.helpers.tplcache;if(typeof b=="string"){if(!vash.compile)throw new Error("vash.install(path, [string]) is not available in the standalone runtime.");b=vash.compile(b)}else if(typeof a=="object"){b=a,Object.keys(b).forEach(function(a){c[a]=b[a]});return c}return c[a]=b},vash.uninstall=function(a){var b=vash.helpers.tplcache,c=!1;if(typeof a=="string")return delete b[a];Object.keys(b).forEach(function(d){b[d]===a&&(c=delete b[d])});return c}}(),function(){var a=vash.helpers;a.trim=function(a){return a.replace(/^\s*|\s*$/g,"")},a.config.highlighter=null,a.highlight=function(b,c){var d=this.buffer.mark();c();var e=this.buffer.fromMark(d);this.buffer.push("<pre><code>"),a.config.highlighter?this.buffer.push(a.config.highlighter(b,e.join("")).value):this.buffer.push(e),this.buffer.push("</code></pre>")}}(),function(){function d(a){var b=vash.Mark.re,c=[],d="";a.forEach(function(a){b.exec(a)?(c.push(d,a),d=""):d+=a||""}),c.push(d);return c}if(typeof window=="undefined")var a=require("fs"),b=require("path");var c=vash.helpers;c.config.browser=!1,vash.loadFile=function(d,e,f){e=vQuery.extend({},vash.config,e||{});var g=c.config.browser,h;!g&&e.settings&&e.settings.views&&(d=b.normalize(d),d.indexOf(b.normalize(e.settings.views))===-1&&(d=b.join(e.settings.views,d)),b.extname(d)||(d+="."+(e.settings["view engine"]||"vash")));try{h=e.cache||g?c.tplcache[d]||(c.tplcache[d]=vash.compile(a.readFileSync(d,"utf8"))):vash.compile(a.readFileSync(d,"utf8")),f&&f(null,h)}catch(i){f&&f(i,null)}},vash.renderFile=function(a,b,c){vash.loadFile(a,b,function(a,d){var e=b.onRenderEnd;c(a,!a&&d(b,function(a,b){b.finishLayout(),e&&e(a,b)}))})},c._ensureLayoutProps=function(){this.appends=this.appends||{},this.prepends=this.prepends||{},this.blocks=this.blocks||{},this.blockMarks=this.blockMarks||{}},c.finishLayout=function(){this._ensureLayoutProps();var a=this,b,c,e,f,g,h,i,j;for(b in this.blockMarks)c=this.blockMarks[b],f=this.prepends[b],e=this.blocks[b],g=this.appends[b],h=c.pop(),i=this.buffer.mark(),f&&f.forEach(function(b){a.buffer.pushConcat(b)}),block=e.pop(),block&&this.buffer.pushConcat(block),g&&g.forEach(function(b){a.buffer.pushConcat(b)}),j=this.buffer.fromMark(i),j=d(j),j.unshift(h,0),this.buffer.spliceMark.apply(this.buffer,j);for(b in this.blockMarks)this.blockMarks[b].forEach(function(a){a.destroy()});delete this.blockMarks,delete this.prepends,delete this.blocks,delete this.appends;return this.toString()},c.extend=function(a,b){var c=this,d=this.buffer,e=this.model,f;this._ensureLayoutProps(),vash.loadFile(a,this.model,function(a,d){var e=c.buffer.mark();b(c.model);var f=c.buffer.fromMark(e);c.isExtending=!0,d(c.model,{context:c}),c.isExtending=!1}),this.model=e},c.include=function(a,b){var c=this,d=this.buffer,e=this.model;vash.loadFile(a,this.model,function(a,d){d(b||c.model,{context:c})}),this.model=e},c.block=function(a,b){this._ensureLayoutProps();var c=this,d=this.blockMarks[a]||(this.blockMarks[a]=[]),e=this.blocks[a]||(this.blocks[a]=[]),f,g;b&&(f=this.buffer.mark(),b(this.model),g=this.buffer.fromMark(f),g.length&&!this.isExtending&&e.push(g),g.length&&this.isExtending&&e.unshift(g)),d.push(this.buffer.mark("block-"+a))},c._handlePrependAppend=function(a,b,c){this._ensureLayoutProps();var d=this.buffer.mark(),e,f=this[a],g=f[b]||(f[b]=[]);c(this.model),e=this.buffer.fromMark(d),g.push(e)},c.append=function(a,b){this._handlePrependAppend("appends",a,b)},c.prepend=function(a,b){this._handlePrependAppend("prepends",a,b)}}()
},{"fs":2,"path":3}]},{},[1]);
