const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('autoplay')
        .setDescription('Activa o desactiva el modo autoplay'),
    inVoice: true,
    alias: ['ap'],
    voiceCommand: ['autoplay', 'auto'],
    queueDependent: true,
    async execute(client, queue, message, content) {
        client.autoPlay = !client?.autoPlay;

        return {
            title: "AutoPlay " + (client.autoPlay ? "activado" : "desactivado"),
            result: client.autoPlay,
        };
    }
};