const functions = require('../../util/functions.js');

module.exports = {
	name: 'lft',
	description: 'The all mighty looking for team command.',
	guildOnly: true,
	args: false,
	channel: 'lft-eu',
	usage: '<optional message>',
	execute(msg, args) {
		msg.delete();

		const client = msg.client;
		const member = msg.member;
		
		let optMsg = args.join(' ');
		functions.optMsgList[member.id] = optMsg;

		if((member.voice.channel) && (member.voice.channel.parent == functions.getCreateChannelVoice(client).parent)) {
			functions.setLFT(member, client);
		}else {
			msg.reply('you have to be in a temporary channel to use this command').then(msg => {msg.delete({timeout: 5000});});
		}
	}
};