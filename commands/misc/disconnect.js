const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
	.setName('disconnect')
	.setDescription('Desconecta el bot del canal de voz'),
	inVoice: true,
	alias: ['dc', 'leave', 'salte'],
	voiceCommand: ['salte', 'desconéctate'],
	async execute(client, queue, message, content) {
		const player = client.riffy.players.get(message.guild.id);

        player.destroy();
        player.disconnect();

		return { title: client.emotes.success + " Adiós" }
	},
};