const { EmbedBuilder } = require("discord.js");

module.exports = {
    name: 'messageCreate',
    execute: async (message, client) => {
        if (!message.content.startsWith(client.prefix) || message.author.bot) return;

        const args = message.content.slice(1).trim().split(" ");
        const commandCalled = args.shift().toLowerCase();
        let command = client.commands.get(commandCalled.toLowerCase());

        if (!command)
            command = client.commands.find(cmd => cmd.alias && cmd.alias.includes(commandCalled.toLowerCase()));

        if (!command && client.config.prefix.length > 0)
            return message.reply("No hay comando de esos");

        if (!command && client.config.prefix.length == 0)
            return;

        if (!!command.deleteInvocation || command.deleteInvocation === undefined)
            setTimeout(() => message.delete(), 15000);

        const player = client.riffy.players.get(message.guild.id);
        const queue = player ? player.queue : null;

        if (command.queueDependent && !queue) {
            const embed = new EmbedBuilder()
                .setTitle(client.emotes.error + " Error")
                .setColor("#FF0000")
                .setDescription("No se está reproduciendo nada")
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.botURL });

            return message.reply({ embeds: [embed] }).then(msg => {
                setTimeout(() => msg.delete(), 15000)
            });
        }

        try {

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
                noResponse = false
            } = await command.execute(client, queue, message, args);

            if (noResponse)
                return;

            if (!!content)
                return await message.channel.send(content).then(msg => {
                    if (deleteResponse)
                        setTimeout(() => msg.delete(), 15000)
                }
                );

            const embed = new EmbedBuilder()
                .setTitle(title)
                .setColor(client.config.accentColor)
                .setDescription(description)
                .addFields(...fields)
                .setImage(image)
                .setThumbnail(thumbnail)
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.botURL ? client.botURL : client.user.avatarURL() });

            if (reply)
                await message.reply({ embeds: [embed], components: actionRows }).then(msg => {
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
                        if (deleteResponse)
                            setTimeout(() => msg.delete(), 15000);
                    }
                });
            else {
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
            }
        } catch (error) {
            console.error(error);
            const embed = new EmbedBuilder()
                .setTitle(client.emotes.error + " Error")
                .setColor("#FF0000")
                .setDescription("Descripción: " + error)
                .setTimestamp()
                .setFooter({ text: client.user.username, iconURL: client.botURL });
            await message.reply({ embeds: [embed] });
        }
    },
};