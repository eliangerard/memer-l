const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('volume')
        .setDescription('Cambia el volumen de la reproducción')
        .addIntegerOption(option => option.setName('porcentaje').setDescription('Porcentaje del volumen').setRequired(true)),
    inVoice : true,
    alias : ['v'],
    voiceCommand : ['volumen'],
    queueDependent : true,
	async execute(client, queue, message, content) {
        const player = client.riffy.players.get(message.guild.id);

        const [volume] = content;
        player.setVolume(parseInt(volume > 1000 ? 1000 : volume < 0 ? 0 : volume));

        return {
            title: client.emotes.success+" Volumen actualizado",
            description: `Establecido en: \`${volume}\``
        }
	},        
};