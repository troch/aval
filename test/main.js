'use strict';

var path      = require('path');
var pkg       = require('../package.json');
var Iz        = require(path.join(__dirname, '..', pkg.main));
var should    = require('should');

var Izit = Iz.Izit
var Validators = Iz.Validators

require('mocha');

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

    it('should validate dates', function () {
        Validators.date(null).should.equal(true);
        Validators.date(undefined).should.equal(true);
        Validators.date(new Date()).should.equal(true);
        Validators.date('2012/10/12').should.equal(false);
    });
});

describe('Izit', function () {
    it('should return errors on props', function () {
        Izit().string().required().validate('abc').should.eql({valid: true, errors: {string: false, required: false}});
    });
});
