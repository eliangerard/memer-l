module.exports = {
    name: 'nodeError',
    execute : (node, error) => {
        console.log(`Node "${node.name}" encountered an error: ${error.message}.`)
    },
};