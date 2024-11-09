const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('remove')
        .setDescription('Quita la canción de la cola')
        .addIntegerOption(option => option.setName('song').setDescription('La canción que vas a quitar').setRequired(true)),
    inVoice: true,
    voiceCommand: ['quita la canción', 'quita', 'elimina'],
    queueDependent : true,
    async execute(client, queue, message, content) {

        const player = client.riffy.players.get(message.guild.id);

        const [song] = content;

        if (song < 1 || song > player.queue.size) {
            return {
                title: "Error",
                description: "La canción no existe"
            }
        }

        const removedSong = player.queue.remove(parseInt(song) - 1);

        return {
            title: "Canción eliminada",
            description: `La canción #${song} - ${removedSong.info.title} ha sido removida de la lista.`
        }
    }
};