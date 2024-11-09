const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
        .setDescription('Pausa o continua la reproducción de la música'),
    inVoice : true,
    voiceCommand : ['pausa', 'pausar', 'resume'],
    queueDependent : true,
	async execute(client, queue, message, content) {
        const player = client.riffy.players.get(message.guild.id);

        player.pause(!player?.paused);

        return {
            title: client.emotes.success+" Pause",
            description: player?.paused ? "Pausando reproducción" : "Reanudando reproducción"
        }
	},
};