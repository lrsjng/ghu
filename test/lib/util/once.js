const {test, assert, spy, uniq} = require('scar');
const {once} = require('../../../lib/util');

test('util.once()', () => {
    assert.equal(typeof once, 'function', 'is function');

    const val = uniq.obj();
    const fn = spy(val);
    const wrap = once(fn);
    assert.equal(fn.calls.length, 0);
    assert.equal(wrap(), val);
    assert.equal(fn.calls.length, 1);
    assert.equal(wrap(), val);
    assert.equal(fn.calls.length, 1);
    assert.equal(wrap(), val);
    assert.equal(fn.calls.length, 1);
});
