/**
 * @license
 * @version 0.1.0-alpha.1
 * The MIT License (MIT)
 * 
 * Copyright (c) 2015 Thomas Roch
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
define('izit', [], function () {
    
    function exists(val) {
        return val !== undefined && val !== null;
    }
    
    function createTypeValidator(type) {
        return function typeChecker(val) {
            if (!exists(val)) return true;
            if (type === 'date') return val instanceof Date;
            if (type === 'set') return val instanceof Set;
            if (type === 'array') return Array.isArray(val);
            if (type === 'object') {
                return !Array.isArray(val) && typeof val === 'object' && !(val instanceof Set);
            }
            return typeof val === type;
        };
    }
    
    function required(val) {
        if (!exists(val) || val.length === 0) return false;
        if (typeof val === 'object') return Object.keys(val).length !== 0;
        return true;
    }
    
    function gt(limit, val) {
        if (!exists(val)) return null;
        return val > limit;
    }
    
    function gte(limit, val) {
        if (!exists(val)) return null;
        return val >= limit;
    }
    
    function lt(limit, val) {
        if (!exists(val)) return null;
        return val < limit;
    }
    
    function lte(limit, val) {
        if (!exists(val)) return null;
        return val <= limit;
    }
    
    function max(max, val) {
        if (!exists(val)) return null;
        return val.length <= max;
    }
    
    function min(min, val) {
        if (!exists(val)) return null;
        return val.length >= min;
    }
    
    function maxKeys(max, val) {
        if (!exists(val)) return null;
        if (typeof val !== 'object') return false;
        return Object.keys(val).length <= max;
    }
    
    function minKeys(min, val) {
        if (!exists(val)) return null;
        if (typeof val !== 'object') return false;
        return Object.keys(val).length >= min;
    }
    
    function pattern(pattern, val) {
        return pattern.test(val);
    }
    
    function inList(arr, val) {
        if (!exists(val)) return null;
        if (arr instanceof Set) return arr.has(val);
        return arr.indexOf(val) !== -1;
    }
    
    function notInList(arr, val) {
        if (!exists(val)) return null;
        if (arr instanceof Set) return !arr.has(val);
        return arr.indexOf(val) === -1;
    }
    
    function withElm(elm, val) {
        if (!exists(val)) return null;
        if (val instanceof Set) return val.has(elm);
        return val.indexOf(elm) !== -1;
    }
    
    function withoutElm(elm, val) {
        if (!exists(val)) return null;
        if (val instanceof Set) return !val.has(elm);
        return val.indexOf(elm) === -1;
    }
    
    function exactly(match, val) {
        if (!exists(val)) return null;
        return match === val;
    }
    
    function prop(name, validator, val) {
        var propVal = exists(val) ? val[name] : null;
        return [name, validator.validate(propVal)];
    }
    
    function every(validator, val) {
        if (!exists(val) || !val.length) return null;
        var elements = val.map(function (elm) {
            return validator.validate(elm);
        });
        return [elements.every(function (r) {
            return r.valid;
        }), elements];
    }
    
    var Validators = { required: required, gt: gt, gte: gte, lt: lt, lte: lte, max: max, min: min, maxKeys: maxKeys, minKeys: minKeys, pattern: pattern, inList: inList, notInList: notInList,
        withElm: withElm, withoutElm: withoutElm, exactly: exactly, prop: prop, every: every };
    
    var types = ['string', 'number', 'boolean', 'array', 'object', 'date', 'set'];
    
    types.forEach(function (type) {
        return Validators[type] = createTypeValidator(type);
    });
    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();
    
    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();
    
    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }
    
    function addValidator(name, fn) {
        if (Validators[name]) throw new Error('Validator named "' + name + '" already exists');
        Validators[name] = fn;
    }
    
    var Izit = (function () {
        function Izit() {
            var _this = this;
    
            _classCallCheck(this, Izit);
    
            this.validators = [];
    
            Object.keys(Validators).forEach(function (name) {
                var that = _this;
                _this[name] = function () {
                    var args = Array.prototype.slice.call(arguments);
                    // Curry function
                    that.validators.push([name, Function.prototype.bind.apply(Validators[name], [null].concat(args))]);
                    return that;
                };
            });
        }
    
        _createClass(Izit, [{
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
    
        return Izit;
    })();
    
    var IzitFactory = function IzitFactory() {
        return new Izit();
    };
    IzitFactory.addValidator = addValidator;
    IzitFactory.Validators = Validators;

    return {Izit: IzitFactory};
});
