const chalk = require('chalk').default;
const dateformat = require('dateformat').default;
const watch = require('watch');
const {short_path} = require('../util');

const now = () => dateformat(Date.now(), 'HH:MM:ss');

module.exports = (paths, fn) => {
    let hits = 0;
    let is_running = false;

    const check = () => {
        if (hits && !is_running) {
            hits = 0;
            is_running = true;
            Promise.resolve()
                .then(fn)
                .then(() => {
                    is_running = false;
                    console.log(chalk.grey(`\n[${now()}] watching...\n`));
                    check();
                });
        }
    };

    const handler = () => {
        hits += 1;
        check();
    };

    const add = path => {
        watch.createMonitor(path, monitor => {
            monitor
                .on('created', handler)
                .on('changed', handler)
                .on('removed', handler);
        });
    };

    console.log(chalk.grey(`\n[${now()}] start watching ${paths.map(short_path).join(', ')}...\n`));
    paths.forEach(add);
    return new Promise(() => null);
};
