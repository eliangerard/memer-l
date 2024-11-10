const express = require('express');
const { client } = require('../../services/client');
const { verifySession } = require('../middlewares/verifySession');
const { toObject } = require('../../util/toObject');
const Command = require('../../models/Command');
const music = express.Router();

music.post('/search', async (req, res) => {

    const spotify_token = req.headers.s_authorization;
    console.log(spotify_token);

    const { query } = req.query;
    const response = await fetch(`https://api.spotify.com/v1/search?q=${query}&type=track`, {
        headers: {
            authorization: `Bearer ${spotify_token}`
        }
    })
    const json = await response.json();
    res.send(json);
})

music.get('/chart', async (req, res) => {
    const response = await fetch('https://api.deezer.com/chart')
    const json = await response.json();
    res.send(json.tracks.data.filter(track => track.type === 'track'));
});

music.get('/servers', verifySession, async (req, res) => {
    console.log(req.user);
    const botServers = await client.guilds.fetch();
    const userServers = await fetch('https://discord.com/api/users/@me/guilds', {
        headers: {
            Authorization: `Bearer ${req.user.access_token}`
        }
    }).then(response => response.json());

    const similarServers = botServers.filter(server => userServers.some(userServer => userServer.id === server.id));

    res.json(toObject(similarServers));
})

music.get("/server/:id/activity", verifySession, async (req, res) => {
    const { id } = req.params;
    if (!id) return res.json(
        { activity: {} }
    );
    const activty = await Command.find({ guildId: id });
    res.json(activty);
})


music.get("/server/:id/queue", verifySession, async (req, res) => {
    const { id } = req.params;
    if (!id) return res.json(
        { songs: [] }
    );
    console.log(id);
    const guild = await client.guilds.fetch(id);
    console.log(guild.id);
    const player = client.riffy.players.get(guild.id);
    const queue = player ? [player.current.info, ...player.queue.map(
        song => song.info
    )] : null;
    console.log(queue);
    if (!queue || queue.length === 0) return res.json(
        { songs: [] }
    );
    res.json({
        currentTime: player.position,
        songs: queue
    });
})

module.exports = { music };