const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('seek')
        .setDescription('Salta al segundo que indiques')
        .addIntegerOption(option => option.setName('segundos').setDescription('Segundos a los que se tiene que saltar la reproducción').setRequired(true)),
    inVoice: true,
    voiceCommand: ['segundo'],
    queueDependent : true,
    async execute(client, queue, message, content) {
        const player = client.riffy.players.get(message.guild.id);
        const [seconds] = content
        console.log(seconds,player);
        player.seek(parseInt(seconds));
        return {
            title: client.emotes.success + " Seek",
            description: `Saltando a ${seconds}!`
        }
    },
};