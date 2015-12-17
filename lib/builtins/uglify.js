const uglify = require('uglify-js');
const each = require('../actions/each');

module.exports = options => {
    const settings = Object.assign({
        compressor: {},
        beautifier: {}
    }, options);
    const compressor = uglify.Compressor(settings.compressor);

    return each(obj => {
        let ast = uglify.parse(obj.content, {filename: obj.source});

        ast.figure_out_scope();
        ast = ast.transform(compressor);
        ast.figure_out_scope();
        ast.compute_char_frequency();
        ast.mangle_names();

        obj.content = ast.print_to_string(settings.beautifier);
    });
};
