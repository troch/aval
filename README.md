[![npm version](https://badge.fury.io/js/izit.svg)](http://badge.fury.io/js/izit)
[![Build Status](https://travis-ci.org/troch/izit.svg?branch=master)](https://travis-ci.org/troch/izit)
[![Coverage Status](https://coveralls.io/repos/troch/izit/badge.svg?branch=master&service=github)](https://coveralls.io/github/troch/izit?branch=master)

# Izit

> A minimalist functional validation library. Inspired by joi, React PropTypes and Angular form validation.

Izit is an ultra lightweight library to help validate JS data.

## Why?

There are a LOT of JavaScript data validators, however not a lot of them are pure validators.
Izit:

- has a nice compact syntax
- validates data and outputs a detailled validation report containing only boolean values
- doesn't throw errors or output localised validation messages
- allows to define custom validators

## Installation

It is available on npm:

    $ npm install --save izit

## Usage

Get a new instance of `Izit` and chain validators. Calling `validate(val)`
will output an object containing a `valid` boolean and a key-value pairs object `errors`.

```javascript
import {Izit} from 'izit';

let validator = Izit().string().required().min(3);

validator.validate(null)
// = {
//     valid: false,
//     errors: {
//       string:   false,
//       required: false
//     }
//   }
//

validator.validate('hi');
// = {
//     valid: false,
//     errors: {
//       string:   false,
//       required: false,
//       min:      true
//     }
//   }
//

validator.validate('hello');
// = {
//     valid: true,
//     errors: {
//       string:   false,
//       required: false,
//       min:      false
//     }
//   }
//
```

## Validators

- For all type validators, `null` or `undefined` values won't fail. `required()` will fail them if present.
- For all other validators, a non-existing value will cause the validator to return `null`, excluding it
from the errors report.

### Types

- `string()`
- `number()`
- `boolean()`
- `object()`
- `array()`
- `date()`

### Range assertions (numbers and dates)

- `lt(max)`: lower than
- `lte(max)`: lower than or equal
- `gt(min)`: greater than
- `gte(min)`: greather than or equal

### Discrete range assertions (any)

- `inList(arr)`: in list of values
- `notInList(arr)`: not in list of values

### Length assertions (strings, arrays and objects)

- `min(min)`: minimum length (_strings_ or _arrays_)
- `max(max)`: maximum length (_strings_ or _arrays_)
- `minKeys(min)`: minimum number of keys (_objects_)
- `maxKeys(max)`: maximum number of keys (_objects_)

### Other

- `required()`: required value (null, undefined, empty array, empty object, empty string will all fail)
- `pattern(regex)`: pattern matching
