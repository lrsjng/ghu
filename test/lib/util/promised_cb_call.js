const {test, assert, uniq} = require('scar');
const {promised_cb_call} = require('../../../lib/util');

test('util.promised_cb_call()', () => {
    assert.equal(typeof promised_cb_call, 'function', 'is function');
});

test('util.promised_cb_call() - no return val', () => {
    const fn = cb => {
        setTimeout(() => cb(null), 10);
    };
    const p = promised_cb_call(fn, []);

    assert.equal(p, Promise.resolve(p));
    return p.then(
        x => {
            assert.equal(x, undefined);
        },
        () => {
            assert.fail('should not take this path');
        }
    );
});

test('util.promised_cb_call() - one callback val', () => {
    const val = uniq.obj();
    const fn = cb => {
        setTimeout(() => cb(null, val), 10);
    };
    const p = promised_cb_call(fn, []);

    assert.equal(p, Promise.resolve(p));
    return p.then(
        x => {
            assert.equal(x, val);
        },
        () => {
            assert.fail('should not take this path');
        }
    );
});

test('util.promised_cb_call() - two callback vals', () => {
    const val0 = uniq.obj();
    const val1 = uniq.obj();
    const fn = cb => {
        setTimeout(() => cb(null, val0, val1), 10);
    };
    const p = promised_cb_call(fn, []);

    assert.equal(p, Promise.resolve(p));
    return p.then(
        x => {
            assert.deepEqual(x, [val0, val1]);
        },
        () => {
            assert.fail('should not take this path');
        }
    );
});

test('util.promised_cb_call() - three callback vals', () => {
    const val0 = uniq.obj();
    const val1 = uniq.obj();
    const val2 = uniq.obj();
    const fn = cb => {
        setTimeout(() => cb(null, val0, val1, val2), 10);
    };
    const p = promised_cb_call(fn, []);

    assert.equal(p, Promise.resolve(p));
    return p.then(
        x => {
            assert.deepEqual(x, [val0, val1, val2]);
        },
        () => {
            assert.fail('should not take this path');
        }
    );
});

test('util.promised_cb_call() - err', () => {
    const err = uniq.obj();
    const fn = cb => {
        setTimeout(() => cb(err), 10);
    };
    const p = promised_cb_call(fn, []);

    assert.equal(p, Promise.resolve(p));
    return p.then(
        () => {
            assert.fail('should not take this path');
        },
        x => {
            assert.deepEqual(x, err);
        }
    );
});
