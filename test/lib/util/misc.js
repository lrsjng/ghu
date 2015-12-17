const {test, assert, insp} = require('scar');
const util = require('../../../lib/util');

/* eslint-disable no-multi-spaces, no-new-wrappers, no-array-constructor, func-names */
// value, isNumber, isString, isFn
const X = true;
const _ = false;
const FIXTURES = [
    [undefined,        _, _, _],
    [null,             _, _, _],
    [true,             _, _, _],
    [false,            _, _, _],
    [NaN,              X, _, _],
    [0,                X, _, _],
    [1,                X, _, _],
    ['undefined',      _, X, _],
    ['null',           _, X, _],
    ['true',           _, X, _],
    ['false',          _, X, _],
    ['NaN',            _, X, _],
    ['',               _, X, _],
    ['0',              _, X, _],
    ['1',              _, X, _],
    [new String(),     _, X, _],
    [[],               _, _, _],
    [new Array(),      _, _, _],
    [new Buffer(0),    _, _, _],
    [() => null,       _, _, X],
    [function () {},   _, _, X],
    [test,             _, _, X],
    [{},               _, _, _],
    [/a/,              _, _, _],
    [new Error(),      _, _, _]
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

    test(`util.isFn(${insp(val)}) === ${insp(exp)}`, () => {
        assert.equal(util.isFn(val), exp);
    });
});

FIXTURES.forEach(x => {
    const val = x[0];
    const isFn = x[3];

    if (isFn) {
        test(`util.asFn(${insp(val)}) === ${insp(val)}`, () => {
            assert.equal(typeof val, 'function');
            assert.equal(util.asFn(val), val);
        });
    } else {
        test(`util.asFn(${insp(val)}) === () => ${insp(val)}`, () => {
            const res = util.asFn(val);
            assert.notEqual(typeof val, 'function');
            assert.equal(typeof res, 'function');
            if (Number.isNaN(val)) {
                assert.ok(Number.isNaN(res()));
            } else {
                assert.equal(res(), val);
            }
        });
    }
});
