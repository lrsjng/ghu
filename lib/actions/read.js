const {read_file} = require('../util');
const stats = require('./stats');

const read = module.exports = (arg, options, charset) => {
    options = Object.assign({}, options, {files: true, dirs: false});
    return stats(arg, options)
        .then(objs => Promise.all(
            objs.map(obj => read_file(obj.source, charset)
                .catch(() => null)
                .then(content => {
                    obj.content = content;
                    return obj;
                })
            )
        ));
};

read.file = read_file;
read.json = (...args) => read_file(...args).then(content => JSON.parse(content));
