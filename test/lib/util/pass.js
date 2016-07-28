const {test, assert, spy, uniq} = require('scar');
const {pass, passerr} = require('../../../lib/util');

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

test('util.passerr()', () => {
    assert.equal(typeof passerr, 'function', 'is function');
});

test('util.passerr() - passes', () => {
    const fn = spy();
    const val = uniq.id();
    return Promise.reject(val)
        .catch(passerr(fn))
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

test('util.passerr() - skipped', () => {
    const fn = spy();
    const val = uniq.id();
    return Promise.resolve(val)
        .catch(passerr(fn))
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
