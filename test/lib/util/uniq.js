const {test, assert, insp} = require('scar');
const {uniq} = require('../../../lib/util');

test('util.uniq()', () => {
    assert.equal(typeof uniq, 'function', 'is function');

    [
        [[], []],
        [[1], [1]],
        [[1, 2], [1, 2]],
        [[2, 1], [2, 1]],
        [[1, 2, 1], [1, 2]],
        [[1, 2, 1, 2, 1, 1, 1], [1, 2]],
        [[1, 2, 1, undefined], [1, 2, undefined]],
        [[1, 2, 1, null], [1, 2, null]],
        [[1, 2, null, null], [1, 2, null]],
        [[1, 2, undefined, undefined], [1, 2, undefined]]
    ].forEach(([x, exp], idx) => {
        const msg = `[fix#${idx}] (${insp(x)}) -> ${insp(exp)}`;
        assert.deep_equal(uniq(x), exp, msg);
    });
});
