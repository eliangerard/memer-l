const express = require('express');
const { client } = require('../services/client');
const Command = require('../models/Command');
const { io } = require('./socket');
const { verifySession } = require('../api/middlewares/verifySession');
const { EmbedBuilder } = require('discord.js');
const router = express.Router();

router.post('/command', verifySession, async (req, res) => {
    console.log(req.body);
    const { command: commandCalled, params, guildId } = req.body;
    const userId = req.user.id;
    console.log(commandCalled, params, guildId, userId);
    let command = client.commands.get(commandCalled);
    if (!command)
        command = client.commands.find(cmd => cmd.alias && cmd.alias.includes(commandCalled));

    const guild = await client.guilds.fetch(guildId);
    const user = await guild.members.fetch(userId);

    const player = client.riffy.players.get(guildId);
    const queue = player ? player.queue : null;

    const message = {
        guild,
        guildId,
        channel: queue?.textChannel ?? user?.voice?.channel,
        member: user,
        author: user,
        user,
    }

    if (command.queueDependent && !queue) {
        const embed = new EmbedBuilder()
            .setTitle(client.emotes.error + " Error")
            .setColor("#FF0000")
            .setDescription("No se está reproduciendo nada")
            .setTimestamp()
            .setFooter({ text: client.user.username, iconURL: client.botURL });

        return message.channel.send({ embeds: [embed] }).then(msg => {
            setTimeout(() => msg.delete(), 15000)
        });
    }

    // if (command.inVoice) {
    //     if (message.member.voice.channel === undefined)
    //         res.send('No estás en un canal de voz');
    //     if (command.inVoice && message.member.voice.channel && message.guild.members.me.voice.channel && message.member.voice.channel.id !== message.guild.members.me.voice.channel.id) {
    //         console.log(message.guild.members.me.voice.channel);
    //         res.send('No estás en el mismo canal de voz');
    //     }
    //     let voiceConnection;

    //     try {
    //         if (!message.guild.members.me.voice.channel)
    //             voiceConnection = await client.distube.voices.join(message.member.voice.channel);
    //         else
    //             voiceConnection = await client.distube.voices.get(message.member.voice.channel);

    //         voiceConnection?.setSelfDeaf(false);
    //     } catch (error) {
    //         console.log(error);
    //         return res.send('No se pudo conectar al canal de voz');
    //     }
    // }

    const {
        title = null,
        description = null,
        fields = [],
        image = null,
        thumbnail = null,
        react = [],
        handler = null,
        actionRows = null,
        resetTimeout = false,
        reply = true,
        deleteResponse = true,
        content = null,
        result = null
    } = await command.execute(client, queue, message, params.split(" "));

    const log = new Command({
        command: commandCalled,
        params,
        guildId,
        userId,
        botId: client.application.id
    })
    const executed = await log.save();

    if (deleteResponse) {
        console.log(executed);
        io.emit('command', executed);
        return res.json({message: 'Comando recibido', result});
    }

    if (!!content)
        return await message.channel.send(content);

    const embed = new EmbedBuilder()
        .setTitle(title)
        .setColor(client.config.accentColor)
        .setDescription(description)
        .addFields(...fields)
        .setImage(image)
        .setThumbnail(thumbnail)
        .setTimestamp()
        .setFooter({ text: client.user.username, iconURL: client.botURL ? client.botURL : client.user.avatarURL() });

    await message.channel.send({ embeds: [embed], components: actionRows }).then(msg => {
        if (react.length > 0) {
            const newHandler = (reaction, user) => handler(reaction, user, msg, queue, client, newHandler);
            react.forEach(emoji => msg.react(emoji))
            client.on('messageReactionAdd', newHandler);
        }
        else {
            if (resetTimeout) {
                const timeout = setTimeout(() => msg.delete(), 20000);
                client.timeouts[msg.id] = {
                    timeout,
                    msg
                };
            }
            setTimeout(() => msg.delete(), 15000);
        }
    });
    console.log(executed);
    io.emit('command', executed);
    return res.json({message: 'Comando recibido', result});
})

module.exports = { router };