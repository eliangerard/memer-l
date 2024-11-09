require("dotenv").config();
const process = require('process');
const { Client, Collection, GatewayDispatchEvents } = require("discord.js");
const { Riffy } = require("riffy");
const { nodes } = require("../lavalink-hosts.json");
const { getFiles } = require("../helpers/getFiles");
const fs = require('node:fs');
const path = require('node:path');

const client = new Client({
    intents: [
        "Guilds",
        "GuildMessages",
        "GuildVoiceStates",
        "GuildMessageReactions",
        "MessageContent",
        "DirectMessages"
    ]
});

client.config = require("../config.json")
client.botURL = client.config.botURL;
client.emotes = client.config.emoji
client.timeouts = [];

client.riffy = new Riffy(client, nodes, {
    send: (payload) => {
        const guild = client.guilds.cache.get(payload.d.guild_id);
        if (guild) guild.shard.send(payload);
    },
    defaultSearchPlatform: "ytmsearch",
    restVersion: "v4"
});


client.prefix = process.env.PREFIX;

client.commands = new Collection();
const commandFiles = getFiles('commands');
console.log(commandFiles);

commandFiles.forEach(file => {
    const filePath = path.join(__dirname, '../'+file);
    const command = require(filePath);
    client.commands.set(command.data.name, command);
});

const eventsPath = path.join(__dirname, '../events/discord');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
eventFiles.forEach(file => {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
    } else {
        client.on(event.name, (...args) => event.execute(...args, client));
    }
});

const riffyPath = path.join(__dirname, '../events/riffy');
const riffyEvents = fs.readdirSync(riffyPath).filter(file => file.endsWith('.js'));
riffyEvents.forEach(file => {
    const filePath = path.join(riffyPath, file);
    const event = require(filePath);
    client.riffy.on(event.name, (...args) => {
        if(event.name === "raw")console.log(args);
        event.execute(...args, client);
    });
});

client.on("raw", (d) => {
    if (![GatewayDispatchEvents.VoiceStateUpdate, GatewayDispatchEvents.VoiceServerUpdate,].includes(d.t)) return;
    client.riffy.updateVoiceState(d);
});

module.exports = { client };