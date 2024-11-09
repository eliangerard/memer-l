const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('skip')
        .setDescription('Saltea la canción que se esté reproduciendo'),
    inVoice: true,
    alias: ['s'],
    voiceCommand: ['siguiente', 'skip'],
    queueDependent: true,
    async execute(client, queue, message, content) {
        const player = client.riffy.players.get(message.guild.id);
        console.log(player);
        player.stop();

        return {
            title: client.emotes.success + " Skip",
            color: client.config.accentColor
        };
    }
};