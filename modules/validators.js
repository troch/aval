function exists(val) {
    return val !== undefined && val !== null
}

function createTypeValidator(type) {
    return function typeChecker(val) {
        if (!exists(val))      return true
        if (type === 'date')   return val instanceof Date
        if (type === 'array')  return Array.isArray(val)
        if (type === 'object') return !Array.isArray(val) && type === 'object'
        return typeof val === type
    }
}

function required(val) {
    return exists(val) && val !== ''
}

function gt(limit, val) {
    if (!exists(val)) return null
    return val > limit
}

function gte(limit, val) {
    if (!exists(val)) return null
    return val >= limit
}

function lt(limit, val) {
    if (!exists(val)) return null
    return val < limit
}

function lte(limit, val) {
    if (!exists(val)) return null
    return val <= limit
}

function max(max, val) {
    if (!exists(val)) return null
    return val.length !== undefined ? val.length <= max : null
}

function min(min, val) {
    if (!exists(val)) return null
    return val.length !== undefined ? val.length >= min : null
}

function pattern(pattern, val) {
    return pattern.test(val)
}

var Validators = {required, gt, gte, lt, lte, max, min, pattern};

['string', 'number', 'string', 'boolean', 'array', 'object', 'date']
    .forEach((type) => Validators[type] = createTypeValidator(type))

export default Validators
