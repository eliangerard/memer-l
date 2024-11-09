const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('loop')
        .setDescription('Activa la repetición de, la queue o la canción')
        .addStringOption(option =>
            option.setName('mode')
                .setDescription('El modo de repetición')
                .addChoices(
                    { name: 'apagado', value: "none" },
                    { name: 'canción', value: "track" },
                    { name: 'queue', value: "queue" },
                )),
    inVoice: false,
    voiceCommand: ['loop', 'repite'],
    queueDependent: true,
    async execute(client, queue, message, content) {
        let [mode] = content;
        const player = client.riffy.players.get(message.guild.id);
        if (mode && mode !== "none" && mode !== "track" && mode !== "queue") {
            return {
                title: client.emotes.error + " Error",
                description: "Modo de repetición inválido, por favor, elige entre `none`, `track`, `queue` o ninguno para cambiar entre modos"
            };
        }

        const calculatedLoop = !mode ?
            player.loop === "none" ?
                "track" :
                player.loop === "track" ?
                    "queue" :
                    "none"
            : mode;

        player.setLoop(calculatedLoop);

        return {
            title: client.emotes.repeat + " Loop",
            description: `Modo de repetición establecido: \`${calculatedLoop}\``
        };
    }
};