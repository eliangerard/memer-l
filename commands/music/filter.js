const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('filter')
        .setDescription('Añade o remueve un filtro activo a la reproducción')
        .addStringOption(option =>
            option.setName('option')
                .setDescription('El filtro a activar o desactivar')
                .setRequired(true)
                .addChoices(
                    { name: 'karaoke', value: 'karaoke' },
                    { name: 'timescale', value: 'timescale' },
                    { name: 'tremolo', value: 'tremolo' },
                    { name: 'vibrato', value: 'vibrato' },
                    { name: 'rotation', value: 'rotation' },
                    { name: 'distortion', value: 'distortion' },
                    { name: 'channel mix', value: 'channel mix' },
                    { name: 'low pass', value: 'low pass' },
                    { name: 'bassboost', value: 'bassboost' },
                    { name: 'slowmode', value: 'slowmode' },
                    { name: 'nightcore', value: 'nightcore' },
                    { name: 'vaporwave', value: 'vaporwave' },
                    { name: '8d', value: '8d' },
                )
        ),
    inVoice: true,
    voiceCommand: ['filtros', 'filtro', 'f'],
    queueDependent: true,

    async execute(client, queue, message, content) {
        const player = client.riffy.players.get(message.guild.id);

        const [filter] = content;
        
        if (filter === 'clear') {
            player.filters.setKaraoke(false);
            player.filters.setTimescale(false);
            player.filters.setTremolo(false);
            player.filters.setVibrato(false);
            player.filters.setRotation(false);
            player.filters.setDistortion(false);
            player.filters.setChannelMix(false);
            player.filters.setLowPass(false);
            player.filters.setBassboost(false);
            player.filters.setSlowmode(false);
            player.filters.setNightcore(false);
            player.filters.setVaporwave(false);
            player.filters.set8D(false);

            return {
                title: client.emotes.success + " Filtros",
                description: "Filtros removidos"
            }
        }

        if (filter === 'list') {
            return {
                title: client.emotes.success + " Filtros",
                description: "Lista de filtros activos: \n" +
                    (player.filters.karaoke ? "Karaoke\n" : "") +
                    (player.filters.timescale ? "Timescale\n" : "") +
                    (player.filters.tremolo ? "Tremolo\n" : "") +
                    (player.filters.vibrato ? "Vibrato\n" : "") +
                    (player.filters.rotation ? "Rotation\n" : "") +
                    (player.filters.distortion ? "Distortion\n" : "") +
                    (player.filters.channelMix ? "Channel Mix\n" : "") +
                    (player.filters.lowPass ? "Low Pass\n" : "") +
                    (player.filters.bassboost ? "Bassboost\n" : "") +
                    (player.filters.slowmode ? "Slowmode\n" : "") +
                    (player.filters.nightcore ? "Nightcore\n" : "") +
                    (player.filters.vaporwave ? "Vaporwave\n" : "") +
                    (player.filters.eightD ? "8D\n" : "")
            }
        }

        switch (filter) {
            case 'karaoke':
                player.filters.setKaraoke(!player.filters.karaoke);
                break;
            case 'timescale':
                player.filters.setTimescale(!player.filters.timescale);
                break;
            case 'tremolo':
                player.filters.setTremolo(!player.filters.tremolo);
                break;
            case 'vibrato':
                player.filters.setVibrato(!player.filters.vibrato);
                break;
            case 'rotation':
                player.filters.setRotation(!player.filters.rotation);
                break;
            case 'distortion':
                player.filters.setDistortion(!player.filters.distortion);
                break;
            case 'channel mix':
                player.filters.setChannelMix(!player.filters.channelMix);
                break;
            case 'low pass':
                player.filters.setLowPass(!player.filters.lowPass);
                break;
            case 'bassboost':
                player.filters.setBassboost(!player.filters.bassboost);
                break;
            case 'slowmode':
                player.filters.setSlowmode(!player.filters.slowmode);
                break;
            case 'nightcore':
                player.filters.setNightcore(!player.filters.nightcore);
                break;
            case 'vaporwave':
                player.filters.setVaporwave(!player.filters.vaporwave);
                break;
            case '8d':
                player.filters.set8D(!player.filters.eightD);
                break;
            default:
                return {
                    title: client.emotes.error + " Filtros",
                    description: "Filtro no encontrado"
                }
        }

        return {
            title: client.emotes.success + " Filtros",
            description: `Filtro ${filter} ${player.filters[filter] ? "activado" : "desactivado"}`
        }

    }
};