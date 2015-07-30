'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _validators = require('./validators');

var _validators2 = _interopRequireDefault(_validators);

function addValidator(name, fn) {
    if (_validators2['default'][name]) throw new Error('Validator named "' + name + '" already exists');
    _validators2['default'][name] = fn;
}

var Aval = (function () {
    function Aval() {
        var _this = this;

        _classCallCheck(this, Aval);

        this.validators = [];

        Object.keys(_validators2['default']).forEach(function (name) {
            var that = _this;
            _this[name] = function () {
                var args = Array.prototype.slice.call(arguments);
                // Curry function
                that.validators.push([name, Function.prototype.bind.apply(_validators2['default'][name], [null].concat(args))]);
                return that;
            };
        });
    }

    _createClass(Aval, [{
        key: 'validate',
        value: function validate(val) {
            var nonPropValidators = this.validators.filter(function (validator) {
                return !/^(prop|every)$/.test(validator[0]);
            });
            var errors = nonPropValidators.length ? nonPropValidators.reduce(function (errors, def) {
                var validity = def[1](val);
                if (validity !== null) errors[def[0]] = !validity;
                return errors;
            }, {}) : {};

            var elmValidators = this.validators.filter(function (v) {
                return v[0] === 'every';
            });
            var elements = null;
            if (elmValidators.length) {
                var res = elmValidators[0][1](val);
                if (res !== null) {
                    errors.every = !res[0];
                    elements = res[1];
                } else elements = [];
            }

            var propValidators = this.validators.filter(function (v) {
                return v[0] === 'prop';
            });
            var props = propValidators.length ? propValidators.reduce(function (props, def) {
                var _def$1 = def[1](val);

                var _def$12 = _slicedToArray(_def$1, 2);

                var name = _def$12[0];
                var report = _def$12[1];

                props[name] = report;
                return props;
            }, {}) : {};

            var valid = Object.keys(errors).every(function (name) {
                return errors[name] === false;
            }) && Object.keys(props).every(function (name) {
                return props[name].valid === true;
            });

            var report = { valid: valid };
            if (nonPropValidators.length) report.errors = errors;
            if (propValidators.length) report.props = props;
            if (elements !== null) report.elements = elements;
            return report;
        }
    }]);

    return Aval;
})();

var AvalFactory = function AvalFactory() {
    return new Aval();
};
AvalFactory.addValidator = addValidator;
AvalFactory.Validators = _validators2['default'];

exports['default'] = AvalFactory;
module.exports = exports['default'];