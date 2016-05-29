const pug = require('pug');
const each = require('../actions/each');

module.exports = (locals, options) => {
    return each(obj => {
        const settings = Object.assign({}, options, {filename: obj.source});
        const render = pug.compile(obj.content, settings);
        obj.content = render(locals);
    });
};
