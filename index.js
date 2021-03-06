require('dotenv').config();
const fs = require('fs');
const Discord = require('discord.js');
const {API, Regions, Locales, Queue} = require("node-valorant-api");
const sql = require("./util/sql.js")

const TOKEN = process.env.TOKEN;
const KEY = process.env.KEY;

const client = new Discord.Client({ws: {intents: ['GUILD_MEMBERS', 'GUILD_BANS', 'GUILD_VOICE_STATES', 'GUILD_PRESENCES']}});
const valorant = new API(Regions.NA, KEY, Regions.EUROPE);

client.commands = new Discord.Collection();
const commandFolders = fs.readdirSync('./commands');
const eventFiles = fs.readdirSync('./events');

console.log(sql.getPUUID(303882097947312149))

for(const file of eventFiles) {
  const event = require(`./events/${file}`);
  if(event.once){
    client.once(event.name, (...args) => event.execute(...args, client));
  }else {
    client.on(event.name, (...args) => event.execute(...args, client));
  }
}

for(const folder of commandFolders) {
  const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
  for(const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.name, command);
  }
}

client.login(TOKEN);