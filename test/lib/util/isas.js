const {test, assert, insp} = require('scar');
const {isNumber, isString, isFn, asFn, asArray} = require('../../../lib/util');

/* eslint-disable no-multi-spaces, no-new-wrappers, no-array-constructor, func-names */
// value, isNumber, isString, isFn, isArray, isArrayLike
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
    [new String(),     _, X, _, _, _],
    [[],               _, _, _, X, X],
    [new Array(),      _, _, _, X, X],
    [{length: 2},      _, _, _, _, X],
    [new Buffer(0),    _, _, _, _, _],
    [() => null,       _, _, X, _, _],
    [function () {},   _, _, X, _, _],
    [test,             _, _, X, _, _],
    [{},               _, _, _, _, _],
    [/a/,              _, _, _, _, _],
    [new Error(),      _, _, _, _, _]
];
/* eslint-enable */

test('util.isNumber()', () => {
    assert.equal(typeof isNumber, 'function');
});

FIXTURES.forEach(x => {
    const val = x[0];
    const exp = x[1];

    test(`util.isNumber(${insp(val)}) === ${insp(exp)}`, () => {
        assert.equal(isNumber(val), exp);
    });
});

FIXTURES.forEach(x => {
    const val = x[0];
    const exp = x[2];

    test(`util.isString(${insp(val)}) === ${insp(exp)}`, () => {
        assert.equal(isString(val), exp);
    });
});

FIXTURES.forEach(x => {
    const val = x[0];
    const exp = x[3];

    test(`util.isFn(${insp(val)}) === ${insp(exp)}`, () => {
        assert.equal(isFn(val), exp);
    });
});

FIXTURES.forEach(x => {
    const val = x[0];
    const valIsFn = x[3];

    if (valIsFn) {
        test(`util.asFn(${insp(val)}) === ${insp(val)}`, () => {
            assert.equal(typeof val, 'function');
            assert.equal(asFn(val), val);
        });
    } else {
        test(`util.asFn(${insp(val)}) === () => ${insp(val)}`, () => {
            const res = asFn(val);
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

FIXTURES.forEach((x, idx) => {
    const val = x[0];
    const valIsArray = x[4];
    const valIsArrayLike = x[5];

    if (valIsArray) {
        test(`util.asArray(${insp(val)}) === ${insp(val)}  [fix#${idx}]`, () => {
            assert.ok(Array.isArray(val));
            assert.equal(asArray(val), val);
        });
    } else if (valIsArrayLike) {
        test(`util.asArray(${insp(val)}) === [...]  [fix#${idx}]`, () => {
            const res = asArray(val);
            assert.ok(Array.isArray(res));
            assert.equal(res.length, val.length);
            res.forEach((resi, i) => {
                assert.equal(resi, val[i]);
            });
        });
    } else {
        test(`util.asArray(${insp(val)}) === [${insp(val)}]  [fix#${idx}]`, () => {
            const res = asArray(val);
            assert.ok(Array.isArray(res));
            assert.equal(res.length, 1);
            if (Number.isNaN(val)) {
                assert.ok(Number.isNaN(res[0]));
            } else {
                assert.equal(res[0], val);
            }
        });
    }
});
