const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'queueEnd',
    async execute(player, client) {
        const channel = client.channels.cache.get(player.textChannel);

        if (client.autoPlay) {
            player.autoplay(player)
        } else {
            player.destroy();
            const embed = new EmbedBuilder()
            .setTitle(client.emotes.success + ` Finished`)
            .setDescription("Cola terminada")
            .setColor(client.config.accentColor)
            .setTimestamp()
            .setFooter({text: 'Memer', iconURL: client.botURL});

            channel.send({ embeds: [embed] }).then(msg => {
                setTimeout(() => msg.delete(), 15000)
            }) 
        }
    },
};