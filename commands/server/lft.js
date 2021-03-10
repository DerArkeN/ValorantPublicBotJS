const functions = require('../../util/functions.js');

module.exports = {
	name: 'lft',
	description: 'The all mighty looking for team command.',
	guildOnly: true,
	args: false,
	usage: '<optional message>',
	execute(msg, args) {
		const client = msg.client;
		const member = msg.member;

		if(msg.channel == functions.getLFTChannel(client)) {
			let optMsg = args.join(' ');
			functions.optMsgList[member.id] = optMsg;

			if((member.voice.channel) && (member.voice.channel.parent == functions.getCreateChannelVoice(client).parent)) {
				functions.setLFT(member, client);
			}else {
				msg.reply('you have to be in a temporary channel to use this command').then(msg => {msg.delete({timeout: 5000});});
			}
		}else{
			msg.reply(`you can't use this command here go to ${functions.getLFTChannel(client)}`).then(msg => {msg.delete({timeout: 5000});});
			msg.delete();
		}
	}
};