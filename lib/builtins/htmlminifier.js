const {minify} = require('html-minifier');
const each = require('../actions/each');

module.exports = options => {
    const settings = Object.assign({}, options);

    return each(obj => {
        obj.content = minify(obj.content, settings);
    });
};
