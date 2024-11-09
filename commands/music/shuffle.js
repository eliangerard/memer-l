const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('shuffle')
        .setDescription('Aleatoriza la queue'),
    inVoice: false,
    voiceCommand: ['aleatoriza', 'revuelve'],
    queueDependent: true,
    async execute(client, queue, message, content) {
        const player = client.riffy.players.get(message.guild.id);

        player.queue.shuffle();

        return {
            title: client.emotes.success + " Shuffle",
            description: "¡Queue revuelta!"
        }
    },
};