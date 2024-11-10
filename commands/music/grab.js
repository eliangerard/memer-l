const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('grab')
        .setDescription('Te envía el link de la canción por privado'),
    inVoice: false,
    voiceCommand: ['agarrar', 'grab'],
    queueDependent : true,
    async execute(client, queue, message, content) {

        const player = client.riffy.players.get(message.guild.id);

        console.log(player.current);

        if(message.author){
            message.author.send(player.current.info.uri);
            return { title : "Tulún" };
        }
        if(message.user){
            message.user.send(player.current.info.uri);
            return { title : "Tulún" };
        }
    }
};