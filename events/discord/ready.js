module.exports = {
    name: 'ready',
    execute(client) {
        client.riffy.init(client.user.id);
        console.log(`Logged in as ${client.user.tag}`);
    },
};