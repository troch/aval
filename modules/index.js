import Validators from './validators';

function addValidator(name, fn) {
    if (Validators[name]) throw new Error(`Validator named "${name}" already exists`);
    Validators[name] = fn;
}

class Izit {
    constructor() {
        this.validators = [];

        Object.keys(Validators).forEach((name) => {
            let that = this;
            this[name] = function() {
                let args = Array.prototype.slice.call(arguments);
                // Curry function
                that.validators.push([name, Function.prototype.bind.apply(Validators[name], [null].concat(args))]);
                return that;
            };
        });
    }

    validate(val) {
        let errors = this.validators
            .reduce((errors, def) => {
                let validity = def[1](val);
                if (validity !== null) errors[def[0]] = !validity;
                return errors;
            }, {});

        return {valid: Object.keys(errors).every(name => errors[name] === false), errors};
    }
}

export default {
    addValidator,
    Validators,
    Izit() {
        return new Izit;
    }
};
