const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const each = require('../actions/each');

// module.exports = options => {
//     const settings = Object.assign({
//         browsers: ['defaults']
//     }, options);

module.exports = () => {
    return each(obj => {
        return postcss([autoprefixer])
            .process(obj.content, {from: obj.source})
            .then(res => {
                obj.content = res.css;
            });
    });
};
