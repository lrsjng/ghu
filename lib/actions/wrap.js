const each = require('./each');

module.exports = (prepend = '', append = '') => {
    return each(obj => {
        obj.content = String(prepend) + obj.content + String(append);
    });
};
