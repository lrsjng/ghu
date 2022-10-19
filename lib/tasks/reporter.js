// const chalk = require('chalk');
const chalk = import('chalk');

const log = console.log;

const format_args = args => {
    const str = Object.keys(args || {}).map(key => `${key}=${args[key]}`).join(', ');
    return str ? `[${str}]` : '';
};

const reporter = (type, runtime) => {
    const ghu = chalk.grey.bold('ghu');

    if (type === 'before') {
        log(chalk.grey(`${ghu} sequence: ${runtime.sequence.join(' ')}  ${format_args(runtime.args)}`));
    }

    if (type === 'after') {
        log(chalk.grey(`${ghu} was ${chalk.green('successful')} in ${runtime.time / 1000} seconds`));
    }

    if (type === 'beforeTask') {
        log(chalk.grey(`${ghu} task `) + chalk.cyan(`${runtime.task.name}`));
    }

    if (type === 'error') {
        const err = runtime.error;
        const message = err ? 'with ' + chalk.red.bold(err.message || err) : '';
        log(chalk.grey(`${ghu} ${chalk.red.bold('failed')} after ${runtime.time / 1000} seconds ${message}`));
        if (err && err.stack) {
            log(err.stack);
        }
    }
};

module.exports = reporter;
