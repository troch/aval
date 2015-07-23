var Izit = require('./dist/commonjs').Izit
var addValidator = require('./dist/commonjs').addValidator

addValidator('even', function (val) {
    // if (val === null || val === undefined) return null;
    return val % 2 === 0;
});

var data = [2, 4, 6, 8];

var elmValidator = Izit().number().even();
var validator = Izit().array().required().min(2).every(elmValidator);

console.log(validator.validate(data).elements);
// console.log(elmValidator.validate(3));
