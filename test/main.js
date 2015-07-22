'use strict';

var path      = require('path');
var pkg       = require('../package.json');
var Iz        = require(path.join(__dirname, '..', pkg.main));
var should    = require('should');

var Izit = Iz.Izit
var Validators = Iz.Validators
var addValidator = Iz.addValidator

require('mocha');

var set = new Set;
set.add(1);
set.add(2);
set.add(3);

describe('Validators', function () {
    it('should validate strings', function () {
        Validators.string(null).should.equal(true);
        Validators.string(undefined).should.equal(true);
        Validators.string('').should.equal(true);
        Validators.string('abc').should.equal(true);
        Validators.string(123).should.equal(false);
        Validators.string({}).should.equal(false);
        Validators.string([]).should.equal(false);
    });

    it('should validate numbers', function () {
        Validators.number(null).should.equal(true);
        Validators.number(undefined).should.equal(true);
        Validators.number(1).should.equal(true);
        Validators.number(-1.1).should.equal(true);
        Validators.number('abc').should.equal(false);
        Validators.number({}).should.equal(false);
        Validators.number([]).should.equal(false);
    });

    it('should validate number ranges', function () {
        should.not.exist(Validators.gt(3, null));
        should.not.exist(Validators.gte(3, null));
        should.not.exist(Validators.lt(3, null));
        should.not.exist(Validators.lte(3, null));

        Validators.gt(3, 3).should.equal(false);
        Validators.gt(3, 4).should.equal(true);
        Validators.gte(3, 2).should.equal(false);
        Validators.gte(3, 3).should.equal(true);

        Validators.lt(3, 3).should.equal(false);
        Validators.lt(3, 2).should.equal(true);
        Validators.lte(3, 4).should.equal(false);
        Validators.lte(3, 3).should.equal(true);
    });

    it('should validate date ranges', function () {
        Validators.gt(new Date('2012/12/12'), new Date('2012/12/13')).should.equal(true);
        Validators.gt(new Date('2012/12/12'), new Date('2012/12/11')).should.equal(false);
    });

    it('should validate booleans', function () {
        Validators.boolean(null).should.equal(true);
        Validators.boolean(undefined).should.equal(true);
        Validators.boolean(true).should.equal(true);
        Validators.boolean(false).should.equal(true);
        Validators.boolean('abc').should.equal(false);
        Validators.boolean({}).should.equal(false);
        Validators.boolean([]).should.equal(false);
    });

    it('should validate objects', function () {
        Validators.object(null).should.equal(true);
        Validators.object(undefined).should.equal(true);
        Validators.object({}).should.equal(true);
        Validators.object([]).should.equal(false);
    });

    it('should validate arrays', function () {
        Validators.array(null).should.equal(true);
        Validators.array(undefined).should.equal(true);
        Validators.array([]).should.equal(true);
        Validators.array({}).should.equal(false);
    });

    it('should validate sets', function () {
        Validators.set(null).should.equal(true);
        Validators.set(undefined).should.equal(true);
        Validators.set(new Set()).should.equal(true);
        Validators.set({}).should.equal(false);
    });

    it('should validate array ranges', function () {
        should.not.exist(Validators.inList([1, 2, 3]));
        should.not.exist(Validators.notInList([1, 2, 3]));

        Validators.inList([1, 2, 3], 3).should.equal(true);
        Validators.inList([1, 2, 3], 4).should.equal(false);

        Validators.inList(set, 3).should.equal(true);
        Validators.inList(set, 4).should.equal(false);

        Validators.notInList([1, 2, 3], 3).should.equal(false);
        Validators.notInList([1, 2, 3], 4).should.equal(true);

        Validators.notInList(set, 3).should.equal(false);
        Validators.notInList(set, 4).should.equal(true);
    });

    it('should validate dates', function () {
        Validators.date(null).should.equal(true);
        Validators.date(undefined).should.equal(true);
        Validators.date(new Date()).should.equal(true);
        Validators.date('2012/12/12').should.equal(false);
    });

    it('should validate required values', function () {
        Validators.required(null).should.equal(false);
        Validators.required(undefined).should.equal(false);
        Validators.required('').should.equal(false);
        Validators.required('abc').should.equal(true);
        Validators.required(0).should.equal(true);
        Validators.required(false).should.equal(true);
        Validators.required({}).should.equal(false);
        Validators.required([]).should.equal(false);
    });

    it('should validate length', function () {
        should.not.exist(Validators.min(3, null));
        should.not.exist(Validators.max(3, null));
        // Strings
        Validators.max(3, 'abc').should.equal(true);
        Validators.max(3, 'abcd').should.equal(false);
        Validators.min(3, 'abc').should.equal(true);
        Validators.min(3, 'ab').should.equal(false);
        // Arrays
        Validators.max(3, [1, 2, 3]).should.equal(true);
        Validators.max(3, [1, 2, 3, 4]).should.equal(false);
        Validators.min(3, [1, 2, 3]).should.equal(true);
        Validators.min(3, [1, 2]).should.equal(false);
        // Others
        // Validators.max(3, {a: 1, b: 2}).should.equal(false);
    });

    it('should validate object keys length', function () {
        should.not.exist(Validators.minKeys(3, null));
        should.not.exist(Validators.maxKeys(3, null));
        // Objects
        Validators.maxKeys(2, {a: 1, b: 2}).should.equal(true);
        Validators.maxKeys(2, {a: 1, b: 2, c: 3}).should.equal(false);
        Validators.minKeys(2, {a: 1, b: 2}).should.equal(true);
        Validators.minKeys(2, {a: 1}).should.equal(false);
        // Others
        Validators.maxKeys(2, 'abc').should.equal(false);
        Validators.minKeys(2, 123).should.equal(false);
    });

    it('should validate patterns', function () {
        Validators.pattern(/^\d{1,3}$/, '123').should.equal(true);
        Validators.pattern(/^\d{1,3}$/, '1234').should.equal(false);
    });

    it('should validate lists', function () {
        should.not.exist(Validators.withElm(3, null));
        Validators.withElm(3, [1, 2, 3]).should.equal(true);
        Validators.withElm(4, [1, 2, 3]).should.equal(false);

        should.not.exist(Validators.withoutElm(3, null));
        Validators.withoutElm(3, [1, 2, 3]).should.equal(false);
        Validators.withoutElm(4, [1, 2, 3]).should.equal(true);

        Validators.withElm(3, set).should.equal(true);
        Validators.withElm(4, set).should.equal(false);

        Validators.withoutElm(3, set).should.equal(false);
        Validators.withoutElm(4, set).should.equal(true);
    });

    it('should match values', function () {
        should.not.exist(Validators.exactly(3, null));

        Validators.exactly(3, 3).should.equal(true);
        Validators.exactly(3, 4).should.equal(false);
        Validators.exactly([1], [1]).should.equal(false);
    })
});

describe('Izit', function () {
    it('should return errors on props', function () {
        Izit().string().required().max(3).validate('abc')
            .should.eql({
                valid: true,
                errors: {
                    string: false,
                    required: false,
                    max: false
                }
            });

        Izit().string().required().max(3).validate('abcd')
            .should.eql({
                valid: false,
                errors: {
                    string: false,
                    required: false,
                    max: true
                }
            });

        Izit().string().required().max(2).validate(null)
            .should.eql({
                valid: false,
                errors: {
                    string: false,
                    required: true
                }
            });
    });

    it('should allow addition of validators', function () {
        addValidator('colour', function colour(colour, val) {
            if (val === undefined || val === null) return null;
            return colour === val;
        });

        Validators.colour('red', 'red').should.equal(true);
        Validators.colour('red', 'green').should.equal(false);
        should.not.exist(Validators.colour('red'));

        Izit().string().required().colour('red').validate('red')
            .should.eql({
                valid: true,
                errors: {
                    string: false,
                    required: false,
                    colour: false
                }
            });
    });
});
