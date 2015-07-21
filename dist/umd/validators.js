(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'module'], factory);
    } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
        factory(exports, module);
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, mod);
        global.validators = mod.exports;
    }
})(this, function (exports, module) {
    'use strict';

    function exists(val) {
        return val !== undefined && val !== null;
    }

    function createTypeValidator(type) {
        return function typeChecker(val) {
            if (!exists(val)) return true;
            if (type === 'date') return val instanceof Date;
            if (type === 'array') return Array.isArray(val);
            if (type === 'object') return !Array.isArray(val) && type === 'object';
            return typeof val === type;
        };
    }

    function required(val) {
        return exists(val) && val !== '';
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
        return val.length !== undefined ? val.length <= max : null;
    }

    function min(min, val) {
        if (!exists(val)) return null;
        return val.length !== undefined ? val.length >= min : null;
    }

    function pattern(pattern, val) {
        return pattern.test(val);
    }

    var Validators = { required: required, gt: gt, gte: gte, lt: lt, lte: lte, max: max, min: min, pattern: pattern };

    ['string', 'number', 'string', 'boolean', 'array', 'object', 'date'].forEach(function (type) {
        return Validators[type] = createTypeValidator(type);
    });

    module.exports = Validators;
});