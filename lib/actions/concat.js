export default function concat(sep = '\n', source = '@concat') {
    return objs => Promise.resolve().then(() => {
        const content = objs.map(obj => obj.content).join(sep);
        return [{source, content}];
    });
}
