/* eslint-disable indent */
const functions = require('../../util/functions.js');
const discord = require('discord.js');

module.exports = {
	name: 'register',
	description: 'Register yourself with your Riot ID.',
	guildOnly: true,
	args: true,
	argsLength: 2,
	channel: 'commands',
	usage: '<RiotName#RiotTag> <@Rank>',
	execute(msg, args, client, valorant) {
		var name = '';
		var rank;
		args.forEach(element => {
			name = name + ' ' + element;
		});
		name = name.replace(args[args.length-1].toString(), '');
		rank = msg.guild.roles.cache.find(r => r.name = args[args.length-1]);
		
		if(!(typeof rank == String)) {
			const riotID = name.toString().split('#');
			const valUser = valorant.AccountV1.getAccountByRiotID(riotID[0], riotID[1]);

			console.log(valUser);
		}else {
			msg.delete();
			msg.reply('you need to mention the role like @Gold 2 or @Platinum 1').then(msg => {msg.delete({timeout: 5000});});
		}
	}
};