[![npm version](https://badge.fury.io/js/aval.svg)](http://badge.fury.io/js/aval)
[![Build Status](https://travis-ci.org/troch/aval.svg?branch=master)](https://travis-ci.org/troch/aval)
[![Coverage Status](https://coveralls.io/repos/troch/aval/badge.svg?branch=master&service=github)](https://coveralls.io/github/troch/aval?branch=master)

# Aval

> A minimalist functional validation library. Inspired by joi, React PropTypes and Angular form validation.

Aval is a lightweight library to help validate JS data and is aimed at helping form validation feedback.

## Why?

There are a LOT of JavaScript data validators, however here are a few facts about Aval:

- has a nice compact syntax
- validates data and outputs a detailled validation report containing only boolean values
- doesn't throw errors or output localised validation messages
- allows to define custom validators
- can validate nested properties

## Installation

It is available on npm and bower:

    $ npm install --save aval
    $ bower install --save aval

It is available in commonJs format, AMD and global (bundled and uglified).

## Usage

Get a new instance of `Aval` and chain validators. Calling `validate(val)`
will output an object containing a `valid` boolean and a key-value pairs object `errors`.

```javascript
import Aval from 'aval';

let validator = Aval().string().required().min(3);

let report = validator.validate(null);
// Will output
report = {
    valid: false,
    errors: {
        string:   false,
        required: false
    }
}


let report = validator.validate('hi')
// Will output
report = {
    valid: false,
    errors: {
        string:   false,
        required: false,
        min:      true
    }
}


report = validator.validate('hello')
// Will output
report = {
    valid: true,
    errors: {
        string:   false,
        required: false,
        min:      false
    }
}

```

## Validators

- For all type validators, `null` or `undefined` values won't fail. `required()` will fail them if present.
- For all other validators, a non-existing value will cause the validator to return `null`, excluding it
from the errors report.

- __Types__
    - `string()`
    - `number()`
    - `boolean()`
    - `object()`
    - `array()`
    - `date()`
    - `set()`
- __Range assertions (numbers and dates)__
    - `lt(max)`: lower than
    - `lte(max)`: lower than or equal
    - `gt(min)`: greater than
    - `gte(min)`: greater than or equal
- __Discrete range assertions (any)__
    - `inList(arr)`: in array or Set
    - `notInList(arr)`: not in array or Set
- __Values__
    - `required()`: required value (null, undefined, empty array, empty object, empty string will all fail)
    - `pattern(regex)`: pattern matching
    - `exactly(val)`: reference equality (any)
    - `withElm(elm)`: includes an element (array or Set)
    - `withoutElm(elm)`: excludes an element (array or Set)
- __Length assertions (strings, arrays and objects)__
    - `min(min)`: minimum length (_strings_ or _arrays_)
    - `max(max)`: maximum length (_strings_ or _arrays_)
    - `minKeys(min)`: minimum number of keys (_objects_)
    - `maxKeys(max)`: maximum number of keys (_objects_)
- __Nested__
    - `prop(name, validator)`: property validation
    - `every(validator)`: all elements validation (collection: array or Set)


## Custom validator

You can define custom validators. A validator can take a number of arguments, all non-optional, the last being the value
to validate.

```javascript
import Aval, {addValidator} from 'aval'

addValidator('matchPwd', function (val) {
    if (!val) return null;
    return val.password === val.password2;
});

let data = {
    username: 'troch',
    email: null,
    password:  'm4g1cPWD'
    password2: 'm4g1cPWd'
};

let validator = Aval().object().required().matchPwd();

let report = validator.validate(data)
// Will output
report = {
    valid: false,
    errors: {
        object:   false,
        required: false,
        matchPwd: true
    }
}
```

## Nested properties

You can validate nested properties (as deep as you want).

```javascript
import Aval from 'aval'

let data = {
    username: 'troch',
    email: null,
    password:  'm4g1cPWD'
    password2: 'm4g1cPWd'
}

let validator = Aval().object().required().matchPwd()
    .prop('username', Aval().string().required().min(4))
    .prop('email',    Aval().string().required().pattern(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/))
    .prop('password', Aval().string().required().min(5));

let report = validator.validate(data)
// Will output
report = {
    valid: false,
    errors: {
        object:   false,
        required: false,
        matchPwd: true
    },
    props: {
        username: {
            valid: true,
            errors: {
                string:   false,
                required: false,
                min:      false
            }
        },
        email: {
            valid: false,
            errors: {
                string:   false,
                required: true
            }
        },
        password: {
            valid: true,
            errors: {
                string:   false,
                required: false,
                min:      false
            }
        }
    }
}
```

## Collections

You can apply the `every`\ validator on all elements of an array, allowing you to easily validate collections.
Only one `every` validator per property is allowed.

```javascript
import Aval, {addValidator} from 'aval'

// Let's create a custom validator for even numbers
addValidator('even', val => {
    // if (val === null || val === undefined) return null;
    return val % 2 === 0;
})

// Let's validate this array
let evenNumbers = [2, 4, 6, 7]

// Validator (minimum 2 numbers, all even)
let validator = Aval()
    .array().required().min(2)
    .every(Aval().number().even())

let report = validator.validate(evenNumbers)
// Will output
report = {
    valid: false,
    errors: {
        array:    false,
        required: false,
        min:      false,
        every:    true
    },
    elements: [
        {
            valid: true,
            errors: {number: false, even: false}
        },
        {
            valid: true,
            errors: {number: false, even: false}
        },
        {
            valid: true,
            errors: {number: false, even: false}
        },
        {
            valid: false,
            errors: {number: false, even: true}
        }
    ]
}
```
