const jade = require('jade');
const each = require('../actions/each');

module.exports = (locals, options) => {
    return each(obj => {
        const settings = Object.assign({}, options, {filename: obj.source});
        const render = jade.compile(obj.content, settings);
        obj.content = render(locals);
    });
};
