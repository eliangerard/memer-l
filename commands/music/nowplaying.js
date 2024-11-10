const { SlashCommandBuilder } = require('discord.js');
const { Classic } = require('musicard');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('nowplaying')
        .setDescription('Muestra lo que se está reproduciendo en este momento'),
    inVoice: false,
    alias: ['np'],
    voiceCommand: ['cuál', 'cual'],
    queueDependent: true,
    async execute(client, queue, message, content) {

        const player = client.riffy.players.get(message.guild.id);
        const track = player.current;
        console.log(player);

        const channel = client.channels.cache.get(player.textChannel);

        function formatTime(time) {
            const minutes = Math.floor(time / 60);
            const seconds = Math.floor(time % 60);
            return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
        }

        const musicLength = track.info.length;
        const formattedLength = formatTime(Math.round(musicLength / 1000));
        const [minutesStr, secondsStr] = formattedLength.split(":");
        const minutes = parseInt(minutesStr, 10);
        const seconds = parseInt(secondsStr, 10);

        const timePlayed = player.position;
        const formattedTimePlayed = formatTime(Math.round(timePlayed / 1000));

        const progress = (timePlayed / musicLength) * 100;

        
        const musicard = await Classic({
            thumbnailImage: track.info.thumbnail,
            backgroundColor: "#2B2D31",
            progress,
            progressColor: client.config.accentColor,
            progressBarColor: '#1F2022',
            name: track.info.title,
            nameColor: client.config.accentColor,
            author: track.info.author,
            authorColor: '#9E9E9E',
            startTime: formattedTimePlayed,
            endTime: formattedLength,
            timeColor: '#9E9E9E',
        });

        await channel
            .send({
                files: [{ attachment: musicard }],
            })
            .then((msg) => {
                player.message = msg;
                setTimeout(() => msg.delete(), 15000);
            });

        return {
            noResponse: true
        }
    },
};