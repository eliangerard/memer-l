function toObject(json) {
    return JSON.parse(JSON.stringify(json, (key, value) =>
        typeof value === 'bigint'
            ? value.toString()
            : value // return everything else unchanged
    ));
}


module.exports = {
    toObject
}