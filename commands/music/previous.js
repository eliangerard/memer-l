const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('previous')
        .setDescription('Reproduce la canción anterior'),
    inVoice: true,
    alias: ['prev'],
    voiceCommand: ['anterior', 'regresa'],
    queueDependent: true,
    async execute(client, queue, message, content) {
        
        const player = client.riffy.players.get(message.guild.id);

        client.commands.get('play').execute(client,queue,message, [player.previous.info.uri]);

        return {
            title: client.emotes.success + " Reproduciendo canción anterior"
        }
    },
};