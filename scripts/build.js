var babel       = require('babel');
var path        = require('path');
var fs          = require('fs');
var async       = require('async');

var files       = [
    path.join(__dirname, '../modules/index.js'),
    path.join(__dirname, '../modules/validators.js')
];

function buildFactory(module, dest, file) {
    return function (done) {
        babel.transformFile(file, {modules: module}, function (err, result) {
            if (!err) fs.writeFile(path.join(__dirname, '..', dest), result.code, done);
            else done(err);
        });
    };
}

async.parallel([
    buildFactory('common', 'dist/commonjs/index.js',      files[0]),
    buildFactory('common', 'dist/commonjs/validators.js', files[1]),
    buildFactory('umd',    'dist/umd/index.js',           files[0]),
    buildFactory('umd',    'dist/umd/validators.js',      files[1])
], function (err) {
    if (err) console.log(err);
    process.exit(err ? 1 : 0);
})
