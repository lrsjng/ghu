const each = require('./each');

module.exp = (prepend = '', append = '') => {
    return each(obj => {
        obj.content = String(prepend) + obj.content + String(append);
    });
};
