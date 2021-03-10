const sql = require('./sql.js');
const cfg = require('../config.json');
const lft = require('../commands/server/lft.js');
const discord = require('discord.js');

var valid_roles = ['Iron 1', 'Iron 2', 'Iron 3',
	'Bronze 1', 'Bronze 2', 'Bronze 3',
	'Silver 1', 'Silver 2', 'Silver 3',
	'Gold 1', 'Gold 2', 'Gold 3',
	'Platinum 1', 'Platinum 2', 'Platinum 3',
	'Diamond 1', 'Diamond 2', 'Diamond 3',
	'Immortal',
	'Radiant',];

var unvalid_roles = ['Administrator',
	'Moderator',
	'Valorant Public Bot',
	'Valorant Public Bot Test',
	'@everyone'];

var ranks_dict = {
	'Iron 1': ['Iron 1', 'Iron 2', 'Iron 3',
		'Bronze 1', 'Bronze 2', 'Bronze 3',
		'Silver 1', 'Silver 2', 'Silver 3'],
	'Iron 2': ['Iron 1', 'Iron 2', 'Iron 3',
		'Bronze 1', 'Bronze 2', 'Bronze 3',
		'Silver 1', 'Silver 2', 'Silver 3'],
	'Iron 3': ['Iron 1', 'Iron 2', 'Iron 3',
		'Bronze 1', 'Bronze 2', 'Bronze 3',
		'Silver 1', 'Silver 2', 'Silver 3'],
	'Silver 1': ['Iron 1', 'Iron 2', 'Iron 3',
		'Bronze 1', 'Bronze 2', 'Bronze 3',
		'Silver 1', 'Silver 2', 'Silver 3',
		'Gold 1', 'Gold 2', 'Gold 3'],
	'Silver 2': ['Iron 1', 'Iron 2', 'Iron 3',
		'Bronze 1', 'Bronze 2', 'Bronze 3',
		'Silver 1', 'Silver 2', 'Silver 3',
		'Gold 1', 'Gold 2', 'Gold 3'],
	'Silver 3': ['Iron 1', 'Iron 2', 'Iron 3',
		'Bronze 1', 'Bronze 2', 'Bronze 3',
		'Silver 1', 'Silver 2', 'Silver 3',
		'Gold 1', 'Gold 2', 'Gold 3'],
	'Gold 1': ['Silver 1', 'Silver 2', 'Silver 3',
		'Gold 1', 'Gold 2', 'Gold 3',
		'Platinum 1', 'Platinum 2', 'Platinum 3'],
	'Gold 2': ['Silver 1', 'Silver 2', 'Silver 3',
		'Gold 1', 'Gold 2', 'Gold 3',
		'Platinum 1', 'Platinum 2', 'Platinum 3'],
	'Gold 3': ['Silver 1', 'Silver 2', 'Silver 3',
		'Gold 1', 'Gold 2', 'Gold 3',
		'Platinum 1', 'Platinum 2', 'Platinum 3'],
	'Platinum 1': ['Gold 1', 'Gold 2', 'Gold 3',
		'Platinum 1', 'Platinum 2', 'Platinum 3',
		'Diamond 1'],
	'Platinum 2': ['Gold 1', 'Gold 2', 'Gold 3',
		'Platinum 1', 'Platinum 2', 'Platinum 3',
		'Diamond 1', 'Diamond 2'],
	'Platinum 3': ['Gold 1', 'Gold 2', 'Gold 3',
		'Platinum 1', 'Platinum 2', 'Platinum 3',
		'Diamond 1', 'Platinum 3'],
	'Diamond 1': ['Platinum 1', 'Platinum 2', 'Platinum 3',
		'Diamond 1', 'Diamond 2', 'Diamond 3',
		'Immortal'],     
	'Diamond 2': ['Platinum 2', 'Platinum 3',
		'Diamond 1', 'Diamond 2', 'Diamond 3',
		'Immortal'],
	'Diamond 3': ['Platinum 3',
		'Diamond 1', 'Diamond 2', 'Diamond 3',
		'Immortal'],
	'Immortal': ['Diamond 1', 'Diamond 2', 'Diamond 3',
		'Immortal',
		'Radiant'],
	'Radiant': ['Immortal', 'Radiant']};

var lftData = [];
var inviteFROMembed = [];
exports.optMsgList = [];

exports.insertLFTData = function(executor, message, channel) {
	lftData[executor.id] = ['foo', message.id, channel.id];
	lftData[message.id] = [executor.id, 'foo', channel.id];
	lftData[channel.id] = [executor.id, message.id, 'foo'];
};

exports.deleteLFTData = function(executor, message, channel) {
	delete lftData[executor.id];
	delete lftData[message.id];
	delete lftData[channel.id];
};

exports.getExecutor = function(messageORchannel, client) {
	const data = lftData[messageORchannel.id];
	if(!data) return;
	return this.getGuild(client).members.cache.find(user => user.id === data[0]);
};

exports.getMessage = function(executorORchannel, client) {
	const data = lftData[executorORchannel.id];
	if(!data) return;
	const lftChannel = this.getLFTChannel(client);
	return lftChannel.messages.cache.get(data[1]);
};

exports.getChannel = function(executorORmessage, client) {
	const data = lftData[executorORmessage.id];
	if(!data) return;
	return client.channels.cache.get(data[2]);
};

exports.setLFT = async function(executor, client) {
	if(!(executor.id in lftData)) {
		let channel = executor.voice.channel;
		let lftChannel = this.getLFTChannel(client);

		channel.overwritePermissions([{id: this.getEveryoneRole(client).id, deny: ['CONNECT']}]);
		let message = lftChannel.send(await this.createEmbed(executor));
		message.then((value) => {
			this.insertLFTData(executor, value, channel);
		});
	}
};

