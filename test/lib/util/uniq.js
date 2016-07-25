const {test, assert, insp} = require('scar');
const {uniq} = require('../../../lib/util');

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
].forEach(([x, exp]) => {
    test(`util.uniq(${insp(x)}) === ${insp(exp)}`, () => {
        assert.deepEqual(uniq(x), exp);
    });
});
