const {resolve} = require('path');
const {test, assert, insp} = require('scar');
const {paths} = require('../../../lib/ghu');

const assert_promise = p => {
    assert.equal(p, Promise.resolve(p), `expected ${insp(p)} to be a promise`);
};

test('lib.paths()', () => {
    assert.equal(typeof paths, 'function', 'is function');
    assert_promise(paths());
});

test('lib.paths() - no args', () => {
    return paths().then(res => {
        assert.deep_equal(res, []);
    });
});

test('lib.paths() - sequence fixtures', () => {
    const assets = resolve(__dirname, 'assets');
    const sub = resolve(assets, 'sub');
    const a = resolve(assets, 'a.txt');
    const b = resolve(assets, 'b.txt');
    const c = resolve(assets, 'c.txt');
    const d = resolve(sub, 'd.txt');
    const e = resolve(sub, 'e.txt');
    const none = resolve(assets, 'none.txt');
    return Promise.all([
        ['', []],
        [none, []],
        [`${a}`, [a]],
        [` ${a}`, [a]],
        [`${a} `, [a]],
        [` ${a} `, [a]],
        [`${a},${a}`, [a]],
        [`${a}, ${a}`, [a]],
        [`${a},${b}`, [a, b]],
        [`${b},${a}`, [b, a]],
        [`${a},${b},${c}`, [a, b, c]],
        [`${a},${b};${c}`, [a, b, c]],
        [`${a};${b},${c}`, [a, b, c]],
        [`${a};${b};${c}`, [a, b, c]],
        [`${a};${a}`, [a]],
        [`${a}; ${a}`, [a]],
        [`${a};`, [a]],
        [`${a}; `, [a]],
        [`${assets}`, [assets]],
        [`${assets}:`, [assets]],
        [`${assets}: a`, []],
        [`${assets}: a*`, [a]],
        [`${assets}: a*, b*`, [a, b]],
        [`${assets}: *`, [a, b, c, sub]],
        [`${assets}: **`, [assets, a, b, c, sub, d, e]],
        [`${assets}: *.txt`, [a, b, c]],
        [`${assets}: a*; ${sub}: *`, [a, d, e]],
        [`${assets}: *, !a*`, [b, c, sub]]
    ].map(([str, exp], idx) => {
        return paths(str).then(res => {
            assert.deep_equal(res, exp, `fix#${idx} res: ${res}`);
        });
    }));
});

test('lib.paths() - error fixtures', () => {
    const assets = resolve(__dirname, 'assets');
    const a = resolve(assets, 'a.txt');
    return Promise.all([
        [`${assets}::`, /only one prefix/i],
        [`${assets}:${assets}:`, /only one prefix/i],
        [`${assets}:: ${a}`, /only one prefix/i],
        [`${assets}:${assets}: ${a}`, /only one prefix/i]
    ].map(([str, exp], idx) => {
        return assert.rejects(paths(str), exp, `fix#${idx}`);
    }));
});
