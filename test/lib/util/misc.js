const {test, assert, insp} = require('scar');
const util = require('../../../lib/util');

/* eslint-disable no-multi-spaces, no-new-wrappers, no-array-constructor, func-names */
// value, isNumber, isString, isArray, isBuffer, isFn
const X = true;
const _ = false;
const FIXTURES = [
    [undefined,        _, _, _, _, _],
    [null,             _, _, _, _, _],
    [true,             _, _, _, _, _],
    [false,            _, _, _, _, _],
    [NaN,              X, _, _, _, _],
    [0,                X, _, _, _, _],
    [1,                X, _, _, _, _],
    ['undefined',      _, X, _, _, _],
    ['null',           _, X, _, _, _],
    ['true',           _, X, _, _, _],
    ['false',          _, X, _, _, _],
    ['NaN',            _, X, _, _, _],
    ['',               _, X, _, _, _],
    ['0',              _, X, _, _, _],
    ['1',              _, X, _, _, _],
    [new String(),     _, _, _, _, _],
    [[],               _, _, X, _, _],
    [new Array(),      _, _, X, _, _],
    [new Buffer(0),    _, _, _, X, _],
    [() => null,       _, _, _, _, X],
    [function () {},   _, _, _, _, X],
    [test,             _, _, _, _, X],
    [{},               _, _, _, _, _],
    [/a/,              _, _, _, _, _],
    [new Error(),      _, _, _, _, _]
];
/* eslint-enable */

test('util.isNumber()', () => {
    assert.equal(typeof util.isNumber, 'function');
});

FIXTURES.forEach(x => {
    const val = x[0];
    const exp = x[1];

    test(`util.isNumber(${insp(val)}) === ${insp(exp)}`, () => {
        assert.equal(util.isNumber(val), exp);
    });
});

FIXTURES.forEach(x => {
    const val = x[0];
    const exp = x[2];

    test(`util.isString(${insp(val)}) === ${insp(exp)}`, () => {
        assert.equal(util.isString(val), exp);
    });
});

FIXTURES.forEach(x => {
    const val = x[0];
    const exp = x[3];

    test(`util.isArray(${insp(val)}) === ${insp(exp)}`, () => {
        assert.equal(util.isArray(val), exp);
    });
});

FIXTURES.forEach(x => {
    const val = x[0];
    const exp = x[4];

    test(`util.isBuffer(${insp(val)}) === ${insp(exp)}`, () => {
        assert.equal(util.isBuffer(val), exp);
    });
});

FIXTURES.forEach(x => {
    const val = x[0];
    const exp = x[5];

    test(`util.isFn(${insp(val)}) === ${insp(exp)}`, () => {
        assert.equal(util.isFn(val), exp);
    });
});
