const {prefix} = require('../config.json');

module.exports = {
	name: 'message',
	execute(msg, client, valorant) {
		// Check if msg is a command and if author is no bot
		if(!msg.content.startsWith(prefix) || msg.author.bot) return;

		// Getting the commandname and the arguments from the message
		const args = msg.content.slice(prefix.length).trim().split(/ +/);
		const commandName = args.shift().toLowerCase();
    
		// Check if command exists and define it
		if(!client.commands.has(commandName)) return;
		const command = client.commands.get(commandName);

		// Check if command is guild only
		if(command.guildOnly && msg.channel.type == 'dm') return;

		// Check if command is channel only and if channel equals command channel
		if(command.channel) {
			const channel = client.channels.cache.find(c => c.name == command.channel);
			if(msg.channel != channel) {
				msg.delete();
				return msg.reply(`you can't use this command here go to ${channel}`).then(msg => {msg.delete({timeout: 5000});});
			}
		}

		// Check if arguments are given
		if(command.args && !(args.length >= command.argsLength)) {
			let reply = 'Missing arguments. ';
			if(command.usage){
				reply += `Use \`${prefix}${command.name} ${command.usage}\``;
			}
			msg.delete();
			return msg.reply(reply).then(msg => {msg.delete({timeout: 5000});});
		}
    
		// Execute command
		try{
			command.execute(msg, args, msg.client, valorant);
		}catch(error) {
			console.error(error);
		}
	}
};