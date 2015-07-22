import Validators from './validators';

class Izit {
    constructor() {
        this.validators = [];

        Object.keys(Validators).forEach((name) => {
            this[name] = () => {
                let args = Array.prototype.slice.call(arguments);
                // Curry function
                this.validators.push([name, Function.prototype.bind.apply(Validators[name], [null].concat(args))]);
                return this;
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
    Validators,
    Izit() {
        return new Izit;
    }
};
