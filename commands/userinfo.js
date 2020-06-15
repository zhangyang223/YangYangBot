const { getUserFromMention } = require('../util/getUser')
const msgFormatter = require("../util/formatTextMsg.js");

module.exports = {
	name: 'userinfo',
	description: 'Get information about a user.',
	aliases: [],
	execute(message, client) {
		const split = message.content.split(/ +/);
		const args = split.slice(1);

		const user = getUserFromMention(args[0], client);
		msgFormatter.formatTextMsg(message.channel, null, `Name: ${user.username}, ID: ${user.id}, Avatar: ${user.displayAvatarURL({ dynamic: true })}`);

//		message.channel.send(`Name: ${user.username}, ID: ${user.id}, Avatar: ${user.displayAvatarURL({ dynamic: true })}`);
	}
};