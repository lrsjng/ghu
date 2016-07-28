const {test, assert} = require('scar');
const {runSequential, runConcurrent} = require('../../../lib/util');

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

test('util.runSequential()', () => {
    assert.equal(typeof runSequential, 'function', 'is function');

    const fns = createFns();
    return runSequential(fns).then(() => {
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

test('util.runConcurrent()', () => {
    assert.equal(typeof runConcurrent, 'function', 'is function');

    const fns = createFns();
    return runConcurrent(fns).then(() => {
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
