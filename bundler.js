var fs = require('fs'),
	mkdirp = require('mkdirp'),
	browserify = require('browserify'),
	lessify = require('node-lessify'),
	vashify = require('vashify');

mkdirp.sync(__dirname + '/dist');

var b = browserify();
b.transform(lessify);
b.transform(vashify);

b.add('./src/main.js');
b.bundle().pipe(fs.createWriteStream(__dirname + '/dist/main.js'));
