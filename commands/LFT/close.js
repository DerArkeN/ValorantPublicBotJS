const functions = require('../../util/functions.js');

module.exports = {
	name: 'close',
	description: 'Close an existing lft channel.',
	guildOnly: true,
	args: false,
	channel: 'lft-eu',
	usage: '',
	execute(msg) {
		msg.delete();

		if(msg.member.voice) {
			if(functions.channelExists(msg.member.voice.channel)) {
				functions.setClosed(msg.member.voice.channel, msg.client);
			}else {
				msg.reply('you need to use !lft before using !close').then(msg => {msg.delete({timeout: 5000});});
			}
		}else{
			msg.reply('you need to use !lft before using !close').then(msg => {msg.delete({timeout: 5000});});
		}
	}
};