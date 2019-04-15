const autoprefixer = require('autoprefixer');
const each = require('../actions/each');

module.exports = options => {
    const settings = Object.assign({
        browsers: ['defaults']
    }, options);

    return each(obj => {
        obj.content = autoprefixer.process(obj.content, settings).css;
    });
};
