const functions = require('../util/functions.js');

module.exports = {
	name: 'voiceStateUpdate',
	once: false,
	async execute(oldState, newState, client) {
		const createChannelVoice = functions.getCreateChannelVoice(client);

		if(oldState.channel != newState.channel) {
			// create custom channels
			if(!newState.member.bot) {
				if(newState.channel == createChannelVoice) {
					if(newState.member.nickname) {
						const newVoice = await newState.guild.channels.create(`${newState.member.nickname}'s Channel`, { type: 'voice', parent: createChannelVoice.parent});
						newState.member.voice.setChannel(newVoice);
					}
				}
			}
			// delete custom channels
			if(oldState.channel) {
				if(oldState.channel.parent == createChannelVoice.parent) {
					if(oldState.channel != createChannelVoice) {
						if(oldState.channel.members.size == 0) {
							oldState.channel.delete();
						}
						// leave channel event
						functions.leaveChannel(oldState.member, oldState, client);
					}
				}
			}

			// set closed on full
			if(newState.channel) {
				if(newState.channel.parent == createChannelVoice.parent) {
					if(newState.channel != createChannelVoice) {
						if(newState.channel.members >= 5) {
							if(functions.channelExists(newState.channel)) {
								functions.setClosed(newState.channel, client);
							}
						}
						// join channel event
						functions.joinChannel(newState.member, newState, client);
					}
				}
			}
		}


	},
};