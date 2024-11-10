const { SlashCommandBuilder } = require('discord.js');
const { io } = require('../../events/socket');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play')
        .setDescription('Reproduce una canción')
        .addStringOption(option => option.setName('canción').setDescription('Lo que quieras reproducir, puede ser una búsqueda o un link').setRequired(true)),
    inVoice: true,
    alias: ['p'],
    voiceCommand: ['reproduce', 'pon'],
    queueDependent: false,
    async execute(client, queue, message, args) {
        const query = args.join(" ");

        player = client.riffy.createConnection({
            guildId: message.guild.id,
            voiceChannel: message.member.voice.channel.id,
            textChannel: message.channel.id,
            deaf: false
        });

        client.player = player;


        const resolve = await client.riffy.resolve({ query: query, requester: message.author });
        const { loadType, tracks, playlistInfo } = resolve;

        if (loadType === 'playlist') {
            for (const track of resolve.tracks) {
                track.info.requester = message.author;
                player.queue.add(track);
            }

            if (player.current)
                io.emit('queueUpdate', [player.current.info, ...player.queue.map(track => track.info)]);
            else
                io.emit('queueUpdate', player.queue.map(track => track.info));
            if (!player.playing && !player.paused) player.play();
            return {
                content: `Se añadieron \`${tracks.length} canciones\` desde \`${playlistInfo.name}\``,
                deleteResponse: true
            }
        } else if (loadType === 'search' || loadType === 'track') {
            const track = tracks.shift();
            track.info.requester = message.author;

            player.queue.add(track);
            if (player.current)
                io.emit('queueUpdate', [player.current.info, ...player.queue.map(track => track.info)]);
            else
                io.emit('queueUpdate', player.queue.map(track => track.info));
            if (!player.playing && !player.paused) player.play();
            console.log(track);
            return {
                content: `<@!${track.info.requester.id}> añadió **${track.info.title}** de **${track.info.author}**`,
                deleteResponse: true
            }
        } else {
            return {
                content: `No se encontró nada para: ${query}`,
                deleteResponse: true
            }
        }
    }
};