const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('stop')
        .setDescription('Detiene la reproducción y borra la cola'),
    inVoice: true,
    voiceCommand: ['cállate', 'detente'],
    queueDependent: true,
    async execute(client, queue, message, content) {

        const player = client.riffy.players.get(message.guild.id);

        player.stop();

        return {
            title: client.emotes.stop + " Detenido",
            description: "Se ha detenido la reproducción"
        }
    },
};