const {test, assert, insp} = require('scar');
const {is_number, is_string, is_fn, as_fn, as_array} = require('../../../lib/util');

/* eslint-disable no-multi-spaces, no-new-wrappers, no-array-constructor, func-names */
// value, is_number, is_string, is_fn, isArray, isArrayLike
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

test('util.is_number()', () => {
    assert.equal(typeof is_number, 'function', 'is function');

    FIXTURES.forEach((x, idx) => {
        const val = x[0];
        const exp = x[1];
        assert.equal(is_number(val), exp, `[fix#${idx}] ${insp(val)}`);
    });
});

test('util.is_string()', () => {
    assert.equal(typeof is_string, 'function', 'is function');

    FIXTURES.forEach((x, idx) => {
        const val = x[0];
        const exp = x[2];
        assert.equal(is_string(val), exp, `[fix#${idx}] ${insp(val)}`);
    });
});

test('util.is_fn()', () => {
    assert.equal(typeof is_fn, 'function', 'is function');

    FIXTURES.forEach((x, idx) => {
        const val = x[0];
        const exp = x[3];
        assert.equal(is_fn(val), exp, `[fix#${idx}] ${insp(val)}`);
    });
});

test('util.as_fn()', () => {
    assert.equal(typeof as_fn, 'function', 'is function');

    FIXTURES.forEach((x, idx) => {
        const val = x[0];
        const valIsFn = x[3];
        const msg = `[fix#${idx}] ${insp(val)}`;

        if (valIsFn) {
            assert.equal(typeof val, 'function', msg);
            assert.equal(as_fn(val), val, msg);
        } else {
            const res = as_fn(val);
            assert.notEqual(typeof val, 'function', msg);
            assert.equal(typeof res, 'function', msg);
            if (Number.isNaN(val)) {
                assert.ok(Number.isNaN(res()), msg);
            } else {
                assert.equal(res(), val, msg);
            }
        }
    });
});

test('util.as_array()', () => {
    assert.equal(typeof as_array, 'function', 'is function');

    FIXTURES.forEach((x, idx) => {
        const val = x[0];
        const valIsArray = x[4];
        const valIsArrayLike = x[5];
        const msg = `[fix#${idx}] ${insp(val)}`;

        if (valIsArray) {
            assert.ok(Array.isArray(val), msg);
            assert.equal(as_array(val), val, msg);
        } else if (valIsArrayLike) {
            const res = as_array(val);
            assert.ok(Array.isArray(res), msg);
            assert.equal(res.length, val.length, msg);
            res.forEach((resi, i) => {
                assert.equal(resi, val[i], msg);
            });
        } else {
            const res = as_array(val);
            assert.ok(Array.isArray(res), msg);
            assert.equal(res.length, 1, msg);
            if (Number.isNaN(val)) {
                assert.ok(Number.isNaN(res[0]), msg);
            } else {
                assert.equal(res[0], val, msg);
            }
        }
    });
});
