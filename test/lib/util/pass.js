const {test, assert, spy, uniq} = require('scar');
const {pass, pass_err} = require('../../../lib/util');

test('util.pass()', () => {
    assert.equal(typeof pass, 'function', 'is function');
});

test('util.pass() - passes', () => {
    const fn = spy();
    const val = uniq.id();
    return Promise.resolve(val)
        .then(pass(fn))
        .then(
            x => {
                assert.equal(val, x);
                assert.equal(fn.calls.length, 1);
                assert.deepEqual(fn.calls[0].args, [val]);
                assert.deepEqual(fn.calls[0].ret, undefined);
            },
            () => {
                assert.fail('should take this path');
            }
        );
});

test('util.pass() - skipped', () => {
    const fn = spy();
    const val = uniq.id();
    return Promise.reject(val)
        .then(pass(fn))
        .then(
            () => {
                assert.fail('should take this path');
            },
            x => {
                assert.equal(val, x);
                assert.equal(fn.calls.length, 0);
            }
        );
});

test('util.pass_err()', () => {
    assert.equal(typeof pass_err, 'function', 'is function');
});

test('util.pass_err() - passes', () => {
    const fn = spy();
    const val = uniq.id();
    return Promise.reject(val)
        .catch(pass_err(fn))
        .then(
            () => {
                assert.fail('should take this path');
            },
            x => {
                assert.equal(val, x);
                assert.equal(fn.calls.length, 1);
                assert.deepEqual(fn.calls[0].args, [val]);
                assert.deepEqual(fn.calls[0].ret, undefined);
            }
        );
});

test('util.pass_err() - skipped', () => {
    const fn = spy();
    const val = uniq.id();
    return Promise.resolve(val)
        .catch(pass_err(fn))
        .then(
            x => {
                assert.equal(val, x);
                assert.equal(fn.calls.length, 0);
            },
            () => {
                assert.fail('should take this path');
            }
        );
});
