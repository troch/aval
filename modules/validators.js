function exists(val) {
    return val !== undefined && val !== null;
}

function createTypeValidator(type) {
    return function typeChecker(val) {
        if (!exists(val))      return true;
        if (type === 'date')   return val instanceof Date;
        if (type === 'array')  return Array.isArray(val);
        if (type === 'object') return !Array.isArray(val) && type === 'object';
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

let Validators = {required, gt, gte, lt, lte, max, min, maxKeys, minKeys, pattern};

let types =  ['string', 'number', 'boolean', 'array', 'object', 'date'];

types.forEach((type) => Validators[type] = createTypeValidator(type));

export default Validators;
