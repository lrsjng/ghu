const {test, assert} = require('scar');
const {webpack} = require('../../../lib/ghu');

test('lib.webpack()', () => {
    assert.equal(typeof webpack, 'function');
    assert.equal(typeof webpack(), 'function');
});

test('lib.webpack() - no objects', () => {
    const fn = webpack({}, {showStats: false});
    const objs = [];

    return fn(objs).then(val => {
        assert.deepEqual(val, []);
    });
});

test('lib.webpack() - empty', () => {
    const fn = webpack({}, {showStats: false});
    const content = '';
    const objs = [{source: 'empty.js', content}];

    return fn(objs).then(val => {
        assert.equal(val.length, 1);
        assert.equal(val[0].source, 'empty.js');
        assert.ok(val[0].content.match(/function/));
    });
});

test('lib.webpack() - minimal', () => {
    const fn = webpack({}, {showStats: false});
    const content = 'module.exports = " Heyhoh "';
    const objs = [{source: 'minimal.js', content}];

    return fn(objs).then(val => {
        assert.equal(val.length, 1);
        assert.equal(val[0].source, 'minimal.js');
        assert.ok(val[0].content.match(/function/));
        assert.ok(val[0].content.match(/ Heyhoh /));
    });
});

test('lib.webpack.cfg() - no args', () => {
    const expected = {
        mode: 'none',
        module: {
            rules: [
                {
                    include: undefined,
                    loader: 'babel-loader',
                    query: {
                        cacheDirectory: true,
                        presets: ['@babel/preset-env']
                    }
                }
            ]
        }
    };

    assert.deepEqual(webpack.cfg(), expected);
});

test('lib.webpack.cfg() - includes', () => {
    const inc = {};
    const expected = {
        mode: 'none',
        module: {
            rules: [
                {
                    include: inc,
                    loader: 'babel-loader',
                    query: {
                        cacheDirectory: true,
                        presets: ['@babel/preset-env']
                    }
                }
            ]
        }
    };

    assert.deepEqual(webpack.cfg(inc), expected);
});

test('lib.webpack.cfg_und() - no args', () => {
    const expected = {
        mode: 'none',
        module: {
            rules: [
                {
                    include: undefined,
                    loader: 'babel-loader',
                    query: {
                        cacheDirectory: true,
                        presets: ['@babel/preset-env']
                    }
                }
            ]
        },
        output: {
            library: undefined,
            libraryTarget: 'umd',
            umdNamedDefine: true,
            globalObject: '(typeof self !== \'undefined\' ? self : this)'
        }
    };

    assert.deepEqual(webpack.cfg_umd(), expected);
});

test('lib.webpack.cfg_und() - name and includes', () => {
    const name = {};
    const inc = {};
    const expected = {
        mode: 'none',
        module: {
            rules: [
                {
                    include: inc,
                    loader: 'babel-loader',
                    query: {
                        cacheDirectory: true,
                        presets: ['@babel/preset-env']
                    }
                }
            ]
        },
        output: {
            library: name,
            libraryTarget: 'umd',
            umdNamedDefine: true,
            globalObject: '(typeof self !== \'undefined\' ? self : this)'
        }
    };

    assert.deepEqual(webpack.cfg_umd(name, inc), expected);
});
