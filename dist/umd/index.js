(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'module', './validators'], factory);
    } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        factory(exports, module, require('./validators'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod, global.Validators);
        global.index = mod.exports;
    }
})(this, function (exports, module, _validators) {
    'use strict';

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var _Validators = _interopRequireDefault(_validators);

    var _Izit = (function () {
        function _Izit() {
            var _this = this,
                _arguments = arguments;

            _classCallCheck(this, _Izit);

            this.validators = [];

            Object.keys(_Validators['default']).forEach(function (name) {
                _this[name] = function () {
                    var args = Array.prototype.slice.call(_arguments);
                    // Curry function
                    _this.validators.push([name, Function.prototype.bind.apply(_Validators['default'][name], [null].concat(args))]);
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

    module.exports = { Validators: _Validators['default'], Izit: function Izit() {
            return new _Izit();
        } };
});