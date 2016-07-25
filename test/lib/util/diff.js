const {test, assert, insp} = require('scar');
const {diff} = require('../../../lib/util');

[
    [[], [], []],
    [[1], [], [1]],
    [[], [1], []],
    [[1], [1], []],
    [[1], [2], [1]],
    [[1, 2], [2], [1]],
    [[1], [1, 2], []],
    [[1], [2, 1], []],
    [[3], [2, 1], [3]],
    [[1, 2, 3], [3, 2, 1], []],
    [[null], [], [null]],
    [[null], [null], []],
    [[undefined], [], [undefined]],
    [[undefined], [undefined], []]
].forEach(([x, y, exp]) => {
    test(`util.diff(${insp(x)}, ${insp(y)}) === ${insp(exp)}`, () => {
        assert.deepEqual(diff(x, y), exp);
    });
});
