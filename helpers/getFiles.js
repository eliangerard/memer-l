const fs = require('node:fs');

const getFiles = (dirName) => {
    console.log(dirName);
    let files = [];
    const items = fs.readdirSync(dirName, { withFileTypes: true });

    items.forEach(item => {
        if (item.isDirectory()) {
            files = [
                ...files.filter(file => file.endsWith('.js')),
                ...(getFiles(`${dirName}/${item.name}`)),
            ];
        } else {
            files.push(`${dirName}/${item.name}`);
        }
    })

    return files;
};

module.exports = {getFiles};