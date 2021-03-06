const prefix = require('../config.json');

module.exports = {
    name: 'message',
    execute(msg) {
        const client = msg.client;
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
    
        // Check if arguments are given
        if(command.args && !args.length) {
        let reply = `Missing arguments. `;
        if(command.usage){
            reply += `Use \`${prefix}${command.name} ${command.usage}\``;
        }
        return msg.reply(reply);
        }
    
        // Execute command
        try{
        command.execute(msg, args);
        }catch(error) {
        console.error(error);
        }
    }
}