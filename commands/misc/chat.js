const { CohereClient } = require('cohere-ai');
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chat')
        .setDescription('Chatea con Memer'),
    inVoice: false,
    deleteInvocation: false,
    voiceCommand: ['chat', 'busca', 'dime'],
    async execute(client, queue, message, content) {
        const cohere = new CohereClient({
            token: client.config.cohereToken, // This is your trial API key
        });

        const text = content.join(' ');
        const response = await cohere.chat({
            model: client.config.cohereModel,
            message: text,
            temperature: 0.3,
            connectors:[{"id": "web-search"}],
        });
        console.log(response);
        return {
            content : response.chatHistory[1].message
        };
    },
};