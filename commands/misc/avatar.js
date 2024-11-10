const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Muestra el avatar del usuario indicado')
        .addUserOption(option =>
            option
                .setName('usuario')
                .setDescription('El usuario del que mostrar el avatar')
                .setRequired(true)),
    inVoice: false,
    alias: ['av', 'foto', 'pic'],
    async execute(client, queue, message, params) {
        console.log(params);
        const user = await message.guild.members.fetch(params[0].substring(params[0].indexOf('@') + 1, params[0].indexOf('>')));
        return { title: client.emotes.success + " Avatar de " + user.displayName, image: user.displayAvatarURL({ dynamic: true, size: 1024 })}
    },
};