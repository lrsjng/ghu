const {test, assert} = require('scar');
const {run_sequential, run_concurrent} = require('../../../lib/util');

const createFn = delay => {
    const fn = () => new Promise(resolve => {
        fn.start = Date.now();
        setTimeout(resolve, delay);
    }).then(() => {
        fn.end = Date.now();
    });

    return fn;
};

const createFns = (n = 8, delay = 10) => {
    return new Array(n).fill(0).map(() => createFn(delay));
};

test('util.run_sequential()', () => {
    assert.equal(typeof run_sequential, 'function', 'is function');

    const fns = createFns();
    return run_sequential(fns).then(() => {
        fns.forEach((fn, idx) => {
            assert.equal(typeof fn.start, 'number', `fn#${idx} start`);
            assert.equal(typeof fn.end, 'number', `fn#${idx} end`);
            assert.ok(fn.end > fn.start, `fn#${idx} runtime`);

            fns.forEach((fn1, idx1) => { // eslint-disable-line max-nested-callbacks
                if (idx > idx1) {
                    assert.ok(fn.start >= fn1.end, `fn#${idx}#${idx1} order`);
                }
                if (idx < idx1) {
                    assert.ok(fn.end <= fn1.start, `fn#${idx}#${idx1} order`);
                }
            });
        });
    });
});

test('util.run_concurrent()', () => {
    assert.equal(typeof run_concurrent, 'function', 'is function');

    const fns = createFns();
    return run_concurrent(fns).then(() => {
        fns.forEach((fn, idx) => {
            assert.equal(typeof fn.start, 'number', `fn#${idx} start`);
            assert.equal(typeof fn.end, 'number', `fn#${idx} end`);
            assert.ok(fn.end > fn.start, `fn#${idx} runtime`);

            fns.forEach((fn1, idx1) => { // eslint-disable-line max-nested-callbacks
                if (idx > idx1) {
                    assert.ok(fn.start >= fn1.start, `fn#${idx}#${idx1} order`);
                }
                if (idx < idx1) {
                    assert.ok(fn.start <= fn1.start, `fn#${idx}#${idx1} order`);
                }
                assert.ok(fn.start < fn1.end, `fn#${idx}#${idx1} order`);
            });
        });
    });
});
