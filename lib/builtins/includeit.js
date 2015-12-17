const includeit = require('includeit');
const each = require('../actions/each');

module.exports = options => {
    const settings = Object.assign({
        encoding: 'utf-8'
    }, options);

    return each(obj => {
        obj.content = includeit({file: obj.source, content: obj.content, charset: settings.encoding});
    });
};
