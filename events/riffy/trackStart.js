const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { Dynamic, Classic } = require("musicard");

module.exports = {
    name: 'trackStart',
    execute: async (player, track, payload, client) => {

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

        const musicard = await Classic({
            thumbnailImage: track.info.thumbnail,
            backgroundColor: "#2B2D31",
            progress: 0,
            progressColor: client.config.accentColor,
            progressBarColor: '#1F2022',
            name: track.info.title,
            nameColor: client.config.accentColor,
            author: track.info.author,
            authorColor: '#9E9E9E',
            startTime: '0:00',
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
    },
};