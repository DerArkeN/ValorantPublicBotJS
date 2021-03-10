require('dotenv').config();
const fs = require('fs');
const discord = require('discord.js');
const {API, Regions, Locales, Queue} = require('node-valorant-api');

const TOKEN = process.env.TOKEN;
const KEY = process.env.KEY;

const client = new discord.Client();
const valorant = new API(Regions.NA, KEY, Regions.EUROPE);

client.commands = new discord.Collection();
const commandFolders = fs.readdirSync('./commands');
const eventFiles = fs.readdirSync('./events');

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