exports.setClosed = function(channel, client) {
	let message = this.getMessage(channel, client);
	let executor = this.getExecutor(channel, client);

	channel.overwritePermissions([{id: this.getEveryoneRole(client).id, deny: ['CONNECT']}]);
	message.delete();
	this.deleteLFTData(executor, message, channel);
	if(!inviteFROMembed[message.embeds[0].url]) {
		inviteFROMembed[message.embeds[0].url].delete();
	}
};

exports.setCasual = function(channel, client) {
	let message = this.getMessage(channel, client);
	let executor = this.getExecutor(channel, client);

	message.delete();
	this.deleteLFTData(executor, message, channel);
	if(!inviteFROMembed[message.embeds[0].url]) {
		inviteFROMembed[message.embeds[0].url].delete();
	}
	if(channel.members.size != 0) {
		channel.overwritePermissions(this.getEveryoneRole(client), {'CONNECT': true});
	}
};

exports.createEmbed = async function(executor) {
	let channel = executor.voice.channel;
	this.optMsg = this.optMsgList[executor.id];
	let invite = await channel.createInvite({maxAge: 15 * 60});

	let embed = await new discord.MessageEmbed()
		.setColor('#0x00ff00')
		.setTitle(`${executor.nickname} is looking for teammates`)
		.setDescription(`${executor} is looking for teammates: ${this.optMsg}`)
		.addFields(
			{name: 'Rank:', value: this.getRank(executor)},
			{name: 'Players:', value: `${channel.members.size.toString()}/5`},
			{name: 'Join Voice:', value: `[Click to join](${invite})`}
		);
	inviteFROMembed[embed.url] = invite;
	return await embed;
};

exports.getRank = function(member) {
	let memberRoles = member.roles.cache;
	let memberRolesName = [];
	memberRoles.forEach(memberRole => {
		memberRolesName.push(memberRole.name);
	});
	const memberRankName = memberRolesName.filter((i) => {
		return !unvalid_roles.includes(i);
	});
	if(memberRankName) {
		const rank = member.guild.roles.cache.find(r => r.name === memberRankName[0]);
		return rank;
	}
	return false;
};

exports.checkProfile = function(member, valorant) {
	if(this.getRank(member)) {
		if(member.nickname) {
			if(!member.bot) {
				if(sql.userExistsByID(member.id)) {
					const valPUUID = sql.getPUUIDByID(member.id);

					const valUser = valorant.getAccountByPuuid(valPUUID);
					const valTag = valUser.tagLine;
					const valName = valUser.gameName;

					const nick = member.nickname;

					const x = nick.split('#');
					const dcName = x[0];
					const dcTag = x[1];

					if(dcTag == valTag) {
						sql.updateTag(member.id, valTag);
						member.setNickname(`${valName}#${valTag}`);
					}
					if(dcName == valName) {
						sql.updateName(member.id, valName);
						member.setNickname(`${valName}#${valTag}`);
					}
				}
			}
		}
	}
};

exports.rank_allowed = function(member, channel) {
	const memberRank = this.getRank(member).name;
	const channelMembers = channel.members;
    
	function all(iterable){
		for(var index = 0; index < iterable.length; index++) {
			if(!iterable) return false;
		}
		return true;
	}

	if(all(channelMembers.forEach(channelMember => {ranks_dict[this.getRank(channelMember).name].includes(memberRank);}))) return true;
	return false;
};

exports.leaveChannel = async function(member, oldState, client) {
	if(member.nickname) {
		if(this.getChannel(oldState.channel, client)) {
			if(this.getExecutor(oldState.channel, client) == member) {
				const lftAuthor = this.getExecutor(oldState.channel, client);
				const message = this.getMessage(oldState.channel, client);
				
				message.edit(await this.createEmbed(lftAuthor));
			}
		}else {
			if(this.getExecutor(oldState.channel, client) == member) {
				this.setCasual(oldState.channel, client);
			}
		}
	}
};

exports.joinChannel = async function(member, newState, client) {
	if(this.getChannel(newState.channel, client)) {
		if(!(this.rank_allowed(member, newState.channel))) {
			member.voice.setChannel(null);
			this.getSupportChannel(client).send(`${member}, you are not able to play with users in this channel since the rank difference is too high.`).then(msg => {
				msg.delete(10000);
			});
		}else{
			const message = this.getMessage(member.voice.channel, client);
			const executor = this.getExecutor(member.voice.channel, client);

			message.edit(await this.createEmbed(executor));
		}
	}
};

exports.getSupportChannel = function(client) {
	const id = cfg.channel_support;
	return client.channels.cache.get(id);
};

exports.getCommandsChannel = function(client) {
	const id = cfg.channel_commands;
	return client.channels.cache.get(id);
};

exports.getLFTChannel = function(client) {
	const id = cfg.channel_lft;
	return client.channels.cache.get(id);
};

exports.getRulesChannel = function(client) {
	const id = cfg.channel_rules;
	return client.channels.cache.get(id);
};

exports.getCreateChannelVoice = function(client) {
	const id = cfg.voice_create_channel;
	return client.channels.cache.get(id);
};

exports.getWTFVoice = function(client) {
	const id = cfg.voice_wtf;
	return client.channels.cache.get(id);
};

exports.getEveryoneRole = function(client) {
	return this.getGuild(client).roles.cache.find(r => r.name === '@everyone');
};

exports.getGuild = function(client) {
	const id = cfg.guild;
	return client.guilds.cache.get(id);
};