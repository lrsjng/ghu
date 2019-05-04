const {test, assert, insp} = require('scar');
const {uniqdiff} = require('../../../lib/util');

test('util.uniqdiff()', () => {
    assert.equal(typeof uniqdiff, 'function', 'is function');

    [
        [[], [], []],
        [[1], [], [1]],
        [[], [1], []],
        [[1], [1], []],
        [[1], [2], [1]],
        [[1, 2], [2, 2], [1]],
        [[1], [1, 2], []],
        [[1], [2, 1], []],
        [[3], [2, 1], [3]],
        [[1, 2, 3], [3, 2, 1], []],
        [[null], [], [null]],
        [[null], [null], []],
        [[undefined], [], [undefined]],
        [[undefined], [undefined], []],
        [[1, 1], [2], [1]],
        [[1, 2, 1], [2], [1]],
        [[1, 1], [2, 2], [1]],
        [[1, 1, 2, 2], [2], [1]],
        [[1, 2, 2, 2, 2, 2, 1], [2, 2, 2], [1]]
    ].forEach(([x, y, exp], idx) => {
        const msg = `[fix#${idx}] (${insp(x)}, ${insp(y)}) -> ${insp(exp)}`;
        assert.deep_equal(uniqdiff(x, y), exp, msg);
    });
});
