var Aval = require('./dist/commonjs');
var addValidator = Aval.addValidator;

addValidator('even', function (val) {
    // if (val === null || val === undefined) return null;
    return val % 2 === 0;
});

var data = [2, 4, 6, 7];

var elmValidator = Aval().number().even();
var validator = Aval().array().required().min(2).every(elmValidator);

console.log(validator.validate(data));
// console.log(elmValidator.validate(3));
