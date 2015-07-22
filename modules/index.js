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
        let nonPropValidators = this.validators.filter(validator => validator[0] !== 'prop');
        let errors =
            nonPropValidators.length
                ? nonPropValidators.reduce((errors, def) => {
                        let validity = def[1](val);
                        if (validity !== null) errors[def[0]] = !validity;
                        return errors;
                    }, {})
                : {};

        let propValidators = this.validators.filter(v => v[0] === 'prop');
        let props =
            propValidators.length
                ? propValidators.reduce((props, def) => {
                        let [name, report] = def[1](val);
                        props[name] = report;
                        return props;
                    }, {})
                : {};

        let valid = Object.keys(errors).every(name => errors[name] === false) &&
            Object.keys(props).every(name => props[name].valid === true);

        let report = {valid};
        if (nonPropValidators.length) report.errors = errors;
        if (propValidators.length)    report.props  = props;
        return report;
    }
}

export default {
    addValidator,
    Validators,
    Izit() {
        return new Izit;
    }
};
