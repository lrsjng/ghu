const {test, assert, insp} = require('scar');
const {uniqunion} = require('../../../lib/util');

test('util.uniqunion()', () => {
    assert.equal(typeof uniqunion, 'function', 'is function');

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
        [[undefined], [undefined], [undefined]],
        [[1, 1], [2], [1, 2]],
        [[1, 2, 1], [2], [1, 2]],
        [[1, 1], [2, 2], [1, 2]],
        [[1, 1, 2, 2], [2], [1, 2]],
        [[1, 2, 2, 2, 2, 2, 1], [2, 2, 2], [1, 2]],
        [[2, 1, 2, 2, 2, 2, 2, 1], [1, 2, 2], [2, 1]]
    ].forEach(([x, y, exp], idx) => {
        const msg = `[fix#${idx}] (${insp(x)}, ${insp(y)}) -> ${insp(exp)}`;
        assert.deepEqual(uniqunion(x, y), exp, msg);
    });
});
