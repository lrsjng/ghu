const {test, assert, insp} = require('scar');
const {union} = require('../../../lib/util');

test('util.union()', () => {
    assert.equal(typeof union, 'function', 'is function');

    [
        [[], [], []],
        [[1], [], [1]],
        [[], [1], [1]],
        [[1], [1], [1]],
        [[1], [2], [1, 2]],
        [[1, 2], [2], [1, 2]],
        [[1], [1, 2], [1, 2]],
        [[1], [2, 1], [1, 2]],
        [[3], [2, 1], [3, 2, 1]],
        [[1, 2, 3], [3, 2, 1], [1, 2, 3]],
        [[null], [], [null]],
        [[null], [null], [null]],
        [[undefined], [], [undefined]],
        [[undefined], [undefined], [undefined]]
    ].forEach(([x, y, exp], idx) => {
        const msg = `[fix#${idx}] (${insp(x)}, ${insp(y)}) -> ${insp(exp)}`;
        assert.deep_equal(union(x, y), exp, msg);
    });
});
