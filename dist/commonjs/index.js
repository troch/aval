'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _validators = require('./validators');

var _validators2 = _interopRequireDefault(_validators);

var _Izit = (function () {
    function _Izit() {
        var _this = this,
            _arguments = arguments;

        _classCallCheck(this, _Izit);

        this.validators = [];

        Object.keys(_validators2['default']).forEach(function (name) {
            _this[name] = function () {
                var args = Array.prototype.slice.call(_arguments);
                // Curry function
                _this.validators.push([name, Function.prototype.bind.apply(_validators2['default'][name], [null].concat(args))]);
                return _this;
            };
        });
    }

    _createClass(_Izit, [{
        key: 'validate',
        value: function validate(val) {
            var errors = this.validators.reduce(function (errors, def) {
                var validity = def[1](val);
                if (validity !== null) errors[def[0]] = !validity;
                return errors;
            }, {});

            return { valid: Object.keys(errors).every(function (name) {
                    return errors[name] === false;
                }), errors: errors };
        }
    }]);

    return _Izit;
})();

exports['default'] = { Validators: _validators2['default'], Izit: function Izit() {
        return new _Izit();
    } };
module.exports = exports['default'];