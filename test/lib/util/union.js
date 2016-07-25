const {test, assert, insp} = require('scar');
const {union} = require('../../../lib/util');

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
].forEach(([x, y, exp]) => {
    test(`util.union(${insp(x)}, ${insp(y)}) === ${insp(exp)}`, () => {
        assert.deepEqual(union(x, y), exp);
    });
});
