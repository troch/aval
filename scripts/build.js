var babel       = require('babel');
var path        = require('path');
var fs          = require('fs');
var async       = require('async');

var izitVersion = require('../package.json').version;

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

function buildBundle(done) {
    function transform(fileToTransform) {
        return function (done) {
            babel.transformFile(fileToTransform, {modules: 'ignore'}, done)
        }
    }

    async.parallel([
        fs.readFile.bind(fs, path.join(__dirname, '../LICENSE')),
        transform(files[0]),
        transform(files[1])
    ], function (err, results) {
        if (err) console.log(err);
        // License
        var license = results[0].toString().trim().split('\n').map(function (line) {
            return ' * ' + line;
        }).join('\n');
        license = '/**\n * @license\n * @version ' + izitVersion + '\n' + license + '\n */';

        var indexSrc = results[1].code.trim();
        var validatorsSrc = results[2].code.trim();

        var bundledCode = (validatorsSrc + indexSrc).replace(/("|')use strict("|');\n/g, '');

        bundledCode = bundledCode.split('\n').map(function (line) {
            return '    ' + line;
        }).join('\n');

        var globalHeader = '\n(function (window) {\n';
        var globalFooter = '\n}(window));\n';
        var globalExport = '\n\n    window.Izit = IzitFactory;\n';

        var amdHeader = "\ndefine('izit', [], function () {\n";
        var amdFooter = '\n});\n';
        var amdExport = '\n\n    return {Izit: IzitFactory};';

        var useStrict = "'use strict';\n";

        var globalCode = license + globalHeader + bundledCode + globalExport + globalFooter;
        var amdCode = license + amdHeader + bundledCode + amdExport + amdFooter;

        async.parallel([
            fs.writeFile.bind(fs, path.join(__dirname, '../dist/browser/izit.js'), globalCode),
            fs.writeFile.bind(fs, path.join(__dirname, '../dist/amd/izit.js'), amdCode)
        ], done)
    })
}

async.parallel([
    buildFactory('common', 'dist/commonjs/index.js',      files[0]),
    buildFactory('common', 'dist/commonjs/validators.js', files[1]),
    buildBundle
], function (err) {
    if (err) console.log(err);
    process.exit(err ? 1 : 0);
})
