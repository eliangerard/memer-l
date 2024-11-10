const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Muestra los comandos del bot')
        .addStringOption(option => option.setName('comando').setDescription('El comando a mostrar').setRequired(false)),
    inVoice: false,
    alias: ['h'],
    voiceCommand: ['ayuda', 'comandos'],
    async execute(client, queue, message, content) {
        const [commandResolvable] = content;
        if (commandResolvable) {
            let command = client.commands.get(commandResolvable);
            if (!command)
                command = client.commands.find(cmd => cmd.alias && cmd.alias.includes(commandResolvable));
            if (!command)
                return { title: 'Comando no encontrado' };
            
            const fields = [
                {
                    name: ' ',
                    value: command.data.description
                }
            ];

            if (command.alias)
                fields.push({
                    name: 'Alias para texto',
                    value: '`' + (command.alias ? command.alias.join(', ') : 'N/A') + '`'
                });

            if (command.data.options[0]?.choices)
                fields.push({
                    name: 'Opciones del comando',
                    value: '```' + command.data.options[0].choices.map(choice => choice.name).join(', ') + '```'
                });

            if (command.voiceCommand)
                fields.push({
                    name: 'Comando por voz',
                    value: '`' + command.voiceCommand.join(', ') + '`'
                });

            return {
                title: client.config.prefix + command.data.name,
                fields
            };
        }
        const fields = client.commands.map(command => ({
            name: ' ',
            value: '`' + client.config.prefix + command.data.name + '` - ' + command.data.description
        }));

        fields.push({
            name: 'Por comando',
            value: 'Usa `' + client.config.prefix + 'help <comando>` para ver sus alias y su activación por voz'
        })

        return {
            title: 'Comandos disponibles',
            fields
        };
    },
};